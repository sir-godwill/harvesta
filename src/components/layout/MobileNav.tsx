import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, ShoppingCart, User, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
}

export default function MobileNav() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems: NavItem[] = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Search', href: '/search' },
    { icon: ShoppingCart, label: 'Cart', href: '/cart', badge: 3 },
    { icon: MessageSquare, label: 'Messages', href: '/messages' },
    { icon: User, label: 'Account', href: user ? '/dashboard' : '/login' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 pb-safe">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-4 relative",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.badge && (
                <span className="absolute top-0.5 right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
