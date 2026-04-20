'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { FaCheck, FaTimes, FaClock, FaArrowRight, FaSpinner } from 'react-icons/fa';
import GlassCard from '@/components/ui/GlassCard';

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500"><FaSpinner className="animate-spin inline mr-2" /> Loading...</div>}>
      <QuizContent />
    </Suspense>
  );
}

function QuizContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode') ?? 'exam';
  const quizId = params.id;

  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<Record<string, any>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [qRes, qsRes] = await Promise.all([
          fetch(`/api/quizzes/${quizId}`),
          fetch(`/api/quizzes/${quizId}/questions`)
        ]);
        
        const qJson = await qRes.json();
        const qsJson = await qsRes.json();

        if (qJson.data) {
          setQuiz(qJson.data);
          setTimeLeft((qJson.data.time_limit ?? 30) * 60);
        }
        if (qsJson.data) {
          setQuestions(qsJson.data);
        }
      } catch (err) {
        console.error('Failed to fetch quiz data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [quizId]);

  const finish = useCallback(async () => {
    if (done || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/quizzes/attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quiz_id: quizId,
          mode,
          answers: selected
        })
      });
      const json = await res.json();
      if (json.success) {
        setDone(true);
        router.push(`/quiz/result?attempt_id=${json.attempt_id}`);
      } else {
        alert(json.error || 'Gagal menyimpan hasil quiz');
      }
    } catch (err) {
      alert('Terjadi kesalahan saat menyimpan hasil quiz');
    } finally {
      setSubmitting(false);
    }
  }, [quizId, mode, selected, router, done, submitting]);

  useEffect(() => {
    if (mode !== 'exam' || done || loading) return;
    const t = setInterval(() => {
      setTimeLeft((v) => {
        if (v <= 1) { clearInterval(t); finish(); return 0; }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [mode, done, finish, loading]);

  if (loading) return <div className="text-center py-20 text-gray-500"><FaSpinner className="animate-spin inline mr-2" /> Menyiapkan quiz...</div>;
  if (!quiz) return <div className="text-center py-20 text-gray-500">Quiz tidak ditemukan</div>;
  if (questions.length === 0) return <div className="text-center py-20 text-gray-500">Quiz belum memiliki soal</div>;

  const q = questions[current];
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  function handleAnswer(answer: any) {
    if (revealed[q.id] || done) return;
    
    if (q.question_type === 'multiple_answer') {
      const currentAnswers = selected[q.id] || [];
      const newAnswers = currentAnswers.includes(answer)
        ? currentAnswers.filter((a: any) => a !== answer)
        : [...currentAnswers, answer];
      setSelected((s) => ({ ...s, [q.id]: newAnswers }));
    } else {
      setSelected((s) => ({ ...s, [q.id]: answer }));
      if (mode === 'study') setRevealed((r) => ({ ...r, [q.id]: true }));
    }
  }

  function next() {
    if (current < questions.length - 1) setCurrent((c) => c + 1);
    else finish();
  }

  const renderOptions = () => {
    const options = q.options || [];
    
    if (q.question_type === 'essay') {
      return (
        <textarea
          value={selected[q.id] || ''}
          onChange={(e) => setSelected(s => ({ ...s, [q.id]: e.target.value }))}
          disabled={revealed[q.id]}
          placeholder="Ketik jawaban Anda di sini..."
          className="w-full p-4 glass rounded-xl border-2 border-white/20 dark:border-gray-700 min-h-[150px] focus:border-primary-500 outline-none transition-all"
        />
      );
    }

    return (
      <div className="space-y-3">
        {options.map((opt: string, i: number) => {
          const isSelected = q.question_type === 'multiple_answer' 
            ? (selected[q.id] || []).includes(i)
            : selected[q.id] === i || selected[q.id] === opt;
          
          let cls = 'border-2 border-transparent glass';
          if (isSelected) cls = 'border-2 border-primary-500 bg-primary-50 dark:bg-primary-900/20';

          return (
            <button key={i} onClick={() => handleAnswer(q.question_type === 'multiple_choice' || q.question_type === 'multiple_answer' ? i : opt)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all ${cls} hover:border-primary-300`}>
              <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold flex-shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 relative z-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">{quiz.title}</h1>
          <p className="text-sm text-gray-500">{quiz.subject} • {mode === 'study' ? 'Study Mode' : 'Exam Mode'}</p>
        </div>
        {mode === 'exam' && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'glass'}`}>
            <FaClock />{mins}:{secs}
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Soal {current + 1} dari {questions.length}</span>
          <span>{Object.keys(selected).length} dijawab</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <GlassCard className="mb-6">
        <p className="text-lg font-semibold leading-relaxed">{q.question_text}</p>
        {q.points > 0 && <p className="text-xs text-gray-400 mt-2">{q.points} poin</p>}
      </GlassCard>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {opts.map((opt, i) => {
          const chosen = selected[q.id] === opt;
          const isCorrect = q.correct_answer === opt;
          const show = revealed[q.id];

          let cls = 'border-2 border-transparent glass';
          if (chosen && !show) cls = 'border-2 border-primary-500 bg-primary-50 dark:bg-primary-900/20';
          if (show && isCorrect) cls = 'border-2 border-green-500 bg-green-50 dark:bg-green-900/20';
          if (show && chosen && !isCorrect) cls = 'border-2 border-red-500 bg-red-50 dark:bg-red-900/20';

          return (
            <button key={opt} onClick={() => !revealed[q.id] && choose(opt)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all ${cls} ${!revealed[q.id] && !chosen ? 'hover:border-primary-300' : ''}`}>
              <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-sm font-bold flex-shrink-0">
                {opt.toUpperCase()}
              </span>
              <span className="flex-1">{optLabels[i]}</span>
              {show && isCorrect && <FaCheck className="text-green-500 flex-shrink-0" />}
              {show && chosen && !isCorrect && <FaTimes className="text-red-500 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Explanation (study mode) */}
      {revealed[q.id] && q.explanation && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-sm">
          <span className="font-semibold text-blue-700 dark:text-blue-400">Penjelasan: </span>
          {q.explanation}
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}
          className="px-4 py-2 glass rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          Sebelumnya
        </button>
        <button onClick={next} disabled={!selected[q.id]}
          className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 disabled:opacity-40 transition-colors">
          {current < questions.length - 1 ? 'Selanjutnya' : 'Selesai'} <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
