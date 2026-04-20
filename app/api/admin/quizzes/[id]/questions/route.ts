import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdmin, adminError } from '@/lib/admin';
import { z } from 'zod';

const questionSchema = z.object({
  question: z.string().min(1),
  question_type: z.enum(['multiple_choice', 'true_false', 'multiple_answer', 'essay']),
  options: z.array(z.string()).optional(),
  correct_answer: z.string().min(1),
  explanation: z.string().optional(),
  points: z.number().min(1).default(1),
  order_num: z.number().optional()
});

const batchSchema = z.array(questionSchema);

import { sanitizeObject } from '@/lib/sanitizer';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { user, isAdmin, error } = await verifyAdmin();
  if (!isAdmin) return adminError(error!);

  try {
    const rawBody = await req.json();
    const validated = batchSchema.parse(rawBody);
    const sanitized = sanitizeObject(validated);

    const supabase = await createClient();
    
    // Use the TRANSACTIONAL RPC
    const { error: rpcError } = await supabase.rpc('batch_update_quiz_questions', {
      quiz_id_param: params.id,
      questions_json: sanitized
    });

    if (rpcError) return NextResponse.json({ error: rpcError.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
