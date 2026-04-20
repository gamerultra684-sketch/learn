'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { useAuth } from '@/lib/auth-context';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import { MOCK_QUIZZES } from '@/lib/mock-data';
import { getDifficultyColor } from '@/lib/utils';

const diffLabel: Record<string, string> = { easy: 'Mudah', medium: 'Sedang', hard: 'Sulit' };

export default function ManageQuizzesPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    if (!isLoading && (!user || !isAdmin)) {
      router.push('/login');
      return;
    }
    fetchQuizzes();
  }, [user, isAdmin, isLoading, router]);

  async function fetchQuizzes() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/quizzes');
      const json = await res.json();
      if (json.data) setQuizzes(json.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Yakin ingin menghapus quiz ini? Semua pertanyaan dan hasil quiz juga akan dihapus.')) return;
    try {
      const res = await fetch(`/api/admin/quizzes/${id}`, { method: 'DELETE' });
      if (res.ok) fetchQuizzes();
    } catch (err) {
      alert('Gagal menghapus quiz');
    }
  }

  const filteredQuizzes = quizzes.filter((q) => 
    q.title.toLowerCase().includes(search.toLowerCase()) || 
    (q.subject && q.subject.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600"><FaArrowLeft /> Admin</Link>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <h1 className="text-2xl font-bold">Kelola Quiz</h1>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari quiz..."
            className="w-full pl-11 pr-4 py-3 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <Link href="/admin/quizzes/create" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium whitespace-nowrap">
          <FaPlus /> Tambah Quiz
        </Link>
      </div>
      <GlassCard padding="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                {['#','Judul','Mata Pelajaran','Tingkat','Soal','Status','Aksi'].map((h) => (
                  <th key={h} className="px-6 py-4 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredQuizzes.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 text-gray-400 text-xs truncate max-w-[100px]">{q.id}</td>
                  <td className="px-6 py-4 font-medium max-w-[200px] truncate">{q.title}</td>
                  <td className="px-6 py-4"><Badge variant="info">{q.subject}</Badge></td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(q.difficulty)}`}>{diffLabel[q.difficulty]}</span>
                  </td>
                  <td className="px-6 py-4">{q.quiz_questions?.[0]?.count ?? 0}</td>
                  <td className="px-6 py-4">
                    <Badge variant={q.is_public ? 'success' : 'danger'}>{q.is_public ? 'Publik' : 'Pribadi'}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/admin/quizzes/edit/${q.id}`} className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"><FaEdit /></Link>
                      <button onClick={() => handleDelete(q.id)} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
