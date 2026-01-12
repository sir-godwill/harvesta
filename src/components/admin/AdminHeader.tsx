import { useState } from 'react';
import { Bell, Search, Moon, Sun, User, LogOut, Settings, ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/contexts/AdminContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const { admin } = useAdmin();
  const isMobile = useIsMobile();
  const [notifications] = useState([
    { id: 1, title: 'New seller registration', time: '2 min ago', unread: true },
    { id: 2, title: 'Order dispute escalated', time: '15 min ago', unread: true },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between border-b bg-background/95 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="-ml-2">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        {!isMobile && (
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 bg-muted/50 border-0" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {isMobile && (
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Search className="h-5 w-5" />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground">
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-[10px]">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 sm:w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem key={n.id} className={cn('flex flex-col items-start gap-1 p-3', n.unread && 'bg-muted/50')}>
                <span className="font-medium text-sm">{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2 pr-2 sm:pr-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={admin?.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {admin?.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              {!isMobile && (
                <>
                  <span className="text-sm font-medium">{admin?.name || 'Admin'}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
            <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive"><LogOut className="mr-2 h-4 w-4" /> Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
