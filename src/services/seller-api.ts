// Seller Dashboard API Types and Services

export interface SellerProfile {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  rating: number;
  totalOrders: number;
  totalProducts: number;
  responseRate: number;
  joinedAt: string;
  logoUrl?: string;
  bannerUrl?: string;
}

export interface SellerProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  status: 'active' | 'draft' | 'inactive' | 'out_of_stock';
  domesticPrice: number;
  internationalPrice?: number;
  currency: string;
  stock: number;
  minOrderQuantity: number;
  unit: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
  orders: number;
}

export interface SellerOrder {
  id: string;
  orderNumber: string;
  buyerName: string;
  buyerCountry: string;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  totalAmount: number;
  currency: string;
  createdAt: string;
  deliveryAddress: string;
  notes?: string;
}

export interface SellerMessage {
  id: string;
  conversationId: string;
  buyerName: string;
  buyerAvatar?: string;
  lastMessage: string;
  unreadCount: number;
  createdAt: string;
  productId?: string;
  productName?: string;
}

export interface SellerAnalytics {
  revenue: {
    total: number;
    change: number;
    byMonth: { month: string; revenue: number }[];
  };
  orders: {
    total: number;
    change: number;
    byStatus: { status: string; count: number }[];
  };
  products: {
    total: number;
    active: number;
    outOfStock: number;
  };
  views: {
    total: number;
    change: number;
    byDay: { day: string; views: number }[];
  };
  topProducts: {
    id: string;
    name: string;
    revenue: number;
    orders: number;
  }[];
  topBuyers: {
    id: string;
    name: string;
    country: string;
    totalSpent: number;
    orders: number;
  }[];
}

export interface SellerDelivery {
  id: string;
  orderId: string;
  orderNumber: string;
  carrier: string;
  trackingNumber: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';
  estimatedDelivery: string;
  actualDelivery?: string;
  buyerName: string;
  destination: string;
  weight: number;
  dimensions: string;
}

export interface SellerRFQ {
  id: string;
  rfqNumber: string;
  productName: string;
  quantity: number;
  unit: string;
  buyerName: string;
  buyerCountry: string;
  targetPrice?: number;
  status: 'open' | 'quoted' | 'negotiating' | 'accepted' | 'rejected' | 'expired';
  deadline: string;
  createdAt: string;
  myQuote?: {
    price: number;
    validUntil: string;
    notes: string;
  };
}

export interface SellerCarrier {
  id: string;
  name: string;
  code: string;
  serviceTypes: string[];
  coverageRegions: string[];
  baseRate: number;
  perKgRate: number;
  isActive: boolean;
  rating: number;
  onTimeRate: number;
}

// Mock data for development
export const mockSellerProfile: SellerProfile = {
  id: 'seller-001',
  companyName: 'Kofi Organic Farms',
  email: 'kofi@organicfarms.com',
  phone: '+237 6XX XXX XXX',
  country: 'Cameroon',
  region: 'West Region',
  verificationStatus: 'verified',
  rating: 4.8,
  totalOrders: 256,
  totalProducts: 45,
  responseRate: 98,
  joinedAt: '2023-01-15',
  logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop',
};

export const mockSellerProducts: SellerProduct[] = [
  {
    id: 'prod-001',
    name: 'Organic Arabica Coffee Beans',
    sku: 'KOF-ARB-001',
    category: 'Coffee & Beverages',
    status: 'active',
    domesticPrice: 25000,
    internationalPrice: 35,
    currency: 'XAF',
    stock: 5000,
    minOrderQuantity: 50,
    unit: 'kg',
    images: ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-15',
    views: 1250,
    orders: 89,
  },
  {
    id: 'prod-002',
    name: 'Raw Cocoa Beans - Grade A',
    sku: 'KOF-COC-001',
    category: 'Cocoa',
    status: 'active',
    domesticPrice: 18000,
    internationalPrice: 28,
    currency: 'XAF',
    stock: 3500,
    minOrderQuantity: 100,
    unit: 'kg',
    images: ['https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400'],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-14',
    views: 980,
    orders: 67,
  },
  {
    id: 'prod-003',
    name: 'Organic Cassava Flour',
    sku: 'KOF-CAS-001',
    category: 'Grains & Flour',
    status: 'out_of_stock',
    domesticPrice: 8000,
    internationalPrice: 12,
    currency: 'XAF',
    stock: 0,
    minOrderQuantity: 25,
    unit: 'kg',
    images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12',
    views: 450,
    orders: 34,
  },
  {
    id: 'prod-004',
    name: 'Palm Oil - Unrefined',
    sku: 'KOF-PLM-001',
    category: 'Oils',
    status: 'active',
    domesticPrice: 12000,
    internationalPrice: 18,
    currency: 'XAF',
    stock: 2000,
    minOrderQuantity: 20,
    unit: 'L',
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'],
    createdAt: '2024-01-03',
    updatedAt: '2024-01-11',
    views: 780,
    orders: 52,
  },
];

