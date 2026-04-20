'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { createClient } from '@/lib/supabase/client';

// Lazy-load the 3D mascot — only on auth pages, only in browser
const RobotMascot = dynamic(() => import('@/components/RobotMascot'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-900/50 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin" />
    </div>
  ),
});

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [remember, setRemember]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password wajib diisi');
      return;
    }

    setLoading(true);
    
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
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
          <div id="mascot-3d-container" className="relative z-10 w-full h-full min-h-[400px]">
            <RobotMascot />
          </div>
        </div>

        {/* Right: Form */}
        <div className="w-full md:w-[58%] px-8 py-8 sm:px-10 sm:py-9 flex flex-col justify-center">

          {/* Header */}
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">LC</span>
              </div>
              <span className="text-base font-bold text-gray-900 dark:text-white">Learn Center</span>
            </Link>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Selamat Datang Kembali
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Masukkan detail akun Anda untuk melanjutkan
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center text-red-600 dark:text-red-400 text-sm gap-2">
              <span className="text-xs">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label htmlFor="username" className="auth-label">Email atau Username</label>
              <div className="relative auth-field">
                <FaEnvelope className="auth-icon" style={{ fontSize: 14 }} />
                <input
                  id="username"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="auth-input"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="auth-label">Kata Sandi</label>
              <div className="relative auth-field">
                <FaLock className="auth-icon" style={{ fontSize: 13 }} />
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="auth-input"
                  style={{ paddingRight: 40 }}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  id="togglePassword"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? "Sembunyikan password" : "Lihat password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPass ? <FaEyeSlash className="text-sm" aria-hidden="true" /> : <FaEye className="text-sm" aria-hidden="true" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-gray-600 dark:text-gray-400">Ingat saya</span>
              </label>
              <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                Lupa kata sandi?
              </a>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="auth-btn auth-btn-primary">
              {loading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><span>Masuk</span><FaArrowRight className="text-xs" /></>
              }
            </button>
          </form>

          {/* Google OAuth divider + button (UI only) */}
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
            <span>Masuk dengan Google</span>
          </button>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Belum punya akun?{' '}
            <Link href="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
