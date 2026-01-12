import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  FileText,
  Wallet,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  Leaf,
  User,
  Menu,
  Bell,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/seller' },
  { icon: Package, label: 'Products', path: '/seller/products' },
  { icon: ShoppingCart, label: 'Orders', path: '/seller/orders' },
  { icon: Truck, label: 'Deliveries', path: '/seller/deliveries' },
  { icon: FileText, label: 'RFQ Inbox', path: '/seller/rfq' },
  { icon: Wallet, label: 'Finance', path: '/seller/finance' },
  { icon: MessageSquare, label: 'Messages', path: '/seller/messages' },
  { icon: BarChart3, label: 'Analytics', path: '/seller/analytics' },
  { icon: User, label: 'Profile', path: '/seller/profile' },
  { icon: Settings, label: 'Settings', path: '/seller/settings' },
];

interface SellerSidebarProps {
  onNavigate?: () => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

function SellerSidebar({ onNavigate, collapsed = false, onCollapsedChange }: SellerSidebarProps) {
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <Link 
          to="/seller" 
          className="flex items-center gap-2 overflow-hidden" 
          onClick={onNavigate}
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-xl text-primary whitespace-nowrap overflow-hidden"
              >
                Harvestá
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        {onCollapsedChange && (
          <button
            onClick={() => onCollapsedChange(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors hidden lg:block"
          >
            <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronLeft className="w-5 h-5 text-sidebar-foreground" />
            </motion.div>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = 
              location.pathname === item.path ||
              (item.path !== '/seller' && location.pathname.startsWith(item.path));

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sellerActiveIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon
                    className={cn(
                      'w-5 h-5 flex-shrink-0 transition-colors',
                      isActive ? 'text-primary' : 'text-sidebar-foreground group-hover:text-primary'
                    )}
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={cn(
          'flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/50',
          collapsed && 'justify-center'
        )}>
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-primary">KA</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-medium text-foreground whitespace-nowrap">Kwame Asante</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">Golden Harvest</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
}

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  '/seller': { title: 'Dashboard', subtitle: 'Overview of your business' },
  '/seller/products': { title: 'Products', subtitle: 'Manage your inventory' },
  '/seller/orders': { title: 'Orders', subtitle: 'Track and manage orders' },
  '/seller/deliveries': { title: 'Deliveries', subtitle: 'Manage shipments' },
  '/seller/rfq': { title: 'RFQ Inbox', subtitle: 'Quote requests from buyers' },
  '/seller/finance': { title: 'Finance', subtitle: 'Earnings & withdrawals' },
  '/seller/messages': { title: 'Messages', subtitle: 'Buyer conversations' },
  '/seller/analytics': { title: 'Analytics', subtitle: 'Business insights' },
  '/seller/profile': { title: 'Profile', subtitle: 'Your seller profile' },
  '/seller/settings': { title: 'Settings', subtitle: 'Account settings' },
};

export function SellerLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentPage = pageTitles[location.pathname] || { title: 'Dashboard' };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 z-40">
        <SellerSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-card/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px]">
              <SellerSidebar onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-foreground truncate">{currentPage.title}</h1>
            {currentPage.subtitle && (
              <p className="text-xs text-muted-foreground truncate">{currentPage.subtitle}</p>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content */}
      <main 
        className={cn(
          'transition-all duration-300 pt-14 lg:pt-0',
          collapsed ? 'lg:ml-20' : 'lg:ml-[260px]'
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
