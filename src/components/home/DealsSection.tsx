import { Tag, Zap, ChevronRight, Star } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useFeaturedProducts, transformProduct } from '@/hooks/useProducts';

export default function DealsSection() {
  const { formatPrice } = useApp();
  const { data: products, isLoading } = useFeaturedProducts(4);
  
  const deals = products?.slice(0, 2).map(transformProduct) || [];
  const superDeals = products?.slice(2, 4).map(transformProduct) || [];

  if (isLoading) {
    return (
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 snap-x snap-mandatory min-w-0">
        <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-lg p-1.5 border border-orange-100 min-w-[45%] flex-shrink-0 snap-start h-[100px] animate-pulse" />
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-1.5 min-w-[45%] flex-shrink-0 snap-start h-[100px] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 snap-x snap-mandatory min-w-0">
      {/* Selection Sale - Compact Card with fixed height */}
      <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-lg p-1.5 border border-orange-100 min-w-[45%] max-w-[45%] flex-shrink-0 snap-start h-[100px]">
        <div className="flex items-center gap-1 mb-1">
          <h3 className="font-semibold text-foreground text-[9px]">Hot Deals</h3>
          <Badge className="bg-primary text-primary-foreground text-[6px] px-0.5 h-2.5">
            <Tag className="h-1.5 w-1.5 mr-0.5" />
            sale
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {deals.map((deal) => (
            <Link key={deal.id} to={`/product/${deal.id}`} className="group">
              <div className="w-8 h-8 rounded overflow-hidden bg-white mb-0.5">
                <img 
                  src={deal.image} 
                  alt={deal.name}
                  className="w-full h-full object-cover transition-transform group-active:scale-105"
                  loading="eager"
                />
              </div>
              <p className="price-primary text-[8px] font-semibold truncate">{formatPrice(deal.price)}</p>
              <p className="text-[6px] text-muted-foreground">{deal.sold >= 1000 ? `${(deal.sold/1000).toFixed(0)}K+` : `${deal.sold}+`} sold</p>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Super Deals - Compact Card with fixed height */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-1.5 min-w-[45%] max-w-[45%] flex-shrink-0 snap-start h-[100px]">
        <div className="flex items-center gap-1 mb-1">
          <h3 className="font-semibold text-white text-[9px]">Super Deals</h3>
          <Badge className="bg-warning text-warning-foreground text-[6px] px-0.5 h-2.5">
            <Zap className="h-1.5 w-1.5 mr-0.5" />
            Hot
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {superDeals.map((deal, index) => (
            <Link key={deal.id} to={`/product/${deal.id}`} className="group">
              <div className="relative w-8 h-8 rounded overflow-hidden bg-white/10 mb-0.5">
                <img 
                  src={deal.image} 
                  alt={deal.name}
                  className="w-full h-full object-cover transition-transform group-active:scale-105"
                  loading="eager"
                />
                {index === 0 && (
                  <span className="absolute bottom-0 left-0 bg-primary/90 text-primary-foreground text-[5px] px-0.5 rounded-tr">
                    AI
                  </span>
                )}
              </div>
              <p className="text-primary text-[8px] font-semibold truncate">{formatPrice(deal.price)}</p>
              <p className="text-[6px] text-slate-400">{deal.sold >= 1000 ? `${(deal.sold/1000).toFixed(0)}K+` : `${deal.sold}+`} sold</p>
            </Link>
          ))}
        </div>
      </div>

      {/* View All Link */}
      <Link 
        to="/products" 
        className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg p-1.5 border border-secondary/20 min-w-[15%] flex-shrink-0 snap-start flex flex-col items-center justify-center gap-0.5 h-[100px]"
      >
        <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
          <ChevronRight className="h-3 w-3 text-secondary" />
        </div>
        <span className="text-[7px] font-medium text-secondary">More</span>
      </Link>
    </div>
  );
}
