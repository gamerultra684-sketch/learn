-- ========================================================================================
-- PRODUCTION QUIZ SYSTEM UPDATE
-- ========================================================================================

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Update quiz_questions table
ALTER TABLE quiz_questions 
  ALTER COLUMN id SET DEFAULT gen_random_uuid(),
  ALTER COLUMN correct_answer TYPE TEXT,
  ADD COLUMN IF NOT EXISTS question_type VARCHAR(50) DEFAULT 'multiple_choice',
  ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 1;

-- 2. Update quiz_results table
ALTER TABLE quiz_results
  ALTER COLUMN id SET DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '{}';

-- 3. Fix UUID defaults for other quiz-related tables
ALTER TABLE quizzes ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 4. Create SAFE VIEW for quiz questions (excludes correct_answer)
-- This view allows the client to fetch questions without sensitive data.
CREATE OR REPLACE VIEW quiz_questions_safe AS
SELECT 
    id, 
    quiz_id, 
    user_id, 
    question, 
    question_type,
    options, 
    explanation, 
    points,
    created_at
FROM quiz_questions;

-- Grant access to the view (follows RLS of the underlying table)
GRANT SELECT ON quiz_questions_safe TO authenticated;

-- 5. Update RLS for quiz_results to be more strict
-- Prevent users from seeing others' results
DROP POLICY IF EXISTS "quiz_results_select" ON quiz_results;
CREATE POLICY "quiz_results_select" ON quiz_results FOR SELECT USING (auth.uid() = user_id OR is_admin());

-- 6. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_quiz_questions_type ON quiz_questions(question_type);
CREATE INDEX IF NOT EXISTS idx_quiz_results_completed ON quiz_results(completed_at);
