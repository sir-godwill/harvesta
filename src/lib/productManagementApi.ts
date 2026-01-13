// =================================================================
// HARVESTÁ PRODUCT MANAGEMENT API PLACEHOLDERS
// All functions are prepared for Supabase integration
// =================================================================

import { supabase } from "@/integrations/supabase/client";

// Types
export interface ProductFormData {
  // Basic Info
  id?: string;
  name: string;
  slug?: string;
  short_description: string;
  description: string;
  category_id: string;
  sku?: string;
  unit_of_measure: string;
  status: 'draft' | 'active' | 'inactive' | 'out_of_stock' | 'discontinued';
  
  // Attributes
  is_organic: boolean;
  is_featured: boolean;
  origin_country: string;
  origin_region: string;
  harvest_date?: string;
  expiry_date?: string;
  lead_time_days?: number;
  
  // Order Limits
  min_order_quantity: number;
  max_order_quantity?: number;
  
  // Supplier
  supplier_id: string;
  
  // Tags & Labels
  tags: string[];
  labels: string[];
  
  // B2B/B2C Settings
  enable_b2b: boolean;
  enable_b2c: boolean;
  enable_international: boolean;
}

export interface ProductVariant {
  id?: string;
  product_id?: string;
  name: string;
  sku?: string;
  grade?: string;
  quality?: string;
  packaging?: string;
  weight?: number;
  weight_unit?: string;
  stock_quantity: number;
  low_stock_threshold: number;
  is_default: boolean;
  is_active: boolean;
}

export interface PricingTier {
  id?: string;
  product_variant_id?: string;
  min_quantity: number;
  max_quantity?: number | null;
  price_per_unit: number;
  currency: string;
  discount_percentage?: number;
  is_active: boolean;
}

