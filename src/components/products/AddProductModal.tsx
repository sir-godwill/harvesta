import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Package,
  Info,
  Check,
  Loader2,
  Sparkles,
  Save,
  Building2,
  Users,
  Globe,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Image,
  DollarSign,
  Boxes,
  Layers,
  FileText,
  Plus,
  HelpCircle,
  Award,
  Tag,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatXAF } from "@/lib/currency";
import { RichTextEditor } from "./RichTextEditor";
import { ImageUploader } from "./ImageUploader";
import { TieredPricingEditor, type TieredPrice } from "./TieredPricingEditor";
import { ProductVariantEditor, type ProductVariant } from "./ProductVariantEditor";
import { SeasonalCalendar } from "./SeasonalCalendar";
import { CategoryTagSelector } from "./CategoryTagSelector";
import { PurchaseConditionsEditor, type PurchaseConditions } from "./PurchaseConditionsEditor";

// Form Schema
const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters').max(200, 'Keep it under 200 characters'),
  longDescription: z.string().optional(),
  category: z.string().min(1, 'Please select a category'),
  tags: z.array(z.string()),
  status: z.enum(['active', 'draft', 'seasonal', 'inactive']),
  origin: z.string().min(2, 'Please specify the origin'),
  harvestDate: z.string().optional(),
  grade: z.string().min(1, 'Please select a grade'),
  quality: z.string().optional(),
  batchNumber: z.string().optional(),
  packaging: z.string().min(1, 'Please specify packaging'),
  unit: z.string().min(1, 'Please select a unit'),
  customUnit: z.string().optional(),
  price: z.number().min(1, 'Price must be greater than 0'),
  discountPrice: z.number().optional(),
  exportPrice: z.number().optional(),
  exportCurrency: z.string().optional(),
  stock: z.number().min(0, 'Stock cannot be negative'),
  minStock: z.number().min(0, 'Minimum stock cannot be negative'),
  certifications: z.array(z.string()),
  customCertifications: z.array(z.string()),
  isNegotiable: z.boolean(),
  marketType: z.enum(['local', 'export', 'both']),
  enableB2B: z.boolean(),
  enableB2C: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductImage {
  id: string;
  url: string;
  file?: File;
  isPrimary?: boolean;
}

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
  editProduct?: any;
}

const defaultUnitOptions = [
  { value: 'kg', label: 'Kilogram (kg)' },
  { value: 'ton', label: 'Ton' },
  { value: 'bag', label: 'Bag' },
  { value: 'crate', label: 'Crate' },
  { value: 'liter', label: 'Liter' },
  { value: 'piece', label: 'Piece' },
  { value: 'bundle', label: 'Bundle' },
  { value: 'dozen', label: 'Dozen' },
];

const gradeOptions = [
  { value: 'premium', label: 'Premium' },
  { value: 'grade_a', label: 'Grade A' },
  { value: 'grade_b', label: 'Grade B' },
  { value: 'standard', label: 'Standard' },
  { value: 'export', label: 'Export Quality' },
];

const statusOptions = [
  { value: 'active', label: 'Active', description: 'Product is live and visible to buyers' },
  { value: 'draft', label: 'Draft', description: 'Save now, publish later' },
  { value: 'seasonal', label: 'Seasonal', description: 'Available only during selected months' },
  { value: 'inactive', label: 'Inactive', description: 'Hidden from buyers' },
];

const defaultCertifications = [
  'Organic', 'Fair Trade', 'Rainforest Alliance', 'UTZ Certified', 
  'GI Protected', 'HACCP', 'ISO 22000', 'GlobalGAP', 'RSPO Certified',
];

const currencyOptions = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'XAF', label: 'CFA Franc (XAF)' },
];

const sections = [
  { id: 'basic', label: 'Basic Info', icon: Package },
  { id: 'media', label: 'Images', icon: Image },
  { id: 'pricing', label: 'Pricing', icon: DollarSign },
  { id: 'inventory', label: 'Inventory', icon: Boxes },
  { id: 'variants', label: 'Variants', icon: Layers },
  { id: 'conditions', label: 'Conditions', icon: FileText },
];

