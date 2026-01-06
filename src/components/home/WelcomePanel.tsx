import { ShoppingCart, Heart, Clock, History, Gift, Ticket, CreditCard } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';

export default function WelcomePanel() {
  const { t } = useApp();

  const quickLinks = [
    { icon: ShoppingCart, label: 'Cart' },
    { icon: Heart, label: 'Wishlist' },
    { icon: Clock, label: 'Follow...' },
    { icon: History, label: 'History' },
  ];

  const bonusItems = [
    { icon: Gift, label: 'Bonus', color: 'text-red-500' },
    { icon: Ticket, label: 'Vouchers', color: 'text-green-500' },
    { icon: CreditCard, label: 'Pay Later', color: 'text-amber-500' },
  ];

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
      <h3 className="font-semibold text-foreground mb-1">
        Good Afternoon, <span className="text-primary">Guest</span>
      </h3>
      
      {/* Bonus Bar */}
      <div className="flex items-center justify-between mb-4 py-2 border-b border-orange-200">
        {bonusItems.map((item) => (
          <a key={item.label} href="#" className="flex items-center gap-1.5 text-sm">
            <item.icon className={`h-4 w-4 ${item.color}`} />
            <span className="text-foreground">{item.label}</span>
          </a>
        ))}
      </div>
      
      {/* Quick Links */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {quickLinks.map((link) => (
          <a
            key={link.label}
            href="#"
            className="flex flex-col items-center gap-1 py-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <link.icon className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{link.label}</span>
          </a>
        ))}
      </div>
      
      {/* Login Section */}
      <div className="bg-white/60 rounded-lg p-3">
        <p className="text-sm font-medium text-foreground mb-2">Login for More Services</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
          <span>○ Recommend suppliers</span>
          <span>○ Faster Order Updates</span>
          <span>○ Richer Product Info</span>
          <span>○ Faster Participation</span>
        </div>
        <Button className="w-full bg-gradient-primary hover:opacity-90">
          Sign in
        </Button>
      </div>
    </div>
  );
}
