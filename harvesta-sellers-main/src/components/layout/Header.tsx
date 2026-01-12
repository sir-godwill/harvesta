import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Search, MessageSquare, Plus, X, ChevronDown, Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'rfq' | 'stock' | 'delivery' | 'payment' | 'system';
  time: string;
  read: boolean;
  link?: string;
}

const mockNotifications: Notification[] = [
  { id: '1', title: 'New Order', message: 'ORD-2026-001 from Douala Fresh Markets', type: 'order', time: '5 min ago', read: false, link: '/dashboard/orders' },
  { id: '2', title: 'Quote Request', message: 'Nestlé Cameroon requests 10,000 kg of cocoa', type: 'rfq', time: '1 hour ago', read: false, link: '/dashboard/rfq' },
  { id: '3', title: 'Low Stock', message: 'Robusta Coffee - 45 kg remaining', type: 'stock', time: '2 hours ago', read: false, link: '/dashboard/products' },
  { id: '4', title: 'Delivery Delayed', message: 'DEL-2026-004 to Maroua', type: 'delivery', time: '3 hours ago', read: true, link: '/dashboard/deliveries' },
  { id: '5', title: 'Payment Received', message: '175,000 XAF from Yaoundé Supermarket', type: 'payment', time: 'Yesterday', read: true, link: '/dashboard/finance' },
];

const typeStyles = {
  order: 'bg-accent/10 text-accent',
  rfq: 'bg-primary/10 text-primary',
  stock: 'bg-warning/10 text-warning',
  delivery: 'bg-destructive/10 text-destructive',
  payment: 'bg-success/10 text-success',
  system: 'bg-muted text-muted-foreground',
};

export function Header({ title, subtitle }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState<Notification[]>(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-30 h-14 md:h-16 bg-card/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 md:px-6"
      >
        <div className="min-w-0 flex-1">
          <h1 className="text-lg md:text-xl font-semibold text-foreground truncate">{title}</h1>
          {subtitle && <p className="text-xs md:text-sm text-muted-foreground truncate hidden sm:block">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
          {/* Global Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products, orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-72 pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* Mobile Search Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden h-9 w-9"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="w-5 h-5 text-muted-foreground" />
          </Button>

          {/* Quick Add */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm" className="gap-1.5 md:gap-2 bg-accent hover:bg-accent/90 text-accent-foreground h-9 px-2.5 md:px-3">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
                <ChevronDown className="w-3 h-3 hidden sm:inline" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/dashboard/products" className="cursor-pointer">New Product</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/orders" className="cursor-pointer">New Order</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/deliveries" className="cursor-pointer">Schedule Delivery</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="outline" className="text-xs">{unreadCount} new</Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[300px]">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} asChild>
                    <Link 
                      to={notification.link || '#'} 
                      className={cn(
                        "flex items-start gap-3 p-3 cursor-pointer",
                        !notification.read && "bg-muted/50"
                      )}
                    >
                      <div className={cn("p-2 rounded-lg shrink-0", typeStyles[notification.type])}>
                        <Bell className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm", !notification.read && "font-medium")}>{notification.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-2" />
                      )}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="justify-center">
                <Link to="/dashboard/messages" className="cursor-pointer text-primary text-sm font-medium">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Messages */}
          <Link to="/dashboard/messages" className="relative p-2 rounded-lg hover:bg-muted transition-colors hidden sm:block">
            <MessageSquare className="w-5 h-5 text-muted-foreground" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs">
              3
            </Badge>
          </Link>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">JP</span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">Jean-Pierre Mbarga</p>
                  <p className="text-xs text-muted-foreground">Mbarga Agro Farms</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard/profile" className="cursor-pointer gap-2">
                  <User className="w-4 h-4" /> My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings" className="cursor-pointer gap-2">
                  <Settings className="w-4 h-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-destructive">
                <LogOut className="w-4 h-4" /> Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.header>

      {/* Mobile Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products, orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
          {searchQuery && (
            <div className="py-4 text-center text-sm text-muted-foreground">
              Press Enter to search for "{searchQuery}"
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
