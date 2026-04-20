'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import GlassCard from '@/components/ui/GlassCard';

export default function CreateNotePage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', subject: '', content: '', is_public: false });
  const [loading, setLoading] = useState(false);

  function update(k: string, v: string | boolean) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const json = await res.json();
      
      if (!res.ok || json.error) {
        alert(json.error || 'Terjadi kesalahan saat menyimpan catatan');
      } else {
        router.push('/notes');
        router.refresh();
      }
    } catch (err) {
      alert('Gagal menghubungi server');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 relative z-10">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/notes" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors">
          <FaArrowLeft /> Kembali
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Buat Catatan Baru</h1>
      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="auth-label">Judul Catatan</label>
            <input value={form.title} onChange={(e) => update('title', e.target.value)} required
              className="w-full px-4 py-3 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Masukkan judul catatan..." />
          </div>
          <div>
            <label className="auth-label">Mata Pelajaran</label>
            <input value={form.subject} onChange={(e) => update('subject', e.target.value)}
              className="w-full px-4 py-3 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Contoh: Matematika, Fisika..." />
          </div>
          <div>
            <label className="auth-label">Isi Catatan</label>
            <textarea value={form.content} onChange={(e) => update('content', e.target.value)} required rows={10}
              className="w-full px-4 py-3 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Tulis catatan Anda di sini..." />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="is_public" checked={form.is_public} onChange={(e) => update('is_public', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600" />
            <label htmlFor="is_public" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              Jadikan catatan publik (dapat dilihat pengguna lain)
            </label>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-60 transition-colors font-medium">
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaSave />}
              Simpan Catatan
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
