import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: string;
}

/** Reusable glassmorphism card — exact .glass styling from header.php */
export default function GlassCard({ children, className = '', hover = false, padding = 'p-6' }: GlassCardProps) {
  return (
    <div
      className={`glass rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] ${padding} relative overflow-hidden border-t border-white/40 dark:border-gray-700/50 ${hover ? 'card-hover' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
