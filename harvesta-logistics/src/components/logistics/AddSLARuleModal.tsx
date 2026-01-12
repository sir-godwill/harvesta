import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText } from "lucide-react";
import type { ProductType, ZoneType } from "@/services/logistics-api";

interface AddSLARuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: SLARuleFormData) => void;
}

interface SLARuleFormData {
  name: string;
  productType: ProductType | "all";
  region: ZoneType | "all";
  maxDeliveryHours: number;
  penaltyPercentage: number;
  escalationTriggerHours: number;
  escrowReleaseCondition: string;
  priority: number;
}

export function AddSLARuleModal({ open, onOpenChange, onSubmit }: AddSLARuleModalProps) {
  const [formData, setFormData] = useState<SLARuleFormData>({
    name: "",
    productType: "all",
    region: "all",
    maxDeliveryHours: 24,
    penaltyPercentage: 10,
    escalationTriggerHours: 4,
    escrowReleaseCondition: "Upon delivery confirmation",
    priority: 1,
  });

  const handleSubmit = () => {
    console.log("[DORMANT] createSLARule called:", formData);
    onSubmit?.(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Add SLA Rule
          </DialogTitle>
          <DialogDescription>
            Define a new service level agreement rule for deliveries
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Rule Name *</Label>
            <Input
              placeholder="e.g., Perishable Urban Standard"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Product Type</Label>
              <Select
                value={formData.productType}
                onValueChange={(v) => setFormData({ ...formData, productType: v as ProductType | "all" })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="perishable">Perishable</SelectItem>
                  <SelectItem value="non-perishable">Non-Perishable</SelectItem>
                  <SelectItem value="bulk">Bulk</SelectItem>
                  <SelectItem value="fragile">Fragile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Region</Label>
              <Select
                value={formData.region}
                onValueChange={(v) => setFormData({ ...formData, region: v as ZoneType | "all" })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="urban">Urban</SelectItem>
                  <SelectItem value="semi-urban">Semi-Urban</SelectItem>
                  <SelectItem value="rural-accessible">Rural (Accessible)</SelectItem>
                  <SelectItem value="rural-difficult">Rural (Difficult)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Max Delivery (hours) *</Label>
              <Input
                type="number"
                value={formData.maxDeliveryHours}
                onChange={(e) => setFormData({ ...formData, maxDeliveryHours: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Penalty (%) *</Label>
              <Input
                type="number"
                value={formData.penaltyPercentage}
                onChange={(e) => setFormData({ ...formData, penaltyPercentage: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Escalation (hours) *</Label>
              <Input
                type="number"
                value={formData.escalationTriggerHours}
                onChange={(e) => setFormData({ ...formData, escalationTriggerHours: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Priority Level</Label>
            <Select
              value={String(formData.priority)}
              onValueChange={(v) => setFormData({ ...formData, priority: Number(v) })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - Highest</SelectItem>
                <SelectItem value="2">2 - High</SelectItem>
                <SelectItem value="3">3 - Medium</SelectItem>
                <SelectItem value="4">4 - Low</SelectItem>
                <SelectItem value="5">5 - Lowest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Escrow Release Condition</Label>
            <Textarea
              placeholder="Describe when escrow should be released..."
              value={formData.escrowReleaseCondition}
              onChange={(e) => setFormData({ ...formData, escrowReleaseCondition: e.target.value })}
              rows={2}
            />
          </div>

          <div className="rounded-lg bg-muted/30 p-3 text-sm">
            <p className="text-muted-foreground">
              This rule will apply to <strong className="text-foreground">{formData.productType === "all" ? "all product types" : formData.productType}</strong> in{" "}
              <strong className="text-foreground">{formData.region === "all" ? "all regions" : formData.region}</strong>.
              Deliveries exceeding <strong className="text-foreground">{formData.maxDeliveryHours} hours</strong> will incur a{" "}
              <strong className="text-destructive">{formData.penaltyPercentage}%</strong> penalty.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.name}>
            Create Rule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
