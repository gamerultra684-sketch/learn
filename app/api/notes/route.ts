import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sanitize } from '@/lib/sanitizer';

function apiResponse(data: any, error: string | null = null, status: number = 200) {
  return NextResponse.json({ data, error }, { status });
}

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '20');
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: notes, error, count } = await supabase
      .from('notes')
      .select('*, profiles(username)', { count: 'exact' })
      .eq('is_deleted', false) // Soft delete filter
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      data: notes,
      meta: { page, limit, total: count }
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return apiResponse(null, 'Unauthorized', 401);
    }

    const body = await request.json();
    const { title, content } = body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return apiResponse(null, 'Valid title is required', 400);
    }
    if (title.length > 255) {
      return apiResponse(null, 'Title is too long (max 255 chars)', 400);
    }

    const { data: note, error: insertError } = await supabase
      .from('notes')
      .insert({
        title: sanitize(title),
        content: sanitize(content),
        user_id: user.id
      })
      .select('id, title, content, is_public, created_at, updated_at')
      .single();

    if (insertError) {
      return apiResponse(null, insertError.message, 500);
    }

    return apiResponse(note, null, 201);
  } catch (error: any) {
    return apiResponse(null, error.message || 'Internal Server Error', 500);
  }
}
