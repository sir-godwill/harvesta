import { useState } from 'react';
import { 
  Check, 
  CheckCheck, 
  Clock, 
  AlertCircle, 
  Play, 
  Pause,
  FileText, 
  MapPin, 
  User, 
  Package, 
  Tag, 
  Truck,
  Phone,
  Video,
  Reply,
  Forward,
  Copy,
  Flag,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message, MessageStatus, UserRole } from '@/lib/chat-api';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showSenderName?: boolean;
  senderName?: string;
  onAvatarClick?: () => void;
  onReply?: (message: Message) => void;
}

const statusIcons: Record<MessageStatus, React.ReactNode> = {
  sending: <Clock className="w-3.5 h-3.5 text-muted-foreground animate-pulse-soft" />,
  sent: <Check className="w-3.5 h-3.5 text-muted-foreground" />,
  delivered: <CheckCheck className="w-3.5 h-3.5 text-muted-foreground" />,
  read: <CheckCheck className="w-3.5 h-3.5 text-blue-500" />,
  failed: <AlertCircle className="w-3.5 h-3.5 text-destructive" />,
};

const roleColors: Record<UserRole, string> = {
  buyer: 'text-blue-600',
  seller: 'text-emerald-600',
  logistics: 'text-purple-600',
  admin: 'text-red-600',
  system: 'text-gray-600',
};

