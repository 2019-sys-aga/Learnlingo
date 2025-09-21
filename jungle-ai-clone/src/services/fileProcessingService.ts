import { aiService } from './aiService'
import { StudySet, Flashcard, Quiz } from '../types'
import { generateId } from '../lib/utils'

export class FileProcessingService {
  async processUploadedFiles(files: any[]): Promise<StudySet> {
    try {
      // Combine all file contents
      const allContent = files
        .filter(file => file.processed && file.content)
        .map(file => file.content)
        .join('\n\n---\n\n')

      if (!allContent.trim()) {
        throw new Error('No content found in uploaded files')
      }

      // Generate flashcards and quiz questions using AI
      const [flashcards, questions] = await Promise.all([
        aiService.generateFlashcards(allContent, 15),
        aiService.generateQuiz(allContent, 8)
      ])

      // Create a new study set
      const studySet: StudySet = {
        id: generateId(),
        title: this.generateTitle(files),
        description: 'Generated from uploaded materials using AI',
        totalItems: flashcards.length + questions.length,
        studiedItems: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        flashcards,
        quizzes: [
          {
            id: generateId(),
            title: 'AI Generated Quiz',
            totalQuestions: questions.length,
            completedQuestions: 0,
            createdAt: new Date(),
            questions
          }
        ]
      }

      return studySet
    } catch (error) {
      console.error('Error processing files:', error)
      throw new Error('Failed to process uploaded files. Please try again.')
    }
  }

  private generateTitle(files: any[]): string {
    if (files.length === 1) {
      const fileName = files[0].name
      const baseName = fileName.replace(/\.[^/.]+$/, '') // Remove extension
      return `${baseName} Study Set`
    }
    
    return `Study Set ${new Date().toLocaleDateString()}`
  }

  async generateMoreFlashcards(content: string, existingCount: number): Promise<Flashcard[]> {
    try {
      const additionalCount = Math.min(10, 20 - existingCount) // Max 20 total flashcards
      if (additionalCount <= 0) {
        return []
      }

      return await aiService.generateFlashcards(content, additionalCount)
    } catch (error) {
      console.error('Error generating additional flashcards:', error)
      throw new Error('Failed to generate additional flashcards.')
    }
  }

  async generateMoreQuestions(content: string, existingCount: number): Promise<any[]> {
    try {
      const additionalCount = Math.min(5, 15 - existingCount) // Max 15 total questions
      if (additionalCount <= 0) {
        return []
      }

      return await aiService.generateQuiz(content, additionalCount)
    } catch (error) {
      console.error('Error generating additional questions:', error)
      throw new Error('Failed to generate additional questions.')
    }
  }

  async summarizeContent(content: string): Promise<string> {
    try {
      return await aiService.summarizeContent(content)
    } catch (error) {
      console.error('Error summarizing content:', error)
      throw new Error('Failed to summarize content.')
    }
  }

  async explainConcept(concept: string, content: string): Promise<string> {
    try {
      return await aiService.explainConcept(concept, content)
    } catch (error) {
      console.error('Error explaining concept:', error)
      throw new Error('Failed to explain concept.')
    }
  }
}

export const fileProcessingService = new FileProcessingService()
export default fileProcessingService