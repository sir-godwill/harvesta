import { Check, Truck, Store, Building2, MapPin, Clock, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import type { DeliveryOption, DeliveryModel } from "@/services/logistics-api";

interface DeliveryOptionCardProps {
  option: DeliveryOption;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function DeliveryOptionCard({
  option,
  isSelected,
  onSelect,
}: DeliveryOptionCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: option.cost.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getModelIcon = (model: DeliveryModel) => {
    const icons: Record<DeliveryModel, React.ReactNode> = {
      harvesta: <Truck className="h-5 w-5" />,
      supplier: <Store className="h-5 w-5" />,
      "third-party": <Building2 className="h-5 w-5" />,
      "buyer-pickup": <MapPin className="h-5 w-5" />,
    };
    return icons[model];
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-elevated",
        isSelected && "border-2 border-primary ring-2 ring-primary/20",
        !option.isAvailable && "cursor-not-allowed opacity-60"
      )}
      onClick={() => option.isAvailable && onSelect?.()}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {getModelIcon(option.model)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">{option.name}</h3>
                {isSelected && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {option.description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">
              {formatCurrency(option.cost.total)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{option.estimatedDays}</span>
            </div>
            <RiskBadge level={option.riskLevel} />
          </div>
          {option.model === "harvesta" && (
            <div className="flex items-center gap-1 text-xs text-primary">
              <Shield className="h-3 w-3" />
              <span>Protected</span>
            </div>
          )}
        </div>

        {!option.isAvailable && option.eligibilityReason && (
          <p className="mt-3 text-xs text-destructive">
            {option.eligibilityReason}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
