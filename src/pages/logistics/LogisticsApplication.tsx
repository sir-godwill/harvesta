import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Truck,
    MapPin,
    FileText,
    CheckCircle2,
    ShieldCheck,
    ChevronRight,
    Upload,
    Info,
    Clock,
    Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { applyAsLogisticsPartner } from '@/lib/logistics-api';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { TrendingDown } from 'lucide-react';

const steps = [
    { title: 'Company Details', icon: Briefcase },
    { title: 'Operations', icon: MapPin },
    { title: 'Documents', icon: FileText },
    { title: 'Review', icon: CheckCircle2 },
];

const REGIONS = ['Littoral', 'Centre', 'West', 'North', 'South', 'East', 'Adamawa', 'South West', 'North West', 'Far North'];
const VEHICLES = ['Motorcycle', 'Small Van', 'Large Truck', 'Refrigerated Truck', 'Standard Vehicle'];

export default function LogisticsApplication() {
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState<any>({
        company_name: '',
        contact_person: '',
        phone: '',
        email: '',
        operating_regions: [],
        vehicle_types: [],
        capacity_kg: '',
        license_number: '',
        agreed_to_terms: false
    });

    const handleRegionToggle = (region: string) => {
        setFormData((prev: any) => ({
            ...prev,
            operating_regions: prev.operating_regions.includes(region)
                ? prev.operating_regions.filter((r: string) => r !== region)
                : [...prev.operating_regions, region]
        }));
    };

    const handleVehicleToggle = (vehicle: string) => {
        setFormData((prev: any) => ({
            ...prev,
            vehicle_types: prev.vehicle_types.includes(vehicle)
                ? prev.vehicle_types.filter((v: string) => v !== vehicle)
                : [...prev.vehicle_types, vehicle]
        }));
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const { error } = await applyAsLogisticsPartner({
                ...formData,
                capacity_kg: parseFloat(formData.capacity_kg) || 0,
                documents: [] // Documents would be handled via Supabase Storage in a real flow
            });

            if (error) throw error;
            setSubmitted(true);
            toast.success('Logistics application submitted successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Application failed');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center space-y-6"
                >
                    <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">Application Under Review</h1>
                        <p className="text-muted-foreground">Thank you for applying to Harvestá Logistics. Our team will review your credentials and contact you within 48 hours.</p>
                    </div>
                    <Card className="bg-blue-50 border-blue-100">
                        <CardContent className="p-4 flex gap-3 text-left">
                            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-800">
                                You will receive a notification email once your account has been approved. You can then access your Logistics Dashboard.
                            </div>
                        </CardContent>
                    </Card>
                    <Button onClick={() => window.location.href = '/'} variant="outline" className="w-full">
                        Return Home
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 mb-2">
                        Logistics Partner Program
                    </Badge>
                    <h1 className="text-4xl font-bold tracking-tight">Become a Delivery Hero</h1>
                    <p className="text-muted-foreground text-lg">Join Cameroon's fastest growing agricultural logistics network.</p>
                </div>

                {/* Stepper */}
                <div className="flex justify-between items-center max-w-2xl mx-auto relative px-10">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 -z-10" />
                    {steps.map((step, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${i <= currentStep ? 'bg-primary border-primary text-white' : 'bg-white border-slate-200 text-slate-400'
                                }`}>
                                <step.icon className="h-5 w-5" />
                            </div>
                            <span className={`text-xs font-medium ${i <= currentStep ? 'text-primary' : 'text-slate-400'}`}>{step.title}</span>
                        </div>
                    ))}
                </div>

                <Card className="shadow-lg border-primary/10">
                    <CardContent className="p-8">
                        <AnimatePresence mode="wait">
                            {currentStep === 0 && (
                                <motion.div
                                    key="step0"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="company_name">Company / Individual Name</Label>
                                            <Input
                                                id="company_name"
                                                placeholder="Harvest Express Ltd"
                                                value={formData.company_name}
                                                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="contact_person">Contact Person</Label>
                                            <Input
                                                id="contact_person"
                                                placeholder="Jean Pierre"
                                                value={formData.contact_person}
                                                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Business Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="logistics@harvesta.cm"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Contact Phone</Label>
                                            <Input
                                                id="phone"
                                                placeholder="+237 6XX XXX XXX"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="space-y-4">
                                        <Label className="text-base">Operating Regions</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                            {REGIONS.map((region) => (
                                                <div
                                                    key={region}
                                                    onClick={() => handleRegionToggle(region)}
                                                    className={`p-3 border rounded-xl cursor-pointer text-center text-sm transition-all ${formData.operating_regions.includes(region) ? 'bg-primary/10 border-primary text-primary font-bold' : 'hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {region}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-base">Vehicle Fleet Type</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {VEHICLES.map((vehicle) => (
                                                <div
                                                    key={vehicle}
                                                    onClick={() => handleVehicleToggle(vehicle)}
                                                    className={`p-4 border rounded-xl cursor-pointer flex items-center gap-3 transition-all ${formData.vehicle_types.includes(vehicle) ? 'bg-primary/10 border-primary text-primary' : 'hover:bg-slate-50'
                                                        }`}
                                                >
                                                    <Truck className="h-5 w-5" />
                                                    <span className="text-sm font-medium">{vehicle}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2 max-w-[200px]">
                                        <Label htmlFor="capacity">Total Capacity (kg)</Label>
                                        <Input
                                            id="capacity"
                                            type="number"
                                            placeholder="5000"
                                            value={formData.capacity_kg}
                                            onChange={(e) => setFormData({ ...formData, capacity_kg: e.target.value })}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="license">Business License / Tax ID Number</Label>
                                        <Input
                                            id="license"
                                            placeholder="NIU XXXXXXXX"
                                            value={formData.license_number}
                                            onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 bg-slate-50 transition-colors hover:bg-slate-100 cursor-pointer">
                                            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                <Upload className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold text-sm">Business License</p>
                                                <p className="text-xs text-muted-foreground">PDF, JPG (Max 5MB)</p>
                                            </div>
                                        </div>
                                        <div className="p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 bg-slate-50 transition-colors hover:bg-slate-100 cursor-pointer">
                                            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                <Upload className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-bold text-sm">Valid ID / Passport</p>
                                                <p className="text-xs text-muted-foreground">PDF, JPG (Max 5MB)</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                                        <div className="flex justify-between items-center border-b pb-4">
                                            <h3 className="font-bold">Application Summary</h3>
                                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Ready to submit</Badge>
                                        </div>
                                        <div className="grid grid-cols-2 gap-y-4 text-sm">
                                            <div>
                                                <p className="text-muted-foreground font-medium">Company</p>
                                                <p className="font-bold">{formData.company_name || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground font-medium">Contact</p>
                                                <p className="font-bold">{formData.contact_person || 'Not provided'}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-muted-foreground font-medium">Regions</p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {formData.operating_regions.map((r: string) => (
                                                        <Badge key={r} variant="secondary">{r}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 p-2">
                                        <Checkbox
                                            id="terms"
                                            checked={formData.agreed_to_terms}
                                            onCheckedChange={(checked) => setFormData({ ...formData, agreed_to_terms: checked })}
                                        />
                                        <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            I agree to Harvestá Logistics Partner Terms & Privacy Policy
                                        </label>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex items-center justify-between mt-10 pt-6 border-t">
                            <Button
                                variant="ghost"
                                onClick={prevStep}
                                disabled={currentStep === 0 || loading}
                            >
                                Back
                            </Button>
                            {currentStep < steps.length - 1 ? (
                                <Button onClick={nextStep} className="px-8">
                                    Continue
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!formData.agreed_to_terms || loading}
                                    className="bg-green-600 hover:bg-green-700 px-10 text-white font-bold"
                                >
                                    {loading ? 'Submitting...' : 'Submit Official Application'}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Benefits Section */}
                <div className="grid md:grid-cols-3 gap-6 pt-10">
                    <div className="p-6 rounded-2xl bg-white shadow-sm border space-y-3">
                        <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center"><ShieldCheck className="h-6 w-6 text-green-600" /></div>
                        <h4 className="font-bold">Guaranteed Payments</h4>
                        <p className="text-sm text-muted-foreground">Receive payments weekly directly to your bank account or mobile money.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white shadow-sm border space-y-3">
                        <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center"><Clock className="h-6 w-6 text-blue-600" /></div>
                        <h4 className="font-bold">Flexible Routes</h4>
                        <p className="text-sm text-muted-foreground">Work on your own schedule and choose the regions you want to operate in.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white shadow-sm border space-y-3">
                        <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center"><TrendingDown className="h-6 w-6 text-purple-600" /></div>
                        <h4 className="font-bold">Smart Optimization</h4>
                        <p className="text-sm text-muted-foreground">Our AI routing system helps you spend less time on the road and earn more.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
