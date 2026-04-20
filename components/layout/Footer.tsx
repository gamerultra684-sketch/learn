'use client';

import Link from 'next/link';
import { FaGraduationCap, FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

// Exact port from includes/footer.php
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="glass border-t-0 mt-auto relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FaGraduationCap className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold gradient-text">Learn Center</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Platform belajar modern dengan berbagai metode pembelajaran efektif untuk membantu Anda mencapai potensi terbaik.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: <FaFacebookF className="text-sm" />, href: '#' },
                { icon: <FaTwitter className="text-sm" />, href: '#' },
                { icon: <FaInstagram className="text-sm" />, href: '#' },
                { icon: <FaYoutube className="text-sm" />, href: '#' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Menu */}
          <div>
            <h3 className="font-semibold mb-4">Menu Cepat</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Beranda',   href: '/' },
                { label: 'Quiz',      href: '/quiz' },
                { label: 'Flashcard', href: '/flashcards' },
                { label: 'Catatan',   href: '/notes' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning Methods */}
          <div>
            <h3 className="font-semibold mb-4">Metode Belajar</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Teknik Feynman',  href: '/learning?method=feynman' },
                { label: 'Blurting Method', href: '/learning?method=blurting' },
                { label: 'Mind Palace',     href: '/learning/mind-palace' },
                { label: 'Pomodoro',        href: '/learning?method=pomodoro' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Hubungi Kami</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-primary-500" />
                support@learncenter.com
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2 text-primary-500" />
                +62 123 4567 890
              </li>
              <li className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-primary-500" />
                Jakarta, Indonesia
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {year} Learn Center. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">
              Kebijakan Privasi
            </a>
            <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-primary-600 transition-colors">
              Syarat &amp; Ketentuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
