-- ========================================================================================
-- LEARN CENTER - DATABASE SCHEMA
-- Target: PostgreSQL (Supabase)
-- ========================================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ───────────────────────────────────────────────────────────────────────────────────────
-- 1. UTILITIES & TRIGGERS
-- ───────────────────────────────────────────────────────────────────────────────────────
-- Function to automatically update `updated_at` timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ───────────────────────────────────────────────────────────────────────────────────────
-- 2. PROFILES (Extends auth.users)
-- ───────────────────────────────────────────────────────────────────────────────────────
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(255) UNIQUE NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON profiles(role);

-- Trigger to create profile when auth.user is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to allow safe re-runs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Trigger for updated_at
DROP TRIGGER IF EXISTS set_profiles_updated_at ON profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


-- ───────────────────────────────────────────────────────────────────────────────────────
-- 3. FOLDERS
-- ───────────────────────────────────────────────────────────────────────────────────────
CREATE TABLE folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

CREATE INDEX idx_folders_user_id ON folders(user_id);

DROP TRIGGER IF EXISTS set_folders_updated_at ON folders;
CREATE TRIGGER set_folders_updated_at BEFORE UPDATE ON folders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


-- ───────────────────────────────────────────────────────────────────────────────────────
-- 4. NOTES
-- ───────────────────────────────────────────────────────────────────────────────────────
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_folder_id ON notes(folder_id);
CREATE INDEX idx_notes_is_public ON notes(is_public);

DROP TRIGGER IF EXISTS set_notes_updated_at ON notes;
CREATE TRIGGER set_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();


-- ───────────────────────────────────────────────────────────────────────────────────────
-- 5. QUIZZES & QUESTIONS
-- ───────────────────────────────────────────────────────────────────────────────────────
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100),
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quizzes_user_id ON quizzes(user_id);
CREATE INDEX idx_quizzes_is_public ON quizzes(is_public);

DROP TRIGGER IF EXISTS set_quizzes_updated_at ON quizzes;
CREATE TRIGGER set_quizzes_updated_at BEFORE UPDATE ON quizzes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Format: ["A", "B", "C", "D"]
    correct_answer INTEGER NOT NULL, -- Index of correct option (0-3)
    explanation TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX idx_quiz_questions_user_id ON quiz_questions(user_id);

CREATE TABLE quiz_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_points INTEGER NOT NULL,
    mode VARCHAR(50) DEFAULT 'study' CHECK (mode IN ('study', 'exam')),
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX idx_quiz_results_quiz_id ON quiz_results(quiz_id);


-- ───────────────────────────────────────────────────────────────────────────────────────
-- 6. FLASHCARDS
-- ───────────────────────────────────────────────────────────────────────────────────────
CREATE TABLE flashcard_decks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100),
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_flashcard_decks_user_id ON flashcard_decks(user_id);
CREATE INDEX idx_flashcard_decks_is_public ON flashcard_decks(is_public);

DROP TRIGGER IF EXISTS set_flashcard_decks_updated_at ON flashcard_decks;
CREATE TRIGGER set_flashcard_decks_updated_at BEFORE UPDATE ON flashcard_decks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TABLE flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deck_id UUID NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_flashcards_deck_id ON flashcards(deck_id);
CREATE INDEX idx_flashcards_user_id ON flashcards(user_id);

-- Spaced Repetition / Progress tracking
CREATE TABLE flashcard_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    flashcard_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
    box INTEGER DEFAULT 1,         -- Leitner system box (1-5)
    next_review TIMESTAMPTZ DEFAULT NOW(),
    last_reviewed TIMESTAMPTZ,
    UNIQUE(user_id, flashcard_id)
);

CREATE INDEX idx_flashcard_progress_user_id ON flashcard_progress(user_id);
CREATE INDEX idx_flashcard_progress_review ON flashcard_progress(next_review);


-- ───────────────────────────────────────────────────────────────────────────────────────
-- 7. LEARNING SESSIONS (SQ3R, Mind Palace, etc.)
-- ───────────────────────────────────────────────────────────────────────────────────────
CREATE TABLE learning_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    module_type VARCHAR(100) NOT NULL, -- 'SQ3R', 'MindPalace', 'DualCoding'
    
    -- Type-safe relational strategy for content reference
    note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    deck_id UUID REFERENCES flashcard_decks(id) ON DELETE CASCADE,
    
    state JSONB,         -- Stores progress (e.g. current SQ3R step)
    started_at TIMESTAMPTZ DEFAULT NOW(),
    last_accessed TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure a session refers to at most one entity
    CONSTRAINT has_max_one_ref CHECK (
      (note_id IS NOT NULL)::integer +
      (quiz_id IS NOT NULL)::integer +
      (deck_id IS NOT NULL)::integer <= 1
    )
);