export const mockSellerOrders: SellerOrder[] = [
  {
    id: 'ord-001',
    orderNumber: 'HRV-20240115-78234',
    buyerName: 'EuroFoods GmbH',
    buyerCountry: 'Germany',
    items: [
      { productName: 'Organic Arabica Coffee Beans', quantity: 500, unitPrice: 35, total: 17500 },
    ],
    status: 'processing',
    paymentStatus: 'paid',
    totalAmount: 17500,
    currency: 'USD',
    createdAt: '2024-01-15T10:30:00Z',
    deliveryAddress: 'Hamburg, Germany',
  },
  {
    id: 'ord-002',
    orderNumber: 'HRV-20240114-65421',
    buyerName: 'Café Parisien',
    buyerCountry: 'France',
    items: [
      { productName: 'Organic Arabica Coffee Beans', quantity: 200, unitPrice: 35, total: 7000 },
      { productName: 'Raw Cocoa Beans - Grade A', quantity: 100, unitPrice: 28, total: 2800 },
    ],
    status: 'confirmed',
    paymentStatus: 'paid',
    totalAmount: 9800,
    currency: 'USD',
    createdAt: '2024-01-14T14:20:00Z',
    deliveryAddress: 'Paris, France',
  },
  {
    id: 'ord-003',
    orderNumber: 'HRV-20240113-43219',
    buyerName: 'Local Market Douala',
    buyerCountry: 'Cameroon',
    items: [
      { productName: 'Palm Oil - Unrefined', quantity: 50, unitPrice: 12000, total: 600000 },
    ],
    status: 'delivered',
    paymentStatus: 'paid',
    totalAmount: 600000,
    currency: 'XAF',
    createdAt: '2024-01-13T08:00:00Z',
    deliveryAddress: 'Douala, Cameroon',
  },
  {
    id: 'ord-004',
    orderNumber: 'HRV-20240112-87654',
    buyerName: 'Asian Imports Ltd',
    buyerCountry: 'Singapore',
    items: [
      { productName: 'Raw Cocoa Beans - Grade A', quantity: 1000, unitPrice: 28, total: 28000 },
    ],
    status: 'shipped',
    paymentStatus: 'paid',
    totalAmount: 28000,
    currency: 'USD',
    createdAt: '2024-01-12T16:45:00Z',
    deliveryAddress: 'Singapore',
  },
];

