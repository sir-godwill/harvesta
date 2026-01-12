import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Users } from "lucide-react";

interface AddPartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: PartnerFormData) => void;
}

interface PartnerFormData {
  name: string;
  type: "driver" | "transporter" | "company";
  vehicleType: string;
  contactPhone: string;
  licenseNumber: string;
  zones: string[];
}

const vehicleTypes = [
  "Motorcycle",
  "Toyota Hilux",
  "Mitsubishi Canter",
  "Refrigerated Van",
  "Fleet - Mixed",
  "Fleet - Heavy Duty",
];

const zoneOptions = [
  { id: "urban", label: "Urban" },
  { id: "semi-urban", label: "Semi-Urban" },
  { id: "rural-accessible", label: "Rural (Accessible)" },
  { id: "rural-difficult", label: "Rural (Difficult)" },
];

export function AddPartnerModal({ open, onOpenChange, onSubmit }: AddPartnerModalProps) {
  const [formData, setFormData] = useState<PartnerFormData>({
    name: "",
    type: "driver",
    vehicleType: "",
    contactPhone: "",
    licenseNumber: "",
    zones: [],
  });

  const toggleZone = (zoneId: string) => {
    setFormData((prev) => ({
      ...prev,
      zones: prev.zones.includes(zoneId)
        ? prev.zones.filter((z) => z !== zoneId)
        : [...prev.zones, zoneId],
    }));
  };

  const handleSubmit = () => {
    console.log("[DORMANT] addLogisticsPartner called:", formData);
    onSubmit?.(formData);
    onOpenChange(false);
    setFormData({
      name: "",
      type: "driver",
      vehicleType: "",
      contactPhone: "",
      licenseNumber: "",
      zones: [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Add New Partner
          </DialogTitle>
          <DialogDescription>
            Register a new logistics partner (driver, transporter, or company)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Partner Name *</Label>
            <Input
              placeholder="Enter full name or company name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Partner Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v as PartnerFormData["type"] })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="driver">Individual Driver</SelectItem>
                  <SelectItem value="transporter">Transporter</SelectItem>
                  <SelectItem value="company">Logistics Company</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Vehicle Type *</Label>
              <Select
                value={formData.vehicleType}
                onValueChange={(v) => setFormData({ ...formData, vehicleType: v })}
              >
                <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Contact Phone *</Label>
            <Input
              placeholder="+237 6XX XXX XXX"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>License Number *</Label>
            <Input
              placeholder="CMR-DRV-2024-XXX"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Operating Zones *</Label>
            <div className="grid grid-cols-2 gap-2">
              {zoneOptions.map((zone) => (
                <div
                  key={zone.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.zones.includes(zone.id) ? "bg-primary/10 border-primary" : "hover:bg-muted/30"
                  }`}
                  onClick={() => toggleZone(zone.id)}
                >
                  <Checkbox checked={formData.zones.includes(zone.id)} />
                  <span className="text-sm">{zone.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.vehicleType || !formData.contactPhone || formData.zones.length === 0}
          >
            Add Partner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
