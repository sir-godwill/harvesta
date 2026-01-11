import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import harvestaIcon from '@/assets/harvesta-icon.png';

interface NavItem {
  icon?: React.ElementType;
  customIcon?: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
  isLogo?: boolean;
}

export default function MobileNav() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems: NavItem[] = [
    { 
      label: 'Home', 
      href: '/',
      isLogo: true,
    },
    { 
      icon: MessageCircle, 
      label: 'Message', 
      href: '/messages',
    },
    { 
      icon: ShoppingCart, 
      label: 'Cart', 
      href: '/cart', 
      badge: 3,
    },
    { 
      icon: User, 
      label: 'Me', 
      href: user ? '/dashboard' : '/login',
    },
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
                "flex flex-col items-center gap-0.5 py-2 px-5 relative transition-all duration-200",
                isActive && !item.isLogo ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {item.isLogo ? (
                <div className={cn(
                  "w-10 h-10 rounded-full overflow-hidden transition-transform duration-200",
                  isActive ? "ring-2 ring-success ring-offset-2 ring-offset-card" : ""
                )}>
                  <img 
                    src={harvestaIcon} 
                    alt="Home" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <>
                  <div className="relative">
                    {item.icon && (
                      <item.icon 
                        className={cn(
                          "h-6 w-6 transition-all duration-200",
                          isActive ? "text-foreground" : ""
                        )} 
                        strokeWidth={isActive ? 2.5 : 1.5}
                      />
                    )}
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-destructive text-destructive-foreground text-[10px] font-medium rounded-full flex items-center justify-center px-1">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    "text-[11px] transition-all duration-200",
                    isActive ? "font-medium" : ""
                  )}>
                    {item.label}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
