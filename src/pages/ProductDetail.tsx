import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingCart, Loader2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

// Product Components
import { ProductHeader } from '@/components/product/ProductHeader';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductPricingSection } from '@/components/product/ProductPricingSection';
import { ProductActions, ProductActionsMobile } from '@/components/product/ProductActions';
import { ProductDescription } from '@/components/product/ProductDescription';
import { ProductAttributes } from '@/components/product/ProductAttributes';
import { ProductInventoryStatus } from '@/components/product/ProductInventoryStatus';
import { ProductDeliveryConditions } from '@/components/product/ProductDeliveryConditions';
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
  description: '<p>Premium quality organic cocoa beans sourced directly from certified farms in the fertile regions of Cameroon. Our cocoa beans are sun-dried and carefully selected to ensure the highest quality for chocolate production, baking, and confectionery applications.</p><h3>Key Features</h3><ul><li>100% Organic certified</li><li>Fair Trade certified</li><li>Export-ready packaging</li><li>Sun-dried for optimal flavor</li></ul>',
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
  description: 'Leading cocoa exporter from Cameroon',
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

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useApp();
  
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(100);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  
  // Data states - using mock data for now
  const [product] = useState<ProductDetails>(mockProduct);
  const [media] = useState<ProductMedia>(mockMedia);
  const [variants] = useState<ProductVariant[]>(mockVariants);
  const [pricing] = useState<ProductPricing>(mockPricing);
  const [inventory] = useState<ProductInventory>(mockInventory);
  const [conditions] = useState<ProductConditions>(mockConditions);
  const [seller] = useState<SellerProfile>(mockSeller);
  const [relatedProducts] = useState<RelatedProduct[]>(mockRelated);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setSelectedVariant(variants.find(v => v.isDefault) || variants[0] || null);
    }, 500);
    
    // Track view
    if (id) {
      incrementProductView(id);
    }
    
    return () => clearTimeout(timer);
  }, [id, variants]);

  const handleAddToCart = () => {
    if (quantity < product.moq) {
      toast.error(`Minimum order quantity is ${product.moq} ${product.unit}`);
      return;
    }
    toast.success(`Added ${quantity} ${product.unit} to cart`);
  };

  const handleRequestQuote = () => {
    navigate('/rfq', { state: { productId: id, productName: product.name, quantity } });
  };

  const handleContactSeller = () => {
    toast.info('Opening chat with seller...');
    navigate('/messages', { state: { sellerId: seller.id } });
  };

  const handleVisitStore = () => {
    navigate(`/supplier/${seller.id}`);
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
        
        {/* Bottom Sections */}
        <div className="mt-8 space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <ProductDescription
              shortDescription={product.shortDescription}
              description={product.description}
            />
            <ProductAttributes
              variants={variants}
              selectedVariant={selectedVariant}
              onVariantSelect={setSelectedVariant}
              origin={product.origin}
              isOrganic={product.isOrganic}
              harvestDate={product.harvestDate}
              expiryDate={product.expiryDate}
              certifications={conditions.certifications}
            />
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6">
            <ProductInventoryStatus
              inventory={inventory}
              unit={product.unit}
            />
            <ProductDeliveryConditions
              conditions={conditions}
              unit={product.unit}
              leadTimeDays={product.leadTimeDays}
            />
          </div>
          
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
