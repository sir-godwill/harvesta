import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Category } from '@/types/marketplace';

interface CategoryCardProps {
  category: Category;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export function CategoryCard({ category, variant = 'default', className }: CategoryCardProps) {
  if (variant === 'compact') {
    return (
      <Link
        to={`/category/${category.slug}`}
        className={cn(
          'flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all',
          className
        )}
      >
        <span className="text-2xl">{category.icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{category.name}</h3>
          <p className="text-xs text-muted-foreground">
            {category.productCount.toLocaleString()} products
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link
        to={`/category/${category.slug}`}
        className={cn(
          'group relative overflow-hidden rounded-2xl aspect-[16/9] card-hover',
          className
        )}
      >
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">{category.icon}</span>
            <h3 className="text-xl font-bold text-foreground">{category.name}</h3>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {category.description}
          </p>
          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              {category.productCount.toLocaleString()} products
            </Badge>
            <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
              Explore
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/category/${category.slug}`}
      className={cn(
        'group bg-card rounded-xl border border-border overflow-hidden card-hover',
        className
      )}
    >
      <div className="aspect-video relative overflow-hidden bg-muted">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <span className="text-4xl">{category.icon}</span>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {category.description}
        </p>
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Badge variant="outline" className="text-xs">
            {category.productCount.toLocaleString()} products
          </Badge>
          <Badge variant="outline" className="text-xs">
            {category.subCategories.length} subcategories
          </Badge>
        </div>
      </div>
    </Link>
  );
}
