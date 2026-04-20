'use client';

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import GlassCard from '@/components/ui/GlassCard';

const CHART_COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#84cc16'];

interface DashboardChartsProps {
  isAdmin: boolean;
  dark: boolean;
  textColor: string;
  weeklyData: { name: string; quiz: number }[];
  historyData: { date: string; avg_score: number }[];
}

export default function DashboardCharts({ isAdmin, dark, textColor, weeklyData, historyData }: DashboardChartsProps) {
  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-8">
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{isAdmin ? 'Nilai Quiz Global (30 Hari)' : 'Riwayat Nilai Quiz (30 Hari)'}</h2>
          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">Rata-rata Harian</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="date" tick={{ fill: textColor, fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis domain={[0, 100]} tick={{ fill: textColor, fontSize: 11 }} />
              <Tooltip contentStyle={{ background: dark ? '#1f2937' : '#fff', border: 'none', borderRadius: 8 }} />
              <Line type="monotone" dataKey="avg_score" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }} name="Rata-rata Nilai (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{isAdmin ? 'Aktivitas Mingguan Global' : 'Aktivitas Mingguan'}</h2>
          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">Quiz per Hari</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#374151' : '#e5e7eb'} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 11 }} />
              <YAxis tick={{ fill: textColor, fontSize: 11 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: dark ? '#1f2937' : '#fff', border: 'none', borderRadius: 8 }} />
              <Bar dataKey="quiz" name="Jumlah Quiz" radius={[8, 8, 0, 0]}>
                {weeklyData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
}
