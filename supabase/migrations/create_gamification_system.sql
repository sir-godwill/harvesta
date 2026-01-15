-- Gamification System Tables

-- Achievement definitions
CREATE TABLE IF NOT EXISTS public.achievement_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    category TEXT CHECK (category IN ('seller', 'buyer', 'general', 'milestone')) DEFAULT 'general',
    points INTEGER DEFAULT 0,
    requirement_type TEXT CHECK (requirement_type IN ('order_count', 'product_count', 'rating', 'verification', 'streak', 'revenue')) NOT NULL,
    requirement_value INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievement_definitions(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress INTEGER DEFAULT 0,
    UNIQUE(user_id, achievement_id)
);

-- User points and ranking
CREATE TABLE IF NOT EXISTS public.user_points (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    current_rank INTEGER,
    streak_days INTEGER DEFAULT 0,
    last_activity_date DATE DEFAULT CURRENT_DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Point transactions (history)
CREATE TABLE IF NOT EXISTS public.point_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    action TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    marketing_emails BOOLEAN DEFAULT TRUE,
    order_updates BOOLEAN DEFAULT TRUE,
    message_notifications BOOLEAN DEFAULT TRUE,
    privacy_profile_visible BOOLEAN DEFAULT TRUE,
    privacy_show_online_status BOOLEAN DEFAULT TRUE,
    privacy_allow_messages_from TEXT CHECK (privacy_allow_messages_from IN ('everyone', 'verified', 'none')) DEFAULT 'everyone',
    language TEXT DEFAULT 'en',
    currency TEXT DEFAULT 'XAF',
    timezone TEXT DEFAULT 'Africa/Douala',
    theme TEXT CHECK (theme IN ('light', 'dark', 'auto')) DEFAULT 'auto',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User activity log
CREATE TABLE IF NOT EXISTS public.user_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    activity_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_earned ON public.user_achievements(earned_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_points_rank ON public.user_points(current_rank);
CREATE INDEX IF NOT EXISTS idx_user_points_level ON public.user_points(level DESC);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user ON public.point_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user ON public.user_activity_log(user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.achievement_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view achievement definitions"
ON public.achievement_definitions FOR SELECT
USING (is_active = TRUE);

CREATE POLICY "Users can view all achievements"
ON public.user_achievements FOR SELECT
USING (true);

CREATE POLICY "Users can view all points"
ON public.user_points FOR SELECT
USING (true);

CREATE POLICY "Users can view their own point transactions"
ON public.point_transactions FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can view and update their own preferences"
ON public.user_preferences FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own activity log"
ON public.user_activity_log FOR SELECT
USING (user_id = auth.uid());

-- Function to calculate user level based on points
CREATE OR REPLACE FUNCTION calculate_user_level(points INTEGER)
RETURNS INTEGER AS $$
BEGIN
    -- Level 1: 0-99 points
    -- Level 2: 100-299 points
    -- Level 3: 300-599 points
    -- Level 4: 600-999 points
    -- Level 5+: 1000+ points (every 500 points = 1 level)
    IF points < 100 THEN
        RETURN 1;
    ELSIF points < 300 THEN
        RETURN 2;
    ELSIF points < 600 THEN
        RETURN 3;
    ELSIF points < 1000 THEN
        RETURN 4;
    ELSE
        RETURN 5 + ((points - 1000) / 500);
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update user points and level
CREATE OR REPLACE FUNCTION update_user_points(
    p_user_id UUID,
    p_points INTEGER,
    p_action TEXT,
    p_description TEXT DEFAULT NULL
)
RETURNS void AS $$
DECLARE
    v_new_total INTEGER;
    v_new_level INTEGER;
BEGIN
    -- Insert or update user_points
    INSERT INTO public.user_points (user_id, total_points, level, updated_at)
    VALUES (p_user_id, p_points, calculate_user_level(p_points), NOW())
    ON CONFLICT (user_id) DO UPDATE
    SET total_points = user_points.total_points + p_points,
        level = calculate_user_level(user_points.total_points + p_points),
        updated_at = NOW()
    RETURNING total_points INTO v_new_total;

    -- Record transaction
    INSERT INTO public.point_transactions (user_id, points, action, description)
    VALUES (p_user_id, p_points, p_action, p_description);
END;
$$ LANGUAGE plpgsql;

-- Function to update daily streak
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_last_activity DATE;
    v_current_streak INTEGER;
    v_new_streak INTEGER;
BEGIN
    SELECT last_activity_date, streak_days
    INTO v_last_activity, v_current_streak
    FROM public.user_points
    WHERE user_id = p_user_id;

    -- If no record, create one
    IF NOT FOUND THEN
        INSERT INTO public.user_points (user_id, streak_days, last_activity_date)
        VALUES (p_user_id, 1, CURRENT_DATE);
        RETURN 1;
    END IF;

    -- Check if activity is today
    IF v_last_activity = CURRENT_DATE THEN
        RETURN v_current_streak;
    END IF;

    -- Check if streak continues (yesterday)
    IF v_last_activity = CURRENT_DATE - INTERVAL '1 day' THEN
        v_new_streak := v_current_streak + 1;
    ELSE
        -- Streak broken, reset to 1
        v_new_streak := 1;
    END IF;

    -- Update streak
    UPDATE public.user_points
    SET streak_days = v_new_streak,
        last_activity_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE user_id = p_user_id;

    -- Award points for streak milestones
    IF v_new_streak % 7 = 0 THEN
        PERFORM update_user_points(p_user_id, 50, 'streak_milestone', '7-day streak bonus');
    END IF;

    RETURN v_new_streak;
END;
$$ LANGUAGE plpgsql;

-- Insert default achievements
INSERT INTO public.achievement_definitions (name, description, icon, category, points, requirement_type, requirement_value) VALUES
('First Steps', 'Complete your profile', '🎯', 'general', 10, 'verification', 1),
('Verified Seller', 'Get your account verified', '✅', 'seller', 50, 'verification', 1),
('First Product', 'List your first product', '📦', 'seller', 20, 'product_count', 1),
('Product Master', 'List 10 products', '🏆', 'seller', 100, 'product_count', 10),
('First Sale', 'Complete your first order', '💰', 'seller', 30, 'order_count', 1),
('Rising Star', 'Complete 10 orders', '⭐', 'seller', 150, 'order_count', 10),
('Top Seller', 'Complete 50 orders', '👑', 'seller', 500, 'order_count', 50),
('Week Warrior', 'Maintain a 7-day streak', '🔥', 'general', 50, 'streak', 7),
('Month Master', 'Maintain a 30-day streak', '💎', 'general', 200, 'streak', 30),
('First Purchase', 'Make your first purchase', '🛒', 'buyer', 20, 'order_count', 1),
('Loyal Customer', 'Make 10 purchases', '💙', 'buyer', 150, 'order_count', 10),
('Five Star', 'Achieve 5-star rating', '⭐⭐⭐⭐⭐', 'seller', 100, 'rating', 5)
ON CONFLICT DO NOTHING;

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_and_award_achievements(p_user_id UUID)
RETURNS void AS $$
DECLARE
    v_achievement RECORD;
    v_user_value INTEGER;
BEGIN
    FOR v_achievement IN 
        SELECT * FROM public.achievement_definitions WHERE is_active = TRUE
    LOOP
        -- Skip if already earned
        IF EXISTS (
            SELECT 1 FROM public.user_achievements 
            WHERE user_id = p_user_id AND achievement_id = v_achievement.id
        ) THEN
            CONTINUE;
        END IF;

        -- Check requirement based on type
        CASE v_achievement.requirement_type
            WHEN 'product_count' THEN
                SELECT COUNT(*) INTO v_user_value
                FROM public.products
                WHERE supplier_id IN (
                    SELECT id FROM public.suppliers WHERE user_id = p_user_id
                );
            WHEN 'order_count' THEN
                -- Implement based on your order structure
                v_user_value := 0;
            WHEN 'verification' THEN
                SELECT CASE WHEN verification_status = 'verified' THEN 1 ELSE 0 END INTO v_user_value
                FROM public.suppliers
                WHERE user_id = p_user_id;
            WHEN 'streak' THEN
                SELECT streak_days INTO v_user_value
                FROM public.user_points
                WHERE user_id = p_user_id;
            ELSE
                v_user_value := 0;
        END CASE;

        -- Award if requirement met
        IF v_user_value >= v_achievement.requirement_value THEN
            INSERT INTO public.user_achievements (user_id, achievement_id, progress)
            VALUES (p_user_id, v_achievement.id, v_user_value);

            -- Award points
            PERFORM update_user_points(
                p_user_id, 
                v_achievement.points, 
                'achievement', 
                'Earned: ' || v_achievement.name
            );
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
