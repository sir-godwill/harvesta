import { useState, useEffect } from 'react';
import { ShoppingBag, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Activity {
    id: number;
    location: string;
    quantity: string;
    timeAgo: string;
}

const mockActivities: Activity[] = [
    { id: 1, location: 'Douala', quantity: '250kg', timeAgo: '2h ago' },
    { id: 2, location: 'Yaoundé', quantity: '1,000kg', timeAgo: '5h ago' },
    { id: 3, location: 'Bafoussam', quantity: '50kg', timeAgo: '1h ago' },
    { id: 4, location: 'Garoua', quantity: '500kg', timeAgo: '30m ago' },
    { id: 5, location: 'Limbe', quantity: '100kg', timeAgo: '3h ago' },
];

export function RecentActivityTicker() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % mockActivities.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const activity = mockActivities[index];

    return (
        <div className="h-10 bg-primary/5 rounded-full px-4 flex items-center justify-between overflow-hidden border border-primary/10">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activity.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-2 text-xs sm:text-sm font-medium text-primary w-full"
                >
                    <ShoppingBag className="h-3 w-3 sm:h-4 sm:h-4 text-primary" />
                    <span className="truncate">
                        Recently purchased by a buyer in <span className="font-bold">{activity.location}</span>
                    </span>
                    <div className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
                        <MapPin className="h-3 w-3" />
                        <span>{activity.quantity} • {activity.timeAgo}</span>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
