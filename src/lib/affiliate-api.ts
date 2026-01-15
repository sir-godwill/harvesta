import { supabase } from '@/integrations/supabase/client';

// =====================================================
// TYPES
// =====================================================

export interface Affiliate {
    id: string;
    user_id: string;
    affiliate_code: string;
    status: 'active' | 'suspended' | 'inactive';
    total_earnings: number;
    pending_earnings: number;
    approved_earnings: number;
    withdrawn_earnings: number;
    available_balance: number;
    total_referrals: number;
    buyer_referrals: number;
    seller_referrals: number;
    total_clicks: number;
    conversion_rate: number;
    created_at: string;
    updated_at: string;
}

export interface AffiliateReferral {
    id: string;
    affiliate_id: string;
    referred_user_id: string;
    referral_type: 'buyer' | 'seller';
    status: 'pending' | 'approved' | 'rejected';
    reward_amount: number;
    milestone_achieved?: string;
    milestone_date?: string;
    approved_at?: string;
    approved_by?: string;
    rejection_reason?: string;
    created_at: string;
    updated_at: string;
    referred_user?: any;
}

export interface AffiliateTransaction {
    id: string;
    affiliate_id: string;
    type: 'earning' | 'withdrawal' | 'adjustment' | 'bonus';
    amount: number;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    description?: string;
    referral_id?: string;
    metadata?: any;
    processed_by?: string;
    processed_at?: string;
    created_at: string;
}

export interface AffiliateWithdrawal {
    id: string;
    affiliate_id: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    payment_method: string;
    payment_details: any;
    admin_notes?: string;
    rejection_reason?: string;
    approved_by?: string;
    approved_at?: string;
    completed_at?: string;
    created_at: string;
}

// =====================================================
// AFFILIATE OPERATIONS
// =====================================================

/**
 * Create affiliate account for current user
 */
export async function createAffiliate(): Promise<{ data: Affiliate | null; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Check if already an affiliate
        const { data: existing } = await supabase
            .from('affiliates')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (existing) {
            return { data: existing, error: null };
        }

        // Generate unique code
        const { data: code } = await supabase.rpc('generate_affiliate_code');

        // Create affiliate record
        const { data, error } = await supabase
            .from('affiliates')
            .insert({
                user_id: user.id,
                affiliate_code: code,
                status: 'active'
            })
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error creating affiliate:', error);
        return { data: null, error };
    }
}

/**
 * Get affiliate profile for current user
 */
export async function getAffiliateProfile(): Promise<{ data: Affiliate | null; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('affiliates')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching affiliate profile:', error);
        return { data: null, error };
    }
}

/**
 * Get affiliate dashboard stats
 */
export async function getAffiliateStats(): Promise<{ data: any; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: affiliate } = await getAffiliateProfile();
        if (!affiliate) throw new Error('Not an affiliate');

        // Get recent referrals
        const { data: recentReferrals } = await supabase
            .from('affiliate_referrals')
            .select('*, referred_user:user_profiles(*)')
            .eq('affiliate_id', affiliate.id)
            .order('created_at', { ascending: false })
            .limit(5);

        // Get monthly earnings
        const { data: monthlyEarnings } = await supabase
            .from('affiliate_transactions')
            .select('amount, created_at')
            .eq('affiliate_id', affiliate.id)
            .eq('type', 'earning')
            .eq('status', 'approved')
            .gte('created_at', new Date(new Date().setDate(1)).toISOString());

        const stats = {
            ...affiliate,
            recentReferrals: recentReferrals || [],
            monthlyEarnings: monthlyEarnings?.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) || 0,
        };

        return { data: stats, error: null };
    } catch (error) {
        console.error('Error fetching affiliate stats:', error);
        return { data: null, error };
    }
}

/**
 * Get affiliate referrals with filters
 */
export async function getReferrals(
    filters?: {
        type?: 'buyer' | 'seller';
        status?: 'pending' | 'approved' | 'rejected';
        limit?: number;
        offset?: number;
    }
): Promise<{ data: AffiliateReferral[] | null; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: affiliate } = await getAffiliateProfile();
        if (!affiliate) throw new Error('Not an affiliate');

        let query = supabase
            .from('affiliate_referrals')
            .select('*, referred_user:user_profiles(*)')
            .eq('affiliate_id', affiliate.id);

        if (filters?.type) {
            query = query.eq('referral_type', filters.type);
        }

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }

        query = query.order('created_at', { ascending: false });

        if (filters?.limit) {
            query = query.limit(filters.limit);
        }

        if (filters?.offset) {
            query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
        }

        const { data, error } = await query;

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching referrals:', error);
        return { data: null, error };
    }
}

/**
 * Track affiliate link click
 */
export async function trackClick(
    affiliateCode: string,
    metadata?: {
        referrerUrl?: string;
        landingPage?: string;
    }
): Promise<{ data: any; error: any }> {
    try {
        const { data, error } = await supabase.rpc('track_affiliate_click', {
            p_affiliate_code: affiliateCode,
            p_ip_address: 'unknown', // Would need server-side implementation
            p_user_agent: navigator.userAgent,
            p_referrer_url: metadata?.referrerUrl || document.referrer,
            p_landing_page: metadata?.landingPage || window.location.href,
        });

        if (error) throw error;

        // Store affiliate code in localStorage for signup attribution
        localStorage.setItem('affiliate_code', affiliateCode);

        return { data, error: null };
    } catch (error) {
        console.error('Error tracking click:', error);
        return { data: null, error };
    }
}

