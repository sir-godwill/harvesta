import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Eye,
  Package,
  ImagePlus,
  X,
  Plus,
  Trash2,
  Info,
  Globe,
  DollarSign,
  Layers,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const categories = [
  { id: 'grains', name: 'Grains & Cereals' },
  { id: 'vegetables', name: 'Fresh Vegetables' },
  { id: 'fruits', name: 'Fresh Fruits' },
  { id: 'tubers', name: 'Tubers & Roots' },
  { id: 'cocoa', name: 'Cocoa & Coffee' },
  { id: 'spices', name: 'Spices & Herbs' },
  { id: 'oils', name: 'Oils & Fats' },
  { id: 'livestock', name: 'Livestock & Poultry' },
];

const units = ['kg', 'ton', 'bag', 'piece', 'crate', 'liter', 'dozen', 'carton'];

interface PricingTier {
  minQuantity: number;
  maxQuantity: number | null;
  pricePerUnit: number;
}

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  stock: number;
  priceModifier: number;
}

export default function SellerProductAdd() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Basic Info
  const [productName, setProductName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [sku, setSku] = useState('');
  const [unit, setUnit] = useState('kg');

  // Images
  const [images, setImages] = useState<string[]>([]);

  // Pricing
  const [domesticPrice, setDomesticPrice] = useState('');
  const [internationalPrice, setInternationalPrice] = useState('');
  const [enableInternational, setEnableInternational] = useState(false);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([
    { minQuantity: 1, maxQuantity: 99, pricePerUnit: 0 },
    { minQuantity: 100, maxQuantity: 499, pricePerUnit: 0 },
    { minQuantity: 500, maxQuantity: null, pricePerUnit: 0 },
  ]);

  // Inventory
  const [stock, setStock] = useState('');
  const [minOrderQuantity, setMinOrderQuantity] = useState('1');
  const [maxOrderQuantity, setMaxOrderQuantity] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');

  // Variants
  const [enableVariants, setEnableVariants] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Product Details
  const [origin, setOrigin] = useState('');
  const [isOrganic, setIsOrganic] = useState(false);
  const [harvestDate, setHarvestDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [leadTime, setLeadTime] = useState('');

  const handleAddImage = () => {
    // Mock adding an image
    const mockImages = [
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg',
    ];
    if (images.length < 6) {
      setImages([...images, mockImages[images.length % 3]]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        id: `var_${Date.now()}`,
        name: '',
        sku: '',
        stock: 0,
        priceModifier: 0,
      },
    ]);
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleSubmit = async (status: 'draft' | 'active') => {
    if (!productName || !category || !domesticPrice || !stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success(status === 'draft' ? 'Product saved as draft' : 'Product published successfully');
    navigate('/seller/products');
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/seller/products">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Add New Product</h1>
              <p className="text-muted-foreground">Create a new product listing</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSubmit('draft')} disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700" 
              onClick={() => handleSubmit('active')} 
              disabled={isSubmitting}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>

        {/* Main Form */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Product Information
                </CardTitle>
                <CardDescription>Basic details about your product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input 
                    id="name" 
                    value={productName} 
                    onChange={(e) => setProductName(e.target.value)} 
                    placeholder="e.g., Premium Organic Cocoa Beans"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDesc">Short Description</Label>
                  <Input 
                    id="shortDesc" 
                    value={shortDescription} 
                    onChange={(e) => setShortDescription(e.target.value)} 
                    placeholder="Brief description for search results"
                    maxLength={150}
                  />
                  <p className="text-xs text-muted-foreground">{shortDescription.length}/150 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Detailed product description..."
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU (Optional)</Label>
                    <Input 
                      id="sku" 
                      value={sku} 
                      onChange={(e) => setSku(e.target.value)} 
                      placeholder="e.g., COC-ORG-001"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Unit of Measure *</Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((u) => (
                        <SelectItem key={u} value={u}>{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pricing
                </CardTitle>
                <CardDescription>Set your product pricing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="domesticPrice">Domestic Price (XAF) *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">XAF</span>
                      <Input 
                        id="domesticPrice" 
                        type="number"
                        value={domesticPrice} 
                        onChange={(e) => setDomesticPrice(e.target.value)} 
                        placeholder="0"
                        className="pl-14"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Price per {unit}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="internationalPrice">International Price (USD)</Label>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={enableInternational} 
                          onCheckedChange={setEnableInternational}
                        />
                        <span className="text-sm text-muted-foreground">Enable</span>
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input 
                        id="internationalPrice" 
                        type="number"
                        value={internationalPrice} 
                        onChange={(e) => setInternationalPrice(e.target.value)} 
                        placeholder="0"
                        className="pl-8"
                        disabled={!enableInternational}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Bulk Pricing Tiers</h4>
                      <p className="text-sm text-muted-foreground">Offer discounts for larger orders</p>
                    </div>
                    <Badge variant="secondary">Optional</Badge>
                  </div>

                  <div className="space-y-3">
                    {pricingTiers.map((tier, index) => (
                      <div key={index} className="grid grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg">
                        <div>
                          <Label className="text-xs">Min Quantity</Label>
                          <Input 
                            type="number" 
                            value={tier.minQuantity}
                            onChange={(e) => {
                              const newTiers = [...pricingTiers];
                              newTiers[index].minQuantity = parseInt(e.target.value) || 0;
                              setPricingTiers(newTiers);
                            }}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Max Quantity</Label>
                          <Input 
                            type="number" 
                            value={tier.maxQuantity || ''}
                            placeholder="No limit"
                            onChange={(e) => {
                              const newTiers = [...pricingTiers];
                              newTiers[index].maxQuantity = e.target.value ? parseInt(e.target.value) : null;
                              setPricingTiers(newTiers);
                            }}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Price / {unit}</Label>
                          <Input 
                            type="number" 
                            value={tier.pricePerUnit || ''}
                            placeholder="XAF"
                            onChange={(e) => {
                              const newTiers = [...pricingTiers];
                              newTiers[index].pricePerUnit = parseInt(e.target.value) || 0;
                              setPricingTiers(newTiers);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Inventory Management
                </CardTitle>
                <CardDescription>Manage stock and order limits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Available Stock *</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="stock" 
                        type="number"
                        value={stock} 
                        onChange={(e) => setStock(e.target.value)} 
                        placeholder="0"
                        className="flex-1"
                      />
                      <span className="flex items-center px-3 bg-muted rounded-md text-sm">{unit}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lowStock">Low Stock Alert Threshold</Label>
                    <Input 
                      id="lowStock" 
                      type="number"
                      value={lowStockThreshold} 
                      onChange={(e) => setLowStockThreshold(e.target.value)} 
                      placeholder="10"
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minOrder">Minimum Order Quantity</Label>
                    <Input 
                      id="minOrder" 
                      type="number"
                      value={minOrderQuantity} 
                      onChange={(e) => setMinOrderQuantity(e.target.value)} 
                      placeholder="1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxOrder">Maximum Order Quantity</Label>
                    <Input 
                      id="maxOrder" 
                      type="number"
                      value={maxOrderQuantity} 
                      onChange={(e) => setMaxOrderQuantity(e.target.value)} 
                      placeholder="No limit"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Product Variants</h4>
                      <p className="text-sm text-muted-foreground">Different grades, sizes, or packaging options</p>
                    </div>
                    <Switch checked={enableVariants} onCheckedChange={setEnableVariants} />
                  </div>

                  {enableVariants && (
                    <div className="space-y-3">
                      {variants.map((variant) => (
                        <div key={variant.id} className="grid grid-cols-4 gap-3 p-3 bg-muted/30 rounded-lg items-end">
                          <div>
                            <Label className="text-xs">Variant Name</Label>
                            <Input placeholder="e.g., Grade A" />
                          </div>
                          <div>
                            <Label className="text-xs">SKU</Label>
                            <Input placeholder="SKU" />
                          </div>
                          <div>
                            <Label className="text-xs">Stock</Label>
                            <Input type="number" placeholder="0" />
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-500"
                            onClick={() => handleRemoveVariant(variant.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" onClick={handleAddVariant}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Variant
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImagePlus className="w-5 h-5" />
                  Product Images
                </CardTitle>
                <CardDescription>Upload up to 6 high-quality images</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg border-2 border-dashed border-border overflow-hidden group">
                      <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      {index === 0 && (
                        <Badge className="absolute top-2 left-2 bg-green-600">Primary</Badge>
                      )}
                    </div>
                  ))}
                  
                  {images.length < 6 && (
                    <button 
                      onClick={handleAddImage}
                      className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-green-500 hover:text-green-500 transition-colors"
                    >
                      <ImagePlus className="w-8 h-8" />
                      <span className="text-sm">Add Image</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  <Info className="w-3 h-3 inline mr-1" />
                  First image will be used as the primary product image. Recommended size: 1000x1000px
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Product Details
                </CardTitle>
                <CardDescription>Additional product information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origin / Region</Label>
                    <Input 
                      id="origin" 
                      value={origin} 
                      onChange={(e) => setOrigin(e.target.value)} 
                      placeholder="e.g., West Region, Cameroon"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="leadTime">Lead Time (days)</Label>
                    <Input 
                      id="leadTime" 
                      type="number"
                      value={leadTime} 
                      onChange={(e) => setLeadTime(e.target.value)} 
                      placeholder="e.g., 3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="harvestDate">Harvest Date</Label>
                    <Input 
                      id="harvestDate" 
                      type="date"
                      value={harvestDate} 
                      onChange={(e) => setHarvestDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input 
                      id="expiryDate" 
                      type="date"
                      value={expiryDate} 
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Organic Certified</p>
                      <p className="text-sm text-muted-foreground">This product is organically grown</p>
                    </div>
                  </div>
                  <Switch checked={isOrganic} onCheckedChange={setIsOrganic} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SellerLayout>
  );
}
