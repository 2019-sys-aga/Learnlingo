import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { StudySet, Flashcard, Quiz, Question, UploadedFile, Progress, ChatMessage } from '../types'

interface StudyState {
  studySets: StudySet[]
  currentStudySet: StudySet | null
  uploadedFiles: UploadedFile[]
  progress: Progress[]
  chatMessages: ChatMessage[]
  isLoading: boolean
}

type StudyAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_STUDY_SET'; payload: StudySet }
  | { type: 'SET_CURRENT_STUDY_SET'; payload: StudySet | null }
  | { type: 'UPDATE_STUDY_SET'; payload: StudySet }
  | { type: 'ADD_UPLOADED_FILE'; payload: UploadedFile }
  | { type: 'SET_UPLOADED_FILES'; payload: UploadedFile[] }
  | { type: 'UPDATE_PROGRESS'; payload: Progress }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'CLEAR_CHAT' }

const initialState: StudyState = {
  studySets: [],
  currentStudySet: null,
  uploadedFiles: [],
  progress: [],
  chatMessages: [],
  isLoading: false,
}

function studyReducer(state: StudyState, action: StudyAction): StudyState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'ADD_STUDY_SET':
      return { ...state, studySets: [...state.studySets, action.payload] }
    
    case 'SET_CURRENT_STUDY_SET':
      return { ...state, currentStudySet: action.payload }
    
    case 'UPDATE_STUDY_SET':
      return {
        ...state,
        studySets: state.studySets.map(set =>
          set.id === action.payload.id ? action.payload : set
        ),
        currentStudySet: state.currentStudySet?.id === action.payload.id 
          ? action.payload 
          : state.currentStudySet
      }
    
    case 'ADD_UPLOADED_FILE':
      return { ...state, uploadedFiles: [...state.uploadedFiles, action.payload] }
    
    case 'SET_UPLOADED_FILES':
      return { ...state, uploadedFiles: action.payload }
    
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: state.progress.map(p =>
          p.studySetId === action.payload.studySetId ? action.payload : p
        )
      }
    
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatMessages: [...state.chatMessages, action.payload] }
    
    case 'CLEAR_CHAT':
      return { ...state, chatMessages: [] }
    
    default:
      return state
  }
}

const StudyContext = createContext<{
  state: StudyState
  dispatch: React.Dispatch<StudyAction>
} | null>(null)

export function StudyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(studyReducer, initialState)

  return (
    <StudyContext.Provider value={{ state, dispatch }}>
      {children}
    </StudyContext.Provider>
  )
}

export function useStudy() {
  const context = useContext(StudyContext)
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider')
  }
  return context
}