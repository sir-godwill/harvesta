import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Bell,
  Search,
  Store,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { mockSellerProfile } from '@/services/seller-api';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/seller', icon: LayoutDashboard },
  { 
    title: 'Products', 
    href: '/seller/products', 
    icon: Package,
    children: [
      { title: 'All Products', href: '/seller/products' },
      { title: 'Add Product', href: '/seller/products/add' },
      { title: 'Categories', href: '/seller/products/categories' },
      { title: 'Inventory', href: '/seller/products/inventory' },
    ],
  },
  { 
    title: 'Orders', 
    href: '/seller/orders', 
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
    href: '/seller/logistics', 
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
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === '/seller') return location.pathname === '/seller';
    return location.pathname.startsWith(href);
  };

  const toggleExpand = (title: string) => {
    setExpandedItem(expandedItem === title ? null : title);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-background to-emerald-50/30">
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

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-green-100 transform transition-transform duration-200 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-green-100">
          <Link to="/seller" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-green-800">Seller Hub</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-green-100 text-green-800'
                        : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
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
                        expandedItem === item.title && 'rotate-180'
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedItem === item.title && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-8 py-1 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              className={cn(
                                'block px-3 py-2 rounded-lg text-sm transition-colors',
                                location.pathname === child.href
                                  ? 'bg-green-100 text-green-800 font-medium'
                                  : 'text-gray-500 hover:bg-green-50 hover:text-green-700'
                              )}
                              onClick={() => setSidebarOpen(false)}
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
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
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-green-100 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products, orders..."
                className="pl-9 w-64 bg-green-50/50 border-green-100 focus:border-green-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={mockSellerProfile.logoUrl} />
                    <AvatarFallback className="bg-green-100 text-green-700">
                      {mockSellerProfile.companyName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">
                    {mockSellerProfile.companyName}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/seller/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/profile">
                    <Store className="w-4 h-4 mr-2" />
                    View Store
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
