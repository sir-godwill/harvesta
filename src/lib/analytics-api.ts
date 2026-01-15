import { supabase } from '@/integrations/supabase/client';

// =====================================================
// TYPES
// =====================================================

export interface BehaviorEvent {
    id: string;
    user_id?: string;
    session_id: string;
    event_type: 'page_view' | 'product_view' | 'search' | 'cart_add' | 'cart_remove' | 'purchase' | 'chat_open' | 'rfq_create';
    event_data: any;
    page_url?: string;
    referrer_url?: string;
    user_agent?: string;
    ip_address?: string;
    created_at: string;
}

export interface BehaviorAnalytics {
    totalEvents: number;
    uniqueUsers: number;
    pageViews: number;
    productViews: number;
    searches: number;
    cartActions: number;
    purchases: number;
    conversionRate: number;
}

// =====================================================
// TRACKING FUNCTIONS
// =====================================================

/**
 * Track user behavior event
 */
export async function trackEvent(
    eventType: BehaviorEvent['event_type'],
    eventData: any,
    pageUrl?: string
): Promise<{ data: any; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        // Get or create session ID
        let sessionId = sessionStorage.getItem('session_id');
        if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            sessionStorage.setItem('session_id', sessionId);
        }

        const { data, error } = await supabase.rpc('track_user_behavior', {
            p_user_id: user?.id || null,
            p_session_id: sessionId,
            p_event_type: eventType,
            p_event_data: eventData,
            p_page_url: pageUrl || window.location.href,
            p_referrer_url: document.referrer
        });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error tracking event:', error);
        return { data: null, error };
    }
}

/**
 * Track page view
 */
export async function trackPageView(pageUrl?: string): Promise<void> {
    await trackEvent('page_view', {
        url: pageUrl || window.location.href,
        title: document.title
    }, pageUrl);
}

/**
 * Track product view
 */
export async function trackProductView(productId: string, productData: any): Promise<void> {
    await trackEvent('product_view', {
        product_id: productId,
        ...productData
    });
}

/**
 * Track search
 */
export async function trackSearch(query: string, resultsCount: number): Promise<void> {
    await trackEvent('search', {
        query,
        results_count: resultsCount
    });
}

/**
 * Track cart action
 */
export async function trackCartAction(action: 'add' | 'remove', productId: string, quantity: number): Promise<void> {
    await trackEvent(action === 'add' ? 'cart_add' : 'cart_remove', {
        product_id: productId,
        quantity
    });
}

/**
 * Track purchase
 */
export async function trackPurchase(orderId: string, total: number, items: any[]): Promise<void> {
    await trackEvent('purchase', {
        order_id: orderId,
        total,
        items_count: items.length,
        items
    });
}

/**
 * Track chat open
 */
export async function trackChatOpen(recipientId: string): Promise<void> {
    await trackEvent('chat_open', {
        recipient_id: recipientId
    });
}

/**
 * Track RFQ creation
 */
export async function trackRFQCreate(rfqId: string, productIds: string[]): Promise<void> {
    await trackEvent('rfq_create', {
        rfq_id: rfqId,
        product_ids: productIds
    });
}

// =====================================================
// ANALYTICS FUNCTIONS (ADMIN ONLY)
// =====================================================

/**
 * Get user behavior data
 */
