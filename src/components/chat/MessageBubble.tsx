import { useState } from 'react';
import { Check, CheckCheck, Clock, AlertCircle, FileText, MapPin, Package, Tag, Truck, Reply, Forward, Copy, Flag, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message, MessageStatus, UserRole } from '@/lib/chat-api';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showSenderName?: boolean;
  senderName?: string;
  onAvatarClick?: () => void;
  onReply?: (message: Message) => void;
}

const statusIcons: Record<MessageStatus, React.ReactNode> = {
  sending: <Clock className="w-3.5 h-3.5 text-muted-foreground animate-pulse" />,
  sent: <Check className="w-3.5 h-3.5 text-muted-foreground" />,
  delivered: <CheckCheck className="w-3.5 h-3.5 text-muted-foreground" />,
  read: <CheckCheck className="w-3.5 h-3.5 text-blue-500" />,
  failed: <AlertCircle className="w-3.5 h-3.5 text-destructive" />,
};

const roleColors: Record<UserRole, string> = {
  buyer: 'text-blue-600',
  seller: 'text-green-600',
  logistics: 'text-purple-600',
  admin: 'text-red-600',
  system: 'text-gray-600',
};

export function MessageBubble({ message, isOwn, showSenderName, senderName, onAvatarClick, onReply }: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);

  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-3 px-4">
        <div className="bg-muted px-4 py-1.5 rounded-lg shadow-sm">
          <p className="text-xs text-muted-foreground text-center">{message.content}</p>
        </div>
      </div>
    );
  }

  const renderOfferCard = () => {
    const offer = message.metadata;
    if (!offer) return null;
    return (
      <div className={cn("rounded-xl overflow-hidden shadow-sm border-2 max-w-[300px]", "border-green-400 bg-green-50")}>
        <div className="px-4 py-2 flex items-center gap-2 bg-green-600">
          <Tag className="w-4 h-4 text-white" />
          <span className="font-medium text-white text-sm">Offer</span>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <h4 className="font-semibold">{offer.productName}</h4>
            <p className="text-sm text-muted-foreground">{offer.quantity} {offer.unit}</p>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-green-600">{offer.currency} {offer.pricePerUnit?.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">/{offer.unit}</span>
          </div>
          <div className="text-sm">
            <span className="text-muted-foreground">Total: </span>
            <span className="font-semibold">{offer.currency} {offer.totalPrice?.toLocaleString()}</span>
          </div>
          {!isOwn && (
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">Accept</Button>
              <Button size="sm" variant="outline" className="flex-1">Counter</Button>
            </div>
          )}
        </div>
        <div className="px-4 pb-2 flex items-center gap-1 justify-end">
          <span className="text-[11px] text-muted-foreground">{format(message.createdAt, 'h:mm a')}</span>
          {isOwn && statusIcons[message.status]}
        </div>
      </div>
    );
  };

  if (message.type === 'offer' || message.type === 'counter-offer' || message.type === 'quote') {
    return <div className={cn("flex mb-1 px-2", isOwn ? "justify-end" : "justify-start")}>{renderOfferCard()}</div>;
  }

  if (message.type === 'delivery-update') {
    const update = message.metadata;
    return (
      <div className={cn("flex mb-1 px-2", isOwn ? "justify-end" : "justify-start")}>
        <div className="rounded-xl overflow-hidden shadow-sm border bg-background max-w-[280px]">
          <div className="bg-purple-600 px-4 py-2 flex items-center gap-2">
            <Truck className="w-4 h-4 text-white" />
            <span className="font-medium text-white text-sm">Delivery Update</span>
          </div>
          <div className="p-4 space-y-2">
            <Badge className="bg-green-100 text-green-700">{update?.status}</Badge>
            {update?.location && <div className="flex items-start gap-2 text-sm"><MapPin className="w-4 h-4 text-muted-foreground mt-0.5" /><span>{update.location}</span></div>}
          </div>
          <div className="px-4 pb-2"><span className="text-[11px] text-muted-foreground">{format(message.createdAt, 'h:mm a')}</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex mb-1 px-2 group", isOwn ? "justify-end" : "justify-start")} onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}>
      <div className={cn("max-w-[85%] md:max-w-[70%] relative", isOwn ? "items-end" : "items-start")}>
        {showSenderName && !isOwn && senderName && (
          <button onClick={onAvatarClick} className={cn("text-sm font-medium mb-0.5 px-3 hover:underline", roleColors[message.senderRole])}>{senderName}</button>
        )}
        <div className={cn("relative px-3 py-2 rounded-lg shadow-sm", isOwn ? "bg-green-100 rounded-tr-none" : "bg-white rounded-tl-none")}>
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words pr-16">{message.content}</p>
          <div className="absolute bottom-1 right-2 flex items-center gap-1">
            <span className="text-[11px] text-muted-foreground">{format(message.createdAt, 'h:mm a')}</span>
            {isOwn && statusIcons[message.status]}
          </div>
        </div>
        {showActions && (
          <div className={cn("absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity", isOwn ? "left-0 -translate-x-full pr-1" : "right-0 translate-x-full pl-1")}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-background shadow-sm"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align={isOwn ? "start" : "end"}>
                <DropdownMenuItem onClick={() => onReply?.(message)}><Reply className="w-4 h-4 mr-2" />Reply</DropdownMenuItem>
                <DropdownMenuItem><Forward className="w-4 h-4 mr-2" />Forward</DropdownMenuItem>
                <DropdownMenuItem><Copy className="w-4 h-4 mr-2" />Copy</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive"><Flag className="w-4 h-4 mr-2" />Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}
