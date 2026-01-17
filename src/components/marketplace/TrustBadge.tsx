import { Shield, CheckCircle, Award, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustBadgeProps {
  type: "verified" | "quality" | "top-seller" | "fast-response";
  size?: "sm" | "md";
  className?: string;
}

const badgeConfig = {
  verified: {
    icon: Shield,
    label: "Verified Supplier",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  quality: {
    icon: CheckCircle,
    label: "Quality Checked",
    className: "bg-secondary/10 text-secondary border-secondary/20",
  },
  "top-seller": {
    icon: Award,
    label: "Top Seller",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  "fast-response": {
    icon: Clock,
    label: "Fast Response",
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
};

export function TrustBadge({ type, size = "sm", className }: TrustBadgeProps) {
  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        size === "md" && "px-3 py-1.5 text-sm",
        className,
      )}
    >
      <Icon className={cn("w-3 h-3", size === "md" && "w-4 h-4")} />
      {config.label}
    </span>
  );
}

interface VendorRatingProps {
  rating: number;
  totalSales?: number;
  showSales?: boolean;
  className?: string;
}

export function VendorRating({
  rating,
  totalSales,
  showSales = true,
  className,
}: VendorRatingProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
        <span className="font-semibold text-foreground">
          {(rating ?? 0).toFixed(1)}
        </span>
      </div>
      {showSales && totalSales && (
        <span className="text-muted-foreground text-sm">
          • {totalSales.toLocaleString()} sales
        </span>
      )}
    </div>
  );
}