export function AddProductModal({ open, onOpenChange, onSubmit, editProduct }: AddProductModalProps) {
  const [activeSection, setActiveSection] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [tieredPricing, setTieredPricing] = useState<TieredPrice[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [seasonalMonths, setSeasonalMonths] = useState<number[]>([]);
  const [customCategories, setCustomCategories] = useState<{id: string; name: string; icon: string}[]>([]);
  const [customUnits, setCustomUnits] = useState<{value: string; label: string}[]>([]);
  const [showCustomUnitInput, setShowCustomUnitInput] = useState(false);
  const [newCustomUnit, setNewCustomUnit] = useState('');
  const [customCertInput, setCustomCertInput] = useState('');
  const [purchaseConditions, setPurchaseConditions] = useState<PurchaseConditions>({
    minQuantity: null,
    maxQuantity: null,
    allowNegotiation: true,
    requiresDeposit: false,
    depositPercentage: 30,
    paymentTerms: 'full_upfront',
    deliveryRestrictions: '',
    specialInstructions: '',
    buyerTypeRestrictions: ['all'],
  });
  
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      shortDescription: '',
      longDescription: '',
      category: '',
      tags: [],
      status: 'draft',
      origin: '',
      harvestDate: '',
      grade: 'grade_a',
      quality: '',
      batchNumber: '',
      packaging: '',
      unit: 'kg',
      customUnit: '',
      price: 0,
      discountPrice: undefined,
      exportPrice: undefined,
      exportCurrency: 'USD',
      stock: 0,
      minStock: 0,
      certifications: [],
      customCertifications: [],
      isNegotiable: true,
      marketType: 'local',
      enableB2B: false,
      enableB2C: true,
    },
  });

  const watchedPrice = form.watch('price');
  const watchedUnit = form.watch('unit');
  const watchedName = form.watch('name');
  const watchedStatus = form.watch('status');
  const watchedEnableB2B = form.watch('enableB2B');
  const watchedEnableB2C = form.watch('enableB2C');
  const watchedMarketType = form.watch('marketType');
  const watchedDiscountPrice = form.watch('discountPrice');

  const currentSectionIndex = sections.findIndex(s => s.id === activeSection);
  const allUnits = [...defaultUnitOptions, ...customUnits];

  // Handle B2B/B2C mutual exclusivity
  const handleB2BChange = (enabled: boolean) => {
    form.setValue('enableB2B', enabled);
    if (enabled) {
      form.setValue('enableB2C', false);
    }
  };

  const handleB2CChange = (enabled: boolean) => {
    form.setValue('enableB2C', enabled);
    if (enabled) {
      form.setValue('enableB2B', false);
    }
  };

  const goToNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      setActiveSection(sections[currentSectionIndex + 1].id);
    }
  };

  const goToPrevSection = () => {
    if (currentSectionIndex > 0) {
      setActiveSection(sections[currentSectionIndex - 1].id);
    }
  };

  const handleAddCustomUnit = () => {
    if (newCustomUnit.trim()) {
      const unitValue = newCustomUnit.toLowerCase().replace(/\s+/g, '_');
      setCustomUnits([...customUnits, { value: unitValue, label: newCustomUnit.trim() }]);
      form.setValue('unit', unitValue);
      setNewCustomUnit('');
      setShowCustomUnitInput(false);
    }
  };

  const handleAddCustomCertification = () => {
    if (customCertInput.trim()) {
      const current = form.watch('customCertifications') || [];
      form.setValue('customCertifications', [...current, customCertInput.trim()]);
      setCustomCertInput('');
    }
  };

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        images,
        tieredPricing,
        variants,
        seasonalMonths,
        purchaseConditions,
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Touch/swipe handling for mobile tabs
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    (e.currentTarget as any).touchStartX = touch.clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const startX = (e.currentTarget as any).touchStartX;
    const diff = startX - touch.clientX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSectionIndex < sections.length - 1) {
        goToNextSection();
      } else if (diff < 0 && currentSectionIndex > 0) {
        goToPrevSection();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[95vh] md:h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 md:px-6 py-3 md:py-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-base md:text-lg">
                  {editProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                  Fill in the details below. Fields marked with * are required.
                </p>
              </div>
            </div>
            <Badge variant="outline" className={cn(
              "text-xs",
              watchedStatus === 'active' && "bg-success/10 text-success border-success/20",
              watchedStatus === 'draft' && "bg-muted text-muted-foreground",
              watchedStatus === 'seasonal' && "bg-warning/10 text-warning border-warning/20",
              watchedStatus === 'inactive' && "bg-destructive/10 text-destructive border-destructive/20",
            )}>
              {statusOptions.find(s => s.value === watchedStatus)?.label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          {/* Sidebar Navigation - Desktop */}
          <nav className="hidden md:block w-48 border-r bg-muted/20 p-3 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <section.icon className="w-4 h-4" />
                {section.label}
              </button>
            ))}
          </nav>

          {/* Mobile Navigation - Swipeable */}
          <div 
            className="md:hidden border-b"
            ref={tabsContainerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <ScrollArea className="w-full">
              <div className="flex p-2 gap-1">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground bg-muted/50"
                    )}
                  >
                    <span className="w-5 h-5 rounded-full bg-background/20 flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                    {section.label}
                  </button>
                ))}
              </div>
            </ScrollArea>
            <p className="text-[10px] text-muted-foreground text-center py-1">Swipe to navigate sections</p>
          </div>

          {/* Main Form Content */}
          <ScrollArea className="flex-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="p-4 md:p-6 space-y-6 md:space-y-8">
                <AnimatePresence mode="wait">
                  {/* Basic Info Section */}
                  {activeSection === 'basic' && (
                    <motion.div
                      key="basic"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {/* Product Name */}
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="col-span-1 md:col-span-2">
                              <FormLabel>Product Name *</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., Premium Arabica Coffee Beans" 
                                  {...field} 
                                  className="text-base md:text-lg"
                                />
                              </FormControl>
                              <FormDescription>
                                Give your product a clear, descriptive name
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Category & Tags */}
                        <div className="col-span-1 md:col-span-2">
                          <CategoryTagSelector
                            category={form.watch('category')}
                            tags={form.watch('tags')}
                            onCategoryChange={(cat) => form.setValue('category', cat)}
                            onTagsChange={(tags) => form.setValue('tags', tags)}
                            customCategories={customCategories}
                            onAddCustomCategory={(cat) => setCustomCategories([...customCategories, cat])}
                          />
                        </div>

                        {/* Short Description */}
                        <FormField
                          control={form.control}
                          name="shortDescription"
                          render={({ field }) => (
                            <FormItem className="col-span-1 md:col-span-2">
                              <FormLabel>Short Description *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Brief summary of your product (shown in listings)" 
                                  {...field}
                                  className="resize-none"
                                  rows={2}
                                />
                              </FormControl>
                              <FormDescription>
                                {field.value?.length || 0}/200 characters
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Long Description */}
                        <div className="col-span-1 md:col-span-2 space-y-2">
                          <Label>Full Description</Label>
                          <p className="text-xs text-muted-foreground mb-2">
                            Add detailed information, farming tips, storage instructions, certifications
                          </p>
                          <RichTextEditor
                            content={form.watch('longDescription') || ''}
                            onChange={(content) => form.setValue('longDescription', content)}
                            placeholder="Write a detailed description of your product..."
                          />
                        </div>

                        {/* Status */}
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {statusOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                      <div className="flex flex-col">
                                        <span>{opt.label}</span>
                                        <span className="text-xs text-muted-foreground">{opt.description}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Market Type */}
                        <FormField
                          control={form.control}
                          name="marketType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Market Type</FormLabel>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="local">
                                    <div className="flex items-center gap-2">
                                      <MapPin className="w-4 h-4" />
                                      Local Market Only
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="export">
                                    <div className="flex items-center gap-2">
                                      <Globe className="w-4 h-4" />
                                      Export Only
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="both">
                                    <div className="flex items-center gap-2">
                                      <Sparkles className="w-4 h-4" />
                                      Both Local & Export
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* B2B / B2C Toggles - Now Mutually Exclusive */}
                        <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className={cn(
                            "flex items-center justify-between p-3 md:p-4 rounded-lg border transition-colors",
                            watchedEnableB2B ? "bg-secondary/10 border-secondary/30" : "bg-card"
                          )}>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                                <Building2 className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
                              </div>
                              <div>
                                <Label className="text-sm">B2B / Wholesale</Label>
                                <p className="text-xs text-muted-foreground hidden sm:block">Sell to businesses in bulk</p>
                              </div>
                            </div>
                            <Switch
                              checked={watchedEnableB2B}
                              onCheckedChange={handleB2BChange}
                            />
                          </div>
                          <div className={cn(
                            "flex items-center justify-between p-3 md:p-4 rounded-lg border transition-colors",
                            watchedEnableB2C ? "bg-accent/10 border-accent/30" : "bg-card"
                          )}>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                                <Users className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                              </div>
                              <div>
                                <Label className="text-sm">B2C / Retail</Label>
                                <p className="text-xs text-muted-foreground hidden sm:block">Sell to individual buyers</p>
                              </div>
                            </div>
                            <Switch
                              checked={watchedEnableB2C}
                              onCheckedChange={handleB2CChange}
                            />
                          </div>
                        </div>

                        {/* Seasonal Calendar (if seasonal status) */}
                        <AnimatePresence>
                          {watchedStatus === 'seasonal' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="col-span-1 md:col-span-2"
                            >
                              <SeasonalCalendar
                                selectedMonths={seasonalMonths}
                                onChange={setSeasonalMonths}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Origin & Source Details */}
                        <FormField
                          control={form.control}
                          name="origin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Origin / Location *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., West Region, Cameroon" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="harvestDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Harvest / Production Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="grade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Grade / Quality *</FormLabel>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {gradeOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="packaging"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Packaging *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 50kg jute bags" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="batchNumber"
                          render={({ field }) => (
                            <FormItem className="col-span-1 md:col-span-2">
                              <FormLabel>Batch Number</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., CAM-2026-001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Certifications - With Custom Add */}
                        <div className="col-span-1 md:col-span-2 space-y-4">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-primary" />
                            <Label>Certifications</Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs text-sm">Add certifications to increase buyer trust. You can select from common certifications or add your own.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {defaultCertifications.map((cert) => {
                              const isSelected = form.watch('certifications').includes(cert);
                              return (
                                <button
                                  key={cert}
                                  type="button"
                                  onClick={() => {
                                    const current = form.watch('certifications');
                                    if (isSelected) {
                                      form.setValue('certifications', current.filter(c => c !== cert));
                                    } else {
                                      form.setValue('certifications', [...current, cert]);
                                    }
                                  }}
                                  className={cn(
                                    "px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors",
                                    isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                                  )}
                                >
                                  {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                                  {cert}
                                </button>
                              );
                            })}
                          </div>
                          
                          {/* Custom Certifications */}
                          {(form.watch('customCertifications') || []).length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {(form.watch('customCertifications') || []).map((cert, i) => (
                                <Badge key={i} variant="secondary" className="gap-1">
                                  {cert}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = form.watch('customCertifications') || [];
                                      form.setValue('customCertifications', current.filter((_, idx) => idx !== i));
                                    }}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    ×
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add custom certification..."
                              value={customCertInput}
                              onChange={(e) => setCustomCertInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddCustomCertification();
                                }
                              }}
                              className="flex-1"
                            />
                            <Button type="button" variant="outline" size="sm" onClick={handleAddCustomCertification}>
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Media Section */}
                  {activeSection === 'media' && (
                    <motion.div
                      key="media"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Product Images</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload clear, high-quality images of your product. The first image will be the main image shown to buyers. 
                          <strong className="text-primary"> Click the star icon to change the main photo.</strong>
                        </p>
                        <ImageUploader
                          images={images}
                          onChange={setImages}
                          maxImages={8}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Pricing Section */}
                  {activeSection === 'pricing' && (
                    <motion.div
                      key="pricing"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6 md:space-y-8"
                    >
                      {/* Unit Selection with Custom Option */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-primary" />
                          <Label>Unit of Measurement *</Label>
                        </div>
                        <div className="flex gap-2">
                          <Select value={form.watch('unit')} onValueChange={(v) => form.setValue('unit', v)}>
                            <SelectTrigger className="flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {allUnits.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => setShowCustomUnitInput(!showCustomUnitInput)}
                            title="Add custom unit"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <AnimatePresence>
                          {showCustomUnitInput && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex gap-2"
                            >
                              <Input
                                placeholder="e.g., 10kg bag, carton..."
                                value={newCustomUnit}
                                onChange={(e) => setNewCustomUnit(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddCustomUnit();
                                  }
                                }}
                              />
                              <Button type="button" onClick={handleAddCustomUnit}>Add</Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Base Pricing */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Base Price (XAF) *</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min={0}
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="discountPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                Discounted Price
                                <Badge variant="outline" className="text-xs bg-success/10 text-success">Sale</Badge>
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min={0}
                                  placeholder="Optional"
                                  value={field.value || ''}
                                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                {watchedDiscountPrice && watchedPrice > 0 && (
                                  <span className="text-success">
                                    {Math.round(((watchedPrice - watchedDiscountPrice) / watchedPrice) * 100)}% off
                                  </span>
                                )}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center justify-between p-3 md:p-4 rounded-lg border bg-card self-end h-[42px]">
                          <div>
                            <Label className="text-sm">Allow Negotiation</Label>
                          </div>
                          <Switch
                            checked={form.watch('isNegotiable')}
                            onCheckedChange={(v) => form.setValue('isNegotiable', v)}
                          />
                        </div>
                      </div>

                      {/* Export/International Pricing */}
                      <AnimatePresence>
                        {(watchedMarketType === 'export' || watchedMarketType === 'both') && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 rounded-lg border border-primary/20 bg-primary/5 space-y-4"
                          >
                            <div className="flex items-center gap-2">
                              <Globe className="w-5 h-5 text-primary" />
                              <Label className="font-semibold">Export / International Pricing</Label>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="exportPrice"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Export Price</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        min={0}
                                        placeholder="Price for international buyers"
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="exportCurrency"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Currency</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {currencyOptions.map((opt) => (
                                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Price Preview */}
                      {watchedPrice > 0 && (
                        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                          <p className="text-sm text-muted-foreground">Displayed price:</p>
                          <div className="flex items-baseline gap-3">
                            {watchedDiscountPrice ? (
                              <>
                                <p className="text-xl md:text-2xl font-bold text-primary">
                                  {formatXAF(watchedDiscountPrice)}<span className="text-sm md:text-base font-normal text-muted-foreground">/{watchedUnit}</span>
                                </p>
                                <p className="text-lg text-muted-foreground line-through">
                                  {formatXAF(watchedPrice)}
                                </p>
                                <Badge className="bg-success text-success-foreground">
                                  {Math.round(((watchedPrice - watchedDiscountPrice) / watchedPrice) * 100)}% OFF
                                </Badge>
                              </>
                            ) : (
                              <p className="text-xl md:text-2xl font-bold text-primary">
                                {formatXAF(watchedPrice)}<span className="text-sm md:text-base font-normal text-muted-foreground">/{watchedUnit}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* B2B Tiered Pricing */}
                      <AnimatePresence>
                        {watchedEnableB2B && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            <Separator className="my-6" />
                            <TieredPricingEditor
                              tiers={tieredPricing}
                              onChange={setTieredPricing}
                              basePrice={watchedPrice}
                              unit={watchedUnit}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* Inventory Section */}
                  {activeSection === 'inventory' && (
                    <motion.div
                      key="inventory"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        <FormField
                          control={form.control}
                          name="stock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Stock ({watchedUnit})</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min={0}
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormDescription>
                                How much product do you have available?
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="minStock"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Low Stock Alert ({watchedUnit})</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min={0}
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormDescription>
                                Get notified when stock falls below this level
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Stock Status Preview */}
                      {form.watch('stock') > 0 && (
                        <div className={cn(
                          "p-4 rounded-lg border",
                          form.watch('stock') <= form.watch('minStock')
                            ? "bg-warning/10 border-warning/30"
                            : "bg-success/10 border-success/30"
                        )}>
                          <p className="text-sm font-medium">
                            {form.watch('stock') <= form.watch('minStock') 
                              ? "⚠️ Stock is at or below alert level"
                              : "✓ Stock level is healthy"
                            }
                          </p>
                          <p className="text-xl md:text-2xl font-bold mt-1">
                            {form.watch('stock')} {watchedUnit}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Variants Section */}
                  {activeSection === 'variants' && (
                    <motion.div
                      key="variants"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      {/* Info Box */}
                      <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                        <div className="flex items-start gap-3">
                          <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-sm">What are Product Variants?</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Variants allow you to sell the same product in different forms. For example:
                            </p>
                            <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                              <li><strong>Different grades:</strong> Premium, Grade A, Grade B</li>
                              <li><strong>Different packaging:</strong> 1kg bag, 5kg bag, 25kg bag</li>
                              <li><strong>Different processing:</strong> Raw, Roasted, Ground</li>
                            </ul>
                            <p className="text-sm text-muted-foreground mt-2">
                              Each variant can have its own price, stock level, and SKU. Click <strong>"Add Variant"</strong> below to create one.
                            </p>
                          </div>
                        </div>
                      </div>

                      <ProductVariantEditor
                        variants={variants}
                        onChange={setVariants}
                        basePrice={watchedPrice}
                        productName={watchedName}
                      />
                    </motion.div>
                  )}

                  {/* Purchase Conditions Section */}
                  {activeSection === 'conditions' && (
                    <motion.div
                      key="conditions"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <PurchaseConditionsEditor
                        conditions={purchaseConditions}
                        onChange={setPurchaseConditions}
                        unit={watchedUnit}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </Form>
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 md:px-6 py-3 md:py-4 border-t bg-muted/30">
          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goToPrevSection}
              disabled={currentSectionIndex === 0}
              className="flex-1"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goToNextSection}
              disabled={currentSectionIndex === sections.length - 1}
              className="flex-1"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="hidden sm:inline-flex"
          >
            Cancel
          </Button>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button 
              type="button" 
              variant="outline"
              size="sm"
              onClick={() => {
                form.setValue('status', 'draft');
                form.handleSubmit(handleSubmit)();
              }}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Save as </span>Draft
            </Button>
            <Button 
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none"
              size="sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 sm:mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1 sm:mr-2" />
                  {editProduct ? 'Update' : 'Create'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
