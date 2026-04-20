import { createClient } from '@/lib/supabase/server';

/**
 * Basic Rate Limiter using a database table.
 * 
 * To use this, create a table:
 * CREATE TABLE rate_limits (
 *   key TEXT PRIMARY KEY,
 *   attempts INTEGER DEFAULT 0,
 *   last_attempt TIMESTAMPTZ DEFAULT NOW()
 * );
 */
export async function checkRateLimit(key: string, limit: number = 5, windowSeconds: number = 60): Promise<boolean> {
  const supabase = await createClient();
  const now = new Date();
  
  // Get current attempts
  const { data, error } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('key', key)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is 'not found'
    console.error('Rate limit check error:', error);
    return true; // Fail open to not block users on DB error
  }

  if (!data) {
    // First attempt
    await supabase.from('rate_limits').insert({ key, attempts: 1, last_attempt: now.toISOString() });
    return true;
  }

  const lastAttempt = new Date(data.last_attempt);
  const diffSeconds = (now.getTime() - lastAttempt.getTime()) / 1000;

  if (diffSeconds > windowSeconds) {
    // Window expired, reset
    await supabase.from('rate_limits').update({ attempts: 1, last_attempt: now.toISOString() }).eq('key', key);
    return true;
  }

  if (data.attempts >= limit) {
    return false; // Rate limited
  }

  // Increment attempts
  await supabase.from('rate_limits').update({ attempts: data.attempts + 1 }).eq('key', key);
  return true;
}
