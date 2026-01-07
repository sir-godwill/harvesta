import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning" | "info";
  className?: string;
  onClick?: () => void;
}

const variantStyles = {
  default: "bg-card",
  primary: "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
  success: "bg-gradient-to-br from-success to-success/80 text-success-foreground",
  warning: "bg-gradient-to-br from-warning to-warning/80 text-warning-foreground",
  info: "bg-gradient-to-br from-info to-info/80 text-info-foreground",
};

const iconVariantStyles = {
  default: "bg-primary/10 text-primary",
  primary: "bg-primary-foreground/20 text-primary-foreground",
  success: "bg-success-foreground/20 text-success-foreground",
  warning: "bg-warning-foreground/20 text-warning-foreground",
  info: "bg-info-foreground/20 text-info-foreground",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
  onClick,
}: StatCardProps) {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-card-hover",
        variantStyles[variant],
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className={cn(
              "text-sm font-medium",
              variant === "default" ? "text-muted-foreground" : "opacity-90"
            )}>
              {title}
            </p>
            <p className="text-2xl md:text-3xl font-bold tracking-tight">
              {value}
            </p>
            {subtitle && (
              <p className={cn(
                "text-xs",
                variant === "default" ? "text-muted-foreground" : "opacity-80"
              )}>
                {subtitle}
              </p>
            )}
            {trend && (
              <p className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}>
                {trend.isPositive ? "+" : ""}{trend.value}% from last month
              </p>
            )}
          </div>
          <div className={cn(
            "p-2.5 rounded-xl",
            iconVariantStyles[variant]
          )}>
            <Icon className="h-5 w-5 md:h-6 md:w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
