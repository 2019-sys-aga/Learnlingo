import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import * as DocumentPicker from 'expo-document-picker'
import * as FileSystem from 'expo-file-system'
import { useStudy } from '../contexts/StudyContext'
import { aiService } from '../services/aiService'
import { generateId, formatFileSize } from '../utils'
import { StudySet } from '../types'

interface UploadScreenProps {
  navigation: any
}

export default function UploadScreen({ navigation }: UploadScreenProps) {
  const { state, dispatch } = useStudy()
  const [isProcessing, setIsProcessing] = useState(false)

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      })

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0]
        
        // Read file content
        const content = await FileSystem.readAsStringAsync(file.uri)
        
        const uploadedFile = {
          id: generateId(),
          name: file.name,
          size: file.size || 0,
          type: file.mimeType || 'text/plain',
          content,
          uploadedAt: new Date(),
          processed: true
        }

        dispatch({ type: 'ADD_UPLOADED_FILE', payload: uploadedFile })
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document')
    }
  }

  const processFilesWithAI = async () => {
    if (state.uploadedFiles.length === 0) return

    try {
      setIsProcessing(true)
      dispatch({ type: 'SET_LOADING', payload: true })

      // Combine all file contents
      const allContent = state.uploadedFiles
        .filter(file => file.processed && file.content)
        .map(file => file.content)
        .join('\n\n---\n\n')

      if (!allContent.trim()) {
        Alert.alert('Error', 'No content found in uploaded files')
        return
      }

      // Generate flashcards and quiz questions using AI
      const [flashcards, questions] = await Promise.all([
        aiService.generateFlashcards(allContent, 10),
        aiService.generateQuiz(allContent, 5)
      ])

      // Create a new study set
      const studySet: StudySet = {
        id: generateId(),
        title: `Study Set ${new Date().toLocaleDateString()}`,
        description: 'Generated from uploaded materials using AI',
        totalItems: flashcards.length + questions.length,
        studiedItems: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        flashcards,
        quizzes: [
          {
            id: generateId(),
            title: 'AI Generated Quiz',
            totalQuestions: questions.length,
            completedQuestions: 0,
            createdAt: new Date(),
            questions
          }
        ]
      }

      // Add the generated study set
      dispatch({ type: 'ADD_STUDY_SET', payload: studySet })
      
      // Clear uploaded files
      dispatch({ type: 'SET_UPLOADED_FILES', payload: [] })
      
      Alert.alert(
        'Success!', 
        `Generated ${flashcards.length} flashcards and ${questions.length} quiz questions!`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      )
      
    } catch (error) {
      console.error('Error processing files with AI:', error)
      Alert.alert('Error', 'Failed to process files with AI. Please try again.')
    } finally {
      setIsProcessing(false)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const removeFile = (fileId: string) => {
    const updatedFiles = state.uploadedFiles.filter(file => file.id !== fileId)
    dispatch({ type: 'SET_UPLOADED_FILES', payload: updatedFiles })
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#22c55e" />
      
      {/* Header */}
      <LinearGradient
        colors={['#22c55e', '#16a34a', '#15803d']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Files</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Upload Area */}
        <TouchableOpacity style={styles.uploadArea} onPress={pickDocument}>
          <LinearGradient
            colors={['#f0fdf4', '#dcfce7']}
            style={styles.uploadGradient}
          >
            <Ionicons name="cloud-upload-outline" size={48} color="#22c55e" />
            <Text style={styles.uploadTitle}>Upload your study materials</Text>
            <Text style={styles.uploadSubtitle}>
              Tap to select PDF, DOC, TXT files
            </Text>
            {isProcessing && (
              <View style={styles.processingContainer}>
                <View style={styles.spinner} />
                <Text style={styles.processingText}>AI is processing...</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Uploaded Files */}
        {state.uploadedFiles.length > 0 && (
          <View style={styles.filesSection}>
            <View style={styles.filesHeader}>
              <Text style={styles.filesTitle}>Uploaded Files</Text>
              <TouchableOpacity
                style={styles.processButton}
                onPress={processFilesWithAI}
                disabled={isProcessing || state.uploadedFiles.some(file => !file.processed)}
              >
                <LinearGradient
                  colors={['#22c55e', '#16a34a']}
                  style={styles.processGradient}
                >
                  <Ionicons name="sparkles-outline" size={16} color="white" />
                  <Text style={styles.processButtonText}>
                    {isProcessing ? 'Processing...' : 'Generate Study Set'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            {state.uploadedFiles.map((file) => (
              <View key={file.id} style={styles.fileCard}>
                <View style={styles.fileInfo}>
                  <Ionicons name="document-text-outline" size={24} color="#22c55e" />
                  <View style={styles.fileDetails}>
                    <Text style={styles.fileName}>{file.name}</Text>
                    <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
                  </View>
                </View>
                
                <View style={styles.fileActions}>
                  <Ionicons 
                    name={file.processed ? "checkmark-circle" : "time-outline"} 
                    size={20} 
                    color={file.processed ? "#22c55e" : "#f59e0b"} 
                  />
                  <TouchableOpacity
                    onPress={() => removeFile(file.id)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close-circle" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsSection}>
          <Text style={styles.instructionsTitle}>How it works</Text>
          <View style={styles.instructionItem}>
            <Ionicons name="cloud-upload-outline" size={20} color="#22c55e" />
            <Text style={styles.instructionText}>Upload your study materials</Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="sparkles-outline" size={20} color="#22c55e" />
            <Text style={styles.instructionText}>AI analyzes and generates content</Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="book-outline" size={20} color="#22c55e" />
            <Text style={styles.instructionText}>Study with flashcards and quizzes</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  uploadArea: {
    marginTop: 20,
    marginBottom: 30,
  },
  uploadGradient: {
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#dcfce7',
    borderStyle: 'dashed',
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    textAlign: 'center',
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  spinner: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: '#22c55e',
    borderTopColor: 'transparent',
    borderRadius: 8,
    marginRight: 8,
  },
  processingText: {
    fontSize: 14,
    color: '#22c55e',
  },
  filesSection: {
    marginBottom: 30,
  },
  filesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  processButton: {
    borderRadius: 12,
  },
  processGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  processButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  fileCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fileInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileDetails: {
    marginLeft: 12,
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  fileSize: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  fileActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    marginLeft: 12,
  },
  instructionsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 12,
  },
})