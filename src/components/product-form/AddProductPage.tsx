import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Eye,
  Package,
  DollarSign,
  Layers,
  ImagePlus,
  Globe,
  FileText,
  Settings,
  Leaf,
  Info,
  ChevronRight,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Import modular components
import { RichTextEditor } from '@/components/product-form/RichTextEditor';
import { ImageUploader } from '@/components/product-form/ImageUploader';
import { TieredPricingEditor, PricingTier } from '@/components/product-form/TieredPricingEditor';
import { ProductVariantsEditor, ProductVariant } from '@/components/product-form/ProductVariantsEditor';
import { PurchaseConditionsEditor, PurchaseCondition } from '@/components/product-form/PurchaseConditionsEditor';

// API imports
import { fetchCategories, fetchActiveSuppliers, createProduct, createProductVariant, createPricingTier } from '@/lib/productManagementApi';

const units = ['kg', 'ton', 'bag', 'piece', 'crate', 'liter', 'dozen', 'carton', '10kg', '25kg', '50kg'];

const predefinedTags = [
  { id: '1', name: 'Organic', color: 'bg-green-100 text-green-700' },
  { id: '2', name: 'Export-Ready', color: 'bg-blue-100 text-blue-700' },
  { id: '3', name: 'Seasonal', color: 'bg-orange-100 text-orange-700' },
  { id: '4', name: 'Fresh', color: 'bg-emerald-100 text-emerald-700' },
  { id: '5', name: 'Premium', color: 'bg-purple-100 text-purple-700' },
  { id: '6', name: 'Fair Trade', color: 'bg-cyan-100 text-cyan-700' },
  { id: '7', name: 'Bulk Only', color: 'bg-indigo-100 text-indigo-700' },
];

interface ImageItem {
  id: string;
  url: string;
  file?: File;
  isPrimary: boolean;
  altText?: string;
}

interface Props {
  isAdmin?: boolean;
  backLink?: string;
  Layout?: React.ComponentType<{ children: React.ReactNode }>;
}

