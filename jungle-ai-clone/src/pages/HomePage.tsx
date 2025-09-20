import React from 'react'
import { Plus, Upload, BookOpen, Brain, TrendingUp } from 'lucide-react'
import { useStudy } from '../contexts/StudyContext'
import StudySetCard from '../components/StudySetCard'
import FileUpload from '../components/FileUpload'
import { StudySet } from '../types'

interface HomePageProps {
  studySets: StudySet[]
  onStartStudying: (studySet: StudySet) => void
  onCreateStudySet: () => void
}

export default function HomePage({ studySets, onStartStudying, onCreateStudySet }: HomePageProps) {
  const { state } = useStudy()

  const handleShare = (studySet: StudySet) => {
    console.log('Sharing study set:', studySet.title)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Jungle AI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your study materials into interactive flashcards and quizzes. 
            Upload your documents and let AI create personalized learning experiences.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="jungle-card text-center">
            <div className="w-12 h-12 bg-jungle-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-jungle-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {studySets.length}
            </h3>
            <p className="text-gray-600">Study Sets</p>
          </div>
          
          <div className="jungle-card text-center">
            <div className="w-12 h-12 bg-leaf-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6 text-leaf-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {studySets.reduce((acc, set) => acc + set.flashcards.length, 0)}
            </h3>
            <p className="text-gray-600">Flashcards</p>
          </div>
          
          <div className="jungle-card text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {studySets.reduce((acc, set) => acc + set.studiedItems, 0)}
            </h3>
            <p className="text-gray-600">Items Studied</p>
          </div>
        </div>

        {/* Upload Section */}
        {state.uploadedFiles.length === 0 && (
          <div className="jungle-card mb-12">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Upload anything
              </h2>
              <p className="text-gray-600">
                Get started by uploading your study materials
              </p>
            </div>
            <FileUpload />
          </div>
        )}

        {/* Study Sets */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Study Sets</h2>
            <button
              onClick={onCreateStudySet}
              className="jungle-button flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create New</span>
            </button>
          </div>

          {studySets.length === 0 ? (
            <div className="jungle-card text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No study sets yet
              </h3>
              <p className="text-gray-600 mb-6">
                Upload your first document to create flashcards and quizzes
              </p>
              <button
                onClick={onCreateStudySet}
                className="jungle-button flex items-center space-x-2 mx-auto"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Files</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studySets.map((studySet) => (
                <StudySetCard
                  key={studySet.id}
                  studySet={studySet}
                  onStartStudying={() => onStartStudying(studySet)}
                  onShare={() => handleShare(studySet)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {studySets.length > 0 && (
          <div className="jungle-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-jungle-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-jungle-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Studied Biology 101 flashcards
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <span className="text-sm text-jungle-600 font-medium">85%</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-leaf-100 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-leaf-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Completed Chemistry quiz
                  </p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
                <span className="text-sm text-green-600 font-medium">92%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}