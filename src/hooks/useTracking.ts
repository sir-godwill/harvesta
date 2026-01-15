import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackProductView, trackCartAction, trackSearch, trackPurchase } from '@/lib/analytics-api';

/**
 * Hook to automatically track page views and provide tracking methods
 */
export function useTracking() {
    const location = useLocation();

    // Track page views on route change
    useEffect(() => {
        trackPageView(window.location.href);
    }, [location.pathname, location.search]);

    return {
        trackProductView,
        trackCartAction,
        trackSearch,
        trackPurchase
    };
}
