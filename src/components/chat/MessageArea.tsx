import { useRef, useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { SellerProfileModal } from './SellerProfileModal';
import { Message, Conversation } from '@/lib/chat-api';
import { format, isSameDay } from 'date-fns';
import { ChevronDown, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MessageAreaProps {
  messages: Message[];
  conversation: Conversation;
  currentUserId: string;
  typingUsers?: string[];
  onReply?: (message: Message) => void;
}

export function MessageArea({ 
  messages, 
  conversation, 
  currentUserId, 
  typingUsers = [],
  onReply 
}: MessageAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getParticipantName = (senderId: string) => {
    const participant = conversation.participants.find(p => p.id === senderId);
    return participant?.name || 'Unknown';
  };

  const getParticipant = (senderId: string) => {
    return conversation.participants.find(p => p.id === senderId);
  };

  const shouldShowSenderName = (message: Message, index: number) => {
    if (message.senderId === currentUserId) return false;
    if (conversation.type === 'direct') return false;
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    return prevMessage.senderId !== message.senderId;
  };

  const shouldShowDateSeparator = (message: Message, index: number) => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    return !isSameDay(new Date(message.createdAt), new Date(prevMessage.createdAt));
  };

  const handleAvatarClick = (senderId: string) => {
    const participant = getParticipant(senderId);
    if (participant && participant.role === 'seller') {
      setSelectedSellerId(senderId);
    }
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <ScrollArea 
        className="flex-1 bg-muted/30 relative" 
        ref={scrollRef}
      >
        <div className="py-2 min-h-full flex flex-col">
          {/* Encryption Notice */}
          <div className="flex justify-center my-4 px-4">
            <div className="bg-accent/80 backdrop-blur-sm px-4 py-2.5 rounded-xl max-w-sm text-center shadow-sm border border-border/50">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Lock className="w-3.5 h-3.5" />
                <p className="text-xs">
                  Messages are protected by Harvestá's secure trading platform.{' '}
                  <button className="text-green-600 hover:underline font-medium">Learn more</button>
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-0.5 px-1">
            {messages.map((message, index) => (
              <div key={message.id}>
                {/* Date Separator */}
                {shouldShowDateSeparator(message, index) && (
                  <div className="flex justify-center my-4">
                    <div className="bg-accent/90 backdrop-blur-sm px-4 py-1.5 rounded-lg shadow-sm">
                      <span className="text-xs text-muted-foreground font-medium">
                        {format(new Date(message.createdAt), 'EEEE, MMMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                )}

                <MessageBubble
                  message={message}
                  isOwn={message.senderId === currentUserId}
                  showSenderName={shouldShowSenderName(message, index)}
                  senderName={getParticipantName(message.senderId)}
                  onAvatarClick={() => handleAvatarClick(message.senderId)}
                  onReply={onReply}
                />
              </div>
            ))}
          </div>

          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="px-3 py-2">
              <TypingIndicator users={typingUsers.map(id => getParticipantName(id))} />
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <Button
          size="icon"
          className="absolute bottom-24 right-4 rounded-full shadow-lg z-10 bg-background hover:bg-accent border border-border"
          onClick={scrollToBottom}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </Button>
      )}

      {/* Seller Profile Modal */}
      <SellerProfileModal
        sellerId={selectedSellerId || ''}
        isOpen={!!selectedSellerId}
        onClose={() => setSelectedSellerId(null)}
      />
    </>
  );
}
