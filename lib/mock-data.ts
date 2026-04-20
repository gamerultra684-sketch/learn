// ============================================================
// Learn Center — Mock Data
// Structured as API-ready: replace with fetch('/api/...') calls
// ============================================================

import type {
  User, Quiz, Question, Note, FlashcardDeck, Flashcard,
  QuizAttempt, FlashcardStudy, SubjectStat, DashboardStats,
  WeeklyActivity, QuizHistory, SQ3RSession,
} from './types';

// ------------------------------------------------------------------
// Users
// ------------------------------------------------------------------
export const MOCK_USERS: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@learncenter.com',
    role: 'admin',
    avatar: 'default-avatar.png',
    created_at: '2024-01-01T00:00:00Z',
    full_name: 'Administrator',
  },
  {
    id: 2,
    username: 'budi_santoso',
    email: 'budi@example.com',
    role: 'user',
    avatar: 'default-avatar.png',
    created_at: '2024-02-15T08:30:00Z',
    full_name: 'Budi Santoso',
  },
  {
    id: 3,
    username: 'siti_rahma',
    email: 'siti@example.com',
    role: 'user',
    avatar: 'default-avatar.png',
    created_at: '2024-03-20T10:00:00Z',
    full_name: 'Siti Rahma',
  },
];

// ------------------------------------------------------------------
// Quizzes
// ------------------------------------------------------------------
export const MOCK_QUIZZES: Quiz[] = [
  {
    id: 1,
    title: 'Matematika Dasar — Aljabar',
    subject: 'Matematika',
    description: 'Uji kemampuan aljabar dasar Anda mulai dari persamaan linear hingga kuadrat.',
    total_questions: 10,
    difficulty: 'medium',
    created_at: '2024-01-10T00:00:00Z',
    created_by: 1,
    is_active: true,
    time_limit: 30,
  },
  {
    id: 2,
    title: 'Fisika — Mekanika Klasik',
    subject: 'Fisika',
    description: 'Hukum Newton, gerak parabola, dan energi mekanik.',
    total_questions: 15,
    difficulty: 'hard',
    created_at: '2024-01-15T00:00:00Z',
    created_by: 1,
    is_active: true,
    time_limit: 45,
  },
  {
    id: 3,
    title: 'Bahasa Indonesia — Tata Bahasa',
    subject: 'Bahasa Indonesia',
    description: 'Ejaan, kalimat efektif, dan paragraf yang baik.',
    total_questions: 20,
    difficulty: 'easy',
    created_at: '2024-02-01T00:00:00Z',
    created_by: 1,
    is_active: true,
    time_limit: 25,
  },
  {
    id: 4,
    title: 'Kimia — Ikatan Kimia',
    subject: 'Kimia',
    description: 'Ikatan ion, kovalen, dan logam beserta sifat-sifatnya.',
    total_questions: 12,
    difficulty: 'medium',
    created_at: '2024-02-10T00:00:00Z',
    created_by: 1,
    is_active: true,
    time_limit: 35,
  },
  {
    id: 5,
    title: 'Biologi — Sel dan Genetika',
    subject: 'Biologi',
    description: 'Struktur sel, mitosis, meiosis, dan hukum Mendel.',
    total_questions: 18,
    difficulty: 'hard',
    created_at: '2024-02-20T00:00:00Z',
    created_by: 1,
    is_active: true,
    time_limit: 40,
  },
];

// ------------------------------------------------------------------
// Questions (for Quiz #1)
// ------------------------------------------------------------------
export const MOCK_QUESTIONS: Question[] = [
  {
    id: 1,
    quiz_id: 1,
    question_text: 'Berapakah nilai x jika 2x + 4 = 12?',
    option_a: '3',
    option_b: '4',
    option_c: '6',
    option_d: '8',
    correct_answer: 'b',
    points: 10,
    explanation: '2x = 12 - 4 = 8, maka x = 4',
  },
  {
    id: 2,
    quiz_id: 1,
    question_text: 'Hasil dari (x + 2)(x - 3) adalah...',
    option_a: 'x² - x - 6',
    option_b: 'x² + x - 6',
    option_c: 'x² - x + 6',
    option_d: 'x² + x + 6',
    correct_answer: 'a',
    points: 10,
    explanation: 'FOIL: x² - 3x + 2x - 6 = x² - x - 6',
  },
  {
    id: 3,
    quiz_id: 1,
    question_text: 'Jika f(x) = 3x² - 2x + 1, berapakah f(2)?',
    option_a: '9',
    option_b: '10',
    option_c: '11',
    option_d: '12',
    correct_answer: 'a',
    points: 10,
    explanation: 'f(2) = 3(4) - 2(2) + 1 = 12 - 4 + 1 = 9',
  },
];

