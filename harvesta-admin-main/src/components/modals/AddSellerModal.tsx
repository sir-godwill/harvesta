import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, MapPin, Phone, Mail, Building, User, FileText, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AddSellerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = ['Business Info', 'Contact Details', 'Documents', 'Review'];

export function AddSellerModal({ open, onOpenChange }: AddSellerModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    registrationNumber: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    description: '',
    documents: [] as File[],
  });

  const updateFormData = (field: string, value: string | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

  const handleSubmit = () => {
    toast.success('Seller application submitted successfully!');
    onOpenChange(false);
    setCurrentStep(0);
    setFormData({
      businessName: '',
      businessType: '',
      registrationNumber: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      description: '',
      documents: [],
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">Add New Seller</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                index <= currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className={`ml-2 text-sm hidden sm:inline ${
                index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 ${
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 1: Business Info */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="businessName"
                        placeholder="Enter business name"
                        className="pl-10"
                        value={formData.businessName}
                        onChange={(e) => updateFormData('businessName', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select value={formData.businessType} onValueChange={(v) => updateFormData('businessType', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="farm">Farm</SelectItem>
                        <SelectItem value="cooperative">Cooperative</SelectItem>
                        <SelectItem value="processor">Processor</SelectItem>
                        <SelectItem value="exporter">Exporter</SelectItem>
                        <SelectItem value="distributor">Distributor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="registrationNumber"
                      placeholder="Business registration number"
                      className="pl-10"
                      value={formData.registrationNumber}
                      onChange={(e) => updateFormData('registrationNumber', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your business..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Contact Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Person *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contactName"
                        placeholder="Full name"
                        className="pl-10"
                        value={formData.contactName}
                        onChange={(e) => updateFormData('contactName', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="+234 XXX XXX XXXX"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      placeholder="Full address"
                      className="pl-10"
                      rows={2}
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select value={formData.country} onValueChange={(v) => updateFormData('country', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nigeria">Nigeria</SelectItem>
                        <SelectItem value="kenya">Kenya</SelectItem>
                        <SelectItem value="ghana">Ghana</SelectItem>
                        <SelectItem value="ethiopia">Ethiopia</SelectItem>
                        <SelectItem value="tanzania">Tanzania</SelectItem>
                        <SelectItem value="uganda">Uganda</SelectItem>
                        <SelectItem value="south-africa">South Africa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Documents */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted rounded-xl p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload Documents</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upload business registration, certifications, and ID documents
                  </p>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Files
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    PDF, JPG, PNG up to 10MB each
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Required Documents:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Business Registration Certificate</li>
                    <li>• Valid ID of Business Owner</li>
                    <li>• Tax Identification Number (TIN)</li>
                    <li>• Farm/Product Certifications (if applicable)</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                  <h3 className="font-medium">Business Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Business Name:</span>
                    <span>{formData.businessName || 'Not provided'}</span>
                    <span className="text-muted-foreground">Business Type:</span>
                    <span className="capitalize">{formData.businessType || 'Not provided'}</span>
                    <span className="text-muted-foreground">Registration #:</span>
                    <span>{formData.registrationNumber || 'Not provided'}</span>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                  <h3 className="font-medium">Contact Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Contact Person:</span>
                    <span>{formData.contactName || 'Not provided'}</span>
                    <span className="text-muted-foreground">Email:</span>
                    <span>{formData.email || 'Not provided'}</span>
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{formData.phone || 'Not provided'}</span>
                    <span className="text-muted-foreground">Location:</span>
                    <span>{formData.city ? `${formData.city}, ${formData.country}` : 'Not provided'}</span>
                  </div>
                </div>
                <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-start gap-3">
                  <Check className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <h4 className="font-medium text-success">Ready to Submit</h4>
                    <p className="text-sm text-muted-foreground">
                      Review the information above and click Submit to create the seller account.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={currentStep === 0 ? () => onOpenChange(false) : handleBack}
          >
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          <Button onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}>
            {currentStep === steps.length - 1 ? 'Submit Application' : 'Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}