'use client';

import { useState, type FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import { useAuth } from '@/lib/auth-context';
import GlassCard from '@/components/ui/GlassCard';

interface Question { 
  question: string; 
  question_type: 'multiple_choice' | 'true_false' | 'multiple_answer' | 'essay';
  options: string[]; 
  correct_answer: string; 
  explanation: string;
  points: number; 
}

export default function CreateQuizPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!isLoading && (!user || !isAdmin)) router.push('/login'); }, [user, isAdmin, isLoading, router]);

  const [meta, setMeta] = useState({ title:'', subject:'', description:'', difficulty:'medium', time_limit:30, is_public: false });
  const [questions, setQuestions] = useState<Question[]>([
    { question:'', question_type: 'multiple_choice', options:['','','',''], correct_answer:'0', explanation: '', points:1 }
  ]);
  const [saving, setSaving] = useState(false);

  function updateMeta(k: string, v: any) { setMeta((m) => ({ ...m, [k]: v })); }
  function updateQ(i: number, k: string, v: any) {
    setQuestions((qs) => qs.map((q, idx) => idx === i ? { ...q, [k]: v } : q));
  }
  function addQ() { 
    setQuestions((qs) => [...qs, { question:'', question_type: 'multiple_choice', options:['','','',''], correct_answer:'0', explanation: '', points:1 }]); 
  }
  function removeQ(i: number) { setQuestions((qs) => qs.filter((_, idx) => idx !== i)); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // 1. Create Quiz
      const qRes = await fetch('/api/admin/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meta)
      });
      const qJson = await qRes.json();
      if (!qRes.ok) throw new Error(qJson.error || 'Failed to create quiz');

      const quizId = qJson.data.id;

      // 2. Save Questions
      const qsRes = await fetch(`/api/admin/quizzes/${quizId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questions)
      });
      if (!qsRes.ok) throw new Error('Failed to save questions');

      router.push('/admin/quizzes');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (isLoading || !user || !isAdmin) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/quizzes" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600"><FaArrowLeft /> Kelola Quiz</Link>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <h1 className="text-2xl font-bold">Buat Quiz Baru</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Metadata */}
        <GlassCard>
          <h2 className="font-bold text-lg mb-4">Informasi Quiz</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="auth-label">Judul Quiz</label>
              <input value={meta.title} onChange={(e) => updateMeta('title', e.target.value)} required
                className="w-full px-4 py-3 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Judul quiz..." />
            </div>
            <div>
              <label className="auth-label">Mata Pelajaran</label>
              <input value={meta.subject} onChange={(e) => updateMeta('subject', e.target.value)} required
                className="w-full px-4 py-3 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Matematika, Fisika..." />
            </div>
            <div>
              <label className="auth-label">Tingkat Kesulitan</label>
              <select value={meta.difficulty} onChange={(e) => updateMeta('difficulty', e.target.value)}
                className="w-full px-4 py-3 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="easy">Mudah</option>
                <option value="medium">Sedang</option>
                <option value="hard">Sulit</option>
              </select>
            </div>
            <div>
              <label className="auth-label">Batas Waktu (menit)</label>
              <input type="number" value={meta.time_limit} onChange={(e) => updateMeta('time_limit', Number(e.target.value))} min={5}
                className="w-full px-4 py-3 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <div>
              <label className="auth-label">Status Publik</label>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" checked={meta.is_public} onChange={(e) => updateMeta('is_public', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Publikasikan quiz agar bisa dikerjakan user</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="auth-label">Deskripsi</label>
              <textarea value={meta.description} onChange={(e) => updateMeta('description', e.target.value)} rows={3}
                className="w-full px-4 py-3 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                placeholder="Deskripsi quiz..." />
            </div>
          </div>
        </GlassCard>

        {/* Questions */}
        {questions.map((q, i) => (
          <GlassCard key={i}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Soal #{i + 1}</h3>
              {questions.length > 1 && (
                <button type="button" onClick={() => removeQ(i)} className="text-red-500 hover:text-red-600 p-1"><FaTrash /></button>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="auth-label">Jenis Pertanyaan</label>
                <select value={q.question_type} onChange={(e) => updateQ(i, 'question_type', e.target.value)}
                  className="w-full px-4 py-2 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="multiple_choice">Pilihan Ganda (4 Opsi)</option>
                  <option value="true_false">Benar / Salah</option>
                  <option value="multiple_answer">Jawaban Ganda (Checkboxes)</option>
                  <option value="essay">Essay</option>
                </select>
              </div>
              <div>
                <label className="auth-label">Pertanyaan</label>
                <textarea value={q.question} onChange={(e) => updateQ(i, 'question', e.target.value)} required rows={2}
                  className="w-full px-4 py-3 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="Tulis pertanyaan..." />
              </div>

              {q.question_type !== 'essay' && (
                <div className="space-y-3">
                  <label className="auth-label">Opsi Jawaban</label>
                  {(q.question_type === 'true_false' ? ['Benar', 'Salah'] : q.options).map((opt, optIdx) => (
                    <div key={optIdx} className="flex gap-2">
                      <input 
                        value={opt} 
                        onChange={(e) => {
                          const newOpts = [...q.options];
                          newOpts[optIdx] = e.target.value;
                          updateQ(i, 'options', newOpts);
                        }}
                        disabled={q.question_type === 'true_false'}
                        className="flex-1 px-3 py-2 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        placeholder={`Opsi ${String.fromCharCode(65 + optIdx)}...`} />
                      <button 
                        type="button"
                        onClick={() => updateQ(i, 'correct_answer', optIdx.toString())}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${q.correct_answer === optIdx.toString() ? 'bg-green-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}
                      >
                        {q.correct_answer === optIdx.toString() ? 'BENAR' : 'SET BENAR'}
                      </button>
                    </div>
                  ))}
                  {q.question_type === 'multiple_choice' && q.options.length < 6 && (
                    <button type="button" onClick={() => updateQ(i, 'options', [...q.options, ''])} className="text-xs text-primary-600">+ Tambah Opsi</button>
                  )}
                </div>
              )}

              {q.question_type === 'essay' && (
                <div>
                  <label className="auth-label">Jawaban Kunci (Untuk Perbandingan Essay)</label>
                  <textarea value={q.correct_answer} onChange={(e) => updateQ(i, 'correct_answer', e.target.value)} required rows={3}
                    className="w-full px-4 py-3 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder="Tulis jawaban yang benar untuk dibandingkan dengan input user..." />
                </div>
              )}

              <div>
                <label className="auth-label">Penjelasan (Opsional)</label>
                <textarea value={q.explanation} onChange={(e) => updateQ(i, 'explanation', e.target.value)} rows={2}
                  className="w-full px-4 py-3 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
                  placeholder="Penjelasan jawaban..." />
              </div>

              <div className="w-32">
                <label className="auth-label">Poin</label>
                <input type="number" value={q.points} onChange={(e) => updateQ(i, 'points', Number(e.target.value))} min={1}
                  className="w-full px-3 py-2 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
              </div>
            </div>
          </GlassCard>
        ))}

        <button type="button" onClick={addQ}
          className="w-full flex items-center justify-center gap-2 py-3 glass rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium border-2 border-dashed border-gray-300 dark:border-gray-600">
          <FaPlus /> Tambah Soal
        </button>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-60 transition-colors font-medium">
            {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
            Simpan Quiz
          </button>
        </div>
      </form>
    </div>
  );
}
