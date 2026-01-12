import { useState } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  MoreVertical, 
  Search, 
  Pin, 
  Archive, 
  AlertTriangle, 
  Shield, 
  VolumeX, 
  Trash2, 
  BadgeCheck,
  Info,
  Ban,
  Flag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Conversation, UserRole } from '@/lib/chat-api';
import { formatDistanceToNow } from 'date-fns';
import { SellerProfileModal } from './SellerProfileModal';
import { useToast } from '@/hooks/use-toast';

interface ChatHeaderProps {
  conversation: Conversation;
  onBack: () => void;
  onToggleContext: () => void;
  isAdmin?: boolean;
  userType?: 'buyer' | 'seller';
}

const roleColors: Record<UserRole, string> = {
  buyer: 'bg-role-buyer',
  seller: 'bg-primary',
  logistics: 'bg-role-logistics',
  admin: 'bg-role-admin',
  system: 'bg-role-system',
};

export function ChatHeader({ conversation, onBack, onToggleContext, isAdmin, userType = 'buyer' }: ChatHeaderProps) {
  const [showProfile, setShowProfile] = useState(false);
  const { toast } = useToast();
  
  const otherParticipants = conversation.participants.filter(p => p.id !== 'current-user');
  const mainParticipant = otherParticipants[0];
  const title = conversation.title || otherParticipants.map(p => p.name).join(', ');
  const isOnline = mainParticipant?.isOnline;
  const role = mainParticipant?.role || 'seller';
  const isVerified = mainParticipant?.isVerified;

  const getSubtitle = () => {
    if (isOnline) return 'Online';
    if (mainParticipant?.lastSeen) {
      return `Last seen ${formatDistanceToNow(mainParticipant.lastSeen, { addSuffix: true })}`;
    }
    return 'Offline';
  };

  const handleAvatarClick = () => {
    if (mainParticipant) {
      setShowProfile(true);
    }
  };

  const handleCall = (type: 'voice' | 'video') => {
    toast({
      title: `Starting ${type} call...`,
      description: `Calling ${title}`,
    });
  };

  const handleAction = (action: string) => {
    toast({
      title: action,
      description: `Action performed on ${title}`,
    });
  };

  return (
    <>
      <div className="bg-background px-2 py-2.5 flex items-center gap-2 border-b shadow-sm relative">
        {/* Back button (mobile) */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-foreground hover:bg-accent flex-shrink-0 rounded-full"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Avatar - Clickable to open profile */}
        <button 
          className="relative flex-shrink-0 focus:outline-none active:scale-95 transition-transform"
          onClick={handleAvatarClick}
        >
          <div className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md",
            roleColors[role]
          )}>
            {title.charAt(0).toUpperCase()}
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-chat-online rounded-full border-2 border-background" />
          )}
        </button>

        {/* Title & Status */}
        <button 
          className="flex-1 min-w-0 text-left py-1"
          onClick={handleAvatarClick}
        >
          <div className="flex items-center gap-1.5">
            <h2 className="font-semibold text-foreground truncate text-base">{title}</h2>
            {isVerified && (
              <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
            )}
          </div>
          <p className={cn(
            "text-xs",
            isOnline ? "text-chat-online font-medium" : "text-muted-foreground"
          )}>
            {getSubtitle()}
          </p>
        </button>

        {/* Actions */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
            onClick={() => handleCall('video')}
          >
            <Video className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
            onClick={() => handleCall('voice')}
          >
            <Phone className="w-5 h-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-full"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleAvatarClick}>
                <Info className="w-4 h-4 mr-2" />
                View {userType === 'buyer' ? 'Seller' : 'Buyer'} Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('Search opened')}>
                <Search className="w-4 h-4 mr-2" />
                Search in Chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleContext}>
                <Shield className="w-4 h-4 mr-2" />
                View Order/Product Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleAction('Notifications muted')}>
                <VolumeX className="w-4 h-4 mr-2" />
                {conversation.isMuted ? 'Unmute Notifications' : 'Mute Notifications'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('Chat pinned')}>
                <Pin className="w-4 h-4 mr-2" />
                {conversation.isPinned ? 'Unpin Chat' : 'Pin Chat'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('Chat archived')}>
                <Archive className="w-4 h-4 mr-2" />
                Archive Chat
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => handleAction('User blocked')}
              >
                <Ban className="w-4 h-4 mr-2" />
                Block User
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => handleAction('User reported')}
              >
                <Flag className="w-4 h-4 mr-2" />
                Report User
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => handleAction('Chat deleted')}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Chat
              </DropdownMenuItem>

              {/* Admin Options */}
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleAction('Chat frozen')}>
                    <Shield className="w-4 h-4 mr-2" />
                    {conversation.isFrozen ? 'Unfreeze Chat' : 'Freeze Chat'}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Frozen Indicator */}
        {conversation.isFrozen && (
          <div className="absolute -bottom-7 left-0 right-0 bg-destructive text-destructive-foreground text-xs text-center py-1.5 z-10 flex items-center justify-center gap-2">
            <AlertTriangle className="w-3 h-3" />
            This conversation has been frozen by an administrator
          </div>
        )}
      </div>

      {/* Seller Profile Modal */}
      <SellerProfileModal
        sellerId={mainParticipant?.id || ''}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        isBuyer={userType === 'buyer'}
      />
    </>
  );
}
