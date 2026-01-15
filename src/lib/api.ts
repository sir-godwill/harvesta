// ============================================
// API Placeholder Functions
// ============================================
// These are placeholder functions that will be replaced 
// with actual API calls when the backend is integrated.
// All functions return promises to simulate async behavior.

import { supabase } from "@/integrations/supabase/client";

// ============================================
// Authentication API
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  buyerType: "individual" | "business";
  companyName?: string;
  businessRegistrationNumber?: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface NewPasswordData {
  token: string;
  password: string;
}

export async function loginUser(credentials: LoginCredentials) {
  // Placeholder: Replace with actual Supabase auth
  console.log("Login attempt:", credentials.email);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });
  return { data, error };
}

export async function registerUser(data: RegisterData) {
  // Placeholder: Replace with actual Supabase auth + profile creation
  console.log("Register attempt:", data.email);
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
      data: {
        full_name: data.fullName,
        buyer_type: data.buyerType,
        phone: data.phone,
        company_name: data.companyName,
        business_registration_number: data.businessRegistrationNumber,
      },
    },
  });
  return { data: authData, error };
}

export async function verifyAccount(code: string) {
  // Placeholder: OTP verification
  console.log("Verify account with code:", code);
  return { success: true };
}

export async function resetPassword(data: ResetPasswordData) {
  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { error };
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password });
  return { error };
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// ============================================
// Buyer Dashboard API
// ============================================

export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  pendingPayments: number;
  savedSuppliers: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  vendorName: string;
  vendorLogo?: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  totalAmount: number;
  currency: string;
  createdAt: Date;
  items: number;
}

export interface Notification {
  id: string;
  type: "order" | "delivery" | "message" | "alert" | "success";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export async function fetchBuyerDashboard(): Promise<DashboardStats> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { totalOrders: 0, activeOrders: 0, pendingPayments: 0, savedSuppliers: 0 };

  try {
    const [ordersRes, savedSuppliersRes] = await Promise.all([
      supabase.from('orders').select('status, payment_status').eq('user_id', user.id),
      supabase.from('saved_suppliers').select('id', { count: 'exact' }).eq('user_id', user.id)
    ]);

    const orders = ordersRes.data || [];
    return {
      totalOrders: orders.length,
      activeOrders: orders.filter(o => !['delivered', 'cancelled', 'refunded'].includes(o.status)).length,
      pendingPayments: orders.filter(o => o.payment_status === 'pending').length,
      savedSuppliers: savedSuppliersRes.count || 0,
    };
  } catch (error) {
    console.error("Error fetching buyer dashboard stats:", error);
    return { totalOrders: 0, activeOrders: 0, pendingPayments: 0, savedSuppliers: 0 };
  }
}

export async function fetchRecentOrders(): Promise<RecentOrder[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        total_amount,
        currency,
        created_at,
        order_items (
          quantity,
          suppliers (
            company_name
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error || !data) return [];

    return data.map(order => {
      const items = (order.order_items as any[]) || [];
      const firstSupplier = items[0]?.suppliers?.company_name;
      const vendorName = items.length > 1 ? `${firstSupplier} + ${items.length - 1} more` : firstSupplier || 'Internal Supplier';
      const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

      return {
        id: order.id,
        orderNumber: order.order_number,
        vendorName,
        status: order.status as any,
        totalAmount: order.total_amount,
        currency: order.currency,
        createdAt: new Date(order.created_at),
        items: totalItems
      };
    });
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return [];
  }
}

export async function fetchNotifications(): Promise<Notification[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    return (data || []).map(n => ({
      id: n.id,
      type: n.type as any,
      title: n.title,
      message: n.message,
      timestamp: new Date(n.created_at),
      isRead: n.is_read
    }));
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

// ============================================
// Buyer Profile API
// ============================================

export interface BuyerProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  buyerType: "individual" | "business";
  companyName?: string;
  businessRegistrationNumber?: string;
  isVerified: boolean;
  language: string;
  currency: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  addresses: Address[];
  createdAt: Date;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  region: string;
  country: string;
  postalCode?: string;
  isDefault: boolean;
}

