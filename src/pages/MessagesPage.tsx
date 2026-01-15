import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Plus, MoreVertical, Phone, Video, Info, Send, Paperclip, Smile, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
import {
    fetchConversations,
    fetchMessages,
    sendMessage,
    markConversationAsRead,
    updatePresence,
    type Conversation,
    type Message,
} from '@/lib/chat-api';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function MessagesPage() {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState('');
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        loadConversations();
        updatePresence('online');

        return () => {
            updatePresence('offline');
        };
    }, []);

    useEffect(() => {
        if (conversationId) {
            loadConversation(conversationId);
        }
    }, [conversationId]);

    const loadConversations = async () => {
        try {
            const { data, error } = await fetchConversations();
            if (error) throw error;
            setConversations(data || []);
        } catch (error) {
            console.error('Error loading conversations:', error);
            toast.error('Failed to load conversations');
        } finally {
            setLoading(false);
        }
    };

    const loadConversation = async (convId: string) => {
        try {
            const conversation = conversations.find(c => c.id === convId);
            if (conversation) {
                setActiveConversation(conversation);
            }

            const { data, error } = await fetchMessages(convId);
            if (error) throw error;
            setMessages(data || []);

            // Mark as read
            await markConversationAsRead(convId);
        } catch (error) {
            console.error('Error loading messages:', error);
            toast.error('Failed to load messages');
        }
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !activeConversation) return;

        setSending(true);
        try {
            const { data, error } = await sendMessage(
                activeConversation.id,
                messageInput.trim()
            );

            if (error) throw error;

            setMessages(prev => [...prev, data!]);
            setMessageInput('');

            // Scroll to bottom
            setTimeout(() => {
                const scrollArea = document.getElementById('messages-scroll');
                if (scrollArea) {
                    scrollArea.scrollTop = scrollArea.scrollHeight;
                }
            }, 100);
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.participants?.some(p =>
            p.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const getOtherParticipant = (conv: Conversation) => {
        return conv.participants?.find(p => p.user_id !== supabase.auth.getUser())?.user;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Conversations Sidebar */}
            <div className={`w-full md:w-80 lg:w-96 border-r flex flex-col ${activeConversation && 'hidden md:flex'}`}>
                {/* Header */}
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Messages</h2>
                        <Button size="icon" variant="ghost">
                            <Plus className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search conversations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Conversations List */}
                <ScrollArea className="flex-1">
                    <div className="p-2">
                        {filteredConversations.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">No conversations yet</p>
                                <Button variant="link" className="mt-2">
                                    Start a conversation
                                </Button>
                            </div>
                        ) : (
                            filteredConversations.map((conv) => {
                                const otherUser = getOtherParticipant(conv);
                                const isActive = activeConversation?.id === conv.id;

                                return (
                                    <button
                                        key={conv.id}
                                        onClick={() => navigate(`/messages/${conv.id}`)}
                                        className={`w-full p-3 rounded-lg hover:bg-muted/50 transition-colors text-left ${isActive ? 'bg-muted' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={otherUser?.avatar_url} />
                                                <AvatarFallback>
                                                    {otherUser?.full_name?.charAt(0) || 'U'}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-medium truncate">
                                                            {otherUser?.full_name || conv.title || 'Unknown'}
                                                        </span>
                                                        {otherUser?.verification_status === 'verified' && (
                                                            <VerificationBadge verified={true} size="sm" showTooltip={false} />
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {conv.last_message_at && formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true })}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-muted-foreground truncate">
                                                    {conv.last_message?.content || 'No messages yet'}
                                                </p>

                                                {conv.unread_count! > 0 && (
                                                    <Badge variant="default" className="mt-1">
                                                        {conv.unread_count}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${!activeConversation && 'hidden md:flex'}`}>
                {activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden"
                                    onClick={() => navigate('/messages')}
                                >
                                    ←
                                </Button>

                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={getOtherParticipant(activeConversation)?.avatar_url} />
                                    <AvatarFallback>
                                        {getOtherParticipant(activeConversation)?.full_name?.charAt(0) || 'U'}
                                    </AvatarFallback>
                                </Avatar>

                                <div>
                                    <div className="flex items-center gap-1">
                                        <h3 className="font-semibold">
                                            {getOtherParticipant(activeConversation)?.full_name || 'Unknown'}
                                        </h3>
                                        {getOtherParticipant(activeConversation)?.verification_status === 'verified' && (
                                            <VerificationBadge verified={true} size="sm" showTooltip={false} />
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Online</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon">
                                    <Phone className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <Video className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setShowInfo(!showInfo)}>
                                    <Info className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4" id="messages-scroll">
                            <div className="space-y-4">
                                {messages.map((message, index) => {
                                    const { data: { user } } = supabase.auth.getUser();
                                    const isOwn = message.sender_id === user?.id;
                                    const showAvatar = index === 0 || messages[index - 1].sender_id !== message.sender_id;

                                    return (
                                        <div
                                            key={message.id}
                                            className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
                                        >
                                            {showAvatar ? (
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={message.sender?.avatar_url} />
                                                    <AvatarFallback>
                                                        {message.sender?.full_name?.charAt(0) || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                            ) : (
                                                <div className="w-8" />
                                            )}

                                            <div
                                                className={`max-w-[70%] rounded-lg px-4 py-2 ${isOwn
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted'
                                                    }`}
                                            >
                                                <p className="text-sm">{message.content}</p>
                                                <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                                    {format(new Date(message.created_at), 'HH:mm')}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>

                        {/* Message Input */}
                        <div className="p-4 border-t">
                            <div className="flex items-end gap-2">
                                <Button variant="ghost" size="icon">
                                    <Paperclip className="h-5 w-5" />
                                </Button>

                                <div className="flex-1 relative">
                                    <Input
                                        placeholder="Type a message..."
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="pr-10"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0"
                                    >
                                        <Smile className="h-5 w-5" />
                                    </Button>
                                </div>

                                <Button onClick={handleSendMessage} disabled={sending || !messageInput.trim()}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                            <p className="text-muted-foreground">
                                Choose a conversation from the sidebar to start messaging
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Info Sidebar */}
            {showInfo && activeConversation && (
                <div className="w-80 border-l p-4">
                    <h3 className="font-semibold mb-4">Conversation Info</h3>
                    {/* Add participant info, shared media, etc. */}
                </div>
            )}
        </div>
    );
}
