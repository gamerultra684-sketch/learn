'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSearch, FaQuestionCircle, FaArrowRight, FaClock, FaList } from 'react-icons/fa';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import { getDifficultyColor, formatDate } from '@/lib/utils';

const diffLabel: Record<string, string> = { easy: 'Mudah', medium: 'Sedang', hard: 'Sulit' };

export default function QuizListPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/quizzes')
      .then(res => res.json())
      .then(json => {
        if (json.data) setQuizzes(json.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredQuizzes = quizzes.filter((q) => {
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) || 
                      (q.subject && q.subject.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === 'all' || q.difficulty === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Daftar Quiz</h1>
        <p className="text-gray-500 dark:text-gray-400">Pilih quiz dan uji pengetahuan Anda</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari quiz atau mata pelajaran..."
            className="w-full pl-11 pr-4 py-3 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div className="flex gap-2">
          {['all', 'easy', 'medium', 'hard'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f ? 'bg-primary-600 text-white' : 'glass hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              {f === 'all' ? 'Semua' : diffLabel[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <GlassCard key={quiz.id} hover className="flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <FaQuestionCircle className="text-blue-600 text-xl" />
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <Badge variant="info">{quiz.subject}</Badge>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                  {diffLabel[quiz.difficulty]}
                </span>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-2">{quiz.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1 line-clamp-2">{quiz.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
              <span><FaList className="inline mr-1" />{quiz.total_questions} soal</span>
              <span><FaClock className="inline mr-1" />{quiz.time_limit} menit</span>
              <span>{formatDate(quiz.created_at, { day: 'numeric', month: 'short' })}</span>
            </div>
            <div className="flex gap-2">
              <Link href={`/quiz/${quiz.id}?mode=study`}
                className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-200 transition-colors text-sm font-medium">
                Study
              </Link>
              <Link href={`/quiz/${quiz.id}?mode=exam`}
                className="flex-1 flex items-center justify-center gap-1 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium">
                Exam <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
