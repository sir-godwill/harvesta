import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Message } from '@/lib/chat-api';

export function useRealtimeMessages(conversationId: string | null, onNewMessage?: (message: Message) => void) {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (!conversationId) return;

        // Subscribe to new messages
        const channel = supabase
            .channel(`messages:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    setMessages((prev) => [...prev, newMessage]);
                    onNewMessage?.(newMessage);
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    const updatedMessage = payload.new as Message;
                    setMessages((prev) =>
                        prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId, onNewMessage]);

    return messages;
}

export function useRealtimeConversations(userId: string | null, onUpdate?: () => void) {
    useEffect(() => {
        if (!userId) return;

        // Subscribe to conversation updates
        const channel = supabase
            .channel('conversations')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'conversations',
                },
                () => {
                    onUpdate?.();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, onUpdate]);
}
