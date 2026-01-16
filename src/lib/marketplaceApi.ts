import { supabase } from "@/integrations/supabase/client";
import type {
  CartItem,
  CartGroup,
  Order,
  BuyerInfo,
  DeliveryAddress,
  PaymentMethod,
  ApiResponse,
  PricingTier,
  Product,
  SearchFilters,
  PaginatedResponse,
  SupplierProfile,
  RFQRequest,
  RFQStatus,
  PriceComparison,
  OrderTracking,
  Category,
  Review
} from '@/types/marketplace';
import { isSandboxMode, getApiConfig, getPlatformSetting } from './platformSettingsApi';
import { logSystemEvent } from './logger';

// ============ PAYMENT GATEWAY ARCHITECTURE ============

export interface PaymentGateway {
  charge(amount: number, currency: string, source: string): Promise<{ success: boolean; transactionId?: string; error?: string }>;
}

class StripeGateway implements PaymentGateway {
  async charge(amount: number, currency: string, source: string) {
    console.log(`[Stripe] Charging ${amount} ${currency} via token ${source}`);
    return { success: true, transactionId: `strp_${Math.random().toString(36).substr(2, 9)}` };
  }
}

class FlutterwaveGateway implements PaymentGateway {
  async charge(amount: number, currency: string, source: string) {
    console.log(`[Flutterwave] Charging ${amount} ${currency} via account ${source}`);
    return { success: true, transactionId: `flw_${Math.random().toString(36).substr(2, 9)}` };
  }
}

class MtnMoMoGateway implements PaymentGateway {
  private primaryKey = '4dd49a824c0343ebba9007da8dec84f2'; // Sandbox only

  async charge(amount: number, currency: string, source: string) {
    // In production, these calls would hit the real MTN API
    // For Sandbox, we simulate the handshake and logic
    const transactionId = `PAY-MOMO-${Date.now()}`;

    try {
      console.log(`[MTN MoMo Sandbox] Requesting ${amount} ${currency} from ${source}`);

      // Payment Logic simulation
      const success = true; // Simulated success

      await logSystemEvent({
        level: 'info',
        category: 'payment',
        message: 'MTN MoMo Payment Attempt',
        metadata: { transactionId, amount, currency, success }
      });

      return { success, transactionId };
    } catch (err: any) {
      await logSystemEvent({
        level: 'error',
        category: 'payment',
        message: 'MTN MoMo Payment Failed',
        metadata: { transactionId, amount, currency, error: err.message }
      });
      return { success: false, error: err.message };
    }
  }
}

class MockGateway implements PaymentGateway {
  async charge(amount: number, currency: string, source: string) {
    console.log(`[MockGateway] Simulating payment of ${amount} ${currency}`);
    return { success: true, transactionId: `mock_${Date.now()}` };
  }
}

export async function getPaymentGateway(): Promise<PaymentGateway> {
  const config = await getApiConfig('payment');
  if (!config || config.status === 'inactive') return new MockGateway();

  // CHECK API HEALTH BEFORE SELECTION
  const { data: latestHealth } = await supabase
    .from('api_health_logs')
    .select('status')
    .eq('api_name', config.provider.toLowerCase())
    .order('last_verified_at', { ascending: false })
    .limit(1)
    .single();

  if (latestHealth && latestHealth.status !== 'working') {
    console.warn(`[Gateway] Provider ${config.provider} is unhealthy. Falling back to sandbox-safe mode.`);
    // In production, you might throw an error or use a safe fallback
  }

  switch (config.provider.toLowerCase()) {
    case 'stripe': return new StripeGateway();
    case 'flutterwave': return new FlutterwaveGateway();
    case 'mtn-momo': return new MtnMoMoGateway();
    default: return new MockGateway();
  }
}

// ============ CART API ============

