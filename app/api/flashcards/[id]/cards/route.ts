import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const cardSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1)
});

const batchSchema = z.array(cardSchema);

import { sanitizeObject } from '@/lib/sanitizer';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rawBody = await req.json();
    const validated = batchSchema.parse(rawBody);
    const sanitized = sanitizeObject(validated);

    // Use the TRANSACTIONAL RPC
    const { error: rpcError } = await supabase.rpc('batch_update_flashcards', {
      deck_id_param: params.id,
      cards_json: sanitized
    });

    if (rpcError) return NextResponse.json({ error: rpcError.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
