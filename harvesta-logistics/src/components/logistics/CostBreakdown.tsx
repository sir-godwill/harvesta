import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CostBreakdown as CostBreakdownType } from "@/services/logistics-api";

interface CostBreakdownProps {
  breakdown: CostBreakdownType;
  title?: string;
}

export function CostBreakdown({
  breakdown,
  title = "Cost Breakdown",
}: CostBreakdownProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: breakdown.currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const lineItems = [
    { label: "Handling Fee", value: breakdown.handlingFee },
    { label: "Packaging Fee", value: breakdown.packagingFee },
    { label: "Platform Fee", value: breakdown.platformFee },
    { label: "Distance Cost", value: breakdown.distanceCost },
    { label: "Weight Cost", value: breakdown.weightCost },
    { label: "Fuel Buffer", value: breakdown.fuelBuffer },
  ];

  const hasMultipliers =
    breakdown.perishabilityMultiplier !== 1 ||
    breakdown.roadConditionMultiplier !== 1;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {lineItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-medium">{formatCurrency(item.value)}</span>
          </div>
        ))}

        {hasMultipliers && (
          <>
            <Separator className="my-2" />
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase">
                Multipliers Applied
              </p>
              {breakdown.perishabilityMultiplier !== 1 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Perishability Factor
                  </span>
                  <span className="font-medium text-warning">
                    ×{breakdown.perishabilityMultiplier.toFixed(2)}
                  </span>
                </div>
              )}
              {breakdown.roadConditionMultiplier !== 1 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Road Condition Factor
                  </span>
                  <span className="font-medium text-warning">
                    ×{breakdown.roadConditionMultiplier.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        <Separator className="my-2" />

        <div className="flex items-center justify-between">
          <span className="text-base font-semibold">Total</span>
          <span className="text-xl font-bold text-primary">
            {formatCurrency(breakdown.total)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