// ------------------------------------------------------------------
// Notes
// ------------------------------------------------------------------
export const MOCK_NOTES: Note[] = [
  {
    id: 1,
    user_id: 2,
    title: 'Ringkasan Hukum Newton',
    content: '<p>Hukum I Newton: Setiap benda akan tetap dalam keadaan diam atau bergerak lurus beraturan kecuali ada gaya yang bekerja padanya.</p><p>Hukum II Newton: F = ma</p><p>Hukum III Newton: Setiap aksi memiliki reaksi yang sama besar dan berlawanan arah.</p>',
    subject: 'Fisika',
    is_public: true,
    created_at: '2024-03-01T08:00:00Z',
    updated_at: '2024-03-01T08:00:00Z',
    username: 'budi_santoso',
  },
  {
    id: 2,
    user_id: 2,
    title: 'Catatan Aljabar Linear',
    content: '<p>Sistem persamaan linear dapat diselesaikan dengan metode substitusi, eliminasi, atau matriks.</p>',
    subject: 'Matematika',
    is_public: false,
    created_at: '2024-03-05T10:30:00Z',
    updated_at: '2024-03-05T10:30:00Z',
    username: 'budi_santoso',
  },
  {
    id: 3,
    user_id: 3,
    title: 'Struktur Sel Eukariotik',
    content: '<p>Sel eukariotik memiliki membran inti yang membungkus DNA. Organel utama: mitokondria, ribosom, retikulum endoplasma, aparatus Golgi.</p>',
    subject: 'Biologi',
    is_public: true,
    created_at: '2024-03-10T14:00:00Z',
    updated_at: '2024-03-10T14:00:00Z',
    username: 'siti_rahma',
  },
];

// ------------------------------------------------------------------
// Flashcard Decks
// ------------------------------------------------------------------
export const MOCK_FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 1,
    title: 'Rumus Fisika SMA',
    subject: 'Fisika',
    description: 'Kumpulan rumus fisika yang sering keluar di ujian.',
    card_count: 25,
    created_by: 1,
    created_at: '2024-01-20T00:00:00Z',
    is_active: true,
  },
  {
    id: 2,
    title: 'Kosa Kata Bahasa Inggris',
    subject: 'Bahasa Inggris',
    description: 'Vocabulary untuk TOEFL dan IELTS.',
    card_count: 100,
    created_by: 1,
    created_at: '2024-01-25T00:00:00Z',
    is_active: true,
  },
  {
    id: 3,
    title: 'Tabel Periodik Kimia',
    subject: 'Kimia',
    description: 'Unsur-unsur kimia beserta nomor atom dan massa atom.',
    card_count: 30,
    created_by: 1,
    created_at: '2024-02-05T00:00:00Z',
    is_active: true,
  },
];

// ------------------------------------------------------------------
// Flashcards (for Deck #1)
// ------------------------------------------------------------------
export const MOCK_FLASHCARDS: Flashcard[] = [
  { id: 1, deck_id: 1, front: 'Rumus kecepatan', back: 'v = s/t\n(kecepatan = jarak / waktu)', order_num: 1 },
  { id: 2, deck_id: 1, front: 'Rumus gaya (Hukum II Newton)', back: 'F = m × a\n(gaya = massa × percepatan)', order_num: 2 },
  { id: 3, deck_id: 1, front: 'Rumus energi kinetik', back: 'Ek = ½mv²\n(massa × kuadrat kecepatan / 2)', order_num: 3 },
  { id: 4, deck_id: 1, front: 'Rumus energi potensial', back: 'Ep = mgh\n(massa × gravitasi × ketinggian)', order_num: 4 },
  { id: 5, deck_id: 1, front: 'Rumus usaha', back: 'W = F × s × cos θ', order_num: 5 },
];

