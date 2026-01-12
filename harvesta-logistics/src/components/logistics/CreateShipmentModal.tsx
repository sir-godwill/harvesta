import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Truck, Plus, X } from "lucide-react";
import { mockPartners } from "@/data/mock-data";
import type { DeliveryModel, ProductType, ZoneType } from "@/services/logistics-api";

interface CreateShipmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: ShipmentFormData) => void;
}

interface ShipmentFormData {
  vendorName: string;
  buyerName: string;
  deliveryModel: DeliveryModel;
  productType: ProductType;
  pickupStreet: string;
  pickupCity: string;
  pickupRegion: string;
  deliveryStreet: string;
  deliveryCity: string;
  deliveryRegion: string;
  zone: ZoneType;
  items: { name: string; quantity: number; weight: number }[];
  assignedPartnerId?: string;
  notes: string;
}

export function CreateShipmentModal({ open, onOpenChange, onSubmit }: CreateShipmentModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ShipmentFormData>({
    vendorName: "",
    buyerName: "",
    deliveryModel: "harvesta",
    productType: "perishable",
    pickupStreet: "",
    pickupCity: "",
    pickupRegion: "",
    deliveryStreet: "",
    deliveryCity: "",
    deliveryRegion: "",
    zone: "urban",
    items: [{ name: "", quantity: 1, weight: 1 }],
    notes: "",
  });

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", quantity: 1, weight: 1 }],
    }));
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSubmit = () => {
    console.log("[DORMANT] createShipment called:", formData);
    onSubmit?.(formData);
    onOpenChange(false);
    setStep(1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Package className="h-4 w-4" />
              <span>Step 1: Order Details</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Vendor Name</Label>
                <Input
                  placeholder="Enter vendor name"
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Buyer Name</Label>
                <Input
                  placeholder="Enter buyer name"
                  value={formData.buyerName}
                  onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Delivery Model</Label>
                <Select
                  value={formData.deliveryModel}
                  onValueChange={(v) => setFormData({ ...formData, deliveryModel: v as DeliveryModel })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="harvesta">Harvestá Express</SelectItem>
                    <SelectItem value="supplier">Supplier Delivery</SelectItem>
                    <SelectItem value="third-party">Third Party</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Product Type</Label>
                <Select
                  value={formData.productType}
                  onValueChange={(v) => setFormData({ ...formData, productType: v as ProductType })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perishable">Perishable</SelectItem>
                    <SelectItem value="non-perishable">Non-Perishable</SelectItem>
                    <SelectItem value="bulk">Bulk</SelectItem>
                    <SelectItem value="fragile">Fragile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Zone Classification</Label>
              <Select
                value={formData.zone}
                onValueChange={(v) => setFormData({ ...formData, zone: v as ZoneType })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="urban">Urban</SelectItem>
                  <SelectItem value="semi-urban">Semi-Urban</SelectItem>
                  <SelectItem value="rural-accessible">Rural (Accessible)</SelectItem>
                  <SelectItem value="rural-difficult">Rural (Difficult Terrain)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <MapPin className="h-4 w-4" />
              <span>Step 2: Locations</span>
            </div>
            <div className="space-y-4 p-4 rounded-lg bg-muted/30">
              <h4 className="font-medium text-sm">Pickup Location</h4>
              <div className="grid gap-3 sm:grid-cols-3">
                <Input
                  placeholder="Street Address"
                  value={formData.pickupStreet}
                  onChange={(e) => setFormData({ ...formData, pickupStreet: e.target.value })}
                />
                <Input
                  placeholder="City"
                  value={formData.pickupCity}
                  onChange={(e) => setFormData({ ...formData, pickupCity: e.target.value })}
                />
                <Input
                  placeholder="Region"
                  value={formData.pickupRegion}
                  onChange={(e) => setFormData({ ...formData, pickupRegion: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-4 p-4 rounded-lg bg-muted/30">
              <h4 className="font-medium text-sm">Delivery Location</h4>
              <div className="grid gap-3 sm:grid-cols-3">
                <Input
                  placeholder="Street Address"
                  value={formData.deliveryStreet}
                  onChange={(e) => setFormData({ ...formData, deliveryStreet: e.target.value })}
                />
                <Input
                  placeholder="City"
                  value={formData.deliveryCity}
                  onChange={(e) => setFormData({ ...formData, deliveryCity: e.target.value })}
                />
                <Input
                  placeholder="Region"
                  value={formData.deliveryRegion}
                  onChange={(e) => setFormData({ ...formData, deliveryRegion: e.target.value })}
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>Step 3: Items</span>
              </div>
              <Button variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" />Add Item
              </Button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {formData.items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                  <Input
                    placeholder="Item name"
                    value={item.name}
                    onChange={(e) => updateItem(index, "name", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                    className="w-20"
                  />
                  <Input
                    type="number"
                    placeholder="Weight (kg)"
                    value={item.weight}
                    onChange={(e) => updateItem(index, "weight", Number(e.target.value))}
                    className="w-24"
                  />
                  {formData.items.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Truck className="h-4 w-4" />
              <span>Step 4: Assignment & Notes</span>
            </div>
            <div className="space-y-2">
              <Label>Assign Partner (Optional)</Label>
              <Select
                value={formData.assignedPartnerId}
                onValueChange={(v) => setFormData({ ...formData, assignedPartnerId: v })}
              >
                <SelectTrigger><SelectValue placeholder="Auto-assign (recommended)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Auto-assign</SelectItem>
                  {mockPartners.filter(p => p.isActive).map((partner) => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.name} ({partner.vehicleType}) - ⭐ {partner.rating}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Special Instructions</Label>
              <Textarea
                placeholder="Any special handling instructions or notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
              />
            </div>
            {/* Summary */}
            <div className="rounded-lg bg-muted/30 p-4 space-y-2 text-sm">
              <h4 className="font-medium">Summary</h4>
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vendor</span>
                  <span>{formData.vendorName || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buyer</span>
                  <span>{formData.buyerName || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Route</span>
                  <span>{formData.pickupCity || "?"} → {formData.deliveryCity || "?"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span>{formData.items.length} item(s), {formData.items.reduce((acc, i) => acc + i.weight, 0)} kg</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="capitalize">{formData.deliveryModel}</Badge>
                  <Badge variant="outline" className="capitalize">{formData.productType}</Badge>
                  <Badge variant="outline" className="capitalize">{formData.zone}</Badge>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Shipment</DialogTitle>
          <DialogDescription>
            Step {step} of 4 - Fill in the shipment details
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        {renderStep()}

        <DialogFooter className="gap-2 sm:gap-0">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={() => setStep(step + 1)}>Continue</Button>
          ) : (
            <Button onClick={handleSubmit}>Create Shipment</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
