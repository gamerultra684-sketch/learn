import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdmin, adminError } from '@/lib/admin';
import { z } from 'zod';

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  subject: z.string().min(2).optional(),
  description: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  time_limit: z.number().min(5).optional(),
  is_public: z.boolean().optional()
});

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { isAdmin, error } = await verifyAdmin();
  if (!isAdmin) return adminError(error!);

  const supabase = await createClient();
  const { data, error: fetchError } = await supabase
    .from('quizzes')
    .select('*, quiz_questions(*)')
    .eq('id', params.id)
    .single();

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });

  return NextResponse.json({ data });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { isAdmin, error } = await verifyAdmin();
  if (!isAdmin) return adminError(error!);

  try {
    const body = await req.json();
    const validated = updateSchema.parse(body);

    const supabase = await createClient();
    const { data, error: updateError } = await supabase
      .from('quizzes')
      .update(validated)
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { isAdmin, error } = await verifyAdmin();
  if (!isAdmin) return adminError(error!);

  const supabase = await createClient();
  const { error: deleteError } = await supabase
    .from('quizzes')
    .delete()
    .eq('id', params.id);

  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
