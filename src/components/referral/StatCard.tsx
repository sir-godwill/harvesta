import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  variant?: 'green' | 'orange' | 'brown' | 'neutral';
  className?: string;
}

const variantStyles = {
  green: 'stat-card-green',
  orange: 'stat-card-orange',
  brown: 'stat-card-brown',
  neutral: 'stat-card-neutral',
};

const iconBgStyles = {
  green: 'bg-primary/20 text-primary',
  orange: 'bg-accent/20 text-accent',
  brown: 'bg-secondary/20 text-secondary',
  neutral: 'bg-muted text-muted-foreground',
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  variant = 'neutral',
  className,
}: StatCardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div className={cn(variantStyles[variant], 'animate-fade-in', className)}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
        <div className={cn('p-2 rounded-lg', iconBgStyles[variant])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
      {trend !== undefined && (
        <div className="flex items-center gap-1">
          {isPositive && <TrendingUp className="w-4 h-4 text-emerald-500" />}
          {isNegative && <TrendingDown className="w-4 h-4 text-red-500" />}
          <span
            className={cn(
              'text-sm font-medium',
              isPositive && 'text-emerald-600',
              isNegative && 'text-red-500',
              !trend && 'text-muted-foreground'
            )}
          >
            {isPositive && '+'}
            {trend}%
          </span>
          {trendLabel && (
            <span className="text-xs text-muted-foreground">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
