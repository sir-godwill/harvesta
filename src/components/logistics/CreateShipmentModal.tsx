import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CreateShipmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function CreateShipmentModal({ open, onOpenChange, onSubmit }: CreateShipmentModalProps) {
  const handleSubmit = () => {
    onSubmit({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Shipment</DialogTitle>
          <DialogDescription>Enter shipment details to create a new delivery</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Order ID</Label>
              <Input placeholder="ORD-2024-XXXX" />
            </div>
            <div className="space-y-2">
              <Label>Delivery Model</Label>
              <Select defaultValue="harvesta">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="harvesta">Harvestá Express</SelectItem>
                  <SelectItem value="supplier">Supplier Delivery</SelectItem>
                  <SelectItem value="third-party">Third Party</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Vendor Name</Label>
              <Input placeholder="Enter vendor name" />
            </div>
            <div className="space-y-2">
              <Label>Buyer Name</Label>
              <Input placeholder="Enter buyer name" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Pickup Location</Label>
            <Input placeholder="Street, City, Region" />
          </div>

          <div className="space-y-2">
            <Label>Delivery Location</Label>
            <Input placeholder="Street, City, Region" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Product Type</Label>
              <Select defaultValue="perishable">
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
              <Label>Weight (kg)</Label>
              <Input type="number" placeholder="0" />
            </div>
            <div className="space-y-2">
              <Label>Volume (m³)</Label>
              <Input type="number" step="0.1" placeholder="0" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Special Instructions</Label>
            <Textarea placeholder="Any special handling instructions..." rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Shipment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
