import React, { useState, useRef } from 'react'
import { Upload, FileText, Image, Video, X, CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import { useStudy } from '../contexts/StudyContext'
import { generateId, formatFileSize, extractTextFromFile } from '../lib/utils'
import { UploadedFile } from '../types'
import { fileProcessingService } from '../services/fileProcessingService'

export default function FileUpload() {
  const { state, dispatch } = useStudy()
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      await handleFiles(e.target.files)
    }
  }

  const handleFiles = async (files: FileList) => {
    setUploading(true)
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const fileArray = Array.from(files)
      
      for (const file of fileArray) {
        const fileId = generateId()
        
        // Create initial file object
        const uploadedFile: UploadedFile = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          content: '',
          uploadedAt: new Date(),
          processed: false
        }

        dispatch({ type: 'ADD_UPLOADED_FILE', payload: uploadedFile })

        try {
          // Extract text content
          const content = await extractTextFromFile(file)
          
          // Update file with content
          const processedFile: UploadedFile = {
            ...uploadedFile,
            content,
            processed: true
          }

          dispatch({ type: 'ADD_UPLOADED_FILE', payload: processedFile })
        } catch (error) {
          console.error('Error processing file:', error)
        }
      }
    } finally {
      setUploading(false)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <Image className="w-5 h-5" />
    if (type.includes('video')) return <Video className="w-5 h-5" />
    return <FileText className="w-5 h-5" />
  }

  const removeFile = (fileId: string) => {
    const updatedFiles = state.uploadedFiles.filter(file => file.id !== fileId)
    dispatch({ type: 'SET_UPLOADED_FILES', payload: updatedFiles })
  }

  const processFilesWithAI = async () => {
    if (state.uploadedFiles.length === 0) return

    try {
      setUploading(true)
      dispatch({ type: 'SET_LOADING', payload: true })

      // Process files with AI
      const studySet = await fileProcessingService.processUploadedFiles(state.uploadedFiles)
      
      // Add the generated study set
      dispatch({ type: 'ADD_STUDY_SET', payload: studySet })
      
      // Clear uploaded files
      dispatch({ type: 'SET_UPLOADED_FILES', payload: [] })
      
    } catch (error) {
      console.error('Error processing files with AI:', error)
      alert('Failed to process files with AI. Please check your API key and try again.')
    } finally {
      setUploading(false)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-jungle-400 bg-jungle-50' 
            : 'border-gray-300 hover:border-jungle-300 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt,.doc,.docx,.ppt,.pptx"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-jungle-100 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-jungle-600" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Upload your study materials
            </h3>
            <p className="text-gray-600 mt-2">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supports PDF, DOC, PPT, TXT files
            </p>
          </div>

          {uploading && (
            <div className="flex items-center justify-center space-x-2 text-jungle-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-jungle-600"></div>
              <span className="text-sm">Processing files...</span>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Files */}
      {state.uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">Uploaded Files</h4>
            <button
              onClick={processFilesWithAI}
              disabled={uploading || state.uploadedFiles.some(file => !file.processed)}
              className="jungle-button flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              <span>{uploading ? 'Processing...' : 'Generate Study Set'}</span>
            </button>
          </div>
          
          <div className="space-y-2">
            {state.uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-jungle-600">
                    {getFileIcon(file.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {file.processed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {uploading && (
            <div className="text-center py-4">
              <div className="inline-flex items-center space-x-2 text-jungle-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-jungle-600"></div>
                <span className="text-sm">AI is analyzing your files and generating study materials...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}