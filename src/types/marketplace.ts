// Harvestá Marketplace Types

export interface Vendor {
  id: string;
  name: string;
  logo?: string;
  rating: number;
  totalSales: number;
  location: string;
  isVerified: boolean;
  isQualityChecked: boolean;
  responseTime: string;
}

export interface PricingTier {
  minQuantity: number;
  maxQuantity: number | null;
  pricePerUnit: number;
}

export interface DeliveryOption {
  id: string;
  type: 'pickup' | 'vendor_delivery' | 'third_party';
  name: string;
  estimatedDays: { min: number; max: number };
  cost: number;
  freeAbove?: number;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  grade: string;
  origin: string;
  unit: string;
  moq: number;
  pricingTiers: PricingTier[];
  currentPrice: number;
  originalPrice?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  vendor: Vendor;
  quantity: number;
  selectedDeliveryOption?: DeliveryOption;
  notes?: string;
}

export interface CartGroup {
  vendor: Vendor;
  items: CartItem[];
  deliveryOptions: DeliveryOption[];
  selectedDeliveryOption?: DeliveryOption;
  subtotal: number;
}

export interface BuyerInfo {
  type: 'individual' | 'business';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
  taxId?: string;
  contactPerson?: string;
}

export interface DeliveryAddress {
  id?: string;
  label: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'mobile_money' | 'bank_transfer' | 'cash_on_delivery' | 'wallet';
  name: string;
  icon: string;
  details?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  paymentStatus: 'pending' | 'confirmed' | 'failed';
  buyer: BuyerInfo;
  deliveryAddress: DeliveryAddress;
  groups: CartGroup[];
  subtotal: number;
  deliveryTotal: number;
  taxes: number;
  grandTotal: number;
  currency: string;
  paymentMethod: PaymentMethod;
}

// Supplier Profile Types
export interface SupplierProfile extends Vendor {
  description: string;
  coverImage?: string;
  yearsInOperation: number;
  capacity: string;
  productionMethods: string[];
  certifications: Certification[];
  socialLinks: SocialLinks;
  activityPosts: ActivityPost[];
  gallery: GalleryItem[];
}

export interface Certification {
  id: string;
  name: string;
  issuedBy: string;
  validUntil?: string;
  icon: string;
}

export interface SocialLinks {
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  website?: string;
}

export interface ActivityPost {
  id: string;
  type: 'harvest' | 'price_update' | 'new_product' | 'general';
  title: string;
  content: string;
  image?: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption?: string;
}

export interface Review {
  id: string;
  buyerName: string;
  buyerAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  productName?: string;
}

// Search & Filter Types
export interface SearchFilters {
  query?: string;
  category?: string;
  subCategory?: string;
  grade?: string[];
  priceRange?: { min: number; max: number };
  moqRange?: { min: number; max: number };
  origin?: string[];
  certifications?: string[];
  verifiedOnly?: boolean;
  harvestDate?: { start: string; end: string };
}

export interface SortOption {
  value: string;
  label: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  subCategories: SubCategory[];
  productCount: number;
  image: string;
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

// RFQ Types
export interface RFQRequest {
  id?: string;
  productId?: string;
  productName: string;
  quantity: number;
  grade: string;
  deliveryLocation: string;
  expectedDeliveryDate: string;
  budgetRange?: { min: number; max: number };
  notes?: string;
  targetSuppliers: 'specific' | 'multiple' | 'all';
  supplierIds?: string[];
}

export interface RFQStatus {
  id: string;
  status: 'pending' | 'quoted' | 'negotiating' | 'accepted' | 'rejected' | 'expired';
  submittedAt: string;
  quotes: RFQQuote[];
}

export interface RFQQuote {
  id: string;
  supplierId: string;
  supplierName: string;
  pricePerUnit: number;
  totalPrice: number;
  deliveryDays: number;
  validUntil: string;
  notes?: string;
}

// Order Tracking Types
export interface OrderTracking {
  orderId: string;
  orderNumber: string;
  currentStatus: Order['status'];
  timeline: TrackingEvent[];
  vendorTracking: VendorTracking[];
}

export interface TrackingEvent {
  status: string;
  title: string;
  description: string;
  timestamp: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface VendorTracking {
  vendorId: string;
  vendorName: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery: string;
  status: string;
}

// Price Comparison Types
export interface PriceComparison {
  product: Product;
  suppliers: SupplierPrice[];
}

export interface SupplierPrice {
  supplier: Vendor;
  grade: string;
  moq: number;
  pricingTiers: PricingTier[];
  currentPrice: number;
  deliveryEstimate: { min: number; max: number };
  isBestValue?: boolean;
}

// API Placeholder Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
