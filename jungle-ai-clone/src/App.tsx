import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { StudyProvider } from './contexts/StudyContext'
import JungleBackground from './components/JungleBackground'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import StudyPage from './pages/StudyPage'
import DemoPage from './pages/DemoPage'
import { StudySet, Flashcard, Quiz, Question } from './types'
import { generateId } from './lib/utils'

function AppContent() {
  const navigate = useNavigate()

  // Mock data for demonstration
  const mockStudySets: StudySet[] = [
    {
      id: '1',
      title: 'Biology 101',
      description: 'Fundamental concepts in biology',
      totalItems: 50,
      studiedItems: 12,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      flashcards: [
        {
          id: '1',
          front: 'What is the powerhouse of the cell?',
          back: 'Mitochondria - the organelle responsible for cellular respiration and ATP production.',
          difficulty: 'easy',
          reviewCount: 3,
          correctCount: 2,
          source: 'Chapter 3'
        },
        {
          id: '2',
          front: 'Define photosynthesis',
          back: 'The process by which plants convert light energy into chemical energy, producing glucose and oxygen.',
          difficulty: 'medium',
          reviewCount: 1,
          correctCount: 0,
          source: 'Chapter 4'
        },
        {
          id: '3',
          front: 'What are the four phases of mitosis?',
          back: 'Prophase, Metaphase, Anaphase, and Telophase.',
          difficulty: 'hard',
          reviewCount: 0,
          correctCount: 0,
          source: 'Chapter 5'
        }
      ],
      quizzes: [
        {
          id: '1',
          title: 'Cell Biology Quiz',
          totalQuestions: 7,
          completedQuestions: 0,
          createdAt: new Date('2024-01-15'),
          questions: [
            {
              id: '1',
              text: 'Which of the following macromolecules is composed of amino acids?',
              type: 'multiple-choice',
              options: ['Proteins', 'Carbohydrates', 'Lipids', 'Nucleic acids'],
              correctAnswer: 'Proteins',
              explanation: 'Proteins are macromolecules composed of amino acids linked by peptide bonds.',
              source: 'Chapter 2',
              difficulty: 'easy'
            },
            {
              id: '2',
              text: 'Mitosis is the type of cell division that creates somatic (body) cells.',
              type: 'true-false',
              correctAnswer: true,
              explanation: 'Mitosis is the cell division process for somatic cell production. These cells are responsible for tissue repair, growth, and replacing dead cells.',
              source: 'Chapter 5',
              difficulty: 'medium'
            },
            {
              id: '3',
              text: 'Which organelle is responsible for protein synthesis?',
              type: 'multiple-choice',
              options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'],
              correctAnswer: 'Ribosome',
              explanation: 'Ribosomes are the cellular structures responsible for protein synthesis through the process of translation.',
              source: 'Chapter 3',
              difficulty: 'medium'
            }
          ]
        }
      ]
    },
    {
      id: '2',
      title: 'Chemistry Fundamentals',
      description: 'Basic chemistry concepts and principles',
      totalItems: 30,
      studiedItems: 8,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
      flashcards: [
        {
          id: '4',
          front: 'What is the chemical formula for water?',
          back: 'H₂O - two hydrogen atoms bonded to one oxygen atom.',
          difficulty: 'easy',
          reviewCount: 5,
          correctCount: 5,
          source: 'Chapter 1'
        }
      ],
      quizzes: [
        {
          id: '2',
          title: 'Basic Chemistry Quiz',
          totalQuestions: 5,
          completedQuestions: 0,
          createdAt: new Date('2024-01-10'),
          questions: [
            {
              id: '4',
              text: 'What is the atomic number of carbon?',
              type: 'multiple-choice',
              options: ['6', '12', '14', '16'],
              correctAnswer: '6',
              explanation: 'Carbon has an atomic number of 6, meaning it has 6 protons in its nucleus.',
              source: 'Chapter 2',
              difficulty: 'easy'
            }
          ]
        }
      ]
    }
  ]

  const [studySets, setStudySets] = useState<StudySet[]>(mockStudySets)
  const [currentStudySet, setCurrentStudySet] = useState<StudySet | null>(null)

  const handleStartStudying = (studySet: StudySet) => {
    setCurrentStudySet(studySet)
    navigate('/study')
  }

  const handleCreateStudySet = () => {
    // Simulate creating a new study set from uploaded files
    const newStudySet: StudySet = {
      id: generateId(),
      title: 'New Study Set',
      description: 'Created from uploaded materials',
      totalItems: 0,
      studiedItems: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      flashcards: [],
      quizzes: []
    }
    setStudySets(prev => [...prev, newStudySet])
  }

  return (
    <div className="min-h-screen relative">
      <JungleBackground />
      <Header />
      
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              studySets={studySets}
              onStartStudying={handleStartStudying}
              onCreateStudySet={handleCreateStudySet}
            />
          } 
        />
        <Route 
          path="/study" 
          element={
            <StudyPage 
              currentStudySet={currentStudySet}
              onBack={() => navigate('/')}
            />
          } 
        />
        <Route 
          path="/demo" 
          element={
            <DemoPage 
              onBack={() => navigate('/')}
            />
          } 
        />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <StudyProvider>
      <Router>
        <AppContent />
      </Router>
    </StudyProvider>
  )
}

export default App