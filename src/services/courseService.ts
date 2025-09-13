import { supabase, type Course, type Skill, type Lesson, type Question } from '@/lib/supabase';
import { AIContentProcessor, type ExtractedContent, type GeneratedQuestion } from '@/lib/openai';
import { PDFProcessor } from '@/lib/pdfProcessor';

export class CourseService {
  static async createCourseFromFile(file: File, userId: string): Promise<Course> {
    try {
      // Step 1: Extract text from file
      const extractedText = await PDFProcessor.extractTextFromFile(file);
      
      // Step 2: Use AI to analyze content
      const aiContent = await AIContentProcessor.extractContentFromText(extractedText, file.name);
      
      // Step 3: Create course in database
      const course = await this.createCourseInDatabase(aiContent, userId);
      
      // Step 4: Create skills and lessons
      await this.createSkillsAndLessons(course.id, aiContent);
      
      return course;
    } catch (error) {
      console.error('Error creating course from file:', error);
      throw error;
    }
  }

  private static async createCourseInDatabase(content: ExtractedContent, userId: string): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .insert({
        title: content.title,
        description: `AI-generated course: ${content.title}`,
        language: content.language,
        flag: this.getLanguageFlag(content.language),
        progress: 0,
        user_id: userId
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  private static async createSkillsAndLessons(courseId: string, content: ExtractedContent): Promise<void> {
    for (let i = 0; i < content.topics.length; i++) {
      const topic = content.topics[i];
      
      // Create skill
      const { data: skill, error: skillError } = await supabase
        .from('skills')
        .insert({
          course_id: courseId,
          title: topic.title,
          description: topic.description,
          level: 0,
          max_level: 5,
          is_unlocked: i === 0, // Only first skill is unlocked
          is_completed: false,
          position_x: 50,
          position_y: 100 + (i * 120),
          order_index: i
        })
        .select()
        .single();

      if (skillError) throw skillError;

      // Create lessons for this skill
      const lessons = await this.createLessonsForSkill(skill.id, topic);
      
      // Generate questions for each lesson
      for (const lesson of lessons) {
        await this.generateQuestionsForLesson(lesson.id, topic);
      }
    }
  }

  private static async createLessonsForSkill(skillId: string, topic: any): Promise<Lesson[]> {
    const lessonTypes = ['lesson', 'lesson', 'story', 'speaking'] as const;
    const lessons: Lesson[] = [];

    for (let i = 0; i < 4; i++) {
      const { data: lesson, error } = await supabase
        .from('lessons')
        .insert({
          skill_id: skillId,
          title: `${topic.title} - Part ${i + 1}`,
          type: lessonTypes[i % lessonTypes.length],
          is_completed: false,
          order_index: i
        })
        .select()
        .single();

      if (error) throw error;
      lessons.push(lesson);
    }

    return lessons;
  }

  private static async generateQuestionsForLesson(lessonId: string, topic: any): Promise<void> {
    // Generate AI questions
    const aiQuestions = await AIContentProcessor.generateQuestionsForTopic(topic);
    
    for (let i = 0; i < aiQuestions.length; i++) {
      const question = aiQuestions[i];
      
      const { error } = await supabase
        .from('questions')
        .insert({
          lesson_id: lessonId,
          type: question.type,
          question: question.question,
          options: question.options || null,
          correct_answer: question.correctAnswer,
          explanation: question.explanation,
          audio_url: null,
          image_url: null,
          order_index: i
        });

      if (error) throw error;
    }
  }

  static async getCourseWithDetails(courseId: string): Promise<any> {
    // Get course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (courseError) throw courseError;

    // Get skills with lessons and questions
    const { data: skills, error: skillsError } = await supabase
      .from('skills')
      .select(`
        *,
        lessons (
          *,
          questions (*)
        )
      `)
      .eq('course_id', courseId)
      .order('order_index');

    if (skillsError) throw skillsError;

    return {
      ...course,
      skills: skills.map(skill => ({
        ...skill,
        position: { x: skill.position_x, y: skill.position_y },
        isUnlocked: skill.is_unlocked,
        isCompleted: skill.is_completed,
        maxLevel: skill.max_level,
        lessons: skill.lessons.map((lesson: any) => ({
          ...lesson,
          isCompleted: lesson.is_completed,
          questions: lesson.questions
        }))
      }))
    };
  }

  static async getUserCourses(userId: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async updateLessonProgress(lessonId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('lessons')
      .update({ is_completed: true })
      .eq('id', lessonId);

    if (error) throw error;
  }

  static async saveUserAnswer(
    userId: string,
    lessonId: string,
    questionId: string,
    answerGiven: string,
    isCorrect: boolean
  ): Promise<void> {
    const { error } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        question_id: questionId,
        answer_given: answerGiven,
        is_correct: isCorrect
      });

    if (error) throw error;
  }

  private static getLanguageFlag(language: string): string {
    const flags: Record<string, string> = {
      'Spanish': '🇪🇸',
      'French': '🇫🇷',
      'German': '🇩🇪',
      'Italian': '🇮🇹',
      'Portuguese': '🇵🇹',
      'English': '🇺🇸',
      'Math': '🔢',
      'Science': '🔬',
      'History': '📚',
      'General': '📖'
    };
    
    return flags[language] || '📚';
  }
}