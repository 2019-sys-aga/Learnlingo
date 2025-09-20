import React, { useState } from 'react'
import { CheckCircle, XCircle, MessageCircle, ThumbsUp, ThumbsDown, Copy, Share } from 'lucide-react'
import { Question } from '../types'
import { cn } from '../lib/utils'

interface QuizQuestionProps {
  question: Question
  onAnswer: (selectedAnswer: string | boolean, isCorrect: boolean) => void
  onNext: () => void
  showExplanation?: boolean
  explanation?: string
}

export default function QuizQuestion({ 
  question, 
  onAnswer, 
  onNext, 
  showExplanation = false,
  explanation 
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | boolean | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleAnswerSelect = (answer: string | boolean) => {
    if (showResult) return
    
    setSelectedAnswer(answer)
    const correct = answer === question.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)
    onAnswer(answer, correct)
  }

  const handleNext = () => {
    setSelectedAnswer(null)
    setShowResult(false)
    setIsCorrect(false)
    onNext()
  }

  const getAnswerOptionClass = (option: string, index: number) => {
    if (!showResult) {
      return selectedAnswer === option 
        ? "answer-option selected"
        : "answer-option"
    }

    if (option === question.correctAnswer) {
      return "answer-option correct"
    }

    if (selectedAnswer === option && !isCorrect) {
      return "answer-option incorrect"
    }

    return "answer-option"
  }

  const getTrueFalseClass = (value: boolean) => {
    if (!showResult) {
      return selectedAnswer === value 
        ? "answer-option selected"
        : "answer-option"
    }

    if (value === question.correctAnswer) {
      return "answer-option correct"
    }

    if (selectedAnswer === value && !isCorrect) {
      return "answer-option incorrect"
    }

    return "answer-option"
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <XCircle className="w-6 h-6" />
          </button>
          <div className="flex-1 mx-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-jungle-500 h-2 rounded-full transition-all duration-300" style={{ width: '45%' }} />
            </div>
          </div>
          <span className="text-sm text-gray-500">3/7</span>
        </div>
      </div>

      {/* Question */}
      <div className="question-card mb-6">
        <h2 className="text-xl font-medium text-gray-900 leading-relaxed">
          {question.text}
        </h2>
        {question.source && (
          <div className="flex items-center space-x-2 mt-3 text-sm text-gray-500">
            <span>from {question.source}</span>
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-3 mb-6">
        {question.type === 'multiple-choice' && question.options ? (
          question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={cn("w-full text-left", getAnswerOptionClass(option, index))}
              disabled={showResult}
            >
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-700">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="flex-1">{option}</span>
                {showResult && option === question.correctAnswer && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {showResult && selectedAnswer === option && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </button>
          ))
        ) : question.type === 'true-false' ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleAnswerSelect(true)}
              className={cn("text-center", getTrueFalseClass(true))}
              disabled={showResult}
            >
              <div className="flex flex-col items-center space-y-2">
                <CheckCircle className="w-6 h-6" />
                <span className="font-medium">True</span>
              </div>
            </button>
            <button
              onClick={() => handleAnswerSelect(false)}
              className={cn("text-center", getTrueFalseClass(false))}
              disabled={showResult}
            >
              <div className="flex flex-col items-center space-y-2">
                <XCircle className="w-6 h-6" />
                <span className="font-medium">False</span>
              </div>
            </button>
          </div>
        ) : null}
      </div>

      {/* Result and Explanation */}
      {showResult && (
        <div className="jungle-card mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              isCorrect ? "bg-green-100" : "bg-red-100"
            )}>
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {isCorrect ? 'Correct!' : 'Not quite right'}
            </h3>
          </div>

          {explanation && (
            <p className="text-gray-700 mb-4">{explanation}</p>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-jungle-600 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span>Good</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors">
                <ThumbsDown className="w-4 h-4" />
                <span>Bad</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-jungle-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>Comment</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-jungle-600 transition-colors">
                <Copy className="w-4 h-4" />
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-jungle-600 transition-colors">
                <Share className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Next Button */}
      {showResult && (
        <div className="text-center">
          <button
            onClick={handleNext}
            className="jungle-button flex items-center space-x-2 mx-auto"
          >
            <span>Next Question</span>
          </button>
        </div>
      )}
    </div>
  )
}