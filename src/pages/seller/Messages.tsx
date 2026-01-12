import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Send,
  Paperclip,
  MoreHorizontal,
  MessageSquare,
  Package,
  Clock,
  ArrowLeft,
  Star,
  Plus,
  Check,
  CheckCheck,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
  orderId?: string;
}

interface ConversationMessage {
  id: string;
  sender: 'buyer' | 'seller';
  text: string;
  time: string;
  status: 'read' | 'delivered';
}

const mockMessages: Message[] = [
  { id: '1', from: 'Douala Fresh Markets', subject: 'Order Inquiry', preview: 'Hello, I am interested in your Premium Arabica Coffee Beans...', date: '2026-01-12T10:30:00', unread: true, orderId: 'ORD-2026-001' },
  { id: '2', from: 'Lagos Spice Traders', subject: 'Bulk Quote Request', preview: 'We need 5000kg of dried ginger. What is your best price?', date: '2026-01-12T09:15:00', unread: true },
  { id: '3', from: 'Abuja Organic Market', subject: 'Delivery Update', preview: 'When can we expect the shipment to arrive?', date: '2026-01-11T16:45:00', unread: false, orderId: 'ORD-2026-002' },
  { id: '4', from: 'Cameroon Fresh Foods Ltd', subject: 'Re: Product Quality', preview: 'The samples you sent were excellent. We would like to proceed...', date: '2026-01-11T14:20:00', unread: false },
  { id: '5', from: 'West Africa Imports', subject: 'Payment Confirmation', preview: 'We have processed the payment for order #1234...', date: '2026-01-10T11:00:00', unread: false, orderId: 'ORD-2026-003' },
];

const mockConversation: ConversationMessage[] = [
  { id: '1', sender: 'buyer', text: 'Hello, I am interested in your Premium Arabica Coffee Beans. What is the minimum order quantity?', time: '10:30 AM', status: 'read' },
  { id: '2', sender: 'seller', text: 'Hello! Thank you for your interest. The minimum order for wholesale is 100kg. We can offer a 10% discount for orders above 500kg.', time: '10:35 AM', status: 'read' },
  { id: '3', sender: 'buyer', text: 'Great! Can you provide samples before we place a large order?', time: '10:40 AM', status: 'read' },
  { id: '4', sender: 'seller', text: 'Yes, we can send you a 1kg sample. The sample cost is 15,000 XAF including shipping. This amount will be deducted from your first order of 100kg or more.', time: '10:45 AM', status: 'read' },
  { id: '5', sender: 'buyer', text: 'That sounds fair. How do I proceed with the sample order?', time: '10:50 AM', status: 'delivered' },
];

