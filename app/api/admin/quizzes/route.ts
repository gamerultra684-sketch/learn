import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdmin, adminError } from '@/lib/admin';
import { z } from 'zod';

const quizSchema = z.object({
  title: z.string().min(3),
  subject: z.string().min(2),
  description: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  time_limit: z.number().min(5).default(30),
  is_public: z.boolean().default(false)
});

export async function GET() {
  const { isAdmin, error } = await verifyAdmin();
  if (!isAdmin) return adminError(error!);

  const supabase = await createClient();
  const { data, error: fetchError } = await supabase
    .from('quizzes')
    .select('*, quiz_questions(count)')
    .order('created_at', { ascending: false });

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });

  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const { user, isAdmin, error } = await verifyAdmin();
  if (!isAdmin) return adminError(error!);

  try {
    const body = await req.json();
    const validated = quizSchema.parse(body);

    const supabase = await createClient();
    const { data, error: insertError } = await supabase
      .from('quizzes')
      .insert({
        ...validated,
        user_id: user!.id
      })
      .select()
      .single();

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

    return NextResponse.json({ data });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