export default function AddProductPage({ isAdmin = false, backLink = '/seller/products', Layout }: Props) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [suppliers, setSuppliers] = useState<Array<{ id: string; company_name: string }>>([]);

  // Basic Info State
  const [productName, setProductName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [category, setCategory] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [sku, setSku] = useState('');
  const [unit, setUnit] = useState('kg');
  const [status, setStatus] = useState<'draft' | 'active'>('draft');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Product Details
  const [originCountry, setOriginCountry] = useState('Cameroon');
  const [originRegion, setOriginRegion] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [leadTime, setLeadTime] = useState('');
  const [isOrganic, setIsOrganic] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  // Order Limits
  const [minOrderQuantity, setMinOrderQuantity] = useState('1');
  const [maxOrderQuantity, setMaxOrderQuantity] = useState('');

  // B2B/B2C Toggles
  const [enableB2B, setEnableB2B] = useState(true);
  const [enableB2C, setEnableB2C] = useState(true);
  const [enableInternational, setEnableInternational] = useState(false);

  // Pricing
  const [domesticPrice, setDomesticPrice] = useState('');
  const [internationalPrice, setInternationalPrice] = useState('');
  const [enableTieredPricing, setEnableTieredPricing] = useState(false);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([
    { id: 'tier_1', minQuantity: 1, maxQuantity: 99, pricePerUnit: 0 },
  ]);

  // Images
  const [images, setImages] = useState<ImageItem[]>([]);

  // Variants
  const [enableVariants, setEnableVariants] = useState(false);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Stock (for simple products without variants)
  const [stock, setStock] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');

  // Purchase Conditions
  const [enableConditions, setEnableConditions] = useState(false);
  const [conditions, setConditions] = useState<PurchaseCondition[]>([]);

  // Load categories and suppliers
  useEffect(() => {
    const loadData = async () => {
      const [catResult, supResult] = await Promise.all([
        fetchCategories(),
        fetchActiveSuppliers(),
      ]);
      if (catResult.data) setCategories(catResult.data);
      if (supResult.data) setSuppliers(supResult.data);
    };
    loadData();
  }, []);

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (saveStatus: 'draft' | 'active') => {
    // Validation
    if (!productName.trim()) {
      toast.error('Please enter a product name');
      setActiveTab('basic');
      return;
    }
    if (!category) {
      toast.error('Please select a category');
      setActiveTab('basic');
      return;
    }
    if (isAdmin && !supplierId) {
      toast.error('Please select a supplier');
      setActiveTab('basic');
      return;
    }
    if (!domesticPrice) {
      toast.error('Please enter a price');
      setActiveTab('pricing');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create product
      const { data: product, error } = await createProduct({
        name: productName,
        short_description: shortDescription,
        description: longDescription,
        category_id: category,
        sku,
        unit_of_measure: unit,
        status: saveStatus,
        is_organic: isOrganic,
        is_featured: isFeatured,
        origin_country: originCountry,
        origin_region: originRegion,
        harvest_date: harvestDate || undefined,
        expiry_date: expiryDate || undefined,
        lead_time_days: leadTime ? parseInt(leadTime) : undefined,
        min_order_quantity: parseInt(minOrderQuantity) || 1,
        max_order_quantity: maxOrderQuantity ? parseInt(maxOrderQuantity) : undefined,
        supplier_id: supplierId || 'current-user-supplier-id', // Would come from auth context
        tags: selectedTags,
        labels: [],
        enable_b2b: enableB2B,
        enable_b2c: enableB2C,
        enable_international: enableInternational,
      });

      if (error) throw error;

      // Create default variant with pricing
      if (product && !enableVariants) {
        const { data: variant } = await createProductVariant({
          product_id: product.id,
          name: 'Default',
          sku: sku || undefined,
          stock_quantity: parseInt(stock) || 0,
          low_stock_threshold: parseInt(lowStockThreshold) || 10,
          is_default: true,
          is_active: true,
        });

        if (variant) {
          await createPricingTier({
            product_variant_id: variant.id,
            min_quantity: 1,
            max_quantity: null,
            price_per_unit: parseInt(domesticPrice) || 0,
            currency: 'XAF',
            is_active: true,
          });
        }
      }

      toast.success(saveStatus === 'draft' ? 'Product saved as draft' : 'Product published successfully!');
      navigate(backLink);
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Package },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'inventory', label: 'Inventory', icon: Layers },
    { id: 'media', label: 'Media', icon: ImagePlus },
    { id: 'details', label: 'Details', icon: Globe },
    { id: 'conditions', label: 'Conditions', icon: FileText },
  ];

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={backLink}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Add New Product</h1>
            <p className="text-muted-foreground">
              {isAdmin ? 'Create a product for the marketplace' : 'Create a new product listing'}
            </p>
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
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-1 h-auto p-1">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="flex items-center gap-1.5 text-xs sm:text-sm py-2"
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Product Information
              </CardTitle>
              <CardDescription>Basic details about your product - write clearly for all buyers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1">
                  Product Name <span className="text-red-500">*</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-3.5 h-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Choose a clear, descriptive name that buyers will search for</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input 
                  id="name" 
                  value={productName} 
                  onChange={(e) => setProductName(e.target.value)} 
                  placeholder="e.g., Premium Organic Cocoa Beans - Grade A"
                  className="text-lg"
                />
              </div>

              {/* Category & Supplier (Admin only) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category <span className="text-red-500">*</span></Label>
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
                {isAdmin && (
                  <div className="space-y-2">
                    <Label>Supplier <span className="text-red-500">*</span></Label>
                    <Select value={supplierId} onValueChange={setSupplierId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((sup) => (
                          <SelectItem key={sup.id} value={sup.id}>{sup.company_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Unit of Measure <span className="text-red-500">*</span></Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((u) => (
                        <SelectItem key={u} value={u}>{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU (Stock Code)</Label>
                  <Input 
                    id="sku" 
                    value={sku} 
                    onChange={(e) => setSku(e.target.value)} 
                    placeholder="e.g., COC-ORG-001"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-2">
                <Label htmlFor="shortDesc">Short Description</Label>
                <Textarea 
                  id="shortDesc" 
                  value={shortDescription} 
                  onChange={(e) => setShortDescription(e.target.value)} 
                  placeholder="Brief description for search results and product cards (2-3 sentences)"
                  rows={2}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground">{shortDescription.length}/200 characters</p>
              </div>

              {/* Long Description with Rich Editor */}
              <div className="space-y-2">
                <Label>Full Description</Label>
                <RichTextEditor
                  value={longDescription}
                  onChange={setLongDescription}
                  placeholder="Write a detailed description. Include farming tips, storage instructions, and quality information..."
                  minHeight="250px"
                  showAgroTemplates
                />
              </div>

              <Separator />

              {/* Tags */}
              <div className="space-y-3">
                <Label>Tags & Labels</Label>
                <div className="flex flex-wrap gap-2">
                  {predefinedTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedTags.includes(tag.id) ? tag.color : 'hover:bg-muted'
                      }`}
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Pricing
              </CardTitle>
              <CardDescription>Set your product pricing for domestic and international buyers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* B2B/B2C Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Retail (B2C)</p>
                    <p className="text-xs text-muted-foreground">Sell to individual buyers</p>
                  </div>
                  <Switch checked={enableB2C} onCheckedChange={setEnableB2C} />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Wholesale (B2B)</p>
                    <p className="text-xs text-muted-foreground">Sell to businesses</p>
                  </div>
                  <Switch checked={enableB2B} onCheckedChange={setEnableB2B} />
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">International</p>
                    <p className="text-xs text-muted-foreground">Export to other countries</p>
                  </div>
                  <Switch checked={enableInternational} onCheckedChange={setEnableInternational} />
                </div>
              </div>

              <Separator />

              {/* Base Prices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="domesticPrice">Domestic Price (XAF) <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">XAF</span>
                    <Input 
                      id="domesticPrice" 
                      type="number"
                      value={domesticPrice} 
                      onChange={(e) => {
                        setDomesticPrice(e.target.value);
                        // Update first tier if tiered pricing enabled
                        if (pricingTiers.length > 0) {
                          const newTiers = [...pricingTiers];
                          newTiers[0].pricePerUnit = parseInt(e.target.value) || 0;
                          setPricingTiers(newTiers);
                        }
                      }}
                      placeholder="0"
                      className="pl-14 text-lg"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Price per {unit}</p>
                </div>

                {enableInternational && (
                  <div className="space-y-2">
                    <Label htmlFor="internationalPrice">International Price (USD)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                      <Input 
                        id="internationalPrice" 
                        type="number"
                        value={internationalPrice} 
                        onChange={(e) => setInternationalPrice(e.target.value)} 
                        placeholder="0"
                        className="pl-8 text-lg"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">For export orders</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Tiered Pricing */}
              <TieredPricingEditor
                tiers={pricingTiers}
                onChange={setPricingTiers}
                unit={unit}
                enableTiered={enableTieredPricing}
                onEnableChange={setEnableTieredPricing}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                Inventory & Stock
              </CardTitle>
              <CardDescription>Manage stock levels and order quantities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Simple Stock (when variants disabled) */}
              {!enableVariants && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Available Stock</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="stock" 
                        type="number"
                        value={stock} 
                        onChange={(e) => setStock(e.target.value)} 
                        placeholder="0"
                        className="flex-1"
                      />
                      <span className="flex items-center px-3 bg-muted rounded-md text-sm font-medium">{unit}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lowStock">Low Stock Alert</Label>
                    <Input 
                      id="lowStock" 
                      type="number"
                      value={lowStockThreshold} 
                      onChange={(e) => setLowStockThreshold(e.target.value)} 
                      placeholder="10"
                    />
                  </div>
                </div>
              )}

              <Separator />

              {/* Order Limits */}
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
                  <p className="text-xs text-muted-foreground">Smallest quantity buyers can order</p>
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
                  <p className="text-xs text-muted-foreground">Leave empty for no limit</p>
                </div>
              </div>

              <Separator />

              {/* Product Variants */}
              <ProductVariantsEditor
                variants={variants}
                onChange={setVariants}
                enableVariants={enableVariants}
                onEnableChange={setEnableVariants}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImagePlus className="w-5 h-5 text-primary" />
                Product Images
              </CardTitle>
              <CardDescription>Upload high-quality images of your product</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploader
                images={images}
                onChange={setImages}
                maxImages={6}
                acceptVideo={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Product Details
              </CardTitle>
              <CardDescription>Additional information about your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="originCountry">Country of Origin</Label>
                  <Input 
                    id="originCountry" 
                    value={originCountry} 
                    onChange={(e) => setOriginCountry(e.target.value)} 
                    placeholder="e.g., Cameroon"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originRegion">Region / Farm Location</Label>
                  <Input 
                    id="originRegion" 
                    value={originRegion} 
                    onChange={(e) => setOriginRegion(e.target.value)} 
                    placeholder="e.g., West Region, Bafoussam"
                  />
                </div>
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
                  <Label htmlFor="expiryDate">Expiry / Best Before</Label>
                  <Input 
                    id="expiryDate" 
                    type="date"
                    value={expiryDate} 
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leadTime">Lead Time (days to ship)</Label>
                  <Input 
                    id="leadTime" 
                    type="number"
                    value={leadTime} 
                    onChange={(e) => setLeadTime(e.target.value)} 
                    placeholder="e.g., 3"
                  />
                </div>
              </div>

              <Separator />

              {/* Certifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Organic Certified</p>
                      <p className="text-sm text-muted-foreground">This product is organically grown</p>
                    </div>
                  </div>
                  <Switch checked={isOrganic} onCheckedChange={setIsOrganic} />
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Settings className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">Featured Product</p>
                      <p className="text-sm text-muted-foreground">Show on homepage and top of listings</p>
                    </div>
                  </div>
                  <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conditions Tab */}
        <TabsContent value="conditions" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Purchase Conditions
              </CardTitle>
              <CardDescription>Set rules and requirements for buyers</CardDescription>
            </CardHeader>
            <CardContent>
              <PurchaseConditionsEditor
                conditions={conditions}
                onChange={setConditions}
                enableConditions={enableConditions}
                onEnableChange={setEnableConditions}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Wrap in layout if provided
  if (Layout) {
    return <Layout>{content}</Layout>;
  }

  return content;
}