export default function SellerMessages() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showConversation, setShowConversation] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'unread'>('all');

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = msg.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'unread') return matchesSearch && msg.unread;
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const unreadCount = messages.filter(m => m.unread).length;

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    setShowConversation(true);
    // Mark as read
    setMessages(prev => prev.map(m => m.id === message.id ? { ...m, unread: false } : m));
  };

  const handleBack = () => {
    setShowConversation(false);
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      // API placeholder for sending message
      console.log('Sending reply:', replyText);
      setReplyText('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">{unreadCount} unread</p>
        </div>
      </div>

      <div className="p-3 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-xl border shadow-sm overflow-hidden"
        >
          <div className="flex h-[calc(100vh-12rem)] md:h-[600px]">
            {/* Messages List */}
            <div className={cn(
              'w-full md:w-96 border-r border-border flex flex-col',
              showConversation && 'hidden md:flex'
            )}>
              {/* Search and Filters */}
              <div className="p-3 md:p-4 border-b border-border space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                        <Filter className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setFilterType('all')}>
                        <Check className={cn('w-4 h-4 mr-2', filterType !== 'all' && 'invisible')} />
                        All Messages
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType('unread')}>
                        <Check className={cn('w-4 h-4 mr-2', filterType !== 'unread' && 'invisible')} />
                        Unread Only
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Quick Filter Chips */}
                <div className="flex gap-2">
                  <Button
                    variant={filterType === 'all' ? 'default' : 'outline'}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setFilterType('all')}
                  >
                    All
                  </Button>
                  <Button
                    variant={filterType === 'unread' ? 'default' : 'outline'}
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => setFilterType('unread')}
                  >
                    Unread
                    {unreadCount > 0 && (
                      <Badge className="h-4 px-1.5 text-[10px] bg-primary/20 text-primary">{unreadCount}</Badge>
                    )}
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1">
                {filteredMessages.length === 0 ? (
                  <div className="p-6 text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">No messages found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredMessages.map((message) => (
                      <button
                        key={message.id}
                        onClick={() => handleSelectMessage(message)}
                        className={cn(
                          'w-full p-3 md:p-4 text-left hover:bg-muted/50 transition-colors relative',
                          selectedMessage?.id === message.id && 'bg-muted',
                          message.unread && 'bg-primary/5'
                        )}
                      >
                        <div className="flex items-start justify-between mb-1 gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {message.unread && (
                              <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                            )}
                            <span className={cn(
                              'text-sm truncate',
                              message.unread ? 'font-semibold text-foreground' : 'font-medium text-foreground'
                            )}>
                              {message.from}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatDate(message.date)}
                          </span>
                        </div>
                        <p className={cn(
                          'text-sm mb-1 truncate',
                          message.unread ? 'font-medium text-foreground' : 'text-muted-foreground'
                        )}>
                          {message.subject}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {message.preview}
                        </p>
                        {message.orderId && (
                          <Badge variant="outline" className="mt-2 text-xs gap-1 bg-muted">
                            <Package className="w-3 h-3" />
                            {message.orderId}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Message Content */}
            <div className={cn(
              'flex-1 flex flex-col',
              !showConversation && 'hidden md:flex'
            )}>
              {selectedMessage ? (
                <>
                  {/* Message Header */}
                  <div className="p-3 md:p-4 border-b border-border flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden shrink-0"
                      onClick={handleBack}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground text-sm md:text-base truncate">{selectedMessage.subject}</h3>
                      <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                        <span className="truncate">{selectedMessage.from}</span>
                        <span className="shrink-0">•</span>
                        <span className="flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3" />
                          {formatDate(selectedMessage.date)}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Star className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Conversation Messages */}
                  <ScrollArea className="flex-1 p-4 md:p-6">
                    <div className="space-y-4 max-w-2xl mx-auto">
                      {mockConversation.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            'flex',
                            msg.sender === 'seller' ? 'justify-end' : 'justify-start'
                          )}
                        >
                          <div
                            className={cn(
                              'max-w-[80%] rounded-2xl px-4 py-2.5',
                              msg.sender === 'seller'
                                ? 'bg-primary text-primary-foreground rounded-br-md'
                                : 'bg-muted rounded-bl-md'
                            )}
                          >
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <div className={cn(
                              'flex items-center gap-1 mt-1',
                              msg.sender === 'seller' ? 'justify-end' : 'justify-start'
                            )}>
                              <span className={cn(
                                'text-[10px]',
                                msg.sender === 'seller' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                              )}>
                                {msg.time}
                              </span>
                              {msg.sender === 'seller' && (
                                msg.status === 'read' 
                                  ? <CheckCheck className="w-3 h-3 text-primary-foreground/70" />
                                  : <Check className="w-3 h-3 text-primary-foreground/70" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Reply Box */}
                  <div className="p-3 md:p-4 border-t border-border bg-muted/30">
                    <div className="flex items-end gap-2 max-w-2xl mx-auto">
                      <div className="flex-1 relative">
                        <Textarea
                          placeholder="Type your message..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="min-h-[44px] max-h-32 pr-12 resize-none"
                          rows={1}
                        />
                        <Button variant="ghost" size="icon" className="absolute right-2 bottom-1.5 h-8 w-8">
                          <Paperclip className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button 
                        onClick={handleSendReply}
                        disabled={!replyText.trim()}
                        className="shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Select a conversation</h3>
                  <p className="text-sm text-muted-foreground">Choose a message from the list to view the conversation</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
