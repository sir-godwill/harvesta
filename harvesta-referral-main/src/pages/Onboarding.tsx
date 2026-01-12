import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  Wallet, 
  Target, 
  Gift,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  Building2,
  Smartphone,
  CreditCard,
  Globe,
  Users,
  Store,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

const steps: OnboardingStep[] = [
  { id: 'welcome', title: 'Welcome', description: 'Get started with Harvestá', icon: Gift },
  { id: 'profile', title: 'Your Profile', description: 'Complete your information', icon: User },
  { id: 'payment', title: 'Payment Setup', description: 'How you want to get paid', icon: Wallet },
  { id: 'goals', title: 'Your Goals', description: 'Set your earning targets', icon: Target },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, completeOnboarding, updateProfile, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    businessName: '',
    expertise: [] as string[],
    experience: '',
  });

  const [paymentData, setPaymentData] = useState({
    method: 'momo_mtn',
    momoNumber: '',
    bankName: '',
    bankAccount: '',
  });

  const [goalData, setGoalData] = useState({
    monthlyTarget: '100000',
    focusArea: 'both',
    motivation: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    } else if (user?.hasCompletedOnboarding) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

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

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save all data
    updateProfile({
      tier: 'Bronze',
    });
    
    completeOnboarding();
    toast.success('Welcome to Harvestá! 🎉 Your dashboard is ready.');
    navigate('/');
  };

  const toggleExpertise = (id: string) => {
    setProfileData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(id)
        ? prev.expertise.filter(e => e !== id)
        : [...prev.expertise, id]
    }));
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
              <h2 className="text-2xl font-bold text-foreground">
                Welcome to Harvestá, {user?.name?.split(' ')[0]}! 🎉
              </h2>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                You're about to join Africa's fastest-growing agro-commerce affiliate network. Let's get you set up in just a few steps.
              </p>
            </div>
            
            <div className="grid gap-4 max-w-md mx-auto text-left">
              {[
                { icon: '💰', text: 'Earn up to 20% commission on every referral' },
                { icon: '🌍', text: 'Connect buyers and sellers across Africa' },
                { icon: '📱', text: 'Withdraw to Mobile Money instantly' },
                { icon: '🎯', text: 'Join exclusive campaigns for bonus earnings' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm text-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">Tell Us About Yourself</h2>
              <p className="text-muted-foreground mt-1">This helps us personalize your experience</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Business/Brand Name (Optional)
              </label>
              <input
                type="text"
                value={profileData.businessName}
                onChange={(e) => setProfileData(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="e.g., Kwame's Agro Connect"
                className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                What's your expertise? (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {expertiseOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleExpertise(option.id)}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-all',
                      profileData.expertise.includes(option.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <span className="text-lg mr-2">{option.icon}</span>
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Experience with affiliate/referral programs
              </label>
              <select
                value={profileData.experience}
                onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="">Select your experience level</option>
                <option value="none">I'm completely new to this</option>
                <option value="some">I've done a little before</option>
                <option value="experienced">I have good experience</option>
                <option value="expert">I'm a pro at this!</option>
              </select>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">Payment Setup</h2>
              <p className="text-muted-foreground mt-1">How would you like to receive your earnings?</p>
            </div>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={cn(
                    'flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all',
                    paymentData.method === method.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentData.method === method.id}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, method: e.target.value }))}
                    className="sr-only"
                  />
                  <div className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    paymentData.method === method.id ? 'bg-primary/20' : 'bg-muted'
                  )}>
                    <method.icon className={cn(
                      'w-5 h-5',
                      paymentData.method === method.id ? 'text-primary' : 'text-muted-foreground'
                    )} />
                  </div>
                  <span className="font-medium text-foreground">{method.name}</span>
                  {paymentData.method === method.id && (
                    <Check className="w-5 h-5 text-primary ml-auto" />
                  )}
                </label>
              ))}
            </div>

            {(paymentData.method === 'momo_mtn' || paymentData.method === 'momo_orange') && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Mobile Money Number
                </label>
                <input
                  type="tel"
                  value={paymentData.momoNumber}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, momoNumber: e.target.value }))}
                  placeholder="+237 6XX XXX XXX"
                  className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            )}

            {paymentData.method === 'bank' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={paymentData.bankName}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, bankName: e.target.value }))}
                    placeholder="e.g., First Bank"
                    className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={paymentData.bankAccount}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, bankAccount: e.target.value }))}
                    placeholder="Enter account number"
                    className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              💡 You can change your payment method anytime in Settings
            </p>
          </div>
        );

      case 'goals':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">Set Your Goals</h2>
              <p className="text-muted-foreground mt-1">What do you want to achieve with Harvestá?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Monthly Earning Target
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: '50000', label: '50,000 XAF', desc: 'Part-time goal' },
                  { value: '100000', label: '100,000 XAF', desc: 'Starter goal' },
                  { value: '250000', label: '250,000 XAF', desc: 'Serious goal' },
                  { value: '500000', label: '500,000+ XAF', desc: 'Full-time income' },
                ].map((target) => (
                  <button
                    key={target.value}
                    type="button"
                    onClick={() => setGoalData(prev => ({ ...prev, monthlyTarget: target.value }))}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-all',
                      goalData.monthlyTarget === target.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <p className="font-semibold text-foreground">{target.label}</p>
                    <p className="text-xs text-muted-foreground">{target.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                What will you focus on?
              </label>
              <div className="space-y-3">
                {focusAreas.map((area) => (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => setGoalData(prev => ({ ...prev, focusArea: area.id }))}
                    className={cn(
                      'w-full p-4 rounded-lg border flex items-center gap-3 text-left transition-all',
                      goalData.focusArea === area.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      goalData.focusArea === area.id ? 'bg-primary/20' : 'bg-muted'
                    )}>
                      <area.icon className={cn(
                        'w-5 h-5',
                        goalData.focusArea === area.id ? 'text-primary' : 'text-muted-foreground'
                      )} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{area.label}</p>
                      <p className="text-sm text-muted-foreground">{area.desc}</p>
                    </div>
                    {goalData.focusArea === area.id && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-primary/10 to-transparent rounded-xl border border-primary/20">
              <h3 className="font-semibold text-foreground mb-2">🎉 You're all set!</h3>
              <p className="text-sm text-muted-foreground">
                Based on your goals, we recommend starting with our "New User Welcome" campaign for bonus commissions.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">H</span>
            </div>
            <span className="font-bold text-foreground">Harvestá</span>
          </div>
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === currentStep ? 'w-8 bg-primary' :
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                )}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg animate-fade-in">
          {renderStepContent()}
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="p-4 border-t border-border">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={cn(
              'btn-outline',
              currentStep === 0 && 'opacity-50 cursor-not-allowed'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </div>

          {currentStep < steps.length - 1 ? (
            <button onClick={handleNext} className="btn-action">
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleComplete} 
              disabled={isLoading}
              className="btn-action"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Complete Setup
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
