import React from 'react'
import { Leaf, BookOpen, Trophy, Settings } from 'lucide-react'

export default function Header() {
  return (
    <header className="relative z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-leaf-400 to-jungle-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-leaf-400 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-jungle-800">Jungle AI</h1>
              <p className="text-xs text-gray-500">Study Smarter</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="flex items-center space-x-2 text-jungle-600 hover:text-jungle-700 transition-colors">
              <BookOpen className="w-4 h-4" />
              <span className="font-medium">Study Sets</span>
            </a>
            <a href="/demo" className="flex items-center space-x-2 text-gray-600 hover:text-jungle-600 transition-colors">
              <Trophy className="w-4 h-4" />
              <span className="font-medium">AI Demo</span>
            </a>
            <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-jungle-600 transition-colors">
              <Settings className="w-4 h-4" />
              <span className="font-medium">Settings</span>
            </a>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-jungle-400 to-leaf-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}