/**
 * Request withdrawal
 */
export async function requestWithdrawal(
    amount: number,
    paymentMethod: string,
    paymentDetails: any
): Promise<{ data: AffiliateWithdrawal | null; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: affiliate } = await getAffiliateProfile();
        if (!affiliate) throw new Error('Not an affiliate');

        // Validate amount
        if (amount < 5000) {
            throw new Error('Minimum withdrawal amount is 5,000 XAF');
        }

        if (amount > affiliate.available_balance) {
            throw new Error('Insufficient balance');
        }

        const { data, error } = await supabase
            .from('affiliate_withdrawals')
            .insert({
                affiliate_id: affiliate.id,
                amount,
                payment_method: paymentMethod,
                payment_details: paymentDetails,
                status: 'pending'
            })
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error requesting withdrawal:', error);
        return { data: null, error };
    }
}

/**
 * Get transaction history
 */
export async function getTransactions(
    limit: number = 20,
    offset: number = 0
): Promise<{ data: AffiliateTransaction[] | null; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: affiliate } = await getAffiliateProfile();
        if (!affiliate) throw new Error('Not an affiliate');

        const { data, error } = await supabase
            .from('affiliate_transactions')
            .select('*')
            .eq('affiliate_id', affiliate.id)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return { data: null, error };
    }
}

/**
 * Get withdrawal history
 */
export async function getWithdrawals(
    limit: number = 20
): Promise<{ data: AffiliateWithdrawal[] | null; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: affiliate } = await getAffiliateProfile();
        if (!affiliate) throw new Error('Not an affiliate');

        const { data, error } = await supabase
            .from('affiliate_withdrawals')
            .select('*')
            .eq('affiliate_id', affiliate.id)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching withdrawals:', error);
        return { data: null, error };
    }
}

/**
 * Generate shareable affiliate link
 */
export function generateAffiliateLink(affiliateCode: string, path: string = '/'): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}${path}?ref=${affiliateCode}`;
}

// =====================================================
// ADMIN OPERATIONS
// =====================================================

/**
 * Get all affiliates (admin only)
 */
export async function getAllAffiliates(
    filters?: {
        status?: string;
        limit?: number;
        offset?: number;
    }
): Promise<{ data: Affiliate[] | null; error: any }> {
    try {
        let query = supabase
            .from('affiliates')
            .select('*, user:user_profiles(*)');

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }

        query = query.order('total_earnings', { ascending: false });

        if (filters?.limit) {
            query = query.limit(filters.limit);
        }

        if (filters?.offset) {
            query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
        }

        const { data, error } = await query;

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching all affiliates:', error);
        return { data: null, error };
    }
}

/**
 * Approve referral (admin only)
 */
export async function approveReferral(referralId: string): Promise<{ data: any; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase.rpc('process_referral_reward', {
            p_referral_id: referralId,
            p_approved_by: user.id
        });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error approving referral:', error);
        return { data: null, error };
    }
}

/**
 * Reject referral (admin only)
 */
export async function rejectReferral(
    referralId: string,
    reason: string
): Promise<{ data: any; error: any }> {
    try {
        const { data, error } = await supabase
            .from('affiliate_referrals')
            .update({
                status: 'rejected',
                rejection_reason: reason,
                updated_at: new Date().toISOString()
            })
            .eq('id', referralId)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error rejecting referral:', error);
        return { data: null, error };
    }
}

/**
 * Approve withdrawal (admin only)
 */
export async function approveWithdrawal(
    withdrawalId: string,
    adminNotes?: string
): Promise<{ data: any; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('affiliate_withdrawals')
            .update({
                status: 'approved',
                approved_by: user.id,
                approved_at: new Date().toISOString(),
                admin_notes: adminNotes
            })
            .eq('id', withdrawalId)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error approving withdrawal:', error);
        return { data: null, error };
    }
}

/**
 * Get affiliate analytics (admin only)
 */
export async function getAffiliateAnalytics(): Promise<{ data: any; error: any }> {
    try {
        const { data: affiliates } = await supabase
            .from('affiliates')
            .select('*');

        const { data: referrals } = await supabase
            .from('affiliate_referrals')
            .select('*');

        const { data: transactions } = await supabase
            .from('affiliate_transactions')
            .select('*')
            .eq('type', 'earning')
            .eq('status', 'approved');

        const analytics = {
            totalAffiliates: affiliates?.length || 0,
            activeAffiliates: affiliates?.filter(a => a.status === 'active').length || 0,
            totalReferrals: referrals?.length || 0,
            pendingReferrals: referrals?.filter(r => r.status === 'pending').length || 0,
            approvedReferrals: referrals?.filter(r => r.status === 'approved').length || 0,
            totalEarningsPaid: transactions?.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) || 0,
            averageEarningsPerAffiliate: affiliates?.length
                ? (transactions?.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0) || 0) / affiliates.length
                : 0,
        };

        return { data: analytics, error: null };
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return { data: null, error };
    }
}
