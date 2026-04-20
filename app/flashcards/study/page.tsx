'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaArrowLeft, FaArrowRight, FaRedo, FaCheck } from 'react-icons/fa';
import GlassCard from '@/components/ui/GlassCard';
import Link from 'next/link';

export default function FlashcardStudyPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading...</div>}>
      <FlashcardStudyContent />
    </Suspense>
  );
}

function FlashcardStudyContent() {
  const sp = useSearchParams();
  const deckId = sp.get('deck_id');
  const [deck, setDeck] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped]   = useState(false);
  const [known, setKnown]       = useState<Set<string>>(new Set());
  const [done, setDone]         = useState(false);

  useEffect(() => {
    if (!deckId) return;
    fetch(`/api/flashcards/${deckId}`)
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          setDeck(json.data);
          setCards(json.data.flashcards || []);
        }
      })
      .finally(() => setLoading(false));
  }, [deckId]);

  useEffect(() => { setFlipped(false); }, [current]);

  if (loading) return <div className="text-center py-20 text-gray-500">Memuat sesi belajar...</div>;

  if (!deck || cards.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Deck tidak ditemukan atau belum memiliki kartu.</p>
        <Link href="/flashcards" className="text-primary-600 hover:underline">Kembali</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center relative z-10">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
          <FaCheck className="text-white text-3xl" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Sesi Selesai!</h2>
        <p className="text-gray-500 mb-6">{known.size} dari {cards.length} kartu dikuasai</p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => { setCurrent(0); setFlipped(false); setKnown(new Set()); setDone(false); }}
            className="flex items-center gap-2 px-6 py-3 glass rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors">
            <FaRedo /> Ulangi
          </button>
          <Link href="/flashcards" className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium transition-colors">
            Deck Lain <FaArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  const card = cards[current];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 relative z-10">
      <div className="flex items-center justify-between mb-6">
        <Link href="/flashcards" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors">
          <FaArrowLeft /> Kembali
        </Link>
        <div>
          <h1 className="text-lg font-bold text-center">{deck.title}</h1>
          <p className="text-xs text-center text-gray-500">{deck.subject}</p>
        </div>
        <span className="text-sm text-gray-500">{current + 1} / {cards.length}</span>
      </div>

      {/* Progress */}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-8">
        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all" style={{ width: `${((current + 1) / cards.length) * 100}%` }} />
      </div>

      {/* Flashcard flip */}
      <div className="flashcard h-64 cursor-pointer mb-8" onClick={() => setFlipped((v) => !v)}>
        <div className={`flashcard-inner h-full ${flipped ? 'flipped' : ''}`}>
          <div className="flashcard-front glass rounded-2xl flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Pertanyaan</p>
              <p className="text-xl font-semibold">{card.front}</p>
              <p className="text-xs text-gray-400 mt-4">Klik untuk lihat jawaban</p>
            </div>
          </div>
          <div className="flashcard-back glass rounded-2xl flex items-center justify-center p-8 bg-purple-50 dark:bg-purple-900/20">
            <div className="text-center">
              <p className="text-xs text-purple-500 uppercase tracking-wider mb-3">Jawaban</p>
              <p className="text-xl font-semibold whitespace-pre-line">{card.back}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      {flipped && (
        <div className="flex gap-4 mb-4">
          <button onClick={() => { setCurrent((c) => { if (c + 1 >= cards.length) { setDone(true); return c; } return c + 1; }); }}
            className="flex-1 py-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 font-medium hover:bg-red-200 transition-colors flex items-center justify-center gap-2">
            Belum Hafal
          </button>
          <button onClick={() => { setKnown((k) => new Set([...k, card.id])); setCurrent((c) => { if (c + 1 >= cards.length) { setDone(true); return c; } return c + 1; }); }}
            className="flex-1 py-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 font-medium hover:bg-green-200 transition-colors flex items-center justify-center gap-2">
            <FaCheck /> Sudah Hafal
          </button>
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}
          className="px-4 py-2 glass rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
          <FaArrowLeft /> Sebelumnya
        </button>
        <button onClick={() => setCurrent((c) => { if (c + 1 >= cards.length) { setDone(true); return c; } return c + 1; })}
          className="px-4 py-2 glass rounded-xl text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
          Selanjutnya <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
