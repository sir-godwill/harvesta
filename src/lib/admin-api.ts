// Harvestá Admin API Layer - All functions return mock data
// This file serves as API placeholders ready for Supabase integration

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  permissions: { module: string; actions: string[] }[];
  region?: string;
}

export interface DashboardStats {
  revenue: { today: number; week: number; month: number; year: number; trend: number };
  orders: { total: number; pending: number; shipped: number; delayed: number; cancelled: number };
  users: { activeSellers: number; activeBuyers: number; newToday: number };
  logistics: { inTransit: number; delivered: number; exceptions: number };
  disputes: { open: number; escalated: number; resolved: number };
  platformHealth: { apiStatus: string; dbStatus: string; uptime: number };
}

export interface LiveFeedItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  severity?: string;
}

export interface Seller {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'pending' | 'suspended' | 'rejected';
  trustScore: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  commissionRate: number;
  region: string;
  verificationStatus: string;
  certifications: string[];
  createdAt: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  seller: string;
  status: 'draft' | 'pending' | 'live' | 'rejected';
  qualityGrade?: string;
  image?: string;
  createdAt: string;
}

// Alias for backward compatibility
export type Product = AdminProduct;

export interface AdminOrder {
  id: string;
  buyerName: string;
  sellerName: string;
  itemCount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'delayed';
  paymentStatus: string;
  deliveryType: string;
  region: string;
  createdAt: string;
}

// Alias for backward compatibility
export type Order = AdminOrder;

export interface Shipment {
  id: string;
  trackingNumber: string;
  orderId: string;
  origin: string;
  destination: string;
  carrier: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'delayed' | 'exception';
  eta: string;
  weight: number;
  items: number;
  createdAt: string;
}

export interface AnalyticsData {
  revenue: { total: number; change: number };
  orders: { total: number; change: number };
  sellers: { active: number; change: number };
  products: { sold: number; change: number };
  revenueChart: { date: string; revenue: number }[];
  categoryBreakdown: { name: string; value: number }[];
  regionalData: { region: string; revenue: number; orders: number; growth: number }[];
  topSellers: { name: string; revenue: number; percentage: number }[];
  aiInsights: { type: string; title: string; description: string }[];
}

export interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  type: 'individual' | 'business';
  status: 'active' | 'pending' | 'suspended';
  totalOrders: number;
  totalSpent: number;
  region: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  buyerName: string;
  sellerName: string;
  reason: string;
  status: 'open' | 'under_review' | 'escalated' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  amount: number;
  createdAt: string;
  resolvedAt?: string;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchCurrentAdmin(): Promise<AdminUser> {
  await delay(300);
  return {
    id: 'admin-001',
    name: 'Amadou Diallo',
    email: 'amadou@harvesta.com',
    role: 'super_admin',
    permissions: [{ module: '*', actions: ['read', 'write', 'approve', 'override'] }],
  };
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay(400);
  return {
    revenue: { today: 12500000, week: 85000000, month: 340000000, year: 4200000000, trend: 12.5 },
    orders: { total: 1247, pending: 89, shipped: 234, delayed: 12, cancelled: 23 },
    users: { activeSellers: 342, activeBuyers: 5678, newToday: 23 },
    logistics: { inTransit: 156, delivered: 892, exceptions: 8 },
    disputes: { open: 15, escalated: 3, resolved: 127 },
    platformHealth: { apiStatus: 'healthy', dbStatus: 'healthy', uptime: 99.97 },
  };
}

export async function fetchLiveFeed(): Promise<LiveFeedItem[]> {
  await delay(200);
  return [
    { id: '1', type: 'order', title: 'New order #ORD-4521', description: 'Organic coffee beans - 500kg', timestamp: new Date().toISOString(), severity: 'success' },
    { id: '2', type: 'seller', title: 'Seller verification pending', description: 'Kofi Farms awaiting review', timestamp: new Date(Date.now() - 300000).toISOString(), severity: 'warning' },
    { id: '3', type: 'logistics', title: 'Shipment delayed', description: 'SHP-7823 - Weather conditions', timestamp: new Date(Date.now() - 600000).toISOString(), severity: 'error' },
    { id: '4', type: 'alert', title: 'High demand detected', description: 'Cocoa beans - 300% increase', timestamp: new Date(Date.now() - 900000).toISOString(), severity: 'info' },
    { id: '5', type: 'buyer', title: 'New buyer registered', description: 'EuroFoods GmbH from Germany', timestamp: new Date(Date.now() - 1200000).toISOString(), severity: 'success' },
  ];
}

