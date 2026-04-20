import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowLeft, FaEdit, FaGlobe, FaLock } from 'react-icons/fa';
import GlassCard from '@/components/ui/GlassCard';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server';

export default async function ViewNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Try to fetch note and join with profiles to get the username
  const { data: note, error } = await supabase
    .from('notes')
    .select('id, title, content, is_public, created_at, user_id, profiles(username)')
    .eq('id', id)
    .single();

  if (error || !note) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Catatan tidak ditemukan atau Anda tidak memiliki akses.</p>
        <Link href="/notes" className="text-primary-600 hover:underline">Kembali</Link>
      </div>
    );
  }

  // Determine if current user is owner (to show edit button)
  const isOwner = user?.id === note.user_id;

  // Extract username
  const username = Array.isArray(note.profiles) 
    ? note.profiles[0]?.username 
    : (note.profiles as any)?.username || 'user';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/notes" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors">
          <FaArrowLeft /> Kembali
        </Link>
      </div>

      <GlassCard>
        <div className="flex items-start justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {note.is_public
              ? <Badge variant="success"><FaGlobe className="mr-1 text-[10px]" />Publik</Badge>
              : <Badge variant="warning"><FaLock className="mr-1 text-[10px]" />Pribadi</Badge>
            }
          </div>
          {isOwner && (
            <Link href={`/notes/${note.id}/edit`} className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <FaEdit /> Edit
            </Link>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-2">{note.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          Oleh @{username} • {formatDate(note.created_at)}
        </p>

        <div className="editor-content prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: note.content || '' }} />
      </GlassCard>
    </div>
  );
}
