import { useState } from 'react';
import { Tag, Package, Calendar, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sendOffer, Offer } from '@/lib/chat-api';
import { useToast } from '@/hooks/use-toast';
import { addDays } from 'date-fns';

interface OfferCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
  onOfferSent: (offer: Offer) => void;
}

const currencies = ['XAF', 'USD', 'EUR', 'NGN', 'GHS'];
const units = ['kg', 'ton', 'bag', 'piece', 'crate', 'liter'];
const validityOptions = [
  { label: '24 hours', days: 1 },
  { label: '3 days', days: 3 },
  { label: '7 days', days: 7 },
  { label: '14 days', days: 14 },
];

export function OfferCreationDialog({ 
  open, 
  onOpenChange, 
  conversationId, 
  onOfferSent 
}: OfferCreationDialogProps) {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [currency, setCurrency] = useState('XAF');
  const [deliveryTerms, setDeliveryTerms] = useState('');
  const [validityDays, setValidityDays] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const totalPrice = Number(quantity) * Number(pricePerUnit);

  const handleSubmit = async () => {
    if (!productName || !quantity || !pricePerUnit) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const offer = await sendOffer(conversationId, {
        productId: `prod_${Date.now()}`,
        productName,
        quantity: Number(quantity),
        unit,
        pricePerUnit: Number(pricePerUnit),
        currency,
        totalPrice,
        deliveryTerms: deliveryTerms || undefined,
        validUntil: addDays(new Date(), validityDays),
      });

      onOfferSent(offer);
      onOpenChange(false);
      resetForm();

      toast({
        title: "Offer Sent",
        description: `Your offer for ${productName} has been sent`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setProductName('');
    setQuantity('');
    setUnit('kg');
    setPricePerUnit('');
    setCurrency('XAF');
    setDeliveryTerms('');
    setValidityDays(3);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Tag className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle>Create Offer</DialogTitle>
              <DialogDescription>
                Send a product offer with pricing details
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name *</Label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., Organic Cassava (Premium Grade)"
                className="pl-10"
              />
            </div>
          </div>

          {/* Quantity & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map(u => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price & Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price per Unit *</Label>
              <Input
                id="price"
                type="number"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                placeholder="850"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Total Preview */}
          {quantity && pricePerUnit && (
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Amount</span>
                <span className="text-xl font-bold text-primary">
                  {currency} {totalPrice.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {quantity} {unit} × {currency} {Number(pricePerUnit).toLocaleString()}/{unit}
              </p>
            </div>
          )}

          {/* Delivery Terms */}
          <div className="space-y-2">
            <Label htmlFor="delivery">Delivery Terms</Label>
            <div className="relative">
              <Truck className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Textarea
                id="delivery"
                value={deliveryTerms}
                onChange={(e) => setDeliveryTerms(e.target.value)}
                placeholder="e.g., FOB Douala Port, delivery within 7 days"
                className="pl-10"
                rows={2}
              />
            </div>
          </div>

          {/* Validity Period */}
          <div className="space-y-2">
            <Label>Offer Valid For</Label>
            <div className="flex gap-2">
              {validityOptions.map(opt => (
                <Button
                  key={opt.days}
                  type="button"
                  variant={validityDays === opt.days ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setValidityDays(opt.days)}
                  className="flex-1"
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Offer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
