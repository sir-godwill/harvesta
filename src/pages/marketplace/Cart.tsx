import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, FileText, MessageCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { VendorCardHeader } from '@/components/marketplace/VendorCard';
import { CartItemCard } from '@/components/marketplace/CartItemCard';
import { DeliveryEstimator } from '@/components/marketplace/DeliveryEstimator';
import { OrderSummaryCard } from '@/components/marketplace/OrderSummaryCard';
import { EmptyState } from '@/components/marketplace/EmptyState';
import { Textarea } from '@/components/ui/textarea';
import { mockCartGroups } from '@/lib/mockData';
import type { CartGroup, DeliveryOption } from '@/types/marketplace';

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

  const handleQuantityChange = (groupIndex: number, itemIndex: number, quantity: number) => {
    setCartGroups(prev => {
      const updated = [...prev];
      updated[groupIndex].items[itemIndex].quantity = quantity;
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

  const handleDeliveryChange = (groupIndex: number, option: DeliveryOption) => {
    setCartGroups(prev => {
      const updated = [...prev];
      updated[groupIndex].selectedDeliveryOption = option;
      return updated;
    });
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
      <div className="container py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Shopping Cart</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                Shopping Cart 
                <span className="text-muted-foreground font-normal ml-2">
                  ({itemCount} item{itemCount !== 1 ? 's' : ''})
                </span>
              </h1>
              <Button variant="ghost" className="text-destructive hover:text-destructive gap-2">
                <Trash2 className="w-4 h-4" />
                Clear Cart
              </Button>
            </div>

            {cartGroups.map((group, groupIndex) => (
              <div key={group.vendor.id} className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <VendorCardHeader vendor={group.vendor} />
                <div className="p-4 space-y-4">
                  {group.items.map((item, itemIndex) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onQuantityChange={(qty) => handleQuantityChange(groupIndex, itemIndex, qty)}
                      onRemove={() => handleRemoveItem(groupIndex, itemIndex)}
                      onSaveForLater={() => console.log('Save for later:', item.id)}
                    />
                  ))}
                </div>
                <Separator />
                <div className="p-4">
                  <DeliveryEstimator
                    options={group.deliveryOptions}
                    selectedOption={group.selectedDeliveryOption}
                    onSelect={(option) => handleDeliveryChange(groupIndex, option)}
                    subtotal={group.subtotal}
                  />
                </div>
                <Separator />
                <div className="p-4 bg-muted/30">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Notes for {group.vendor.name}
                      </label>
                      <Textarea
                        placeholder="Add special instructions..."
                        value={vendorNotes[group.vendor.id] || ''}
                        onChange={(e) => setVendorNotes(prev => ({
                          ...prev,
                          [group.vendor.id]: e.target.value
                        }))}
                        className="resize-none h-20"
                      />
                    </div>
                    <div className="sm:w-48 text-right">
                      <p className="text-sm text-muted-foreground">Vendor Subtotal</p>
                      <p className="text-2xl font-bold text-primary">${group.subtotal.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-80">
            <OrderSummaryCard
              subtotal={subtotal}
              deliveryTotal={deliveryTotal}
              taxes={taxes}
              grandTotal={grandTotal}
              itemCount={itemCount}
              onCheckout={() => navigate('/checkout')}
              onRequestQuotation={() => navigate('/rfq')}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
