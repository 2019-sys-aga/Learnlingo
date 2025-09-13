/*
  # Create Learning Platform Schema

  1. New Tables
    - `courses` - Store course information
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `language` (text)
      - `flag` (text)
      - `progress` (integer)
      - `user_id` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `skills` - Store skill/topic information
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `level` (integer)
      - `max_level` (integer)
      - `is_unlocked` (boolean)
      - `is_completed` (boolean)
      - `position_x` (integer)
      - `position_y` (integer)
      - `order_index` (integer)
      - `created_at` (timestamp)
    
    - `lessons` - Store lesson information
      - `id` (uuid, primary key)
      - `skill_id` (uuid, foreign key)
      - `title` (text)
      - `type` (text)
      - `is_completed` (boolean)
      - `order_index` (integer)
      - `created_at` (timestamp)
    
    - `questions` - Store AI-generated questions
      - `id` (uuid, primary key)
      - `lesson_id` (uuid, foreign key)
      - `type` (text)
      - `question` (text)
      - `options` (jsonb)
      - `correct_answer` (jsonb)
      - `explanation` (text)
      - `audio_url` (text)
      - `image_url` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)
    
    - `user_progress` - Track user answers and progress
      - `id` (uuid, primary key)
      - `user_id` (text)
      - `lesson_id` (uuid, foreign key)
      - `question_id` (uuid, foreign key)
      - `answer_given` (text)
      - `is_correct` (boolean)
      - `completed_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  language text NOT NULL DEFAULT 'General',
  flag text NOT NULL DEFAULT '📚',
  progress integer NOT NULL DEFAULT 0,
  user_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  level integer NOT NULL DEFAULT 0,
  max_level integer NOT NULL DEFAULT 5,
  is_unlocked boolean NOT NULL DEFAULT false,
  is_completed boolean NOT NULL DEFAULT false,
  position_x integer NOT NULL DEFAULT 50,
  position_y integer NOT NULL DEFAULT 100,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  title text NOT NULL,
  type text NOT NULL DEFAULT 'lesson',
  is_completed boolean NOT NULL DEFAULT false,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  type text NOT NULL,
  question text NOT NULL,
  options jsonb,
  correct_answer jsonb NOT NULL,
  explanation text,
  audio_url text,
  image_url text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_given text NOT NULL,
  is_correct boolean NOT NULL,
  completed_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for courses
CREATE POLICY "Users can manage their own courses"
  ON courses
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Create RLS policies for skills
CREATE POLICY "Users can access skills from their courses"
  ON skills
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = skills.course_id 
      AND courses.user_id = auth.uid()::text
    )
  );

-- Create RLS policies for lessons
CREATE POLICY "Users can access lessons from their skills"
  ON lessons
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM skills 
      JOIN courses ON courses.id = skills.course_id
      WHERE skills.id = lessons.skill_id 
      AND courses.user_id = auth.uid()::text
    )
  );

-- Create RLS policies for questions
CREATE POLICY "Users can access questions from their lessons"
  ON questions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lessons 
      JOIN skills ON skills.id = lessons.skill_id
      JOIN courses ON courses.id = skills.course_id
      WHERE lessons.id = questions.lesson_id 
      AND courses.user_id = auth.uid()::text
    )
  );

-- Create RLS policies for user_progress
CREATE POLICY "Users can manage their own progress"
  ON user_progress
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_user_id ON courses(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_course_id ON skills(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_skill_id ON lessons(skill_id);
CREATE INDEX IF NOT EXISTS idx_questions_lesson_id ON questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON user_progress(lesson_id);

-- Create updated_at trigger for courses
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_courses_updated_at 
  BEFORE UPDATE ON courses 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();