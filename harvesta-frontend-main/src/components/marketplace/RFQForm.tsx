import { useState } from 'react';
import { Send, Calendar, MapPin, Package, DollarSign, Users, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RFQRequest } from '@/types/marketplace';

interface RFQFormProps {
  initialProductId?: string;
  initialProductName?: string;
  onSubmit: (rfq: RFQRequest) => void;
  isLoading?: boolean;
  className?: string;
}

const grades = ['Grade A', 'Grade AA', 'Grade B', 'Premium', 'Export Quality', 'Standard', 'Any'];

export function RFQForm({
  initialProductId,
  initialProductName,
  onSubmit,
  isLoading = false,
  className
}: RFQFormProps) {
  const [formData, setFormData] = useState<RFQRequest>({
    productId: initialProductId,
    productName: initialProductName || '',
    quantity: 0,
    grade: '',
    deliveryLocation: '',
    expectedDeliveryDate: '',
    budgetRange: undefined,
    notes: '',
    targetSuppliers: 'all',
    supplierIds: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = <K extends keyof RFQRequest>(field: K, value: RFQRequest[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {/* Product Information */}
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Product Information
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="productName">Product Name *</Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={e => updateField('productName', e.target.value)}
              placeholder="e.g., Arabica Coffee Beans"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Required Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity || ''}
              onChange={e => updateField('quantity', parseInt(e.target.value) || 0)}
              placeholder="e.g., 500"
              min={1}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Preferred Grade / Quality</Label>
            <Select
              value={formData.grade}
              onValueChange={value => updateField('grade', value)}
            >
              <SelectTrigger id="grade">
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map(grade => (
                  <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Delivery Details */}
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Delivery Details
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deliveryLocation">Delivery Location *</Label>
            <Input
              id="deliveryLocation"
              value={formData.deliveryLocation}
              onChange={e => updateField('deliveryLocation', e.target.value)}
              placeholder="City, Country"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedDeliveryDate">Expected Delivery Date *</Label>
            <Input
              id="expectedDeliveryDate"
              type="date"
              value={formData.expectedDeliveryDate}
              onChange={e => updateField('expectedDeliveryDate', e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Budget Range */}
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Budget Range (Optional)
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="budgetMin">Minimum Budget (USD)</Label>
            <Input
              id="budgetMin"
              type="number"
              placeholder="e.g., 1000"
              min={0}
              onChange={e => updateField('budgetRange', {
                min: parseInt(e.target.value) || 0,
                max: formData.budgetRange?.max || 0
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetMax">Maximum Budget (USD)</Label>
            <Input
              id="budgetMax"
              type="number"
              placeholder="e.g., 5000"
              min={0}
              onChange={e => updateField('budgetRange', {
                min: formData.budgetRange?.min || 0,
                max: parseInt(e.target.value) || 0
              })}
            />
          </div>
        </div>
      </div>

      {/* Supplier Targeting */}
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Target Suppliers
        </h3>

        <RadioGroup
          value={formData.targetSuppliers}
          onValueChange={value => updateField('targetSuppliers', value as RFQRequest['targetSuppliers'])}
          className="space-y-3"
        >
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
            <RadioGroupItem value="all" id="all" />
            <div>
              <p className="font-medium">All Matching Suppliers</p>
              <p className="text-sm text-muted-foreground">
                Send RFQ to all verified suppliers matching your criteria
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
            <RadioGroupItem value="multiple" id="multiple" />
            <div>
              <p className="font-medium">Multiple Selected Suppliers</p>
              <p className="text-sm text-muted-foreground">
                Choose specific suppliers from our verified list
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
            <RadioGroupItem value="specific" id="specific" />
            <div>
              <p className="font-medium">Specific Supplier</p>
              <p className="text-sm text-muted-foreground">
                Send RFQ to one particular supplier only
              </p>
            </div>
          </label>
        </RadioGroup>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={e => updateField('notes', e.target.value)}
          placeholder="Any specific requirements, quality standards, packaging preferences..."
          rows={4}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full gap-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⏳</span>
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submit Request for Quotation
          </>
        )}
      </Button>
    </form>
  );
}
