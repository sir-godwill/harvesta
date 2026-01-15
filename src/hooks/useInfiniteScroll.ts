import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
    threshold?: number;
    rootMargin?: string;
}

export function useInfiniteScroll<T>(
    fetchMore: (page: number) => Promise<{ data: T[]; hasMore: boolean }>,
    options: UseInfiniteScrollOptions = {}
) {
    const { threshold = 0.5, rootMargin = '100px' } = options;

    const [items, setItems] = useState<T[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        setError(null);

        try {
            const result = await fetchMore(page);

            setItems(prev => [...prev, ...result.data]);
            setHasMore(result.hasMore);
            setPage(prev => prev + 1);
        } catch (err) {
            setError(err as Error);
            console.error('Error loading more items:', err);
        } finally {
            setLoading(false);
        }
    }, [fetchMore, page, loading, hasMore]);

    useEffect(() => {
        // Initial load
        loadMore();
    }, []); // Only run once on mount

    useEffect(() => {
        const currentRef = loadMoreRef.current;

        if (!currentRef || !hasMore) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && !loading) {
                    loadMore();
                }
            },
            { threshold, rootMargin }
        );

        observerRef.current.observe(currentRef);

        return () => {
            if (observerRef.current && currentRef) {
                observerRef.current.unobserve(currentRef);
            }
        };
    }, [loadMore, loading, hasMore, threshold, rootMargin]);

    const reset = useCallback(() => {
        setItems([]);
        setPage(0);
        setHasMore(true);
        setError(null);
    }, []);

    return {
        items,
        loading,
        hasMore,
        error,
        loadMoreRef,
        reset,
    };
}
