export interface StudySet {
  id: string
  title: string
  description?: string
  totalItems: number
  studiedItems: number
  createdAt: Date
  updatedAt: Date
  flashcards: Flashcard[]
  quizzes: Quiz[]
}

export interface Flashcard {
  id: string
  front: string
  back: string
  difficulty: 'easy' | 'medium' | 'hard'
  lastReviewed?: Date
  reviewCount: number
  correctCount: number
  source?: string
}

export interface Quiz {
  id: string
  title: string
  questions: Question[]
  totalQuestions: number
  completedQuestions: number
  score?: number
  createdAt: Date
}

export interface Question {
  id: string
  text: string
  type: 'multiple-choice' | 'true-false' | 'open-ended'
  options?: string[]
  correctAnswer: string | number | boolean
  explanation?: string
  source?: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  content: string
  uploadedAt: Date
  processed: boolean
}

export interface Progress {
  studySetId: string
  totalCards: number
  studiedCards: number
  correctAnswers: number
  totalAnswers: number
  streak: number
  lastStudyDate?: Date
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}