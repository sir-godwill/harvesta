// Complete API Service for Seller Dashboard
// This module provides all API types and functions for the seller dashboard

// ===== TYPES =====

export interface Order {
  id: string;
  buyerName: string;
  total: number;
  status: 'new' | 'confirmed' | 'preparing' | 'ready' | 'in_transit' | 'delivered' | 'completed' | 'cancelled';
  type: 'instant' | 'bulk' | 'contract';
  products: Array<{ name: string; quantity: number }>;
  deliveryDate: string;
  createdAt: string;
}

export interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
  orderId?: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  status: 'pending_pickup' | 'picked_up' | 'in_transit' | 'delayed' | 'delivered';
  deliveryType: 'harvesta' | 'self' | 'third_party';
  driver?: string;
  eta: string;
}

export interface Earnings {
  total: number;
  thisMonth: number;
  lastMonth: number;
  growth: number;
  commissionFees: number;
  processingFees: number;
  totalWithdrawn: number;
  lifetimeEarnings: number;
}

export interface Transaction {
  id: string;
  type: 'sale' | 'refund' | 'payout' | 'withdrawal' | 'fee' | 'commission' | 'processing_fee' | 'logistics';
  amount: number;
  date: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
  breakdown?: {
    sale?: number;
    grossAmount?: number;
    commission?: number;
    processingFee?: number;
    logistics?: number;
    net?: number;
    netAmount?: number;
  };
}

export interface WalletBalance {
  available: number;
  pending: number;
  processing: number;
  total: number;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: 'bank_transfer' | 'mtn_momo' | 'orange_money';
  createdAt: string;
  requestedAt: string;
  completedAt?: string;
  reference?: string;
}

export interface FeeStructure {
  platformFee: number;
  processingFee: number;
  minimumWithdrawal: number;
  withdrawalFees: {
    bank_transfer: number;
    mtn_momo: number;
    orange_money: number;
  };
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
  isVerified: boolean;
}

export interface MobileMoneyAccount {
  id: string;
  provider: 'mtn_momo' | 'orange_money';
  phoneNumber: string;
  accountName: string;
  isDefault: boolean;
  isVerified: boolean;
}

export interface PayoutSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  minimumAmount: number;
  isAutomatic: boolean;
  paymentMethod: 'bank_transfer' | 'mtn_momo' | 'orange_money';
}

// ===== MOCK DATA =====

const mockOrders: Order[] = [
  {
    id: 'ORD-2026-001',
    buyerName: 'Cameroon Fresh Foods Ltd',
    total: 2500000,
    status: 'new',
    type: 'bulk',
    products: [
      { name: 'Premium Cocoa Beans', quantity: 500 },
      { name: 'Organic Coffee Arabica', quantity: 200 },
    ],
    deliveryDate: '2026-01-15',
    createdAt: '2026-01-12T10:30:00Z',
  },
  {
    id: 'ORD-2026-002',
    buyerName: 'West Africa Imports',
    total: 1800000,
    status: 'confirmed',
    type: 'instant',
    products: [{ name: 'Dried Ginger Root', quantity: 300 }],
    deliveryDate: '2026-01-14',
    createdAt: '2026-01-11T09:15:00Z',
  },
  {
    id: 'ORD-2026-003',
    buyerName: 'Lagos Spice Traders',
    total: 3200000,
    status: 'preparing',
    type: 'contract',
    products: [
      { name: 'Fresh Plantains', quantity: 1000 },
      { name: 'Palm Oil (25L)', quantity: 50 },
    ],
    deliveryDate: '2026-01-16',
    createdAt: '2026-01-10T16:45:00Z',
  },
  {
    id: 'ORD-2026-004',
    buyerName: 'Abuja Organic Market',
    total: 750000,
    status: 'in_transit',
    type: 'instant',
    products: [{ name: 'Shea Butter Raw', quantity: 100 }],
    deliveryDate: '2026-01-13',
    createdAt: '2026-01-09T08:20:00Z',
  },
  {
    id: 'ORD-2026-005',
    buyerName: 'Douala Fresh Markets',
    total: 4500000,
    status: 'delivered',
    type: 'bulk',
    products: [
      { name: 'Premium Cocoa Beans', quantity: 800 },
      { name: 'Dried Ginger Root', quantity: 500 },
    ],
    deliveryDate: '2026-01-08',
    createdAt: '2026-01-05T14:30:00Z',
  },
];

const mockMessages: Message[] = [
  {
    id: 'MSG-001',
    from: 'Cameroon Fresh Foods Ltd',
    subject: 'Inquiry about bulk cocoa pricing',
    preview: 'We would like to know your pricing for orders above 1000kg...',
    date: '2026-01-12T10:30:00Z',
    unread: true,
    orderId: 'ORD-2026-001',
  },
  {
    id: 'MSG-002',
    from: 'West Africa Imports',
    subject: 'Delivery schedule confirmation',
    preview: 'Please confirm the delivery schedule for our order...',
    date: '2026-01-12T09:15:00Z',
    unread: true,
  },
  {
    id: 'MSG-003',
    from: 'Lagos Spice Traders',
    subject: 'Quality certification request',
    preview: 'Could you provide the quality certificates for the plantains?',
    date: '2026-01-11T16:45:00Z',
    unread: false,
    orderId: 'ORD-2026-003',
  },
  {
    id: 'MSG-004',
    from: 'Abuja Organic Market',
    subject: 'Re: Shipping update',
    preview: 'Thank you for the update. We look forward to receiving the goods.',
    date: '2026-01-11T08:20:00Z',
    unread: false,
  },
];

