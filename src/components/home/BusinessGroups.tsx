import { ChevronRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface BusinessItem {
  id: string;
  title: string;
  image: string;
  price: number;
  badge?: string;
  badgeColor?: string;
}

const businessItems: BusinessItem[] = [
  {
    id: '1',
    title: 'Premium Cocoa Processing Equipment',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
    price: 850000,
    badge: 'Best Seller',
    badgeColor: 'bg-green-500',
  },
  {
    id: '2',
    title: 'Organic Seed Collection Kit',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    price: 75000,
    badge: 'New',
    badgeColor: 'bg-purple-500',
  },
  {
    id: '3',
    title: 'Industrial Grain Mill',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
    price: 1250000,
  },
  {
    id: '4',
    title: 'Organic Fertilizer Bulk Pack',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop',
    price: 45000,
    badge: 'Hot Deal',
    badgeColor: 'bg-primary',
  },
];

export default function BusinessGroups() {
  const { formatPrice } = useApp();

  return (
    <div className="bg-card rounded-xl p-4 lg:p-6 flex-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Business Group Cargo</h3>
        <a href="#" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          View
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {businessItems.map((item) => (
          <a
            key={item.id}
            href={`/product/${item.id}`}
            className="group"
          >
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted mb-2">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              {item.badge && (
                <span className={`absolute top-2 left-2 ${item.badgeColor} text-white text-[10px] font-medium px-2 py-0.5 rounded`}>
                  {item.badge}
                </span>
              )}
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded">
                {formatPrice(item.price)}
              </div>
            </div>
            <p className="text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {item.title}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
