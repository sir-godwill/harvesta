import { Tag, Zap } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';

interface Deal {
  id: string;
  title: string;
  image: string;
  price: number;
  originalPrice: number;
  sold: number;
  badge?: string;
}

const selectionDeals: Deal[] = [
  {
    id: '1',
    title: 'Organic Fertilizer Mix',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=300&fit=crop',
    price: 4500,
    originalPrice: 6500,
    sold: 16000,
  },
  {
    id: '2',
    title: 'Fresh Farm Eggs',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&h=300&fit=crop',
    price: 2800,
    originalPrice: 4000,
    sold: 8500,
  },
];

const superDeals: Deal[] = [
  {
    id: '3',
    title: 'AI Selection',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=300&h=300&fit=crop',
    price: 12000,
    originalPrice: 18000,
    sold: 3200,
    badge: 'AI Pick',
  },
  {
    id: '4',
    title: 'Exclusive Offer',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=300&fit=crop',
    price: 8500,
    originalPrice: 15000,
    sold: 1800,
    badge: 'Limited',
  },
];

export default function DealsSection() {
  const { formatPrice } = useApp();

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {/* Selection Sale */}
      <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl p-3 border border-orange-100">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-semibold text-foreground">Selection</h3>
          <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5">
            <Tag className="h-2.5 w-2.5 mr-0.5" />
            sale
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {selectionDeals.map((deal) => (
            <a key={deal.id} href="#" className="group">
              <div className="aspect-square rounded-lg overflow-hidden bg-white mb-1.5">
                <img 
                  src={deal.image} 
                  alt={deal.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <p className="price-primary text-sm">{formatPrice(deal.price)}</p>
              <p className="text-[10px] text-muted-foreground">{deal.sold.toLocaleString()}+ sold</p>
            </a>
          ))}
        </div>
      </div>
      
      {/* Super Deals */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-semibold text-white">Super Deals</h3>
          <Badge className="bg-warning text-warning-foreground text-[10px] px-1.5">
            <Zap className="h-2.5 w-2.5 mr-0.5" />
            Hot
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {superDeals.map((deal) => (
            <a key={deal.id} href="#" className="group">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-white/10 mb-1.5">
                <img 
                  src={deal.image} 
                  alt={deal.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                {deal.badge && (
                  <span className="absolute bottom-1 left-1 bg-primary/90 text-primary-foreground text-[9px] px-1.5 py-0.5 rounded">
                    {deal.badge}
                  </span>
                )}
              </div>
              <p className="text-primary text-sm font-medium">{formatPrice(deal.price)}</p>
              <p className="text-[10px] text-slate-400">{deal.sold.toLocaleString()}+ sold</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
