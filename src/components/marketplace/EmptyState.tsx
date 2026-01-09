import { ShoppingCart, Search, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  type: 'cart' | 'search' | 'orders';
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

const emptyStateConfig = {
  cart: {
    icon: ShoppingCart,
    title: 'Your cart is empty',
    description: "Looks like you haven't added any products yet. Explore our marketplace to find quality agricultural products.",
    actionLabel: 'Start Shopping',
    actionHref: '/',
  },
  search: {
    icon: Search,
    title: 'No results found',
    description: "We couldn't find any products matching your search. Try different keywords or browse our categories.",
    actionLabel: 'Browse Products',
    actionHref: '/',
  },
  orders: {
    icon: Package,
    title: 'No orders yet',
    description: "You haven't placed any orders yet. Start shopping to see your orders here.",
    actionLabel: 'Start Shopping',
    actionHref: '/',
  },
};

export function EmptyState({
  type,
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: EmptyStateProps) {
  const config = emptyStateConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center py-16 px-4',
      className
    )}>
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Icon className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {title || config.title}
      </h3>
      <p className="text-muted-foreground max-w-md mb-6">
        {description || config.description}
      </p>
      <Button asChild size="lg">
        <Link to={actionHref || config.actionHref}>
          {actionLabel || config.actionLabel}
        </Link>
      </Button>
    </div>
  );
}
