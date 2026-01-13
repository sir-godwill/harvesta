import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddPartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function AddPartnerModal({ open, onOpenChange, onSubmit }: AddPartnerModalProps) {
  const handleSubmit = () => {
    onSubmit({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Logistics Partner</DialogTitle>
          <DialogDescription>Register a new driver, transporter, or logistics company</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Partner Name</Label>
            <Input placeholder="Enter name" />
          </div>

          <div className="space-y-2">
            <Label>Partner Type</Label>
            <Select defaultValue="driver">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="driver">Individual Driver</SelectItem>
                <SelectItem value="transporter">Transporter</SelectItem>
                <SelectItem value="company">Logistics Company</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input placeholder="+237 6XX XXX XXX" />
            </div>
            <div className="space-y-2">
              <Label>License Number</Label>
              <Input placeholder="CMR-DRV-XXXX" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Vehicle Type</Label>
            <Select defaultValue="pickup">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="motorcycle">Motorcycle</SelectItem>
                <SelectItem value="pickup">Pickup Truck</SelectItem>
                <SelectItem value="van">Van</SelectItem>
                <SelectItem value="refrigerated">Refrigerated Van</SelectItem>
                <SelectItem value="truck">Heavy Truck</SelectItem>
                <SelectItem value="fleet">Fleet - Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Service Zones</Label>
            <div className="flex flex-wrap gap-2">
              {["Urban", "Semi-Urban", "Rural (Accessible)", "Rural (Difficult)"].map((zone) => (
                <label key={zone} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded border-input" />
                  {zone}
                </label>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Partner</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
