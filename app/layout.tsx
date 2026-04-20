import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimatedBackground from '@/components/layout/AnimatedBackground';

export const metadata: Metadata = {
  title: 'Learn Center - Platform Belajar Modern',
  description: 'Platform belajar modern dengan quiz, flashcard, catatan, dan metode belajar efektif.',
  manifest: '/manifest.json',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)',  color: '#1e3a8a' },
  ],
  openGraph: {
    title: 'Learn Center - Platform Belajar Modern',
    description: 'Platform belajar modern dengan quiz, flashcard, catatan, dan metode belajar efektif.',
    type: 'website',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Learn Center',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Google Fonts — Inter + Poppins (exact match from header.php) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Dark mode init script — runs before paint to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var t = localStorage.getItem('lc_theme');
                var dark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (dark) document.documentElement.classList.add('dark');
              } catch(e){}
            })();`,
          }}
        />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 min-h-screen flex flex-col relative overflow-x-hidden pb-16 md:pb-0">
        <AuthProvider>
          {/* Animated blob background */}
          <AnimatedBackground />

          {/* Sticky Navbar */}
          <Navbar />

          {/* Toast container (rendered by individual pages via useToast) */}
          <div id="toastContainer" />

          {/* Page content */}
          <main className="flex-grow relative z-10">
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
