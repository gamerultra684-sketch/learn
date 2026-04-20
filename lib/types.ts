// ============================================================
// Learn Center — Shared TypeScript Types
// Structured as API-ready interfaces (swap mock data for fetch)
// ============================================================

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  avatar: string;
  created_at: string;
  full_name?: string;
  bio?: string;
}

export interface AuthUser extends User {
  csrf_token?: string;
}

export interface Quiz {
  id: number;
  title: string;
  subject: string;
  description: string;
  total_questions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
  created_by: number;
  is_active: boolean;
  time_limit?: number; // minutes
}

export interface Question {
  id: number;
  quiz_id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'a' | 'b' | 'c' | 'd';
  points: number;
  explanation?: string;
}

export interface QuizAttempt {
  id: number;
  quiz_id: number;
  user_id: number;
  score: number;
  total_points: number;
  mode: 'study' | 'exam';
  completed_at: string;
  quiz_title: string;
  subject: string;
  username?: string; // admin view
}

export interface Note {
  id: number;
  user_id: number;
  title: string;
  content: string;
  subject?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  username?: string; // admin view
}

export interface FlashcardDeck {
  id: number;
  title: string;
  subject: string;
  description: string;
  card_count: number;
  created_by: number;
  created_at: string;
  is_active: boolean;
}

export interface Flashcard {
  id: number;
  deck_id: number;
  front: string;
  back: string;
  order_num: number;
}

export interface FlashcardStudy {
  deck_id: number;
  deck_title: string;
  subject: string;
  studied_at: string;
  username?: string;
}

export interface SubjectStat {
  subject: string;
  attempts: number;
  avg_score: number;
}

export interface DashboardStats {
  quiz_attempts: number;
  avg_score: number;
  flashcards_studied: number;
  total_notes: number;
  total_users?: number; // admin only
  streak?: number;      // user only
}

export interface WeeklyActivity {
  day_num: number; // 0=Sun … 6=Sat
  quiz_count: number;
}

export interface QuizHistory {
  date: string;
  avg_score: number;
  attempts: number;
}

export interface SQ3RSession {
  id: string;
  text: string;
  survey: string;
  questions: string[];
  reading_notes: string;
  recite: string;
  review: string;
  created_at: string;
}

export interface MindPalaceRoom {
  id: string;
  name: string;
  items: MindPalaceItem[];
}

export interface MindPalaceItem {
  id: string;
  label: string;
  description: string;
  x: number;
  y: number;
}

export interface ToastType {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
