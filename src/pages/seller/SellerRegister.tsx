import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Leaf,
  Store,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  Globe,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const steps = [
  { id: 1, title: 'Account', icon: User, description: 'Create your account' },
  { id: 2, title: 'Business', icon: Building2, description: 'Business details' },
  { id: 3, title: 'Products', icon: Store, description: 'What you sell' },
  { id: 4, title: 'Verify', icon: Shield, description: 'Complete setup' },
];

const categories = [
  'Grains & Cereals',
  'Fruits & Vegetables',
  'Tubers & Root Crops',
  'Livestock & Poultry',
  'Dairy & Eggs',
  'Cocoa & Coffee',
  'Spices & Herbs',
  'Agricultural Inputs',
];

const countries = [
  'Cameroon',
  'Nigeria',
  'Ghana',
  'Kenya',
  'South Africa',
  'Ethiopia',
  'Tanzania',
  'Uganda',
  'Ivory Coast',
  'Senegal',
];

export default function SellerRegister() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Account
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: Business
  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [country, setCountry] = useState('Cameroon');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');

  // Step 3: Products
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState('');
  const [exportReady, setExportReady] = useState(false);
  const [organicCertified, setOrganicCertified] = useState(false);

  // Step 4: Verify
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const progress = (currentStep / steps.length) * 100;

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!fullName || !email || !phone || !password) {
          toast.error('Please fill in all required fields');
          return false;
        }
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
          return false;
        }
        if (password.length < 8) {
          toast.error('Password must be at least 8 characters');
          return false;
        }
        return true;
      case 2:
        if (!companyName || !businessType || !country || !city) {
          toast.error('Please fill in all required business details');
          return false;
        }
        return true;
      case 3:
        if (selectedCategories.length === 0) {
          toast.error('Please select at least one product category');
          return false;
        }
        return true;
      case 4:
        if (!agreeTerms || !agreePrivacy) {
          toast.error('Please agree to the terms and privacy policy');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
            role: 'supplier',
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Create supplier profile
        const { error: supplierError } = await supabase.from('suppliers').insert({
          user_id: authData.user.id,
          company_name: companyName,
          description,
          email,
          phone,
          country,
          region,
          city,
          address,
          company_registration_number: registrationNumber || null,
          verification_status: 'pending',
          is_active: false,
        });

        if (supplierError) throw supplierError;

        toast.success('Registration successful! Please check your email to verify your account.');
        navigate('/seller');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Harvestá</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Already have an account?</span>
            <Button variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Become a Seller</h1>
          <p className="text-muted-foreground mb-6">
            Join Africa's premier agricultural marketplace and reach buyers across the continent
          </p>

          {/* Step Indicators */}
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                    currentStep > step.id
                      ? 'bg-primary border-primary text-primary-foreground'
                      : currentStep === step.id
                      ? 'border-primary text-primary'
                      : 'border-muted-foreground/30 text-muted-foreground'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-full h-1 mx-2 rounded ${
                      currentStep > step.id ? 'bg-primary' : 'bg-muted'
                    }`}
                    style={{ width: '60px' }}
                  />
                )}
              </div>
            ))}
          </div>

          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].description}
          </p>
        </div>

        {/* Form Steps */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Create Your Account
                </CardTitle>
                <CardDescription>
                  Enter your personal details to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+237 6XX XXX XXX"
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Business Details
                </CardTitle>
                <CardDescription>
                  Tell us about your farm or business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Business/Farm Name *</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g., Green Valley Farms"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Business Type *</Label>
                    <Select value={businessType} onValueChange={setBusinessType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farmer">Individual Farmer</SelectItem>
                        <SelectItem value="cooperative">Farmer Cooperative</SelectItem>
                        <SelectItem value="processor">Processor/Manufacturer</SelectItem>
                        <SelectItem value="wholesaler">Wholesaler/Aggregator</SelectItem>
                        <SelectItem value="exporter">Exporter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Country *</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="region">Region/State</Label>
                    <Input
                      id="region"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="e.g., West Region"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g., Bafoussam"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street address"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell buyers about your business, what you grow, your farming practices..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regNumber">Business Registration Number (optional)</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="regNumber"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      placeholder="If registered"
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-primary" />
                  What Do You Sell?
                </CardTitle>
                <CardDescription>
                  Select the categories of products you offer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-3 block">Product Categories *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map((cat) => (
                      <Button
                        key={cat}
                        type="button"
                        variant={selectedCategories.includes(cat) ? 'default' : 'outline'}
                        className="h-auto py-3 justify-start"
                        onClick={() => toggleCategory(cat)}
                      >
                        {selectedCategories.includes(cat) && (
                          <Check className="h-4 w-4 mr-2" />
                        )}
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Years of Experience</Label>
                  <Select value={experienceYears} onValueChange={setExperienceYears}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="6-10">6-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Additional Capabilities</Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                      <Checkbox
                        id="export"
                        checked={exportReady}
                        onCheckedChange={(checked) => setExportReady(checked === true)}
                      />
                      <div>
                        <Label htmlFor="export" className="cursor-pointer font-medium">
                          <Globe className="h-4 w-4 inline mr-2" />
                          Export Ready
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          I can supply products for international export
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                      <Checkbox
                        id="organic"
                        checked={organicCertified}
                        onCheckedChange={(checked) => setOrganicCertified(checked === true)}
                      />
                      <div>
                        <Label htmlFor="organic" className="cursor-pointer font-medium">
                          <Leaf className="h-4 w-4 inline mr-2" />
                          Organic Certified
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          I have organic certification for my products
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Review & Complete
                </CardTitle>
                <CardDescription>
                  Review your information and complete registration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold flex items-center gap-2">
                      <User className="h-4 w-4" /> Account
                    </h4>
                    <div className="text-sm space-y-1">
                      <p><span className="text-muted-foreground">Name:</span> {fullName}</p>
                      <p><span className="text-muted-foreground">Email:</span> {email}</p>
                      <p><span className="text-muted-foreground">Phone:</span> {phone}</p>
                    </div>
                  </div>
                  <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Building2 className="h-4 w-4" /> Business
                    </h4>
                    <div className="text-sm space-y-1">
                      <p><span className="text-muted-foreground">Company:</span> {companyName}</p>
                      <p><span className="text-muted-foreground">Location:</span> {city}, {country}</p>
                      <p><span className="text-muted-foreground">Type:</span> {businessType}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <Store className="h-4 w-4" /> Product Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Terms */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={agreeTerms}
                      onCheckedChange={(checked) => setAgreeTerms(checked === true)}
                    />
                    <Label htmlFor="terms" className="text-sm cursor-pointer">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        Seller Agreement
                      </Link>
                    </Label>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="privacy"
                      checked={agreePrivacy}
                      onCheckedChange={(checked) => setAgreePrivacy(checked === true)}
                    />
                    <Label htmlFor="privacy" className="text-sm cursor-pointer">
                      I agree to the{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>{' '}
                      and consent to data processing
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={prevStep}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          ) : (
            <Button variant="ghost" asChild>
              <Link to="/">Cancel</Link>
            </Button>
          )}

          {currentStep < steps.length ? (
            <Button onClick={nextStep} className="bg-primary hover:bg-primary/90">
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
              <Check className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
