import { Compass, Ship, Sparkles, Gift, Coins, Tag, Truck, Star } from 'lucide-react';

interface QuickAction {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  color: string;
  bgColor: string;
  badge?: string;
}

const quickActions: QuickAction[] = [
  { icon: Compass, label: 'New User', sublabel: 'Guide', color: 'text-blue-500', bgColor: 'bg-gradient-to-br from-blue-400 to-blue-600' },
  { icon: Ship, label: 'Overseas', sublabel: 'Shipping', color: 'text-cyan-500', bgColor: 'bg-gradient-to-br from-cyan-400 to-cyan-600' },
  { icon: Sparkles, label: 'TrendToy', sublabel: '', color: 'text-yellow-500', bgColor: 'bg-gradient-to-br from-yellow-400 to-orange-500', badge: 'Hot' },
  { icon: Gift, label: 'Choice', sublabel: '', color: 'text-purple-500', bgColor: 'bg-gradient-to-br from-purple-400 to-purple-600', badge: 'Sale' },
  { icon: Coins, label: 'Share &', sublabel: 'Earn', color: 'text-amber-500', bgColor: 'bg-gradient-to-br from-amber-400 to-amber-600' },
  { icon: Star, label: 'New', sublabel: 'Arrivals', color: 'text-green-500', bgColor: 'bg-gradient-to-br from-green-400 to-green-600' },
];

export default function QuickActions() {
  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-1">
      {quickActions.map((action, index) => (
        <a
          key={index}
          href="#"
          className="flex flex-col items-center gap-2 min-w-[70px] group"
        >
          <div className={`relative w-14 h-14 rounded-2xl ${action.bgColor} flex items-center justify-center shadow-md transition-transform group-hover:scale-110`}>
            <action.icon className="h-7 w-7 text-white" />
            {action.badge && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {action.badge}
              </span>
            )}
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-foreground leading-tight">{action.label}</p>
            {action.sublabel && (
              <p className="text-xs text-muted-foreground leading-tight">{action.sublabel}</p>
            )}
          </div>
        </a>
      ))}
    </div>
  );
}
