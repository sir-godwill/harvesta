import { useState } from "react";
import { Calculator, MapPin, Package, Truck, RefreshCw } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CostBreakdown } from "@/components/logistics/CostBreakdown";
import { mockCostConfiguration } from "@/data/mock-data";
import type { ZoneType, ProductType, DeliveryModel, CostBreakdown as CostBreakdownType } from "@/services/logistics-api";

/**
 * Cost Calculator Page - Estimate delivery costs
 * 
 * Dormant APIs: estimateDeliveryCost(), calculateLogisticsPricing()
 */
export default function CostCalculatorPage() {
  const [pickupZone, setPickupZone] = useState<ZoneType>("urban");
  const [deliveryZone, setDeliveryZone] = useState<ZoneType>("semi-urban");
  const [productType, setProductType] = useState<ProductType>("perishable");
  const [deliveryModel, setDeliveryModel] = useState<DeliveryModel>("harvesta");
  const [weight, setWeight] = useState<number>(50);
  const [volume, setVolume] = useState<number>(1);
  const [distance, setDistance] = useState<number>(150);
  const [calculatedCost, setCalculatedCost] = useState<CostBreakdownType | null>(null);

  const config = mockCostConfiguration;

  const calculateCost = () => {
    // Frontend-only calculation logic (will be replaced by API)
    const handlingFee = config.handlingFeeBase;
    const packagingFee = config.packagingFeeBase;
    const platformFee = config.platformFeePercentage / 100;
    
    const distanceCost = distance * config.distanceCostPerKm;
    const weightCost = weight * config.weightCostPerKg;
    const volumeCost = volume * config.volumeCostPerCubicM;
    
    const perishabilityMultiplier = config.perishabilityMultipliers[productType];
    const zoneMultiplier = config.zoneMultipliers[deliveryZone];
    
    const baseCost = handlingFee + packagingFee + distanceCost + weightCost + volumeCost;
    const adjustedCost = baseCost * perishabilityMultiplier * zoneMultiplier;
    const fuelBuffer = adjustedCost * (config.fuelBufferPercentage / 100);
    const total = adjustedCost + fuelBuffer;
    const platformAmount = total * platformFee;
    
    const breakdown: CostBreakdownType = {
      handlingFee,
      packagingFee,
      platformFee: platformAmount,
      distanceCost,
      weightCost,
      perishabilityMultiplier,
      roadConditionMultiplier: zoneMultiplier,
      fuelBuffer,
      total: total + platformAmount,
      currency: "XAF",
    };
    
    setCalculatedCost(breakdown);
    console.log("[DORMANT] estimateDeliveryCost called with:", { pickupZone, deliveryZone, weight, volume, productType, deliveryModel });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-CM", { style: "currency", currency: "XAF", minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <DashboardLayout title="Cost Calculator" subtitle="Estimate delivery costs" variant="admin">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Delivery Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Pickup Zone</Label>
                <Select value={pickupZone} onValueChange={(v) => setPickupZone(v as ZoneType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urban">Urban</SelectItem>
                    <SelectItem value="semi-urban">Semi-Urban</SelectItem>
                    <SelectItem value="rural-accessible">Rural (Accessible)</SelectItem>
                    <SelectItem value="rural-difficult">Rural (Difficult)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Delivery Zone</Label>
                <Select value={deliveryZone} onValueChange={(v) => setDeliveryZone(v as ZoneType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urban">Urban</SelectItem>
                    <SelectItem value="semi-urban">Semi-Urban</SelectItem>
                    <SelectItem value="rural-accessible">Rural (Accessible)</SelectItem>
                    <SelectItem value="rural-difficult">Rural (Difficult)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Product Type</Label>
                <Select value={productType} onValueChange={(v) => setProductType(v as ProductType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perishable">Perishable</SelectItem>
                    <SelectItem value="non-perishable">Non-Perishable</SelectItem>
                    <SelectItem value="bulk">Bulk</SelectItem>
                    <SelectItem value="fragile">Fragile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Delivery Model</Label>
                <Select value={deliveryModel} onValueChange={(v) => setDeliveryModel(v as DeliveryModel)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="harvesta">Harvestá Express</SelectItem>
                    <SelectItem value="supplier">Supplier Delivery</SelectItem>
                    <SelectItem value="third-party">Third Party</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Weight (kg)</Label>
                <Input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Volume (m³)</Label>
                <Input type="number" step="0.1" value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
              </div>
              <div className="space-y-2">
                <Label>Distance (km)</Label>
                <Input type="number" value={distance} onChange={(e) => setDistance(Number(e.target.value))} />
              </div>
            </div>

            <Button className="w-full" onClick={calculateCost}>
              <Calculator className="h-4 w-4 mr-2" />Calculate Cost
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {calculatedCost ? (
            <>
              <Card className="bg-gradient-primary text-primary-foreground">
                <CardContent className="p-6 text-center">
                  <p className="text-sm opacity-90 mb-1">Estimated Total Cost</p>
                  <p className="text-4xl font-bold">{formatCurrency(calculatedCost.total)}</p>
                </CardContent>
              </Card>
              <CostBreakdown breakdown={calculatedCost} />
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Calculator className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <h3 className="font-semibold mb-1">Enter Parameters</h3>
                <p className="text-sm text-muted-foreground">Fill in the delivery details and click Calculate</p>
              </CardContent>
            </Card>
          )}

          {/* Quick Reference */}
          <Card>
            <CardHeader><CardTitle className="text-base">Pricing Reference</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Handling Fee</span>
                <span>{formatCurrency(config.handlingFeeBase)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cost per KM</span>
                <span>{formatCurrency(config.distanceCostPerKm)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cost per KG</span>
                <span>{formatCurrency(config.weightCostPerKg)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Perishable Multiplier</span>
                <span>{config.perishabilityMultipliers.perishable}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rural Difficult Zone</span>
                <span>{config.zoneMultipliers["rural-difficult"]}x</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}