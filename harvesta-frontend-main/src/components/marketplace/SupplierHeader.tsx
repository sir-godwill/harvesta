import { MapPin, Clock, MessageCircle, Heart, Share2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrustBadge, VendorRating } from './TrustBadge';
import type { SupplierProfile } from '@/types/marketplace';

interface SupplierHeaderProps {
  supplier: SupplierProfile;
  onContact?: () => void;
  onFollow?: () => void;
  isFollowing?: boolean;
  className?: string;
}

export function SupplierHeader({
  supplier,
  onContact,
  onFollow,
  isFollowing = false,
  className
}: SupplierHeaderProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Cover Image */}
      <div className="h-48 md:h-64 lg:h-80 bg-gradient-to-r from-primary/20 to-secondary/20 relative overflow-hidden">
        {supplier.coverImage && (
          <img
            src={supplier.coverImage}
            alt={supplier.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 md:-mt-20 pb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Logo/Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-card rounded-2xl border-4 border-background shadow-xl flex items-center justify-center">
              {supplier.logo ? (
                <img
                  src={supplier.logo}
                  alt={supplier.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <span className="text-4xl md:text-5xl font-bold text-primary">
                  {supplier.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold">{supplier.name}</h1>
                <div className="flex gap-2">
                  {supplier.isVerified && <TrustBadge type="verified" />}
                  {supplier.isQualityChecked && <TrustBadge type="quality" />}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <VendorRating rating={supplier.rating} totalSales={supplier.totalSales} />
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {supplier.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Response: {supplier.responseTime}
                </span>
              </div>

              <p className="text-muted-foreground max-w-2xl line-clamp-2">
                {supplier.description}
              </p>

              {/* Certifications */}
              <div className="flex flex-wrap gap-2">
                {supplier.certifications.slice(0, 3).map(cert => (
                  <Badge key={cert.id} variant="secondary" className="gap-1">
                    <span>{cert.icon}</span>
                    {cert.name}
                  </Badge>
                ))}
                {supplier.certifications.length > 3 && (
                  <Badge variant="outline">
                    +{supplier.certifications.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 shrink-0">
              <Button
                variant={isFollowing ? 'secondary' : 'outline'}
                size="sm"
                className="gap-2"
                onClick={onFollow}
              >
                <Heart className={cn('w-4 h-4', isFollowing && 'fill-current')} />
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button size="sm" variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button size="sm" className="gap-2" onClick={onContact}>
                <MessageCircle className="w-4 h-4" />
                Contact
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
