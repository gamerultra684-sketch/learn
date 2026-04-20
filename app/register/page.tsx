'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FaEye, FaEyeSlash, FaArrowRight, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { createClient } from '@/lib/supabase/client';

const RobotMascot = dynamic(() => import('@/components/RobotMascot'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-900/50 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin" />
    </div>
  ),
});

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass]  = useState(false);
  const [showConf, setShowConf]  = useState(false);
  const [loading, setLoading]    = useState(false);
  const [error, setError]        = useState('');

  function update(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.username || !form.email || !form.password) {
      setError('Semua field wajib diisi');
      return;
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Konfirmasi password tidak cocok');
      return;
    }

    setLoading(true);
    
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          username: form.username,
          avatar_url: `https://api.dicebear.com/7.x/notionists/svg?seed=${form.username}`
        }
      }
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
    } else {
      router.replace('/dashboard');
      router.refresh();
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-indigo-300/20 dark:bg-indigo-900/15 rounded-full filter blur-[80px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-72 h-72 bg-purple-300/20 dark:bg-purple-900/15 rounded-full filter blur-[80px]" />

      {/* Card */}
      <div className="flex w-full max-w-[860px] bg-white dark:bg-[#1a1c23] rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 overflow-hidden relative z-10 border border-gray-100 dark:border-gray-800">

        {/* Left: 3D Robot */}
        <div className="hidden md:flex w-[42%] bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-[#13151a] dark:via-[#171924] dark:to-[#13151a] items-center justify-center relative overflow-hidden flex-shrink-0">
          <div className="absolute top-[15%] left-[15%] w-32 h-32 bg-indigo-200/50 dark:bg-indigo-900/25 rounded-full filter blur-[40px]" />
          <div className="absolute bottom-[15%] right-[15%] w-32 h-32 bg-purple-200/50 dark:bg-purple-900/25 rounded-full filter blur-[40px]" />
          <div id="mascot-3d-container" className="relative z-10 w-full h-full min-h-[500px]">
            <RobotMascot />
          </div>
        </div>

        {/* Right: Form */}
        <div className="w-full md:w-[58%] px-8 py-8 sm:px-10 sm:py-9 flex flex-col justify-center">

          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">LC</span>
              </div>
              <span className="text-base font-bold text-gray-900 dark:text-white">Learn Center</span>
            </Link>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Buat Akun Baru
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Bergabung dan mulai perjalanan belajar Anda
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center text-red-600 dark:text-red-400 text-sm gap-2">
              <span className="text-xs">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label htmlFor="username" className="auth-label">Username</label>
              <div className="relative auth-field">
                <FaUser className="auth-icon" style={{ fontSize: 13 }} />
                <input
                  id="username" type="text" required autoComplete="username"
                  value={form.username} onChange={(e) => update('username', e.target.value)}
                  placeholder="johndoe" className="auth-input"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="auth-label">Email</label>
              <div className="relative auth-field">
                <FaEnvelope className="auth-icon" style={{ fontSize: 13 }} />
                <input
                  id="email" type="email" required autoComplete="email"
                  value={form.email} onChange={(e) => update('email', e.target.value)}
                  placeholder="nama@email.com" className="auth-input"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="auth-label">Kata Sandi</label>
              <div className="relative auth-field">
                <FaLock className="auth-icon" style={{ fontSize: 13 }} />
                <input
                  id="password" type={showPass ? 'text' : 'password'} required
                  autoComplete="new-password"
                  value={form.password} onChange={(e) => update('password', e.target.value)}
                  placeholder="Minimal 6 karakter" className="auth-input" style={{ paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowPass((v) => !v)} aria-label={showPass ? "Sembunyikan password" : "Lihat password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  {showPass ? <FaEyeSlash className="text-sm" aria-hidden="true" /> : <FaEye className="text-sm" aria-hidden="true" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm" className="auth-label">Konfirmasi Kata Sandi</label>
              <div className="relative auth-field">
                <FaLock className="auth-icon" style={{ fontSize: 13 }} />
                <input
                  id="confirm" type={showConf ? 'text' : 'password'} required
                  autoComplete="new-password"
                  value={form.confirm} onChange={(e) => update('confirm', e.target.value)}
                  placeholder="Ulangi kata sandi" className="auth-input" style={{ paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowConf((v) => !v)} aria-label={showConf ? "Sembunyikan konfirmasi password" : "Lihat konfirmasi password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  {showConf ? <FaEyeSlash className="text-sm" aria-hidden="true" /> : <FaEye className="text-sm" aria-hidden="true" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="auth-btn auth-btn-primary">
              {loading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><span>Daftar</span><FaArrowRight className="text-xs" /></>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white dark:bg-[#1a1c23] text-xs text-gray-400 uppercase tracking-wider">atau</span>
            </div>
          </div>
          <button type="button" className="auth-btn auth-btn-outline">
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
              <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
              <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"/>
              <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
            </svg>
            <span>Daftar dengan Google</span>
          </button>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Masuk sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
