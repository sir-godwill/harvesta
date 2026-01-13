import { Badge } from '@/components/ui/badge';
import { Leaf, Clock, Package, Star, Eye, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductHeaderProps {
  name: string;
  category: {
    name: string;
    slug: string;
  };
  status: 'active' | 'draft' | 'seasonal' | 'out_of_stock' | 'discontinued';
  tags: string[];
  isOrganic: boolean;
  isFeatured: boolean;
  rating?: number;
  reviewCount?: number;
  viewCount?: number;
  orderCount?: number;
}

const statusConfig = {
  active: { label: 'Active', className: 'bg-green-100 text-green-700 border-green-200' },
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-700 border-gray-200' },
  seasonal: { label: 'Seasonal', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  out_of_stock: { label: 'Out of Stock', className: 'bg-red-100 text-red-700 border-red-200' },
  discontinued: { label: 'Discontinued', className: 'bg-gray-100 text-gray-500 border-gray-200' },
};

export function ProductHeader({
  name,
  category,
  status,
  tags,
  isOrganic,
  isFeatured,
  rating = 0,
  reviewCount = 0,
  viewCount = 0,
  orderCount = 0,
}: ProductHeaderProps) {
  const statusInfo = statusConfig[status];

  return (
    <div className="space-y-3">
      {/* Category & Status */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="text-xs font-medium">
          {category.name}
        </Badge>
        <Badge 
          variant="outline" 
          className={cn('text-xs font-medium border', statusInfo.className)}
        >
          {statusInfo.label}
        </Badge>
        {isOrganic && (
          <Badge className="bg-green-600 text-white text-xs gap-1">
            <Leaf className="w-3 h-3" />
            Organic
          </Badge>
        )}
        {isFeatured && (
          <Badge className="bg-amber-500 text-white text-xs gap-1">
            <Star className="w-3 h-3 fill-current" />
            Featured
          </Badge>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs bg-muted/50 text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Product Name */}
      <h1 className="text-xl lg:text-2xl font-bold text-foreground leading-tight">
        {name}
      </h1>

      {/* Stats Row */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {rating > 0 && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
            <span>({reviewCount} reviews)</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{viewCount.toLocaleString()} views</span>
        </div>
        <div className="flex items-center gap-1">
          <ShoppingBag className="w-4 h-4" />
          <span>{orderCount.toLocaleString()} sold</span>
        </div>
      </div>
    </div>
  );
}
