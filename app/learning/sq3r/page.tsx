'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';
import GlassCard from '@/components/ui/GlassCard';

const steps = ['Survey', 'Question', 'Read', 'Recite', 'Review'];
const stepDescs = [
  'Baca sekilas judul, subjudul, dan gambar untuk mendapatkan gambaran umum.',
  'Ubah setiap subjudul menjadi pertanyaan yang ingin Anda jawab.',
  'Baca teks secara aktif untuk menjawab pertanyaan yang Anda buat.',
  'Tutup buku dan coba ingat kembali jawaban dari setiap pertanyaan.',
  'Tinjau ulang catatan dan koreksi hal-hal yang belum dipahami.',
];

export default function SQ3RPage() {
  const [step, setStep] = useState(0);
  const [notes, setNotes] = useState<string[]>(Array(5).fill(''));
  const [done, setDone] = useState(false);

  function updateNote(val: string) { setNotes((n) => n.map((v, i) => i === step ? val : v)); }

  if (done) return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center relative z-10">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center">
        <FaCheck className="text-white text-3xl" />
      </div>
      <h2 className="text-3xl font-bold mb-2">Sesi SQ3R Selesai!</h2>
      <p className="text-gray-500 mb-6">Anda telah menyelesaikan semua 5 tahap membaca.</p>
      <div className="flex gap-4 justify-center">
        <button onClick={() => { setStep(0); setNotes(Array(5).fill('')); setDone(false); }}
          className="px-6 py-3 glass rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors">Ulangi</button>
        <Link href="/learning" className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-medium transition-colors">
          Kembali <FaArrowRight className="inline ml-1" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 relative z-10">
      <Link href="/learning" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6"><FaArrowLeft /> Metode Belajar</Link>
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          {steps.map((s, i) => (
            <div key={s} className={`flex flex-col items-center gap-1 ${i <= step ? 'text-teal-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i < step ? 'bg-teal-500 text-white' : i === step ? 'bg-teal-100 dark:bg-teal-900/30 border-2 border-teal-500 text-teal-600' : 'bg-gray-100 dark:bg-gray-700'}`}>
                {i < step ? <FaCheck /> : i + 1}
              </div>
              <span className="text-[10px] font-medium hidden sm:block">{s}</span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
      </div>

      <GlassCard className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold">{step + 1}</div>
          <div>
            <h2 className="text-xl font-bold">{steps[step]}</h2>
            <p className="text-sm text-gray-500">{stepDescs[step]}</p>
          </div>
        </div>
        <textarea value={notes[step]} onChange={(e) => updateNote(e.target.value)} rows={6}
          className="w-full px-4 py-3 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          placeholder={`Tulis catatan ${steps[step]} Anda di sini...`} />
      </GlassCard>

      <div className="flex justify-between">
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}
          className="px-4 py-2 glass rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
          <FaArrowLeft /> Sebelumnya
        </button>
        <button onClick={() => step < steps.length - 1 ? setStep((s) => s + 1) : setDone(true)}
          className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors">
          {step < steps.length - 1 ? 'Selanjutnya' : 'Selesai'} <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
