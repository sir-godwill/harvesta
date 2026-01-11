import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, ShoppingCart, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import harvestaIcon from '@/assets/harvesta-icon.png';

interface NavItem {
  icon?: React.ElementType;
  label: string;
  href: string;
  badge?: number;
  isLogo?: boolean;
}

export default function MobileNav() {
  const { user } = useAuth();
  const location = useLocation();
  const [tappedItem, setTappedItem] = useState<string | null>(null);

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

  const handleTap = (label: string) => {
    setTappedItem(label);
    setTimeout(() => setTappedItem(null), 200);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-bottom">
      <div className="flex items-stretch justify-around h-14">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const isTapped = tappedItem === item.label;
          
          return (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => handleTap(item.label)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 relative transition-all duration-150",
                isActive && !item.isLogo ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {item.isLogo ? (
                <div className={cn(
                  "relative w-10 h-10 rounded-full overflow-hidden transition-all duration-200 ease-out",
                  isTapped && "scale-90",
                  isActive && "ring-2 ring-primary ring-offset-1 ring-offset-card"
                )}>
                  <img 
                    src={harvestaIcon} 
                    alt="Home" 
                    className="w-full h-full object-cover"
                  />
                  {/* Ripple effect */}
                  {isTapped && (
                    <div className="absolute inset-0 bg-white/30 animate-ping rounded-full" />
                  )}
                </div>
              ) : (
                <div className={cn(
                  "flex flex-col items-center gap-0.5 transition-all duration-150 ease-out",
                  isTapped && "scale-90"
                )}>
                  <div className="relative">
                    {item.icon && (
                      <item.icon 
                        className={cn(
                          "h-6 w-6 transition-all duration-150",
                          isActive ? "text-foreground" : "",
                          isTapped && "text-primary"
                        )} 
                        strokeWidth={isActive ? 2 : 1.5}
                      />
                    )}
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 bg-primary text-primary-foreground text-[10px] font-medium rounded-full flex items-center justify-center px-1">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] transition-all duration-150",
                    isActive ? "font-medium text-foreground" : "",
                    isTapped && "text-primary"
                  )}>
                    {item.label}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
