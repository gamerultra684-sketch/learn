'use client';

import Link from 'next/link';
import { FaBookReader, FaRandom, FaProjectDiagram, FaBrain, FaHome, FaArrowRight } from 'react-icons/fa';
import GlassCard from '@/components/ui/GlassCard';

const methods = [
  { href: '/learning/sq3r', icon: <FaBookReader />, title: 'SQ3R Reading Trainer', desc: '5 tahap terstruktur untuk membaca efektif: Survey, Question, Read, Recite, Review. Tingkatkan pemahaman dan retensi bacaan Anda.', color: 'from-teal-500 to-cyan-600', tag: 'Membaca' },
  { href: '/learning', icon: <FaRandom />, title: 'Interleaving Engine', desc: 'Rotasi otomatis antar topik untuk retensi lebih kuat. Hindari "illusion of competence" dari belajar satu topik berturut-turut.', color: 'from-indigo-500 to-violet-600', tag: 'Memori' },
  { href: '/learning/dual-coding', icon: <FaProjectDiagram />, title: 'Visual Builder (Dual Coding)', desc: 'Bangun peta konsep interaktif dengan node dan koneksi. Kombinasi teks dan visual meningkatkan pemahaman 2x lebih efektif.', color: 'from-pink-500 to-rose-600', tag: 'Visual' },
  { href: '/learning', icon: <FaBrain />, title: 'Deep Understanding (Interrogation)', desc: 'Pertanyaan elaboratif otomatis: Mengapa? Bagaimana? Apa dampaknya? Paksakan otak Anda memahami lebih dalam.', color: 'from-violet-500 to-purple-600', tag: 'Pemahaman' },
  { href: '/learning/mind-palace', icon: <FaHome />, title: 'Mind Palace', desc: 'Tempatkan konsep dalam ruang virtual yang bisa Anda "jelajahi". Teknik memori kuno yang terbukti secara ilmiah.', color: 'from-amber-500 to-orange-600', tag: 'Memori' },
];

export default function LearningMethodsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="mb-10 text-center">
        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold rounded-full uppercase tracking-wider">Riset Kognitif</span>
        <h1 className="text-4xl font-bold mt-4 mb-4">Metode Belajar Lanjutan</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Teknik pembelajaran berbasis penelitian ilmiah untuk memaksimalkan retensi dan pemahaman jangka panjang</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {methods.map((m) => (
          <GlassCard key={m.title} hover className="flex flex-col">
            <div className={`w-14 h-14 bg-gradient-to-br ${m.color} rounded-xl flex items-center justify-center text-white text-2xl mb-4 group-hover:scale-110 transition-transform`}>
              {m.icon}
            </div>
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-medium px-2 py-1 glass rounded-full text-gray-600 dark:text-gray-400">{m.tag}</span>
            </div>
            <h3 className="font-bold text-xl mb-3">{m.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">{m.desc}</p>
            <Link href={m.href} className="mt-5 flex items-center gap-2 text-primary-600 dark:text-primary-400 text-sm font-medium hover:gap-3 transition-all">
              Mulai <FaArrowRight />
            </Link>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
