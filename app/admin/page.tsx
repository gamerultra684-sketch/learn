'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUsers, FaQuestionCircle, FaLayerGroup, FaStickyNote, FaCog, FaArrowRight, FaChartBar } from 'react-icons/fa';
import { useAuth } from '@/lib/auth-context';
import GlassCard from '@/components/ui/GlassCard';
import StatsCard from '@/components/ui/StatsCard';
import { MOCK_ADMIN_STATS, MOCK_QUIZZES, MOCK_USERS, MOCK_QUIZ_ATTEMPTS } from '@/lib/mock-data';
import { formatDateTime, calcPercentage, calculateGrade, getGradeColor } from '@/lib/utils';

export default function AdminDashboard() {
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) router.push('/login');
  }, [user, isAdmin, isLoading, router]);

  if (isLoading || !user || !isAdmin) return null;

  const adminLinks = [
    { href: '/admin/users',     icon: <FaUsers />,         label: 'Kelola Pengguna',  count: MOCK_USERS.length,    color: 'bg-blue-500' },
    { href: '/admin/quizzes',   icon: <FaQuestionCircle />,label: 'Kelola Quiz',       count: MOCK_QUIZZES.length,  color: 'bg-green-500' },
    { href: '/admin/flashcards',icon: <FaLayerGroup />,    label: 'Kelola Flashcard',  count: 3,                    color: 'bg-purple-500' },
    { href: '/admin/notes',     icon: <FaStickyNote />,    label: 'Kelola Catatan',    count: 5,                    color: 'bg-orange-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-medium mb-2">
            <FaCog className="animate-spin-slow" /> Admin Panel
          </div>
          <h1 className="text-3xl font-bold">Panel Admin</h1>
          <p className="text-gray-500 dark:text-gray-400">Kelola konten, pengguna, dan pengaturan platform</p>
        </div>
        <Link href="/dashboard" className="px-4 py-2 glass rounded-xl text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          Dashboard User
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Total Pengguna" value={MOCK_USERS.length}
          icon={<FaUsers className="text-xl" />} colorClass="blue"
          iconBgClass="bg-blue-100/50 dark:bg-blue-900/40" iconColorClass="text-blue-600 dark:text-blue-400"
          gradientClass="from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300" overlayClass="bg-blue-500/10 dark:bg-blue-500/20" />
        <StatsCard label="Total Quiz Dikerjakan" value={MOCK_ADMIN_STATS.quiz_attempts}
          icon={<FaQuestionCircle className="text-xl" />} colorClass="green"
          iconBgClass="bg-green-100/50 dark:bg-green-900/40" iconColorClass="text-green-600 dark:text-green-400"
          gradientClass="from-green-600 to-green-400 dark:from-green-400 dark:to-green-300" overlayClass="bg-green-500/10 dark:bg-green-500/20" />
        <StatsCard label="Rata-rata Nilai" value={`${MOCK_ADMIN_STATS.avg_score}%`}
          icon={<FaChartBar className="text-xl" />} colorClass="purple"
          iconBgClass="bg-purple-100/50 dark:bg-purple-900/40" iconColorClass="text-purple-600 dark:text-purple-400"
          gradientClass="from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-300" overlayClass="bg-purple-500/10 dark:bg-purple-500/20" />
        <StatsCard label="Total Catatan" value={MOCK_ADMIN_STATS.total_notes}
          icon={<FaStickyNote className="text-xl" />} colorClass="orange"
          iconBgClass="bg-orange-100/50 dark:bg-orange-900/40" iconColorClass="text-orange-600 dark:text-orange-400"
          gradientClass="from-orange-600 to-orange-400 dark:from-orange-400 dark:to-orange-300" overlayClass="bg-orange-500/10 dark:bg-orange-500/20" />
      </div>

      {/* Admin nav cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {adminLinks.map((l) => (
          <Link key={l.href} href={l.href} className="glass rounded-2xl p-5 card-hover group border border-white/20 dark:border-gray-700/50 flex items-center gap-4">
            <div className={`w-12 h-12 ${l.color} rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0 group-hover:scale-110 transition-transform`}>{l.icon}</div>
            <div>
              <div className="font-bold">{l.label}</div>
              <div className="text-sm text-gray-500">{l.count} item</div>
            </div>
            <FaArrowRight className="ml-auto text-gray-400 group-hover:text-primary-500 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Aktivitas Terbaru</h2>
          <Link href="/admin/quizzes" className="text-primary-600 text-sm hover:text-primary-700">Lihat Semua</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 text-gray-500 font-medium">User</th>
                <th className="pb-3 text-gray-500 font-medium">Quiz</th>
                <th className="pb-3 text-gray-500 font-medium">Mode</th>
                <th className="pb-3 text-gray-500 font-medium">Nilai</th>
                <th className="pb-3 text-gray-500 font-medium">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {MOCK_QUIZ_ATTEMPTS.map((a) => {
                const grade = calculateGrade(a.score, a.total_points);
                return (
                  <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-3 font-medium text-primary-600">@{a.username}</td>
                    <td className="py-3 max-w-[200px] truncate">{a.quiz_title}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.mode === 'study' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                        {a.mode}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`font-bold ${getGradeColor(grade)}`}>{grade}</span>
                      <span className="text-gray-400 ml-1 text-xs">({calcPercentage(a.score, a.total_points)}%)</span>
                    </td>
                    <td className="py-3 text-gray-500">{formatDateTime(a.completed_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
