import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { user: null, isAdmin: false, error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'admin';
  
  if (!isAdmin) return { user, isAdmin: false, error: 'Forbidden' };

  return { user, isAdmin: true, error: null };
}

export function adminError(error: string) {
  if (error === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