export async function fetchSellers(): Promise<Seller[]> {
  await delay(500);
  return [
    { id: 's1', businessName: 'Kofi Organic Farms', ownerName: 'Kofi Mensah', email: 'kofi@farms.com', phone: '+233555123456', status: 'active', trustScore: 94, totalProducts: 45, totalOrders: 234, totalRevenue: 45000000, commissionRate: 8, region: 'Africa', verificationStatus: 'verified', certifications: ['Organic'], createdAt: '2024-01-15' },
    { id: 's2', businessName: 'Lagos Agro Export', ownerName: 'Adaeze Okafor', email: 'adaeze@lagos.ng', phone: '+2348012345678', status: 'active', trustScore: 88, totalProducts: 32, totalOrders: 156, totalRevenue: 28000000, commissionRate: 10, region: 'Africa', verificationStatus: 'verified', certifications: [], createdAt: '2024-02-20' },
    { id: 's3', businessName: 'Cameroon Cocoa Co', ownerName: 'Jean Pierre', email: 'jp@cocoa.cm', phone: '+237699123456', status: 'pending', trustScore: 72, totalProducts: 12, totalOrders: 45, totalRevenue: 8500000, commissionRate: 12, region: 'Africa', verificationStatus: 'pending', certifications: [], createdAt: '2024-03-10' },
    { id: 's4', businessName: 'Ethiopian Coffee', ownerName: 'Abebe Bekele', email: 'abebe@coffee.et', phone: '+251911234567', status: 'active', trustScore: 96, totalProducts: 28, totalOrders: 312, totalRevenue: 67000000, commissionRate: 7, region: 'Africa', verificationStatus: 'verified', certifications: ['Organic', 'Fair Trade'], createdAt: '2024-01-05' },
    { id: 's5', businessName: 'Senegal Groundnuts', ownerName: 'Fatou Diop', email: 'fatou@nuts.sn', phone: '+221771234567', status: 'suspended', trustScore: 45, totalProducts: 8, totalOrders: 67, totalRevenue: 5200000, commissionRate: 10, region: 'Africa', verificationStatus: 'verified', certifications: [], createdAt: '2024-02-01' },
    { id: 's6', businessName: 'Kenya Tea Estates', ownerName: 'Wanjiru Kamau', email: 'wanjiru@tea.ke', phone: '+254721234567', status: 'active', trustScore: 91, totalProducts: 18, totalOrders: 189, totalRevenue: 38000000, commissionRate: 9, region: 'Africa', verificationStatus: 'verified', certifications: ['Rainforest Alliance'], createdAt: '2024-01-25' },
  ];
}

export async function fetchAdminProducts(): Promise<AdminProduct[]> {
  await delay(450);
  const names = ['Organic Arabica Coffee', 'Raw Cocoa Beans', 'Cassava Flour', 'Dried Hibiscus', 'Cashew Nuts', 'Dried Mango', 'Shea Butter', 'Palm Oil', 'Moringa Powder', 'Baobab Fruit'];
  const categories = ['Coffee', 'Cocoa', 'Grains', 'Spices', 'Nuts', 'Fruits'];
  const grades = ['Grade A', 'Grade B', 'Grade C'];
  const statuses: AdminProduct['status'][] = ['live', 'pending', 'draft', 'live', 'live', 'pending', 'live', 'draft', 'live', 'pending'];
  return Array.from({ length: 20 }, (_, i) => ({
    id: `p${i + 1}`,
    name: names[i % 10],
    description: 'Premium quality product sourced from certified farms',
    category: categories[i % 6],
    price: 15000 + Math.floor(Math.random() * 50000),
    stock: Math.floor(Math.random() * 1000) + 50,
    seller: ['Kofi Organic Farms', 'Lagos Agro Export', 'Ethiopian Coffee'][i % 3],
    status: statuses[i % 10],
    qualityGrade: grades[i % 3],
    image: '',
    createdAt: new Date(Date.now() - Math.random() * 90 * 86400000).toISOString(),
  }));
}

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  await delay(400);
  const statuses: AdminOrder['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'delayed', 'cancelled'];
  return Array.from({ length: 15 }, (_, i) => ({
    id: `ORD-${4500 + i}`,
    buyerName: ['EuroFoods GmbH', 'AsiaSpice Ltd', 'African Delights', 'Global Organics'][i % 4],
    sellerName: ['Kofi Organic Farms', 'Ethiopian Coffee', 'Lagos Agro'][i % 3],
    itemCount: 1 + (i % 3),
    total: 2500000 + Math.floor(Math.random() * 5000000),
    status: statuses[i % 6],
    paymentStatus: 'paid',
    deliveryType: i % 2 === 0 ? 'Harvestá Logistics' : 'Third-party',
    region: ['Africa', 'Europe', 'Asia', 'Americas'][i % 4],
    createdAt: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
  }));
}

