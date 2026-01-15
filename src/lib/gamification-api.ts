import { supabase } from "@/integrations/supabase/client";

export interface Achievement {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    category: 'seller' | 'buyer' | 'general' | 'milestone';
    points: number;
    requirement_type: 'order_count' | 'product_count' | 'rating' | 'verification' | 'streak' | 'revenue';
    requirement_value: number;
    is_active: boolean;
}

export interface UserAchievement {
    id: string;
    user_id: string;
    achievement_id: string;
    earned_at: string;
    progress: number;
    achievement?: Achievement;
}

export interface UserPoints {
    user_id: string;
    total_points: number;
    level: number;
    current_rank?: number;
    streak_days: number;
    last_activity_date: string;
    updated_at: string;
}

export interface PointTransaction {
    id: string;
    user_id: string;
    points: number;
    action: string;
    description?: string;
    created_at: string;
}

export interface UserPreferences {
    user_id: string;
    email_notifications: boolean;
    push_notifications: boolean;
    sms_notifications: boolean;
    marketing_emails: boolean;
    order_updates: boolean;
    message_notifications: boolean;
    privacy_profile_visible: boolean;
    privacy_show_online_status: boolean;
    privacy_allow_messages_from: 'everyone' | 'verified' | 'none';
    language: string;
    currency: string;
    timezone: string;
    theme: 'light' | 'dark' | 'auto';
}

/**
 * Fetch all available achievements
 */
export async function fetchAchievements(
    category?: Achievement['category']
): Promise<{ data: Achievement[] | null; error: any }> {
    try {
        let query = supabase
            .from('achievement_definitions')
            .select('*')
            .eq('is_active', true);

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query.order('points', { ascending: true });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching achievements:', error);
        return { data: null, error };
    }
}

/**
 * Fetch user's earned achievements
 */
export async function fetchUserAchievements(
    userId?: string
): Promise<{ data: UserAchievement[] | null; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const targetUserId = userId || user?.id;
        if (!targetUserId) throw new Error('User ID required');

        const { data, error } = await supabase
            .from('user_achievements')
            .select('*, achievement:achievement_definitions(*)')
            .eq('user_id', targetUserId)
            .order('earned_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching user achievements:', error);
        return { data: null, error };
    }
}

/**
 * Fetch user points and level
 */
export async function fetchUserPoints(
    userId?: string
): Promise<{ data: UserPoints | null; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const targetUserId = userId || user?.id;
        if (!targetUserId) throw new Error('User ID required');

        const { data, error } = await supabase
            .from('user_points')
            .select('*')
            .eq('user_id', targetUserId)
            .single();

        if (error && error.code === 'PGRST116') {
            // No record found, create one
            const { data: newData, error: insertError } = await supabase
                .from('user_points')
                .insert({
                    user_id: targetUserId,
                    total_points: 0,
                    level: 1,
                    streak_days: 0
                })
                .select()
                .single();

            if (insertError) throw insertError;
            return { data: newData, error: null };
        }

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching user points:', error);
        return { data: null, error };
    }
}

/**
 * Update user points
 */
export async function updateUserPoints(
    points: number,
    action: string,
    description?: string,
    userId?: string
): Promise<{ data: any; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const targetUserId = userId || user?.id;
        if (!targetUserId) throw new Error('User ID required');

        const { data, error } = await supabase.rpc('update_user_points', {
            p_user_id: targetUserId,
            p_points: points,
            p_action: action,
            p_description: description
        });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error updating user points:', error);
        return { data: null, error };
    }
}

/**
 * Update user streak
 */
export async function updateUserStreak(
    userId?: string
): Promise<{ data: number | null; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const targetUserId = userId || user?.id;
        if (!targetUserId) throw new Error('User ID required');

        const { data, error } = await supabase.rpc('update_user_streak', {
            p_user_id: targetUserId
        });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error updating user streak:', error);
        return { data: null, error };
    }
}

/**
 * Check and award achievements
 */
