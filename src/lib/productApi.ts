// Product API Placeholders for Supabase Integration
// These functions will be connected to Supabase once the backend is ready

import { supabase } from "@/integrations/supabase/client";

export interface ProductDetails {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  status: 'active' | 'draft' | 'seasonal' | 'out_of_stock' | 'discontinued';
  tags: string[];
  isOrganic: boolean;
  isFeatured: boolean;
  unit: string;
  moq: number;
  maxOrderQuantity: number | null;
  origin: {
    country: string;
    region: string;
  };
  harvestDate: string | null;
  expiryDate: string | null;
  leadTimeDays: number;
  viewCount: number;
  orderCount: number;
}

export interface ProductMedia {
  images: {
    id: string;
    url: string;
    altText: string;
    isPrimary: boolean;
    sortOrder: number;
  }[];
  video?: {
    url: string;
    thumbnail: string;
  };
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  grade: string;
  packaging: string;
  weight: number;
  weightUnit: string;
  stockQuantity: number;
  lowStockThreshold: number;
  isDefault: boolean;
}

export interface ProductPricing {
  domesticPrice: number;
  internationalPrice: number | null;
  currency: string;
  tiers: {
    id: string;
    minQuantity: number;
    maxQuantity: number | null;
    pricePerUnit: number;
    discountPercentage: number | null;
  }[];
}

export interface ProductInventory {
  totalStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockThreshold: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
  seasonalAvailability?: {
    startMonth: number;
    endMonth: number;
  };
}

export interface ProductConditions {
  minOrderQuantity: number;
  maxOrderQuantity: number | null;
  handlingInstructions: string | null;
  storageInstructions: string | null;
  certifications: string[];
  exportReady: boolean;
  buyerRestrictions: string | null;
}

export interface SellerProfile {
  id: string;
  companyName: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  description: string | null;
  location: {
    city: string;
    region: string;
    country: string;
  };
  rating: number;
  totalReviews: number;
  totalOrders: number;
  totalProducts: number;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  responseRate: number;
  responseTimeHours: number;
  isActive: boolean;
  isFeatured: boolean;
  yearsInOperation: number;
}

export interface RelatedProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  unit: string;
  rating: number;
  soldCount: number;
  isOrganic: boolean;
}

export interface ExchangeRates {
  baseCurrency: string;
  rates: Record<string, number>;
  lastUpdated: string;
}

// API Placeholder Functions

