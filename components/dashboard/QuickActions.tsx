'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import GlassCard from '@/components/ui/GlassCard';

interface ActionItem {
  href: string;
  icon: ReactNode;
  label: string;
  sub: string;
  bg: string;
  hover: string;
  iconBg: string;
}

interface QuickActionsProps {
  actions: ActionItem[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <GlassCard>
      <h2 className="text-xl font-bold mb-4">Aksi Cepat</h2>
      <div className="space-y-3">
        {actions.map((a) => (
          <Link key={a.href} href={a.href} className={`flex items-center p-4 ${a.bg} rounded-xl ${a.hover} transition-colors`}>
            <div className={`w-10 h-10 ${a.iconBg} rounded-lg flex items-center justify-center mr-3 text-white`}>{a.icon}</div>
            <div>
              <div className="font-medium">{a.label}</div>
              <div className="text-sm text-gray-500">{a.sub}</div>
            </div>
          </Link>
        ))}
      </div>
    </GlassCard>
  );
}
