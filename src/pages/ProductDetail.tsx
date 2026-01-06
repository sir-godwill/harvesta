import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Star, ShieldCheck, Truck, CreditCard, Check, Heart, Share2, MessageSquare, ShoppingCart, ChevronRight, Store } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';

// Mock product data
const productData = {
  id: '1',
  name: 'Premium Organic Cocoa Beans - Fair Trade Certified Export Quality',
  images: [
    'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1610450949065-1f2841536c88?w=600&h=600&fit=crop',
  ],
  price: 15000,
  priceMax: 25000,
  originalPrice: 30000,
  moq: 100,
  unit: 'kg',
  sold: 12500,
  rating: 4.8,
  reviews: 342,
  verified: true,
  goldSupplier: true,
  supplier: {
    name: 'Cameroon Cocoa Exports Ltd',
    years: 12,
    responseRate: 98,
    onTimeDelivery: 95,
    repurchaseRate: 62,
    serviceScore: 4.5,
  },
  pricingTiers: [
    { min: 100, max: 499, price: 25000 },
    { min: 500, max: 999, price: 20000 },
    { min: 1000, max: null, price: 15000 },
  ],
  attributes: [
    { label: 'Supply Category', value: 'Spot Goods' },
    { label: 'Brand', value: 'Cameroon Premium' },
    { label: 'Item Number', value: 'CCE-2026-001' },
    { label: 'Material', value: '100% Organic Cocoa' },
    { label: 'Origin', value: 'Cameroon' },
    { label: 'Certification', value: 'Fair Trade, Organic' },
  ],
  description: 'Premium quality organic cocoa beans sourced directly from certified farms in the fertile regions of Cameroon. Our cocoa beans are sun-dried and carefully selected to ensure the highest quality for chocolate production, baking, and confectionery applications.',
};

const relatedProducts = [
  {
    id: '2',
    name: 'Fresh Arabica Coffee Beans',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop',
    price: 8500,
    sold: 8700,
  },
  {
    id: '3',
    name: 'Organic Palm Oil',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop',
    price: 3500,
    sold: 15200,
  },
  {
    id: '4',
    name: 'Premium Cassava Flour',
    image: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?w=300&h=300&fit=crop',
    price: 1500,
    sold: 45000,
  },
];

