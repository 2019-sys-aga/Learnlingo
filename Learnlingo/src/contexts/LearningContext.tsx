import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  streak: number;
  xp: number;
  level: number;
  hearts: number;
  gems: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  language: string;
  flag: string;
  progress: number;
  skills: Skill[];
}

interface Skill {
  id: string;
  title: string;
  description: string;
  level: number;
  maxLevel: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  lessons: LessonData[];
  position: { x: number; y: number };
}

interface LessonData {
  id: string;
  title: string;
  type: 'lesson' | 'story' | 'speaking' | 'listening';
  questions: Question[];
  isCompleted: boolean;
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'true-false' | 'short-answer' | 'image-select';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  audio?: string;
  image?: string;
}

interface LearningContextType {
  user: User;
  courses: Course[];
  currentCourse: Course | null;
  currentLesson: LessonData | null;
  updateUser: (updates: Partial<User>) => void;
  setCourses: (courses: Course[]) => void;
  setCurrentCourse: (course: Course | null) => void;
  setCurrentLesson: (lesson: LessonData | null) => void;
  completeLesson: (lessonId: string, xpGained: number) => void;
  uploadFile: (file: File) => Promise<Course>;
  generateCourseFromContent: (content: string, title: string) => Course;
}

const LearningContext = createContext<LearningContextType | null>(null);

export const LearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'Learning Enthusiast',
    email: 'learner@example.com',
    streak: 5,
    xp: 1250,
    level: 8,
    hearts: 5,
    gems: 495
  });

  const [courses, setCourses] = useState<Course[]>([
    {
      id: 'spanish',
      title: 'Spanish',
      description: 'Learn Spanish from scratch',
      language: 'Spanish',
      flag: '🇪🇸',
      progress: 25,
      skills: generateSampleSkills('spanish')
    },
    {
      id: 'french',
      title: 'French',
      description: 'Master the French language',
      language: 'French',
      flag: '🇫🇷',
      progress: 15,
      skills: generateSampleSkills('french')
    }
  ]);

  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<LessonData | null>(null);

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const completeLesson = (lessonId: string, xpGained: number) => {
    updateUser({ 
      xp: user.xp + xpGained,
      level: Math.floor((user.xp + xpGained) / 200) + 1
    });
    
    if (currentCourse) {
      const updatedSkills = currentCourse.skills.map(skill => ({
        ...skill,
        lessons: skill.lessons.map(lesson => 
          lesson.id === lessonId ? { ...lesson, isCompleted: true } : lesson
        )
      }));
      
      setCurrentCourse({ ...currentCourse, skills: updatedSkills });
    }
  };

  const uploadFile = async (file: File): Promise<Course> => {
    // Simulate file processing
    const content = await readFileContent(file);
    const courseTitle = file.name.replace(/\.[^/.]+$/, "");
    return generateCourseFromContent(content, courseTitle);
  };

  const generateCourseFromContent = (content: string, title: string): Course => {
    // AI-powered content analysis (simulated)
    const skills = generateSkillsFromContent(content);
    
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title,
      description: `Learn ${title} with AI-generated lessons`,
      language: title,
      flag: '📚',
      progress: 0,
      skills
    };

    setCourses(prev => [...prev, newCourse]);
    return newCourse;
  };

  return (
    <LearningContext.Provider value={{
      user,
      courses,
      currentCourse,
      currentLesson,
      updateUser,
      setCourses,
      setCurrentCourse,
      setCurrentLesson,
      completeLesson,
      uploadFile,
      generateCourseFromContent
    }}>
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) throw new Error('useLearning must be used within LearningProvider');
  return context;
};

// Helper functions
function generateSampleSkills(courseId: string): Skill[] {
  const skillTemplates = [
    { title: 'Basic Phrases', description: 'Learn essential greetings and phrases' },
    { title: 'Family', description: 'Words for family members' },
    { title: 'Food', description: 'Common food vocabulary' },
    { title: 'Colors', description: 'Learn color names' },
    { title: 'Numbers', description: 'Count from 1 to 100' },
    { title: 'Time', description: 'Tell time and dates' },
    { title: 'Travel', description: 'Essential travel phrases' },
    { title: 'Shopping', description: 'Shopping vocabulary' }
  ];

  return skillTemplates.map((template, index) => ({
    id: `${courseId}-skill-${index}`,
    title: template.title,
    description: template.description,
    level: index < 2 ? 5 : 0,
    maxLevel: 5,
    isUnlocked: index < 3,
    isCompleted: index < 2,
    lessons: generateSampleLessons(`${courseId}-skill-${index}`),
    position: { x: 50, y: 100 + (index * 120) }
  }));
}

function generateSampleLessons(skillId: string): LessonData[] {
  return Array.from({ length: 5 }, (_, index) => ({
    id: `${skillId}-lesson-${index}`,
    title: `Lesson ${index + 1}`,
    type: 'lesson' as const,
    questions: generateSampleQuestions(),
    isCompleted: index < 2
  }));
}

function generateSampleQuestions(): Question[] {
  return [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'What does "Hola" mean?',
      options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
      correctAnswer: 'Hello',
      explanation: '"Hola" is the most common way to say hello in Spanish.'
    },
    {
      id: 'q2',
      type: 'fill-blank',
      question: 'Complete: "Me _____ Juan" (My name is Juan)',
      correctAnswer: 'llamo',
      explanation: '"Me llamo" means "my name is" in Spanish.'
    },
    {
      id: 'q3',
      type: 'true-false',
      question: '"Gracias" means "thank you" in Spanish.',
      correctAnswer: 'true',
      explanation: 'Correct! "Gracias" is how you say thank you.'
    }
  ];
}

function generateSkillsFromContent(content: string): Skill[] {
  // Simulate AI content analysis
  const topics = extractTopics(content);
  
  return topics.map((topic, index) => ({
    id: `generated-skill-${index}`,
    title: topic.title,
    description: topic.description,
    level: 0,
    maxLevel: 5,
    isUnlocked: index === 0,
    isCompleted: false,
    lessons: generateLessonsFromTopic(topic),
    position: { x: 50, y: 100 + (index * 120) }
  }));
}

function extractTopics(content: string) {
  // Simulate AI topic extraction
  const words = content.split(' ').length;
  const topicCount = Math.min(Math.max(Math.floor(words / 200), 3), 10);
  
  return Array.from({ length: topicCount }, (_, index) => ({
    title: `Topic ${index + 1}`,
    description: `Learn about key concepts from section ${index + 1}`,
    content: content.slice(index * 200, (index + 1) * 200)
  }));
}

function generateLessonsFromTopic(topic: any): LessonData[] {
  return Array.from({ length: 4 }, (_, index) => ({
    id: `${topic.title.toLowerCase().replace(/\s+/g, '-')}-lesson-${index}`,
    title: `${topic.title} - Part ${index + 1}`,
    type: 'lesson' as const,
    questions: generateQuestionsFromContent(topic.content),
    isCompleted: false
  }));
}

function generateQuestionsFromContent(content: string): Question[] {
  // Simulate AI question generation
  return [
    {
      id: `q-${Date.now()}-1`,
      type: 'multiple-choice',
      question: 'What is the main concept discussed in this section?',
      options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
      correctAnswer: 'Concept A'
    },
    {
      id: `q-${Date.now()}-2`,
      type: 'fill-blank',
      question: 'Complete this key term: ______',
      correctAnswer: 'answer'
    }
  ];
}

async function readFileContent(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string || '');
    reader.readAsText(file);
  });
}