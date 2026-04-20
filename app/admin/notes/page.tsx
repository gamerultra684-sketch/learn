import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaTrash, FaEdit, FaEye, FaGlobe, FaLock } from 'react-icons/fa';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server';

export default async function AdminNotesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  // Fetch all notes for admin
  const { data: notes } = await supabase
    .from('notes')
    .select('id, title, is_public, created_at, profiles(username)')
    .order('created_at', { ascending: false });

  const allNotes = notes || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600"><FaArrowLeft /> Admin</Link>
        <span className="text-gray-300 dark:text-gray-600">/</span>
        <h1 className="text-2xl font-bold">Kelola Catatan</h1>
      </div>
      <GlassCard padding="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                {['#','Judul','Penulis','Visibilitas','Tanggal','Aksi'].map((h) => (
                  <th key={h} className="px-6 py-4 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {allNotes.map((n: any) => {
                const username = Array.isArray(n.profiles) ? n.profiles[0]?.username : n.profiles?.username || 'user';
                return (
                  <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-gray-400" title={n.id}>{n.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4 font-medium max-w-[180px] truncate">{n.title}</td>
                    <td className="px-6 py-4 text-primary-600">@{username}</td>
                    <td className="px-6 py-4">
                      <Badge variant={n.is_public ? 'success' : 'warning'}>
                        {n.is_public ? <><FaGlobe className="mr-1" />Publik</> : <><FaLock className="mr-1" />Pribadi</>}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{formatDate(n.created_at, { day:'numeric', month:'short', year:'numeric' })}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link href={`/notes/${n.id}`} className="p-1.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"><FaEye /></Link>
                        <button className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"><FaEdit /></button>
                        <button className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