export async function fetchBuyerProfile(): Promise<BuyerProfile> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not found");

  try {
    const [profileRes, buyerRes, addressesRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('buyer_profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('addresses').select('*').eq('user_id', user.id)
    ]);

    if (profileRes.error) throw profileRes.error;

    const profile = profileRes.data;
    const buyer = buyerRes.data || {} as any;
    const addresses = (addressesRes.data || []).map(addr => ({
      id: addr.id,
      label: addr.label || 'Home',
      fullName: addr.recipient_name || profile.full_name || '',
      phone: addr.recipient_phone || profile.phone || '',
      street: addr.address_line_1,
      city: addr.city,
      region: addr.region || '',
      country: addr.country,
      postalCode: addr.postal_code || undefined,
      isDefault: addr.is_default || false
    }));

    return {
      id: user.id,
      email: user.email || '',
      fullName: profile.full_name || '',
      phone: profile.phone || '',
      avatarUrl: profile.avatar_url || undefined,
      buyerType: buyer.buyer_type || 'individual',
      companyName: buyer.business_name || undefined,
      businessRegistrationNumber: buyer.business_registration_number || undefined,
      isVerified: buyer.verification_status === 'verified',
      language: profile.preferred_language || 'en',
      currency: profile.preferred_currency || 'XAF',
      notificationPreferences: {
        email: true,
        sms: true,
        push: false,
      },
      addresses,
      createdAt: new Date(profile.created_at),
    };
  } catch (error) {
    console.error("Error fetching buyer profile:", error);
    throw error;
  }
}

export async function updateBuyerProfile(data: Partial<BuyerProfile>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not found");

  try {
    const profileUpdates: any = {};
    if (data.fullName) profileUpdates.full_name = data.fullName;
    if (data.phone) profileUpdates.phone = data.phone;
    if (data.avatarUrl) profileUpdates.avatar_url = data.avatarUrl;
    if (data.language) profileUpdates.preferred_language = data.language;
    if (data.currency) profileUpdates.preferred_currency = data.currency;

    const buyerUpdates: any = {};
    if (data.buyerType) buyerUpdates.buyer_type = data.buyerType;
    if (data.companyName) buyerUpdates.business_name = data.companyName;
    if (data.businessRegistrationNumber) buyerUpdates.business_registration_number = data.businessRegistrationNumber;

    const promises: Promise<any>[] = [];

    if (Object.keys(profileUpdates).length > 0) {
      promises.push(supabase.from('profiles').update(profileUpdates).eq('id', user.id));
    }

    if (Object.keys(buyerUpdates).length > 0) {
      promises.push(supabase.from('buyer_profiles').update(buyerUpdates).eq('user_id', user.id));
    }

    await Promise.all(promises);
    return { success: true };
  } catch (error) {
    console.error("Error updating buyer profile:", error);
    return { success: false, error };
  }
}

export async function manageAddresses(action: "add" | "update" | "delete", address: Partial<Address>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not found");

  try {
    if (action === "delete") {
      if (!address.id) throw new Error("ID required for deletion");
      await supabase.from('addresses').delete().eq('id', address.id);
      return { success: true };
    }

    const addrData: any = {
      user_id: user.id,
      label: address.label,
      recipient_name: address.fullName,
      recipient_phone: address.phone,
      address_line_1: address.street,
      city: address.city,
      region: address.region,
      country: address.country || 'Cameroon',
      postal_code: address.postalCode,
      is_default: address.isDefault,
    };

    if (action === "add") {
      await supabase.from('addresses').insert(addrData);
    } else if (action === "update") {
      if (!address.id) throw new Error("ID required for update");
      await supabase.from('addresses').update(addrData).eq('id', address.id);
    }

    return { success: true };
  } catch (error) {
    console.error(`Error ${action}ing address:`, error);
    return { success: false, error };
  }
}

// ============================================
// Orders API
// ============================================

