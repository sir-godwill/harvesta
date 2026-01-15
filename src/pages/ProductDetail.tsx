import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Loader2,
  Star,
  ThumbsUp,
  MessageSquare,
  Truck,
  Shield,
  Package,
  MapPin,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

// Product Components
import { ProductHeader } from '@/components/product/ProductHeader';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductPricingSection } from '@/components/product/ProductPricingSection';
import { ProductActions, ProductActionsMobile } from '@/components/product/ProductActions';
import { ProductSellerCard } from '@/components/product/ProductSellerCard';
import { RelatedProducts } from '@/components/product/RelatedProducts';

// API
import {
  fetchProductById,
  fetchProductMedia,
  fetchProductVariants,
  fetchProductPricing,
  fetchInventoryLevels,
  fetchPurchaseConditions,
  fetchSellerProfile,
  fetchRelatedProducts,
  incrementProductView,
  type ProductDetails,
  type ProductMedia,
  type ProductVariant,
  type ProductPricing,
  type ProductInventory,
  type ProductConditions,
  type SellerProfile,
  type RelatedProduct,
} from '@/lib/productApi';
import { supabase } from '@/integrations/supabase/client';

// Mock data for development
const mockProduct: ProductDetails = {
  id: '1',
  name: 'Premium Organic Cocoa Beans - Fair Trade Certified Export Quality',
  slug: 'premium-organic-cocoa-beans',
  shortDescription: 'High-quality organic cocoa beans sourced directly from certified farms in Cameroon.',
  description: '<p>Premium quality organic cocoa beans sourced directly from certified farms in the fertile regions of Cameroon. Our cocoa beans are sun-dried and carefully selected to ensure the highest quality for chocolate production, baking, and confectionery applications.</p><h3>Key Features</h3><ul><li>100% Organic certified</li><li>Fair Trade certified</li><li>Export-ready packaging</li><li>Sun-dried for optimal flavor</li></ul><h3>Storage Instructions</h3><p>Store in a cool, dry place away from direct sunlight. Optimal temperature: 15-20°C with humidity below 70%.</p><h3>Farming Tips</h3><p>For best results in chocolate production, ferment beans for 5-7 days before drying. Sun-dry for 7-10 days until moisture content is below 7%.</p>',
  category: { id: '1', name: 'Cocoa & Coffee', slug: 'cocoa-coffee' },
  status: 'active',
  tags: ['Export-Ready', 'Fair Trade', 'Premium Quality'],
  isOrganic: true,
  isFeatured: true,
  unit: 'kg',
  moq: 100,
  maxOrderQuantity: 10000,
  origin: { country: 'Cameroon', region: 'South West' },
  harvestDate: '2025-12-15',
  expiryDate: '2026-12-15',
  leadTimeDays: 3,
  viewCount: 12500,
  orderCount: 342,
};

