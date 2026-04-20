'use client';

import Link from 'next/link';
import { FaGraduationCap, FaArrowRight, FaBrain, FaLayerGroup, FaStickyNote, FaQuestionCircle, FaLightbulb, FaBookOpen, FaRandom, FaProjectDiagram, FaHome, FaChartLine } from 'react-icons/fa';

export default function HomePage() {
  const features = [
    { icon: <FaQuestionCircle />, title: 'Quiz Interaktif', desc: 'Uji pengetahuan dengan quiz study & exam mode. Pantau perkembangan Anda.', color: 'from-blue-500 to-cyan-600', href: '/quiz' },
    { icon: <FaLayerGroup />, title: 'Flashcard', desc: 'Kartu belajar interaktif dengan animasi flip. Efektif untuk hafalan cepat.', color: 'from-purple-500 to-violet-600', href: '/flashcards' },
    { icon: <FaStickyNote />, title: 'Catatan Cerdas', desc: 'Buat dan kelola catatan dengan editor kaya fitur. Bagikan atau simpan privat.', color: 'from-green-500 to-emerald-600', href: '/notes' },
    { icon: <FaBrain />, title: 'Metode Belajar', desc: 'SQ3R, Mind Palace, Dual Coding, Interleaving — teknik berbasis riset kognitif.', color: 'from-orange-500 to-amber-600', href: '/learning' },
    { icon: <FaChartLine />, title: 'Progress Tracking', desc: 'Dashboard analytics dengan grafik nilai, streak belajar, dan distribusi mata pelajaran.', color: 'from-pink-500 to-rose-600', href: '/dashboard' },
    { icon: <FaGraduationCap />, title: 'Platform Modern', desc: 'UI glassmorphism premium, dark mode, dan PWA — belajar di mana saja.', color: 'from-teal-500 to-cyan-600', href: '/' },
  ];

  const learningMethods = [
    { icon: <FaBookOpen />, title: 'SQ3R Reading', desc: '5 tahap terstruktur', color: 'from-teal-500 to-cyan-600', href: '/learning/sq3r' },
    { icon: <FaRandom />, title: 'Interleaving', desc: 'Rotasi antar topik', color: 'from-indigo-500 to-violet-600', href: '/learning' },
    { icon: <FaProjectDiagram />, title: 'Visual Builder', desc: 'Peta konsep interaktif', color: 'from-pink-500 to-rose-600', href: '/learning/dual-coding' },
    { icon: <FaBrain />, title: 'Deep Understanding', desc: 'Elaborative interrogation', color: 'from-violet-500 to-purple-600', href: '/learning' },
    { icon: <FaHome />, title: 'Mind Palace', desc: 'Memori spasial virtual', color: 'from-amber-500 to-orange-600', href: '/learning/mind-palace' },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-medium text-primary-600 dark:text-primary-400 mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Platform Belajar Modern — Berbasis Riset Kognitif
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Belajar Lebih{' '}
            <span className="gradient-text">Cerdas</span>{' '}
            Bukan Lebih Keras
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Quiz interaktif, flashcard, catatan cerdas, dan metode belajar berbasis sains — semuanya dalam satu platform premium.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl hover:-translate-y-1 transition-all inline-flex items-center gap-2 btn-ripple">
              Mulai Gratis <FaArrowRight />
            </Link>
            <Link href="/quiz" className="px-8 py-4 glass rounded-xl font-semibold text-lg hover:shadow-lg hover:-translate-y-1 transition-all inline-flex items-center gap-2">
              Coba Quiz
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { value: '500+', label: 'Soal Quiz' },
              { value: '50+', label: 'Deck Flashcard' },
              { value: '5', label: 'Metode Belajar' },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-4 text-center">
                <div className="text-2xl font-extrabold gradient-text">{s.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Fitur Lengkap untuk Belajar Efektif</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Semua yang Anda butuhkan dalam satu platform</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Link key={f.title} href={f.href} className="glass rounded-2xl p-6 card-hover group border border-white/20 dark:border-gray-700/50">
                <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center text-white text-xl mb-4 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium">
                  Jelajahi <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEARNING METHODS ── */}
      <section className="py-20 px-4 bg-gray-100/50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold rounded-full uppercase tracking-wider">Baru</span>
            <h2 className="text-4xl font-bold mt-4 mb-4">Modul Pembelajaran Lanjutan</h2>
            <p className="text-gray-500 dark:text-gray-400">Teknik belajar berbasis riset kognitif modern</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {learningMethods.map((m) => (
              <Link key={m.title} href={m.href} className="glass rounded-2xl p-5 hover:shadow-lg transition-all group border border-white/20 dark:border-gray-700/50">
                <div className={`w-12 h-12 bg-gradient-to-br ${m.color} rounded-xl flex items-center justify-center text-white text-lg mb-3 group-hover:scale-110 transition-transform`}>
                  {m.icon}
                </div>
                <h3 className="font-bold text-sm mb-1">{m.title}</h3>
                <p className="text-xs text-gray-500">{m.desc}</p>
                <div className="mt-3 flex items-center text-xs font-medium text-primary-600 dark:text-primary-400">
                  Mulai <FaArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-12">
          <h2 className="text-4xl font-bold mb-4">Siap Mulai Belajar?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">Daftar gratis dan akses semua fitur platform Learn Center</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:-translate-y-1 transition-all inline-flex items-center justify-center gap-2 btn-ripple">
              Daftar Sekarang <FaArrowRight />
            </Link>
            <Link href="/login" className="px-8 py-4 glass rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all">
              Sudah Punya Akun
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
