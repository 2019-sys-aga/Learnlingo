import React from 'react'
import { ArrowLeft, MessageCircle, BookOpen } from 'lucide-react'
import AIChat from '../components/AIChat'

interface DemoPageProps {
  onBack: () => void
}

export default function DemoPage({ onBack }: DemoPageProps) {
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
                  AI Study Assistant
                </h1>
                <p className="text-sm text-gray-500">
                  Interactive chat with AI explanations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Chat */}
          <div className="lg:col-span-2">
            <AIChat studySetId="demo" />
          </div>

          {/* Right Column - Features */}
          <div className="space-y-6">
            <div className="jungle-card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-jungle-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-jungle-600" />
                </div>
                <h3 className="font-semibold text-gray-900">AI Chat Features</h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-jungle-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Explain complex concepts in simple terms</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-jungle-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Generate practice questions on demand</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-jungle-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Provide step-by-step explanations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-jungle-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Connect concepts across your study material</span>
                </li>
              </ul>
            </div>

            <div className="jungle-card">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-leaf-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-leaf-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Study Tips</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="p-3 bg-jungle-50 rounded-lg">
                  <p className="font-medium text-jungle-800 mb-1">Active Recall</p>
                  <p>Test yourself regularly instead of just re-reading notes.</p>
                </div>
                <div className="p-3 bg-leaf-50 rounded-lg">
                  <p className="font-medium text-leaf-800 mb-1">Spaced Repetition</p>
                  <p>Review material at increasing intervals for better retention.</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800 mb-1">Interleaving</p>
                  <p>Mix different topics during study sessions.</p>
                </div>
              </div>
            </div>

            <div className="jungle-card">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <p className="font-medium text-gray-900">Explain photosynthesis</p>
                  <p className="text-xs text-gray-500">Get a detailed explanation</p>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <p className="font-medium text-gray-900">Practice mitosis questions</p>
                  <p className="text-xs text-gray-500">Generate quiz questions</p>
                </button>
                <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <p className="font-medium text-gray-900">Summarize key points</p>
                  <p className="text-xs text-gray-500">Get a concise overview</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}