import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  Globe,
  ChevronDown,
  ChevronRight,
  Leaf,
  Menu,
  MessageSquare,
  Share2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
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

interface NavItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  module?: string;
  children?: { title: string; href: string; module?: string }[];
}

const navItems: NavItem[] = [
  {
    title: 'Command Center',
    icon: LayoutDashboard,
    href: '/admin',
    module: 'dashboard',
  },
  {
    title: 'Sellers',
    icon: Store,
    module: 'sellers',
    children: [
      { title: 'All Sellers', href: '/admin/sellers', module: 'sellers' },
      { title: 'Applications', href: '/admin/sellers/applications', module: 'sellers' },
      { title: 'Verification', href: '/admin/sellers/verification', module: 'sellers' },
      { title: 'Commissions', href: '/admin/sellers/commissions', module: 'sellers' },
    ],
  },
  {
    title: 'Products',
    icon: Package,
    module: 'products',
    children: [
      { title: 'All Products', href: '/admin/products', module: 'products' },
      { title: 'Pending Review', href: '/admin/products/pending', module: 'products' },
      { title: 'Categories', href: '/admin/products/categories', module: 'products' },
      { title: 'Quality Grades', href: '/admin/products/grades', module: 'products' },
    ],
  },
  {
    title: 'Orders',
    icon: ShoppingCart,
    module: 'orders',
    children: [
      { title: 'All Orders', href: '/admin/orders', module: 'orders' },
      { title: 'Pending', href: '/admin/orders/pending', module: 'orders' },
      { title: 'Returns & Refunds', href: '/admin/orders/returns', module: 'orders' },
    ],
  },
  {
    title: 'Logistics',
    icon: Truck,
    module: 'logistics',
    children: [
      { title: 'Shipments', href: '/admin/logistics', module: 'logistics' },
      { title: 'Delivery Zones', href: '/admin/logistics/zones', module: 'logistics' },
      { title: 'Carriers', href: '/admin/logistics/carriers', module: 'logistics' },
      { title: 'Exceptions', href: '/admin/logistics/exceptions', module: 'logistics' },
    ],
  },
  {
    title: 'Payments',
    icon: CreditCard,
    module: 'payments',
    children: [
      { title: 'Transactions', href: '/admin/payments', module: 'payments' },
      { title: 'Escrow', href: '/admin/payments/escrow', module: 'payments' },
      { title: 'Payouts', href: '/admin/payments/payouts', module: 'payments' },
    ],
  },
  {
    title: 'Buyers',
    icon: Users,
    module: 'buyers',
    children: [
      { title: 'All Buyers', href: '/admin/buyers', module: 'buyers' },
      { title: 'Support Tickets', href: '/admin/buyers/tickets', module: 'buyers' },
    ],
  },
  {
    title: 'Messages',
    icon: MessageSquare,
    href: '/admin/messages',
    module: 'messages',
  },
  {
    title: 'Disputes',
    icon: AlertTriangle,
    module: 'disputes',
    children: [
      { title: 'All Disputes', href: '/admin/disputes', module: 'disputes' },
      { title: 'Escalated', href: '/admin/disputes/escalated', module: 'disputes' },
    ],
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    module: 'analytics',
    children: [
      { title: 'Overview', href: '/admin/analytics', module: 'analytics' },
      { title: 'Sales Reports', href: '/admin/analytics/sales', module: 'analytics' },
      { title: 'Regional', href: '/admin/analytics/regional', module: 'analytics' },
      { title: 'AI Insights', href: '/admin/analytics/ai', module: 'analytics' },
    ],
  },
  {
    title: 'Marketing',
    icon: Megaphone,
    module: 'marketing',
    children: [
      { title: 'Campaigns', href: '/admin/marketing', module: 'marketing' },
      { title: 'Coupons', href: '/admin/marketing/coupons', module: 'marketing' },
      { title: 'Featured', href: '/admin/marketing/featured', module: 'marketing' },
    ],
  },
  {
    title: 'Referrals',
    icon: Share2,
    href: '/admin/referrals',
    module: 'referrals',
  },
  {
    title: 'Compliance',
    icon: Shield,
    module: 'compliance',
    children: [
      { title: 'Trust Scores', href: '/admin/compliance', module: 'compliance' },
      { title: 'Legal', href: '/admin/compliance/legal', module: 'compliance' },
      { title: 'Audit Logs', href: '/admin/compliance/audit', module: 'compliance' },
    ],
  },
  {
    title: 'Settings',
    icon: Settings,
    module: 'settings',
    children: [
      { title: 'General', href: '/admin/settings', module: 'settings' },
      { title: 'Team', href: '/admin/settings/team', module: 'settings' },
      { title: 'Roles', href: '/admin/settings/roles', module: 'settings' },
      { title: 'Integrations', href: '/admin/settings/integrations', module: 'settings' },
    ],
  },
];

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<string[]>(['Command Center']);
  const { hasPermission } = useAdmin();
  const location = useLocation();

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isActive = (href: string) => location.pathname === href;
  const isGroupActive = (item: NavItem) =>
    item.children?.some((child) => location.pathname === child.href);

  const filteredNavItems = navItems.filter(
    (item) => !item.module || hasPermission(item.module, 'read')
  );

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-card border-r transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">
                Harvestá
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Admin Dashboard
              </p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-8 w-8',
            isCollapsed && 'absolute -right-3 top-4 z-50 rounded-full bg-card shadow-md border'
          )}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <nav className="space-y-1 p-2">
          {filteredNavItems.map((item) => {
            if (item.href) {
              return isCollapsed ? (
                <Tooltip key={item.title} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.href}
                      className={cn(
                        'flex items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive(item.href)
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              ) : (
                <NavLink
                  key={item.title}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </NavLink>
              );
            }

            const isOpen = openGroups.includes(item.title);
            const groupActive = isGroupActive(item);

            return isCollapsed ? (
              <Tooltip key={item.title} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      'flex items-center justify-center w-full gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      groupActive
                        ? 'bg-accent text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
                    'flex items-center w-full gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    groupActive
                      ? 'bg-accent text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1 text-left">{item.title}</span>
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
                        'flex items-center gap-3 rounded-lg px-3 py-2 pl-6 text-sm transition-colors',
                        isActive(child.href)
                          ? 'bg-primary/20 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
          <div className="mx-3 mt-4 rounded-lg border bg-muted/50 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              <span>Active Region</span>
            </div>
            <select className="w-full rounded-md border bg-background px-2 py-1.5 text-sm focus:ring-1 focus:ring-ring">
              <option value="all">All Regions</option>
              <option value="africa">Africa</option>
              <option value="europe">Europe</option>
              <option value="asia">Asia</option>
              <option value="americas">Americas</option>
            </select>
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
