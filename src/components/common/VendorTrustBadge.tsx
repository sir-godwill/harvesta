import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Shield, Award, Star, BadgeCheck, Crown } from "lucide-react";

export type TrustLevel = "verified" | "gold" | "platinum" | "trusted" | "premium";

interface VendorTrustBadgeProps {
  level: TrustLevel;
  className?: string;
  showLabel?: boolean;
}

const trustConfig: Record<TrustLevel, {
  label: string;
  icon: React.ElementType;
  className: string;
}> = {
  verified: {
    label: "Verified",
    icon: BadgeCheck,
    className: "bg-success/10 text-success border-success/30",
  },
  gold: {
    label: "Gold Supplier",
    icon: Award,
    className: "bg-warning/10 text-warning border-warning/30",
  },
  platinum: {
    label: "Platinum",
    icon: Crown,
    className: "bg-muted text-foreground border-border",
  },
  trusted: {
    label: "Trusted",
    icon: Shield,
    className: "bg-info/10 text-info border-info/30",
  },
  premium: {
    label: "Premium",
    icon: Star,
    className: "bg-primary/10 text-primary border-primary/30",
  },
};

export function VendorTrustBadge({ level, className, showLabel = true }: VendorTrustBadgeProps) {
  const config = trustConfig[level];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "gap-1 font-medium text-xs border",
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {showLabel && config.label}
    </Badge>
  );
}
