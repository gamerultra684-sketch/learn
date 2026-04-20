-- ========================================================================================
-- DASHBOARD AGGREGATION RPC
-- ========================================================================================

CREATE OR REPLACE FUNCTION get_subject_stats(user_id_param UUID DEFAULT NULL)
RETURNS TABLE (subject TEXT, attempts BIGINT, avg_score NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.subject, 
        COUNT(qr.id) as attempts,
        AVG((qr.score::numeric / NULLIF(qr.total_points, 0)::numeric) * 100) as avg_score
    FROM quiz_results qr
    JOIN quizzes q ON qr.quiz_id = q.id
    WHERE (user_id_param IS NULL OR qr.user_id = user_id_param)
    GROUP BY q.subject;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Weekly stats RPC for activity chart
CREATE OR REPLACE FUNCTION get_weekly_stats(user_id_param UUID DEFAULT NULL)
RETURNS TABLE (day_num DOUBLE PRECISION, quiz_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        EXTRACT(DOW FROM completed_at) as day_num,
        COUNT(id) as quiz_count
    FROM quiz_results
    WHERE 
        completed_at > NOW() - INTERVAL '7 days'
        AND (user_id_param IS NULL OR user_id = user_id_param)
    GROUP BY EXTRACT(DOW FROM completed_at);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 30-day average score history
CREATE OR REPLACE FUNCTION get_daily_avg_scores(user_id_param UUID DEFAULT NULL)
RETURNS TABLE (date DATE, avg_score NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        completed_at::date as date,
        AVG((score::numeric / NULLIF(total_points, 0)::numeric) * 100) as avg_score
    FROM quiz_results
    WHERE 
        completed_at > NOW() - INTERVAL '30 days'
        AND (user_id_param IS NULL OR user_id = user_id_param)
    GROUP BY completed_at::date
    ORDER BY completed_at::date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
