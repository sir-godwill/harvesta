import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Link2, 
  Store, 
  Wallet, 
  Gift, 
  BarChart3, 
  CreditCard, 
  Settings,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AffiliateLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/affiliate', label: 'Overview', icon: LayoutDashboard },
  { path: '/affiliate/referrals', label: 'Referrals', icon: Link2 },
  { path: '/affiliate/sellers', label: 'Sellers', icon: Store },
  { path: '/affiliate/commissions', label: 'Commissions', icon: Wallet },
  { path: '/affiliate/campaigns', label: 'Campaigns', icon: Gift },
  { path: '/affiliate/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/affiliate/payouts', label: 'Payouts', icon: CreditCard },
  { path: '/affiliate/settings', label: 'Settings', icon: Settings },
];

export function AffiliateLayout({ children }: AffiliateLayoutProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ChevronLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="font-semibold text-foreground">Affiliate Dashboard</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Menu */}
      <div className={cn(
        "lg:hidden fixed top-14 left-0 right-0 z-30 bg-card border-b border-border transition-transform duration-300",
        isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
      )}>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-[280px] bg-card border-r border-border">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">Back to Marketplace</span>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Affiliate Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your referrals & earnings</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-[280px] pt-16 lg:pt-0">
        <div className="p-4 lg:p-6 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}