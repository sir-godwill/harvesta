import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  User,
  Package,
  Building2,
  CreditCard,
  Truck,
  Shield,
  FileText,
  Camera,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  Sparkles,
  ChevronRight,
  Play,
  HelpCircle,
} from 'lucide-react';

const onboardingSteps = [
  {
    id: 'profile',
    title: 'Complete Your Profile',
    description: 'Add your business details, contact info, and logo',
    icon: User,
    link: '/seller/settings',
    tasks: [
      { id: 'logo', label: 'Upload company logo', completed: true },
      { id: 'details', label: 'Add business details', completed: true },
      { id: 'contact', label: 'Verify contact information', completed: false },
      { id: 'address', label: 'Add warehouse/farm address', completed: false },
    ],
  },
  {
    id: 'verification',
    title: 'Verify Your Business',
    description: 'Submit required documents for verification',
    icon: Shield,
    link: '/seller/settings',
    tasks: [
      { id: 'id', label: 'Upload ID document', completed: true },
      { id: 'business', label: 'Business registration (optional)', completed: false },
      { id: 'bank', label: 'Add bank account details', completed: false },
    ],
  },
  {
    id: 'products',
    title: 'Add Your First Product',
    description: 'Create your first product listing',
    icon: Package,
    link: '/seller/products/add',
    tasks: [
      { id: 'product', label: 'Create product listing', completed: false },
      { id: 'images', label: 'Upload product images', completed: false },
      { id: 'pricing', label: 'Set pricing and stock', completed: false },
    ],
  },
  {
    id: 'logistics',
    title: 'Set Up Delivery',
    description: 'Configure shipping and delivery options',
    icon: Truck,
    link: '/seller/logistics',
    tasks: [
      { id: 'zones', label: 'Define delivery zones', completed: false },
      { id: 'rates', label: 'Set shipping rates', completed: false },
      { id: 'pickup', label: 'Add pickup locations', completed: false },
    ],
  },
  {
    id: 'payments',
    title: 'Payment Setup',
    description: 'Configure how you receive payments',
    icon: CreditCard,
    link: '/seller/finance',
    tasks: [
      { id: 'method', label: 'Add withdrawal method', completed: false },
      { id: 'verify', label: 'Verify payment account', completed: false },
    ],
  },
];

const quickStartGuides = [
  {
    title: 'How to Add Products',
    description: 'Learn to create compelling product listings',
    duration: '3 min',
    icon: Package,
  },
  {
    title: 'Pricing Strategies',
    description: 'Set competitive prices for local and export',
    duration: '5 min',
    icon: CreditCard,
  },
  {
    title: 'Managing Orders',
    description: 'Handle orders from confirmation to delivery',
    duration: '4 min',
    icon: FileText,
  },
  {
    title: 'Boost Your Sales',
    description: 'Tips to increase visibility and conversions',
    duration: '6 min',
    icon: Sparkles,
  },
];

export default function SellerOnboarding() {
  const [expandedStep, setExpandedStep] = useState<string | null>('profile');

  const calculateProgress = () => {
    const allTasks = onboardingSteps.flatMap(step => step.tasks);
    const completedTasks = allTasks.filter(task => task.completed);
    return Math.round((completedTasks.length / allTasks.length) * 100);
  };

  const getStepProgress = (step: typeof onboardingSteps[0]) => {
    const completed = step.tasks.filter(t => t.completed).length;
    return { completed, total: step.tasks.length };
  };

  const progress = calculateProgress();

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Welcome to Harvestá! 🌱</h1>
              <p className="text-primary-foreground/80 mt-1">
                Complete these steps to start selling on Africa's leading agro-commerce platform
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm opacity-80">Setup Progress</p>
                <p className="text-2xl font-bold">{progress}%</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <svg className="w-14 h-14 -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeOpacity="0.2"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={`${(progress / 100) * 150} 150`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Onboarding Steps */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Getting Started Checklist</h2>
            
            {onboardingSteps.map((step, index) => {
              const stepProgress = getStepProgress(step);
              const isComplete = stepProgress.completed === stepProgress.total;
              const isExpanded = expandedStep === step.id;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`transition-all ${isComplete ? 'border-success/50 bg-success/5' : ''}`}>
                    <CardContent className="p-4">
                      <button
                        className="w-full text-left"
                        onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            isComplete 
                              ? 'bg-success text-success-foreground' 
                              : 'bg-muted'
                          }`}>
                            {isComplete ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <step.icon className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                  {step.title}
                                  {isComplete && (
                                    <Badge className="bg-success/10 text-success border-0">Complete</Badge>
                                  )}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
                              </div>
                              <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                              <Progress 
                                value={(stepProgress.completed / stepProgress.total) * 100} 
                                className="h-1.5 flex-1"
                              />
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {stepProgress.completed}/{stepProgress.total} tasks
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 ml-14 space-y-3"
                          >
                            {step.tasks.map((task) => (
                              <div 
                                key={task.id}
                                className={`flex items-center gap-3 p-2 rounded-lg ${
                                  task.completed ? 'bg-success/5' : 'bg-muted/30'
                                }`}
                              >
                                {task.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-success" />
                                ) : (
                                  <Circle className="w-5 h-5 text-muted-foreground" />
                                )}
                                <span className={`text-sm ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                  {task.label}
                                </span>
                              </div>
                            ))}
                            <Button asChild className="mt-3">
                              <Link to={step.link}>
                                Continue Setup
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Link>
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/seller/products/add">
                    <Package className="w-4 h-4 mr-2" />
                    Add First Product
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/seller/settings">
                    <User className="w-4 h-4 mr-2" />
                    Complete Profile
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/seller/finance">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Setup Payments
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Start Guides */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  Quick Start Guides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickStartGuides.map((guide, index) => (
                  <button
                    key={index}
                    className="w-full flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <guide.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{guide.title}</p>
                      <p className="text-xs text-muted-foreground">{guide.description}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {guide.duration}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Need Help? */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Need Help?</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Our support team is here to help you get started.
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-2 text-primary">
                      Contact Support
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Benefits */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" />
                  Why Sell on Harvestá?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>Access to thousands of verified buyers</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>Integrated logistics support</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>Export opportunities worldwide</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
