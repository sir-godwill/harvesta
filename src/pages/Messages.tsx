import { useState, useEffect } from 'react';
import { MessageSquare, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  fetchConversations, 
  fetchMessages, 
  sendMessage,
  searchConversations,
  Conversation, 
  Message 
} from '@/lib/chat-api';
import { ChatList } from '@/components/chat/ChatList';
import { MessageArea } from '@/components/chat/MessageArea';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { EmptyState } from '@/components/chat/EmptyState';
import { ChatContextPanel } from '@/components/chat/ChatContextPanel';
import { Link } from 'react-router-dom';

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileListOpen, setIsMobileListOpen] = useState(true);
  const [showContextPanel, setShowContextPanel] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setIsLoading(true);
    const data = await fetchConversations();
    setConversations(data);
    setIsLoading(false);
  };

  const handleSelectConversation = async (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setSelectedConversation(conversation);
      setIsMobileListOpen(false);
      const msgs = await fetchMessages(conversation.id);
      setMessages(msgs);
    }
  };

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      const results = await searchConversations(query);
      setConversations(results);
    } else {
      await loadConversations();
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !content.trim()) return;
    
    const newMessage = await sendMessage(selectedConversation.id, { 
      type: 'text', 
      content 
    });
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendAttachment = async (type: string, file?: File) => {
    if (!selectedConversation) return;
    
    const newMessage = await sendMessage(selectedConversation.id, { 
      type: type as any, 
      content: file ? file.name : `${type} shared` 
    });
    setMessages(prev => [...prev, newMessage]);
  };

  const handleTyping = (isTyping: boolean) => {
    // Could integrate with real-time typing indicators
    console.log('Typing:', isTyping);
  };

  const handleBackToList = () => {
    setIsMobileListOpen(true);
    setSelectedConversation(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-card border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="font-semibold">Messages</h1>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-57px)] lg:h-screen">
        {/* Sidebar - Conversation List */}
        <aside className={cn(
          "w-full lg:w-80 xl:w-96 border-r bg-card flex flex-col",
          "lg:block",
          !isMobileListOpen && "hidden"
        )}>
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ChatList
              conversations={conversations}
              selectedId={selectedConversation?.id}
              onSelectConversation={handleSelectConversation}
              onSearch={handleSearch}
              userType="buyer"
              onNewChat={() => console.log('New chat')}
            />
          )}
        </aside>

        {/* Main Chat Area */}
        <main className={cn(
          "flex-1 flex flex-col bg-muted/30 relative",
          isMobileListOpen && "hidden lg:flex"
        )}>
          {selectedConversation ? (
            <>
              <ChatHeader 
                conversation={selectedConversation}
                onBack={handleBackToList}
                onToggleContext={() => setShowContextPanel(!showContextPanel)}
              />
              <MessageArea 
                messages={messages}
                conversation={selectedConversation}
                currentUserId="current-user"
              />
              <ChatInput 
                onSendMessage={handleSendMessage}
                onSendAttachment={handleSendAttachment}
                onTyping={handleTyping}
                disabled={selectedConversation?.isFrozen}
              />
            </>
          ) : (
            <EmptyState />
          )}
        </main>

        {/* Context Panel */}
        {showContextPanel && selectedConversation?.context && (
          <ChatContextPanel 
            context={selectedConversation.context}
            onClose={() => setShowContextPanel(false)}
          />
        )}
      </div>
    </div>
  );
}
