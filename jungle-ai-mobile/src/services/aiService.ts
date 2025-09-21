import { GoogleGenerativeAI } from '@google/generative-ai'
import { Flashcard, Question } from '../types'

class AIService {
  private genAI: GoogleGenerativeAI | null = null
  private model: any = null

  private initializeModel() {
    if (this.model) return // Already initialized

    // For mobile, we'll use a simple API key storage
    const apiKey = 'AIzaSyBhdr73u9yk2FjNs2g2cvsGmtaz9Wa-ekA'
    if (!apiKey) {
      throw new Error('Gemini API key not found. Please set up your API key.')
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  }

  async generateFlashcards(content: string, count: number = 10): Promise<Flashcard[]> {
    try {
      this.initializeModel()
      const prompt = `
        Generate ${count} educational flashcards from the following content. 
        Each flashcard should have a clear, concise question on the front and a detailed, accurate answer on the back.
        
        Content: ${content}
        
        Return the response in the following JSON format:
        {
          "flashcards": [
            {
              "front": "Question text",
              "back": "Answer text",
              "difficulty": "easy|medium|hard",
              "source": "Chapter or section reference"
            }
          ]
        }
        
        Make sure the flashcards cover the most important concepts from the content.
      `

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Could not parse AI response')
      }
      
      const parsed = JSON.parse(jsonMatch[0])
      const flashcards = parsed.flashcards.map((card: any, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        front: card.front,
        back: card.back,
        difficulty: card.difficulty || 'medium',
        reviewCount: 0,
        correctCount: 0,
        source: card.source || 'AI Generated'
      }))
      
      return flashcards
    } catch (error) {
      console.error('Error generating flashcards:', error)
      throw new Error('Failed to generate flashcards. Please try again.')
    }
  }

  async generateQuiz(content: string, questionCount: number = 5): Promise<Question[]> {
    try {
      this.initializeModel()
      const prompt = `
        Generate ${questionCount} quiz questions from the following content.
        Mix multiple choice and true/false questions. Focus on testing understanding of key concepts.
        
        Content: ${content}
        
        Return the response in the following JSON format:
        {
          "questions": [
            {
              "text": "Question text",
              "type": "multiple-choice|true-false",
              "options": ["Option A", "Option B", "Option C", "Option D"] (only for multiple-choice),
              "correctAnswer": "correct option or true/false",
              "explanation": "Why this answer is correct",
              "difficulty": "easy|medium|hard",
              "source": "Chapter or section reference"
            }
          ]
        }
        
        Make sure questions test understanding, not just memorization.
      `

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Could not parse AI response')
      }
      
      const parsed = JSON.parse(jsonMatch[0])
      const questions = parsed.questions.map((q: any, index: number) => ({
        id: `ai-quiz-${Date.now()}-${index}`,
        text: q.text,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty || 'medium',
        source: q.source || 'AI Generated'
      }))
      
      return questions
    } catch (error) {
      console.error('Error generating quiz:', error)
      throw new Error('Failed to generate quiz. Please try again.')
    }
  }

  async chatWithAI(message: string, context?: string): Promise<string> {
    try {
      this.initializeModel()
      let prompt = message
      
      if (context) {
        prompt = `
          Context from study material: ${context}
          
          User question: ${message}
          
          Please provide a helpful, educational response based on the context. If the question is not related to the context, provide general educational assistance.
        `
      }

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      return text
    } catch (error) {
      console.error('Error in AI chat:', error)
      return "I'm sorry, I'm having trouble responding right now. Please try again later."
    }
  }

  async summarizeContent(content: string): Promise<string> {
    try {
      this.initializeModel()
      const prompt = `
        Please provide a concise summary of the following content, highlighting the key concepts and main points:
        
        ${content}
        
        Keep the summary clear and educational, focusing on the most important information.
      `

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      return text
    } catch (error) {
      console.error('Error summarizing content:', error)
      throw new Error('Failed to summarize content. Please try again.')
    }
  }
}

// Export singleton instance
export const aiService = new AIService()
export default aiService