export interface OrderDetail {
  id: string;
  orderNumber: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  createdAt: Date;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  vendors: VendorOrder[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress: Address;
  paymentMethod: string;
}

export interface VendorOrder {
  vendorId: string;
  vendorName: string;
  vendorLogo?: string;
  items: OrderItem[];
  subtotal: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string;
}

export async function fetchOrders(filters?: {
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  vendorId?: string;
  search?: string;
}): Promise<RecentOrder[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  try {
    let query = supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        total_amount,
        currency,
        created_at,
        order_items (
          quantity,
          suppliers (
            id,
            company_name
          )
        )
      `)
      .eq('user_id', user.id);

    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.vendorId) query = query.eq('order_items.supplier_id', filters.vendorId);
    if (filters?.dateFrom) query = query.gte('created_at', filters.dateFrom.toISOString());
    if (filters?.dateTo) query = query.lte('created_at', filters.dateTo.toISOString());

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map(order => {
      const items = (order.order_items as any[]) || [];
      const firstSupplier = items[0]?.suppliers?.company_name;
      const vendorName = items.length > 1 ? `${firstSupplier} + ${items.length - 1} more` : firstSupplier || 'Internal Supplier';
      const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

      return {
        id: order.id,
        orderNumber: order.order_number,
        vendorName,
        status: order.status as any,
        totalAmount: order.total_amount,
        currency: order.currency,
        createdAt: new Date(order.created_at),
        items: totalItems
      };
    });
  } catch (error) {
    console.error("Error fetching filtered orders:", error);
    return [];
  }
}

export async function fetchOrderDetails(orderId: string): Promise<OrderDetail> {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        addresses!orders_shipping_address_id_fkey (
          *
        ),
        order_items (
          *,
          suppliers (
            id,
            company_name,
            logo_url
          ),
          product_variants (
            name,
            product_id,
            products (
              name,
              unit_of_measure,
              product_images (
                image_url
              )
            )
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (error || !order) throw error || new Error("Order not found");

    const items = (order.order_items as any[]) || [];

    // Group by supplier
    const vendorsMap = new Map<string, VendorOrder>();
    items.forEach(item => {
      const supplier = item.suppliers;
      const product = item.product_variants?.products;
      const variant = item.product_variants;

      if (!vendorsMap.has(supplier.id)) {
        vendorsMap.set(supplier.id, {
          vendorId: supplier.id,
          vendorName: supplier.company_name,
          vendorLogo: supplier.logo_url,
          items: [],
          subtotal: 0
        });
      }

      const vendorOrder = vendorsMap.get(supplier.id)!;
      vendorOrder.items.push({
        id: item.id,
        productId: variant.product_id,
        productName: product?.name || item.product_name,
        productImage: product?.product_images?.[0]?.image_url,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        totalPrice: item.total,
        unit: product?.unit_of_measure || 'units'
      });
      vendorOrder.subtotal += item.total;
    });

    const shippingAddr = order.addresses;

    return {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status as any,
      paymentStatus: order.payment_status as any,
      createdAt: new Date(order.created_at),
      estimatedDelivery: order.estimated_delivery_date ? new Date(order.estimated_delivery_date) : undefined,
      deliveredAt: order.delivered_at ? new Date(order.delivered_at) : undefined,
      vendors: Array.from(vendorsMap.values()),
      subtotal: order.subtotal,
      shippingCost: order.delivery_fee || 0,
      tax: order.tax_amount || 0,
      discount: order.discount_amount || 0,
      total: order.total_amount,
      currency: order.currency,
      shippingAddress: {
        id: shippingAddr?.id || '',
        label: shippingAddr?.label || 'Default',
        fullName: shippingAddr?.recipient_name || '',
        phone: shippingAddr?.recipient_phone || '',
        street: shippingAddr?.address_line_1 || '',
        city: shippingAddr?.city || '',
        region: shippingAddr?.region || '',
        country: shippingAddr?.country || '',
        isDefault: shippingAddr?.is_default || false
      },
      paymentMethod: "Secured Payment", // Should fetch from payments table if detailed
    };
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
}

export async function trackOrder(orderId: string) {
  try {
    const { data: delivery, error: deliveryError } = await supabase
      .from('deliveries')
      .select(`
        *,
        delivery_tracking(*)
      `)
      .eq('order_id', orderId)
      .maybeSingle();

    if (deliveryError) throw deliveryError;

    if (!delivery) {
      return {
        currentStatus: "pending",
        timeline: [
          { status: "Order Placed", date: new Date(), completed: true },
          { status: "Processing", date: null, completed: false },
        ],
      };
    }

    const trackingEvents = (delivery.delivery_tracking as any[]) || [];
    const timeline = [
      { status: "Order Placed", date: new Date(delivery.created_at), completed: true },
      ...trackingEvents.map(event => ({
        status: event.status,
        date: new Date(event.created_at),
        completed: true
      }))
    ];

    return {
      currentStatus: delivery.status,
      timeline,
      trackingNumber: delivery.tracking_number,
      estimatedDelivery: delivery.estimated_delivery ? new Date(delivery.estimated_delivery) : null
    };
  } catch (error) {
    console.error("Error tracking order:", error);
    return { currentStatus: "unknown", timeline: [] };
  }
}

// ============================================
// Saved Items API
// ============================================

export interface SavedProduct {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  currency: string;
  moq: number;
  unit: string;
  vendorName: string;
  inStock: boolean;
  savedAt: Date;
}

export interface SavedSupplier {
  id: string;
  supplierId: string;
  name: string;
  logo?: string;
  rating: number;
  responseRate: number;
  yearsInBusiness: number;
  isVerified: boolean;
  trustLevel: "verified" | "gold" | "platinum";
  mainProducts: string[];
  savedAt: Date;
}

export async function fetchSavedProducts(): Promise<SavedProduct[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  try {
    const { data, error } = await supabase
      .from('saved_products')
      .select(`
        id,
        created_at,
        products (
          id,
          name,
          unit_of_measure,
          min_order_quantity,
          supplier_id,
          suppliers (
            company_name
          ),
          product_images (
            image_url
          ),
          product_variants (
            id,
            stock_quantity,
            pricing_tiers (
              price_per_unit,
              currency
            )
          )
        )
      `)
      .eq('user_id', user.id);

    if (error || !data) return [];

    return data.map(item => {
      const product = item.products as any;
      if (!product) return null;

      const variant = product.product_variants?.[0];
      const pricing = variant?.pricing_tiers?.[0];

      return {
        id: item.id,
        productId: product.id,
        name: product.name,
        image: product.product_images?.[0]?.image_url || '/placeholder-product.png',
        price: pricing?.price_per_unit || 0,
        currency: pricing?.currency || 'XAF',
        moq: product.min_order_quantity || 1,
        unit: product.unit_of_measure || 'units',
        vendorName: product.suppliers?.company_name || 'Generic Seller',
        inStock: (variant?.stock_quantity || 0) > 0,
        savedAt: new Date(item.created_at)
      };
    }).filter(Boolean) as SavedProduct[];
  } catch (error) {
    console.error("Error fetching saved products:", error);
    return [];
  }
}

export async function fetchSavedSuppliers(): Promise<SavedSupplier[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  try {
    const { data, error } = await supabase
      .from('saved_suppliers')
      .select(`
        id,
        created_at,
        suppliers (
          id,
          company_name,
          logo_url,
          rating,
          response_rate,
          verification_status,
          total_products,
          products (
            name
          )
        )
      `)
      .eq('user_id', user.id);

    if (error || !data) return [];

    return data.map(item => {
      const supplier = item.suppliers as any;
      if (!supplier) return null;

      return {
        id: item.id,
        supplierId: supplier.id,
        name: supplier.company_name,
        logo: supplier.logo_url || undefined,
        rating: supplier.rating || 0,
        responseRate: supplier.response_rate || 0,
        yearsInBusiness: 1, // Placeholder as not in schema
        isVerified: supplier.verification_status === 'verified',
        trustLevel: supplier.verification_status === 'verified' ? "gold" : "verified",
        mainProducts: supplier.products?.slice(0, 3).map((p: any) => p.name) || [],
        savedAt: new Date(item.created_at)
      };
    }).filter(Boolean) as SavedSupplier[];
  } catch (error) {
    console.error("Error fetching saved suppliers:", error);
    return [];
  }
}
