import { Home, MessageSquare, ShoppingCart, User } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  badge?: number;
}

export default function MobileNav() {
  const { t } = useApp();

  const navItems: NavItem[] = [
    { icon: Home, label: 'Home', href: '/', active: true },
    { icon: MessageSquare, label: 'Message', href: '/messages' },
    { icon: ShoppingCart, label: 'Cart', href: '/cart', badge: 3 },
    { icon: User, label: 'Me', href: '/account' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 pb-safe">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-4 relative",
              item.active ? "text-primary" : "text-muted-foreground"
            )}
          >
            {index === 0 ? (
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center -mt-6 shadow-lg">
                <span className="text-primary-foreground font-bold text-sm">AM</span>
              </div>
            ) : (
              <>
                <item.icon className="h-5 w-5" />
                {item.badge && (
                  <span className="absolute -top-0.5 right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </>
            )}
            <span className="text-xs">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