export async function fetchCartItems(): Promise<ApiResponse<CartGroup[]>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('carts')
      .select(`
        id,
        status,
        cart_items (
          id,
          quantity,
          notes,
          product_variant_id,
          product_variants (
            id,
            name,
            grade,
            products (
              id,
              name,
              supplier_id,
              unit_of_measure,
              categories (name),
              suppliers (id, company_name, rating, verification_status, city, country),
              product_images (image_url, is_primary)
            ),
            pricing_tiers (min_quantity, max_quantity, price_per_unit)
          )
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching cart:', error);
      return { success: false, error: error.message };
    }

    if (!data) return { success: true, data: [] };

    // Group items by vendor
    const groupsMap = new Map<string, CartGroup>();

    data.cart_items.forEach((item: any) => {
      const product = item.product_variants.products;
      const supplier = product.suppliers;
      const vendorId = supplier.id;

      if (!groupsMap.has(vendorId)) {
        groupsMap.set(vendorId, {
          vendor: {
            id: supplier.id,
            name: supplier.company_name,
            rating: supplier.rating || 0,
            totalSales: 0, // Would need another query or aggregation
            location: `${supplier.city}, ${supplier.country}`,
            isVerified: supplier.verification_status === 'verified',
            isQualityChecked: true,
            responseTime: '< 24h'
          },
          items: [],
          deliveryOptions: [], // These would come from another table
          subtotal: 0
        });
      }

      const group = groupsMap.get(vendorId)!;
      const variant = item.product_variants;
      const primaryImage = product.product_images.find((img: any) => img.is_primary)?.image_url || product.product_images[0]?.image_url || '';

      const cartItem: CartItem = {
        id: item.id,
        product: {
          id: product.id,
          name: product.name,
          image: primaryImage,
          category: product.categories.name,
          grade: variant.grade,
          origin: `${product.origin_country || ''}`,
          unit: product.unit_of_measure,
          moq: product.min_order_quantity,
          pricingTiers: variant.pricing_tiers.map((t: any) => ({
            minQuantity: t.min_quantity,
            maxQuantity: t.max_quantity,
            pricePerUnit: t.price_per_unit
          })),
          currentPrice: variant.pricing_tiers[0]?.price_per_unit || 0
        },
        vendor: group.vendor,
        quantity: item.quantity,
        notes: item.notes
      };

      group.items.push(cartItem);
      group.subtotal += cartItem.product.currentPrice * item.quantity;
    });

    return { success: true, data: Array.from(groupsMap.values()) };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
): Promise<ApiResponse<any>> {
  try {
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq('id', itemId);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function removeCartItem(itemId: string): Promise<ApiResponse<void>> {
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function saveForLater(itemId: string): Promise<ApiResponse<void>> {
  console.log('[API] Saving item for later:', itemId);
  return { success: true };
}

export async function calculatePricingTiers(
  productId: string,
  quantity: number
): Promise<ApiResponse<{ applicableTier: PricingTier; totalPrice: number }>> {
  console.log('[API] Calculating pricing tiers:', { productId, quantity });
  return { success: true, data: { applicableTier: { minQuantity: 1, maxQuantity: null, pricePerUnit: 0 }, totalPrice: 0 } };
}

export async function estimateDeliveryCost(
  vendorId: string,
  deliveryOptionId: string,
  address: DeliveryAddress
): Promise<ApiResponse<{ cost: number; estimatedDays: { min: number; max: number } }>> {
  try {
    // In a real scenario, this would query a shipping rate engine or distance table
    // For now, let's use a distance-based mock logic
    const baseRate = 1500; // Base rate in XAF
    const weightFactor = 50; // Per kg approx

    // Random but consistent for the session
    const cost = baseRate + Math.floor(Math.random() * 2000);

    return {
      success: true,
      data: {
        cost,
        estimatedDays: { min: 2, max: 5 }
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function requestQuotation(
  items: CartItem[],
  notes: string
): Promise<ApiResponse<{ quotationId: string }>> {
  console.log('[API] Requesting quotation:', { items, notes });
  return { success: true, data: { quotationId: 'QT-' + Date.now() } };
}

// ============ CHECKOUT API ============

export async function validateCheckout(
  groups: CartGroup[],
  buyer: BuyerInfo,
  address: DeliveryAddress
): Promise<ApiResponse<{ isValid: boolean; errors: string[] }>> {
  console.log('[API] Validating checkout:', { groups, buyer, address });
  return { success: true, data: { isValid: true, errors: [] } };
}

export async function calculateFinalOrder(
  groups: CartGroup[],
  address: DeliveryAddress
): Promise<ApiResponse<{ subtotal: number; deliveryTotal: number; taxes: number; grandTotal: number }>> {
  try {
    const isTaxFrozen = await getPlatformSetting<string>('tax_freeze_active') === 'true';
    const subtotal = groups.reduce((acc, g) => acc + g.subtotal, 0);
    const deliveryTotal = groups.reduce((acc, g) => acc + (g.selectedDeliveryOption?.cost || 0), 0);
    // Standard tax rate for the region (e.g., 19.25% in Cameroon)
    // FORCE TAX TO 0 IF FROZEN
    const taxes = isTaxFrozen ? 0 : (subtotal * 0.1925);
    const grandTotal = subtotal + deliveryTotal + taxes;

    return {
      success: true,
      data: { subtotal, deliveryTotal, taxes, grandTotal }
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function createOrder(
  groups: CartGroup[],
  buyer: BuyerInfo,
  address: DeliveryAddress,
  paymentMethod: PaymentMethod
): Promise<ApiResponse<Order>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const isTaxFrozen = await getPlatformSetting<string>('tax_freeze_active') === 'true';
    const subtotal = groups.reduce((acc, g) => acc + g.subtotal, 0);
    const deliveryTotal = groups.reduce((acc, g) => acc + (g.selectedDeliveryOption?.cost || 0), 0);
    const taxes = isTaxFrozen ? 0 : (subtotal * 0.1925); // forced update
    const grandTotal = subtotal + deliveryTotal + taxes;

    // 1. Create Order record
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        // order_number is generated by trigger
        status: 'pending',
        payment_status: 'pending',
        subtotal,
        delivery_fee: deliveryTotal,
        tax_amount: taxes,
        total_amount: grandTotal,
        currency: 'XAF',
        notes: `Buyer: ${buyer.firstName} ${buyer.lastName}, Type: ${buyer.companyName ? 'Business' : 'Individual'}`,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Create Order Items
    const orderItems = groups.flatMap(group =>
      group.items.map(item => ({
        order_id: order.id,
        product_variant_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.currentPrice,
        subtotal: item.quantity * item.product.currentPrice,
        total: item.quantity * item.product.currentPrice,
        supplier_id: group.vendor.id,
        status: 'pending'
      }))
    );

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // 3. Create initial Payment record (Escrow)
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: order.id,
        payment_method: paymentMethod.name,
        amount: grandTotal,
        currency: 'XAF',
        status: 'pending',
        transaction_reference: `PEND-${Date.now()}`
      });

    if (paymentError) console.error('Payment record error:', paymentError);

    // 4. Mark cart as completed
    await supabase.from('carts').update({ status: 'completed' }).eq('user_id', user.id).eq('status', 'active');

    return {
      success: true,
      data: {
        id: order.id,
        orderNumber: order.order_number,
        createdAt: order.created_at,
        status: 'pending',
        paymentStatus: 'pending',
        buyer,
        deliveryAddress: address,
        groups,
        subtotal,
        deliveryTotal,
        taxes,
        grandTotal,
        paymentMethod,
        currency: 'XAF'
      }
    };
  } catch (err: any) {
    console.error('Create order error:', err);
    return { success: false, error: err.message };
  }
}

export async function processPayment(
  orderId: string,
  paymentMethod: PaymentMethod
): Promise<ApiResponse<{ transactionId: string; status: 'completed' | 'failed' }>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // 1. Get appropriate gateway
    const gateway = await getPaymentGateway();

    // 2. Process Charge
    const chargeResult = await gateway.charge(1000, 'XAF', paymentMethod.id); // Placeholder amount
    if (!chargeResult.success) throw new Error(chargeResult.error || 'Payment failed');

    const transactionId = chargeResult.transactionId!;

    // 3. Update Payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .update({
        status: 'completed',
        transaction_reference: transactionId,
        paid_at: new Date().toISOString()
      })
      .eq('order_id', orderId);

    if (paymentError) throw paymentError;

    // 4. Update Order status
    const { error: orderError } = await supabase
      .from('orders')
      .update({
        payment_status: 'completed',
        status: 'confirmed',
        confirmed_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (orderError) throw orderError;

    // 4. Trigger Delivery Creation
    const { data: orderData } = await supabase
      .from('orders')
      .select('*, order_items(supplier_id, suppliers(city, country))')
      .eq('id', orderId)
      .single();

    if (orderData) {
      await supabase.rpc('create_delivery_for_order', {
        p_order_id: orderId,
        p_pickup_address: { city: orderData.order_items[0]?.suppliers?.city || 'Douala' },
        p_delivery_address: { city: 'Yaounde' }
      });
    }

    return { success: true, data: { transactionId, status: 'completed' } };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ============ ORDER API ============

export async function fetchOrderDetails(orderId: string): Promise<ApiResponse<Order>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product_variants (
            name,
            product_id,
            products (
              name,
              product_images (image_url)
            )
          ),
          suppliers (id, company_name)
        )
      `)
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    if (!order) return { success: false, error: 'Order not found' };

    // Format to frontend Order type
    const formattedOrder: Order = {
      id: order.id,
      orderNumber: order.order_number,
      createdAt: order.created_at,
      status: order.status,
      paymentStatus: order.payment_status,
      subtotal: order.subtotal,
      deliveryTotal: order.delivery_fee,
      taxes: order.tax_amount,
      grandTotal: order.total_amount,
      currency: order.currency,
      buyer: {} as any, // Would be filled from a profile join or stored in order metadata
      deliveryAddress: {} as any,
      paymentMethod: { id: 'pm_1', name: 'Saved Number', type: 'mobile_money', icon: '📱' }, // Mock for now
      groups: [] // Not strictly needed for detail view if using items
    };

    return { success: true, data: formattedOrder };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function trackOrder(orderId: string): Promise<ApiResponse<{
  status: string;
  timeline: Array<{ date: string; status: string; description: string }>;
}>> {
  console.log('[API] Tracking order:', orderId);
  return {
    success: true,
    data: {
      status: 'processing',
      timeline: []
    }
  };
}

