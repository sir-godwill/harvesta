import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/seller/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Send,
  Paperclip,
  MoreHorizontal,
  MessageSquare,
  Package,
  Clock,
  ArrowLeft,
  Smile,
  Image as ImageIcon,
  Star,
  Archive,
  Trash2,
  Phone,
  Video,
  Pin,
  Check,
  CheckCheck,
  Filter,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchMessages, type Message } from "@/services/api";
import { toast } from "sonner";

// Mock conversation messages
const mockConversation = [
  { id: '1', sender: 'buyer', text: 'Hello, I am interested in your Premium Arabica Coffee Beans. What is the minimum order quantity?', time: '10:30 AM', status: 'read' },
  { id: '2', sender: 'seller', text: 'Hello! Thank you for your interest. The minimum order for wholesale is 100kg. We can offer a 10% discount for orders above 500kg.', time: '10:35 AM', status: 'read' },
  { id: '3', sender: 'buyer', text: 'Great! Can you provide samples before we place a large order?', time: '10:40 AM', status: 'read' },
  { id: '4', sender: 'seller', text: 'Yes, we can send you a 1kg sample. The sample cost is 15,000 XAF including shipping. This amount will be deducted from your first order of 100kg or more.', time: '10:45 AM', status: 'read' },
  { id: '5', sender: 'buyer', text: 'That sounds fair. How do I proceed with the sample order?', time: '10:50 AM', status: 'delivered' },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [showConversation, setShowConversation] = useState(false);
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [showAttachmentDialog, setShowAttachmentDialog] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'starred'>('all');
  const [starredMessages, setStarredMessages] = useState<string[]>([]);

  useEffect(() => {
    async function loadMessages() {
      setIsLoading(true);
      try {
        const data = await fetchMessages();
        setMessages(data);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadMessages();
  }, []);

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch = msg.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'unread') return matchesSearch && msg.unread;
    if (filterType === 'starred') return matchesSearch && starredMessages.includes(msg.id);
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
  };

  const handleBack = () => {
    setShowConversation(false);
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      toast.success("Message sent!");
      setReplyText("");
    }
  };

  const toggleStar = (id: string) => {
    setStarredMessages(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleArchive = () => {
    toast.success("Conversation archived");
  };

  const handleDelete = () => {
    toast.success("Conversation deleted");
    setShowConversation(false);
    setSelectedMessage(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Messages" subtitle={`${unreadCount} unread`} />

      <div className="p-3 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-xl border shadow-soft overflow-hidden"
        >
          <div className="flex h-[calc(100vh-10rem)] md:h-[600px]">
            {/* Messages List */}
            <div className={cn(
              "w-full md:w-96 border-r border-border flex flex-col",
              showConversation && "hidden md:flex"
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
                        <Check className={cn("w-4 h-4 mr-2", filterType !== 'all' && "invisible")} />
                        All Messages
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType('unread')}>
                        <Check className={cn("w-4 h-4 mr-2", filterType !== 'unread' && "invisible")} />
                        Unread Only
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType('starred')}>
                        <Check className={cn("w-4 h-4 mr-2", filterType !== 'starred' && "invisible")} />
                        Starred
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="icon" className="h-9 w-9 shrink-0" onClick={() => setShowNewMessageDialog(true)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Quick Filter Chips */}
                <div className="flex gap-2 overflow-x-auto pb-1">
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
                  <Button
                    variant={filterType === 'starred' ? 'default' : 'outline'}
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => setFilterType('starred')}
                  >
                    <Star className="w-3 h-3" />
                    Starred
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1">
                {isLoading ? (
                  <div className="p-4 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
                    ))}
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="p-6 text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">No messages found</p>
                    <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {filteredMessages.map((message) => (
                      <button
                        key={message.id}
                        onClick={() => handleSelectMessage(message)}
                        className={cn(
                          "w-full p-3 md:p-4 text-left hover:bg-muted/50 transition-colors relative",
                          selectedMessage?.id === message.id && "bg-muted",
                          message.unread && "bg-primary/5"
                        )}
                      >
                        <div className="flex items-start justify-between mb-1 gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {message.unread && (
                              <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                            )}
                            <span className={cn(
                              "text-sm truncate",
                              message.unread ? "font-semibold text-foreground" : "font-medium text-foreground"
                            )}>
                              {message.from}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {starredMessages.includes(message.id) && (
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatDate(message.date)}
                            </span>
                          </div>
                        </div>
                        <p className={cn(
                          "text-sm mb-1 truncate",
                          message.unread ? "font-medium text-foreground" : "text-muted-foreground"
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
              "flex-1 flex flex-col",
              !showConversation && "hidden md:flex"
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
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleStar(selectedMessage.id)}
                      >
                        <Star className={cn(
                          "w-4 h-4",
                          starredMessages.includes(selectedMessage.id) && "text-yellow-500 fill-yellow-500"
                        )} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleStar(selectedMessage.id)}>
                            <Star className="w-4 h-4 mr-2" />
                            {starredMessages.includes(selectedMessage.id) ? 'Unstar' : 'Star'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pin className="w-4 h-4 mr-2" />
                            Pin conversation
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={handleArchive}>
                            <Archive className="w-4 h-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Conversation Messages */}
                  <ScrollArea className="flex-1 p-4 md:p-6">
                    <div className="space-y-4 max-w-2xl mx-auto">
                      {mockConversation.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex",
                            msg.sender === 'seller' ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[80%] rounded-2xl px-4 py-2.5",
                              msg.sender === 'seller'
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-muted rounded-bl-md"
                            )}
                          >
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <div className={cn(
                              "flex items-center gap-1 mt-1",
                              msg.sender === 'seller' ? "justify-end" : "justify-start"
                            )}>
                              <span className={cn(
                                "text-[10px]",
                                msg.sender === 'seller' ? "text-primary-foreground/70" : "text-muted-foreground"
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
                          className="min-h-[44px] max-h-[120px] resize-none pr-20 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendReply();
                            }
                          }}
                        />
                        <div className="absolute right-2 bottom-2 flex items-center gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setShowAttachmentDialog(true)}
                          >
                            <Paperclip className="w-4 h-4 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                          >
                            <Smile className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        className="h-11 w-11 shrink-0"
                        onClick={handleSendReply}
                        disabled={!replyText.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-6">
                  <div>
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">Select a Conversation</h3>
                    <p className="text-sm md:text-base text-muted-foreground max-w-sm mx-auto">
                      Choose a message from the list to view the conversation and reply to buyers
                    </p>
                    <Button className="mt-4 gap-2" onClick={() => setShowNewMessageDialog(true)}>
                      <Plus className="w-4 h-4" />
                      New Message
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* New Message Dialog */}
      <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <Input placeholder="Enter buyer name or email" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input placeholder="Message subject" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea placeholder="Write your message..." className="min-h-[120px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewMessageDialog(false)}>Cancel</Button>
            <Button onClick={() => { toast.success("Message sent!"); setShowNewMessageDialog(false); }}>
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attachment Dialog */}
      <Dialog open={showAttachmentDialog} onOpenChange={setShowAttachmentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Attachment</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button variant="outline" className="h-24 flex-col gap-2">
              <ImageIcon className="w-6 h-6" />
              <span className="text-sm">Photo</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Package className="w-6 h-6" />
              <span className="text-sm">Product</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Paperclip className="w-6 h-6" />
              <span className="text-sm">Document</span>
            </Button>
            <Button variant="outline" className="h-24 flex-col gap-2">
              <Video className="w-6 h-6" />
              <span className="text-sm">Video</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
