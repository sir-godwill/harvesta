import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, Star, MapPin, Clock, ShieldCheck, Award, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { SellerProfile } from '@/lib/productApi';

interface ProductSellerCardProps {
  seller: SellerProfile;
  className?: string;
}

export function ProductSellerCard({ seller, className }: ProductSellerCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-4 space-y-4">
        {/* Seller Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {seller.logoUrl ? (
              <img 
                src={seller.logoUrl} 
                alt={seller.companyName}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Store className="h-6 w-6 text-primary" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                {seller.companyName}
                {seller.verificationStatus === 'verified' && (
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                )}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {seller.isFeatured && (
                  <Badge className="bg-amber-500 text-white text-[10px] px-1.5">
                    <Award className="w-3 h-3 mr-0.5" />
                    Premium
                  </Badge>
                )}
                <span>{seller.yearsInOperation}+ years</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to={`/supplier/${seller.id}`}>
              Visit Store
              <ExternalLink className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{seller.location.city}, {seller.location.country}</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 bg-muted/50 rounded-lg">
            <p className="font-semibold text-foreground">{(seller.rating ?? 0).toFixed(1)}</p>
            <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              Rating
            </p>
          </div>
          <div className="p-2 bg-muted/50 rounded-lg">
            <p className="font-semibold text-foreground">{seller.responseRate}%</p>
            <p className="text-[10px] text-muted-foreground">Response</p>
          </div>
          <div className="p-2 bg-muted/50 rounded-lg">
            <p className="font-semibold text-foreground">{seller.totalOrders}</p>
            <p className="text-[10px] text-muted-foreground">Orders</p>
          </div>
          <div className="p-2 bg-muted/50 rounded-lg">
            <p className="font-semibold text-foreground">{seller.totalProducts}</p>
            <p className="text-[10px] text-muted-foreground">Products</p>
          </div>
        </div>

        {/* Response Time */}
        <div className="flex items-center gap-2 text-sm bg-green-50 dark:bg-green-950/30 p-2 rounded-lg">
          <Clock className="w-4 h-4 text-green-600" />
          <span className="text-green-700 dark:text-green-400">
            Responds within {seller.responseTimeHours < 24 ? `${seller.responseTimeHours} hours` : '1 day'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
