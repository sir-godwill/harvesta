import { useState, useEffect } from 'react';
import { ChatList } from '@/components/chat/ChatList';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageArea } from '@/components/chat/MessageArea';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatContextPanel } from '@/components/chat/ChatContextPanel';
import { EmptyState } from '@/components/chat/EmptyState';
import { RFQQuotesPanel } from '@/components/chat/RFQQuotesPanel';
import { EscalationDialog } from '@/components/chat/EscalationDialog';
import { 
  fetchConversations, 
  fetchMessages, 
  sendMessage,
  searchConversations,
  updateTypingStatus,
  Conversation, 
  Message 
} from '@/lib/chat-api';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const CURRENT_USER_ID = 'current-user';
const USER_TYPE: 'buyer' | 'seller' = 'buyer';

export default function Index() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showContext, setShowContext] = useState(false);
  const [showRFQQuotes, setShowRFQQuotes] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);
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
      if (selectedConversation.type === 'rfq' && !isMobileView) {
        setShowRFQQuotes(true);
        setShowContext(false);
      } else {
        setShowRFQQuotes(false);
      }
    }
  }, [selectedConversation?.id, isMobileView]);

  useEffect(() => {
    if (!selectedConversation) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        const participant = selectedConversation.participants.find(p => p.id !== CURRENT_USER_ID);
        if (participant) {
          setTypingUsers([participant.id]);
          setTimeout(() => setTypingUsers([]), 3000);
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedConversation]);

  const handleSelectConversation = (id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      setSelectedConversation(conv);
      setConversations(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
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
    setMessages(prev => [...prev, newMessage]);
    setConversations(prev =>
      prev.map(c => c.id === selectedConversation.id ? { ...c, lastMessage: newMessage, updatedAt: new Date() } : c)
    );
  };

  const handleSendAttachment = async (type: string, file?: File) => {
    if (!selectedConversation) return;
    toast({ title: type === 'offer' ? "Create Offer" : type === 'product' ? "Share Product" : type === 'location' ? "Share Location" : "Uploading...", description: file?.name || `Opening ${type}...` });
  };

  const handleTyping = (isTyping: boolean) => {
    if (selectedConversation) updateTypingStatus(selectedConversation.id, isTyping);
  };

  const handleBack = () => {
    setSelectedConversation(null);
    setShowContext(false);
    setShowRFQQuotes(false);
  };

  const handleToggleContext = () => {
    if (selectedConversation?.type === 'rfq') {
      setShowRFQQuotes(!showRFQQuotes);
      setShowContext(false);
    } else {
      setShowContext(!showContext);
      setShowRFQQuotes(false);
    }
  };

  const showChatList = !isMobileView || !selectedConversation;
  const showChat = !isMobileView || selectedConversation;

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <div className={cn("w-full md:w-80 lg:w-96 flex-shrink-0 h-full flex flex-col border-r border-border", !showChatList && "hidden md:flex")}>
        <ChatList conversations={conversations} selectedId={selectedConversation?.id} onSelectConversation={handleSelectConversation} onSearch={handleSearch} userType={USER_TYPE} />
      </div>

      <div className={cn("flex-1 flex flex-col h-full min-w-0 bg-chat-bg", !showChat && "hidden")}>
        {selectedConversation ? (
          <>
            <ChatHeader conversation={selectedConversation} onBack={handleBack} onToggleContext={handleToggleContext} userType={USER_TYPE} />
            <MessageArea messages={messages} conversation={selectedConversation} currentUserId={CURRENT_USER_ID} typingUsers={typingUsers} />
            <ChatInput onSendMessage={handleSendMessage} onSendAttachment={handleSendAttachment} onTyping={handleTyping} disabled={selectedConversation.isFrozen} placeholder={selectedConversation.isFrozen ? "This chat has been frozen by admin" : "Type a message..."} />
          </>
        ) : (
          <EmptyState />
        )}
      </div>

      {!isMobileView && selectedConversation && (
        <>
          {showRFQQuotes && selectedConversation.type === 'rfq' && (
            <RFQQuotesPanel rfqId={selectedConversation.context?.type === 'rfq' ? selectedConversation.context.rfqId : ''} onClose={() => setShowRFQQuotes(false)} onSelectQuote={(quoteId) => toast({ title: "Quote Selected", description: `Viewing quote ${quoteId}` })} />
          )}
          {showContext && !showRFQQuotes && <ChatContextPanel context={selectedConversation.context} onClose={() => setShowContext(false)} />}
        </>
      )}

      <EscalationDialog open={showEscalation} onOpenChange={setShowEscalation} conversationId={selectedConversation?.id || ''} />
    </div>
  );
}
