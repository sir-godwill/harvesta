import { useState } from 'react';
import { 
  Search, 
  MoreVertical, 
  Archive, 
  Pin, 
  MessageSquare,
  Check,
  CheckCheck,
  Settings,
  Plus,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Conversation, UserRole } from '@/lib/chat-api';
import { format, isToday, isYesterday } from 'date-fns';

interface ChatListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelectConversation: (id: string) => void;
  onSearch: (query: string) => void;
  userType?: 'buyer' | 'seller';
  onNewChat?: () => void;
}

const roleColors: Record<UserRole, string> = {
  buyer: 'bg-blue-500',
  seller: 'bg-green-600',
  logistics: 'bg-purple-500',
  admin: 'bg-red-500',
  system: 'bg-gray-500',
};

export function ChatList({ 
  conversations, 
  selectedId, 
  onSelectConversation, 
  onSearch,
  userType = 'buyer',
  onNewChat
}: ChatListProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'orders' | 'rfq'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const archivedCount = conversations.filter(c => c.isArchived).length;
  
  const filteredConversations = conversations.filter(conv => {
    if (conv.isArchived) return false;
    if (filter === 'unread') return conv.unreadCount > 0;
    if (filter === 'orders') return conv.type === 'order';
    if (filter === 'rfq') return conv.type === 'rfq';
    return true;
  });

  const pinnedConversations = filteredConversations.filter(c => c.isPinned);
  const regularConversations = filteredConversations.filter(c => !c.isPinned);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const filters = [
    { key: 'all', label: 'All', count: conversations.filter(c => !c.isArchived).length },
    { key: 'unread', label: 'Unread', count: conversations.filter(c => c.unreadCount > 0).length },
    { key: 'orders', label: 'Orders', count: conversations.filter(c => c.type === 'order').length },
    { key: 'rfq', label: 'RFQ', count: conversations.filter(c => c.type === 'rfq').length },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b bg-background">
        <div>
          <h1 className="text-xl font-bold text-foreground">Messages</h1>
          <p className="text-xs text-muted-foreground capitalize">{userType} Dashboard</p>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-accent"
            onClick={onNewChat}
          >
            <Plus className="w-5 h-5 text-orange-500" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent">
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Archive className="w-4 h-4 mr-2" />
                Archived Chats
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Filter className="w-4 h-4 mr-2" />
                Filter Chats
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 bg-background">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-11 bg-accent border-0 rounded-xl text-sm placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-green-500/30"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5",
              filter === f.key
                ? "bg-orange-500 text-white shadow-md"
                : "bg-accent text-muted-foreground hover:bg-accent/80"
            )}
          >
            {f.label}
            {f.count > 0 && filter !== f.key && (
              <span className="text-xs opacity-70">({f.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Archived Section */}
      {archivedCount > 0 && (
        <button className="flex items-center gap-3 px-4 py-3 hover:bg-accent/50 transition-colors border-b border-border/50 mx-4 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
            <Archive className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1 text-left">
            <span className="font-medium text-foreground">Archived</span>
          </div>
          <Badge variant="secondary" className="rounded-full">
            {archivedCount}
          </Badge>
        </button>
      )}

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        <div className="px-2">
          {/* Pinned Section */}
          {pinnedConversations.length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-medium text-muted-foreground px-2 py-2 uppercase tracking-wider">
                Pinned
              </p>
              {pinnedConversations.map(conv => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isSelected={conv.id === selectedId}
                  onClick={() => onSelectConversation(conv.id)}
                />
              ))}
            </div>
          )}

          {/* All Messages */}
          {regularConversations.length > 0 && pinnedConversations.length > 0 && (
            <p className="text-xs font-medium text-muted-foreground px-2 py-2 uppercase tracking-wider">
              All Messages
            </p>
          )}
          
          {regularConversations.map(conv => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isSelected={conv.id === selectedId}
              onClick={() => onSelectConversation(conv.id)}
            />
          ))}
        </div>

        {filteredConversations.length === 0 && (
          <div className="p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">No conversations</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              {filter === 'all' ? 'Start chatting with sellers!' : `No ${filter} messages`}
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  const otherParticipants = conversation.participants.filter(p => p.id !== 'current-user');
  const mainParticipant = otherParticipants[0];
  const title = conversation.title || otherParticipants.map(p => p.name).join(', ') || 'Unknown';
  const role = mainParticipant?.role || 'seller';
  const isOnline = mainParticipant?.isOnline;
  const hasUnread = conversation.unreadCount > 0;
  const isVerified = mainParticipant?.isVerified;
  
  const formatTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'h:mm a');
    }
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    return format(date, 'dd/MM/yy');
  };

  const getMessagePreview = () => {
    const msg = conversation.lastMessage;
    if (!msg) return { content: 'No messages yet', isOwn: false, status: 'sent' as const };
    
    const isOwn = msg.senderId === 'current-user';
    let content = msg.content;
    
    switch (msg.type) {
      case 'image': content = '📷 Photo'; break;
      case 'video': content = '🎥 Video'; break;
      case 'audio': content = '🎵 Voice message'; break;
      case 'document': content = '📄 Document'; break;
      case 'location': content = '📍 Location'; break;
      case 'voice-call': content = '📞 Voice call'; break;
      case 'video-call': content = '📹 Video call'; break;
      case 'offer': content = '💰 Offer sent'; break;
      case 'counter-offer': content = '🔄 Counter offer'; break;
      case 'quote': content = '📋 Quote received'; break;
      case 'delivery-update': content = '🚚 Delivery update'; break;
      case 'product': content = '📦 Product shared'; break;
    }
    
    return { content, isOwn, status: msg.status };
  };

  const preview = getMessagePreview();
  
  // Type badge
  const getTypeBadge = () => {
    switch (conversation.type) {
      case 'order': return { label: 'Order', color: 'bg-green-100 text-green-700' };
      case 'rfq': return { label: 'RFQ', color: 'bg-orange-100 text-orange-700' };
      case 'support': return { label: 'Support', color: 'bg-red-100 text-red-700' };
      default: return null;
    }
  };
  
  const typeBadge = getTypeBadge();
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full px-3 py-3 flex gap-3 items-center text-left transition-all rounded-xl mb-1",
        "active:scale-[0.98]",
        isSelected 
          ? "bg-green-50 border border-green-200" 
          : "hover:bg-accent active:bg-accent"
      )}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-sm",
          roleColors[role]
        )}>
          {title.charAt(0).toUpperCase()}
        </div>
        {isOnline && (
          <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background" />
        )}
        {isVerified && (
          <div className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-green-600 rounded-full border-2 border-background flex items-center justify-center">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className={cn(
              "font-semibold truncate text-[15px]",
              hasUnread ? "text-foreground" : "text-foreground/90"
            )}>
              {title}
            </span>
            {typeBadge && (
              <Badge className={cn("text-[10px] px-1.5 py-0 h-4 font-medium", typeBadge.color)}>
                {typeBadge.label}
              </Badge>
            )}
          </div>
          <span className={cn(
            "text-xs flex-shrink-0",
            hasUnread ? "text-orange-500 font-bold" : "text-muted-foreground"
          )}>
            {conversation.lastMessage && formatTime(new Date(conversation.lastMessage.createdAt))}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-1">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {preview.isOwn && (
              <span className="flex-shrink-0">
                {preview.status === 'read' ? (
                  <CheckCheck className="w-4 h-4 text-green-600" />
                ) : preview.status === 'delivered' ? (
                  <CheckCheck className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Check className="w-4 h-4 text-muted-foreground" />
                )}
              </span>
            )}
            <p className={cn(
              "text-sm truncate",
              hasUnread ? "text-foreground font-medium" : "text-muted-foreground"
            )}>
              {preview.content}
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {conversation.isMuted && (
              <span className="text-muted-foreground text-xs">🔇</span>
            )}
            {conversation.isPinned && (
              <Pin className="w-3.5 h-3.5 text-muted-foreground fill-muted-foreground" />
            )}
            {hasUnread && (
              <Badge className="bg-orange-500 text-white text-[10px] px-1.5 py-0 min-w-[20px] h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
