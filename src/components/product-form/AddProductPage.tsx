import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
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
  ChevronLeft,
  Loader2,
  Plus,
  X,
  Percent,
  Check,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Import modular components
import { RichTextEditor } from '@/components/product-form/RichTextEditor';
import { ImageUploader } from '@/components/product-form/ImageUploader';
import { TieredPricingEditor, PricingTier } from '@/components/product-form/TieredPricingEditor';
import { ProductVariantsEditor, ProductVariant } from '@/components/product-form/ProductVariantsEditor';
import { PurchaseConditionsEditor, PurchaseCondition } from '@/components/product-form/PurchaseConditionsEditor';

// API imports
import {
  fetchCategories,
  fetchActiveSuppliers,
  createProduct,
  updateProduct,
  createProductVariant,
  createPricingTier,
  fetchProductForEdit,
} from '@/lib/productManagementApi';

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

const predefinedLabels = [
  { id: 'l1', name: 'New Arrival', color: 'bg-pink-100 text-pink-700' },
  { id: 'l2', name: 'Best Seller', color: 'bg-yellow-100 text-yellow-700' },
  { id: 'l3', name: 'Limited Stock', color: 'bg-red-100 text-red-700' },
  { id: 'l4', name: 'Certified', color: 'bg-teal-100 text-teal-700' },
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
  productId?: string; // For edit mode
}

