-- ========================================================================================
-- SYSTEM HARDENING: SOFT DELETE & PERFORMANCE INDEXES
-- ========================================================================================

-- 1. Add Soft Delete Columns
ALTER TABLE quizzes ADD COLUMN is_deleted BOOLEAN DEFAULT false;
ALTER TABLE quizzes ADD COLUMN deleted_at TIMESTAMPTZ;

ALTER TABLE flashcard_decks ADD COLUMN is_deleted BOOLEAN DEFAULT false;
ALTER TABLE flashcard_decks ADD COLUMN deleted_at TIMESTAMPTZ;

ALTER TABLE flashcards ADD COLUMN is_deleted BOOLEAN DEFAULT false;
ALTER TABLE flashcards ADD COLUMN deleted_at TIMESTAMPTZ;

ALTER TABLE notes ADD COLUMN is_deleted BOOLEAN DEFAULT false;
ALTER TABLE notes ADD COLUMN deleted_at TIMESTAMPTZ;

-- 2. Add Performance Indexes for Sorting & Filtering
CREATE INDEX IF NOT EXISTS idx_quizzes_deleted ON quizzes(is_deleted);
CREATE INDEX IF NOT EXISTS idx_flashcard_decks_deleted ON flashcard_decks(is_deleted);
CREATE INDEX IF NOT EXISTS idx_flashcards_deleted ON flashcards(is_deleted);
CREATE INDEX IF NOT EXISTS idx_notes_deleted ON notes(is_deleted);

CREATE INDEX IF NOT EXISTS idx_quizzes_created_at ON quizzes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_flashcard_decks_created_at ON flashcard_decks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);

-- 3. Update RLS to hide deleted data by default
-- Note: Existing policies need to be updated to include AND is_deleted = false
DROP POLICY IF EXISTS "quizzes_select" ON quizzes;
CREATE POLICY "quizzes_select" ON quizzes FOR SELECT USING ((auth.uid() = user_id OR is_public = true OR is_admin()) AND is_deleted = false);

DROP POLICY IF EXISTS "flashcard_decks_select" ON flashcard_decks;
CREATE POLICY "flashcard_decks_select" ON flashcard_decks FOR SELECT USING ((auth.uid() = user_id OR is_public = true OR is_admin()) AND is_deleted = false);

DROP POLICY IF EXISTS "notes_select" ON notes;
CREATE POLICY "notes_select" ON notes FOR SELECT USING ((auth.uid() = user_id OR is_public = true OR is_admin()) AND is_deleted = false);

-- 4. Transactional Batch Operations
CREATE OR REPLACE FUNCTION batch_update_quiz_questions(
    quiz_id_param UUID,
    questions_json JSONB
) RETURNS VOID AS $$
BEGIN
    DELETE FROM quiz_questions WHERE quiz_id = quiz_id_param;
    
    INSERT INTO quiz_questions (quiz_id, user_id, question, options, correct_answer, explanation, points, order_num)
    SELECT 
        quiz_id_param,
        (SELECT user_id FROM quizzes WHERE id = quiz_id_param),
        q->>'question',
        (q->'options')::jsonb,
        (q->>'correct_answer')::integer,
        q->>'explanation',
        COALESCE((q->>'points')::integer, 1),
        COALESCE((q->>'order_num')::integer, 0)
    FROM jsonb_array_elements(questions_json) AS q;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION batch_update_flashcards(
    deck_id_param UUID,
    cards_json JSONB
) RETURNS VOID AS $$
BEGIN
    DELETE FROM flashcards WHERE deck_id = deck_id_param;
    
    INSERT INTO flashcards (deck_id, user_id, front, back)
    SELECT 
        deck_id_param,
        (SELECT user_id FROM flashcard_decks WHERE id = deck_id_param),
        c->>'front',
        c->>'back'
    FROM jsonb_array_elements(cards_json) AS c;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Rate Limiting Table
CREATE TABLE IF NOT EXISTS rate_limits (
    key TEXT PRIMARY KEY,
    attempts INTEGER DEFAULT 0,
    last_attempt TIMESTAMPTZ DEFAULT NOW()
);
