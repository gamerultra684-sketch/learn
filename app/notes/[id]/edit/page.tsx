'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import GlassCard from '@/components/ui/GlassCard';

export default function EditNotePage() {
  const router = useRouter();
  const { id } = useParams();
  
  const [form, setForm] = useState({ title: '', content: '', is_public: false });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    // Fetch current note data
    fetch(`/api/notes`)
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          const note = json.data.find((n: any) => n.id === id);
          if (note) {
            setForm({
              title: note.title || '',
              content: note.content || '',
              is_public: note.is_public || false
            });
          } else {
            alert('Catatan tidak ditemukan');
            router.push('/notes');
          }
        }
      })
      .catch(() => alert('Gagal memuat catatan'))
      .finally(() => setFetching(false));
  }, [id, router]);

  function update(k: string, v: string | boolean) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const json = await res.json();
      
      if (!res.ok || json.error) {
        alert(json.error || 'Terjadi kesalahan saat mengupdate catatan');
      } else {
        router.push(`/notes/${id}`);
        router.refresh();
      }
    } catch (err) {
      alert('Gagal menghubungi server');
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <div className="p-8 text-center">Memuat...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 relative z-10">
      <div className="flex items-center gap-4 mb-6">
        <Link href={`/notes/${id}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors">
          <FaArrowLeft /> Batal
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Edit Catatan</h1>
      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="auth-label">Judul Catatan</label>
            <input value={form.title} onChange={(e) => update('title', e.target.value)} required
              className="w-full px-4 py-3 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Masukkan judul catatan..." />
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
              Update Catatan
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