export async function fetchBuyers(): Promise<Buyer[]> {
  await delay(400);
  return [
    { id: 'b1', name: 'EuroFoods GmbH', email: 'contact@eurofoods.de', phone: '+49301234567', type: 'business', status: 'active', totalOrders: 45, totalSpent: 125000000, region: 'Europe', createdAt: '2024-01-10' },
    { id: 'b2', name: 'AsiaSpice Ltd', email: 'info@asiaspice.sg', phone: '+6565551234', type: 'business', status: 'active', totalOrders: 32, totalSpent: 89000000, region: 'Asia', createdAt: '2024-02-15' },
    { id: 'b3', name: 'Jean-Paul Martin', email: 'jp.martin@email.fr', phone: '+33612345678', type: 'individual', status: 'active', totalOrders: 8, totalSpent: 4500000, region: 'Europe', createdAt: '2024-03-01' },
    { id: 'b4', name: 'African Delights Inc', email: 'orders@africandelights.com', phone: '+17185551234', type: 'business', status: 'pending', totalOrders: 12, totalSpent: 35000000, region: 'Americas', createdAt: '2024-02-28' },
    { id: 'b5', name: 'Global Organics Co', email: 'procurement@globalorganics.uk', phone: '+442071234567', type: 'business', status: 'active', totalOrders: 67, totalSpent: 198000000, region: 'Europe', createdAt: '2024-01-05' },
  ];
}

export async function fetchDisputes(): Promise<Dispute[]> {
  await delay(350);
  return [
    { id: 'd1', orderId: 'ORD-4501', buyerName: 'EuroFoods GmbH', sellerName: 'Kofi Organic Farms', reason: 'Quality issue', status: 'open', priority: 'high', amount: 2500000, createdAt: '2024-03-10' },
    { id: 'd2', orderId: 'ORD-4489', buyerName: 'AsiaSpice Ltd', sellerName: 'Ethiopian Coffee', reason: 'Delayed delivery', status: 'escalated', priority: 'critical', amount: 4800000, createdAt: '2024-03-08' },
    { id: 'd3', orderId: 'ORD-4478', buyerName: 'Global Organics Co', sellerName: 'Lagos Agro Export', reason: 'Wrong quantity', status: 'under_review', priority: 'medium', amount: 1200000, createdAt: '2024-03-05' },
    { id: 'd4', orderId: 'ORD-4456', buyerName: 'African Delights Inc', sellerName: 'Cameroon Cocoa Co', reason: 'Product damaged', status: 'resolved', priority: 'low', amount: 800000, createdAt: '2024-02-28', resolvedAt: '2024-03-02' },
  ];
}

export async function fetchShipments(): Promise<Shipment[]> {
  await delay(350);
  const statuses: Shipment['status'][] = ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'delayed', 'in_transit'];
  const carriers = ['Harvestá Express', 'DHL Africa', 'Bolloré Logistics', 'Maersk'];
  return Array.from({ length: 12 }, (_, i) => ({
    id: `shp${i + 1}`,
    trackingNumber: `TRK${7800 + i}${String.fromCharCode(65 + i)}`,
    orderId: `ORD-${4500 + i}`,
    origin: ['Accra, Ghana', 'Lagos, Nigeria', 'Addis Ababa'][i % 3],
    destination: ['Hamburg, Germany', 'Rotterdam', 'Shanghai', 'New York'][i % 4],
    carrier: carriers[i % 4],
    status: statuses[i % 7],
    eta: new Date(Date.now() + (3 + i) * 86400000).toISOString(),
    weight: 500 + Math.floor(Math.random() * 2000),
    items: 1 + (i % 4),
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  await delay(600);
  const revenueChart = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    revenue: 8000000 + Math.floor(Math.random() * 6000000),
  }));
  return {
    revenue: { total: 340000000, change: 12.5 },
    orders: { total: 1247, change: 8.3 },
    sellers: { active: 342, change: 15.2 },
    products: { sold: 8934, change: -2.1 },
    revenueChart,
    categoryBreakdown: [
      { name: 'Coffee', value: 35 },
      { name: 'Cocoa', value: 28 },
      { name: 'Grains', value: 20 },
      { name: 'Others', value: 17 },
    ],
    regionalData: [
      { region: 'Europe', revenue: 145000000, orders: 523, growth: 18 },
      { region: 'Asia', revenue: 98000000, orders: 412, growth: 24 },
      { region: 'Americas', revenue: 67000000, orders: 234, growth: 12 },
      { region: 'Africa', revenue: 30000000, orders: 78, growth: 45 },
    ],
    topSellers: [
      { name: 'Ethiopian Coffee', revenue: 67000000, percentage: 100 },
      { name: 'Morocco Argan', revenue: 52000000, percentage: 78 },
      { name: 'Kofi Organic', revenue: 45000000, percentage: 67 },
    ],
    aiInsights: [
      { type: 'opportunity', title: 'Cocoa demand surge', description: 'European buyers showing 40% increased interest. Promote certified sellers.' },
      { type: 'warning', title: 'Shipping delays expected', description: 'Port congestion in Rotterdam may cause delays next week.' },
      { type: 'prediction', title: 'Coffee price forecast', description: 'AI predicts 15% price increase for Arabica in Q2.' },
    ],
  };
}
