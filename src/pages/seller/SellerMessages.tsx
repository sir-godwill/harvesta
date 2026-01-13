import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Send, Paperclip, MoreVertical, Phone, Video, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { cn } from '@/lib/utils';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const mockConversations = [
  { id: '1', name: 'John Buyer', avatar: '', lastMessage: 'Is this product still available?', time: '2 min ago', unread: 3, online: true },
  { id: '2', name: 'Sarah Foods Ltd', avatar: '', lastMessage: 'Thank you for the quick delivery!', time: '1 hour ago', unread: 0, online: false },
  { id: '3', name: 'Mike Wholesaler', avatar: '', lastMessage: 'Can we discuss bulk pricing?', time: '3 hours ago', unread: 1, online: true },
  { id: '4', name: 'Fresh Markets Inc', avatar: '', lastMessage: 'Order #2345 has been received', time: 'Yesterday', unread: 0, online: false },
];

const mockMessages = [
  { id: '1', sender: 'buyer', text: 'Hello, I\'m interested in your organic tomatoes.', time: '10:30 AM' },
  { id: '2', sender: 'seller', text: 'Hi! Yes, we have fresh organic tomatoes available. How much do you need?', time: '10:32 AM' },
  { id: '3', sender: 'buyer', text: 'I need about 50kg for my restaurant. What\'s your best price?', time: '10:35 AM' },
  { id: '4', sender: 'seller', text: 'For 50kg, I can offer 15,000 XAF. That includes delivery within Douala.', time: '10:38 AM' },
  { id: '5', sender: 'buyer', text: 'Is this product still available?', time: '10:40 AM' },
];

export default function SellerMessages() {
  const [selectedChat, setSelectedChat] = useState(mockConversations[0]);
  const [message, setMessage] = useState('');

  return (
    <SellerLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="h-[calc(100vh-120px)]">
        <motion.div variants={itemVariants} className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-display font-bold">Messages</h1>
          <p className="text-muted-foreground">Communicate with your buyers</p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex gap-4 h-[calc(100%-80px)]">
          {/* Conversations List */}
          <Card className="w-80 flex-shrink-0">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {mockConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedChat(conv)}
                    className={cn(
                      'w-full p-3 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left',
                      selectedChat.id === conv.id && 'bg-muted'
                    )}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conv.avatar} />
                        <AvatarFallback>{conv.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{conv.name}</p>
                        <span className="text-xs text-muted-foreground">{conv.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <Badge className="bg-primary">{conv.unread}</Badge>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="flex-1 flex flex-col">
            <CardHeader className="border-b flex-row items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{selectedChat.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{selectedChat.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedChat.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Star className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex',
                    msg.sender === 'seller' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[70%] rounded-2xl px-4 py-2',
                      msg.sender === 'seller'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted rounded-bl-sm'
                    )}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={cn(
                      'text-xs mt-1',
                      msg.sender === 'seller' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>

            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </SellerLayout>
  );
}