export const mockSellerAnalytics: SellerAnalytics = {
  revenue: {
    total: 45680000,
    change: 12.5,
    byMonth: [
      { month: 'Aug', revenue: 3200000 },
      { month: 'Sep', revenue: 3800000 },
      { month: 'Oct', revenue: 4100000 },
      { month: 'Nov', revenue: 3900000 },
      { month: 'Dec', revenue: 4500000 },
      { month: 'Jan', revenue: 5200000 },
    ],
  },
  orders: {
    total: 256,
    change: 8.3,
    byStatus: [
      { status: 'Delivered', count: 189 },
      { status: 'Processing', count: 34 },
      { status: 'Shipped', count: 21 },
      { status: 'Pending', count: 8 },
      { status: 'Cancelled', count: 4 },
    ],
  },
  products: {
    total: 45,
    active: 38,
    outOfStock: 3,
  },
  views: {
    total: 15680,
    change: 18.2,
    byDay: [
      { day: 'Mon', views: 2100 },
      { day: 'Tue', views: 2450 },
      { day: 'Wed', views: 2200 },
      { day: 'Thu', views: 2680 },
      { day: 'Fri', views: 2890 },
      { day: 'Sat', views: 1800 },
      { day: 'Sun', views: 1560 },
    ],
  },
  topProducts: [
    { id: 'prod-001', name: 'Organic Arabica Coffee Beans', revenue: 12500000, orders: 89 },
    { id: 'prod-002', name: 'Raw Cocoa Beans - Grade A', revenue: 8900000, orders: 67 },
    { id: 'prod-004', name: 'Palm Oil - Unrefined', revenue: 6200000, orders: 52 },
  ],
  topBuyers: [
    { id: 'buyer-001', name: 'EuroFoods GmbH', country: 'Germany', totalSpent: 125000, orders: 12 },
    { id: 'buyer-002', name: 'Asian Imports Ltd', country: 'Singapore', totalSpent: 98000, orders: 8 },
    { id: 'buyer-003', name: 'Café Parisien', country: 'France', totalSpent: 76000, orders: 15 },
  ],
};

export const mockSellerDeliveries: SellerDelivery[] = [
  {
    id: 'del-001',
    orderId: 'ord-001',
    orderNumber: 'HRV-20240115-78234',
    carrier: 'DHL Express',
    trackingNumber: 'DHL-1234567890',
    status: 'in_transit',
    estimatedDelivery: '2024-01-22',
    buyerName: 'EuroFoods GmbH',
    destination: 'Hamburg, Germany',
    weight: 500,
    dimensions: '120x80x100 cm',
  },
  {
    id: 'del-002',
    orderId: 'ord-004',
    orderNumber: 'HRV-20240112-87654',
    carrier: 'Maersk Shipping',
    trackingNumber: 'MAEU-9876543210',
    status: 'in_transit',
    estimatedDelivery: '2024-02-05',
    buyerName: 'Asian Imports Ltd',
    destination: 'Singapore',
    weight: 1000,
    dimensions: '200x120x120 cm',
  },
];

export const mockSellerRFQs: SellerRFQ[] = [
  {
    id: 'rfq-001',
    rfqNumber: 'RFQ-20240115-001',
    productName: 'Organic Coffee Beans',
    quantity: 2000,
    unit: 'kg',
    buyerName: 'Nordic Coffee Roasters',
    buyerCountry: 'Sweden',
    targetPrice: 32,
    status: 'open',
    deadline: '2024-01-25',
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'rfq-002',
    rfqNumber: 'RFQ-20240114-003',
    productName: 'Raw Cocoa Beans',
    quantity: 5000,
    unit: 'kg',
    buyerName: 'Belgian Chocolate Co',
    buyerCountry: 'Belgium',
    targetPrice: 25,
    status: 'quoted',
    deadline: '2024-01-28',
    createdAt: '2024-01-14T11:30:00Z',
    myQuote: {
      price: 27,
      validUntil: '2024-02-15',
      notes: 'Grade A quality, certified organic',
    },
  },
];

export const mockSellerCarriers: SellerCarrier[] = [
  {
    id: 'carrier-001',
    name: 'DHL Express',
    code: 'DHL',
    serviceTypes: ['Air Freight', 'Express', 'Door-to-Door'],
    coverageRegions: ['Europe', 'Asia', 'Americas'],
    baseRate: 50000,
    perKgRate: 5000,
    isActive: true,
    rating: 4.7,
    onTimeRate: 94,
  },
  {
    id: 'carrier-002',
    name: 'Maersk Shipping',
    code: 'MAERSK',
    serviceTypes: ['Sea Freight', 'Container'],
    coverageRegions: ['Global'],
    baseRate: 150000,
    perKgRate: 500,
    isActive: true,
    rating: 4.5,
    onTimeRate: 89,
  },
  {
    id: 'carrier-003',
    name: 'Cameroon Express',
    code: 'CAMEX',
    serviceTypes: ['Domestic', 'Regional'],
    coverageRegions: ['Cameroon', 'Central Africa'],
    baseRate: 15000,
    perKgRate: 1500,
    isActive: true,
    rating: 4.2,
    onTimeRate: 85,
  },
];