export interface ProductImage {
  id?: string;
  product_id?: string;
  variant_id?: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

export interface PurchaseCondition {
  id?: string;
  product_id?: string;
  condition_type: 'min_quantity' | 'max_quantity' | 'delivery' | 'payment' | 'buyer_type' | 'handling' | 'custom';
  title: string;
  description: string;
  value?: string;
  is_required: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  icon?: string;
  image_url?: string;
  is_active: boolean;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

// =================================================================
// PRODUCT CRUD OPERATIONS
// =================================================================

export async function createProduct(data: ProductFormData) {
  const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  const { data: product, error } = await supabase
    .from('products')
    .insert({
      name: data.name,
      slug,
      short_description: data.short_description,
      description: data.description,
      category_id: data.category_id || null,
      sku: data.sku,
      unit_of_measure: data.unit_of_measure,
      status: data.status,
      is_organic: data.is_organic,
      is_featured: data.is_featured,
      origin_country: data.origin_country,
      origin_region: data.origin_region,
      harvest_date: data.harvest_date || null,
      expiry_date: data.expiry_date || null,
      lead_time_days: data.lead_time_days,
      min_order_quantity: data.min_order_quantity,
      max_order_quantity: data.max_order_quantity,
      supplier_id: data.supplier_id,
    })
    .select()
    .single();

  return { data: product, error };
}

export async function updateProduct(productId: string, data: Partial<ProductFormData>) {
  const { data: product, error } = await supabase
    .from('products')
    .update({
      name: data.name,
      short_description: data.short_description,
      description: data.description,
      category_id: data.category_id || null,
      sku: data.sku,
      unit_of_measure: data.unit_of_measure,
      status: data.status,
      is_organic: data.is_organic,
      is_featured: data.is_featured,
      origin_country: data.origin_country,
      origin_region: data.origin_region,
      harvest_date: data.harvest_date || null,
      expiry_date: data.expiry_date || null,
      lead_time_days: data.lead_time_days,
      min_order_quantity: data.min_order_quantity,
      max_order_quantity: data.max_order_quantity,
    })
    .eq('id', productId)
    .select()
    .single();

  return { data: product, error };
}

export async function fetchProductForEdit(productId: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      supplier:suppliers(*),
      variants:product_variants(
        *,
        pricing_tiers(*)
      ),
      images:product_images(*)
    `)
    .eq('id', productId)
    .single();

  return { data, error };
}

export async function deleteProduct(productId: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  return { error };
}

// =================================================================
// CATEGORIES & TAGS
// =================================================================

export async function fetchCategories(): Promise<{ data: Category[] | null; error: any }> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  return { data, error };
}

export async function createCategory(name: string, parentId?: string) {
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name,
      slug,
      parent_id: parentId || null,
      is_active: true,
    })
    .select()
    .single();

  return { data, error };
}

export async function fetchTags(): Promise<{ data: Tag[] | null; error: any }> {
  // Tags could be stored in a separate table or as JSON
  // For now, return predefined agro-specific tags
  const predefinedTags: Tag[] = [
    { id: '1', name: 'Organic', slug: 'organic', color: '#22c55e' },
    { id: '2', name: 'Export-Ready', slug: 'export-ready', color: '#3b82f6' },
    { id: '3', name: 'Seasonal', slug: 'seasonal', color: '#f59e0b' },
    { id: '4', name: 'Fresh', slug: 'fresh', color: '#10b981' },
    { id: '5', name: 'Premium', slug: 'premium', color: '#8b5cf6' },
    { id: '6', name: 'Fair Trade', slug: 'fair-trade', color: '#06b6d4' },
    { id: '7', name: 'Certified', slug: 'certified', color: '#14b8a6' },
    { id: '8', name: 'Bulk Only', slug: 'bulk-only', color: '#6366f1' },
  ];
  
  return { data: predefinedTags, error: null };
}

export async function createTag(name: string, color?: string) {
  // Placeholder for creating custom tags
  const newTag: Tag = {
    id: `tag_${Date.now()}`,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    color: color || '#6b7280',
  };
  return { data: newTag, error: null };
}

// =================================================================
// PRODUCT VARIANTS
// =================================================================

export async function fetchProductVariants(productId: string) {
  const { data, error } = await supabase
    .from('product_variants')
    .select(`
      *,
      pricing_tiers(*)
    `)
    .eq('product_id', productId)
    .order('is_default', { ascending: false });

  return { data, error };
}

export async function createProductVariant(variant: ProductVariant) {
  const { data, error } = await supabase
    .from('product_variants')
    .insert({
      product_id: variant.product_id,
      name: variant.name,
      sku: variant.sku,
      grade: variant.grade,
      quality: variant.quality,
      packaging: variant.packaging,
      weight: variant.weight,
      weight_unit: variant.weight_unit,
      stock_quantity: variant.stock_quantity,
      low_stock_threshold: variant.low_stock_threshold,
      is_default: variant.is_default,
      is_active: variant.is_active,
    })
    .select()
    .single();

  return { data, error };
}

export async function updateProductVariant(variantId: string, variant: Partial<ProductVariant>) {
  const { data, error } = await supabase
    .from('product_variants')
    .update(variant)
    .eq('id', variantId)
    .select()
    .single();

  return { data, error };
}

export async function deleteProductVariant(variantId: string) {
  const { error } = await supabase
    .from('product_variants')
    .delete()
    .eq('id', variantId);

  return { error };
}

// =================================================================
// PRICING TIERS
// =================================================================

export async function createPricingTier(tier: PricingTier) {
  const { data, error } = await supabase
    .from('pricing_tiers')
    .insert({
      product_variant_id: tier.product_variant_id,
      min_quantity: tier.min_quantity,
      max_quantity: tier.max_quantity,
      price_per_unit: tier.price_per_unit,
      currency: tier.currency,
      discount_percentage: tier.discount_percentage,
      is_active: tier.is_active,
    })
    .select()
    .single();

  return { data, error };
}

export async function updatePricingTier(tierId: string, tier: Partial<PricingTier>) {
  const { data, error } = await supabase
    .from('pricing_tiers')
    .update(tier)
    .eq('id', tierId)
    .select()
    .single();

  return { data, error };
}

export async function deletePricingTier(tierId: string) {
  const { error } = await supabase
    .from('pricing_tiers')
    .delete()
    .eq('id', tierId);

  return { error };
}

export function calculateTieredPricing(quantity: number, tiers: PricingTier[]) {
  const sortedTiers = [...tiers].sort((a, b) => a.min_quantity - b.min_quantity);
  
  for (const tier of sortedTiers.reverse()) {
    if (quantity >= tier.min_quantity) {
      if (!tier.max_quantity || quantity <= tier.max_quantity) {
        return {
          tier,
          pricePerUnit: tier.price_per_unit,
          totalPrice: tier.price_per_unit * quantity,
          savings: sortedTiers[0].price_per_unit * quantity - tier.price_per_unit * quantity,
        };
      }
    }
  }
  
  return {
    tier: sortedTiers[0],
    pricePerUnit: sortedTiers[0]?.price_per_unit || 0,
    totalPrice: (sortedTiers[0]?.price_per_unit || 0) * quantity,
    savings: 0,
  };
}

// =================================================================
// INVENTORY
// =================================================================

export async function fetchInventoryLevels(productId: string) {
  const { data, error } = await supabase
    .from('product_variants')
    .select('id, name, stock_quantity, low_stock_threshold, reserved_quantity')
    .eq('product_id', productId);

  return { data, error };
}

export async function updateInventory(variantId: string, quantity: number) {
  const { data, error } = await supabase
    .from('product_variants')
    .update({ stock_quantity: quantity })
    .eq('id', variantId)
    .select()
    .single();

  return { data, error };
}

// =================================================================
// IMAGES
// =================================================================

export async function uploadProductImage(
  productId: string,
  file: File,
  isPrimary: boolean = false,
  sortOrder: number = 0
) {
  // In a real implementation, this would upload to Supabase Storage
  // For now, return a placeholder
  const mockUrl = URL.createObjectURL(file);
  
  const { data, error } = await supabase
    .from('product_images')
    .insert({
      product_id: productId,
      image_url: mockUrl,
      alt_text: file.name,
      is_primary: isPrimary,
      sort_order: sortOrder,
    })
    .select()
    .single();

  return { data, error };
}

export async function deleteProductImage(imageId: string) {
  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId);

  return { error };
}

export async function reorderProductImages(images: { id: string; sort_order: number }[]) {
  const promises = images.map(img =>
    supabase
      .from('product_images')
      .update({ sort_order: img.sort_order })
      .eq('id', img.id)
  );
  
  await Promise.all(promises);
  return { error: null };
}

export async function setPrimaryImage(imageId: string, productId: string) {
  // First, unset all primary images for this product
  await supabase
    .from('product_images')
    .update({ is_primary: false })
    .eq('product_id', productId);
  
  // Then set the new primary
  const { data, error } = await supabase
    .from('product_images')
    .update({ is_primary: true })
    .eq('id', imageId)
    .select()
    .single();

  return { data, error };
}

// =================================================================
// PURCHASE CONDITIONS
// =================================================================

export async function fetchPurchaseConditions(productId: string) {
  // This would fetch from a purchase_conditions table
  // For now, return empty array as placeholder
  return { data: [] as PurchaseCondition[], error: null };
}

export async function createPurchaseCondition(condition: PurchaseCondition) {
  // Placeholder for creating purchase conditions
  return { data: { ...condition, id: `cond_${Date.now()}` }, error: null };
}

export async function updatePurchaseCondition(conditionId: string, condition: Partial<PurchaseCondition>) {
  // Placeholder for updating purchase conditions
  return { data: condition, error: null };
}

export async function deletePurchaseCondition(conditionId: string) {
  // Placeholder for deleting purchase conditions
  return { error: null };
}

// =================================================================
// EXCHANGE RATES
// =================================================================

export async function fetchExchangeRates(baseCurrency: string = 'XAF') {
  // Placeholder exchange rates (would come from external API or database)
  const rates: Record<string, number> = {
    XAF: 1,
    USD: 0.0016,
    EUR: 0.0015,
    GBP: 0.0013,
    NGN: 2.45,
    GHS: 0.019,
    KES: 0.23,
  };
  
  return { data: rates, error: null };
}

export function convertCurrency(amount: number, fromCurrency: string, toCurrency: string, rates: Record<string, number>) {
  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;
  
  // Convert to base (XAF) then to target
  const baseAmount = amount / fromRate;
  return baseAmount * toRate;
}

// =================================================================
// SUPPLIERS (for admin)
// =================================================================

export async function fetchActiveSuppliers() {
  const { data, error } = await supabase
    .from('suppliers')
    .select('id, company_name, city, country, verification_status')
    .eq('is_active', true)
    .order('company_name');

  return { data, error };
}