export async function getUserBehavior(
    userId?: string,
    filters?: {
        eventType?: string;
        startDate?: string;
        endDate?: string;
        limit?: number;
    }
): Promise<{ data: BehaviorEvent[] | null; error: any }> {
    try {
        let query = supabase
            .from('user_behavior_tracking')
            .select('*');

        if (userId) {
            query = query.eq('user_id', userId);
        }

        if (filters?.eventType) {
            query = query.eq('event_type', filters.eventType);
        }

        if (filters?.startDate) {
            query = query.gte('created_at', filters.startDate);
        }

        if (filters?.endDate) {
            query = query.lte('created_at', filters.endDate);
        }

        query = query.order('created_at', { ascending: false });

        if (filters?.limit) {
            query = query.limit(filters.limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching user behavior:', error);
        return { data: null, error };
    }
}

/**
 * Get behavior analytics
 */
export async function getBehaviorAnalytics(
    startDate?: string,
    endDate?: string
): Promise<{ data: BehaviorAnalytics | null; error: any }> {
    try {
        let query = supabase
            .from('user_behavior_tracking')
            .select('*');

        if (startDate) {
            query = query.gte('created_at', startDate);
        }

        if (endDate) {
            query = query.lte('created_at', endDate);
        }

        const { data: events, error } = await query;

        if (error) throw error;

        const uniqueUsers = new Set(events?.map(e => e.user_id).filter(Boolean)).size;
        const pageViews = events?.filter(e => e.event_type === 'page_view').length || 0;
        const productViews = events?.filter(e => e.event_type === 'product_view').length || 0;
        const searches = events?.filter(e => e.event_type === 'search').length || 0;
        const cartActions = events?.filter(e => ['cart_add', 'cart_remove'].includes(e.event_type)).length || 0;
        const purchases = events?.filter(e => e.event_type === 'purchase').length || 0;

        const analytics: BehaviorAnalytics = {
            totalEvents: events?.length || 0,
            uniqueUsers,
            pageViews,
            productViews,
            searches,
            cartActions,
            purchases,
            conversionRate: productViews > 0 ? (purchases / productViews) * 100 : 0
        };

        return { data: analytics, error: null };
    } catch (error) {
        console.error('Error fetching behavior analytics:', error);
        return { data: null, error };
    }
}

/**
 * Get funnel data
 */
export async function getFunnelData(
    startDate?: string,
    endDate?: string
): Promise<{ data: any; error: any }> {
    try {
        const { data: events, error } = await getUserBehavior(undefined, {
            startDate,
            endDate
        });

        if (error) throw error;

        const funnel = {
            pageViews: events?.filter(e => e.event_type === 'page_view').length || 0,
            productViews: events?.filter(e => e.event_type === 'product_view').length || 0,
            cartAdds: events?.filter(e => e.event_type === 'cart_add').length || 0,
            purchases: events?.filter(e => e.event_type === 'purchase').length || 0,
        };

        return { data: funnel, error: null };
    } catch (error) {
        console.error('Error fetching funnel data:', error);
        return { data: null, error };
    }
}

/**
 * Get drop-off points
 */
export async function getDropOffPoints(): Promise<{ data: any; error: any }> {
    try {
        const { data: funnel } = await getFunnelData();

        const dropOffs = {
            viewToProduct: funnel.pageViews > 0
                ? ((funnel.pageViews - funnel.productViews) / funnel.pageViews) * 100
                : 0,
            productToCart: funnel.productViews > 0
                ? ((funnel.productViews - funnel.cartAdds) / funnel.productViews) * 100
                : 0,
            cartToPurchase: funnel.cartAdds > 0
                ? ((funnel.cartAdds - funnel.purchases) / funnel.cartAdds) * 100
                : 0,
        };

        return { data: dropOffs, error: null };
    } catch (error) {
        console.error('Error calculating drop-off points:', error);
        return { data: null, error };
    }
}

/**
 * Get most viewed products
 */
export async function getMostViewedProducts(limit: number = 10): Promise<{ data: any; error: any }> {
    try {
        const { data: events } = await getUserBehavior(undefined, {
            eventType: 'product_view'
        });

        const productCounts: Record<string, number> = {};
        events?.forEach(event => {
            const productId = event.event_data?.product_id;
            if (productId) {
                productCounts[productId] = (productCounts[productId] || 0) + 1;
            }
        });

        const sorted = Object.entries(productCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([productId, count]) => ({ product_id: productId, view_count: count }));

        return { data: sorted, error: null };
    } catch (error) {
        console.error('Error fetching most viewed products:', error);
        return { data: null, error };
    }
}

/**
 * Get most active users
 */
export async function getMostActiveUsers(limit: number = 10): Promise<{ data: any; error: any }> {
    try {
        const { data: events } = await getUserBehavior();

        const userCounts: Record<string, number> = {};
        events?.forEach(event => {
            if (event.user_id) {
                userCounts[event.user_id] = (userCounts[event.user_id] || 0) + 1;
            }
        });

        const sorted = Object.entries(userCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([userId, count]) => ({ user_id: userId, event_count: count }));

        return { data: sorted, error: null };
    } catch (error) {
        console.error('Error fetching most active users:', error);
        return { data: null, error };
    }
}

/**
 * Export behavior data to CSV
 */
export async function exportBehaviorData(
    startDate?: string,
    endDate?: string
): Promise<{ data: string | null; error: any }> {
    try {
        const { data: events } = await getUserBehavior(undefined, {
            startDate,
            endDate
        });

        if (!events || events.length === 0) {
            return { data: null, error: 'No data to export' };
        }

        // Create CSV
        const headers = ['Date', 'User ID', 'Event Type', 'Page URL', 'Event Data'];
        const rows = events.map(event => [
            new Date(event.created_at).toISOString(),
            event.user_id || 'Guest',
            event.event_type,
            event.page_url || '',
            JSON.stringify(event.event_data)
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        return { data: csv, error: null };
    } catch (error) {
        console.error('Error exporting behavior data:', error);
        return { data: null, error };
    }
}
