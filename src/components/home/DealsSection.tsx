import { Tag, Zap, ChevronRight, Star } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useFeaturedProducts, transformProduct } from '@/hooks/useProducts';
export default function DealsSection() {
  const {
    formatPrice
  } = useApp();
  const {
    data: products,
    isLoading
  } = useFeaturedProducts(4);
  const deals = products?.slice(0, 2).map(transformProduct) || [];
  const superDeals = products?.slice(2, 4).map(transformProduct) || [];
  if (isLoading) {
    return <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 snap-x snap-mandatory min-w-0">
      <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-lg p-1.5 border border-orange-100 min-w-[45%] flex-shrink-0 snap-start h-[100px] animate-pulse" />
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-1.5 min-w-[45%] flex-shrink-0 snap-start h-[100px] animate-pulse" />
    </div>;
  }
  return <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory min-w-0">
    {/* Selection Sale - Enhanced Card */}
    <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl p-3 border border-orange-100 min-w-[60%] flex-shrink-0 snap-start h-[140px] shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-bold text-foreground text-sm uppercase tracking-wide">Hot Deals</h3>
        <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 h-4 animate-pulse">
          <Tag className="h-2.5 w-2.5 mr-0.5" />
          LIVE
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {deals.map(deal => <Link key={deal.id} to={`/product/${deal.id}`} className="group bg-white/60 p-1.5 rounded-lg hover:bg-white transition-colors">
          <div className="w-10 h-10 rounded-md overflow-hidden bg-white mb-1 shadow-sm mx-auto">
            <img src={deal.image} alt={deal.name} className="w-full h-full object-cover transition-transform group-active:scale-105" loading="eager" />
          </div>
          <p className="price-primary font-bold truncate text-sm text-center">{formatPrice(deal.price)}</p>
          <p className="text-[9px] text-muted-foreground text-center">{deal.sold >= 1000 ? `${(deal.sold / 1000).toFixed(0)}K+` : `${deal.sold}+`} sold</p>
        </Link>)}
      </div>
    </div>

    {/* Super Deals - Enhanced Card */}
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-3 min-w-[60%] flex-shrink-0 snap-start h-[140px] shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-bold text-white text-sm uppercase tracking-wide">Super Deals</h3>
        <Badge className="bg-warning text-warning-foreground text-[10px] px-1.5 h-4">
          <Zap className="h-2.5 w-2.5 mr-0.5" />
          HOT
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {superDeals.map((deal, index) => <Link key={deal.id} to={`/product/${deal.id}`} className="group bg-white/5 p-1.5 rounded-lg hover:bg-white/10 transition-colors">
          <div className="relative w-10 h-10 rounded-md overflow-hidden bg-white/10 mb-1 shadow-sm mx-auto">
            <img src={deal.image} alt={deal.name} className="w-full h-full object-cover transition-transform group-active:scale-105" loading="eager" />
            {index === 0 && <span className="absolute bottom-0 left-0 bg-primary/90 text-primary-foreground text-[6px] px-1 rounded-tr font-bold">
              TOP
            </span>}
          </div>
          <p className="text-primary font-bold truncate text-sm text-center">{formatPrice(deal.price)}</p>
          <p className="text-[9px] text-slate-400 text-center">{deal.sold >= 1000 ? `${(deal.sold / 1000).toFixed(0)}K+` : `${deal.sold}+`} sold</p>
        </Link>)}
      </div>
    </div>

    {/* View All Link - Enhanced */}
    <Link to="/products" className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-3 border border-secondary/20 min-w-[20%] flex-shrink-0 snap-start flex flex-col items-center justify-center gap-2 h-[140px] hover:bg-secondary/10 transition-colors">
      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center shadow-sm">
        <ChevronRight className="h-5 w-5 text-secondary" />
      </div>
      <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">View All</span>
    </Link>
  </div>;
}