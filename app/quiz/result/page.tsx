'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaTrophy, FaArrowRight, FaRedo } from 'react-icons/fa';
import GlassCard from '@/components/ui/GlassCard';
import { calculateGrade, getGradeColor, calcPercentage } from '@/lib/utils';
import { MOCK_QUIZZES } from '@/lib/mock-data';

export default function QuizResultPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading...</div>}>
      <QuizResultContent />
    </Suspense>
  );
}

function QuizResultContent() {
  const sp = useSearchParams();
  const score   = Number(sp.get('score')   ?? 0);
  const total   = Number(sp.get('total')   ?? 100);
  const quizId  = Number(sp.get('quiz_id') ?? 0);
  const quiz    = MOCK_QUIZZES.find((q) => q.id === quizId);
  const pct     = calcPercentage(score, total);
  const grade   = calculateGrade(score, total);
  const gradeColor = getGradeColor(grade);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 relative z-10">
      <div className="text-center mb-8">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
          <FaTrophy className="text-white text-4xl" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Quiz Selesai!</h1>
        {quiz && <p className="text-gray-500">{quiz.title}</p>}
      </div>

      <GlassCard className="text-center mb-6">
        <div className={`text-7xl font-extrabold mb-2 ${gradeColor}`}>{grade}</div>
        <div className="text-4xl font-bold mb-1">{pct}%</div>
        <p className="text-gray-500">{score} / {total} poin</p>

        {/* Grade bar */}
        <div className="mt-6 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${
            grade === 'A' ? 'bg-green-500' : grade === 'B' ? 'bg-blue-500' :
            grade === 'C' ? 'bg-yellow-500' : grade === 'D' ? 'bg-orange-500' : 'bg-red-500'
          }`} style={{ width: `${pct}%` }} />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-center text-sm">
          {[['A', '≥ 90%'],['B', '≥ 75%'],['C', '≥ 60%']].map(([g, r]) => (
            <div key={g} className={`p-2 rounded-lg ${grade === g ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
              <div className="font-bold">{g}</div><div className="text-gray-500">{r}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="flex gap-4">
        {quiz && (
          <Link href={`/quiz/${quiz.id}`} className="flex-1 flex items-center justify-center gap-2 py-3 glass rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors">
            <FaRedo /> Ulangi
          </Link>
        )}
        <Link href="/quiz" className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium transition-colors">
          Quiz Lain <FaArrowRight />
        </Link>
      </div>
      <div className="text-center mt-4">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-primary-600 transition-colors">Kembali ke Dashboard</Link>
      </div>
    </div>
  );
}
