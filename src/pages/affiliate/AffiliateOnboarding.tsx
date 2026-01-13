import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Wallet, Target, Gift, ArrowRight, ArrowLeft, Check, Loader2,
  Building2, Smartphone, CreditCard, Users, Store, TrendingUp
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const steps = [
  { id: 'welcome', title: 'Welcome', description: 'Get started with Harvestá', icon: Gift },
  { id: 'profile', title: 'Your Profile', description: 'Complete your information', icon: User },
  { id: 'payment', title: 'Payment Setup', description: 'How you want to get paid', icon: Wallet },
  { id: 'goals', title: 'Your Goals', description: 'Set your earning targets', icon: Target },
];

export default function AffiliateOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({ businessName: '', expertise: [] as string[], experience: '' });
  const [paymentData, setPaymentData] = useState({ method: 'momo_mtn', momoNumber: '', bankName: '', bankAccount: '' });
  const [goalData, setGoalData] = useState({ monthlyTarget: '100000', focusArea: 'both' });

  const expertiseOptions = [
    { id: 'farming', label: 'Farming & Agriculture', icon: '🌾' },
    { id: 'trading', label: 'Trading & Commerce', icon: '📦' },
    { id: 'marketing', label: 'Marketing & Sales', icon: '📢' },
    { id: 'logistics', label: 'Logistics & Distribution', icon: '🚚' },
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'other', label: 'Other', icon: '✨' },
  ];

  const paymentMethods = [
    { id: 'momo_mtn', name: 'MTN Mobile Money', icon: Smartphone },
    { id: 'momo_orange', name: 'Orange Money', icon: Smartphone },
    { id: 'bank', name: 'Bank Transfer', icon: Building2 },
    { id: 'paypal', name: 'PayPal', icon: CreditCard },
  ];

  const focusAreas = [
    { id: 'buyers', label: 'Referring Buyers', desc: 'Earn commission on purchases', icon: Users },
    { id: 'sellers', label: 'Onboarding Sellers', desc: 'Earn from seller revenue', icon: Store },
    { id: 'both', label: 'Both', desc: 'Maximize your earnings', icon: TrendingUp },
  ];

  const toggleExpertise = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(id) ? prev.expertise.filter(e => e !== id) : [...prev.expertise, id]
    }));
  };

  const handleComplete = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Welcome to Harvestá! 🎉');
    navigate('/affiliate');
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Gift className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Welcome to Harvestá! 🎉</h2>
              <p className="text-muted-foreground mt-2">Join Africa's fastest-growing agro-commerce affiliate network.</p>
            </div>
            <div className="grid gap-3 max-w-md mx-auto text-left">
              {['💰 Earn up to 20% commission', '🌍 Connect buyers and sellers', '📱 Withdraw to Mobile Money', '🎯 Join exclusive campaigns'].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold">Tell Us About Yourself</h2>
              <p className="text-muted-foreground mt-1">This helps us personalize your experience</p>
            </div>
            <div>
              <Label>Business/Brand Name (Optional)</Label>
              <Input 
                value={profileData.businessName} 
                onChange={(e) => setProfileData(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="e.g., Kwame's Agro Connect"
                className="mt-2"
              />
            </div>
            <div>
              <Label className="mb-3 block">What's your expertise?</Label>
              <div className="grid grid-cols-2 gap-3">
                {expertiseOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => toggleExpertise(opt.id)}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-all',
                      profileData.expertise.includes(opt.id) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    )}
                  >
                    <span className="text-lg mr-2">{opt.icon}</span>
                    <span className="text-sm font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'payment':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold">Payment Setup</h2>
              <p className="text-muted-foreground mt-1">How would you like to receive your earnings?</p>
            </div>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={cn(
                    'flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all',
                    paymentData.method === method.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  )}
                >
                  <input type="radio" className="sr-only" checked={paymentData.method === method.id} onChange={() => setPaymentData(prev => ({ ...prev, method: method.id }))} />
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', paymentData.method === method.id ? 'bg-primary/20' : 'bg-muted')}>
                    <method.icon className={cn('w-5 h-5', paymentData.method === method.id ? 'text-primary' : 'text-muted-foreground')} />
                  </div>
                  <span className="font-medium">{method.name}</span>
                  {paymentData.method === method.id && <Check className="w-5 h-5 text-primary ml-auto" />}
                </label>
              ))}
            </div>
            {(paymentData.method === 'momo_mtn' || paymentData.method === 'momo_orange') && (
              <div>
                <Label>Mobile Money Number</Label>
                <Input value={paymentData.momoNumber} onChange={(e) => setPaymentData(prev => ({ ...prev, momoNumber: e.target.value }))} placeholder="+237 6XX XXX XXX" className="mt-2" />
              </div>
            )}
          </div>
        );
      case 'goals':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold">Set Your Goals</h2>
              <p className="text-muted-foreground mt-1">What do you want to achieve?</p>
            </div>
            <div>
              <Label className="mb-3 block">Monthly Earning Target</Label>
              <div className="grid grid-cols-2 gap-3">
                {[{ value: '50000', label: '50,000 XAF' }, { value: '100000', label: '100,000 XAF' }, { value: '250000', label: '250,000 XAF' }, { value: '500000', label: '500,000+ XAF' }].map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setGoalData(prev => ({ ...prev, monthlyTarget: t.value }))}
                    className={cn('p-3 rounded-lg border text-left', goalData.monthlyTarget === t.value ? 'border-primary bg-primary/5' : 'border-border')}
                  >
                    <p className="font-semibold">{t.label}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-3 block">What will you focus on?</Label>
              <div className="space-y-3">
                {focusAreas.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => setGoalData(prev => ({ ...prev, focusArea: area.id }))}
                    className={cn('w-full p-4 rounded-lg border flex items-center gap-3 text-left', goalData.focusArea === area.id ? 'border-primary bg-primary/5' : 'border-border')}
                  >
                    <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', goalData.focusArea === area.id ? 'bg-primary/20' : 'bg-muted')}>
                      <area.icon className={cn('w-5 h-5', goalData.focusArea === area.id ? 'text-primary' : 'text-muted-foreground')} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{area.label}</p>
                      <p className="text-sm text-muted-foreground">{area.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 border-b">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">H</span>
            </div>
            <span className="font-bold">Harvestá</span>
          </div>
          <div className="flex items-center gap-2">
            {steps.map((_, i) => (
              <div key={i} className={cn('w-2 h-2 rounded-full transition-all', i === currentStep ? 'w-8 bg-primary' : i < currentStep ? 'bg-primary' : 'bg-muted')} />
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-lg">
          {renderStepContent()}
        </motion.div>
      </main>

      <footer className="p-4 border-t">
        <div className="max-w-2xl mx-auto flex justify-between">
          <Button variant="ghost" onClick={() => setCurrentStep(prev => prev - 1)} disabled={currentStep === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" />Back
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={() => setCurrentStep(prev => prev + 1)}>
              Continue<ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Complete Setup
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}
