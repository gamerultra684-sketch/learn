'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaSearch, FaStickyNote, FaEye, FaLock, FaGlobe, FaArrowRight } from 'react-icons/fa';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import { formatDate, stripHtml, truncate } from '@/lib/utils';

export default function NotesPage() {
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/notes')
      .then(res => res.json())
      .then(json => {
        if (json.data) setNotes(json.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = notes.filter((n) =>
    n.title?.toLowerCase().includes(search.toLowerCase()) ||
    (n.subject ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Catatan Saya</h1>
          <p className="text-gray-500 dark:text-gray-400">Kelola dan jelajahi catatan pribadi Anda</p>
        </div>
        <Link href="/notes/create" className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium">
          <FaPlus /> Buat Catatan
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari catatan..."
          className="w-full pl-11 pr-4 py-3 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-gray-500">Memuat catatan...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FaStickyNote className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada catatan ditemukan</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((note) => (
            <GlassCard key={note.id} hover className="flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {note.is_public
                    ? <Badge variant="success"><FaGlobe className="mr-1 text-[10px]" />Publik</Badge>
                    : <Badge variant="warning"><FaLock className="mr-1 text-[10px]" />Pribadi</Badge>
                  }
                  {note.subject && <Badge variant="info">{note.subject}</Badge>}
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2 line-clamp-2">{note.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1 line-clamp-3">
                {truncate(stripHtml(note.content || ''), 120)}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
                <span>{formatDate(note.created_at, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <Link href={`/notes/${note.id}`} className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium">
                  <FaEye /> Baca
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
