import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, User, MapPin, CreditCard, FileCheck,
  Building2, Check, ChevronDown, ChevronUp, Plus, Phone, Loader2
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { OrderSummaryCard } from '@/components/marketplace/OrderSummaryCard';
import { VendorCardHeader } from '@/components/marketplace/VendorCard';
import { DeliveryEstimateDisplay } from '@/components/marketplace/DeliveryEstimator';
import { cn } from '@/lib/utils';
import { fetchCartItems, createOrder } from '@/lib/marketplaceApi';
import { mockPaymentMethods, mockBuyerInfo, mockDeliveryAddress } from '@/lib/mockData';
import type { BuyerInfo, DeliveryAddress, PaymentMethod } from '@/types/marketplace';
import { toast } from 'sonner';

type CheckoutStep = 'buyer' | 'delivery' | 'payment' | 'review';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('buyer');
  const [buyerType, setBuyerType] = useState<'individual' | 'business'>('business');
  const [buyerInfo, setBuyerInfo] = useState<Partial<BuyerInfo>>(mockBuyerInfo);
  const [deliveryAddress, setDeliveryAddress] = useState<Partial<DeliveryAddress>>(mockDeliveryAddress);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(mockPaymentMethods[0]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // 1. Fetch cart data
  const { data: cartResponse, isLoading: cartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCartItems,
  });

  const cartGroups = useMemo(() => cartResponse?.data || [], [cartResponse]);

  // 2. Totals calculation
  const { subtotal, deliveryTotal, taxes, grandTotal, itemCount } = useMemo(() => {
    const sub = cartGroups.reduce((sum, g) => sum + g.subtotal, 0);
    const delivery = cartGroups.length * 2500; // Demo flat fee per vendor
    const tax = sub * 0.18;
    return {
      subtotal: sub,
      deliveryTotal: delivery,
      taxes: tax,
      grandTotal: sub + delivery + tax,
      itemCount: cartGroups.reduce((sum, g) => sum + g.items.length, 0)
    };
  }, [cartGroups]);

  // 3. Order creation mutation
  const createOrderMutation = useMutation({
    mutationFn: () => createOrder(
      cartGroups,
      buyerInfo as BuyerInfo,
      deliveryAddress as DeliveryAddress,
      selectedPayment
    ),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        toast.success('Order placed successfully!');
        navigate('/order-confirmation', { state: { order: res.data } });
      } else {
        toast.error('Failed to place order: ' + res.error);
      }
    },
    onError: (err: any) => toast.error('Error creating order: ' + err.message)
  });

  const steps: { id: CheckoutStep; label: string; icon: any }[] = [
    { id: 'buyer', label: 'Buyer Info', icon: User },
    { id: 'delivery', label: 'Delivery', icon: MapPin },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'review', label: 'Review', icon: FileCheck },
  ];

  const getStepStatus = (stepId: CheckoutStep) => {
    const stepOrder = ['buyer', 'delivery', 'payment', 'review'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const handlePlaceOrder = () => {
    createOrderMutation.mutate();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      maximumFractionDigits: 0
    }).format(price);
  };

  const StepAccordion = ({ step, children }: { step: CheckoutStep; children: React.ReactNode }) => {
    const status = getStepStatus(step);
    const stepConfig = steps.find(s => s.id === step)!;
    const Icon = stepConfig.icon;
    const isOpen = currentStep === step;

    return (
      <div className={cn(
        'border rounded-xl overflow-hidden transition-all',
        status === 'active' && 'border-primary shadow-lg shadow-primary/10',
        status === 'completed' && 'border-secondary/50 bg-secondary/5'
      )}>
        <button
          type="button"
          onClick={() => status !== 'pending' && setCurrentStep(step)}
          className={cn(
            'w-full flex items-center justify-between p-4 text-left',
            status === 'pending' && 'cursor-not-allowed opacity-50'
          )}
          disabled={status === 'pending'}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
              status === 'completed' && 'bg-secondary text-secondary-foreground',
              status === 'active' && 'bg-primary text-primary-foreground',
              status === 'pending' && 'bg-muted text-muted-foreground'
            )}>
              {status === 'completed' ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-semibold">{stepConfig.label}</h3>
              {status === 'completed' && step === 'buyer' && (
                <p className="text-sm text-muted-foreground">{buyerInfo.firstName} {buyerInfo.lastName} • {buyerInfo.email}</p>
              )}
              {status === 'completed' && step === 'delivery' && (
                <p className="text-sm text-muted-foreground">{deliveryAddress.street}, {deliveryAddress.city}</p>
              )}
              {status === 'completed' && step === 'payment' && (
                <p className="text-sm text-muted-foreground">{selectedPayment.icon} {selectedPayment.name}</p>
              )}
            </div>
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </button>
        {isOpen && <div className="p-4 pt-0 border-t">{children}</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/cart" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Checkout</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-bold mb-6">Secure Checkout</h1>

            {cartLoading && (
              <div className="flex items-center gap-2 text-muted-foreground animate-pulse mb-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating totals...
              </div>
            )}

            <StepAccordion step="buyer">
              <div className="space-y-6 pt-4">
                <div className="flex gap-4 p-1 bg-muted rounded-lg">
                  <button type="button" onClick={() => setBuyerType('individual')}
                    className={cn('flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all',
                      buyerType === 'individual' ? 'bg-card shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground')}>
                    <User className="w-4 h-4" /> Individual
                  </button>
                  <button type="button" onClick={() => setBuyerType('business')}
                    className={cn('flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all',
                      buyerType === 'business' ? 'bg-card shadow-sm font-medium' : 'text-muted-foreground hover:text-foreground')}>
                    <Building2 className="w-4 h-4" /> Business
                  </button>
                </div>

                {buyerType === 'business' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="md:col-span-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input id="companyName" value={buyerInfo.companyName || ''} onChange={(e) => setBuyerInfo(prev => ({ ...prev, companyName: e.target.value }))} placeholder="Enter company name" />
                    </div>
                    <div>
                      <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                      <Input id="taxId" value={buyerInfo.taxId || ''} onChange={(e) => setBuyerInfo(prev => ({ ...prev, taxId: e.target.value }))} placeholder="e.g., KRA-12345678" />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="firstName">First Name *</Label><Input id="firstName" value={buyerInfo.firstName || ''} onChange={(e) => setBuyerInfo(prev => ({ ...prev, firstName: e.target.value }))} /></div>
                  <div><Label htmlFor="lastName">Last Name *</Label><Input id="lastName" value={buyerInfo.lastName || ''} onChange={(e) => setBuyerInfo(prev => ({ ...prev, lastName: e.target.value }))} /></div>
                  <div><Label htmlFor="email">Email *</Label><Input id="email" type="email" value={buyerInfo.email || ''} onChange={(e) => setBuyerInfo(prev => ({ ...prev, email: e.target.value }))} /></div>
                  <div><Label htmlFor="phone">Phone *</Label><Input id="phone" type="tel" value={buyerInfo.phone || ''} onChange={(e) => setBuyerInfo(prev => ({ ...prev, phone: e.target.value }))} /></div>
                </div>

                <Button onClick={() => setCurrentStep('delivery')}>Continue to Delivery</Button>
              </div>
            </StepAccordion>

            <StepAccordion step="delivery">
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div><Label>Street Address *</Label><Input value={deliveryAddress.street || ''} onChange={(e) => setDeliveryAddress(prev => ({ ...prev, street: e.target.value }))} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>City *</Label><Input value={deliveryAddress.city || ''} onChange={(e) => setDeliveryAddress(prev => ({ ...prev, city: e.target.value }))} /></div>
                    <div><Label>State *</Label><Input value={deliveryAddress.state || ''} onChange={(e) => setDeliveryAddress(prev => ({ ...prev, state: e.target.value }))} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Country *</Label><Input value={deliveryAddress.country || ''} onChange={(e) => setDeliveryAddress(prev => ({ ...prev, country: e.target.value }))} /></div>
                    <div><Label>Postal Code</Label><Input value={deliveryAddress.postalCode || ''} onChange={(e) => setDeliveryAddress(prev => ({ ...prev, postalCode: e.target.value }))} /></div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep('buyer')}>Back</Button>
                  <Button onClick={() => setCurrentStep('payment')}>Continue to Payment</Button>
                </div>
              </div>
            </StepAccordion>

            <StepAccordion step="payment">
              <div className="space-y-6 pt-4">
                <RadioGroup value={selectedPayment.id} onValueChange={(value) => { const p = mockPaymentMethods.find(m => m.id === value); if (p) setSelectedPayment(p); }} className="space-y-3">
                  {mockPaymentMethods.map((method) => (
                    <Label key={method.id} htmlFor={method.id} className={cn('flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all', selectedPayment.id === method.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50')}>
                      <RadioGroupItem value={method.id} id={method.id} />
                      <span className="text-2xl">{method.icon}</span>
                      <div><p className="font-medium">{method.name}</p></div>
                    </Label>
                  ))}
                </RadioGroup>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep('delivery')}>Back</Button>
                  <Button onClick={() => setCurrentStep('review')}>Review Order</Button>
                </div>
              </div>
            </StepAccordion>

            <StepAccordion step="review">
              <div className="space-y-6 pt-4">
                <div className="p-4 rounded-lg bg-muted/50 space-y-4">
                  <h4 className="font-semibold">Order Summary</h4>
                  {cartGroups.map(group => (
                    <div key={group.vendor.id} className="border-b pb-3 last:border-0">
                      <p className="font-medium">{group.vendor.name}</p>
                      {group.items.map(item => (
                        <p key={item.product.id} className="text-sm text-muted-foreground">{item.product.name} x {item.quantity}</p>
                      ))}
                    </div>
                  ))}
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox checked={agreedToTerms} onCheckedChange={(c) => setAgreedToTerms(c as boolean)} className="mt-1" />
                  <span className="text-sm text-muted-foreground">I agree to the <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link></span>
                </label>
                <div className="flex gap-3">
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={!agreedToTerms || createOrderMutation.isPending || cartLoading}
                    className="flex-1"
                  >
                    {createOrderMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Place Order • ${formatPrice(grandTotal)}`
                    )}
                  </Button>
                </div>
              </div>
            </StepAccordion>
          </div>

          <div className="lg:w-96">
            <OrderSummaryCard
              subtotal={subtotal}
              deliveryTotal={deliveryTotal}
              taxes={taxes}
              grandTotal={grandTotal}
              itemCount={itemCount}
              isCheckoutPage={true}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}