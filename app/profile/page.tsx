'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { FaEdit, FaUser, FaEnvelope, FaCalendarAlt, FaShieldAlt } from 'react-icons/fa';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { MOCK_USER_STATS, MOCK_QUIZ_ATTEMPTS, MOCK_NOTES } from '@/lib/mock-data';

export default function ProfilePage() {
  const { user } = useAuth();
  const [notesCount, setNotesCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetch('/api/notes')
        .then(res => res.json())
        .then(json => {
          if (json.data) setNotesCount(json.data.length);
        })
        .catch(console.error);
    }
  }, [user]);

  if (!user) return null;

  const stats = MOCK_USER_STATS;
  const myAttempts = MOCK_QUIZ_ATTEMPTS.filter((a) => a.user_id === user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Profil Saya</h1>
        <Link href="/profile/edit" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium">
          <FaEdit /> Edit Profil
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Avatar + Info */}
        <GlassCard className="md:col-span-1 text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
            <FaUser className="text-white text-4xl" />
          </div>
          <h2 className="text-xl font-bold mb-1">{user.full_name ?? user.username}</h2>
          <p className="text-gray-500 text-sm mb-3">@{user.username}</p>
          {user.role === 'admin' && <Badge variant="danger"><FaShieldAlt className="mr-1" />Admin</Badge>}

          <div className="mt-6 space-y-3 text-sm text-left">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <FaEnvelope className="text-primary-500 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <FaCalendarAlt className="text-primary-500 flex-shrink-0" />
              <span>Bergabung {formatDate(user.created_at, { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </GlassCard>

        {/* Stats */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Quiz Dikerjakan', value: stats.quiz_attempts },
              { label: 'Rata-rata Nilai',  value: `${stats.avg_score}%` },
              { label: 'Flashcard',        value: stats.flashcards_studied },
              { label: 'Catatan',          value: notesCount },
            ].map((s) => (
              <div key={s.label} className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-bold gradient-text mb-1">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent Quiz */}
          <GlassCard>
            <h3 className="font-bold text-lg mb-4">Riwayat Quiz Terakhir</h3>
            {myAttempts.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Belum ada quiz yang dikerjakan</p>
            ) : (
              <div className="space-y-3">
                {myAttempts.slice(0, 5).map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div>
                      <div className="font-medium text-sm">{a.quiz_title}</div>
                      <div className="text-xs text-gray-500">{a.subject} • {a.mode}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary-600">{Math.round((a.score / a.total_points) * 100)}%</div>
                      <div className="text-xs text-gray-400">{a.score}/{a.total_points}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