export function MessageBubble({ 
  message, 
  isOwn, 
  showSenderName, 
  senderName,
  onAvatarClick,
  onReply 
}: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  
  const renderContent = () => {
    switch (message.type) {
      case 'offer':
      case 'counter-offer':
      case 'quote':
        return <OfferCard message={message} isOwn={isOwn} />;
      case 'delivery-update':
        return <DeliveryUpdateCard message={message} />;
      case 'system':
        return <SystemMessage message={message} />;
      case 'image':
        return <ImageMessage message={message} isOwn={isOwn} />;
      case 'audio':
        return <AudioMessage message={message} isOwn={isOwn} />;
      case 'document':
        return <DocumentMessage message={message} isOwn={isOwn} />;
      case 'location':
        return <LocationMessage message={message} isOwn={isOwn} />;
      case 'product':
        return <ProductCard message={message} isOwn={isOwn} />;
      case 'voice-call':
      case 'video-call':
        return <CallMessage message={message} isOwn={isOwn} />;
      default:
        return <TextMessage message={message} isOwn={isOwn} />;
    }
  };

  if (message.type === 'system') {
    return renderContent();
  }

  return (
    <div 
      className={cn(
        "flex mb-1 px-2 group animate-bubble-in",
        isOwn ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className={cn(
        "max-w-[85%] md:max-w-[70%] relative",
        isOwn ? "items-end" : "items-start"
      )}>
        {/* Sender name for groups */}
        {showSenderName && !isOwn && senderName && (
          <button 
            onClick={onAvatarClick}
            className={cn("text-sm font-medium mb-0.5 px-3 hover:underline", roleColors[message.senderRole])}
          >
            {senderName}
          </button>
        )}
        
        {/* Reply preview */}
        {message.replyToMessage && (
          <div className={cn(
            "mx-1 mb-1 px-3 py-1.5 rounded-lg border-l-4 text-xs",
            isOwn 
              ? "bg-primary/20 border-primary/50" 
              : "bg-muted border-muted-foreground/30"
          )}>
            <p className="font-medium truncate">{message.replyToMessage.content}</p>
          </div>
        )}
        
        {renderContent()}
        
        {/* Message Actions (visible on hover) */}
        {showActions && (
          <div className={cn(
            "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity",
            isOwn ? "left-0 -translate-x-full pr-1" : "right-0 translate-x-full pl-1"
          )}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-background shadow-sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isOwn ? "start" : "end"}>
                <DropdownMenuItem onClick={() => onReply?.(message)}>
                  <Reply className="w-4 h-4 mr-2" />
                  Reply
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="w-4 h-4 mr-2" />
                  Forward
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}

function TextMessage({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div className={cn(
      "relative px-3 py-2 rounded-lg shadow-sm",
      isOwn 
        ? "bg-chat-bubble-sent rounded-tr-none" 
        : "bg-chat-bubble-received rounded-tl-none",
      isOwn ? "bubble-tail-sent" : "bubble-tail-received"
    )}>
      <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words pr-16">
        {message.content}
      </p>
      <div className={cn(
        "absolute bottom-1 right-2 flex items-center gap-1"
      )}>
        <span className="text-[11px] text-chat-timestamp">
          {format(message.createdAt, 'h:mm a')}
        </span>
        {isOwn && statusIcons[message.status]}
      </div>
    </div>
  );
}

function AudioMessage({ message, isOwn }: { message: Message; isOwn: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Generate random waveform bars for visual effect
  const waveformBars = Array.from({ length: 30 }, () => Math.random() * 100);
  
  return (
    <div className={cn(
      "relative px-3 py-2 rounded-2xl shadow-sm flex items-center gap-3 min-w-[240px]",
      isOwn 
        ? "bg-chat-bubble-sent rounded-tr-none" 
        : "bg-chat-bubble-received rounded-tl-none"
    )}>
      {/* Play Button */}
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 shadow-md"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-white" />
        ) : (
          <Play className="w-5 h-5 text-white ml-0.5" />
        )}
      </button>
      
      {/* Waveform */}
      <div className="flex-1">
        <div className="flex items-center gap-[2px] h-6">
          {waveformBars.map((height, i) => (
            <div 
              key={i}
              className={cn(
                "w-[3px] rounded-full transition-all",
                isPlaying 
                  ? "bg-secondary waveform-bar" 
                  : "bg-muted-foreground/30"
              )}
              style={{ 
                height: `${Math.max(15, height)}%`,
                animationDelay: `${i * 0.05}s`
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">
            {message.metadata?.duration || '0:00'}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-chat-timestamp">
              {format(message.createdAt, 'h:mm a')}
            </span>
            {isOwn && statusIcons[message.status]}
          </div>
        </div>
      </div>
      
      {/* Avatar for received voice messages */}
      {!isOwn && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0 -mr-1">
          {message.metadata?.senderInitial || 'U'}
        </div>
      )}
    </div>
  );
}

function ImageMessage({ message, isOwn }: { message: Message; isOwn: boolean }) {
  const images = message.metadata?.images || [message.metadata?.url || '/placeholder.svg'];
  const imageCount = images.length;
  const showMore = imageCount > 4;
  const displayImages = showMore ? images.slice(0, 4) : images;
  
  return (
    <div className={cn(
      "rounded-lg overflow-hidden shadow-sm max-w-[280px]",
      isOwn ? "bg-chat-bubble-sent" : "bg-chat-bubble-received"
    )}>
      <div className={cn(
        "grid gap-0.5",
        imageCount === 1 ? "grid-cols-1" : "grid-cols-2"
      )}>
        {displayImages.map((url: string, index: number) => (
          <div 
            key={index} 
            className={cn(
              "relative overflow-hidden",
              imageCount === 1 ? "aspect-[4/3]" : "aspect-square"
            )}
          >
            <img 
              src={url} 
              alt="Shared"
              className="w-full h-full object-cover"
            />
            {showMore && index === 3 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">+{imageCount - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      {message.content && (
        <p className="px-3 py-2 text-sm">{message.content}</p>
      )}
      <div className="px-3 pb-2 flex items-center gap-1 justify-end">
        <span className="text-[11px] text-chat-timestamp">
          {format(message.createdAt, 'h:mm a')}
        </span>
        {isOwn && statusIcons[message.status]}
      </div>
    </div>
  );
}

function CallMessage({ message, isOwn }: { message: Message; isOwn: boolean }) {
  const isVideo = message.type === 'video-call';
  const Icon = isVideo ? Video : Phone;
  const duration = message.metadata?.duration || '0 sec';
  const missed = message.metadata?.missed;
  
  return (
    <div className={cn(
      "px-3 py-2 rounded-2xl shadow-sm flex items-center gap-3 min-w-[180px]",
      isOwn 
        ? "bg-chat-bubble-sent rounded-tr-none" 
        : "bg-chat-bubble-received rounded-tl-none"
    )}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center",
        missed ? "bg-destructive/20" : "bg-secondary/20"
      )}>
        <Icon className={cn("w-4 h-4", missed ? "text-destructive" : "text-secondary")} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">
          {isVideo ? 'Video call' : 'Voice call'}
        </p>
        <p className="text-xs text-muted-foreground">{duration}</p>
      </div>
      <span className="text-[11px] text-chat-timestamp">
        {format(message.createdAt, 'h:mm a')}
      </span>
    </div>
  );
}

function OfferCard({ message, isOwn }: { message: Message; isOwn: boolean }) {
  const offer = message.metadata;
  if (!offer) return null;

  const isCounterOffer = message.type === 'counter-offer';

  return (
    <div className={cn(
      "rounded-xl overflow-hidden shadow-sm border-2 max-w-[300px]",
      isCounterOffer ? "border-orange-400 bg-orange-50" : "border-secondary bg-emerald-50"
    )}>
      <div className={cn(
        "px-4 py-2 flex items-center gap-2",
        isCounterOffer ? "bg-orange-500" : "bg-secondary"
      )}>
        <Tag className="w-4 h-4 text-white" />
        <span className="font-medium text-white text-sm">
          {isCounterOffer ? 'Counter Offer' : message.type === 'quote' ? 'Quote' : 'Offer'}
        </span>
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h4 className="font-semibold">{offer.productName}</h4>
          <p className="text-sm text-muted-foreground">{offer.quantity} {offer.unit}</p>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-secondary">
            {offer.currency} {offer.pricePerUnit?.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">/{offer.unit}</span>
        </div>

        <div className="text-sm">
          <span className="text-muted-foreground">Total: </span>
          <span className="font-semibold">{offer.currency} {offer.totalPrice?.toLocaleString()}</span>
        </div>

        {offer.deliveryTerms && (
          <p className="text-xs text-muted-foreground">{offer.deliveryTerms}</p>
        )}

        {offer.validUntil && (
          <p className="text-xs text-orange-600 font-medium">
            Valid until {format(new Date(offer.validUntil), 'MMM dd, yyyy')}
          </p>
        )}

        {!isOwn && (
          <div className="flex gap-2 pt-2">
            <Button size="sm" className="flex-1 bg-secondary hover:bg-secondary/90">Accept</Button>
            <Button size="sm" variant="outline" className="flex-1">Counter</Button>
            <Button size="sm" variant="ghost" className="text-destructive">Decline</Button>
          </div>
        )}
      </div>

      <div className="px-4 pb-2 flex items-center gap-1 justify-end">
        <span className="text-[11px] text-chat-timestamp">
          {format(message.createdAt, 'h:mm a')}
        </span>
        {isOwn && statusIcons[message.status]}
      </div>
    </div>
  );
}

function DeliveryUpdateCard({ message }: { message: Message }) {
  const update = message.metadata;
  if (!update) return null;

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    confirmed: { label: 'Confirmed', color: 'text-secondary', bg: 'bg-secondary/10' },
    packaging: { label: 'Packaging', color: 'text-orange-600', bg: 'bg-orange-50' },
    'picked-up': { label: 'Picked Up', color: 'text-secondary', bg: 'bg-secondary/10' },
    'in-transit': { label: 'In Transit', color: 'text-blue-600', bg: 'bg-blue-50' },
    delayed: { label: 'Delayed', color: 'text-destructive', bg: 'bg-destructive/10' },
    delivered: { label: 'Delivered', color: 'text-secondary', bg: 'bg-secondary/10' },
  };

  const config = statusConfig[update.status] || { label: update.status, color: 'text-gray-600', bg: 'bg-gray-50' };

  return (
    <div className="rounded-xl overflow-hidden shadow-sm border bg-background max-w-[280px]">
      <div className="bg-purple-600 px-4 py-2 flex items-center gap-2">
        <Truck className="w-4 h-4 text-white" />
        <span className="font-medium text-white text-sm">Delivery Update</span>
      </div>
      
      <div className="p-4 space-y-2">
        <Badge className={cn(config.bg, config.color, "border-0")}>
          {config.label}
        </Badge>

        {update.location && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span>{update.location}</span>
          </div>
        )}

        {update.estimatedDelivery && (
          <p className="text-sm">
            <span className="text-muted-foreground">ETA: </span>
            <span className="font-medium">{format(new Date(update.estimatedDelivery), 'MMM dd, h:mm a')}</span>
          </p>
        )}

        {update.notes && (
          <p className="text-sm text-muted-foreground italic">{update.notes}</p>
        )}
      </div>

      <div className="px-4 pb-2">
        <span className="text-[11px] text-chat-timestamp">
          {format(message.createdAt, 'h:mm a')}
        </span>
      </div>
    </div>
  );
}

function SystemMessage({ message }: { message: Message }) {
  return (
    <div className="flex justify-center my-3 px-4">
      <div className="bg-chat-bubble-system px-4 py-1.5 rounded-lg shadow-sm">
        <p className="text-xs text-muted-foreground text-center">{message.content}</p>
      </div>
    </div>
  );
}

function DocumentMessage({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div className={cn(
      "px-3 py-3 rounded-lg shadow-sm flex items-center gap-3 min-w-[200px]",
      isOwn 
        ? "bg-chat-bubble-sent rounded-tr-none" 
        : "bg-chat-bubble-received rounded-tl-none"
    )}>
      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
        <FileText className="w-5 h-5 text-red-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{message.metadata?.name || 'Document'}</p>
        <p className="text-xs text-muted-foreground">
          {message.metadata?.size ? `${(message.metadata.size / 1024).toFixed(1)} KB` : 'PDF'}
        </p>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[11px] text-chat-timestamp">
          {format(message.createdAt, 'h:mm a')}
        </span>
        {isOwn && statusIcons[message.status]}
      </div>
    </div>
  );
}

function LocationMessage({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div className={cn(
      "rounded-lg overflow-hidden shadow-sm max-w-[240px]",
      isOwn ? "bg-chat-bubble-sent" : "bg-chat-bubble-received"
    )}>
      <div className="h-28 bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center relative">
        <MapPin className="w-8 h-8 text-destructive" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-20" />
      </div>
      <div className="px-3 py-2">
        <p className="text-sm font-medium">{message.metadata?.name || 'Location'}</p>
        <p className="text-xs text-muted-foreground truncate">{message.content}</p>
        <div className="flex items-center gap-1 justify-end mt-1">
          <span className="text-[11px] text-chat-timestamp">
            {format(message.createdAt, 'h:mm a')}
          </span>
          {isOwn && statusIcons[message.status]}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ message, isOwn }: { message: Message; isOwn: boolean }) {
  const product = message.metadata;
  if (!product) return null;

  return (
    <div className={cn(
      "rounded-lg overflow-hidden shadow-sm border max-w-[260px]",
      isOwn ? "bg-chat-bubble-sent" : "bg-chat-bubble-received"
    )}>
      <div className="flex gap-3 p-3">
        <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
          <img 
            src={product.image || '/placeholder.svg'} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{product.name}</h4>
          <p className="text-lg font-bold text-secondary">
            {product.currency} {product.price?.toLocaleString()}/{product.unit}
          </p>
          <p className="text-xs text-muted-foreground">MOQ: {product.minOrder} {product.unit}</p>
        </div>
      </div>
      <div className="px-3 pb-2 flex items-center gap-1 justify-end border-t border-border/50">
        <span className="text-[11px] text-chat-timestamp">
          {format(message.createdAt, 'h:mm a')}
        </span>
        {isOwn && statusIcons[message.status]}
      </div>
    </div>
  );
}