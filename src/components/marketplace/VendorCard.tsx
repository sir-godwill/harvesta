import { MapPin, MessageCircle, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TrustBadge, VendorRating } from './TrustBadge';
import { Button } from '@/components/ui/button';
import type { Vendor } from '@/types/marketplace';

interface VendorCardHeaderProps {
  vendor: Vendor;
  className?: string;
}

export function VendorCardHeader({ vendor, className }: VendorCardHeaderProps) {
  return (
    <div className={cn('flex items-center gap-4 p-4 bg-muted/30', className)}>
      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
        <Store className="w-6 h-6 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-foreground truncate">{vendor.name}</h3>
          <div className="flex gap-1 flex-wrap">
            {vendor.isVerified && <TrustBadge type="verified" />}
            {vendor.isQualityChecked && <TrustBadge type="quality" />}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm">
          <VendorRating rating={vendor.rating} totalSales={vendor.totalSales} />
          <span className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-3 h-3" />
            {vendor.location}
          </span>
        </div>
      </div>
      <Button variant="outline" size="sm" className="gap-2">
        <MessageCircle className="w-4 h-4" />
        <span className="hidden sm:inline">Contact</span>
      </Button>
    </div>
  );
}

interface VendorInfoBadgeProps {
  vendor: Vendor;
  compact?: boolean;
  className?: string;
}

export function VendorInfoBadge({ vendor, compact = false, className }: VendorInfoBadgeProps) {
  if (compact) {
    return (
      <div className={cn('flex items-center gap-2 text-sm', className)}>
        <Store className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium">{vendor.name}</span>
        {vendor.isVerified && (
          <span className="text-secondary">✓</span>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-3 p-3 bg-muted/50 rounded-lg', className)}>
      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
        <Store className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{vendor.name}</span>
          {vendor.isVerified && <TrustBadge type="verified" />}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-3 h-3" />
          {vendor.location}
        </div>
      </div>
    </div>
  );
}
