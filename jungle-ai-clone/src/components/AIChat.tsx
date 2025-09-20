import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, MessageCircle, FileText } from 'lucide-react'
import { useStudy } from '../contexts/StudyContext'
import { ChatMessage } from '../types'
import { generateId } from '../lib/utils'

interface AIChatProps {
  studySetId?: string
}

export default function AIChat({ studySetId }: AIChatProps) {
  const { state, dispatch } = useStudy()
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [state.chatMessages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage })
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: generateAIResponse(inputMessage.trim()),
        timestamp: new Date()
      }
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiResponse })
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "That's a great question! Let me help you understand this concept better.",
      "I can explain that for you. Here's what you need to know...",
      "Excellent question! This relates to several important concepts in your study material.",
      "Let me break this down for you step by step.",
      "This is a common point of confusion. Here's the explanation...",
      "Great! This connects to what you've been studying. Here's how..."
    ]

    // Simple keyword matching for more contextual responses
    if (userInput.toLowerCase().includes('mitosis')) {
      return "Mitosis is the process of cell division that creates two identical daughter cells. It consists of several phases: prophase, metaphase, anaphase, and telophase. This process is essential for growth, repair, and asexual reproduction in organisms."
    }
    
    if (userInput.toLowerCase().includes('photosynthesis')) {
      return "Photosynthesis is the process by which plants convert light energy into chemical energy. The overall equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. This process occurs in the chloroplasts and is crucial for life on Earth."
    }

    if (userInput.toLowerCase().includes('protein')) {
      return "Proteins are macromolecules composed of amino acids. They have four levels of structure: primary (amino acid sequence), secondary (alpha helices and beta sheets), tertiary (3D folding), and quaternary (multiple polypeptide chains). Proteins serve many functions including enzymes, structural support, and transport."
    }

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const clearChat = () => {
    dispatch({ type: 'CLEAR_CHAT' })
  }

  return (
    <div className="jungle-card h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-jungle-100 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-jungle-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">AI Study Assistant</h3>
            <p className="text-xs text-gray-500">Ask me anything about your study material</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {state.chatMessages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Start a conversation with your AI study assistant</p>
          </div>
        ) : (
          state.chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-jungle-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.role === 'assistant' && (
                    <Bot className="w-4 h-4 mt-0.5 text-jungle-600 flex-shrink-0" />
                  )}
                  {message.role === 'user' && (
                    <User className="w-4 h-4 mt-0.5 text-white flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-jungle-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-2xl">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-jungle-600" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your study material..."
            className="w-full px-4 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-jungle-500 focus:border-transparent"
            rows={2}
            disabled={isTyping}
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isTyping}
          className="jungle-button p-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => setInputMessage('Explain the main concepts from my study material')}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
        >
          Explain concepts
        </button>
        <button
          onClick={() => setInputMessage('Give me a practice question')}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
        >
          Practice question
        </button>
        <button
          onClick={() => setInputMessage('Summarize the key points')}
          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
        >
          Summarize
        </button>
      </div>
    </div>
  )
}