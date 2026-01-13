import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, ShoppingBag, Minus, Plus, Heart, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/marketplace/EmptyState';
import { mockCartGroups } from '@/lib/mockData';
import type { CartGroup, DeliveryOption } from '@/types/marketplace';
import { cn } from '@/lib/utils';

export default function CartPage() {
  const navigate = useNavigate();
  const [cartGroups, setCartGroups] = useState<CartGroup[]>(mockCartGroups);
  const [vendorNotes, setVendorNotes] = useState<Record<string, string>>({});

  const calculateTotals = () => {
    let subtotal = 0;
    let deliveryTotal = 0;
    let itemCount = 0;

    cartGroups.forEach(group => {
      group.items.forEach(item => {
        const tier = item.product.pricingTiers.find(
          t => item.quantity >= t.minQuantity && (t.maxQuantity === null || item.quantity <= t.maxQuantity)
        );
        const price = tier?.pricePerUnit || item.product.currentPrice;
        subtotal += price * item.quantity;
        itemCount++;
      });

      if (group.selectedDeliveryOption) {
        const isFree = group.selectedDeliveryOption.freeAbove && 
                       group.subtotal >= group.selectedDeliveryOption.freeAbove;
        if (!isFree) {
          deliveryTotal += group.selectedDeliveryOption.cost;
        }
      }
    });

    const taxes = subtotal * 0.08;
    const grandTotal = subtotal + deliveryTotal + taxes;

    return { subtotal, deliveryTotal, taxes, grandTotal, itemCount };
  };

  const { subtotal, deliveryTotal, taxes, grandTotal, itemCount } = calculateTotals();

  const handleQuantityChange = (groupIndex: number, itemIndex: number, delta: number) => {
    setCartGroups(prev => {
      const updated = [...prev];
      const newQty = Math.max(1, updated[groupIndex].items[itemIndex].quantity + delta);
      updated[groupIndex].items[itemIndex].quantity = newQty;
      updated[groupIndex].subtotal = updated[groupIndex].items.reduce((sum, item) => {
        const tier = item.product.pricingTiers.find(
          t => item.quantity >= t.minQuantity && (t.maxQuantity === null || item.quantity <= t.maxQuantity)
        );
        const price = tier?.pricePerUnit || item.product.currentPrice;
        return sum + price * item.quantity;
      }, 0);
      return updated;
    });
  };

  const handleRemoveItem = (groupIndex: number, itemIndex: number) => {
    setCartGroups(prev => {
      const updated = [...prev];
      updated[groupIndex].items.splice(itemIndex, 1);
      if (updated[groupIndex].items.length === 0) {
        updated.splice(groupIndex, 1);
      }
      return updated;
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  if (cartGroups.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <EmptyState type="cart" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Mobile-optimized container */}
      <div className="container px-3 sm:px-4 py-4 sm:py-8">
        {/* Back button - Mobile friendly */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 sm:mb-6">
          <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Continue Shopping</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>

        {/* Title with item count */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h1 className="text-lg sm:text-2xl font-bold">
              Cart
              <span className="text-muted-foreground font-normal text-sm sm:text-base ml-2">
                ({itemCount})
              </span>
            </h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs sm:text-sm"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span className="hidden sm:inline">Clear All</span>
            <span className="sm:hidden">Clear</span>
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Cart Items - Mobile optimized */}
          <div className="flex-1 space-y-4">
            {cartGroups.map((group, groupIndex) => (
              <Card key={group.vendor.id} className="overflow-hidden">
                {/* Vendor Header - Compact on mobile */}
                <div className="bg-muted/50 px-3 sm:px-4 py-2 sm:py-3 border-b">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs sm:text-sm">
                      {group.vendor.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">{group.vendor.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{group.vendor.location}</p>
                    </div>
                    {group.vendor.isVerified && (
                      <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Cart Items */}
                <CardContent className="p-0 divide-y">
                  {group.items.map((item, itemIndex) => (
                    <div key={item.id} className="p-3 sm:p-4">
                      <div className="flex gap-3">
                        {/* Product Image - Smaller on mobile */}
                        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-medium text-sm sm:text-base line-clamp-2">
                                {item.product.name}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {item.product.origin} • {item.product.grade}
                              </p>
                            </div>
                            {/* Remove button - Icon only on mobile */}
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive -mr-2"
                              onClick={() => handleRemoveItem(groupIndex, itemIndex)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Price and Quantity - Stacked on mobile */}
                          <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <div className="flex items-center border rounded-lg">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-r-none"
                                  onClick={() => handleQuantityChange(groupIndex, itemIndex, -1)}
                                >
                                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                </Button>
                                <span className="w-10 sm:w-12 text-center text-sm font-medium">
                                  {item.quantity}
                                </span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 sm:h-9 sm:w-9 rounded-l-none"
                                  onClick={() => handleQuantityChange(groupIndex, itemIndex, 1)}
                                >
                                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                </Button>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {item.product.unit}
                              </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-between sm:justify-end gap-2">
                              <span className="text-xs text-muted-foreground sm:hidden">Price:</span>
                              <span className="font-bold text-primary text-sm sm:text-base">
                                {formatPrice(item.product.currentPrice * item.quantity)}
                              </span>
                            </div>
                          </div>

                          {/* Save for later - Mobile */}
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="h-auto p-0 text-xs text-muted-foreground mt-2 sm:hidden"
                          >
                            <Heart className="w-3 h-3 mr-1" />
                            Save for later
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>

                {/* Vendor Notes - Collapsible on mobile */}
                <div className="px-3 sm:px-4 py-3 bg-muted/30 border-t">
                  <Textarea
                    placeholder="Add note for seller (optional)..."
                    value={vendorNotes[group.vendor.id] || ''}
                    onChange={(e) => setVendorNotes(prev => ({
                      ...prev,
                      [group.vendor.id]: e.target.value
                    }))}
                    className="resize-none h-16 sm:h-20 text-sm"
                  />
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary - Sticky on mobile */}
          <div className="lg:w-80">
            <div className="lg:sticky lg:top-4">
              <Card>
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <h2 className="font-bold text-base sm:text-lg">Order Summary</h2>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{deliveryTotal === 0 ? 'Free' : formatPrice(deliveryTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Tax</span>
                      <span>{formatPrice(taxes)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-base sm:text-lg">Total</span>
                    <span className="font-bold text-lg sm:text-xl text-primary">{formatPrice(grandTotal)}</span>
                  </div>

                  <Button 
                    className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold"
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                  </Button>

                  <Button 
                    variant="outline" 
                    className="w-full text-sm"
                    onClick={() => navigate('/rfq')}
                  >
                    Request Quotation
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Secure checkout • Buyer protection included
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
