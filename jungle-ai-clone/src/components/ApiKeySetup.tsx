import React, { useState } from 'react'
import { Key, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void
}

export default function ApiKeySetup({ onApiKeySet }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!apiKey.trim()) return

    setIsValidating(true)
    
    try {
      // Test the API key by making a simple request
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey)
      
      if (response.ok) {
        setIsValid(true)
        onApiKeySet(apiKey)
        // Store in localStorage for persistence
        localStorage.setItem('jungle_ai_api_key', apiKey)
      } else {
        setIsValid(false)
      }
    } catch (error) {
      setIsValid(false)
    } finally {
      setIsValidating(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value)
    setIsValid(null)
  }

  return (
    <div className="jungle-card max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-jungle-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Key className="w-8 h-8 text-jungle-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Setup Required
        </h2>
        <p className="text-gray-600">
          Enter your Google Gemini API key to enable AI features
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
            Gemini API Key
          </label>
          <div className="relative">
            <input
              id="apiKey"
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={handleInputChange}
              placeholder="Enter your Gemini API key"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-jungle-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isValid === false && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Invalid API key. Please check and try again.</span>
          </div>
        )}

        {isValid === true && (
          <div className="flex items-center space-x-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>API key is valid! You're all set.</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!apiKey.trim() || isValidating}
          className="w-full jungle-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isValidating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Validating...</span>
            </>
          ) : (
            <span>Save API Key</span>
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          How to get your Gemini API key:
        </h3>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">Google AI Studio</a></li>
          <li>2. Sign in with your Google account</li>
          <li>3. Click "Create API Key"</li>
          <li>4. Copy the generated key</li>
        </ol>
      </div>
    </div>
  )
}