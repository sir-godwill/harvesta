import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NotificationBellProps {
  count: number;
  onClick?: () => void;
}

export function NotificationBell({ count, onClick }: NotificationBellProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className="relative w-14 h-14 rounded-full bg-primary shadow-lg hover:bg-primary/90"
    >
      <Bell className="w-6 h-6 text-primary-foreground" />
      {count > 0 && (
        <Badge 
          className="absolute -top-1 -right-1 min-w-[22px] h-[22px] p-0 flex items-center justify-center bg-secondary text-secondary-foreground text-xs font-bold"
        >
          {count > 99 ? '99+' : count}
        </Badge>
      )}
    </Button>
  );
}