const mockMedia: ProductMedia = {
  images: [
    { id: '1', url: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600', altText: 'Cocoa beans', isPrimary: true, sortOrder: 0 },
    { id: '2', url: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600', altText: 'Cocoa processing', isPrimary: false, sortOrder: 1 },
    { id: '3', url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600', altText: 'Cocoa farm', isPrimary: false, sortOrder: 2 },
  ],
};

const mockVariants: ProductVariant[] = [
  { id: '1', name: 'Grade A - Premium', sku: 'COC-A-001', grade: 'Premium', packaging: '50kg Jute Bags', weight: 50, weightUnit: 'kg', stockQuantity: 5000, lowStockThreshold: 500, isDefault: true },
  { id: '2', name: 'Grade B - Standard', sku: 'COC-B-001', grade: 'Standard', packaging: '25kg Bags', weight: 25, weightUnit: 'kg', stockQuantity: 3000, lowStockThreshold: 300, isDefault: false },
];

const mockPricing: ProductPricing = {
  domesticPrice: 25000,
  internationalPrice: 42,
  currency: 'XAF',
  tiers: [
    { id: '1', minQuantity: 100, maxQuantity: 499, pricePerUnit: 25000, discountPercentage: null },
    { id: '2', minQuantity: 500, maxQuantity: 999, pricePerUnit: 22000, discountPercentage: 12 },
    { id: '3', minQuantity: 1000, maxQuantity: null, pricePerUnit: 18000, discountPercentage: 28 },
  ],
};

const mockInventory: ProductInventory = {
  totalStock: 5000,
  reservedStock: 500,
  availableStock: 4500,
  lowStockThreshold: 500,
  isLowStock: false,
  isOutOfStock: false,
};

const mockConditions: ProductConditions = {
  minOrderQuantity: 100,
  maxOrderQuantity: 10000,
  handlingInstructions: 'Store in cool, dry place. Keep away from moisture.',
  storageInstructions: 'Optimal storage temperature: 15-20°C with humidity below 70%.',
  certifications: ['Organic Certified', 'Fair Trade', 'Export Grade'],
  exportReady: true,
  buyerRestrictions: null,
};

const mockSeller: SellerProfile = {
  id: 'seller-1',
  companyName: 'Cameroon Cocoa Exports Ltd',
  logoUrl: null,
  bannerUrl: null,
  description: 'Leading cocoa exporter from Cameroon with over 12 years of experience in agricultural exports.',
  location: { city: 'Douala', region: 'Littoral', country: 'Cameroon' },
  rating: 4.8,
  totalReviews: 342,
  totalOrders: 1250,
  totalProducts: 24,
  verificationStatus: 'verified',
  responseRate: 98,
  responseTimeHours: 2,
  isActive: true,
  isFeatured: true,
  yearsInOperation: 12,
};

const mockRelated: RelatedProduct[] = [
  { id: '2', name: 'Fresh Arabica Coffee Beans', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300', price: 8500, unit: 'kg', rating: 4.7, soldCount: 8700, isOrganic: false },
  { id: '3', name: 'Organic Palm Oil', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300', price: 3500, unit: 'liter', rating: 4.5, soldCount: 15200, isOrganic: true },
  { id: '4', name: 'Premium Cassava Flour', image: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?w=300', price: 1500, unit: 'kg', rating: 4.6, soldCount: 45000, isOrganic: false },
];

// Mock Reviews
const mockReviews = [
  {
    id: '1',
    userName: 'Jean Pierre',
    avatar: null,
    rating: 5,
    date: '2025-12-20',
    comment: 'Excellent quality cocoa beans! The packaging was professional and beans arrived in perfect condition. Will order again.',
    helpful: 24,
    images: ['https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=150'],
    verified: true,
  },
  {
    id: '2',
    userName: 'Marie Claire',
    avatar: null,
    rating: 4,
    date: '2025-12-15',
    comment: 'Good product. Delivery was on time and the quality is as described. Minor moisture issue but seller resolved it quickly.',
    helpful: 12,
    images: [],
    verified: true,
  },
  {
    id: '3',
    userName: 'Emmanuel K.',
    avatar: null,
    rating: 5,
    date: '2025-12-10',
    comment: 'Best cocoa beans I\'ve purchased online. Premium grade as advertised. Great for chocolate production.',
    helpful: 18,
    images: [],
    verified: true,
  },
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeTab, setActiveTab] = useState('description');

  // Data states
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [media, setMedia] = useState<ProductMedia>({ images: [] });
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [pricing, setPricing] = useState<ProductPricing | null>(null);
  const [inventory, setInventory] = useState<ProductInventory | null>(null);
  const [conditions, setConditions] = useState<ProductConditions | null>(null);
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [reviews] = useState(mockReviews);

  useEffect(() => {
    async function loadProductData() {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const details = await fetchProductById(id);
        if (!details) {
          setError('Product not found');
          setIsLoading(false);
          return;
        }
        setProduct(details);
        setQuantity(details.moq);

        const [productMedia, productVariants, productConditions] = await Promise.all([
          fetchProductMedia(id),
          fetchProductVariants(id),
          fetchPurchaseConditions(id),
        ]);

        setMedia(productMedia);
        setVariants(productVariants);
        setConditions(productConditions);

        const defaultVariant = productVariants.find(v => v.isDefault) || productVariants[0];
        if (defaultVariant) {
          setSelectedVariant(defaultVariant);

          const [variantPricing, variantInventory] = await Promise.all([
            fetchProductPricing(defaultVariant.id),
            fetchInventoryLevels(defaultVariant.id),
          ]);

          setPricing(variantPricing);
          setInventory(variantInventory);
        }

        // Fetch seller profile if supplier_id is available
        const supplierId = (details as any).supplier_id || (details as any).supplier?.id;
        if (supplierId) {
          const [sellerProfile, related] = await Promise.all([
            fetchSellerProfile(supplierId),
            fetchRelatedProducts(id, details.category.id, supplierId),
          ]);
          setSeller(sellerProfile);
          setRelatedProducts(related);
        }

        incrementProductView(id);
      } catch (err) {
        console.error('Error loading product details:', err);
        setError('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    }

    loadProductData();
  }, [id]);

  // Update pricing and inventory when variant changes
  useEffect(() => {
    async function updateVariantData() {
      if (!selectedVariant) return;

      const [variantPricing, variantInventory] = await Promise.all([
        fetchProductPricing(selectedVariant.id),
        fetchInventoryLevels(selectedVariant.id),
      ]);

      setPricing(variantPricing);
      setInventory(variantInventory);
    }

    if (selectedVariant && !isLoading) {
      updateVariantData();
    }
  }, [selectedVariant]);

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;

    if (quantity < product.moq) {
      toast.error(`Minimum order quantity is ${product.moq} ${product.unit}`);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to add to cart');
        navigate('/login');
        return;
      }

      // Check if user has an active cart
      let { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (!cart) {
        const { data: newCart, error: cartError } = await supabase
          .from('carts')
          .insert({ user_id: user.id, status: 'active' })
          .select()
          .single();

        if (cartError) throw cartError;
        cart = newCart;
      }

      // Add item to cart
      const { error: itemError } = await supabase
        .from('cart_items')
        .insert({
          cart_id: cart.id,
          product_variant_id: selectedVariant.id,
          quantity: quantity
        });

      if (itemError) throw itemError;

      toast.success(`Added ${quantity} ${product.unit} to cart`, {
        action: {
          label: 'View Cart',
          onClick: () => navigate('/cart')
        }
      });
    } catch (err: any) {
      console.error('Error adding to cart:', err);
      toast.error(err.message || 'Failed to add item to cart');
    }
  };

  const handleRequestQuote = () => {
    if (!product) return;
    navigate('/rfq', { state: { productId: id, productName: product.name, quantity } });
  };

  const handleContactSeller = () => {
    if (!seller) return;
    toast.info('Opening chat with seller...');
    navigate('/messages', { state: { sellerId: seller.id } });
  };

  const handleVisitStore = () => {
    if (!seller) return;
    navigate(`/supplier/${seller.id}`);
  };

  const productTabs = [
    { id: 'description', label: 'Description', icon: Package },
    { id: 'attributes', label: 'Attributes', icon: CheckCircle },
    { id: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'warranty', label: 'Warranty', icon: Shield },
  ];

  // Rating breakdown
  const ratingBreakdown = {
    5: 65,
    4: 20,
    3: 10,
    2: 3,
    1: 2,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <Skeleton className="aspect-square rounded-xl" />
            </div>
            <div className="lg:col-span-7 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-48 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Breadcrumb - Desktop */}
      <div className="hidden lg:block bg-card border-b border-border">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to={`/search?category=${product.category.slug}`} className="hover:text-primary">{product.category.name}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground truncate max-w-xs">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-40">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 mx-4 text-center">
          <span className="text-sm font-medium truncate">{product.category.name}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigate('/cart')}>
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </div>

      <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-8">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column - Gallery */}
          <div className="lg:col-span-5">
            <ProductGallery images={media.images} productName={product.name} />
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:col-span-7 space-y-6">
            <ProductHeader
              name={product.name}
              category={product.category}
              status={product.status}
              tags={product.tags}
              isOrganic={product.isOrganic}
              isFeatured={product.isFeatured}
              rating={seller.rating}
              reviewCount={seller.totalReviews}
              viewCount={product.viewCount}
              orderCount={product.orderCount}
            />

            <ProductPricingSection
              pricing={pricing}
              unit={product.unit}
              moq={product.moq}
              maxOrderQuantity={product.maxOrderQuantity}
              stockAvailable={inventory.availableStock}
              quantity={quantity}
              onQuantityChange={setQuantity}
              formatPrice={formatPrice}
            />

            <ProductActions
              productId={product.id}
              productName={product.name}
              isOutOfStock={inventory.isOutOfStock}
              isBelowMoq={quantity < product.moq}
              moq={product.moq}
              unit={product.unit}
              quantity={quantity}
              onAddToCart={handleAddToCart}
              onRequestQuote={handleRequestQuote}
              onContactSeller={handleContactSeller}
            />

            <ProductSellerCard seller={seller} />
          </div>
        </div>

        {/* Tabbed Content Section */}
        <div className="mt-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Slidable Tab List for Mobile */}
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="inline-flex h-12 w-full justify-start gap-1 bg-muted/50 p-1 lg:w-auto lg:justify-center">
                {productTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-2 px-4 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow"
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <AnimatePresence mode="wait">
              {/* Description Tab */}
              <TabsContent value="description" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Product Description
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                      </div>

                      {/* Short Description */}
                      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold mb-2">Quick Summary</h4>
                        <p className="text-muted-foreground">{product.shortDescription}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Attributes Tab */}
              <TabsContent value="attributes" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Product Variants */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Product Variants</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {variants.map((variant) => (
                          <div
                            key={variant.id}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedVariant?.id === variant.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                              }`}
                            onClick={() => setSelectedVariant(variant)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{variant.name}</p>
                                <p className="text-sm text-muted-foreground">{variant.packaging}</p>
                              </div>
                              <Badge variant={variant.isDefault ? "default" : "outline"}>
                                {variant.grade}
                              </Badge>
                            </div>
                            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                              <span>SKU: {variant.sku}</span>
                              <span>•</span>
                              <span>{variant.stockQuantity} in stock</span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Specifications */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Specifications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Origin Country</span>
                            <span className="font-medium">{product.origin.country}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Region</span>
                            <span className="font-medium">{product.origin.region}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Harvest Date</span>
                            <span className="font-medium">{product.harvestDate}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Best Before</span>
                            <span className="font-medium">{product.expiryDate}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Unit</span>
                            <span className="font-medium">{product.unit}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Min. Order</span>
                            <span className="font-medium">{product.moq} {product.unit}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="text-muted-foreground">Certifications</span>
                            <div className="flex flex-wrap gap-1 justify-end">
                              {conditions.certifications.map((cert, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">{cert}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid lg:grid-cols-12 gap-6">
                    {/* Rating Summary */}
                    <div className="lg:col-span-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-center mb-6">
                            <div className="text-5xl font-bold text-primary">{seller.rating}</div>
                            <div className="flex items-center justify-center gap-1 my-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-5 w-5 ${star <= Math.round(seller.rating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                    }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground">{seller.totalReviews} reviews</p>
                          </div>

                          <div className="space-y-2">
                            {Object.entries(ratingBreakdown).reverse().map(([rating, percentage]) => (
                              <div key={rating} className="flex items-center gap-2">
                                <span className="text-sm w-8">{rating}★</span>
                                <Progress value={percentage} className="flex-1 h-2" />
                                <span className="text-sm text-muted-foreground w-10">{percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Reviews List */}
                    <div className="lg:col-span-8">
                      <Card>
                        <CardHeader>
                          <CardTitle>Customer Reviews</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {reviews.map((review) => (
                            <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                              <div className="flex items-start gap-4">
                                <Avatar>
                                  <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">{review.userName}</span>
                                    {review.verified && (
                                      <Badge variant="secondary" className="text-xs">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Verified Purchase
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`h-4 w-4 ${star <= review.rating
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-300'
                                            }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-muted-foreground">{review.date}</span>
                                  </div>
                                  <p className="text-sm mb-3">{review.comment}</p>

                                  {review.images.length > 0 && (
                                    <div className="flex gap-2 mb-3">
                                      {review.images.map((img, i) => (
                                        <img
                                          key={i}
                                          src={img}
                                          alt="Review"
                                          className="w-16 h-16 object-cover rounded-lg"
                                        />
                                      ))}
                                    </div>
                                  )}

                                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                                    <ThumbsUp className="h-4 w-4 mr-1" />
                                    Helpful ({review.helpful})
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Shipping Tab */}
              <TabsContent value="shipping" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Truck className="h-5 w-5 text-primary" />
                          Delivery Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium">Lead Time</p>
                            <p className="text-sm text-muted-foreground">{product.leadTimeDays} days from order confirmation</p>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium">Ships From</p>
                            <p className="text-sm text-muted-foreground">{product.origin.region}, {product.origin.country}</p>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-start gap-3">
                          <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-medium">Packaging</p>
                            <p className="text-sm text-muted-foreground">Professional export-grade packaging in jute bags</p>
                          </div>
                        </div>
                        {conditions.exportReady && (
                          <>
                            <Separator />
                            <div className="p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-2 text-green-700">
                                <CheckCircle className="h-5 w-5" />
                                <span className="font-medium">Export Ready</span>
                              </div>
                              <p className="text-sm text-green-600 mt-1">This product meets international export standards</p>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Handling & Storage</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="font-medium mb-2">Handling Instructions</p>
                          <p className="text-sm text-muted-foreground">{conditions.handlingInstructions}</p>
                        </div>
                        <Separator />
                        <div>
                          <p className="font-medium mb-2">Storage Instructions</p>
                          <p className="text-sm text-muted-foreground">{conditions.storageInstructions}</p>
                        </div>
                        <Separator />
                        <div>
                          <p className="font-medium mb-2">Order Limits</p>
                          <div className="flex gap-4 text-sm">
                            <div className="p-3 bg-muted rounded-lg flex-1">
                              <p className="text-muted-foreground">Min. Order</p>
                              <p className="font-semibold">{conditions.minOrderQuantity} {product.unit}</p>
                            </div>
                            <div className="p-3 bg-muted rounded-lg flex-1">
                              <p className="text-muted-foreground">Max. Order</p>
                              <p className="font-semibold">{conditions.maxOrderQuantity} {product.unit}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Warranty Tab */}
              <TabsContent value="warranty" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Buyer Protection & Warranty
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                          <h4 className="font-semibold text-green-800">Quality Guarantee</h4>
                          <p className="text-sm text-green-600">Full refund if product quality doesn't match description</p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <Shield className="h-8 w-8 text-blue-600 mb-2" />
                          <h4 className="font-semibold text-blue-800">Secure Payment</h4>
                          <p className="text-sm text-blue-600">Protected by Harvestá escrow until delivery confirmed</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <MessageSquare className="h-8 w-8 text-purple-600 mb-2" />
                          <h4 className="font-semibold text-purple-800">Dispute Resolution</h4>
                          <p className="text-sm text-purple-600">24/7 support for any order issues</p>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-semibold mb-3">Return Policy</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            Returns accepted within 7 days of delivery for quality issues
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            Seller covers return shipping for defective products
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            Photo/video evidence required for quality claims
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                            Refunds processed within 3-5 business days
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-8">
          <RelatedProducts products={relatedProducts} formatPrice={formatPrice} />
        </div>
      </div>

      {/* Mobile Bottom Actions */}
      <ProductActionsMobile
        isOutOfStock={inventory.isOutOfStock}
        isBelowMoq={quantity < product.moq}
        onAddToCart={handleAddToCart}
        onRequestQuote={handleRequestQuote}
        onContactSeller={handleContactSeller}
        onVisitStore={handleVisitStore}
      />
    </div>
  );
}
