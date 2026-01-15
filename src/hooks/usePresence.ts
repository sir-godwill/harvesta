import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { updatePresence, type UserPresence } from '@/lib/chat-api';

export function usePresence(userId: string | null) {
    const [presence, setPresence] = useState<UserPresence | null>(null);
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        if (!userId) return;

        // Set initial presence
        updatePresence('online');
        setIsOnline(true);

        // Subscribe to presence changes
        const channel = supabase
            .channel('presence')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'user_presence',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    setPresence(payload.new as UserPresence);
                }
            )
            .subscribe();

        // Update presence on activity
        const handleActivity = () => {
            if (!isOnline) {
                updatePresence('online');
                setIsOnline(true);
            }
        };

        // Update presence on visibility change
        const handleVisibilityChange = () => {
            if (document.hidden) {
                updatePresence('away');
                setIsOnline(false);
            } else {
                updatePresence('online');
                setIsOnline(true);
            }
        };

        // Add event listeners
        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup
        return () => {
            updatePresence('offline');
            supabase.removeChannel(channel);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [userId]);

    return { presence, isOnline };
}

export function useTypingIndicator(conversationId: string | null) {
    const [typingUsers, setTypingUsers] = useState<string[]>([]);

    useEffect(() => {
        if (!conversationId) return;

        const channel = supabase
            .channel(`typing:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'user_presence',
                    filter: `typing_in=eq.${conversationId}`,
                },
                (payload) => {
                    const presence = payload.new as UserPresence;
                    if (presence.typing_in === conversationId) {
                        setTypingUsers((prev) => [...new Set([...prev, presence.user_id])]);
                    } else {
                        setTypingUsers((prev) => prev.filter((id) => id !== presence.user_id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId]);

    return typingUsers;
}