export default function AddProductPage({ isAdmin = false, backLink = '/seller/products', Layout, productId }: Props) {
  const navigate = useNavigate();
  const isEditMode = !!productId;
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [suppliers, setSuppliers] = useState<Array<{ id: string; company_name: string }>>([]);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Category creation
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

  // Custom unit
  const [customUnit, setCustomUnit] = useState('');
  const [showCustomUnitInput, setShowCustomUnitInput] = useState(false);

  // Custom tag/label
  const [newTagName, setNewTagName] = useState('');
  const [customTags, setCustomTags] = useState<Array<{ id: string; name: string; color: string }>>([]);
  const [newLabelName, setNewLabelName] = useState('');
  const [customLabels, setCustomLabels] = useState<Array<{ id: string; name: string; color: string }>>([]);

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
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

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
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [internationalPrice, setInternationalPrice] = useState('');
  const [enableTieredPricing, setEnableTieredPricing] = useState(false);
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([
    { id: 'tier_1', minQuantity: 1, maxQuantity: 99, pricePerUnit: 0 },
  ]);

  // International tiered pricing
  const [enableInternationalTieredPricing, setEnableInternationalTieredPricing] = useState(false);
  const [internationalPricingTiers, setInternationalPricingTiers] = useState<PricingTier[]>([
    { id: 'int_tier_1', minQuantity: 1, maxQuantity: 99, pricePerUnit: 0 },
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

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Package, shortLabel: 'Basic' },
    { id: 'pricing', label: 'Pricing', icon: DollarSign, shortLabel: 'Price' },
    { id: 'inventory', label: 'Inventory', icon: Layers, shortLabel: 'Stock' },
    { id: 'media', label: 'Media', icon: ImagePlus, shortLabel: 'Media' },
    { id: 'details', label: 'Details', icon: Globe, shortLabel: 'Details' },
    { id: 'conditions', label: 'Conditions', icon: FileText, shortLabel: 'Rules' },
  ];

  const currentTabIndex = tabs.findIndex(t => t.id === activeTab);

  // Load categories, suppliers, and product data for edit mode
  useEffect(() => {
    const loadData = async () => {
      const [catResult, supResult] = await Promise.all([
        fetchCategories(),
        fetchActiveSuppliers(),
      ]);
      if (catResult.data) setCategories(catResult.data);
      if (supResult.data) setSuppliers(supResult.data);

      // Load product data for edit mode
      if (productId) {
        setIsLoadingProduct(true);
        try {
          const { data: productData, error } = await fetchProductForEdit(productId);
          if (error) throw error;

          if (productData) {
            // Pre-fill form with existing data
            setProductName(productData.name || '');
            setShortDescription(productData.short_description || '');
            setLongDescription(productData.description || '');
            setCategory(productData.category_id || '');
            setSupplierId(productData.supplier_id || '');
            setSku(productData.sku || '');
            setUnit(productData.unit_of_measure || 'kg');
            setStatus(productData.status as 'draft' | 'active' || 'draft');
            setOriginCountry(productData.origin_country || 'Cameroon');
            setOriginRegion(productData.origin_region || '');
            setHarvestDate(productData.harvest_date ? productData.harvest_date.split('T')[0] : '');
            setExpiryDate(productData.expiry_date ? productData.expiry_date.split('T')[0] : '');
            setLeadTime(productData.lead_time_days?.toString() || '');
            setIsOrganic(productData.is_organic || false);
            setIsFeatured(productData.is_featured || false);
            setMinOrderQuantity(productData.min_order_quantity?.toString() || '1');
            setMaxOrderQuantity(productData.max_order_quantity?.toString() || '');

            // Load variants and pricing
            if (productData.variants && productData.variants.length > 0) {
              const defaultVariant = productData.variants.find((v: any) => v.is_default) || productData.variants[0];
              setStock(defaultVariant.stock_quantity?.toString() || '');
              setLowStockThreshold(defaultVariant.low_stock_threshold?.toString() || '10');

              // Get price from pricing tiers
              if (defaultVariant.pricing_tiers && defaultVariant.pricing_tiers.length > 0) {
                const baseTier = defaultVariant.pricing_tiers.find((t: any) => t.min_quantity === 1) || defaultVariant.pricing_tiers[0];
                setDomesticPrice(baseTier.price_per_unit?.toString() || '');

                // If there are multiple tiers, enable tiered pricing
                if (defaultVariant.pricing_tiers.length > 1) {
                  setEnableTieredPricing(true);
                  setPricingTiers(defaultVariant.pricing_tiers.map((t: any) => ({
                    id: t.id,
                    minQuantity: t.min_quantity,
                    maxQuantity: t.max_quantity,
                    pricePerUnit: t.price_per_unit,
                  })));
                }
              }

              // If there are multiple variants, enable variant editing
              if (productData.variants.length > 1 || !defaultVariant.is_default) {
                setEnableVariants(true);
                setVariants(productData.variants.map((v: any) => ({
                  id: v.id,
                  name: v.name || '',
                  sku: v.sku || '',
                  grade: v.grade || '',
                  quality: v.quality || '',
                  packaging: v.packaging || '',
                  weight: v.weight || 0,
                  weightUnit: v.weight_unit || 'kg',
                  stockQuantity: v.stock_quantity || 0,
                  lowStockThreshold: v.low_stock_threshold || 10,
                  isDefault: v.is_default || false,
                  isActive: v.is_active !== false,
                })));
              }
            }

            // Load images
            if (productData.images && productData.images.length > 0) {
              setImages(productData.images.map((img: any) => ({
                id: img.id,
                url: img.image_url,
                isPrimary: img.is_primary || false,
                altText: img.alt_text,
              })));
            }
          }
        } catch (error) {
          console.error('Error loading product:', error);
          toast.error('Failed to load product data');
        } finally {
          setIsLoadingProduct(false);
        }
      }
    };
    loadData();
  }, [productId]);

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const toggleLabel = (labelId: string) => {
    setSelectedLabels(prev =>
      prev.includes(labelId) ? prev.filter(l => l !== labelId) : [...prev, labelId]
    );
  };

  const addCustomTag = () => {
    if (newTagName.trim()) {
      const newTag = {
        id: `custom_tag_${Date.now()}`,
        name: newTagName.trim(),
        color: 'bg-gray-100 text-gray-700'
      };
      setCustomTags([...customTags, newTag]);
      setSelectedTags([...selectedTags, newTag.id]);
      setNewTagName('');
    }
  };

  const addCustomLabel = () => {
    if (newLabelName.trim()) {
      const newLabel = {
        id: `custom_label_${Date.now()}`,
        name: newLabelName.trim(),
        color: 'bg-gray-100 text-gray-700'
      };
      setCustomLabels([...customLabels, newLabel]);
      setSelectedLabels([...selectedLabels, newLabel.id]);
      setNewLabelName('');
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCat = { id: `new_${Date.now()}`, name: newCategoryName.trim() };
      setCategories([...categories, newCat]);
      setCategory(newCat.id);
      setNewCategoryName('');
      setShowCategoryDialog(false);
      toast.success('Category added!');
    }
  };

  const handleUnitChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomUnitInput(true);
    } else {
      setUnit(value);
      setShowCustomUnitInput(false);
    }
  };

  const handleCustomUnitAdd = () => {
    if (customUnit.trim()) {
      setUnit(customUnit.trim());
      setShowCustomUnitInput(false);
      setCustomUnit('');
    }
  };

  const goToNextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  const goToPrevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
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
        labels: selectedLabels,
        enable_b2b: enableB2B,
        enable_b2c: enableB2C,
        enable_international: enableInternational,
      });

      if (error) throw error;

      // Create default variant with pricing if variants disabled
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
      } else if (product && enableVariants) {
        // Create multiple variants
        for (const v of variants) {
          const { data: variant } = await createProductVariant({
            product_id: product.id,
            name: v.name,
            sku: v.sku || undefined,
            grade: v.grade || undefined,
            quality: v.quality || undefined,
            packaging: v.packaging || undefined,
            weight: v.weight,
            weight_unit: v.weightUnit,
            stock_quantity: v.stockQuantity,
            low_stock_threshold: v.lowStockThreshold,
            is_default: v.isDefault,
            is_active: v.isActive,
          });

          // Create pricing tier for this variant using its specific price, or fall back to main price if missing
          if (variant) {
            await createPricingTier({
              product_variant_id: variant.id,
              min_quantity: 1,
              max_quantity: null,
              price_per_unit: v.price || parseInt(domesticPrice) || 0,
              currency: 'XAF',
              is_active: true,
            });
          }
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

  const allTags = [...predefinedTags, ...customTags];
  const allLabels = [...predefinedLabels, ...customLabels];

  // Calculate discount percentage
  const discountPercentage = domesticPrice && discountedPrice && parseFloat(discountedPrice) < parseFloat(domesticPrice)
    ? Math.round((1 - parseFloat(discountedPrice) / parseFloat(domesticPrice)) * 100)
    : 0;

  const content = (
    <div className="space-y-4 sm:space-y-6 pb-24 sm:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to={backLink}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
            <p className="text-sm text-muted-foreground">
              {isAdmin ? 'Create a product for the marketplace' : 'Create a new product listing'}
            </p>
          </div>
        </div>
        {/* Desktop buttons */}
        <div className="hidden sm:flex gap-2">
          <Button variant="outline" onClick={() => handleSubmit('draft')} disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => handleSubmit('active')}
            disabled={isSubmitting}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Mobile Tab Navigation - Swipeable */}
      <ScrollArea className="w-full -mx-4 px-4 sm:hidden">
        <div ref={tabsRef} className="flex gap-1 pb-2">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.shortLabel}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-full -z-10"
                />
              )}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Desktop Tab Navigation */}
      <div className="hidden sm:block">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-[2px] transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="w-5 h-5 text-primary" />
                    Product Information
                  </CardTitle>
                  <CardDescription>Basic details about your product</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Product Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-1">
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g., Premium Organic Cocoa Beans - Grade A"
                      className="text-base sm:text-lg"
                    />
                  </div>

                  {/* Category & Supplier */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center justify-between">
                        <span>Category <span className="text-red-500">*</span></span>
                        <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 text-xs">
                              <Plus className="w-3 h-3 mr-1" />
                              Add New
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add New Category</DialogTitle>
                              <DialogDescription>
                                Create a new product category
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Category Name</Label>
                                <Input
                                  value={newCategoryName}
                                  onChange={(e) => setNewCategoryName(e.target.value)}
                                  placeholder="e.g., Organic Spices"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleAddCategory}>
                                Add Category
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </Label>
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
                      {showCustomUnitInput ? (
                        <div className="flex gap-2">
                          <Input
                            value={customUnit}
                            onChange={(e) => setCustomUnit(e.target.value)}
                            placeholder="Enter custom unit"
                            className="flex-1"
                          />
                          <Button size="sm" onClick={handleCustomUnitAdd}>
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setShowCustomUnitInput(false)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Select value={unit} onValueChange={handleUnitChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {units.map((u) => (
                              <SelectItem key={u} value={u}>{u}</SelectItem>
                            ))}
                            <SelectItem value="custom">+ Add Custom Unit</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
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
                      placeholder="Brief description for search results (2-3 sentences)"
                      rows={2}
                      maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground">{shortDescription.length}/200</p>
                  </div>

                  {/* Long Description with Rich Editor */}
                  <div className="space-y-2">
                    <Label>Full Description</Label>
                    <RichTextEditor
                      value={longDescription}
                      onChange={setLongDescription}
                      placeholder="Write a detailed description. Include farming tips, storage instructions..."
                      minHeight="200px"
                      showAgroTemplates
                    />
                  </div>

                  <Separator />

                  {/* Tags */}
                  <div className="space-y-3">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                          className={cn(
                            'cursor-pointer transition-all',
                            selectedTags.includes(tag.id) ? tag.color : 'hover:bg-muted'
                          )}
                          onClick={() => toggleTag(tag.id)}
                        >
                          {selectedTags.includes(tag.id) && <Check className="w-3 h-3 mr-1" />}
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Add custom tag..."
                        className="max-w-xs"
                        onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
                      />
                      <Button size="sm" variant="outline" onClick={addCustomTag}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="space-y-3">
                    <Label>Labels</Label>
                    <div className="flex flex-wrap gap-2">
                      {allLabels.map((label) => (
                        <Badge
                          key={label.id}
                          variant={selectedLabels.includes(label.id) ? "default" : "outline"}
                          className={cn(
                            'cursor-pointer transition-all',
                            selectedLabels.includes(label.id) ? label.color : 'hover:bg-muted'
                          )}
                          onClick={() => toggleLabel(label.id)}
                        >
                          {selectedLabels.includes(label.id) && <Check className="w-3 h-3 mr-1" />}
                          {label.name}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newLabelName}
                        onChange={(e) => setNewLabelName(e.target.value)}
                        placeholder="Add custom label..."
                        className="max-w-xs"
                        onKeyPress={(e) => e.key === 'Enter' && addCustomLabel()}
                      />
                      <Button size="sm" variant="outline" onClick={addCustomLabel}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Pricing
                  </CardTitle>
                  <CardDescription>Set your product pricing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* B2B/B2C Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Retail (B2C)</p>
                        <p className="text-xs text-muted-foreground">Individual buyers</p>
                      </div>
                      <Switch checked={enableB2C} onCheckedChange={setEnableB2C} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Wholesale (B2B)</p>
                        <p className="text-xs text-muted-foreground">Business buyers</p>
                      </div>
                      <Switch checked={enableB2B} onCheckedChange={setEnableB2B} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">International</p>
                        <p className="text-xs text-muted-foreground">Export orders</p>
                      </div>
                      <Switch checked={enableInternational} onCheckedChange={setEnableInternational} />
                    </div>
                  </div>

                  <Separator />

                  {/* Base Prices */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="domesticPrice">Regular Price (XAF) <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">XAF</span>
                        <Input
                          id="domesticPrice"
                          type="text"
                          inputMode="numeric"
                          value={domesticPrice}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setDomesticPrice(value);
                            if (pricingTiers.length > 0) {
                              const newTiers = [...pricingTiers];
                              newTiers[0].pricePerUnit = parseInt(value) || 0;
                              setPricingTiers(newTiers);
                            }
                          }}
                          placeholder="0"
                          className="pl-12 text-base sm:text-lg"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Price per {unit}</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discountedPrice" className="flex items-center gap-2">
                        Discounted Price (XAF)
                        {discountPercentage > 0 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            -{discountPercentage}%
                          </Badge>
                        )}
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">XAF</span>
                        <Input
                          id="discountedPrice"
                          type="text"
                          inputMode="numeric"
                          value={discountedPrice}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setDiscountedPrice(value);
                          }}
                          placeholder="Optional"
                          className="pl-12 text-base sm:text-lg"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Leave empty if no discount</p>
                    </div>

                    {enableInternational && (
                      <div className="space-y-2">
                        <Label htmlFor="internationalPrice">International Price (USD)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">$</span>
                          <Input
                            id="internationalPrice"
                            type="text"
                            inputMode="numeric"
                            value={internationalPrice}
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^0-9.]/g, '');
                              setInternationalPrice(value);
                            }}
                            placeholder="0"
                            className="pl-8 text-base sm:text-lg"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">For export orders</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Domestic Tiered Pricing */}
                  <TieredPricingEditor
                    tiers={pricingTiers}
                    onChange={setPricingTiers}
                    unit={unit}
                    enableTiered={enableTieredPricing}
                    onEnableChange={setEnableTieredPricing}
                  />

                  {/* International Tiered Pricing */}
                  {enableInternational && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Globe className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">International Bulk Pricing</p>
                              <p className="text-sm text-muted-foreground">
                                Separate tiered pricing for international orders
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={enableInternationalTieredPricing}
                            onCheckedChange={setEnableInternationalTieredPricing}
                          />
                        </div>

                        {enableInternationalTieredPricing && (
                          <TieredPricingEditor
                            tiers={internationalPricingTiers}
                            onChange={setInternationalPricingTiers}
                            unit={unit}
                            currency="USD"
                            enableTiered={true}
                            onEnableChange={() => { }}
                          />
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Layers className="w-5 h-5 text-primary" />
                    Inventory & Stock
                  </CardTitle>
                  <CardDescription>Manage stock levels and order quantities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Simple Stock */}
                  {!enableVariants && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="stock">Available Stock</Label>
                        <div className="flex gap-2">
                          <Input
                            id="stock"
                            type="text"
                            inputMode="numeric"
                            value={stock}
                            onChange={(e) => setStock(e.target.value.replace(/[^0-9]/g, ''))}
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
                          type="text"
                          inputMode="numeric"
                          value={lowStockThreshold}
                          onChange={(e) => setLowStockThreshold(e.target.value.replace(/[^0-9]/g, ''))}
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
                      <div className="flex gap-2">
                        <Input
                          id="minOrder"
                          type="text"
                          inputMode="numeric"
                          value={minOrderQuantity}
                          onChange={(e) => setMinOrderQuantity(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="1"
                          className="flex-1"
                        />
                        <span className="flex items-center px-3 bg-muted rounded-md text-sm font-medium">{unit}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxOrder">Maximum Order Quantity</Label>
                      <div className="flex gap-2">
                        <Input
                          id="maxOrder"
                          type="text"
                          inputMode="numeric"
                          value={maxOrderQuantity}
                          onChange={(e) => setMaxOrderQuantity(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="No limit"
                          className="flex-1"
                        />
                        <span className="flex items-center px-3 bg-muted rounded-md text-sm font-medium">{unit}</span>
                      </div>
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
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
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
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="w-5 h-5 text-primary" />
                    Product Details
                  </CardTitle>
                  <CardDescription>Additional product information</CardDescription>
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
                        type="text"
                        inputMode="numeric"
                        value={leadTime}
                        onChange={(e) => setLeadTime(e.target.value.replace(/[^0-9]/g, ''))}
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
                          <p className="text-sm text-muted-foreground">Show on homepage</p>
                        </div>
                      </div>
                      <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Conditions Tab */}
          {activeTab === 'conditions' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
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
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Mobile Navigation & Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-3 flex items-center justify-between gap-2 sm:hidden z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevTab}
          disabled={currentTabIndex === 0}
          className="flex-1"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        {currentTabIndex === tabs.length - 1 ? (
          <div className="flex gap-2 flex-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting}
              className="flex-1"
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => handleSubmit('active')}
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish'}
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            onClick={goToNextTab}
            className="flex-1"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );

  // Wrap in layout if provided
  if (Layout) {
    return <Layout>{content}</Layout>;
  }

  return content;
}
