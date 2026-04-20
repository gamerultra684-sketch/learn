import { createClient } from '@/lib/supabase/server';

export async function getDashboardData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch profile to check if admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, username')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'admin';

  // Base queries
  let notesQuery = supabase.from('notes').select('id, title, created_at, is_public, user_id, profiles(username)', { count: 'exact' });
  let resultsQuery = supabase.from('quiz_results').select('id, score, total_points, completed_at, user_id, quizzes(title, subject), profiles(username)', { count: 'exact' });

  if (!isAdmin) {
    notesQuery = notesQuery.eq('user_id', user.id);
    resultsQuery = resultsQuery.eq('user_id', user.id);
  }

  const [notesRes, resultsRes] = await Promise.all([
    notesQuery.order('created_at', { ascending: false }).limit(5),
    resultsQuery.order('completed_at', { ascending: false }).limit(5)
  ]);

  // Aggregate stats
  const totalNotes = notesRes.count || 0;
  const totalAttempts = resultsRes.count || 0;
  
  // For average score, we need more data or a separate RPC
  // Since we only fetched 5 results, we need to fetch all for the calculation or use an aggregation
  const { data: allScores } = await (isAdmin 
    ? supabase.from('quiz_results').select('score, total_points')
    : supabase.from('quiz_results').select('score, total_points').eq('user_id', user.id));

  let avgScore = 0;
  if (allScores && allScores.length > 0) {
    const totalScorePct = allScores.reduce((acc, curr) => acc + (curr.score / (curr.total_points || 1)), 0);
    avgScore = Math.round((totalScorePct / allScores.length) * 100);
  }

  // Flashcards (Assuming flashcard_progress or similar)
  const { count: flashcardsCount } = await (isAdmin 
    ? supabase.from('flashcard_progress').select('*', { count: 'exact', head: true })
    : supabase.from('flashcard_progress').select('*', { count: 'exact', head: true }).eq('user_id', user.id));

  // Weekly Activity
  const { data: weeklyStats } = await supabase.rpc('get_weekly_stats', { 
    user_id_param: isAdmin ? null : user.id 
  });

  // Subject Distribution
  const { data: subjectStats } = await supabase.rpc('get_subject_stats', { 
    user_id_param: isAdmin ? null : user.id 
  });

  // History Chart
  const { data: historyData } = await supabase.rpc('get_daily_avg_scores', {
    user_id_param: isAdmin ? null : user.id
  });

  return {
    user: { ...user, ...profile },
    isAdmin,
    stats: {
      total_notes: totalNotes,
      quiz_attempts: totalAttempts,
      avg_score: avgScore,
      flashcards_studied: flashcardsCount || 0,
      total_users: isAdmin ? (await supabase.from('profiles').select('*', { count: 'exact', head: true })).count : 0,
      streak: 0
    },
    recentNotes: notesRes.data || [],
    recentAttempts: (resultsRes.data || []).map((r: any) => ({
      ...r,
      quiz_title: r.quizzes?.title,
      subject: r.quizzes?.subject,
      username: r.profiles?.username
    })),
    weeklyActivity: weeklyStats || [],
    subjectStats: subjectStats || [],
    historyData: historyData || []
  };
}
