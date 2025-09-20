import React, { useState, useEffect } from 'react'
import { ArrowLeft, RotateCcw, BarChart3, Settings } from 'lucide-react'
import Flashcard from '../components/Flashcard'
import QuizQuestion from '../components/QuizQuestion'
import { StudySet } from '../types'

type StudyMode = 'flashcards' | 'quiz'

interface StudyPageProps {
  currentStudySet: StudySet | null
  onBack: () => void
}

export default function StudyPage({ currentStudySet, onBack }: StudyPageProps) {
  const [studyMode, setStudyMode] = useState<StudyMode>('flashcards')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalAnswers, setTotalAnswers] = useState(0)
  const [showStats, setShowStats] = useState(false)

  const currentFlashcard = currentStudySet?.flashcards[currentCardIndex]
  const currentQuestion = currentStudySet?.quizzes[0]?.questions[currentQuestionIndex]

  useEffect(() => {
    // Reset when study set changes
    setCurrentCardIndex(0)
    setCurrentQuestionIndex(0)
    setCorrectAnswers(0)
    setTotalAnswers(0)
  }, [currentStudySet])

  const handleFlashcardAnswer = (correct: boolean) => {
    setTotalAnswers(prev => prev + 1)
    if (correct) {
      setCorrectAnswers(prev => prev + 1)
    }
    
    // Move to next card after a delay
    setTimeout(() => {
      if (currentStudySet && currentCardIndex < currentStudySet.flashcards.length - 1) {
        setCurrentCardIndex(prev => prev + 1)
      } else {
        setShowStats(true)
      }
    }, 2000)
  }

  const handleQuizAnswer = (selectedAnswer: string | boolean, isCorrect: boolean) => {
    setTotalAnswers(prev => prev + 1)
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentStudySet?.quizzes[0] && currentQuestionIndex < currentStudySet.quizzes[0].questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setShowStats(true)
    }
  }

  const restartSession = () => {
    setCurrentCardIndex(0)
    setCurrentQuestionIndex(0)
    setCorrectAnswers(0)
    setTotalAnswers(0)
    setShowStats(false)
  }


  if (!currentStudySet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Study Set Selected</h2>
          <button onClick={onBack} className="jungle-button">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const accuracy = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {currentStudySet.title}
                </h1>
                <p className="text-sm text-gray-500">
                  {studyMode === 'flashcards' ? 'Flashcards' : 'Quiz'} Mode
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowStats(!showStats)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-gray-600">
              {studyMode === 'flashcards' 
                ? `Card ${currentCardIndex + 1} of ${currentStudySet.flashcards.length}`
                : `Question ${currentQuestionIndex + 1} of ${currentStudySet.quizzes[0]?.questions.length || 0}`
              }
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-jungle-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: studyMode === 'flashcards'
                      ? `${((currentCardIndex + 1) / currentStudySet.flashcards.length) * 100}%`
                      : `${((currentQuestionIndex + 1) / (currentStudySet.quizzes[0]?.questions.length || 1)) * 100}%`
                  }}
                />
              </div>
              <span className="text-sm text-gray-600">{accuracy}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showStats ? (
          /* Stats View */
          <div className="jungle-card text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Study Session Complete!</h2>
            
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <div className="text-3xl font-bold text-jungle-600 mb-2">
                  {totalAnswers}
                </div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {correctAnswers}
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {accuracy}%
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={restartSession}
                className="jungle-button flex items-center space-x-2 mx-auto"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Study Again</span>
              </button>
              <button
                onClick={onBack}
                className="jungle-button-secondary flex items-center space-x-2 mx-auto"
              >
                <span>Back to Study Sets</span>
              </button>
            </div>
          </div>
        ) : (
          /* Study Content */
          <div>
            {studyMode === 'flashcards' && currentFlashcard ? (
              <Flashcard
                flashcard={currentFlashcard}
                onAnswer={handleFlashcardAnswer}
                isLast={currentCardIndex === currentStudySet.flashcards.length - 1}
              />
            ) : studyMode === 'quiz' && currentQuestion ? (
              <QuizQuestion
                question={currentQuestion}
                onAnswer={handleQuizAnswer}
                onNext={handleNextQuestion}
                explanation={currentQuestion.explanation}
              />
            ) : (
              <div className="jungle-card text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No content available
                </h3>
                <p className="text-gray-600">
                  This study set doesn't have any {studyMode} yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mode Toggle */}
      {!showStats && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200">
            <div className="flex">
              <button
                onClick={() => setStudyMode('flashcards')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  studyMode === 'flashcards'
                    ? 'bg-jungle-500 text-white'
                    : 'text-gray-600 hover:text-jungle-600'
                }`}
              >
                Flashcards
              </button>
              <button
                onClick={() => setStudyMode('quiz')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  studyMode === 'quiz'
                    ? 'bg-jungle-500 text-white'
                    : 'text-gray-600 hover:text-jungle-600'
                }`}
              >
                Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}