// Supabase Service Layer - Database Operations
// This module provides all database operations for the application

import { supabase } from "@/integrations/supabase/client";
import type { Database, Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// ============================================
// PRODUCT OPERATIONS
// ============================================

export interface ProductWithDetails {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  short_description: string | null;
  category_id: string | null;
  supplier_id: string;
  status: string;
  unit_of_measure: string;
  min_order_quantity: number | null;
  max_order_quantity: number | null;
  lead_time_days: number | null;
  is_featured: boolean | null;
  is_organic: boolean | null;
  origin_country: string | null;
  origin_region: string | null;
  harvest_date: string | null;
  view_count: number | null;
  order_count: number | null;
  created_at: string;
  supplier?: Tables<"suppliers">;
  category?: Tables<"categories">;
  variants?: (Tables<"product_variants"> & {
    pricing_tiers?: Tables<"pricing_tiers">[];
  })[];
  images?: Tables<"product_images">[];
}

export async function fetchProducts(options?: {
  category_id?: string;
  supplier_id?: string;
  is_featured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from("products")
    .select(`
      *,
      supplier:suppliers(*),
      category:categories(*),
      variants:product_variants(*, pricing_tiers:pricing_tiers(*)),
      images:product_images(*)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (options?.category_id) {
    query = query.eq("category_id", options.category_id);
  }
  if (options?.supplier_id) {
    query = query.eq("supplier_id", options.supplier_id);
  }
  if (options?.is_featured) {
    query = query.eq("is_featured", true);
  }
  if (options?.search) {
    query = query.ilike("name", `%${options.search}%`);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
  }

  const { data, error } = await query;
  return { data: data as ProductWithDetails[] | null, error };
}

export async function fetchProductById(productId: string) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      supplier:suppliers(*),
      category:categories(*),
      variants:product_variants(*, pricing_tiers:pricing_tiers(*)),
      images:product_images(*)
    `)
    .eq("id", productId)
    .single();

  return { data: data as ProductWithDetails | null, error };
}

export async function fetchProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      supplier:suppliers(*),
      category:categories(*),
      variants:product_variants(*, pricing_tiers:pricing_tiers(*)),
      images:product_images(*)
    `)
    .eq("slug", slug)
    .single();

  return { data: data as ProductWithDetails | null, error };
}

// ============================================
// CATEGORY OPERATIONS
// ============================================

export interface CategoryWithChildren extends Tables<"categories"> {
  children?: Tables<"categories">[];
}

export async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return { data: null, error };

  // Build hierarchy
  const rootCategories = data.filter(c => !c.parent_id);
  const categoriesWithChildren = rootCategories.map(cat => ({
    ...cat,
    children: data.filter(c => c.parent_id === cat.id)
  }));

  return { data: categoriesWithChildren as CategoryWithChildren[], error: null };
}

export async function fetchCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  return { data, error };
}

// ============================================
// SUPPLIER OPERATIONS
// ============================================

export async function fetchSuppliers(options?: {
  is_featured?: boolean;
  verification_status?: string;
  limit?: number;
  search?: string;
}) {
  let query = supabase
    .from("suppliers")
    .select("*")
    .eq("is_active", true)
    .eq("verification_status", "verified")
    .order("rating", { ascending: false });

  if (options?.is_featured) {
    query = query.eq("is_featured", true);
  }
  if (options?.search) {
    query = query.ilike("company_name", `%${options.search}%`);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  return { data, error };
}

export async function fetchSupplierById(supplierId: string) {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("id", supplierId)
    .single();

  return { data, error };
}

// ============================================
// CART OPERATIONS
// ============================================

export async function getOrCreateCart(userId: string) {
  // First, try to get existing active cart
  const { data: existingCart, error: fetchError } = await supabase
    .from("carts")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (fetchError) return { data: null, error: fetchError };
  if (existingCart) return { data: existingCart, error: null };

  // Create new cart if none exists
  const { data: newCart, error: createError } = await supabase
    .from("carts")
    .insert({ user_id: userId, status: "active" })
    .select()
    .single();

  return { data: newCart, error: createError };
}

export async function fetchCartItems(cartId: string) {
  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      *,
      product_variant:product_variants(
        *,
        product:products(
          *,
          supplier:suppliers(*),
          images:product_images(*)
        ),
        pricing_tiers:pricing_tiers(*)
      )
    `)
    .eq("cart_id", cartId)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function addToCart(cartId: string, productVariantId: string, quantity: number) {
  // Check if item already exists
  const { data: existing } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cartId)
    .eq("product_variant_id", productVariantId)
    .maybeSingle();

  if (existing) {
    // Update quantity
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id)
      .select()
      .single();
    return { data, error };
  }

  // Add new item
  const { data, error } = await supabase
    .from("cart_items")
    .insert({ cart_id: cartId, product_variant_id: productVariantId, quantity })
    .select()
    .single();

  return { data, error };
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const { data, error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId)
    .select()
    .single();

  return { data, error };
}

