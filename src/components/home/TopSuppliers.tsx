import { Star, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Supplier {
  id: string;
  name: string;
  logo: string;
  rating: number;
  years: number;
  responseRate: number;
  onTimeDelivery: number;
  verified: boolean;
  goldSupplier: boolean;
  products: string[];
}

const topSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Cameroon Cocoa Exports Ltd',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
    rating: 4.8,
    years: 12,
    responseRate: 98,
    onTimeDelivery: 95,
    verified: true,
    goldSupplier: true,
    products: ['Cocoa Beans', 'Cocoa Butter', 'Cocoa Powder'],
  },
  {
    id: '2',
    name: 'Highland Coffee Farms',
    logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&h=100&fit=crop',
    rating: 4.9,
    years: 8,
    responseRate: 95,
    onTimeDelivery: 92,
    verified: true,
    goldSupplier: true,
    products: ['Arabica Coffee', 'Robusta Coffee', 'Green Beans'],
  },
  {
    id: '3',
    name: 'Green Palm Industries',
    logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop',
    rating: 4.6,
    years: 15,
    responseRate: 92,
    onTimeDelivery: 88,
    verified: true,
    goldSupplier: false,
    products: ['Palm Oil', 'Palm Kernel Oil', 'Palm Derivatives'],
  },
  {
    id: '4',
    name: 'AgroProcess Industries',
    logo: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&h=100&fit=crop',
    rating: 4.5,
    years: 6,
    responseRate: 90,
    onTimeDelivery: 94,
    verified: true,
    goldSupplier: true,
    products: ['Cassava Flour', 'Tapioca Starch', 'Processed Grains'],
  },
];

export default function TopSuppliers() {
  const { t } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-4 sm:py-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-foreground">
          {t('home.topSuppliers')}
        </h2>
        <a href="/suppliers" className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">
          View All
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
      
      {/* Mobile Horizontal Scroll */}
      <div className="sm:hidden relative">
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 snap-x snap-mandatory"
        >
          {topSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-card rounded-xl p-3 border border-border min-w-[260px] snap-start"
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={supplier.logo}
                  alt={supplier.name}
                  className="w-11 h-11 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm line-clamp-1 mb-1">
                    {supplier.name}
                  </h4>
                  <div className="flex items-center gap-1 flex-wrap">
                    {supplier.verified && (
                      <Badge variant="secondary" className="bg-success/10 text-success text-[9px] px-1 py-0 h-4">
                        <ShieldCheck className="h-2.5 w-2.5 mr-0.5" />
                        Verified
                      </Badge>
                    )}
                    {supplier.goldSupplier && (
                      <Badge variant="secondary" className="bg-warning/10 text-warning text-[9px] px-1 py-0 h-4">
                        Gold
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-4 gap-1.5 mb-3 py-2 border-y border-border">
                <div className="text-center">
                  <p className="text-xs font-semibold text-foreground">{supplier.years}</p>
                  <p className="text-[9px] text-muted-foreground">Years</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-foreground">{supplier.rating}</p>
                  <p className="text-[9px] text-muted-foreground">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-foreground">{supplier.responseRate}%</p>
                  <p className="text-[9px] text-muted-foreground">Response</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-foreground">{supplier.onTimeDelivery}%</p>
                  <p className="text-[9px] text-muted-foreground">On-Time</p>
                </div>
              </div>
              
              {/* Products */}
              <div className="flex flex-wrap gap-1">
                {supplier.products.slice(0, 3).map((product, index) => (
                  <span key={index} className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                    {product}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Tablet & Desktop Grid */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-card rounded-xl p-4 border border-border hover:shadow-card-hover transition-shadow cursor-pointer"
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <img
                src={supplier.logo}
                alt={supplier.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground text-sm line-clamp-2 mb-1">
                  {supplier.name}
                </h4>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {supplier.verified && (
                    <Badge variant="secondary" className="bg-success/10 text-success text-[10px] px-1.5 py-0 h-4">
                      <ShieldCheck className="h-2.5 w-2.5 mr-0.5" />
                      Verified
                    </Badge>
                  )}
                  {supplier.goldSupplier && (
                    <Badge variant="secondary" className="bg-warning/10 text-warning text-[10px] px-1.5 py-0 h-4">
                      Gold
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mb-3 py-2 border-y border-border">
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{supplier.years}</p>
                <p className="text-[10px] text-muted-foreground">{t('supplier.yearsInBusiness')}</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{supplier.rating}</p>
                <p className="text-[10px] text-muted-foreground">Rating</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{supplier.responseRate}%</p>
                <p className="text-[10px] text-muted-foreground">Response</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{supplier.onTimeDelivery}%</p>
                <p className="text-[10px] text-muted-foreground">On-Time</p>
              </div>
            </div>
            
            {/* Products */}
            <div className="flex flex-wrap gap-1">
              {supplier.products.slice(0, 3).map((product, index) => (
                <span key={index} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded">
                  {product}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
