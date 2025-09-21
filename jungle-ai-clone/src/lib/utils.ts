import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function extractTextFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type === 'text/plain') {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string || '')
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    } else if (file.type === 'application/pdf') {
      // For PDF, we'll simulate text extraction
      // In a real app, you'd use a PDF parsing library
      setTimeout(() => {
        resolve(`PDF content extracted from ${file.name}\n\nThis is simulated content for demonstration purposes.`)
      }, 1000)
    } else {
      reject(new Error('Unsupported file type'))
    }
  })
}