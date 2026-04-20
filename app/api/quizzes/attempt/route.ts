import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { checkRateLimit } from '@/lib/rate-limit';

// Levenshtein distance for essay similarity
function getSimilarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  const longerLength = longer.length;
  if (longerLength === 0) return 1.0;
  
  const editDistance = (s1: string, s2: string) => {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  };

  return (longerLength - editDistance(longer, shorter)) / longerLength;
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { quiz_id, mode, answers } = body;

    if (!quiz_id || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Advanced Rate Limiting
    const rateLimitKey = `quiz_submit_${user.id}_${quiz_id}`;
    const isAllowed = await checkRateLimit(rateLimitKey, 1, 30); // 1 attempt per 30s
    if (!isAllowed) {
      return NextResponse.json({ error: 'Terlalu banyak percobaan. Harap tunggu 30 detik.' }, { status: 429 });
    }

    // Use admin client to fetch real correct answers (bypassing the safe view)
    const admin = createAdminClient();
    const { data: questions, error: qError } = await admin
      .from('quiz_questions')
      .select('id, correct_answer, question_type, points')
      .eq('quiz_id', quiz_id);

    if (qError || !questions) {
      return NextResponse.json({ error: 'Quiz questions not found' }, { status: 404 });
    }

    let score = 0;
    let total_points = 0;
    const processedAnswers: any = {};

    for (const q of questions) {
      const userAnswer = answers[q.id];
      const correctAnswer = q.correct_answer;
      const qPoints = q.points || 1;
      total_points += qPoints;

      let isCorrect = false;

      if (userAnswer !== undefined && userAnswer !== null) {
        switch (q.question_type) {
          case 'multiple_choice':
            isCorrect = String(userAnswer) === String(correctAnswer);
            break;
          case 'true_false':
            isCorrect = String(userAnswer).toLowerCase() === String(correctAnswer).toLowerCase();
            break;
          case 'multiple_answer':
            try {
              const uArr = (Array.isArray(userAnswer) ? userAnswer : []).sort();
              const cArr = (JSON.parse(correctAnswer) as any[]).sort();
              isCorrect = JSON.stringify(uArr) === JSON.stringify(cArr);
            } catch (e) { isCorrect = false; }
            break;
          case 'essay':
            const similarity = getSimilarity(
              String(userAnswer).toLowerCase().trim(),
              String(correctAnswer).toLowerCase().trim()
            );
            isCorrect = similarity >= 0.8;
            break;
        }
      }

      if (isCorrect) score += qPoints;
      
      processedAnswers[q.id] = {
        answer: userAnswer,
        is_correct: isCorrect,
        points_earned: isCorrect ? qPoints : 0
      };
    }

    // Store result
    const { data: result, error: insertError } = await admin
      .from('quiz_results')
      .insert({
        user_id: user.id,
        quiz_id,
        mode,
        score,
        total_points,
        answers: processedAnswers
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save result' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      attempt_id: result.id,
      score,
      total_points
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
