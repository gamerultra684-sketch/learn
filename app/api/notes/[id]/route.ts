import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function apiResponse(data: any, error: string | null = null, status: number = 200) {
  return NextResponse.json({ data, error }, { status });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return apiResponse(null, 'Unauthorized', 401);
    }

    // Await params because in Next.js 15, route params are Promises
    const { id } = await params;

    if (!id) {
      return apiResponse(null, 'Note ID is required in URL', 400);
    }

    const body = await request.json();
    const { title, content, is_public } = body;

    const updates: any = {};
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return apiResponse(null, 'Valid title is required', 400);
      }
      if (title.length > 255) {
        return apiResponse(null, 'Title is too long (max 255 chars)', 400);
      }
      updates.title = title.trim();
    }
    
    if (content !== undefined) {
      if (typeof content !== 'string') {
        return apiResponse(null, 'Content must be text', 400);
      }
      updates.content = content.trim();
    }

    if (is_public !== undefined) {
      if (typeof is_public !== 'boolean') {
        return apiResponse(null, 'is_public must be boolean', 400);
      }
      updates.is_public = is_public;
    }

    if (Object.keys(updates).length === 0) {
      return apiResponse(null, 'No fields to update', 400);
    }

    const { data: note, error: updateError } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('id, title, content, is_public, created_at, updated_at')
      .single();

    if (updateError) {
      return apiResponse(null, updateError.message, 500);
    }

    if (!note) {
      return apiResponse(null, 'Note not found or you do not have permission', 404);
    }

    return apiResponse(note, null, 200);
  } catch (error: any) {
    return apiResponse(null, error.message || 'Internal Server Error', 500);
  }
}