const mockDeliveries: Delivery[] = [
  {
    id: 'DEL-001',
    orderId: 'ORD-2026-004',
    status: 'in_transit',
    deliveryType: 'harvesta',
    driver: 'Jean-Pierre Mbarga',
    eta: '2026-01-13T14:00:00Z',
  },
  {
    id: 'DEL-002',
    orderId: 'ORD-2026-003',
    status: 'pending_pickup',
    deliveryType: 'third_party',
    eta: '2026-01-16T10:00:00Z',
  },
  {
    id: 'DEL-003',
    orderId: 'ORD-2026-002',
    status: 'picked_up',
    deliveryType: 'self',
    driver: 'Paul Nkomo',
    eta: '2026-01-14T12:00:00Z',
  },
];

const mockTransactions: Transaction[] = [
  {
    id: 'TXN-001',
    type: 'sale',
    amount: 2500000,
    date: '2026-01-12T10:30:00Z',
    description: 'Payment for ORD-2026-001',
    status: 'completed',
    reference: 'ORD-2026-001',
  },
  {
    id: 'TXN-002',
    type: 'commission',
    amount: -175000,
    date: '2026-01-12T10:30:00Z',
    description: 'Platform commission (7%)',
    status: 'completed',
  },
  {
    id: 'TXN-003',
    type: 'withdrawal',
    amount: -1000000,
    date: '2026-01-11T15:00:00Z',
    description: 'Withdrawal to MTN MoMo',
    status: 'completed',
  },
  {
    id: 'TXN-004',
    type: 'sale',
    amount: 1800000,
    date: '2026-01-10T09:15:00Z',
    description: 'Payment for ORD-2026-002',
    status: 'pending',
    reference: 'ORD-2026-002',
  },
];

// ===== API FUNCTIONS =====

export async function fetchSellerOrders(): Promise<Order[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockOrders;
}

export async function fetchMessages(): Promise<Message[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockMessages;
}

export async function fetchDeliveries(): Promise<Delivery[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockDeliveries;
}

export async function fetchEarnings(): Promise<Earnings> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    total: 28500000,
    thisMonth: 8500000,
    lastMonth: 7200000,
    growth: 18.1,
    commissionFees: 1995000,
    processingFees: 427500,
    totalWithdrawn: 15000000,
    lifetimeEarnings: 85000000,
  };
}

export async function fetchTransactions(): Promise<Transaction[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockTransactions;
}

export async function fetchPayoutStatus(): Promise<{ nextPayout: string; amount: number; status: string }> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    nextPayout: '2026-01-15',
    amount: 2325000,
    status: 'scheduled',
  };
}

export async function fetchWalletBalance(): Promise<WalletBalance> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return {
    available: 4850000,
    pending: 2500000,
    processing: 500000,
    total: 7850000,
  };
}

export async function fetchWithdrawalHistory(): Promise<WithdrawalRequest[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return [
    {
      id: 'WDR-001',
      amount: 1000000,
      status: 'completed',
      paymentMethod: 'mtn_momo',
      createdAt: '2026-01-11T15:00:00Z',
      requestedAt: '2026-01-11T15:00:00Z',
      completedAt: '2026-01-11T15:05:00Z',
      reference: 'MTN-2026011115',
    },
    {
      id: 'WDR-002',
      amount: 2500000,
      status: 'pending',
      paymentMethod: 'bank_transfer',
      createdAt: '2026-01-10T10:00:00Z',
      requestedAt: '2026-01-10T10:00:00Z',
    },
  ];
}

export async function fetchFeeStructure(): Promise<FeeStructure> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    platformFee: 7,
    processingFee: 1.5,
    minimumWithdrawal: 10000,
    withdrawalFees: {
      bank_transfer: 1500,
      mtn_momo: 500,
      orange_money: 500,
    },
  };
}

export async function fetchBankAccounts(): Promise<BankAccount[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    {
      id: 'BANK-001',
      bankName: 'Afriland First Bank',
      accountNumber: '****4521',
      accountName: 'Mbarga Agro Farms SARL',
      isDefault: true,
      isVerified: true,
    },
  ];
}

export async function fetchMobileMoneyAccounts(): Promise<MobileMoneyAccount[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    {
      id: 'MOMO-001',
      provider: 'mtn_momo',
      phoneNumber: '+237 6XX XXX 123',
      accountName: 'Jean-Pierre Mbarga',
      isDefault: true,
      isVerified: true,
    },
    {
      id: 'MOMO-002',
      provider: 'orange_money',
      phoneNumber: '+237 6XX XXX 456',
      accountName: 'Jean-Pierre Mbarga',
      isDefault: false,
      isVerified: true,
    },
  ];
}

export async function fetchPayoutSchedule(): Promise<PayoutSchedule> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    frequency: 'weekly',
    dayOfWeek: 5, // Friday
    minimumAmount: 50000,
    isAutomatic: true,
    paymentMethod: 'mtn_momo',
  };
}

export async function requestWithdrawal(data: {
  amount: number;
  paymentMethod: 'bank_transfer' | 'mtn_momo' | 'orange_money';
  accountId: string;
}): Promise<{ success: boolean; withdrawalId: string }> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    success: true,
    withdrawalId: `WDR-${Date.now()}`,
  };
}
