import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon, Package, ShoppingCart, Heart, Store, Search, FileText } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "default" | "orders" | "cart" | "wishlist" | "suppliers" | "search" | "documents";
  className?: string;
}

const defaultIcons: Record<string, LucideIcon> = {
  default: Package,
  orders: FileText,
  cart: ShoppingCart,
  wishlist: Heart,
  suppliers: Store,
  search: Search,
  documents: FileText,
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = "default",
  className,
}: EmptyStateProps) {
  const Icon = icon || defaultIcons[variant];

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-6 text-center",
      className
    )}>
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
      )}
      
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-primary hover:bg-primary/90">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
