import { Star, ShieldCheck, ChevronRight, ChevronLeft } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Badge } from '@/components/ui/badge';
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useFeaturedSuppliers, transformSupplier } from '@/hooks/useSuppliers';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { VerificationBadge } from '@/components/ui/VerificationBadge';
export default function TopSuppliers() {
  const {
    t
  } = useApp();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const {
    data: suppliers,
    isLoading
  } = useFeaturedSuppliers(4);
  const transformedSuppliers = suppliers?.map(transformSupplier) || [];
  const checkScroll = () => {
    if (scrollRef.current) {
      const {
        scrollLeft,
        scrollWidth,
        clientWidth
      } = scrollRef.current;
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
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollInterval: any;
    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (scrollContainer) {
          if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10) {
            // Smoothly scroll back to start
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollContainer.scrollBy({ left: 1, behavior: 'auto' }); // Slow continuous scroll
          }
        }
      }, 30); // Speed of scroll
    };

    startAutoScroll();

    return () => clearInterval(scrollInterval);
  }, [transformedSuppliers]);

  if (isLoading) {
    return <section className="py-6 sm:py-8">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-foreground">
          {t('home.topSuppliers')}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <div key={i} className="bg-card rounded-xl p-4 border border-border">
          <div className="flex gap-3 mb-3">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-16 w-full" />
        </div>)}
      </div>
    </section>;
  }
  return <section className="py-6 sm:py-8">
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <h2 className="text-base sm:text-lg lg:text-xl font-bold text-foreground">
        {t('home.topSuppliers')}
      </h2>
      <Link to="/sellers" className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">
        View All
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>

    {transformedSuppliers.length === 0 ? <div className="text-center py-8 text-muted-foreground">
      <p>No suppliers available</p>
    </div> : <>
      {/* Mobile Horizontal Scroll with Auto-Scroll */}
      <div className="sm:hidden relative">
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory min-w-0">
          {transformedSuppliers.map(supplier => <Link key={supplier.id} to={`/supplier/${supplier.id}`} className="bg-card rounded-xl p-3 border border-border min-w-[240px] flex-shrink-0 snap-start hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start gap-2 mb-2">
              <img src={supplier.logo} alt={supplier.name} className="w-9 h-9 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h4 className="font-medium text-foreground line-clamp-1 mb-0.5 text-sm">
                    {supplier.name}
                  </h4>
                  {supplier.verified && <VerificationBadge verified={true} size="sm" />}
                </div>
                <div className="flex items-center gap-0.5 flex-wrap">
                  {supplier.goldSupplier && <Badge variant="secondary" className="bg-warning/10 text-warning text-[8px] px-1 py-0 h-3.5">
                    Gold
                  </Badge>}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-1 mb-2 py-1.5 border-y border-border">
              <div className="text-center">
                <p className="font-semibold text-foreground text-xs">{supplier.years}</p>
                <p className="text-[8px] text-muted-foreground">Years</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-xs">{supplier.rating?.toFixed(1) || 'N/A'}</p>
                <p className="text-[8px] text-muted-foreground">Rating</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-xs">{supplier.responseRate}%</p>
                <p className="text-[8px] text-muted-foreground">Response</p>
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-xs">{supplier.onTimeDelivery}%</p>
                <p className="text-[8px] text-muted-foreground">On-Time</p>
              </div>
            </div>

            {/* Location */}
            <p className="text-[10px] text-muted-foreground truncate">{supplier.location}</p>
          </Link>)}
        </div>
      </div>

      {/* Tablet & Desktop Grid */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {transformedSuppliers.map(supplier => <Link key={supplier.id} to={`/supplier/${supplier.id}`} className="bg-card rounded-xl p-4 border border-border hover:shadow-card-hover transition-shadow cursor-pointer">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <img src={supplier.logo} alt={supplier.name} className="w-12 h-12 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <h4 className="font-medium text-foreground text-sm line-clamp-2">
                  {supplier.name}
                </h4>
                {supplier.verified && <VerificationBadge verified={true} size="sm" />}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {supplier.goldSupplier && <Badge variant="secondary" className="bg-warning/10 text-warning text-[10px] px-1.5 py-0 h-4">
                  Gold
                </Badge>}
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
              <p className="text-sm font-semibold text-foreground">{supplier.rating?.toFixed(1) || 'N/A'}</p>
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

          {/* Location */}
          <p className="text-xs text-muted-foreground">{supplier.location}</p>
        </Link>)}
      </div>
    </>}
  </section>;
}