export async function fetchProductById(productId: string): Promise<ProductDetails | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        supplier:suppliers(company_name)
      `)
      .eq('id', productId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      slug: data.slug || '',
      shortDescription: data.short_description || '',
      description: data.description || '',
      category: data.category ? {
        id: data.category.id,
        name: data.category.name,
        slug: data.category.slug,
      } : { id: '', name: '', slug: '' },
      status: data.status as ProductDetails['status'],
      tags: data.is_organic ? ['Organic'] : [],
      isOrganic: data.is_organic || false,
      isFeatured: data.is_featured || false,
      unit: data.unit_of_measure,
      moq: data.min_order_quantity || 1,
      maxOrderQuantity: data.max_order_quantity,
      origin: {
        country: data.origin_country || '',
        region: data.origin_region || '',
      },
      harvestDate: data.harvest_date,
      expiryDate: data.expiry_date,
      leadTimeDays: data.lead_time_days || 3,
      viewCount: data.view_count || 0,
      orderCount: data.order_count || 0,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function fetchProductMedia(productId: string): Promise<ProductMedia> {
  try {
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('sort_order', { ascending: true });

    if (error || !data) {
      return { images: [] };
    }

    return {
      images: data.map(img => ({
        id: img.id,
        url: img.image_url,
        altText: img.alt_text || '',
        isPrimary: img.is_primary || false,
        sortOrder: img.sort_order || 0,
      })),
    };
  } catch (error) {
    console.error('Error fetching product media:', error);
    return { images: [] };
  }
}

export async function fetchProductVariants(productId: string): Promise<ProductVariant[]> {
  try {
    const { data, error } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId)
      .eq('is_active', true);

    if (error || !data) return [];

    return data.map(variant => ({
      id: variant.id,
      name: variant.name,
      sku: variant.sku || '',
      grade: variant.grade || 'Standard',
      packaging: variant.packaging || '',
      weight: variant.weight || 0,
      weightUnit: variant.weight_unit || 'kg',
      stockQuantity: variant.stock_quantity || 0,
      lowStockThreshold: variant.low_stock_threshold || 10,
      isDefault: variant.is_default || false,
    }));
  } catch (error) {
    console.error('Error fetching variants:', error);
    return [];
  }
}

export async function fetchProductPricing(variantId: string): Promise<ProductPricing | null> {
  try {
    const { data, error } = await supabase
      .from('pricing_tiers')
      .select('*')
      .eq('product_variant_id', variantId)
      .eq('is_active', true)
      .order('min_quantity', { ascending: true });

    if (error || !data || data.length === 0) return null;

    const basePrice = data[0].price_per_unit;

    return {
      domesticPrice: basePrice,
      internationalPrice: null,
      currency: data[0].currency || 'XAF',
      tiers: data.map(tier => ({
        id: tier.id,
        minQuantity: tier.min_quantity,
        maxQuantity: tier.max_quantity,
        pricePerUnit: tier.price_per_unit,
        discountPercentage: tier.discount_percentage,
      })),
    };
  } catch (error) {
    console.error('Error fetching pricing:', error);
    return null;
  }
}

export async function fetchInventoryLevels(variantId: string): Promise<ProductInventory | null> {
  try {
    const { data, error } = await supabase
      .from('product_variants')
      .select('stock_quantity, reserved_quantity, low_stock_threshold')
      .eq('id', variantId)
      .single();

    if (error || !data) return null;

    const totalStock = data.stock_quantity || 0;
    const reservedStock = data.reserved_quantity || 0;
    const availableStock = totalStock - reservedStock;
    const lowStockThreshold = data.low_stock_threshold || 10;

    return {
      totalStock,
      reservedStock,
      availableStock,
      lowStockThreshold,
      isLowStock: availableStock <= lowStockThreshold && availableStock > 0,
      isOutOfStock: availableStock <= 0,
    };
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return null;
  }
}

export async function fetchPurchaseConditions(productId: string): Promise<ProductConditions | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('min_order_quantity, max_order_quantity, is_organic')
      .eq('id', productId)
      .single();

    if (error || !data) return null;

    return {
      minOrderQuantity: data.min_order_quantity || 1,
      maxOrderQuantity: data.max_order_quantity,
      handlingInstructions: null,
      storageInstructions: null,
      certifications: data.is_organic ? ['Organic Certified'] : [],
      exportReady: true,
      buyerRestrictions: null,
    };
  } catch (error) {
    console.error('Error fetching conditions:', error);
    return null;
  }
}

export async function fetchSellerProfile(supplierId: string): Promise<SellerProfile | null> {
  try {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', supplierId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      companyName: data.company_name,
      logoUrl: data.logo_url,
      bannerUrl: data.banner_url,
      description: data.description,
      location: {
        city: data.city || '',
        region: data.region || '',
        country: data.country,
      },
      rating: data.rating || 0,
      totalReviews: data.total_reviews || 0,
      totalOrders: data.total_orders || 0,
      totalProducts: data.total_products || 0,
      verificationStatus: data.verification_status as SellerProfile['verificationStatus'],
      responseRate: data.response_rate || 0,
      responseTimeHours: data.response_time_hours || 24,
      isActive: data.is_active || false,
      isFeatured: data.is_featured || false,
      yearsInOperation: new Date().getFullYear() - new Date(data.created_at).getFullYear(),
    };
  } catch (error) {
    console.error('Error fetching seller:', error);
    return null;
  }
}

export async function fetchRelatedProducts(productId: string, categoryId: string, supplierId: string): Promise<RelatedProduct[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, name, 
        product_images(image_url),
        product_variants(
          pricing_tiers(price_per_unit)
        ),
        unit_of_measure, is_organic, order_count
      `)
      .or(`category_id.eq.${categoryId},supplier_id.eq.${supplierId}`)
      .neq('id', productId)
      .eq('status', 'active')
      .limit(6);

    if (error || !data) return [];

    return data.map(product => ({
      id: product.id,
      name: product.name,
      image: product.product_images?.[0]?.image_url || '/placeholder.svg',
      price: product.product_variants?.[0]?.pricing_tiers?.[0]?.price_per_unit || 0,
      unit: product.unit_of_measure,
      rating: 4.5,
      soldCount: product.order_count || 0,
      isOrganic: product.is_organic || false,
    }));
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

export function calculateTieredPricing(
  quantity: number,
  tiers: ProductPricing['tiers']
): { applicableTier: ProductPricing['tiers'][0] | null; totalPrice: number; unitPrice: number } {
  if (!tiers || tiers.length === 0) {
    return { applicableTier: null, totalPrice: 0, unitPrice: 0 };
  }

  // Find the applicable tier based on quantity
  const applicableTier = tiers.find(tier => 
    quantity >= tier.minQuantity && 
    (tier.maxQuantity === null || quantity <= tier.maxQuantity)
  ) || tiers[tiers.length - 1]; // Default to last tier if quantity exceeds all

  const unitPrice = applicableTier?.pricePerUnit || 0;
  const totalPrice = unitPrice * quantity;

  return { applicableTier, totalPrice, unitPrice };
}

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  // Placeholder - would connect to actual exchange rate API
  return {
    baseCurrency: 'XAF',
    rates: {
      USD: 0.00166,
      EUR: 0.00152,
      GBP: 0.00131,
      NGN: 2.56,
    },
    lastUpdated: new Date().toISOString(),
  };
}

export function convertPrice(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates['rates']
): number {
  if (fromCurrency === toCurrency) return amount;
  
  const rate = rates[toCurrency];
  if (!rate) return amount;
  
  return Math.round(amount * rate * 100) / 100;
}

// Increment view count - placeholder until RPC is created
export async function incrementProductView(productId: string): Promise<void> {
  try {
    // Will be implemented with a database function
    console.log('View tracked for product:', productId);
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
}
