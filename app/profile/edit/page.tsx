'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import GlassCard from '@/components/ui/GlassCard';

export default function ProfileEditPage() {
  const router = useRouter();
  const [form, setForm] = useState({ full_name: '', bio: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    router.push('/profile');
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 relative z-10">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/profile" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600"><FaArrowLeft /> Kembali</Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Edit Profil</h1>
      <GlassCard>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="auth-label">Nama Lengkap</label>
            <input value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              className="w-full px-4 py-3 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Nama lengkap Anda" />
          </div>
          <div>
            <label className="auth-label">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={4}
              className="w-full px-4 py-3 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Ceritakan sedikit tentang diri Anda..." />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-60 transition-colors font-medium">
              {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FaSave />}
              Simpan Perubahan
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}
