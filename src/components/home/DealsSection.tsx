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
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 snap-x snap-mandatory min-w-0">
        <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-lg p-2 border border-orange-100 min-w-[48%] flex-shrink-0 snap-start h-32 animate-pulse" />
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-2 min-w-[48%] flex-shrink-0 snap-start h-32 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 snap-x snap-mandatory min-w-0">
      {/* Selection Sale - Compact Card */}
      <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-lg p-2 border border-orange-100 min-w-[48%] flex-shrink-0 snap-start">
        <div className="flex items-center gap-1 mb-1.5">
          <h3 className="font-semibold text-foreground text-[10px]">Hot Deals</h3>
          <Badge className="bg-primary text-primary-foreground text-[7px] px-1 h-3">
            <Tag className="h-2 w-2 mr-0.5" />
            sale
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {deals.map((deal) => (
            <Link key={deal.id} to={`/product/${deal.id}`} className="group">
              <div className="aspect-square rounded-md overflow-hidden bg-white mb-0.5">
                <img 
                  src={deal.image} 
                  alt={deal.name}
                  className="w-full h-full object-cover transition-transform group-active:scale-105"
                />
              </div>
              <p className="price-primary text-[9px] font-semibold truncate">{formatPrice(deal.price)}</p>
              <p className="text-[7px] text-muted-foreground">{deal.sold >= 1000 ? `${(deal.sold/1000).toFixed(0)}K+` : `${deal.sold}+`} sold</p>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Super Deals - Compact Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-2 min-w-[48%] flex-shrink-0 snap-start">
        <div className="flex items-center gap-1 mb-1.5">
          <h3 className="font-semibold text-white text-[10px]">Super Deals</h3>
          <Badge className="bg-warning text-warning-foreground text-[7px] px-1 h-3">
            <Zap className="h-2 w-2 mr-0.5" />
            Hot
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {superDeals.map((deal, index) => (
            <Link key={deal.id} to={`/product/${deal.id}`} className="group">
              <div className="relative aspect-square rounded-md overflow-hidden bg-white/10 mb-0.5">
                <img 
                  src={deal.image} 
                  alt={deal.name}
                  className="w-full h-full object-cover transition-transform group-active:scale-105"
                />
                {index === 0 && (
                  <span className="absolute bottom-0.5 left-0.5 bg-primary/90 text-primary-foreground text-[6px] px-0.5 py-0 rounded">
                    AI Pick
                  </span>
                )}
              </div>
              <p className="text-primary text-[9px] font-semibold truncate">{formatPrice(deal.price)}</p>
              <p className="text-[7px] text-slate-400">{deal.sold >= 1000 ? `${(deal.sold/1000).toFixed(0)}K+` : `${deal.sold}+`} sold</p>
            </Link>
          ))}
        </div>
      </div>

      {/* View All Link */}
      <Link 
        to="/products" 
        className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg p-2 border border-secondary/20 min-w-[25%] flex-shrink-0 snap-start flex flex-col items-center justify-center gap-1"
      >
        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
          <ChevronRight className="h-4 w-4 text-secondary" />
        </div>
        <span className="text-[9px] font-medium text-secondary">View All</span>
      </Link>
    </div>
  );
}
