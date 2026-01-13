import React, { useState } from 'react';
import { LogisticsLayout } from '@/components/logistics/LogisticsLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Calculator, 
  Package, 
  Truck,
  MapPin,
  Scale,
  Box,
  Thermometer,
  DollarSign,
  Info,
  RefreshCw
} from 'lucide-react';
import { ZoneType, ProductType, DeliveryModel, CostBreakdown } from '@/services/logistics-api';
import { CostBreakdown as CostBreakdownComponent } from '@/components/logistics/CostBreakdown';

const costConfig = {
  handlingFeeBase: 15,
  packagingFeeBase: 10,
  platformFeePercentage: 5,
  distanceCostPerKm: 0.5,
  weightCostPerKg: 0.3,
  volumeCostPerCubicM: 50,
  fuelBufferPercentage: 10,
  perishabilityMultipliers: {
    'perishable': 1.5,
    'non-perishable': 1.0,
    'bulk': 0.9,
    'fragile': 1.3
  },
  zoneMultipliers: {
    'urban': 1.0,
    'semi-urban': 1.2,
    'rural-accessible': 1.5,
    'rural-difficult': 2.0
  },
  deliveryModelMultipliers: {
    'harvesta': 1.0,
    'supplier': 0.8,
    'third-party': 1.1
  }
};

const distanceMatrix: Record<string, Record<string, number>> = {
  'urban': { 'urban': 15, 'semi-urban': 35, 'rural-accessible': 60, 'rural-difficult': 100 },
  'semi-urban': { 'urban': 35, 'semi-urban': 25, 'rural-accessible': 45, 'rural-difficult': 80 },
  'rural-accessible': { 'urban': 60, 'semi-urban': 45, 'rural-accessible': 30, 'rural-difficult': 50 },
  'rural-difficult': { 'urban': 100, 'semi-urban': 80, 'rural-accessible': 50, 'rural-difficult': 40 }
};

