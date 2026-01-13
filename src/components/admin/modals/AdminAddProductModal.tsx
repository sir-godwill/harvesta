import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AdminAddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface Seller {
  id: string;
  company_name: string;
}

interface Category {
  id: string;
  name: string;
}

export function AdminAddProductModal({ open, onOpenChange, onSuccess }: AdminAddProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    supplier_id: '',
    category_id: '',
    unit_of_measure: 'kg',
    min_order_quantity: 1,
    price: 0,
    stock: 0,
    is_organic: false,
    is_featured: false,
    origin_country: '',
    origin_region: '',
  });

  useEffect(() => {
    if (open) {
      fetchSellers();
      fetchCategories();
    }
  }, [open]);

  const fetchSellers = async () => {
    const { data } = await supabase
      .from('suppliers')
      .select('id, company_name')
      .eq('is_active', true)
      .order('company_name');
    if (data) setSellers(data);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name')
      .eq('is_active', true)
      .order('name');
    if (data) setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.supplier_id) {
      toast.error('Please fill in required fields');
      return;
    }

    setLoading(true);

    try {
      // Generate slug
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Create product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: formData.name,
          description: formData.description,
          short_description: formData.short_description,
          supplier_id: formData.supplier_id,
          category_id: formData.category_id || null,
          unit_of_measure: formData.unit_of_measure,
          min_order_quantity: formData.min_order_quantity,
          is_organic: formData.is_organic,
          is_featured: formData.is_featured,
          origin_country: formData.origin_country,
          origin_region: formData.origin_region,
          slug: slug,
          status: 'active',
        })
        .select()
        .single();

      if (productError) throw productError;

      // Create default variant
      const { data: variant, error: variantError } = await supabase
        .from('product_variants')
        .insert({
          product_id: product.id,
          name: 'Default',
          is_default: true,
          is_active: true,
          stock_quantity: formData.stock,
        })
        .select()
        .single();

      if (variantError) throw variantError;

      // Create pricing tier
      if (formData.price > 0) {
        const { error: pricingError } = await supabase
          .from('pricing_tiers')
          .insert({
            product_variant_id: variant.id,
            min_quantity: 1,
            price_per_unit: formData.price,
            is_active: true,
          });

        if (pricingError) throw pricingError;
      }

      toast.success('Product added successfully');
      onOpenChange(false);
      onSuccess?.();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        short_description: '',
        supplier_id: '',
        category_id: '',
        unit_of_measure: 'kg',
        min_order_quantity: 1,
        price: 0,
        stock: 0,
        is_organic: false,
        is_featured: false,
        origin_country: '',
        origin_region: '',
      });
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast.error(error.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Create a new product listing for the marketplace
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Premium Organic Cocoa Beans"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Seller *</Label>
              <Select
                value={formData.supplier_id}
                onValueChange={(value) => setFormData({ ...formData, supplier_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select seller" />
                </SelectTrigger>
                <SelectContent>
                  {sellers.map((seller) => (
                    <SelectItem key={seller.id} value={seller.id}>
                      {seller.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (XAF)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit of Measure</Label>
              <Select
                value={formData.unit_of_measure}
                onValueChange={(value) => setFormData({ ...formData, unit_of_measure: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogram (kg)</SelectItem>
                  <SelectItem value="ton">Ton</SelectItem>
                  <SelectItem value="bag">Bag</SelectItem>
                  <SelectItem value="piece">Piece</SelectItem>
                  <SelectItem value="liter">Liter</SelectItem>
                  <SelectItem value="crate">Crate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="moq">Min Order Quantity</Label>
              <Input
                id="moq"
                type="number"
                min="1"
                value={formData.min_order_quantity}
                onChange={(e) => setFormData({ ...formData, min_order_quantity: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="origin_country">Origin Country</Label>
              <Input
                id="origin_country"
                value={formData.origin_country}
                onChange={(e) => setFormData({ ...formData, origin_country: e.target.value })}
                placeholder="e.g., Cameroon"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="origin_region">Origin Region</Label>
              <Input
                id="origin_region"
                value={formData.origin_region}
                onChange={(e) => setFormData({ ...formData, origin_region: e.target.value })}
                placeholder="e.g., South West"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="short_description">Short Description</Label>
              <Input
                id="short_description"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="Brief product description for listings"
                maxLength={150}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed product description..."
                rows={3}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="is_organic"
                  checked={formData.is_organic}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_organic: checked })}
                />
                <Label htmlFor="is_organic">Organic</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Featured</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
