import { useState, useEffect, useCallback } from 'react';

interface GuestTrackingOptions {
    timeThreshold?: number; // seconds
    scrollThreshold?: number; // number of items scrolled
    onPromptTrigger?: () => void;
}

export function useGuestTracking(options: GuestTrackingOptions = {}) {
    const {
        timeThreshold = 30, // 30 seconds
        scrollThreshold = 50, // 50 products
        onPromptTrigger,
    } = options;

    const [timeOnPage, setTimeOnPage] = useState(0);
    const [scrollDepth, setScrollDepth] = useState(0);
    const [shouldShowPrompt, setShouldShowPrompt] = useState(false);
    const [promptDismissed, setPromptDismissed] = useState(false);

    // Check if user is logged in
    const isGuest = !localStorage.getItem('supabase.auth.token');

    // Track time on page
    useEffect(() => {
        if (!isGuest || promptDismissed) return;

        const interval = setInterval(() => {
            setTimeOnPage(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isGuest, promptDismissed]);

    // Check if prompt should be shown
    useEffect(() => {
        if (!isGuest || promptDismissed) return;

        const shouldShow =
            timeOnPage >= timeThreshold ||
            scrollDepth >= scrollThreshold;

        if (shouldShow && !shouldShowPrompt) {
            setShouldShowPrompt(true);
            onPromptTrigger?.();
        }
    }, [timeOnPage, scrollDepth, timeThreshold, scrollThreshold, isGuest, promptDismissed, shouldShowPrompt, onPromptTrigger]);

    const trackScrollDepth = useCallback((depth: number) => {
        setScrollDepth(depth);
    }, []);

    const dismissPrompt = useCallback(() => {
        setPromptDismissed(true);
        setShouldShowPrompt(false);
    }, []);

    const resetTracking = useCallback(() => {
        setTimeOnPage(0);
        setScrollDepth(0);
        setShouldShowPrompt(false);
        setPromptDismissed(false);
    }, []);

    return {
        isGuest,
        timeOnPage,
        scrollDepth,
        shouldShowPrompt,
        trackScrollDepth,
        dismissPrompt,
        resetTracking,
    };
}