export async function removeCartItem(itemId: string) {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", itemId);

  return { error };
}

export async function clearCart(cartId: string) {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cartId);

  return { error };
}

// ============================================
// ORDER OPERATIONS
// ============================================

export interface OrderWithDetails extends Tables<"orders"> {
  items?: (Tables<"order_items"> & {
    product_variant?: Tables<"product_variants">;
    supplier?: Partial<Tables<"suppliers">> | null;
  })[];
  shipping_address?: Tables<"addresses"> | null;
  billing_address?: Tables<"addresses"> | null;
  delivery?: (Tables<"deliveries"> & {
    logistics_partner?: Tables<"logistics_partners"> | null;
    events?: Tables<"shipment_events">[];
  }) | null;
}

export async function createOrder(orderData: {
  userId: string;
  shippingAddressId: string;
  billingAddressId?: string;
  items: {
    productVariantId: string;
    supplierId: string;
    productName: string;
    variantName?: string;
    quantity: number;
    unitPrice: number;
  }[];
  notes?: string;
}) {
  const { userId, shippingAddressId, billingAddressId, items, notes } = orderData;
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const taxAmount = subtotal * 0.1925; // 19.25% VAT for Cameroon
  const deliveryFee = 0; // Calculate based on delivery option
  const totalAmount = subtotal + taxAmount + deliveryFee;

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      order_number: "", // Will be auto-generated by trigger
      shipping_address_id: shippingAddressId,
      billing_address_id: billingAddressId || shippingAddressId,
      subtotal,
      tax_amount: taxAmount,
      delivery_fee: deliveryFee,
      total_amount: totalAmount,
      notes,
      status: "pending",
      payment_status: "pending"
    })
    .select()
    .single();

  if (orderError || !order) return { data: null, error: orderError };

  // Create order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_variant_id: item.productVariantId,
    supplier_id: item.supplierId,
    product_name: item.productName,
    variant_name: item.variantName,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    subtotal: item.unitPrice * item.quantity,
    total: item.unitPrice * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) return { data: null, error: itemsError };

  return { data: order, error: null };
}