CREATE INDEX idx_learning_sessions_user_id ON learning_sessions(user_id);


-- ========================================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================================================

-- Enable RLS for all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;

-- Helper to determine if current user is admin (Optimized)
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ───────────────────────────────────────────────────────────────────────────────────────
-- 1. Profiles
-- ───────────────────────────────────────────────────────────────────────────────────────
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);
-- Note: Insert is handled by trigger, Delete by auth.users cascade.


-- ───────────────────────────────────────────────────────────────────────────────────────
-- 2. Folders
-- ───────────────────────────────────────────────────────────────────────────────────────
CREATE POLICY "folders_select" ON folders FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "folders_insert" ON folders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "folders_update" ON folders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "folders_delete" ON folders FOR DELETE USING (auth.uid() = user_id OR is_admin());


-- ───────────────────────────────────────────────────────────────────────────────────────
-- 3. Notes
-- ───────────────────────────────────────────────────────────────────────────────────────
CREATE POLICY "notes_select" ON notes FOR SELECT USING (auth.uid() = user_id OR is_public = true OR is_admin());
CREATE POLICY "notes_insert" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "notes_update" ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "notes_delete" ON notes FOR DELETE USING (auth.uid() = user_id OR is_admin());


-- ───────────────────────────────────────────────────────────────────────────────────────
-- 4. Quizzes
-- ───────────────────────────────────────────────────────────────────────────────────────
CREATE POLICY "quizzes_select" ON quizzes FOR SELECT USING (auth.uid() = user_id OR is_public = true OR is_admin());
CREATE POLICY "quizzes_insert" ON quizzes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "quizzes_update" ON quizzes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "quizzes_delete" ON quizzes FOR DELETE USING (auth.uid() = user_id OR is_admin());

-- Quiz Questions (inherit access from Quiz)
CREATE POLICY "quiz_questions_select" ON quiz_questions FOR SELECT USING (
    auth.uid() = user_id OR is_admin() OR 
    EXISTS (SELECT 1 FROM quizzes WHERE id = quiz_questions.quiz_id AND is_public = true)
);
CREATE POLICY "quiz_questions_insert" ON quiz_questions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "quiz_questions_update" ON quiz_questions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "quiz_questions_delete" ON quiz_questions FOR DELETE USING (auth.uid() = user_id OR is_admin());

-- Quiz Results
CREATE POLICY "quiz_results_select" ON quiz_results FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "quiz_results_insert" ON quiz_results FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (SELECT 1 FROM quizzes WHERE id = quiz_results.quiz_id AND (user_id = auth.uid() OR is_public = true OR is_admin()))
);
CREATE POLICY "quiz_results_update" ON quiz_results FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "quiz_results_delete" ON quiz_results FOR DELETE USING (auth.uid() = user_id OR is_admin());


-- ───────────────────────────────────────────────────────────────────────────────────────
-- 5. Flashcards
-- ───────────────────────────────────────────────────────────────────────────────────────
CREATE POLICY "flashcard_decks_select" ON flashcard_decks FOR SELECT USING (auth.uid() = user_id OR is_public = true OR is_admin());
CREATE POLICY "flashcard_decks_insert" ON flashcard_decks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "flashcard_decks_update" ON flashcard_decks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "flashcard_decks_delete" ON flashcard_decks FOR DELETE USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "flashcards_select" ON flashcards FOR SELECT USING (
    auth.uid() = user_id OR is_admin() OR
    EXISTS (SELECT 1 FROM flashcard_decks WHERE id = flashcards.deck_id AND is_public = true)
);
CREATE POLICY "flashcards_insert" ON flashcards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "flashcards_update" ON flashcards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "flashcards_delete" ON flashcards FOR DELETE USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "flashcard_progress_select" ON flashcard_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "flashcard_progress_insert" ON flashcard_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "flashcard_progress_update" ON flashcard_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "flashcard_progress_delete" ON flashcard_progress FOR DELETE USING (auth.uid() = user_id);


-- ───────────────────────────────────────────────────────────────────────────────────────
-- 6. Learning Sessions
-- ───────────────────────────────────────────────────────────────────────────────────────
CREATE POLICY "learning_sessions_select" ON learning_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "learning_sessions_insert" ON learning_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "learning_sessions_update" ON learning_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "learning_sessions_delete" ON learning_sessions FOR DELETE USING (auth.uid() = user_id);

-- ========================================================================================
-- END OF SCHEMA
-- ========================================================================================