export default function ProductDetail() {
  const { id } = useParams();
  const { formatPrice, t } = useApp();
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'product' | 'details' | 'reviews'>('product');

  const product = productData;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-24 lg:pb-8">
        {/* Breadcrumb - Desktop */}
        <div className="hidden lg:block bg-card border-b border-border">
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span>Fresh Produce</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Cocoa Beans</span>
            </div>
          </div>
        </div>
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-40">
          <Link to="/" className="p-2 -ml-2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 mx-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-muted rounded-full px-4 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Tabs */}
        <div className="lg:hidden flex border-b border-border bg-card sticky top-14 z-30">
          {(['product', 'details', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'text-foreground border-b-2 border-primary' 
                  : 'text-muted-foreground'
              }`}
            >
              {tab === 'product' ? 'Product' : tab === 'details' ? 'Details' : 'Reviews'}
            </button>
          ))}
        </div>
        
        <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-8">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Image Gallery */}
            <div className="lg:col-span-5">
              <div className="space-y-3">
                {/* Main Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-black/60 text-white text-xs">
                      Image {selectedImage + 1}/{product.images.length}
                    </Badge>
                  </div>
                </div>
                
                {/* Thumbnails */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Product Info */}
            <div className="lg:col-span-7 space-y-6">
              {/* Title & Badges */}
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {product.verified && (
                    <Badge className="bg-success/10 text-success text-xs">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      {t('product.verified')}
                    </Badge>
                  )}
                  {product.goldSupplier && (
                    <Badge className="bg-warning/10 text-warning text-xs">
                      {t('product.goldSupplier')}
                    </Badge>
                  )}
                </div>
                <h1 className="text-xl lg:text-2xl font-bold text-foreground mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="font-medium text-foreground">{product.rating}</span>
                    <span>({product.reviews} reviews)</span>
                  </div>
                  <span>{product.sold.toLocaleString()}+ sold</span>
                </div>
              </div>
              
              {/* Pricing */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 lg:p-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-sm text-muted-foreground">Price:</span>
                  <span className="price-primary text-2xl lg:text-3xl">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-muted-foreground">~</span>
                  <span className="price-primary text-2xl lg:text-3xl">
                    {formatPrice(product.priceMax)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('product.moq')}: {product.moq} {product.unit}
                </p>
                
                {/* Pricing Tiers */}
                <div className="grid grid-cols-3 gap-2">
                  {product.pricingTiers.map((tier, index) => (
                    <div key={index} className="bg-white rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">
                        {tier.min}{tier.max ? `-${tier.max}` : '+'} {product.unit}
                      </p>
                      <p className="font-bold text-primary">{formatPrice(tier.price)}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Services */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-success" />
                  <span>Free Return Shipping • 7-day no-reason return</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span>E-wallet • WorldFirst • Credit Card</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-4 w-4 text-info" />
                  <span>Ships within 48 hours • Douala, Cameroon</span>
                </div>
              </div>
              
              {/* Action Buttons - Desktop */}
              <div className="hidden lg:flex gap-3">
                <Button size="lg" className="flex-1 bg-gradient-primary hover:opacity-90 gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {t('product.contactSupplier')}
                </Button>
                <Button size="lg" variant="outline" className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  {t('product.addToCart')}
                </Button>
                <Button size="icon" variant="outline" className="h-12 w-12">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="outline" className="h-12 w-12">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Supplier Card */}
              <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Store className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{product.supplier.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge className="bg-primary/10 text-primary text-[10px] px-1.5 py-0">
                          Premium
                        </Badge>
                        <span>{product.supplier.years} years</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Visit Store</Button>
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="font-semibold text-foreground">{product.supplier.repurchaseRate}%</p>
                    <p className="text-[10px] text-muted-foreground">Repurchase<br/>Rate</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{product.supplier.serviceScore}</p>
                    <p className="text-[10px] text-muted-foreground">Service<br/>Score</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{product.supplier.onTimeDelivery}%</p>
                    <p className="text-[10px] text-muted-foreground">On-time<br/>Delivery</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{product.supplier.responseRate}%</p>
                    <p className="text-[10px] text-muted-foreground">Response<br/>Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Attributes */}
          <div className="mt-8 bg-card rounded-xl border border-border p-4 lg:p-6">
            <h2 className="font-bold text-lg text-foreground mb-4">Product Attributes</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {product.attributes.map((attr, index) => (
                <div key={index} className="flex gap-2">
                  <span className="text-sm text-muted-foreground">{attr.label}:</span>
                  <span className="text-sm font-medium text-foreground">{attr.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Related Products */}
          <div className="mt-8">
            <h2 className="font-bold text-lg text-foreground mb-4">Related Products</h2>
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
              {relatedProducts.map((item) => (
                <Link key={item.id} to={`/product/${item.id}`} className="group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <p className="text-sm text-foreground line-clamp-2 mb-1">{item.name}</p>
                  <p className="text-primary font-medium text-sm">{formatPrice(item.price)}</p>
                  <p className="text-[10px] text-muted-foreground">{item.sold.toLocaleString()}+ sold</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      {/* Mobile Bottom Actions */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 flex items-center gap-2 z-50">
        <Button variant="ghost" size="icon" className="shrink-0">
          <Store className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="shrink-0">
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="shrink-0 relative">
          <Heart className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-muted text-muted-foreground text-[10px] rounded-full flex items-center justify-center">
            80+
          </span>
        </Button>
        <Button variant="outline" className="flex-1 border-primary text-primary">
          {t('product.addToCart')}
        </Button>
        <Button className="flex-1 bg-gradient-primary">
          {t('product.orderNow')}
        </Button>
      </div>
      
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
}
