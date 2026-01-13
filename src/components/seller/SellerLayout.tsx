import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Truck,
  MessageSquare,
  FileText,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Bell,
  Search,
  Store,
  LogOut,
  User,
  Leaf,
  Moon,
  Sun,
  Globe,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import '@/styles/dashboard-theme.css';

interface NavItem {
  title: string;
  href?: string;
  icon: React.ElementType;
  badge?: number;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/seller', icon: LayoutDashboard },
  { 
    title: 'Products', 
    icon: Package,
    children: [
      { title: 'All Products', href: '/seller/products' },
      { title: 'Add Product', href: '/seller/products/add' },
      { title: 'Inventory', href: '/seller/products/inventory' },
    ],
  },
  { 
    title: 'Orders', 
    icon: ShoppingCart,
    badge: 5,
    children: [
      { title: 'All Orders', href: '/seller/orders' },
      { title: 'Pending', href: '/seller/orders/pending' },
      { title: 'Processing', href: '/seller/orders/processing' },
      { title: 'Completed', href: '/seller/orders/completed' },
    ],
  },
  { title: 'Analytics', href: '/seller/analytics', icon: BarChart3 },
  { 
    title: 'Logistics', 
    icon: Truck,
    children: [
      { title: 'Shipments', href: '/seller/logistics' },
      { title: 'Carriers', href: '/seller/logistics/carriers' },
      { title: 'Tracking', href: '/seller/logistics/tracking' },
    ],
  },
  { title: 'Messages', href: '/seller/messages', icon: MessageSquare, badge: 3 },
  { title: 'RFQs', href: '/seller/rfqs', icon: FileText, badge: 2 },
  { title: 'Settings', href: '/seller/settings', icon: Settings },
];

interface SellerLayoutProps {
  children: React.ReactNode;
}

export function SellerLayout({ children }: SellerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(['Products']);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === '/seller') return location.pathname === '/seller';
    return location.pathname.startsWith(href);
  };

  const isGroupActive = (item: NavItem) =>
    item.children?.some((child) => location.pathname === child.href || location.pathname.startsWith(child.href));

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const notifications = [
    { id: 1, title: 'New order received', time: '2 min ago', unread: true },
    { id: 2, title: 'Product approved', time: '15 min ago', unread: true },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="dashboard-theme min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Forest Theme */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-sidebar transition-all duration-300',
          'hidden lg:block',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo Header */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!isCollapsed && (
            <Link to="/seller" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
                <Leaf className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-sidebar-foreground">
                  Harvestá
                </h1>
                <p className="text-[10px] uppercase tracking-wider text-sidebar-muted">
                  Seller Hub
                </p>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
              <Leaf className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent',
              isCollapsed && 'absolute -right-3 top-4 z-50 rounded-full bg-sidebar-accent shadow-md'
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <nav className="space-y-1 p-2">
            {navItems.map((item) => {
              if (item.href && !item.children) {
                // Direct link
                return isCollapsed ? (
                  <Tooltip key={item.title} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <NavLink
                        to={item.href}
                        className={cn(
                          'nav-item justify-center',
                          isActive(item.href)
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent'
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.badge && !isCollapsed && (
                          <Badge variant="destructive" className="h-5 min-w-[20px] text-xs ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                ) : (
                  <NavLink
                    key={item.title}
                    to={item.href}
                    className={cn(
                      'nav-item',
                      isActive(item.href)
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="h-5 min-w-[20px] text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </NavLink>
                );
              }

              // Collapsible group
              const isOpen = openGroups.includes(item.title);
              const groupActive = isGroupActive(item);

              return isCollapsed ? (
                <Tooltip key={item.title} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <button
                      className={cn(
                        'nav-item w-full justify-center',
                        groupActive
                          ? 'bg-sidebar-accent text-sidebar-primary'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="flex flex-col gap-1 p-2">
                    <span className="font-medium">{item.title}</span>
                    {item.children?.map((child) => (
                      <NavLink
                        key={child.href}
                        to={child.href}
                        className={cn(
                          'rounded px-2 py-1 text-sm hover:bg-accent',
                          isActive(child.href) && 'bg-accent font-medium'
                        )}
                      >
                        {child.title}
                      </NavLink>
                    ))}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Collapsible
                  key={item.title}
                  open={isOpen}
                  onOpenChange={() => toggleGroup(item.title)}
                >
                  <CollapsibleTrigger
                    className={cn(
                      'nav-item w-full',
                      groupActive
                        ? 'bg-sidebar-accent text-sidebar-primary'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="flex-1 text-left">{item.title}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="h-5 min-w-[20px] text-xs mr-2">
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-4 space-y-1 pt-1">
                    {item.children?.map((child) => (
                      <NavLink
                        key={child.href}
                        to={child.href}
                        className={cn(
                          'nav-item pl-6',
                          isActive(child.href)
                            ? 'bg-sidebar-primary/20 text-sidebar-primary'
                            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                        )}
                      >
                        <span>{child.title}</span>
                      </NavLink>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </nav>

          {/* Region Selector */}
          {!isCollapsed && (
            <div className="mx-3 mt-4 rounded-lg border border-sidebar-border bg-sidebar-accent/50 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs text-sidebar-foreground/70">
                <Globe className="h-3.5 w-3.5" />
                <span>Active Region</span>
              </div>
              <select className="w-full rounded-md border-0 bg-sidebar-accent px-2 py-1.5 text-sm text-sidebar-foreground focus:ring-1 focus:ring-sidebar-ring">
                <option value="cameroon">Cameroon</option>
                <option value="nigeria">Nigeria</option>
                <option value="ghana">Ghana</option>
                <option value="africa">All Africa</option>
              </select>
            </div>
          )}
        </ScrollArea>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-sidebar transform transition-transform duration-200 lg:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link to="/seller" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">Seller Hub</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <Collapsible
                  open={openGroups.includes(item.title)}
                  onOpenChange={() => toggleGroup(item.title)}
                >
                  <CollapsibleTrigger
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isGroupActive(item)
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {item.title}
                      {item.badge && (
                        <Badge variant="destructive" className="h-5 min-w-[20px] text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform',
                        openGroups.includes(item.title) && 'rotate-180'
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-8 py-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className={cn(
                          'block px-3 py-2 rounded-lg text-sm transition-colors',
                          location.pathname === child.href
                            ? 'bg-sidebar-primary/20 text-sidebar-primary font-medium'
                            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent'
                        )}
                        onClick={() => setSidebarOpen(false)}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  to={item.href!}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive(item.href!)
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.title}
                  {item.badge && (
                    <Badge variant="destructive" className="h-5 min-w-[20px] text-xs ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={cn('transition-all duration-300', isCollapsed ? 'lg:pl-16' : 'lg:pl-64')}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between border-b bg-background/95 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden -ml-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative hidden md:block w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search products, orders..." className="pl-9 bg-muted/50 border-0" />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
              <Search className="h-5 w-5" />
            </Button>
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
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      SF
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">Seller Farm</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
                <DropdownMenuItem><Store className="mr-2 h-4 w-4" /> View Store</DropdownMenuItem>
                <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
                <DropdownMenuItem><HelpCircle className="mr-2 h-4 w-4" /> Help Center</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive"><LogOut className="mr-2 h-4 w-4" /> Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
