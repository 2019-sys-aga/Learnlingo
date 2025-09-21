import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useStudy } from '../contexts/StudyContext'
import { aiService } from '../services/aiService'
import { generateId } from '../utils'
import { ChatMessage } from '../types'

interface ChatScreenProps {
  navigation: any
}

export default function ChatScreen({ navigation }: ChatScreenProps) {
  const { state, dispatch } = useStudy()
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    // Scroll to bottom when new messages are added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
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
    const currentMessage = inputMessage.trim()
    setInputMessage('')
    setIsTyping(true)

    try {
      // Get context from uploaded files if available
      const context = state.uploadedFiles
        .filter(file => file.processed && file.content)
        .map(file => file.content)
        .join('\n\n')

      // Call real AI service
      const aiResponseText = await aiService.chatWithAI(currentMessage, context)
      
      const aiResponse: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date()
      }
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiResponse })
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorResponse: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please check your connection and try again.",
        timestamp: new Date()
      }
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: errorResponse })
    } finally {
      setIsTyping(false)
    }
  }

  const clearChat = () => {
    dispatch({ type: 'CLEAR_CHAT' })
  }

  const quickActions = [
    'Explain the main concepts from my study material',
    'Give me a practice question about the material',
    'Summarize the key points from my study material',
  ]

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
        <View style={styles.headerContent}>
          <Ionicons name="chatbubble-outline" size={24} color="white" />
          <Text style={styles.headerTitle}>AI Study Assistant</Text>
        </View>
        <TouchableOpacity style={styles.clearButton} onPress={clearChat}>
          <Ionicons name="trash-outline" size={20} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {state.chatMessages.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyTitle}>Start a conversation</Text>
              <Text style={styles.emptySubtitle}>
                Ask me anything about your study material
              </Text>
            </View>
          ) : (
            state.chatMessages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.role === 'user' ? styles.userMessage : styles.aiMessage
                ]}
              >
                <View style={[
                  styles.messageBubble,
                  message.role === 'user' ? styles.userBubble : styles.aiBubble
                ]}>
                  <Text style={[
                    styles.messageText,
                    message.role === 'user' ? styles.userText : styles.aiText
                  ]}>
                    {message.content}
                  </Text>
                  <Text style={[
                    styles.messageTime,
                    message.role === 'user' ? styles.userTime : styles.aiTime
                  ]}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </View>
              </View>
            ))
          )}

          {isTyping && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <View style={[styles.messageBubble, styles.aiBubble]}>
                <View style={styles.typingIndicator}>
                  <View style={styles.typingDot} />
                  <View style={[styles.typingDot, styles.typingDot2]} />
                  <View style={[styles.typingDot, styles.typingDot3]} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Actions */}
        {state.chatMessages.length === 0 && (
          <ScrollView 
            horizontal 
            style={styles.quickActionsContainer}
            showsHorizontalScrollIndicator={false}
          >
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionButton}
                onPress={() => setInputMessage(action)}
              >
                <Text style={styles.quickActionText}>{action}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Ask me anything about your study material..."
            placeholderTextColor="#9ca3af"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputMessage.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
          >
            <LinearGradient
              colors={inputMessage.trim() ? ['#22c55e', '#16a34a'] : ['#9ca3af', '#6b7280']}
              style={styles.sendGradient}
            >
              <Ionicons name="send" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  clearButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#22c55e',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
  },
  aiText: {
    color: '#1f2937',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  aiTime: {
    color: '#9ca3af',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9ca3af',
    marginHorizontal: 2,
  },
  typingDot2: {
    animationDelay: '0.2s',
  },
  typingDot3: {
    animationDelay: '0.4s',
  },
  quickActionsContainer: {
    maxHeight: 60,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  quickActionButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickActionText: {
    fontSize: 12,
    color: '#6b7280',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sendButton: {
    borderRadius: 20,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
})