export async function checkAndAwardAchievements(
    userId?: string
): Promise<{ data: any; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const targetUserId = userId || user?.id;
        if (!targetUserId) throw new Error('User ID required');

        const { data, error } = await supabase.rpc('check_and_award_achievements', {
            p_user_id: targetUserId
        });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error checking achievements:', error);
        return { data: null, error };
    }
}

/**
 * Fetch leaderboard
 */
export async function fetchLeaderboard(
    type: 'points' | 'level' = 'points',
    limit: number = 10
): Promise<{ data: any[] | null; error: any }> {
    try {
        const orderBy = type === 'points' ? 'total_points' : 'level';

        const { data, error } = await supabase
            .from('user_points')
            .select('*, user:user_profiles(*)')
            .order(orderBy, { ascending: false })
            .limit(limit);

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return { data: null, error };
    }
}

/**
 * Fetch user preferences
 */
export async function fetchUserPreferences(
    userId?: string
): Promise<{ data: UserPreferences | null; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const targetUserId = userId || user?.id;
        if (!targetUserId) throw new Error('User ID required');

        const { data, error } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', targetUserId)
            .single();

        if (error && error.code === 'PGRST116') {
            // No record found, create default preferences
            const defaultPrefs: Partial<UserPreferences> = {
                user_id: targetUserId,
                email_notifications: true,
                push_notifications: true,
                sms_notifications: false,
                marketing_emails: true,
                order_updates: true,
                message_notifications: true,
                privacy_profile_visible: true,
                privacy_show_online_status: true,
                privacy_allow_messages_from: 'everyone',
                language: 'en',
                currency: 'XAF',
                timezone: 'Africa/Douala',
                theme: 'auto'
            };

            const { data: newData, error: insertError } = await supabase
                .from('user_preferences')
                .insert(defaultPrefs)
                .select()
                .single();

            if (insertError) throw insertError;
            return { data: newData, error: null };
        }

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching user preferences:', error);
        return { data: null, error };
    }
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
    preferences: Partial<UserPreferences>,
    userId?: string
): Promise<{ data: any; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const targetUserId = userId || user?.id;
        if (!targetUserId) throw new Error('User ID required');

        const { data, error } = await supabase
            .from('user_preferences')
            .upsert({
                user_id: targetUserId,
                ...preferences,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error updating user preferences:', error);
        return { data: null, error };
    }
}

/**
 * Fetch point transactions history
 */
export async function fetchPointTransactions(
    userId?: string,
    limit: number = 20
): Promise<{ data: PointTransaction[] | null; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const targetUserId = userId || user?.id;
        if (!targetUserId) throw new Error('User ID required');

        const { data, error } = await supabase
            .from('point_transactions')
            .select('*')
            .eq('user_id', targetUserId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching point transactions:', error);
        return { data: null, error };
    }
}

/**
 * Calculate user progress for a specific metric
 */
export async function calculateProgress(
    metric: 'profile_completion' | 'verification' | 'first_sale',
    userId?: string
): Promise<{ data: number | null; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const targetUserId = userId || user?.id;
        if (!targetUserId) throw new Error('User ID required');

        let progress = 0;

        switch (metric) {
            case 'profile_completion':
                // Check user_profiles fields
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('id', targetUserId)
                    .single();

                if (profile) {
                    const fields = ['full_name', 'email', 'phone', 'avatar_url'];
                    const completed = fields.filter(field => profile[field]).length;
                    progress = (completed / fields.length) * 100;
                }
                break;

            case 'verification':
                // Check supplier verification status
                const { data: supplier } = await supabase
                    .from('suppliers')
                    .select('verification_status')
                    .eq('user_id', targetUserId)
                    .single();

                if (supplier?.verification_status === 'verified') {
                    progress = 100;
                } else if (supplier?.verification_status === 'pending') {
                    progress = 50;
                }
                break;

            case 'first_sale':
                // Check if user has any completed orders
                const { data: orders } = await supabase
                    .from('orders')
                    .select('id')
                    .eq('seller_id', targetUserId)
                    .eq('status', 'completed')
                    .limit(1);

                progress = orders && orders.length > 0 ? 100 : 0;
                break;
        }

        return { data: progress, error: null };
    } catch (error) {
        console.error('Error calculating progress:', error);
        return { data: null, error };
    }
}
