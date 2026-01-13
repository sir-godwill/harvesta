import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingCart,
  Truck,
  CreditCard,
  Users,
  AlertTriangle,
  BarChart3,
  Settings,
  Shield,
  Megaphone,
  ChevronDown,
  Leaf,
  X,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NavItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  module?: string;
  children?: { title: string; href: string; module?: string }[];
}

const navItems: NavItem[] = [
  { title: 'Command Center', icon: LayoutDashboard, href: '/admin', module: 'dashboard' },
  {
    title: 'Sellers', icon: Store, module: 'sellers',
    children: [
      { title: 'All Sellers', href: '/admin/sellers', module: 'sellers' },
      { title: 'Applications', href: '/admin/sellers/applications', module: 'sellers' },
      { title: 'Verification', href: '/admin/sellers/verification', module: 'sellers' },
      { title: 'Commissions', href: '/admin/sellers/commissions', module: 'sellers' },
    ],
  },
  {
    title: 'Products', icon: Package, module: 'products',
    children: [
      { title: 'All Products', href: '/admin/products', module: 'products' },
      { title: 'Pending Review', href: '/admin/products/pending', module: 'products' },
      { title: 'Categories', href: '/admin/products/categories', module: 'products' },
    ],
  },
  {
    title: 'Orders', icon: ShoppingCart, module: 'orders',
    children: [
      { title: 'All Orders', href: '/admin/orders', module: 'orders' },
      { title: 'Pending', href: '/admin/orders/pending', module: 'orders' },
      { title: 'Returns', href: '/admin/orders/returns', module: 'orders' },
    ],
  },
  {
    title: 'Logistics', icon: Truck, module: 'logistics',
    children: [
      { title: 'Shipments', href: '/admin/logistics', module: 'logistics' },
      { title: 'Zones', href: '/admin/logistics/zones', module: 'logistics' },
      { title: 'Carriers', href: '/admin/logistics/carriers', module: 'logistics' },
    ],
  },
  { title: 'Payments', icon: CreditCard, href: '/admin/payments', module: 'payments' },
  { title: 'Buyers', icon: Users, href: '/admin/buyers', module: 'buyers' },
  { title: 'Disputes', icon: AlertTriangle, href: '/admin/disputes', module: 'disputes' },
  { title: 'Analytics', icon: BarChart3, href: '/admin/analytics', module: 'analytics' },
  { title: 'Marketing', icon: Megaphone, href: '/admin/marketing', module: 'marketing' },
  { title: 'Compliance', icon: Shield, href: '/admin/compliance', module: 'compliance' },
  { title: 'Settings', icon: Settings, href: '/admin/settings', module: 'settings' },
];

interface MobileAdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileAdminSidebar({ isOpen, onClose }: MobileAdminSidebarProps) {
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const { hasPermission } = useAdmin();
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActive = (href: string) => location.pathname === href;

  const filteredNavItems = navItems.filter(
    (item) => !item.module || hasPermission(item.module, 'read')
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-foreground/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 z-[101] h-full w-[85vw] max-w-[320px] bg-card shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-border px-4 shrink-0">
              <div className="flex items-center gap-3">
                <motion.div 
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: 'spring' }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary"
                >
                  <Leaf className="h-5 w-5 text-primary-foreground" />
                </motion.div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Harvestá</h1>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Admin</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-9 w-9 text-foreground hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-4">
              <nav className="space-y-1">
                {filteredNavItems.map((item, index) => {
                  if (item.href) {
                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <NavLink
                          to={item.href}
                          className={cn(
                            'flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200',
                            isActive(item.href)
                              ? 'bg-primary text-primary-foreground shadow-lg'
                              : 'text-foreground hover:bg-accent active:scale-[0.98]'
                          )}
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </NavLink>
                      </motion.div>
                    );
                  }

                  const isGroupOpen = openGroups.includes(item.title);

                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <button
                        onClick={() => toggleGroup(item.title)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200',
                          'text-foreground hover:bg-accent active:scale-[0.98]'
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="flex-1 text-left">{item.title}</span>
                        <motion.div
                          animate={{ rotate: isGroupOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {isGroupOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-4 space-y-1 border-l-2 border-border pl-4 pt-2 pb-1">
                              {item.children?.map((child) => (
                                <NavLink
                                  key={child.href}
                                  to={child.href}
                                  className={cn(
                                    'block rounded-lg px-3 py-2.5 text-sm transition-all duration-200',
                                    isActive(child.href)
                                      ? 'bg-primary/20 font-medium text-primary'
                                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                                  )}
                                >
                                  {child.title}
                                </NavLink>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </nav>
            </ScrollArea>

            {/* Region Selector */}
            <div className="border-t border-border p-4 shrink-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <Globe className="h-3.5 w-3.5" />
                <span>Active Region</span>
              </div>
              <select className="w-full rounded-lg border-0 bg-accent px-3 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ring">
                <option value="all">All Regions</option>
                <option value="africa">Africa</option>
                <option value="europe">Europe</option>
                <option value="asia">Asia</option>
                <option value="americas">Americas</option>
              </select>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