const LogisticsCalculator = () => {
  const [pickupZone, setPickupZone] = useState<ZoneType>('urban');
  const [deliveryZone, setDeliveryZone] = useState<ZoneType>('semi-urban');
  const [weight, setWeight] = useState<number>(50);
  const [volume, setVolume] = useState<number>(0.5);
  const [productType, setProductType] = useState<ProductType>('perishable');
  const [deliveryModel, setDeliveryModel] = useState<DeliveryModel>('harvesta');
  const [isUrgent, setIsUrgent] = useState(false);
  const [requiresColdChain, setRequiresColdChain] = useState(false);
  const [calculatedCost, setCalculatedCost] = useState<CostBreakdown | null>(null);

  const calculateCost = () => {
    const distance = distanceMatrix[pickupZone][deliveryZone];
    
    // Base costs
    const handlingFee = costConfig.handlingFeeBase;
    const packagingFee = costConfig.packagingFeeBase;
    
    // Distance cost
    const distanceCost = distance * costConfig.distanceCostPerKm;
    
    // Weight cost
    const weightCost = weight * costConfig.weightCostPerKg;
    
    // Volume cost (if applicable)
    const volumeCost = volume * costConfig.volumeCostPerCubicM;
    
    // Multipliers
    const perishabilityMultiplier = costConfig.perishabilityMultipliers[productType];
    const zoneMultiplier = Math.max(
      costConfig.zoneMultipliers[pickupZone],
      costConfig.zoneMultipliers[deliveryZone]
    );
    const deliveryModelMult = costConfig.deliveryModelMultipliers[deliveryModel];
    
    // Base subtotal
    let subtotal = (handlingFee + packagingFee + distanceCost + weightCost + Math.max(0, volumeCost - 20));
    
    // Apply multipliers
    subtotal *= perishabilityMultiplier * zoneMultiplier * deliveryModelMult;
    
    // Urgent delivery surcharge
    if (isUrgent) {
      subtotal *= 1.5;
    }
    
    // Cold chain surcharge
    if (requiresColdChain) {
      subtotal += 25;
    }
    
    // Platform fee
    const platformFee = subtotal * (costConfig.platformFeePercentage / 100);
    
    // Fuel buffer
    const fuelBuffer = subtotal * (costConfig.fuelBufferPercentage / 100);
    
    // Total
    const total = subtotal + platformFee + fuelBuffer;
    
    setCalculatedCost({
      handlingFee,
      packagingFee,
      platformFee: Math.round(platformFee * 100) / 100,
      distanceCost: Math.round(distanceCost * 100) / 100,
      weightCost: Math.round(weightCost * 100) / 100,
      perishabilityMultiplier,
      roadConditionMultiplier: zoneMultiplier,
      fuelBuffer: Math.round(fuelBuffer * 100) / 100,
      total: Math.round(total * 100) / 100,
      currency: 'GHS'
    });
  };

  const resetForm = () => {
    setPickupZone('urban');
    setDeliveryZone('semi-urban');
    setWeight(50);
    setVolume(0.5);
    setProductType('perishable');
    setDeliveryModel('harvesta');
    setIsUrgent(false);
    setRequiresColdChain(false);
    setCalculatedCost(null);
  };

  return (
    <LogisticsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cost Calculator</h1>
          <p className="text-muted-foreground">Estimate delivery costs based on shipment parameters</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator Form */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Calculator className="h-5 w-5" />
                Shipment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Zones */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Pickup Zone
                  </Label>
                  <Select value={pickupZone} onValueChange={(v: ZoneType) => setPickupZone(v)}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urban">Urban</SelectItem>
                      <SelectItem value="semi-urban">Semi-Urban</SelectItem>
                      <SelectItem value="rural-accessible">Rural (Accessible)</SelectItem>
                      <SelectItem value="rural-difficult">Rural (Difficult)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Delivery Zone
                  </Label>
                  <Select value={deliveryZone} onValueChange={(v: ZoneType) => setDeliveryZone(v)}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urban">Urban</SelectItem>
                      <SelectItem value="semi-urban">Semi-Urban</SelectItem>
                      <SelectItem value="rural-accessible">Rural (Accessible)</SelectItem>
                      <SelectItem value="rural-difficult">Rural (Difficult)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Weight & Volume */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Weight (kg)
                  </Label>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    min={0}
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <Box className="h-4 w-4" />
                    Volume (m³)
                  </Label>
                  <Input
                    type="number"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    min={0}
                    step={0.1}
                    className="bg-background border-border"
                  />
                </div>
              </div>

              <Separator />

              {/* Product Type & Delivery Model */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Product Type
                  </Label>
                  <Select value={productType} onValueChange={(v: ProductType) => setProductType(v)}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="perishable">Perishable</SelectItem>
                      <SelectItem value="non-perishable">Non-Perishable</SelectItem>
                      <SelectItem value="bulk">Bulk</SelectItem>
                      <SelectItem value="fragile">Fragile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Delivery Model
                  </Label>
                  <Select value={deliveryModel} onValueChange={(v: DeliveryModel) => setDeliveryModel(v)}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="harvesta">Harvestá Fleet</SelectItem>
                      <SelectItem value="supplier">Supplier Delivery</SelectItem>
                      <SelectItem value="third-party">Third-Party Partner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground">Urgent Delivery</Label>
                    <p className="text-xs text-muted-foreground">50% surcharge for same-day delivery</p>
                  </div>
                  <Switch checked={isUrgent} onCheckedChange={setIsUrgent} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      Cold Chain Required
                    </Label>
                    <p className="text-xs text-muted-foreground">Additional GHS 25 for refrigerated transport</p>
                  </div>
                  <Switch checked={requiresColdChain} onCheckedChange={setRequiresColdChain} />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={calculateCost} className="flex-1 bg-primary text-primary-foreground">
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Cost
                </Button>
                <Button onClick={resetForm} variant="outline" className="border-border">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {calculatedCost ? (
              <>
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <DollarSign className="h-5 w-5" />
                      Estimated Cost
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <p className="text-4xl font-bold text-primary">
                        {calculatedCost.currency} {calculatedCost.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Estimated delivery: {distanceMatrix[pickupZone][deliveryZone]} km
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <CostBreakdownComponent breakdown={calculatedCost} />

                <Card className="bg-blue-500/10 border-blue-500/30">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-300">
                        <p className="font-medium mb-1">Note</p>
                        <p>This is an estimate. Final cost may vary based on actual distance, road conditions, and fuel prices at the time of delivery.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="p-12 text-center">
                  <Calculator className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Enter Shipment Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Fill in the form and click "Calculate Cost" to get an estimate
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Pricing Guide */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm text-foreground">Pricing Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Handling Fee</span>
                  <span className="text-foreground">GHS {costConfig.handlingFeeBase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Packaging Fee</span>
                  <span className="text-foreground">GHS {costConfig.packagingFeeBase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Distance Rate</span>
                  <span className="text-foreground">GHS {costConfig.distanceCostPerKm}/km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight Rate</span>
                  <span className="text-foreground">GHS {costConfig.weightCostPerKg}/kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="text-foreground">{costConfig.platformFeePercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fuel Buffer</span>
                  <span className="text-foreground">{costConfig.fuelBufferPercentage}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </LogisticsLayout>
  );
};

export default LogisticsCalculator;
