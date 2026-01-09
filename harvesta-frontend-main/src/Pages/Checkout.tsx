import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  CreditCard, 
  FileCheck,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  Phone
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { OrderSummaryCard } from '@/components/marketplace/OrderSummaryCard';
import { VendorInfoBadge } from '@/components/marketplace/VendorCard';
import { DeliveryEstimateDisplay } from '@/components/marketplace/DeliveryEstimator';
import { cn } from '@/lib/utils';
import { mockCartGroups, mockPaymentMethods, mockBuyerInfo, mockDeliveryAddress } from '@/lib/mockData';
import type { BuyerInfo, DeliveryAddress, PaymentMethod } from '@/types/marketplace';

type CheckoutStep = 'buyer' | 'delivery' | 'payment' | 'review';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('buyer');
  const [buyerType, setBuyerType] = useState<'individual' | 'business'>('business');
  const [buyerInfo, setBuyerInfo] = useState<Partial<BuyerInfo>>(mockBuyerInfo);
  const [deliveryAddress, setDeliveryAddress] = useState<Partial<DeliveryAddress>>(mockDeliveryAddress);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(mockPaymentMethods[0]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const cartGroups = mockCartGroups;
  const subtotal = cartGroups.reduce((sum, g) => sum + g.subtotal, 0);
  const deliveryTotal = 70;
  const taxes = subtotal * 0.08;
  const grandTotal = subtotal + deliveryTotal + taxes;
  const itemCount = cartGroups.reduce((sum, g) => sum + g.items.length, 0);

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
    // TODO: Call createOrder API
    navigate('/order-confirmation');
  };

  const StepAccordion = ({ 
    step, 
    children 
  }: { 
    step: CheckoutStep; 
    children: React.ReactNode 
  }) => {
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
              status === 'completed' && 'step-completed',
              status === 'active' && 'step-active',
              status === 'pending' && 'step-pending'
            )}>
              {status === 'completed' ? (
                <Check className="w-5 h-5" />
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{stepConfig.label}</h3>
              {status === 'completed' && step === 'buyer' && (
                <p className="text-sm text-muted-foreground">
                  {buyerInfo.firstName} {buyerInfo.lastName} • {buyerInfo.email}
                </p>
              )}
              {status === 'completed' && step === 'delivery' && (
                <p className="text-sm text-muted-foreground">
                  {deliveryAddress.street}, {deliveryAddress.city}
                </p>
              )}
              {status === 'completed' && step === 'payment' && (
                <p className="text-sm text-muted-foreground">
                  {selectedPayment.icon} {selectedPayment.name}
                </p>
              )}
            </div>
          </div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {isOpen && (
          <div className="p-4 pt-0 border-t animate-slide-up">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/cart" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Checkout</span>
        </div>

        {/* Step Indicators (Mobile) */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                getStepStatus(step.id) === 'completed' && 'step-completed',
                getStepStatus(step.id) === 'active' && 'step-active',
                getStepStatus(step.id) === 'pending' && 'step-pending'
              )}>
                {getStepStatus(step.id) === 'completed' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  'w-8 h-0.5 mx-1',
                  getStepStatus(steps[index + 1].id) !== 'pending' 
                    ? 'bg-secondary' 
                    : 'bg-muted'
                )} />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-bold mb-6">Secure Checkout</h1>

            {/* Step 1: Buyer Information */}
            <StepAccordion step="buyer">
              <div className="space-y-6 pt-4">
                {/* Buyer Type Toggle */}
                <div className="flex gap-4 p-1 bg-muted rounded-lg">
                  <button
                    type="button"
                    onClick={() => setBuyerType('individual')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all',
                      buyerType === 'individual' 
                        ? 'bg-card shadow-sm font-medium' 
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <User className="w-4 h-4" />
                    Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => setBuyerType('business')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-all',
                      buyerType === 'business' 
                        ? 'bg-card shadow-sm font-medium' 
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Building2 className="w-4 h-4" />
                    Business
                  </button>
                </div>

                {/* Business Fields */}
                {buyerType === 'business' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="md:col-span-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={buyerInfo.companyName || ''}
                        onChange={(e) => setBuyerInfo(prev => ({ ...prev, companyName: e.target.value }))}
                        placeholder="Enter company name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                      <Input
                        id="taxId"
                        value={buyerInfo.taxId || ''}
                        onChange={(e) => setBuyerInfo(prev => ({ ...prev, taxId: e.target.value }))}
                        placeholder="e.g., KRA-12345678"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactPerson">Contact Person</Label>
                      <Input
                        id="contactPerson"
                        value={buyerInfo.contactPerson || ''}
                        onChange={(e) => setBuyerInfo(prev => ({ ...prev, contactPerson: e.target.value }))}
                        placeholder="Primary contact name"
                      />
                    </div>
                  </div>
                )}

                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={buyerInfo.firstName || ''}
                      onChange={(e) => setBuyerInfo(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={buyerInfo.lastName || ''}
                      onChange={(e) => setBuyerInfo(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={buyerInfo.email || ''}
                      onChange={(e) => setBuyerInfo(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="you@company.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={buyerInfo.phone || ''}
                      onChange={(e) => setBuyerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+254 700 123 456"
                    />
                  </div>
                </div>

                <Button 
                  onClick={() => setCurrentStep('delivery')}
                  className="w-full md:w-auto"
                >
                  Continue to Delivery
                </Button>
              </div>
            </StepAccordion>

            {/* Step 2: Delivery Details */}
            <StepAccordion step="delivery">
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Delivery Address</h4>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Plus className="w-4 h-4" />
                    Add New Address
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="addressLabel">Address Label</Label>
                    <Input
                      id="addressLabel"
                      value={deliveryAddress.label || ''}
                      onChange={(e) => setDeliveryAddress(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="e.g., Main Warehouse, Home"
                    />
                  </div>
                  <div>
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      value={deliveryAddress.street || ''}
                      onChange={(e) => setDeliveryAddress(prev => ({ ...prev, street: e.target.value }))}
                      placeholder="Enter street address"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={deliveryAddress.city || ''}
                        onChange={(e) => setDeliveryAddress(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State / Region *</Label>
                      <Input
                        id="state"
                        value={deliveryAddress.state || ''}
                        onChange={(e) => setDeliveryAddress(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="State"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        value={deliveryAddress.country || ''}
                        onChange={(e) => setDeliveryAddress(prev => ({ ...prev, country: e.target.value }))}
                        placeholder="Country"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={deliveryAddress.postalCode || ''}
                        onChange={(e) => setDeliveryAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                        placeholder="00100"
                      />
                    </div>
                  </div>
                </div>

                {/* Vendor Delivery Summary */}
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm">Delivery by Vendor</h4>
                  {cartGroups.map((group) => (
                    <div key={group.vendor.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <VendorInfoBadge vendor={group.vendor} compact />
                      {group.selectedDeliveryOption && (
                        <DeliveryEstimateDisplay option={group.selectedDeliveryOption} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep('buyer')}>
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep('payment')}>
                    Continue to Payment
                  </Button>
                </div>
              </div>
            </StepAccordion>

            {/* Step 3: Payment Method */}
            <StepAccordion step="payment">
              <div className="space-y-6 pt-4">
                <RadioGroup
                  value={selectedPayment.id}
                  onValueChange={(value) => {
                    const payment = mockPaymentMethods.find(p => p.id === value);
                    if (payment) setSelectedPayment(payment);
                  }}
                  className="space-y-3"
                >
                  {mockPaymentMethods.map((method) => (
                    <Label
                      key={method.id}
                      htmlFor={method.id}
                      className={cn(
                        'flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all',
                        selectedPayment.id === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1">
                        <span className="font-medium">{method.name}</span>
                        {method.details && (
                          <p className="text-sm text-muted-foreground">{method.details}</p>
                        )}
                      </div>
                    </Label>
                  ))}
                </RadioGroup>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep('delivery')}>
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep('review')}>
                    Review Order
                  </Button>
                </div>
              </div>
            </StepAccordion>

            {/* Step 4: Review & Confirm */}
            <StepAccordion step="review">
              <div className="space-y-6 pt-4">
                {/* Order Items Summary */}
                <div className="space-y-4">
                  <h4 className="font-medium">Order Items</h4>
                  {cartGroups.map((group) => (
                    <div key={group.vendor.id} className="border rounded-lg p-4">
                      <VendorInfoBadge vendor={group.vendor} />
                      <div className="mt-3 space-y-2">
                        {group.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 text-sm">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium line-clamp-1">{item.product.name}</p>
                              <p className="text-muted-foreground">
                                Qty: {item.quantity} {item.product.unit}
                              </p>
                            </div>
                            <span className="font-medium">
                              ${(item.product.currentPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Terms Agreement */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    I agree to the <a href="#" className="text-primary underline">Terms & Conditions</a> and{' '}
                    <a href="#" className="text-primary underline">Privacy Policy</a>. I understand that my order 
                    is subject to vendor confirmation and payment verification.
                  </Label>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep('payment')}>
                    Back
                  </Button>
                  <Button 
                    onClick={handlePlaceOrder}
                    disabled={!agreedToTerms}
                    className="btn-checkout flex-1"
                    size="lg"
                  >
                    Place Order • ${grandTotal.toFixed(2)}
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  🔒 Your payment is secured with 256-bit SSL encryption
                </p>
              </div>
            </StepAccordion>

            {/* Help Section */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <Phone className="w-10 h-10 text-primary" />
              <div>
                <p className="font-medium">Need help with your order?</p>
                <p className="text-sm text-muted-foreground">
                  Call us at <span className="text-primary font-medium">+254 700 123 456</span> or chat with us on WhatsApp
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-80">
            <OrderSummaryCard
              subtotal={subtotal}
              deliveryTotal={deliveryTotal}
              taxes={taxes}
              grandTotal={grandTotal}
              itemCount={itemCount}
              isCheckoutPage
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
