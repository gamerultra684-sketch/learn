'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaSearch, FaLayerGroup, FaArrowRight, FaClock, FaSpinner } from 'react-icons/fa';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export default function FlashcardsPage() {
  const [search, setSearch] = useState('');
  const [decks, setDecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/flashcards')
      .then(res => res.json())
      .then(json => {
        if (json.data) setDecks(json.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredDecks = decks.filter(
    (d) => d.title.toLowerCase().includes(search.toLowerCase()) || 
          (d.subject && d.subject.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Flashcard</h1>
        <p className="text-gray-500 dark:text-gray-400">Pilih deck flashcard dan mulai belajar</p>
      </div>

      <div className="relative mb-6">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari deck flashcard..."
          className="w-full pl-11 pr-4 py-3 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-gray-500">
            <FaSpinner className="animate-spin inline-block mr-2" /> Memuat deck...
          </div>
        ) : filteredDecks.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-500">
            Deck tidak ditemukan
          </div>
        ) : filteredDecks.map((deck) => (
          <GlassCard key={deck.id} hover className="flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <FaLayerGroup className="text-purple-600 text-xl" />
              </div>
              <Badge variant="purple">{deck.subject}</Badge>
            </div>
            <h3 className="font-bold text-lg mb-2">{deck.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1 line-clamp-2">{deck.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
              <span><FaLayerGroup className="inline mr-1" />{deck.flashcards?.[0]?.count ?? 0} kartu</span>
              <span><FaClock className="inline mr-1" />{formatDate(deck.created_at, { day: 'numeric', month: 'short' })}</span>
            </div>
            <Link href={`/flashcards/study?deck_id=${deck.id}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-sm font-medium">
              Mulai Belajar <FaArrowRight />
            </Link>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
