'use client';

import Link from 'next/link';
import { FaClipboardList, FaArrowRight } from 'react-icons/fa';
import GlassCard from '@/components/ui/GlassCard';
import { calculateGrade, calcPercentage, getGradeColor, formatDateTime } from '@/lib/utils';
import type { QuizAttempt } from '@/lib/types';

interface RecentActivityListProps {
  isAdmin: boolean;
  attempts: QuizAttempt[];
}

export default function RecentActivityList({ isAdmin, attempts }: RecentActivityListProps) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{isAdmin ? 'Quiz Terbaru (Semua User)' : 'Riwayat Quiz'}</h2>
        <Link href="/quiz" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          Lihat Semua <FaArrowRight className="inline ml-1" />
        </Link>
      </div>
      {attempts.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <FaClipboardList className="text-2xl text-gray-400" />
          </div>
          <p className="text-gray-500">Belum ada quiz yang dikerjakan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {attempts.map((a) => {
            const grade = calculateGrade(a.score, a.total_points);
            const pct   = calcPercentage(a.score, a.total_points);
            return (
              <Link key={a.id} href={`/quiz/result?attempt_id=${a.id}&quiz_id=${a.quiz_id}&score=${a.score}&total=${a.total_points}`}
                className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/10 hover:border-primary-200 border border-transparent transition-all group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                  <FaClipboardList className="text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">{a.quiz_title}</h3>
                  <p className="text-sm text-gray-500">
                    {isAdmin && <><span className="font-medium text-primary-600">@{a.username}</span> • </>}
                    {a.subject} • <span className={a.mode === 'study' ? 'text-blue-500' : 'text-purple-500'}>{a.mode === 'study' ? 'Study' : 'Exam'}</span> • {formatDateTime(a.completed_at)}
                  </p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <div className={`text-2xl font-bold ${getGradeColor(grade)}`}>{grade}</div>
                    <div className="text-sm text-gray-500">{pct}%</div>
                  </div>
                  <FaArrowRight className="text-gray-300 group-hover:text-primary-400 transition-colors text-sm" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
}
