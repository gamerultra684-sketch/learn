import type { ReactNode } from 'react';

interface StatsCardProps {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  colorClass: string;       // e.g. 'blue'
  iconBgClass: string;      // e.g. 'bg-blue-100/50 dark:bg-blue-900/40'
  iconColorClass: string;   // e.g. 'text-blue-600 dark:text-blue-400'
  gradientClass: string;    // e.g. 'from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300'
  overlayClass: string;     // e.g. 'bg-blue-500/10 dark:bg-blue-500/20'
}

/** Stats card — exact port from dashboard.php stat cards */
export default function StatsCard({
  label, value, icon,
  iconBgClass, iconColorClass, gradientClass, overlayClass,
}: StatsCardProps) {
  return (
    <div className="min-w-[85vw] sm:min-w-0 snap-center glass rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)] card-hover relative overflow-hidden border-t border-white/40 dark:border-gray-700/50">
      {/* Color overlay */}
      <div className={`absolute inset-0 ${overlayClass} mix-blend-multiply dark:mix-blend-screen pointer-events-none`} />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{label}</p>
          <p className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradientClass}`}>
            {value}
          </p>
        </div>
        <div className={`w-12 h-12 ${iconBgClass} rounded-xl flex items-center justify-center ${iconColorClass} backdrop-blur-sm`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
