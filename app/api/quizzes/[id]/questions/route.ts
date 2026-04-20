import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const quiz_id = params.id;

    // Use the SAFE VIEW which does not include correct_answer
    const { data: questions, error } = await supabase
      .from('quiz_questions_safe')
      .select('*')
      .eq('quiz_id', quiz_id)
      .order('order_num', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: questions });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
