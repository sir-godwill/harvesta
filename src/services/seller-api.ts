// Seller Dashboard API Service
// This module provides API endpoints for the seller dashboard

export interface SellerMetrics {
  todaySales: number;
  monthlyRevenue: number;
  pendingOrders: number;
  fulfilledOrders: number;
  stockAlerts: number;
  buyerInquiries: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerName: string;
  productName: string;
  quantity: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  price: number;
  category: string;
  status: 'active' | 'draft' | 'out_of_stock';
}

export interface SalesChartData {
  name: string;
  sales: number;
  orders: number;
}

export interface CategoryData {
  category: string;
  value: number;
  fill: string;
}

// Mock data with realistic values
const mockMetrics: SellerMetrics = {
  todaySales: 1250000,
  monthlyRevenue: 28500000,
  pendingOrders: 12,
  fulfilledOrders: 156,
  stockAlerts: 5,
  buyerInquiries: 8,
};

const mockOrders: Order[] = [
  {
    id: 'ord_a1b2c3d4',
    orderNumber: 'ORD-2026-001234',
    buyerName: 'Cameroon Fresh Foods Ltd',
    productName: 'Premium Cocoa Beans',
    quantity: 500,
    total: 2500000,
    status: 'pending',
    createdAt: new Date('2026-01-12T10:30:00'),
  },
  {
    id: 'ord_e5f6g7h8',
    orderNumber: 'ORD-2026-001233',
    buyerName: 'West Africa Imports',
    productName: 'Organic Coffee Arabica',
    quantity: 200,
    total: 1800000,
    status: 'processing',
    createdAt: new Date('2026-01-12T09:15:00'),
  },
  {
    id: 'ord_i9j0k1l2',
    orderNumber: 'ORD-2026-001232',
    buyerName: 'Lagos Spice Traders',
    productName: 'Dried Ginger Root',
    quantity: 300,
    total: 750000,
    status: 'shipped',
    createdAt: new Date('2026-01-11T16:45:00'),
  },
  {
    id: 'ord_m3n4o5p6',
    orderNumber: 'ORD-2026-001231',
    buyerName: 'Abuja Organic Market',
    productName: 'Fresh Plantains',
    quantity: 1000,
    total: 500000,
    status: 'delivered',
    createdAt: new Date('2026-01-11T08:20:00'),
  },
];

const mockProducts: Product[] = [
  {
    id: 'prod_x1y2z3',
    name: 'Premium Cocoa Beans',
    sku: 'COC-PRM-001',
    stock: 150,
    lowStockThreshold: 200,
    price: 5000,
    category: 'Cocoa',
    status: 'active',
  },
  {
    id: 'prod_a4b5c6',
    name: 'Organic Coffee Arabica',
    sku: 'COF-ORG-001',
    stock: 80,
    lowStockThreshold: 100,
    price: 9000,
    category: 'Coffee',
    status: 'active',
  },
  {
    id: 'prod_d7e8f9',
    name: 'Dried Ginger Root',
    sku: 'GNG-DRY-001',
    stock: 45,
    lowStockThreshold: 50,
    price: 2500,
    category: 'Spices',
    status: 'active',
  },
  {
    id: 'prod_g0h1i2',
    name: 'Palm Oil (25L)',
    sku: 'PLM-OIL-025',
    stock: 30,
    lowStockThreshold: 40,
    price: 15000,
    category: 'Oils',
    status: 'out_of_stock',
  },
  {
    id: 'prod_j3k4l5',
    name: 'Shea Butter Raw',
    sku: 'SHE-RAW-001',
    stock: 25,
    lowStockThreshold: 30,
    price: 8000,
    category: 'Beauty',
    status: 'active',
  },
];

const mockSalesData: SalesChartData[] = [
  { name: 'Mon', sales: 4200000, orders: 12 },
  { name: 'Tue', sales: 3800000, orders: 10 },
  { name: 'Wed', sales: 5100000, orders: 15 },
  { name: 'Thu', sales: 4600000, orders: 13 },
  { name: 'Fri', sales: 6200000, orders: 18 },
  { name: 'Sat', sales: 5800000, orders: 16 },
  { name: 'Sun', sales: 3200000, orders: 9 },
];

const mockCategoryData: CategoryData[] = [
  { category: 'Cocoa', value: 35, fill: 'hsl(var(--primary))' },
  { category: 'Coffee', value: 25, fill: 'hsl(var(--secondary))' },
  { category: 'Spices', value: 20, fill: 'hsl(var(--accent))' },
  { category: 'Oils', value: 12, fill: 'hsl(var(--muted))' },
  { category: 'Others', value: 8, fill: 'hsl(var(--border))' },
];

// API Functions
export async function fetchSellerMetrics(): Promise<SellerMetrics> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockMetrics;
}

export async function fetchRecentOrders(): Promise<Order[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockOrders;
}

export async function fetchStockAlerts(): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockProducts.filter(p => p.stock <= p.lowStockThreshold);
}

export async function fetchSalesChartData(): Promise<SalesChartData[]> {
  await new Promise(resolve => setTimeout(resolve, 350));
  return mockSalesData;
}

export async function fetchCategoryDistribution(): Promise<CategoryData[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCategoryData;
}

export async function fetchAllProducts(): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockProducts;
}

export async function fetchAllOrders(): Promise<Order[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockOrders;
}

export function formatXAF(amount: number): string {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatXAFCompact(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M XAF`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K XAF`;
  }
  return formatXAF(amount);
}
