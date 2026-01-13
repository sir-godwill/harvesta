import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CostBreakdown as CostBreakdownType } from "@/services/logistics-api";

interface CostBreakdownProps {
  breakdown: CostBreakdownType;
}

export function CostBreakdown({ breakdown }: CostBreakdownProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const items = [
    { label: "Handling Fee", value: breakdown.handlingFee },
    { label: "Packaging Fee", value: breakdown.packagingFee },
    { label: "Platform Fee", value: breakdown.platformFee },
    { label: "Distance Cost", value: breakdown.distanceCost },
    { label: "Weight Cost", value: breakdown.weightCost },
    { label: "Fuel Buffer", value: breakdown.fuelBuffer },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span>{formatCurrency(item.value)}</span>
          </div>
        ))}
        
        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Perishability Multiplier</span>
            <span>{breakdown.perishabilityMultiplier}x</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Road Condition Multiplier</span>
            <span>{breakdown.roadConditionMultiplier}x</span>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(breakdown.total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
