import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useStudy } from '../contexts/StudyContext'
import { StudySet } from '../types'

interface HomeScreenProps {
  navigation: any
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { state } = useStudy()

  const handleStartStudying = (studySet: StudySet) => {
    navigation.navigate('Study', { studySet })
  }

  const handleUpload = () => {
    navigation.navigate('Upload')
  }

  const handleChat = () => {
    navigation.navigate('Chat')
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#22c55e" />
      
      {/* Header */}
      <LinearGradient
        colors={['#22c55e', '#16a34a', '#15803d']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Ionicons name="leaf-outline" size={32} color="white" />
            <Text style={styles.logoText}>Jungle AI</Text>
          </View>
          <Text style={styles.subtitle}>Study Smarter</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="book-outline" size={24} color="#22c55e" />
            <Text style={styles.statNumber}>{state.studySets.length}</Text>
            <Text style={styles.statLabel}>Study Sets</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="brain-outline" size={24} color="#22c55e" />
            <Text style={styles.statNumber}>
              {state.studySets.reduce((acc, set) => acc + set.flashcards.length, 0)}
            </Text>
            <Text style={styles.statLabel}>Flashcards</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="trending-up-outline" size={24} color="#22c55e" />
            <Text style={styles.statNumber}>
              {state.studySets.reduce((acc, set) => acc + set.studiedItems, 0)}
            </Text>
            <Text style={styles.statLabel}>Studied</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleUpload}>
            <LinearGradient
              colors={['#22c55e', '#16a34a']}
              style={styles.actionGradient}
            >
              <Ionicons name="cloud-upload-outline" size={24} color="white" />
              <Text style={styles.actionText}>Upload Files</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleChat}>
            <LinearGradient
              colors={['#84cc16', '#65a30d']}
              style={styles.actionGradient}
            >
              <Ionicons name="chatbubble-outline" size={24} color="white" />
              <Text style={styles.actionText}>AI Chat</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Study Sets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Study Sets</Text>
          
          {state.studySets.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={48} color="#9ca3af" />
              <Text style={styles.emptyTitle}>No study sets yet</Text>
              <Text style={styles.emptySubtitle}>
                Upload your first document to create flashcards and quizzes
              </Text>
              <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                <Text style={styles.uploadButtonText}>Upload Files</Text>
              </TouchableOpacity>
            </View>
          ) : (
            state.studySets.map((studySet) => (
              <TouchableOpacity
                key={studySet.id}
                style={styles.studySetCard}
                onPress={() => handleStartStudying(studySet)}
              >
                <View style={styles.studySetHeader}>
                  <Text style={styles.studySetTitle}>{studySet.title}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </View>
                
                {studySet.description && (
                  <Text style={styles.studySetDescription}>{studySet.description}</Text>
                )}
                
                <View style={styles.studySetStats}>
                  <Text style={styles.studySetStat}>
                    {studySet.flashcards.length} flashcards
                  </Text>
                  <Text style={styles.studySetStat}>
                    {studySet.quizzes.length} quizzes
                  </Text>
                </View>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${(studySet.studiedItems / studySet.totalItems) * 100}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {studySet.studiedItems}/{studySet.totalItems}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
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
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -15,
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  actionGradient: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
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
    marginBottom: 24,
  },
  uploadButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  studySetCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  studySetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  studySetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  studySetDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  studySetStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  studySetStat: {
    fontSize: 12,
    color: '#6b7280',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
})