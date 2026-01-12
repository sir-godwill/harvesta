import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Search,
  MoreVertical,
  Send,
  Paperclip,
  Image,
  Smile,
  Phone,
  Video,
  Info,
  MessageSquare,
  Leaf,
  Package,
  FileText,
} from 'lucide-react';
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  searchConversations,
  type Conversation,
  type Message,
} from '@/lib/chat-api';

function ChatList({
  conversations,
  selectedId,
  onSelect,
  onSearch,
}: {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onSearch: (query: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground">Messages</h1>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left',
                selectedId === conv.id
                  ? 'bg-primary/10 border-l-2 border-primary'
                  : 'hover:bg-muted/50'
              )}
            >
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={conv.participants[0]?.avatar} />
                  <AvatarFallback>
                    {conv.participants[0]?.name?.slice(0, 2).toUpperCase() || 'US'}
                  </AvatarFallback>
                </Avatar>
                {conv.participants[0]?.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-sm truncate">{conv.participants[0]?.name || 'Unknown'}</p>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground truncate flex-1">
                    {conv.lastMessage?.content || 'No messages yet'}
                  </p>
                  {conv.unreadCount > 0 && (
                    <Badge className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 min-w-[20px] justify-center">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div className={cn('flex mb-3', isOwn ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2',
          isOwn
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-muted text-foreground rounded-bl-sm'
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        <div className={cn('flex items-center justify-end gap-1 mt-1', isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
          <span className="text-xs">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}

function ChatArea({
  conversation,
  messages,
  onBack,
  onSend,
}: {
  conversation: Conversation;
  messages: Message[];
  onBack: () => void;
  onSend: (content: string) => void;
}) {
  const [input, setInput] = useState('');
  const participant = conversation.participants[0];

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar className="w-10 h-10">
          <AvatarImage src={participant?.avatar} />
          <AvatarFallback>{participant?.name?.slice(0, 2).toUpperCase() || 'US'}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{participant?.name || 'Unknown'}</p>
          <p className="text-xs text-muted-foreground">
            {participant?.isOnline ? 'Online' : 'Offline'} • {participant?.role}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Info className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === 'current-user'} />
        ))}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Image className="w-5 h-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            className="flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button variant="ghost" size="icon">
            <Smile className="w-5 h-5" />
          </Button>
          <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-muted/30">
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center">
          <MessageSquare className="w-14 h-14 text-primary" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
          <Leaf className="w-6 h-6 text-secondary-foreground" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Harvestá Messages</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Connect with farmers, buyers, and logistics partners.
        Negotiate deals, track orders, and grow your agro-business.
      </p>
      <div className="grid grid-cols-2 gap-4 max-w-sm w-full">
        <div className="p-4 bg-card rounded-xl border border-border">
          <Package className="w-6 h-6 text-primary mb-2" />
          <h3 className="font-semibold text-sm mb-1">Trade Easily</h3>
          <p className="text-xs text-muted-foreground">Send offers and negotiate prices</p>
        </div>
        <div className="p-4 bg-card rounded-xl border border-border">
          <FileText className="w-6 h-6 text-secondary mb-2" />
          <h3 className="font-semibold text-sm mb-1">Share Products</h3>
          <p className="text-xs text-muted-foreground">Send catalogs and quotes</p>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMobileView, setIsMobileView] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchConversations().then(setConversations);
    const checkMobile = () => setIsMobileView(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id).then(setMessages);
    }
  }, [selectedConversation?.id]);

  const handleSelectConversation = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      setSelectedConversation(conv);
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
      );
    }
  };

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      const results = await searchConversations(query);
      setConversations(results);
    } else {
      const all = await fetchConversations();
      setConversations(all);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation) return;
    const newMessage = await sendMessage(selectedConversation.id, { type: 'text', content });
    setMessages((prev) => [...prev, newMessage]);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversation.id ? { ...c, lastMessage: newMessage, updatedAt: new Date() } : c
      )
    );
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  const showChatList = !isMobileView || !selectedConversation;
  const showChat = !isMobileView || selectedConversation;

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Chat List */}
      <div
        className={cn(
          'w-full md:w-80 lg:w-96 flex-shrink-0 h-full border-r border-border',
          !showChatList && 'hidden md:block'
        )}
      >
        <ChatList
          conversations={conversations}
          selectedId={selectedConversation?.id}
          onSelect={handleSelectConversation}
          onSearch={handleSearch}
        />
      </div>

      {/* Chat Area */}
      <div className={cn('flex-1 h-full min-w-0', !showChat && 'hidden')}>
        {selectedConversation ? (
          <ChatArea
            conversation={selectedConversation}
            messages={messages}
            onBack={handleBack}
            onSend={handleSendMessage}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
