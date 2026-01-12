import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
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
  Search,
  Plus,
  FileText,
  Bell,
  Moon,
  Sun,
  LogOut,
} from 'lucide-react';

interface CommandPaletteProps {
  onAddSeller?: () => void;
  onAddProduct?: () => void;
  onAddOrder?: () => void;
}

export function CommandPalette({ onAddSeller, onAddProduct, onAddOrder }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const navigationItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Store, label: 'Sellers', href: '/sellers' },
    { icon: Package, label: 'Products', href: '/products' },
    { icon: ShoppingCart, label: 'Orders', href: '/orders' },
    { icon: Truck, label: 'Logistics', href: '/logistics' },
    { icon: CreditCard, label: 'Payments', href: '/payments' },
    { icon: Users, label: 'Buyers', href: '/buyers' },
    { icon: AlertTriangle, label: 'Disputes', href: '/disputes' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: Megaphone, label: 'Marketing', href: '/marketing' },
    { icon: Shield, label: 'Compliance', href: '/compliance' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Add New Seller', action: onAddSeller },
    { icon: Plus, label: 'Add New Product', action: onAddProduct },
    { icon: Plus, label: 'Create Order', action: onAddOrder },
    { icon: FileText, label: 'Generate Report', action: () => navigate('/analytics') },
    { icon: Bell, label: 'View Notifications', action: () => {} },
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Quick Actions">
          {quickActions.map((item) => (
            <CommandItem
              key={item.label}
              onSelect={() => runCommand(() => item.action?.())}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => runCommand(() => navigate(item.href))}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Sellers">
          <CommandItem onSelect={() => runCommand(() => navigate('/sellers/applications'))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Seller Applications</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/sellers/verification'))}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Verification Queue</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/sellers/commissions'))}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Commission Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Products">
          <CommandItem onSelect={() => runCommand(() => navigate('/products/pending'))}>
            <Package className="mr-2 h-4 w-4" />
            <span>Pending Reviews</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/products/categories'))}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Manage Categories</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Orders">
          <CommandItem onSelect={() => runCommand(() => navigate('/orders/pending'))}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            <span>Pending Orders</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/orders/returns'))}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            <span>Returns & Refunds</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}