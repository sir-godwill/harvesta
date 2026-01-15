import { useState, useEffect, useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HorizontalScrollCardProps {
    children: ReactNode;
    autoScrollInterval?: number;
    showControls?: boolean;
    className?: string;
}

export function HorizontalScrollCard({
    children,
    autoScrollInterval = 3000,
    showControls = true,
    className = '',
}: HorizontalScrollCardProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const updateScrollButtons = () => {
        if (!scrollRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    const scrollLeft = () => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollRight = () => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    };

    // Auto-scroll functionality
    useEffect(() => {
        if (!scrollRef.current || isPaused || !autoScrollInterval) return;

        const interval = setInterval(() => {
            if (!scrollRef.current) return;

            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

            // If at the end, scroll back to start
            if (scrollLeft >= scrollWidth - clientWidth - 10) {
                scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
            }
        }, autoScrollInterval);

        return () => clearInterval(interval);
    }, [isPaused, autoScrollInterval]);

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (!scrollElement) return;

        scrollElement.addEventListener('scroll', updateScrollButtons);
        updateScrollButtons();

        return () => {
            scrollElement.removeEventListener('scroll', updateScrollButtons);
        };
    }, []);

    return (
        <div
            className={`relative group ${className}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Left Control */}
            {showControls && canScrollLeft && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={scrollLeft}
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
            )}

            {/* Scrollable Container */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {children}
            </div>

            {/* Right Control */}
            {showControls && canScrollRight && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={scrollRight}
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            )}
        </div>
    );
}
