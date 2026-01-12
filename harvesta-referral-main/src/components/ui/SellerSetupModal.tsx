import { useState } from 'react';
import { 
  X, 
  Loader2, 
  Store, 
  Package, 
  CreditCard, 
  MapPin,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Image,
  FileText,
  Phone,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SellerSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: any;
  onComplete: () => void;
}

export function SellerSetupModal({ isOpen, onClose, seller, onComplete }: SellerSetupModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Store Info
    storeName: seller?.name || '',
    storeDescription: '',
    category: 'crops',
    
    // Step 2: Contact & Location
    businessEmail: '',
    businessPhone: seller?.phone || '',
    country: seller?.country || 'Cameroon',
    city: '',
    address: '',
    
    // Step 3: Products
    mainProducts: '',
    productCategories: [] as string[],
    estimatedProducts: '1-10',
    
    // Step 4: Payment
    paymentMethod: 'mobile_money',
    momoNumber: '',
    bankName: '',
    bankAccount: '',
  });

  if (!isOpen) return null;

  const steps = [
    { number: 1, title: 'Store Info', icon: Store },
    { number: 2, title: 'Contact', icon: MapPin },
    { number: 3, title: 'Products', icon: Package },
    { number: 4, title: 'Payment', icon: CreditCard },
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Seller account setup complete!');
      onComplete();
      onClose();
    } catch (error) {
      toast.error('Failed to complete setup');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      productCategories: prev.productCategories.includes(category)
        ? prev.productCategories.filter(c => c !== category)
        : [...prev.productCategories, category]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-elevated max-w-2xl w-full animate-scale-in max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Help Set Up Seller Account</h3>
            <p className="text-sm text-muted-foreground">{seller?.name}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className={cn(
                  'flex items-center gap-2',
                  step >= s.number ? 'text-primary' : 'text-muted-foreground'
                )}>
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                    step > s.number && 'bg-primary text-primary-foreground',
                    step === s.number && 'bg-primary/20 text-primary border-2 border-primary',
                    step < s.number && 'bg-muted text-muted-foreground'
                  )}>
                    {step > s.number ? <CheckCircle className="w-4 h-4" /> : s.number}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{s.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'w-8 sm:w-16 h-0.5 mx-2',
                    step > s.number ? 'bg-primary' : 'bg-border'
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Store Name *</label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                  placeholder="e.g., Golden Harvest Farms"
                  className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Store Description</label>
                <textarea
                  value={formData.storeDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, storeDescription: e.target.value }))}
                  placeholder="Describe what this store sells..."
                  rows={3}
                  className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Primary Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="crops">Crops & Grains</option>
                  <option value="fruits">Fruits & Vegetables</option>
                  <option value="livestock">Livestock & Poultry</option>
                  <option value="cocoa_coffee">Cocoa & Coffee</option>
                  <option value="spices">Spices & Herbs</option>
                  <option value="processed">Processed Foods</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Business Email
                  </label>
                  <input
                    type="email"
                    value={formData.businessEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessEmail: e.target.value }))}
                    placeholder="business@email.com"
                    className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Business Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.businessPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessPhone: e.target.value }))}
                    placeholder="+237 6XX XXX XXX"
                    className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Country *</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option>Cameroon</option>
                    <option>Ghana</option>
                    <option>Nigeria</option>
                    <option>Ivory Coast</option>
                    <option>Senegal</option>
                    <option>Kenya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="e.g., Douala"
                    className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Business Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Street address, landmark, etc."
                  rows={2}
                  className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Main Products</label>
                <textarea
                  value={formData.mainProducts}
                  onChange={(e) => setFormData(prev => ({ ...prev, mainProducts: e.target.value }))}
                  placeholder="List the main products this store will sell..."
                  rows={3}
                  className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Product Categories</label>
                <div className="flex flex-wrap gap-2">
                  {['Cocoa', 'Coffee', 'Plantain', 'Cassava', 'Rice', 'Maize', 'Pepper', 'Palm Oil', 'Groundnuts', 'Fruits'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                        formData.productCategories.includes(cat)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Estimated Number of Products</label>
                <select
                  value={formData.estimatedProducts}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedProducts: e.target.value }))}
                  className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="1-10">1-10 products</option>
                  <option value="11-50">11-50 products</option>
                  <option value="51-100">51-100 products</option>
                  <option value="100+">100+ products</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Payment Method *</label>
                <div className="space-y-2">
                  {[
                    { id: 'mobile_money', name: 'Mobile Money', desc: 'MTN, Orange Money' },
                    { id: 'bank', name: 'Bank Transfer', desc: 'Direct bank deposit' },
                  ].map(method => (
                    <label
                      key={method.id}
                      className={cn(
                        'flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all',
                        formData.paymentMethod === method.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={formData.paymentMethod === method.id}
                        onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                        className="sr-only"
                      />
                      <div className={cn(
                        'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                        formData.paymentMethod === method.id ? 'border-primary' : 'border-muted-foreground'
                      )}>
                        {formData.paymentMethod === method.id && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{method.name}</p>
                        <p className="text-xs text-muted-foreground">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {formData.paymentMethod === 'mobile_money' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Mobile Money Number *</label>
                  <input
                    type="tel"
                    value={formData.momoNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, momoNumber: e.target.value }))}
                    placeholder="+237 6XX XXX XXX"
                    className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              )}

              {formData.paymentMethod === 'bank' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Bank Name *</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                      placeholder="e.g., Ecobank"
                      className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Account Number *</label>
                    <input
                      type="text"
                      value={formData.bankAccount}
                      onChange={(e) => setFormData(prev => ({ ...prev, bankAccount: e.target.value }))}
                      placeholder="Account number"
                      className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Ready to Complete
                </h4>
                <p className="text-sm text-muted-foreground">
                  Once you complete this setup, the seller will receive an email with their login credentials and can start listing products on Harvestá.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 1}
            className={cn(
              'btn-outline',
              step === 1 && 'opacity-50 cursor-not-allowed'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={loading}
            className="btn-action"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : step === 4 ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Complete Setup
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