export async function fetchOrders(userId: string, options?: {
  status?: Database["public"]["Enums"]["order_status"];
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from("orders")
    .select(`
      *,
      items:order_items(
        *,
        supplier:suppliers(id, company_name, logo_url)
      ),
      shipping_address:addresses!orders_shipping_address_id_fkey(*),
      delivery:deliveries(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (options?.status) {
    query = query.eq("status", options.status as Database["public"]["Enums"]["order_status"]);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  return { data: data as unknown as OrderWithDetails[] | null, error };
}

export async function fetchOrderById(orderId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(
        *,
        supplier:suppliers(id, company_name, logo_url, phone, email)
      ),
      shipping_address:addresses!orders_shipping_address_id_fkey(*),
      billing_address:addresses!orders_billing_address_id_fkey(*),
      delivery:deliveries(
        *,
        logistics_partner:logistics_partners(*),
        events:shipment_events(*)
      )
    `)
    .eq("id", orderId)
    .single();

  return { data: data as unknown as OrderWithDetails | null, error };
}

// ============================================
// SAVED ITEMS OPERATIONS
// ============================================

export async function fetchSavedProducts(userId: string) {
  const { data, error } = await supabase
    .from("saved_products")
    .select(`
      *,
      product:products(
        *,
        supplier:suppliers(*),
        images:product_images(*),
        variants:product_variants(*, pricing_tiers:pricing_tiers(*))
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function saveProduct(userId: string, productId: string) {
  const { data, error } = await supabase
    .from("saved_products")
    .insert({ user_id: userId, product_id: productId })
    .select()
    .single();

  return { data, error };
}

export async function unsaveProduct(userId: string, productId: string) {
  const { error } = await supabase
    .from("saved_products")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  return { error };
}

export async function isProductSaved(userId: string, productId: string) {
  const { data } = await supabase
    .from("saved_products")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  return !!data;
}

export async function fetchSavedSuppliers(userId: string) {
  const { data, error } = await supabase
    .from("saved_suppliers")
    .select(`
      *,
      supplier:suppliers(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function saveSupplier(userId: string, supplierId: string) {
  const { data, error } = await supabase
    .from("saved_suppliers")
    .insert({ user_id: userId, supplier_id: supplierId })
    .select()
    .single();

  return { data, error };
}

export async function unsaveSupplier(userId: string, supplierId: string) {
  const { error } = await supabase
    .from("saved_suppliers")
    .delete()
    .eq("user_id", userId)
    .eq("supplier_id", supplierId);

  return { error };
}

// ============================================
// RFQ OPERATIONS
// ============================================

export async function createRFQ(rfqData: {
  userId: string;
  productName: string;
  quantity: number;
  unit: string;
  categoryId?: string;
  description?: string;
  qualityRequirements?: string;
  targetPrice?: number;
  deliveryLocation?: string;
  deliveryDeadline?: string;
}) {
  const { data, error } = await supabase
    .from("rfq_requests")
    .insert({
      user_id: rfqData.userId,
      rfq_number: "", // Auto-generated by trigger
      product_name: rfqData.productName,
      quantity: rfqData.quantity,
      unit: rfqData.unit,
      category_id: rfqData.categoryId,
      description: rfqData.description,
      quality_requirements: rfqData.qualityRequirements,
      target_price: rfqData.targetPrice,
      delivery_location: rfqData.deliveryLocation,
      delivery_deadline: rfqData.deliveryDeadline,
      status: "open"
    })
    .select()
    .single();

  return { data, error };
}

export async function fetchRFQs(userId: string) {
  const { data, error } = await supabase
    .from("rfq_requests")
    .select(`
      *,
      category:categories(*),
      quotes:rfq_quotes(
        *,
        supplier:suppliers(id, company_name, logo_url, rating)
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

// ============================================
// REVIEWS OPERATIONS
// ============================================

export async function fetchProductReviews(productId: string, options?: {
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  return { data, error };
}

export async function createReview(reviewData: {
  buyerId: string;
  productId: string;
  orderItemId?: string;
  rating: number;
  title?: string;
  comment?: string;
  pros?: string[];
  cons?: string[];
}) {
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      buyer_id: reviewData.buyerId,
      product_id: reviewData.productId,
      order_item_id: reviewData.orderItemId,
      rating: reviewData.rating,
      title: reviewData.title,
      comment: reviewData.comment,
      pros: reviewData.pros,
      cons: reviewData.cons,
    })
    .select()
    .single();

  return { data, error };
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function fetchBuyerDashboardStats(userId: string) {
  // Total orders
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Active orders (not delivered or cancelled)
  const { count: activeOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .not("status", "in", "(delivered,cancelled,refunded)");

  // Pending payments
  const { count: pendingPayments } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("payment_status", "pending");

  // Saved suppliers
  const { count: savedSuppliers } = await supabase
    .from("saved_suppliers")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  return {
    totalOrders: totalOrders || 0,
    activeOrders: activeOrders || 0,
    pendingPayments: pendingPayments || 0,
    savedSuppliers: savedSuppliers || 0,
  };
}

// ============================================
// LOGISTICS PARTNERS
// ============================================

export async function fetchLogisticsPartners(options?: {
  region?: string;
  city?: string;
}) {
  let query = supabase
    .from("logistics_partners")
    .select("*")
    .eq("is_active", true)
    .order("performance_score", { ascending: false });

  if (options?.region) {
    query = query.contains("coverage_regions", [options.region]);
  }
  if (options?.city) {
    query = query.contains("coverage_cities", [options.city]);
  }

  const { data, error } = await query;
  return { data, error };
}

// ============================================
// ACTIVITY LOGGING
// ============================================

export async function logActivity(activityData: {
  userId?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}) {
  const { error } = await supabase
    .from("user_activity_logs")
    .insert([{
      user_id: activityData.userId,
      action: activityData.action,
      resource_type: activityData.resourceType,
      resource_id: activityData.resourceId,
      metadata: activityData.metadata as any,
    }]);

  return { error };
}

// ============================================
// RECOMMENDATION EVENTS
// ============================================

export async function trackRecommendationEvent(eventData: {
  userId?: string;
  productId: string;
  interactionType: "view" | "click" | "cart" | "purchase" | "save";
  source?: string;
}) {
  const { error } = await supabase
    .from("recommendation_events")
    .insert({
      user_id: eventData.userId,
      product_id: eventData.productId,
      interaction_type: eventData.interactionType,
      source: eventData.source,
    });

  return { error };
}
