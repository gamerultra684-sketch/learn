'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaSun, FaMoon, FaBars, FaTimes, FaHome, FaTachometerAlt,
  FaQuestionCircle, FaLayerGroup, FaStickyNote, FaLightbulb,
  FaCog, FaUser, FaBook, FaFolder, FaSignOutAlt, FaSignInAlt,
  FaUserPlus, FaChevronDown,
} from 'react-icons/fa';
import { useAuth } from '@/lib/auth-context';

// ── Navbar — exact port from header.php ──────────────────────────

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Sync dark mode with <html> class on mount
  useEffect(() => {
    const stored = localStorage.getItem('lc_theme');
    const dark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('lc_theme', next ? 'dark' : 'light');
  }

  const navLinks = [
    { href: '/',          label: 'Beranda',   icon: <FaHome /> },
    ...(user ? [{ href: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> }] : []),
    { href: '/quiz',        label: 'Quiz',      icon: <FaQuestionCircle /> },
    { href: '/flashcards',  label: 'Flashcard', icon: <FaLayerGroup /> },
    { href: '/notes',       label: 'Catatan',   icon: <FaStickyNote /> },
    { href: '/learning',    label: 'Metode',    icon: <FaLightbulb /> },
  ];

  const avatar = user?.avatar
    ? `/uploads/${user.avatar}`
    : '/images/default-avatar.png';

  return (
    <>
      {/* ── TOP NAV ── */}
      <nav className="sticky top-0 z-50 glass border-b-0 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">

            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:-rotate-6 transition-transform shadow-sm">
                  <span className="text-white font-bold text-sm">LC</span>
                </div>
                <span className="text-xl font-bold gradient-text">Learn Center</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === l.href
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              {user && isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">

              {/* Theme toggle */}
              <button
                id="themeToggle"
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark
                  ? <FaMoon className="text-blue-400" />
                  : <FaSun className="text-yellow-500" />
                }
              </button>

              {user ? (
                /* User dropdown */
                <div className="relative" ref={userMenuRef}>
                  <button
                    id="userMenuBtn"
                    onClick={(e) => { e.stopPropagation(); setUserMenuOpen((v) => !v); }}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/default-avatar.png'; }}
                    />
                    <span className="hidden sm:block text-sm font-medium">{user.username}</span>
                    <FaChevronDown className="text-xs hidden sm:block" />
                  </button>

                  {userMenuOpen && (
                    <div
                      id="userMenu"
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
                    >
                      <Link href="/profile"   onClick={() => setUserMenuOpen(false)} className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <FaUser className="mr-2 text-gray-400" /> Profil
                      </Link>
                      <Link href="/notes"     onClick={() => setUserMenuOpen(false)} className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <FaBook className="mr-2 text-gray-400" /> Catatan Saya
                      </Link>
                      <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <FaFolder className="mr-2 text-gray-400" /> Folder
                      </Link>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <FaSignOutAlt className="mr-2" /> Keluar
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login"    className="hidden sm:block px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                    Masuk
                  </Link>
                  <Link href="/register" className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors btn-ripple">
                    Daftar
                  </Link>
                </>
              )}

              {/* Hamburger (mobile) */}
              <button
                id="mobileMenuBtn"
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <FaBars />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div
        id="mobileMenu"
        className={`fixed inset-0 z-50 md:hidden items-stretch ${mobileOpen ? 'flex menu-open' : 'hidden'}`}
      >
        <div
          id="mobileMenuOverlay"
          className="absolute inset-0 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />

        <div
          id="mobilePanel"
          className="absolute right-0 top-0 bottom-0 w-full glass shadow-xl flex flex-col z-50"
          style={{ transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s ease' }}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">LC</span>
              </div>
              <span className="text-xl font-bold gradient-text">Learn Center</span>
            </div>
            <button
              id="closeMobileMenu"
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <FaTimes />
            </button>
          </div>

          {/* Links */}
          <div className="p-4 space-y-1 overflow-y-auto flex-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <span className="mr-3 text-gray-400 w-5 text-center">{l.icon}</span>
                {l.label}
              </Link>
            ))}

            {user && (
              <>
                <hr className="my-3 border-gray-200 dark:border-gray-800" />
                <Link href="/profile"    onClick={() => setMobileOpen(false)} className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium">
                  <FaUser className="mr-3 text-gray-400 w-5 text-center" /> Profil
                </Link>
                <Link href="/notes"      onClick={() => setMobileOpen(false)} className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium">
                  <FaBook className="mr-3 text-gray-400 w-5 text-center" /> Catatan Saya
                </Link>
                {isAdmin && (
                  <Link href="/admin"    onClick={() => setMobileOpen(false)} className="flex items-center px-4 py-3 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-sm font-medium">
                    <FaCog className="mr-3 w-5 text-center" /> Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                >
                  <FaSignOutAlt className="mr-3 w-5 text-center" /> Keluar
                </button>
              </>
            )}

            {!user && (
              <>
                <hr className="my-3 border-gray-200 dark:border-gray-800" />
                <Link href="/login"    onClick={() => setMobileOpen(false)} className="flex items-center px-4 py-3 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors text-sm font-medium">
                  <FaSignInAlt className="mr-3 w-5 text-center" /> Masuk
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="flex items-center justify-center px-4 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm font-medium">
                  <FaUserPlus className="mr-3 w-5 text-center" /> Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/20 dark:border-gray-700/50 flex justify-around items-center px-2 py-1">
        <Link href="/" className="flex flex-col items-center justify-center w-full py-1 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
          <FaHome className="text-lg mb-1" />
          <span className="text-[10px] font-medium">Beranda</span>
        </Link>
        {user ? (
          <>
            <Link href="/dashboard" className="flex flex-col items-center justify-center w-full py-1 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
              <FaTachometerAlt className="text-lg mb-1" />
              <span className="text-[10px] font-medium">Dashboard</span>
            </Link>
            <Link href="/quiz" className="flex flex-col items-center justify-center w-full py-1 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
              <FaQuestionCircle className="text-lg mb-1" />
              <span className="text-[10px] font-medium">Quiz</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center justify-center w-full py-1 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
              <FaUser className="text-lg mb-1" />
              <span className="text-[10px] font-medium">Profil</span>
            </Link>
          </>
        ) : (
          <>
            <Link href="/quiz" className="flex flex-col items-center justify-center w-full py-1 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
              <FaQuestionCircle className="text-lg mb-1" />
              <span className="text-[10px] font-medium">Quiz</span>
            </Link>
            <Link href="/login" className="flex flex-col items-center justify-center w-full py-1 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400">
              <FaSignInAlt className="text-lg mb-1" />
              <span className="text-[10px] font-medium">Masuk</span>
            </Link>
          </>
        )}
      </div>
    </>
  );
}
