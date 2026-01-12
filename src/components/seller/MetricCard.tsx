import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  variant?: "default" | "primary" | "accent" | "warning" | "success";
  delay?: number;
}

const variantStyles = {
  default: "bg-card",
  primary: "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20",
  accent: "bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20",
  warning: "bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20",
  success: "bg-gradient-to-br from-success/10 to-success/5 border-success/20",
};

const iconStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/20 text-primary",
  accent: "bg-accent/20 text-accent",
  warning: "bg-warning/20 text-warning",
  success: "bg-success/20 text-success",
};

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  variant = "default",
  delay = 0,
}: MetricCardProps) {
  const isPositiveTrend = trend && trend > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        "rounded-xl border p-3 md:p-4 shadow-soft transition-shadow hover:shadow-medium",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 md:space-y-2 min-w-0 flex-1">
          <p className="text-xs md:text-sm font-medium text-muted-foreground truncate">{title}</p>
          <p className="text-lg md:text-2xl font-bold text-foreground truncate">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 flex-wrap">
              {isPositiveTrend ? (
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-success flex-shrink-0" />
              ) : (
                <TrendingDown className="w-3 h-3 md:w-4 md:h-4 text-destructive flex-shrink-0" />
              )}
              <span className={cn(
                "text-xs md:text-sm font-medium",
                isPositiveTrend ? "text-success" : "text-destructive"
              )}>
                {isPositiveTrend ? "+" : ""}{trend}%
              </span>
              {trendLabel && (
                <span className="text-xs text-muted-foreground hidden sm:inline">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className={cn(
          "p-2 md:p-3 rounded-lg md:rounded-xl flex-shrink-0",
          iconStyles[variant]
        )}>
          <Icon className="w-4 h-4 md:w-5 md:h-5" />
        </div>
      </div>
    </motion.div>
  );
}
