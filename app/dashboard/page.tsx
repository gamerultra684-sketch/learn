import { redirect } from 'next/navigation';
import { getDashboardData } from '@/lib/dashboard';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    redirect('/login');
  }

  return <DashboardClient initialData={data} />;
}
