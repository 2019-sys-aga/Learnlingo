import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Course {
  id: string;
  title: string;
  description: string;
  language: string;
  flag: string;
  progress: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  course_id: string;
  title: string;
  description: string;
  level: number;
  max_level: number;
  is_unlocked: boolean;
  is_completed: boolean;
  position_x: number;
  position_y: number;
  order_index: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  skill_id: string;
  title: string;
  type: 'lesson' | 'story' | 'speaking' | 'listening';
  is_completed: boolean;
  order_index: number;
  created_at: string;
}

export interface Question {
  id: string;
  lesson_id: string;
  type: 'multiple-choice' | 'fill-blank' | 'true-false' | 'short-answer' | 'image-select';
  question: string;
  options: string[] | null;
  correct_answer: string | string[];
  explanation: string | null;
  audio_url: string | null;
  image_url: string | null;
  order_index: number;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  question_id: string;
  is_correct: boolean;
  answer_given: string;
  completed_at: string;
}