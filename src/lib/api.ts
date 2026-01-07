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
  // Placeholder: Fetch from Supabase
  return {
    totalOrders: 24,
    activeOrders: 3,
    pendingPayments: 2,
    savedSuppliers: 12,
  };
}

export async function fetchRecentOrders(): Promise<RecentOrder[]> {
  // Placeholder: Fetch from Supabase
  return [
    {
      id: "1",
      orderNumber: "HRV-2026-001234",
      vendorName: "Green Valley Farms",
      status: "shipped",
      totalAmount: 125000,
      currency: "XAF",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      items: 5,
    },
    {
      id: "2",
      orderNumber: "HRV-2026-001189",
      vendorName: "AgriPro Supplies",
      status: "processing",
      totalAmount: 450000,
      currency: "XAF",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      items: 12,
    },
    {
      id: "3",
      orderNumber: "HRV-2026-001156",
      vendorName: "Farm Fresh Exports",
      status: "delivered",
      totalAmount: 89000,
      currency: "XAF",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      items: 3,
    },
  ];
}

export async function fetchNotifications(): Promise<Notification[]> {
  // Placeholder: Fetch from Supabase
  return [
    {
      id: "1",
      type: "delivery",
      title: "Order Out for Delivery",
      message: "Your order HRV-2026-001234 is out for delivery and will arrive today.",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isRead: false,
    },
    {
      id: "2",
      type: "order",
      title: "Order Confirmed",
      message: "Your order HRV-2026-001189 has been confirmed by the supplier.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: false,
    },
    {
      id: "3",
      type: "message",
      title: "New Message from Supplier",
      message: "Green Valley Farms sent you a message about your recent inquiry.",
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
      isRead: true,
    },
  ];
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
  // Placeholder: Fetch from Supabase
  return {
    id: "user-123",
    email: "buyer@example.com",
    fullName: "Jean-Pierre Kamga",
    phone: "+237 670 123 456",
    buyerType: "business",
    companyName: "Kamga Agro Imports",
    businessRegistrationNumber: "RC/YAO/2024/B/1234",
    isVerified: true,
    language: "en",
    currency: "XAF",
    notificationPreferences: {
      email: true,
      sms: true,
      push: false,
    },
    addresses: [
      {
        id: "addr-1",
        label: "Main Warehouse",
        fullName: "Jean-Pierre Kamga",
        phone: "+237 670 123 456",
        street: "123 Rue du Commerce",
        city: "Douala",
        region: "Littoral",
        country: "Cameroon",
        isDefault: true,
      },
    ],
    createdAt: new Date("2024-06-15"),
  };
}

export async function updateBuyerProfile(data: Partial<BuyerProfile>) {
  // Placeholder: Update in Supabase
  console.log("Update profile:", data);
  return { success: true };
}

export async function manageAddresses(action: "add" | "update" | "delete", address: Partial<Address>) {
  // Placeholder: Manage addresses in Supabase
  console.log("Manage address:", action, address);
  return { success: true };
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
  // Placeholder: Fetch from Supabase with filters
  console.log("Fetch orders with filters:", filters);
  return fetchRecentOrders();
}

export async function fetchOrderDetails(orderId: string): Promise<OrderDetail> {
  // Placeholder: Fetch from Supabase
  console.log("Fetch order details:", orderId);
  return {
    id: orderId,
    orderNumber: "HRV-2026-001234",
    status: "shipped",
    paymentStatus: "paid",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    vendors: [
      {
        vendorId: "v1",
        vendorName: "Green Valley Farms",
        items: [
          {
            id: "item-1",
            productId: "p1",
            productName: "Organic Tomatoes",
            quantity: 50,
            unitPrice: 1500,
            totalPrice: 75000,
            unit: "kg",
          },
          {
            id: "item-2",
            productId: "p2",
            productName: "Fresh Onions",
            quantity: 100,
            unitPrice: 500,
            totalPrice: 50000,
            unit: "kg",
          },
        ],
        subtotal: 125000,
      },
    ],
    subtotal: 125000,
    shippingCost: 5000,
    tax: 0,
    discount: 5000,
    total: 125000,
    currency: "XAF",
    shippingAddress: {
      id: "addr-1",
      label: "Main Warehouse",
      fullName: "Jean-Pierre Kamga",
      phone: "+237 670 123 456",
      street: "123 Rue du Commerce",
      city: "Douala",
      region: "Littoral",
      country: "Cameroon",
      isDefault: true,
    },
    paymentMethod: "Mobile Money",
  };
}

export async function trackOrder(orderId: string) {
  // Placeholder: Get tracking info
  console.log("Track order:", orderId);
  return {
    currentStatus: "shipped",
    timeline: [
      { status: "Order Placed", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), completed: true },
      { status: "Confirmed", date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), completed: true },
      { status: "Processing", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), completed: true },
      { status: "Shipped", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), completed: true },
      { status: "Delivered", date: null, completed: false },
    ],
  };
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
  // Placeholder: Fetch from Supabase
  return [
    {
      id: "sp-1",
      productId: "p1",
      name: "Premium Organic Tomatoes",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
      price: 1500,
      originalPrice: 2000,
      currency: "XAF",
      moq: 50,
      unit: "kg",
      vendorName: "Green Valley Farms",
      inStock: true,
      savedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: "sp-2",
      productId: "p2",
      name: "Fresh Red Onions",
      image: "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400",
      price: 800,
      currency: "XAF",
      moq: 100,
      unit: "kg",
      vendorName: "AgriPro Supplies",
      inStock: true,
      savedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  ];
}

export async function fetchSavedSuppliers(): Promise<SavedSupplier[]> {
  // Placeholder: Fetch from Supabase
  return [
    {
      id: "ss-1",
      supplierId: "s1",
      name: "Green Valley Farms",
      logo: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=100",
      rating: 4.8,
      responseRate: 95,
      yearsInBusiness: 8,
      isVerified: true,
      trustLevel: "gold",
      mainProducts: ["Tomatoes", "Peppers", "Onions", "Vegetables"],
      savedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: "ss-2",
      supplierId: "s2",
      name: "AgriPro Supplies",
      rating: 4.5,
      responseRate: 88,
      yearsInBusiness: 5,
      isVerified: true,
      trustLevel: "verified",
      mainProducts: ["Seeds", "Fertilizers", "Farm Equipment"],
      savedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    },
  ];
}
