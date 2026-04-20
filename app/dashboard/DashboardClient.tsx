'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FaQuestionCircle, FaChartLine, FaLayerGroup, FaStickyNote, FaFire, FaUsers,
  FaShieldAlt, FaCog, FaPlay, FaPlus, FaLightbulb, FaArrowRight,
  FaBookReader, FaRandom, FaProjectDiagram, FaBrain, FaHome
} from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

import GlassCard from '@/components/ui/GlassCard';
import StatsCard from '@/components/ui/StatsCard';

import DashboardCharts from '@/components/dashboard/DashboardCharts';
import RecentActivityList from '@/components/dashboard/RecentActivityList';
import QuickActions from '@/components/dashboard/QuickActions';

import { DAY_NAMES_ID, formatDate } from '@/lib/utils';

const CHART_COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#84cc16'];

export default function DashboardClient({ initialData }: { initialData: any }) {
  const { user, isAdmin, stats, recentNotes, recentAttempts, weeklyActivity, subjectStats } = initialData;
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setDark(document.documentElement.classList.contains('dark'));
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const weeklyData = DAY_NAMES_ID.map((name, i) => ({
    name,
    quiz: weeklyActivity.find((w: any) => Number(w.day_num) === i)?.quiz_count ?? 0,
  }));

  const subjectData = subjectStats.map((s: any) => ({ 
    name: s.subject || 'Lainnya', 
    value: Number(s.attempts) 
  }));

  const textColor = dark ? '#9ca3af' : '#6b7280';

  const quickActions = isAdmin ? [
    { href: '/admin',          icon: <FaCog />,          label: 'Admin Panel',        sub: 'Kelola konten & user',   bg: 'bg-red-50 dark:bg-red-900/20',     hover: 'hover:bg-red-100 dark:hover:bg-red-900/30',     iconBg: 'bg-red-500' },
    { href: '/admin/users',    icon: <FaUsers />,         label: 'Kelola Pengguna',    sub: 'Lihat semua user',       bg: 'bg-blue-50 dark:bg-blue-900/20',   hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',   iconBg: 'bg-blue-500' },
    { href: '/admin/quizzes',  icon: <FaQuestionCircle />,label: 'Kelola Quiz',        sub: 'Tambah atau edit quiz',  bg: 'bg-green-50 dark:bg-green-900/20', hover: 'hover:bg-green-100 dark:hover:bg-green-900/30', iconBg: 'bg-green-500' },
    { href: '/admin/notes',    icon: <FaStickyNote />,    label: 'Kelola Catatan',     sub: 'Lihat semua catatan',    bg: 'bg-orange-50 dark:bg-orange-900/20',hover:'hover:bg-orange-100 dark:hover:bg-orange-900/30',iconBg:'bg-orange-500'},
  ] : [
    { href: '/quiz',      icon: <FaPlay />,       label: 'Mulai Quiz',       sub: 'Uji pengetahuan Anda',     bg: 'bg-blue-50 dark:bg-blue-900/20',    hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',   iconBg: 'bg-blue-500' },
    { href: '/flashcards',icon: <FaLayerGroup />,  label: 'Belajar Flashcard',sub: 'Pelajari kartu interaktif', bg: 'bg-purple-50 dark:bg-purple-900/20',hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/30',iconBg: 'bg-purple-500' },
    { href: '/notes/create',icon: <FaPlus />,      label: 'Buat Catatan',     sub: 'Tulis catatan baru',       bg: 'bg-green-50 dark:bg-green-900/20',  hover: 'hover:bg-green-100 dark:hover:bg-green-900/30', iconBg: 'bg-green-500' },
    { href: '/learning',  icon: <FaLightbulb />,   label: 'Metode Belajar',   sub: 'Jelajahi teknik belajar',  bg: 'bg-orange-50 dark:bg-orange-900/20',hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/30',iconBg: 'bg-orange-500' },
  ];

  const learningModules = [
    { href: '/learning/sq3r',        label: 'SQ3R Reading Trainer', desc: '5 tahap terstruktur', color: 'from-teal-500 to-cyan-600',     hover: 'hover:border-teal-400',   textColor: 'text-teal-600',   icon: <FaBookReader /> },
    { href: '/learning',             label: 'Interleaving Engine',  desc: 'Rotasi otomatis antar topik', color: 'from-indigo-500 to-violet-600',  hover: 'hover:border-indigo-400', textColor: 'text-indigo-600', icon: <FaRandom /> },
    { href: '/learning/dual-coding', label: 'Visual Builder',       desc: 'Peta konsep interaktif', color: 'from-pink-500 to-rose-600',      hover: 'hover:border-pink-400',   textColor: 'text-pink-600',   icon: <FaProjectDiagram /> },
    { href: '/learning',             label: 'Deep Understanding',   desc: 'Pertanyaan elaboratif', color: 'from-violet-500 to-purple-600',   hover: 'hover:border-violet-400', textColor: 'text-violet-600', icon: <FaBrain /> },
    { href: '/learning/mind-palace', label: 'Mind Palace',          desc: 'Tempatkan konsep dalam ruang virtual', color: 'from-amber-500 to-orange-600', hover: 'hover:border-amber-400', textColor: 'text-amber-600', icon: <FaHome /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          {isAdmin && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-medium mb-2">
              <FaShieldAlt /> Tampilan Global Admin
            </div>
          )}
          <h1 className="text-3xl font-bold mb-1">
            {isAdmin ? 'Dashboard Global' : `Selamat Datang, ${user.username}!`}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {isAdmin ? 'Statistik & aktivitas dari seluruh pengguna platform' : 'Lanjutkan perjalanan belajar Anda hari ini'}
          </p>
        </div>
        {isAdmin && (
          <Link href="/admin" className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm">
            <FaCog className="inline mr-2" />Admin Panel
          </Link>
        )}
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-6 sm:pb-0 sm:overflow-visible mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
        <StatsCard label={isAdmin ? 'Total Quiz Dikerjakan' : 'Quiz Dikerjakan'} value={stats.quiz_attempts}
          icon={<FaQuestionCircle className="text-xl" />} colorClass="blue"
          iconBgClass="bg-blue-100/50 dark:bg-blue-900/40" iconColorClass="text-blue-600 dark:text-blue-400"
          gradientClass="from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300" overlayClass="bg-blue-500/10 dark:bg-blue-500/20" />
        <StatsCard label={isAdmin ? 'Rata-rata Nilai Global' : 'Rata-rata Nilai'} value={`${stats.avg_score}%`}
          icon={<FaChartLine className="text-xl" />} colorClass="green"
          iconBgClass="bg-green-100/50 dark:bg-green-900/40" iconColorClass="text-green-600 dark:text-green-400"
          gradientClass="from-green-600 to-green-400 dark:from-green-400 dark:to-green-300" overlayClass="bg-green-500/10 dark:bg-green-500/20" />
        <StatsCard label={isAdmin ? 'Total Flashcard Dipelajari' : 'Flashcard'} value={stats.flashcards_studied}
          icon={<FaLayerGroup className="text-xl" />} colorClass="purple"
          iconBgClass="bg-purple-100/50 dark:bg-purple-900/40" iconColorClass="text-purple-600 dark:text-purple-400"
          gradientClass="from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-300" overlayClass="bg-purple-500/10 dark:bg-purple-500/20" />
        <StatsCard label={isAdmin ? 'Total Catatan' : 'Catatan'} value={stats.total_notes}
          icon={<FaStickyNote className="text-xl" />} colorClass="orange"
          iconBgClass="bg-orange-100/50 dark:bg-orange-900/40" iconColorClass="text-orange-600 dark:text-orange-400"
          gradientClass="from-orange-600 to-orange-400 dark:from-orange-400 dark:to-orange-300" overlayClass="bg-orange-500/10 dark:bg-orange-500/20" />
        {isAdmin
          ? <StatsCard label="Total Pengguna" value={stats.total_users ?? 0}
              icon={<FaUsers className="text-xl" />} colorClass="teal"
              iconBgClass="bg-teal-100/50 dark:bg-teal-900/40" iconColorClass="text-teal-600 dark:text-teal-400"
              gradientClass="from-teal-600 to-teal-400 dark:from-teal-400 dark:to-teal-300" overlayClass="bg-teal-500/10 dark:bg-teal-500/20" />
          : <StatsCard label="Streak Belajar" value={<>{stats.streak} <span className="text-lg">hari</span></>}
              icon={<FaFire className="text-xl" />} colorClass="red"
              iconBgClass="bg-red-100/50 dark:bg-red-900/40" iconColorClass="text-red-600 dark:text-red-400"
              gradientClass="from-red-600 to-red-400 dark:from-red-400 dark:to-red-300" overlayClass="bg-red-500/10 dark:bg-red-500/20" />
        }
      </div>

      <DashboardCharts isAdmin={isAdmin} dark={dark} textColor={textColor} weeklyData={weeklyData} historyData={initialData.historyData} />

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Distribusi Mata Pelajaran</h2>
          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">Berdasarkan Jumlah Percobaan</span>
        </div>
        <div className="h-64 max-w-lg mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={subjectData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" nameKey="name">
                {subjectData.map((_: any, i: number) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: dark ? '#1f2937' : '#fff', border: 'none', borderRadius: 8 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <RecentActivityList isAdmin={isAdmin} attempts={recentAttempts} />

          <GlassCard>
            <h2 className="text-xl font-bold mb-6">Progress per Mata Pelajaran</h2>
            <div className="space-y-4">
              {subjectStats.map((s: any) => {
                const pct = Math.round(Number(s.avg_score) * 10) / 10;
                return (
                  <div key={s.subject}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{s.subject || 'Lainnya'}</span>
                      <span className="text-sm text-gray-500">{s.attempts} kali • Rata-rata {pct}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold">Modul Pembelajaran Lanjutan</h2>
                <p className="text-sm text-gray-500 mt-0.5">Teknik belajar berbasis riset kognitif modern</p>
              </div>
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold rounded-full uppercase tracking-wider">Baru</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {learningModules.map((m) => (
                <Link key={m.label} href={m.href} className={`group glass rounded-2xl p-5 ${m.hover} hover:shadow-lg transition-all border border-white/20 dark:border-gray-700/50`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${m.color} rounded-xl flex items-center justify-center mb-3 text-white text-lg group-hover:scale-110 transition-transform`}>{m.icon}</div>
                  <h3 className="font-bold text-sm mb-1">{m.label}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{m.desc}</p>
                  <div className={`mt-3 flex items-center ${m.textColor} text-xs font-medium`}>
                    Mulai <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-8">
          <QuickActions actions={quickActions} />

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{isAdmin ? 'Flashcard Terbaru' : 'Flashcard Terakhir'}</h2>
              <Link href="/flashcards" className="text-primary-600 hover:text-primary-700 text-sm">Lainnya <FaArrowRight className="inline ml-1" /></Link>
            </div>
            <p className="text-gray-500 text-center py-4">Fungsionalitas flashcard segera hadir</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{isAdmin ? 'Catatan Terbaru' : 'Catatan Terakhir'}</h2>
              <Link href={isAdmin ? '/admin/notes' : '/notes'} className="text-primary-600 hover:text-primary-700 text-sm">Lainnya <FaArrowRight className="inline ml-1" /></Link>
            </div>
            {recentNotes.length === 0 ? <p className="text-gray-500 text-center py-4">Belum ada catatan</p> : (
              <div className="space-y-3">
                {recentNotes.map((n: any) => (
                  <Link key={n.id} href={`/notes/${n.id}`} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <FaStickyNote className="text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{n.title}</div>
                      <div className="text-xs text-gray-500">
                        {isAdmin && n.profiles?.username && <><span className="text-primary-600">@{n.profiles.username}</span> • </>}
                        {formatDate(n.created_at)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
