import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  Link2,
  Users,
  Wallet,
  Gift,
  TrendingUp,
  Bell,
  Settings,
  ChevronLeft,
  Menu,
  Store,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/affiliate' },
  { icon: Link2, label: 'Referral Links', path: '/affiliate/links' },
  { icon: Store, label: 'Seller Onboarding', path: '/affiliate/sellers' },
  { icon: Wallet, label: 'Commissions', path: '/affiliate/commissions' },
  { icon: Gift, label: 'Campaigns', path: '/affiliate/campaigns' },
  { icon: TrendingUp, label: 'Analytics', path: '/affiliate/analytics' },
  { icon: Wallet, label: 'Payouts', path: '/affiliate/payouts' },
  { icon: Bell, label: 'Notifications', path: '/affiliate/notifications' },
  { icon: Settings, label: 'Settings', path: '/affiliate/settings' },
];

interface ReferralSidebarProps {
  onNavigate?: () => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

function ReferralSidebar({ onNavigate, collapsed = false, onCollapsedChange }: ReferralSidebarProps) {
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <Link 
          to="/affiliate" 
          className="flex items-center gap-2 overflow-hidden" 
          onClick={onNavigate}
        >
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-lg">H</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <span className="font-bold text-foreground whitespace-nowrap">Harvestá</span>
                <p className="text-xs text-muted-foreground whitespace-nowrap">Agent Portal</p>
              </motion.div>
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

      {/* Agent Info Card */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4"
          >
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-3 border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-semibold text-primary">AK</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">Amara Kofi</p>
                  <p className="text-xs text-muted-foreground">Gold Agent</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 py-2 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = 
              location.pathname === item.path ||
              (item.path !== '/affiliate' && location.pathname.startsWith(item.path));

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                    isActive
                      ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
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
                  {item.label === 'Notifications' && !collapsed && (
                    <span className="ml-auto bg-accent text-accent-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                      3
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Earnings Card */}
      <div className="p-3 border-t border-sidebar-border">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-lg p-3 border border-emerald-500/20"
            >
              <p className="text-xs text-muted-foreground mb-1">Total Earnings</p>
              <p className="text-xl font-bold text-emerald-600">2,850,000 XAF</p>
              <p className="text-xs text-emerald-500 mt-1">+575K this month</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  '/affiliate': { title: 'Agent Dashboard', subtitle: 'Track your referrals and earnings' },
  '/affiliate/links': { title: 'Referral Links', subtitle: 'Manage your referral links' },
  '/affiliate/sellers': { title: 'Seller Onboarding', subtitle: 'Track seller sign-ups' },
  '/affiliate/commissions': { title: 'Commissions', subtitle: 'Your earned commissions' },
  '/affiliate/campaigns': { title: 'Campaigns', subtitle: 'Active marketing campaigns' },
  '/affiliate/analytics': { title: 'Analytics', subtitle: 'Performance insights' },
  '/affiliate/payouts': { title: 'Payouts', subtitle: 'Withdrawal history' },
  '/affiliate/notifications': { title: 'Notifications', subtitle: 'Updates and alerts' },
  '/affiliate/settings': { title: 'Settings', subtitle: 'Account preferences' },
};

export function ReferralLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentPage = pageTitles[location.pathname] || { title: 'Affiliate' };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 z-40">
        <ReferralSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
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
              <ReferralSidebar onNavigate={() => setMobileOpen(false)} />
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
          collapsed ? 'lg:ml-20' : 'lg:ml-[280px]'
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}