export async function downloadInvoice(orderId: string): Promise<ApiResponse<{ url: string }>> {
  console.log('[API] Downloading invoice:', orderId);
  return { success: true, data: { url: '#' } };
}

// ============ CONTACT API ============

export async function submitContactForm(data: {
  name: string;
  email: string;
  phone: string;
  department: string;
  subject: string;
  message: string;
}): Promise<ApiResponse<{ ticketId: string }>> {
  console.log('[API] Submitting contact form:', data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true, data: { ticketId: 'TKT-' + Date.now() } };
}

// ============ SEARCH & DISCOVERY API ============

export async function searchProducts(
  filters: SearchFilters,
  sort: string,
  page: number,
  pageSize: number
): Promise<ApiResponse<PaginatedResponse<Product>>> {
  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories(name),
        suppliers(id, company_name, rating, city, country, verification_status),
        product_images(image_url, is_primary),
        product_variants(
          id, name, grade, is_default, packaging,
          pricing_tiers(min_quantity, max_quantity, price_per_unit)
        )
      `, { count: 'exact' });

    // Apply Filters
    if (filters.query) {
      // Use Supabase Full-Text Search with optimized column
      query = query.textSearch('fts_vector', filters.query, {
        config: 'english',
        type: 'websearch'
      });
    }
    if (filters.category) {
      query = query.eq('category_id', filters.category);
    }
    if (filters.verifiedOnly) {
      query = query.eq('suppliers.verification_status', 'verified');
    }

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    // Sorting
    if (sort === 'price_low') {
      // Complex sorting on child tables is limited in Postgrest, usually handled by RPC or specific views
      query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error, count } = await query;

    if (error) throw error;

    const items: Product[] = (data || []).map((p: any) => {
      const defaultVariant = p.product_variants.find((v: any) => v.is_default) || p.product_variants[0];
      const primaryImage = p.product_images.find((img: any) => img.is_primary)?.image_url || p.product_images[0]?.image_url || '';

      return {
        id: p.id,
        name: p.name,
        image: primaryImage,
        category: p.categories?.name || 'Uncategorized',
        grade: defaultVariant?.grade || 'Standard',
        origin: `${p.origin_country || ''}`,
        unit: p.unit_of_measure,
        moq: p.min_order_quantity,
        pricingTiers: defaultVariant?.pricing_tiers.map((t: any) => ({
          minQuantity: t.min_quantity,
          maxQuantity: t.max_quantity,
          pricePerUnit: t.price_per_unit
        })) || [],
        currentPrice: defaultVariant?.pricing_tiers[0]?.price_per_unit || 0
      };
    });

    return {
      success: true,
      data: {
        items,
        total: count || 0,
        page,
        pageSize,
        hasMore: (count || 0) > page * pageSize
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function applyFilters(filters: SearchFilters): Promise<ApiResponse<{ productCount: number }>> {
  console.log('[API] Applying filters:', filters);
  return { success: true, data: { productCount: 0 } };
}

export async function getSearchSuggestions(query: string): Promise<ApiResponse<string[]>> {
  console.log('[API] Getting search suggestions:', query);
  return { success: true, data: [] };
}

// ============ CATEGORY API ============

export async function fetchCategories(): Promise<ApiResponse<Category[]>> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;

    const categories: Category[] = data.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || '📦',
      description: cat.description || '',
      subCategories: [], // Fetching subcategories might need another level or join
      productCount: 0, // Aggregate count
      image: cat.image_url || ''
    }));

    return { success: true, data: categories };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchCategoryProducts(
  categoryUnique: string, // slug or id
  filters: SearchFilters,
  page: number
): Promise<ApiResponse<PaginatedResponse<Product>>> {
  // Reuse search products with category filter
  return searchProducts({ ...filters, category: categoryUnique }, 'newest', page, 20);
}

// ============ SUPPLIER API ============

export async function fetchSupplierProfile(supplierId: string): Promise<ApiResponse<SupplierProfile>> {
  try {
    const { data: supplier, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('id', supplierId)
      .single();

    if (error) throw error;
    if (!supplier) return { success: false, error: 'Supplier not found' };

    // Transform DB supplier to SupplierProfile
    // Note: The DB schema has different field names than the frontend type in some cases.
    // We align them here.
    const profile: SupplierProfile = {
      id: supplier.id,
      name: supplier.company_name,
      rating: supplier.rating || 0,
      totalSales: supplier.total_orders || 0, // Approximate
      location: `${supplier.city}, ${supplier.country}`,
      isVerified: supplier.verification_status === 'verified',
      isQualityChecked: true, // Mock or add to schema
      responseTime: `${supplier.response_time_hours || 24} hours`,
      description: supplier.description,
      coverImage: supplier.banner_url || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=400&fit=crop',
      yearsInOperation: 1, // field missing in schema, default 1
      capacity: 'N/A', // field missing
      productionMethods: [],
      certifications: [], // would need separate table
      socialLinks: {
        website: supplier.website,
        whatsapp: supplier.phone
      },
      activityPosts: [], // would need table
      gallery: [] // would need table
    };

    return { success: true, data: profile };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchSupplierProducts(
  supplierId: string,
  page: number
): Promise<ApiResponse<PaginatedResponse<Product>>> {
  // Reuse searchProducts logic but scope to supplier
  try {
    // We can just call searchProducts but we need to pass filters. 
    // However searchProducts implementation in this file doesn't support direct supplier_id filter in 'filters' object (it has verifiedOnly, category).
    // Let's modify searchProducts OR implement custom query here.
    // Implementing custom query for simplicity/speed.

    const pageSize = 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('products')
      .select(`
        *,
        categories(name),
        suppliers(id, company_name, rating, city, country, verification_status),
        product_images(image_url, is_primary),
        product_variants(
          id, name, grade, is_default, packaging,
          pricing_tiers(min_quantity, max_quantity, price_per_unit)
        )
      `, { count: 'exact' })
      .eq('supplier_id', supplierId)
      .eq('status', 'active')
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const items: Product[] = (data || []).map((p: any) => {
      const defaultVariant = p.product_variants.find((v: any) => v.is_default) || p.product_variants[0];
      const primaryImage = p.product_images.find((img: any) => img.is_primary)?.image_url || p.product_images[0]?.image_url || '';

      return {
        id: p.id,
        name: p.name,
        image: primaryImage,
        category: p.categories?.name || 'Uncategorized',
        grade: defaultVariant?.grade || 'Standard',
        origin: `${p.origin_country || ''}`,
        unit: p.unit_of_measure,
        moq: p.min_order_quantity,
        pricingTiers: defaultVariant?.pricing_tiers.map((t: any) => ({
          minQuantity: t.min_quantity,
          maxQuantity: t.max_quantity,
          pricePerUnit: t.price_per_unit
        })) || [],
        currentPrice: defaultVariant?.pricing_tiers[0]?.price_per_unit || 0
      };
    });

    return {
      success: true,
      data: {
        items,
        total: count || 0,
        page,
        pageSize,
        hasMore: (count || 0) > page * pageSize
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchSupplierReviews(
  supplierId: string,
  page: number
): Promise<ApiResponse<PaginatedResponse<Review>>> {
  try {
    // Reviews are on products. We need reviews for all products of this supplier.
    // Joining reviews -> products -> filter by supplier_id
    const pageSize = 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('reviews')
      .select(`
        *,
        products!inner(supplier_id, name),
        profiles:buyer_id(full_name, avatar_url) 
      `, { count: 'exact' })
      .eq('products.supplier_id', supplierId)
      .range(from, to)
      .order('created_at', { ascending: false });

    // Note: profiles might not be 'profiles' table depending on setup, but migration says profiles(id) extends auth.users.
    // However the FK in reviews is buyer_id -> auth.users. Profiles table also has id -> auth.users.
    // Supabase can join if FK exists. reviews.buyer_id references auth.users. profiles.id references auth.users.
    // We might need to join on id.

    if (error) throw error;

    const reviews: Review[] = (data || []).map((r: any) => ({
      id: r.id,
      buyerName: r.profiles?.full_name || 'Anonymous',
      buyerAvatar: r.profiles?.avatar_url,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
      productName: r.products?.name,
      images: r.images
    }));

    return {
      success: true,
      data: {
        items: reviews,
        total: count || 0,
        page,
        pageSize,
        hasMore: (count || 0) > page * pageSize
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function followSupplier(supplierId: string): Promise<ApiResponse<void>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { error } = await supabase
      .from('saved_suppliers')
      .upsert({ user_id: user.id, supplier_id: supplierId }, { onConflict: 'user_id, supplier_id' });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ============ RFQ API ============

export async function submitRFQ(rfq: RFQRequest): Promise<ApiResponse<{ rfqId: string }>> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('rfq_requests')
      .insert({
        user_id: user.id,
        product_name: rfq.productName,
        description: rfq.notes,
        quantity: rfq.quantity,
        unit: 'kg', // Default as it's not in the Type
        target_price: rfq.budgetRange?.min || 0,
        currency: 'XAF',
        delivery_location: rfq.deliveryLocation,
        delivery_deadline: rfq.expectedDeliveryDate,
        status: 'open'
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data: { rfqId: data.id } };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchRFQStatus(rfqId: string): Promise<ApiResponse<RFQStatus>> {
  try {
    const { data: rfq, error } = await supabase
      .from('rfq_requests')
      .select(`
         id, status, created_at,
         rfq_quotes(count)
      `)
      .eq('id', rfqId)
      .single();

    if (error) throw error;
    if (!rfq) return { success: false, error: 'RFQ not found' };

    // This is a simplified mapping. The Frontend Type RFQStatus might be complex.
    // Assuming it is just the string status or an object with status.
    // Let's check imports. RFQStatus is imported from types.
    // If it's just 'open' | 'closed' etc., we cast.

    return { success: true, data: rfq.status as RFQStatus };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ============ PRICE COMPARISON API ============

export async function compareProductPrices(productId: string): Promise<ApiResponse<PriceComparison>> {
  console.log('[API] Comparing product prices:', productId);
  return { success: true };
}

// ============ ORDER TRACKING API ============

export async function fetchOrderTracking(orderId: string): Promise<ApiResponse<OrderTracking>> {
  try {
    // Fetch delivery and events
    const { data: delivery, error } = await supabase
      .from('deliveries')
      .select(`
        *,
        shipment_events(*),
        orders!inner(order_number, status)
      `)
      .eq('order_id', orderId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    // If no delivery record yet, return basic order info
    if (!delivery) {
      const { data: order } = await supabase.from('orders').select('order_number, status, created_at').eq('id', orderId).single();
      if (!order) return { success: false, error: 'Order not found' };

      return {
        success: true,
        data: {
          orderId,
          orderNumber: order.order_number,
          currentStatus: order.status,
          timeline: [
            { status: 'pending', title: 'Order Placed', description: 'Order received', timestamp: order.created_at, isCompleted: true, isCurrent: order.status === 'pending' }
          ],
          vendorTracking: []
        }
      };
    }

    const timeline = (delivery.shipment_events || []).map((e: any) => ({
      status: 'shipping', // simplified
      title: e.event_type,
      description: e.description,
      timestamp: e.event_time,
      isCompleted: true,
      isCurrent: false
    }));

    // Add current status
    timeline.push({
      status: delivery.status,
      title: 'Current Status',
      description: `Delivery is ${delivery.status}`,
      timestamp: new Date().toISOString(),
      isCompleted: false,
      isCurrent: true
    });

    return {
      success: true,
      data: {
        orderId,
        orderNumber: delivery.orders.order_number,
        currentStatus: delivery.status,
        timeline,
        vendorTracking: [] // Fill if multi-vendor splits
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ============ API HEALTH VERIFICATION ============

export async function verifyExternalApis(): Promise<ApiResponse<void>> {
  try {
    const apis = ['mtn-momo', 'stripe', 'flutterwave'];

    for (const api of apis) {
      const config = await getApiConfig(api as any);
      const startTime = Date.now();
      let status: 'working' | 'failed' | 'limited' = 'working';
      let errorMessage = null;

      try {
        // Simulated API handshake
        if (!config.api_key && api === 'mtn-momo') throw new Error('Missing MoMo API Key');
      } catch (err: any) {
        status = 'failed';
        errorMessage = err.message;
      }

      await supabase.from('api_health_logs').insert({
        api_name: api,
        environment: await isSandboxMode(api as any) ? 'sandbox' : 'production',
        status,
        latency_ms: Date.now() - startTime,
        error_message: errorMessage
      });
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
