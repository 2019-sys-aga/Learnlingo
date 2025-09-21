import React, { useState } from 'react'
import { RotateCcw, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import { Flashcard as FlashcardType } from '../types'
import { cn } from '../lib/utils'

interface FlashcardProps {
  flashcard: FlashcardType
  onAnswer: (correct: boolean) => void
  isLast?: boolean
}

export default function Flashcard({ flashcard, onAnswer, isLast = false }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [userAnswer, setUserAnswer] = useState<'correct' | 'incorrect' | null>(null)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleReveal = () => {
    setShowAnswer(true)
  }

  const handleAnswer = (correct: boolean) => {
    setUserAnswer(correct ? 'correct' : 'incorrect')
    onAnswer(correct)
  }

  const resetCard = () => {
    setIsFlipped(false)
    setShowAnswer(false)
    setUserAnswer(null)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Card */}
      <div 
        className={cn(
          "relative w-full h-80 cursor-pointer perspective-1000",
          "transform-gpu transition-transform duration-700",
          isFlipped && "rotate-y-180"
        )}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <div className={cn(
          "absolute inset-0 w-full h-full backface-hidden",
          "jungle-card flex items-center justify-center p-8",
          !isFlipped ? "z-10" : "z-0"
        )}>
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-jungle-100 rounded-full flex items-center justify-center mx-auto">
              <Eye className="w-6 h-6 text-jungle-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Question</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              {flashcard.front}
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Click to flip the card
            </p>
          </div>
        </div>

        {/* Back of card */}
        <div className={cn(
          "absolute inset-0 w-full h-full backface-hidden rotate-y-180",
          "jungle-card flex items-center justify-center p-8",
          isFlipped ? "z-10" : "z-0"
        )}>
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-leaf-100 rounded-full flex items-center justify-center mx-auto">
              <EyeOff className="w-6 h-6 text-leaf-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Answer</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              {flashcard.back}
            </p>
            {flashcard.source && (
              <p className="text-xs text-gray-500 mt-4">
                Source: {flashcard.source}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 space-y-4">
        {!showAnswer && !userAnswer && (
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleReveal}
              className="jungle-button-secondary flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Reveal Answer</span>
            </button>
            <button
              onClick={handleFlip}
              className="jungle-button-secondary flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Flip Card</span>
            </button>
          </div>
        )}

        {showAnswer && !userAnswer && (
          <div className="text-center space-y-4">
            <p className="text-gray-600">How well did you know this?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleAnswer(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                <span>I knew it!</span>
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex items-center space-x-2 px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-colors"
              >
                <XCircle className="w-5 h-5" />
                <span>I didn't know</span>
              </button>
            </div>
          </div>
        )}

        {userAnswer && (
          <div className="text-center space-y-4">
            <div className={cn(
              "inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium",
              userAnswer === 'correct' 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            )}>
              {userAnswer === 'correct' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Great job!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span>Keep studying!</span>
                </>
              )}
            </div>
            
            {!isLast && (
              <button
                onClick={resetCard}
                className="jungle-button-secondary flex items-center space-x-2 mx-auto"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Next Card</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress indicator */}
      <div className="mt-6 text-center">
        <div className="flex justify-center space-x-1">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full",
                i < flashcard.reviewCount ? "bg-jungle-500" : "bg-gray-200"
              )}
            />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Reviewed {flashcard.reviewCount} times
        </p>
      </div>
    </div>
  )
}