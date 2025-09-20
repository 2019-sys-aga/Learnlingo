import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import dotenv from 'dotenv';
import pdf from 'pdf-parse';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '../generated/prisma';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function extractTextFromPdf(filePath: string): Promise<string> {
	const data = await pdf(fs.readFileSync(filePath));
	return data.text || '';
}

function safeJson<T>(text: string): T | null {
	try {
		return JSON.parse(text) as T;
	} catch {
		return null;
	}
}

app.get('/health', async (_req, res) => {
	res.json({ ok: true });
});

app.post('/api/decks', async (req, res) => {
	const body = z.object({ title: z.string().min(1), description: z.string().optional(), ownerId: z.string().optional() }).parse(req.body);
	const deck = await prisma.deck.create({ data: { title: body.title, description: body.description, ownerId: body.ownerId ?? 'anonymous' } });
	res.json(deck);
});

app.get('/api/decks', async (_req, res) => {
	const decks = await prisma.deck.findMany({ orderBy: { updatedAt: 'desc' } });
	res.json(decks);
});

app.get('/api/decks/:deckId', async (req, res) => {
	const deck = await prisma.deck.findUnique({ where: { id: req.params.deckId }, include: { cards: true, uploads: true } });
	if (!deck) return res.status(404).json({ error: 'Deck not found' });
	res.json(deck);
});

app.post('/api/decks/:deckId/upload', upload.single('file'), async (req, res) => {
	const { deckId } = req.params;
	if (!req.file) return res.status(400).json({ error: 'No file' });
	const deck = await prisma.deck.findUnique({ where: { id: deckId } });
	if (!deck) return res.status(404).json({ error: 'Deck not found' });
	let textContent: string | undefined;
	if (req.file.mimetype === 'application/pdf') {
		textContent = await extractTextFromPdf(req.file.path);
	}
	const uploadRec = await prisma.upload.create({ data: { deckId, filename: req.file.originalname, mimetype: req.file.mimetype, filepath: req.file.path, textContent } });
	res.json(uploadRec);
});

app.post('/api/decks/:deckId/generate', async (req, res) => {
	const { deckId } = req.params;
	const deck = await prisma.deck.findUnique({ where: { id: deckId }, include: { uploads: true, cards: true } });
	if (!deck) return res.status(404).json({ error: 'Deck not found' });
	const corpus = deck.uploads.map(u => u.textContent).filter(Boolean).join('\n\n').slice(0, 150_000);
	if (!process.env.GEMINI_API_KEY) return res.status(400).json({ error: 'Missing GEMINI_API_KEY' });
	const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
	const prompt = `You are a study assistant. Create 20 multiple-choice flashcards from the following study text. Return STRICT JSON with key \"cards\" as an array of objects with fields: question (string), choices (array of 4 strings), correctIndex (0-3), explanation (string). Keep questions concise.\n\nSTUDY TEXT:\n${corpus}`;
	const result = await model.generateContent(prompt);
	const text = result.response.text();
	const json = safeJson<{ cards: { question: string; choices: string[]; correctIndex: number; explanation?: string }[] }>(text);
	if (!json) return res.status(400).json({ error: 'AI did not return JSON', text });
	const created = await prisma.$transaction(json.cards.map(c => prisma.card.create({ data: { deckId, type: 'mcq', question: c.question, answer: c.choices[c.correctIndex], explanation: c.explanation, choicesJson: JSON.stringify(c.choices), correctKey: String(c.correctIndex) } })));
	res.json({ added: created.length });
});

app.post('/api/chat', async (req, res) => {
	const body = z.object({ deckId: z.string(), message: z.string().min(1), cardId: z.string().optional(), sessionId: z.string().optional() }).parse(req.body);
	const deck = await prisma.deck.findUnique({ where: { id: body.deckId }, include: { uploads: true, cards: true } });
	if (!deck) return res.status(404).json({ error: 'Deck not found' });
	const context = deck.uploads.map(u => u.textContent).filter(Boolean).join('\n\n').slice(0, 80_000);
	const questionContext = body.cardId ? deck.cards.find(c => c.id === body.cardId) : undefined;
	const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
	const prompt = `You are explaining study concepts to a learner. Use the provided deck context. If a question is about a specific flashcard, focus on it. Keep answers crisp and helpful.\n\nDECK CONTEXT:\n${context}\n\nFLASHCARD (optional):\n${questionContext ? `Q: ${questionContext.question}\nA: ${questionContext.answer}\n` : ''}\n\nUser: ${body.message}`;
	const result = await model.generateContent(prompt);
	const reply = result.response.text();
	await prisma.chatMessage.create({ data: { deckId: body.deckId, role: 'user', content: body.message, cardId: body.cardId, sessionId: body.sessionId } });
	const saved = await prisma.chatMessage.create({ data: { deckId: body.deckId, role: 'assistant', content: reply, cardId: body.cardId, sessionId: body.sessionId } });
	res.json(saved);
});

app.post('/api/quiz/start', async (req, res) => {
	const body = z.object({ deckId: z.string() }).parse(req.body);
	const deck = await prisma.deck.findUnique({ where: { id: body.deckId }, include: { cards: true } });
	if (!deck) return res.status(404).json({ error: 'Deck not found' });
	const session = await prisma.quizSession.create({ data: { deckId: body.deckId, total: deck.cards.length } });
	res.json({ sessionId: session.id });
});

app.get('/api/quiz/:sessionId/next', async (req, res) => {
	const session = await prisma.quizSession.findUnique({ where: { id: req.params.sessionId }, include: { deck: { include: { cards: true } } } });
	if (!session) return res.status(404).json({ error: 'Session not found' });
	const idx = session.currentIdx;
	const card = (session.deck as any).cards[idx];
	if (!card) return res.json({ done: true, score: session.numCorrect, total: session.total });
	res.json({ card: { id: card.id, type: card.type, question: card.question, choices: card.choicesJson ? JSON.parse(card.choicesJson) : undefined } });
});

app.post('/api/quiz/:sessionId/answer', async (req, res) => {
	const body = z.object({ cardId: z.string(), userAnswer: z.string() }).parse(req.body);
	const session = await prisma.quizSession.findUnique({ where: { id: req.params.sessionId } });
	if (!session) return res.status(404).json({ error: 'Session not found' });
	const card = await prisma.card.findUnique({ where: { id: body.cardId } });
	if (!card) return res.status(404).json({ error: 'Card not found' });
	const isCorrect = card.type === 'mcq' ? body.userAnswer === card.correctKey : body.userAnswer.trim().toLowerCase() === (card.answer || '').trim().toLowerCase();
	await prisma.quizAnswer.create({ data: { sessionId: session.id, cardId: card.id, userAnswer: body.userAnswer, isCorrect, feedback: card.explanation || null } });
	const updated = await prisma.quizSession.update({ where: { id: session.id }, data: { currentIdx: { increment: 1 }, numCorrect: { increment: isCorrect ? 1 : 0 } } });
	res.json({ isCorrect, explanation: card.explanation, progress: { current: updated.currentIdx, total: updated.total, correct: updated.numCorrect } });
});

const port = Number(process.env.PORT || 8787);
app.listen(port, async () => {
	await prisma.$connect();
	console.log(`API listening on :${port}`);
});