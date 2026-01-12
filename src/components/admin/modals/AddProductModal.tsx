import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Package, DollarSign, Scale, Tag, Leaf, Check, Image as ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { value: 'grains', label: 'Grains & Cereals' },
  { value: 'vegetables', label: 'Vegetables' },
  { value: 'fruits', label: 'Fruits' },
  { value: 'legumes', label: 'Legumes' },
  { value: 'roots', label: 'Roots & Tubers' },
  { value: 'spices', label: 'Spices & Herbs' },
  { value: 'oils', label: 'Oils & Fats' },
  { value: 'dairy', label: 'Dairy Products' },
];

const grades = ['Premium', 'Grade A', 'Grade B', 'Standard'];

export function AddProductModal({ open, onOpenChange }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    unit: 'kg',
    minOrder: '',
    stock: '',
    grade: '',
    isOrganic: false,
    certifications: [] as string[],
    images: [] as File[],
  });

  const updateFormData = (field: string, value: string | boolean | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.category || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Product added successfully!');
    onOpenChange(false);
    setFormData({
      name: '',
      category: '',
      description: '',
      price: '',
      unit: 'kg',
      minOrder: '',
      stock: '',
      grade: '',
      isOrganic: false,
      certifications: [],
      images: [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-display flex items-center gap-2">
            <Package className="h-5 w-5" />
            Add New Product
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Upload */}
          <div className="border-2 border-dashed border-muted rounded-xl p-6 text-center">
            <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-3">Upload product images</p>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Choose Images
            </Button>
            <p className="text-xs text-muted-foreground mt-2">PNG, JPG up to 5MB each (max 5 images)</p>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="productName">Product Name *</Label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="productName"
                  placeholder="e.g., Organic Cassava Flour"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(v) => updateFormData('category', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="grade">Quality Grade</Label>
              <Select value={formData.grade} onValueChange={(v) => updateFormData('grade', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map(grade => (
                    <SelectItem key={grade} value={grade.toLowerCase()}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your product, its origin, quality, and special features..."
              rows={3}
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
            />
          </div>

          {/* Pricing & Inventory */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  className="pl-10"
                  value={formData.price}
                  onChange={(e) => updateFormData('price', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(v) => updateFormData('unit', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogram</SelectItem>
                  <SelectItem value="ton">Metric Ton</SelectItem>
                  <SelectItem value="lb">Pound</SelectItem>
                  <SelectItem value="unit">Unit</SelectItem>
                  <SelectItem value="bag">Bag (50kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minOrder">Min. Order</Label>
              <div className="relative">
                <Scale className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="minOrder"
                  type="number"
                  placeholder="100"
                  className="pl-10"
                  value={formData.minOrder}
                  onChange={(e) => updateFormData('minOrder', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                placeholder="Available quantity"
                value={formData.stock}
                onChange={(e) => updateFormData('stock', e.target.value)}
              />
            </div>
          </div>

          {/* Certifications */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-3">
              <Leaf className="h-5 w-5 text-success" />
              <div>
                <p className="font-medium">Organic Certified</p>
                <p className="text-sm text-muted-foreground">This product is organically produced</p>
              </div>
            </div>
            <Switch
              checked={formData.isOrganic}
              onCheckedChange={(checked) => updateFormData('isOrganic', checked)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            <Check className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}