import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  Truck,
  Package,
  MapPin,
  AlertTriangle,
  Users,
  FileText,
  Calculator,
  RotateCcw,
  Settings,
  ChevronLeft,
  Menu,
  Bell,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/logistics' },
  { icon: Package, label: 'All Shipments', path: '/logistics/shipments' },
  { icon: MapPin, label: 'Live Tracking', path: '/logistics/tracking' },
  { icon: AlertTriangle, label: 'Alerts', path: '/logistics/alerts' },
  { icon: Users, label: 'Partners', path: '/logistics/partners' },
  { icon: FileText, label: 'Disputes', path: '/logistics/disputes' },
  { icon: RotateCcw, label: 'Returns', path: '/logistics/returns' },
  { icon: Calculator, label: 'Cost Calculator', path: '/logistics/calculator' },
  { icon: FileText, label: 'Reports', path: '/logistics/reports' },
  { icon: Settings, label: 'Settings', path: '/logistics/settings' },
];

interface LogisticsSidebarProps {
  onNavigate?: () => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

function LogisticsSidebar({ onNavigate, collapsed = false, onCollapsedChange }: LogisticsSidebarProps) {
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
          to="/logistics" 
          className="flex items-center gap-2 overflow-hidden" 
          onClick={onNavigate}
        >
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
            <Truck className="w-6 h-6 text-secondary-foreground" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-lg text-foreground whitespace-nowrap overflow-hidden"
              >
                Logistics Hub
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
              (item.path !== '/logistics' && location.pathname.startsWith(item.path));

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
                      layoutId="logisticsActiveIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-secondary rounded-r-full"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon
                    className={cn(
                      'w-5 h-5 flex-shrink-0 transition-colors',
                      isActive ? 'text-secondary' : 'text-sidebar-foreground group-hover:text-secondary'
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

      {/* Stats Card */}
      <div className="p-3 border-t border-sidebar-border">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-sidebar-accent/50 rounded-lg p-3"
            >
              <p className="text-xs text-muted-foreground mb-2">Active Shipments</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-foreground">156</span>
                <div className="flex items-center text-xs text-emerald-500">
                  <span>+12</span>
                  <span className="ml-1">today</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  '/logistics': { title: 'Logistics Control Center', subtitle: 'Real-time overview of all operations' },
  '/logistics/shipments': { title: 'All Shipments', subtitle: 'Manage and track all shipments' },
  '/logistics/tracking': { title: 'Live Tracking', subtitle: 'Real-time shipment locations' },
  '/logistics/alerts': { title: 'Alerts', subtitle: 'Delayed and urgent shipments' },
  '/logistics/partners': { title: 'Partners', subtitle: 'Manage logistics partners' },
  '/logistics/disputes': { title: 'Disputes', subtitle: 'Handle delivery disputes' },
  '/logistics/returns': { title: 'Returns', subtitle: 'Process returns and refunds' },
  '/logistics/calculator': { title: 'Cost Calculator', subtitle: 'Estimate delivery costs' },
  '/logistics/reports': { title: 'Reports', subtitle: 'Analytics and reports' },
  '/logistics/settings': { title: 'Settings', subtitle: 'Logistics settings' },
};

export function LogisticsLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentPage = pageTitles[location.pathname] || { title: 'Logistics' };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 z-40">
        <LogisticsSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
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
              <LogisticsSidebar onNavigate={() => setMobileOpen(false)} />
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
