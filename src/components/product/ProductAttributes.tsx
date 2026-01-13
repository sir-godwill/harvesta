import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings2, Leaf, MapPin, Calendar, Package, Award, Thermometer, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductVariant } from '@/lib/productApi';

interface ProductAttributesProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantSelect: (variant: ProductVariant) => void;
  origin: { country: string; region: string };
  isOrganic: boolean;
  harvestDate: string | null;
  expiryDate: string | null;
  certifications: string[];
  className?: string;
}

const attributeIcons: Record<string, typeof Package> = {
  grade: Award,
  packaging: Package,
  weight: Settings2,
  moisture: Droplets,
  temperature: Thermometer,
};

export function ProductAttributes({
  variants,
  selectedVariant,
  onVariantSelect,
  origin,
  isOrganic,
  harvestDate,
  expiryDate,
  certifications,
  className,
}: ProductAttributesProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings2 className="w-5 h-5 text-primary" />
          Specifications & Variants
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Variant Selector */}
        {variants.length > 1 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Select Variant</h4>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => onVariantSelect(variant)}
                  className={cn(
                    'px-4 py-2 rounded-lg border-2 transition-all text-sm',
                    selectedVariant?.id === variant.id
                      ? 'border-primary bg-primary/5 text-primary font-medium'
                      : 'border-border hover:border-muted-foreground/50 text-foreground'
                  )}
                >
                  <span className="font-medium">{variant.name}</span>
                  {variant.grade && (
                    <span className="text-muted-foreground ml-1">({variant.grade})</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Variant Details */}
        {selectedVariant && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedVariant.grade && (
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Award className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Grade / Quality</p>
                  <p className="font-medium text-foreground">{selectedVariant.grade}</p>
                </div>
              </div>
            )}
            {selectedVariant.packaging && (
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Package className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Packaging</p>
                  <p className="font-medium text-foreground">{selectedVariant.packaging}</p>
                </div>
              </div>
            )}
            {selectedVariant.weight > 0 && (
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Settings2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="font-medium text-foreground">
                    {selectedVariant.weight} {selectedVariant.weightUnit}
                  </p>
                </div>
              </div>
            )}
            {selectedVariant.sku && (
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Settings2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">SKU</p>
                  <p className="font-medium text-foreground font-mono text-sm">{selectedVariant.sku}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Origin & Dates */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(origin.country || origin.region) && (
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Origin</p>
                <p className="font-medium text-foreground">
                  {origin.region ? `${origin.region}, ` : ''}{origin.country}
                </p>
              </div>
            </div>
          )}
          {isOrganic && (
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <Leaf className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Certification</p>
                <p className="font-medium text-green-700 dark:text-green-400">Organic Certified</p>
              </div>
            </div>
          )}
          {harvestDate && (
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Harvest Date</p>
                <p className="font-medium text-foreground">{formatDate(harvestDate)}</p>
              </div>
            </div>
          )}
          {expiryDate && (
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Best Before</p>
                <p className="font-medium text-foreground">{formatDate(expiryDate)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Certifications</h4>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                >
                  <Award className="w-3 h-3 mr-1" />
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