// ------------------------------------------------------------------
// Quiz Attempts
// ------------------------------------------------------------------
export const MOCK_QUIZ_ATTEMPTS: QuizAttempt[] = [
  { id: 1, quiz_id: 1, user_id: 2, score: 80, total_points: 100, mode: 'exam', completed_at: '2024-04-10T09:00:00Z', quiz_title: 'Matematika Dasar — Aljabar', subject: 'Matematika', username: 'budi_santoso' },
  { id: 2, quiz_id: 2, user_id: 2, score: 65, total_points: 100, mode: 'study', completed_at: '2024-04-11T10:30:00Z', quiz_title: 'Fisika — Mekanika Klasik', subject: 'Fisika', username: 'budi_santoso' },
  { id: 3, quiz_id: 3, user_id: 3, score: 90, total_points: 100, mode: 'exam', completed_at: '2024-04-12T14:00:00Z', quiz_title: 'Bahasa Indonesia — Tata Bahasa', subject: 'Bahasa Indonesia', username: 'siti_rahma' },
  { id: 4, quiz_id: 4, user_id: 2, score: 75, total_points: 100, mode: 'exam', completed_at: '2024-04-13T11:00:00Z', quiz_title: 'Kimia — Ikatan Kimia', subject: 'Kimia', username: 'budi_santoso' },
  { id: 5, quiz_id: 5, user_id: 3, score: 55, total_points: 100, mode: 'study', completed_at: '2024-04-14T15:30:00Z', quiz_title: 'Biologi — Sel dan Genetika', subject: 'Biologi', username: 'siti_rahma' },
];

// ------------------------------------------------------------------
// Flashcard Study History
// ------------------------------------------------------------------
export const MOCK_FLASHCARD_STUDY: FlashcardStudy[] = [
  { deck_id: 1, deck_title: 'Rumus Fisika SMA', subject: 'Fisika', studied_at: '2024-04-14T09:00:00Z', username: 'budi_santoso' },
  { deck_id: 2, deck_title: 'Kosa Kata Bahasa Inggris', subject: 'Bahasa Inggris', studied_at: '2024-04-13T11:00:00Z', username: 'siti_rahma' },
  { deck_id: 3, deck_title: 'Tabel Periodik Kimia', subject: 'Kimia', studied_at: '2024-04-12T14:00:00Z', username: 'budi_santoso' },
];

// ------------------------------------------------------------------
// Dashboard Stats
// ------------------------------------------------------------------
export const MOCK_USER_STATS: DashboardStats = {
  quiz_attempts: 12,
  avg_score: 74.5,
  flashcards_studied: 48,
  total_notes: 5,
  streak: 3,
};

export const MOCK_ADMIN_STATS: DashboardStats = {
  quiz_attempts: 247,
  avg_score: 71.2,
  flashcards_studied: 1024,
  total_notes: 89,
  total_users: 42,
};

// ------------------------------------------------------------------
// Subject Stats
// ------------------------------------------------------------------
export const MOCK_SUBJECT_STATS: SubjectStat[] = [
  { subject: 'Matematika', attempts: 45, avg_score: 72.3 },
  { subject: 'Fisika', attempts: 38, avg_score: 68.1 },
  { subject: 'Kimia', attempts: 29, avg_score: 75.8 },
  { subject: 'Biologi', attempts: 52, avg_score: 80.2 },
  { subject: 'Bahasa Indonesia', attempts: 41, avg_score: 85.4 },
];

// ------------------------------------------------------------------
// Quiz History (30 days)
// ------------------------------------------------------------------
export const MOCK_QUIZ_HISTORY: QuizHistory[] = [
  { date: '2024-04-01', avg_score: 65, attempts: 3 },
  { date: '2024-04-03', avg_score: 70, attempts: 2 },
  { date: '2024-04-05', avg_score: 75, attempts: 4 },
  { date: '2024-04-07', avg_score: 68, attempts: 1 },
  { date: '2024-04-09', avg_score: 80, attempts: 5 },
  { date: '2024-04-11', avg_score: 72, attempts: 3 },
  { date: '2024-04-13', avg_score: 85, attempts: 6 },
  { date: '2024-04-15', avg_score: 78, attempts: 4 },
];

// ------------------------------------------------------------------
// Weekly Activity
// ------------------------------------------------------------------
export const MOCK_WEEKLY_ACTIVITY: WeeklyActivity[] = [
  { day_num: 0, quiz_count: 2 },  // Minggu
  { day_num: 1, quiz_count: 5 },  // Senin
  { day_num: 2, quiz_count: 3 },  // Selasa
  { day_num: 3, quiz_count: 7 },  // Rabu
  { day_num: 4, quiz_count: 4 },  // Kamis
  { day_num: 5, quiz_count: 6 },  // Jumat
  { day_num: 6, quiz_count: 1 },  // Sabtu
];

// ------------------------------------------------------------------
// SQ3R Sessions
// ------------------------------------------------------------------
export const MOCK_SQ3R_SESSIONS: SQ3RSession[] = [];
