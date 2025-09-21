import React from 'react'
import { Play, Share2, MoreVertical, BookOpen, Clock } from 'lucide-react'
import { StudySet } from '../types'
import { cn } from '../lib/utils'

interface StudySetCardProps {
  studySet: StudySet
  onStartStudying: () => void
  onShare: () => void
}

export default function StudySetCard({ studySet, onStartStudying, onShare }: StudySetCardProps) {
  const progressPercentage = studySet.totalItems > 0 
    ? (studySet.studiedItems / studySet.totalItems) * 100 
    : 0

  return (
    <div className="jungle-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {studySet.title}
          </h3>
          {studySet.description && (
            <p className="text-sm text-gray-600">{studySet.description}</p>
          )}
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <BookOpen className="w-4 h-4" />
          <span>{studySet.totalItems} items</span>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Updated {new Date(studySet.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">My Progress</span>
          <span className="text-sm text-jungle-600 font-medium">
            {studySet.studiedItems}/{studySet.totalItems}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-jungle-500 to-leaf-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {Math.round(progressPercentage)}% complete
        </p>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={onStartStudying}
          className="flex-1 jungle-button flex items-center justify-center space-x-2"
        >
          <Play className="w-4 h-4" />
          <span>Start Studying</span>
        </button>
        <button
          onClick={onShare}
          className="jungle-button-secondary flex items-center justify-center px-4"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-jungle-600">
              {studySet.flashcards.length}
            </p>
            <p className="text-xs text-gray-500">Flashcards</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-leaf-600">
              {studySet.quizzes.length}
            </p>
            <p className="text-xs text-gray-500">Quizzes</p>
          </div>
        </div>
      </div>
    </div>
  )
}