// Referral/Affiliate Dashboard API Service
// This module provides API endpoints for the affiliate system

export interface AgentUser {
  id: string;
  name: string;
  email: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  referralCode: string;
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  joinedAt: Date;
}

export interface Referral {
  id: string;
  referralCode: string;
  referredUserId: string;
  referredUserName: string;
  referredUserType: 'buyer' | 'seller';
  status: 'pending' | 'active' | 'completed' | 'expired';
  commission: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  commissionRate: number;
  bonus: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  participantCount: number;
  totalReferrals: number;
}

export interface Payout {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: 'mobile_money' | 'bank_transfer';
  requestedAt: Date;
  processedAt?: Date;
  reference?: string;
}

export interface ReferralMetrics {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  conversionRate: number;
  thisMonthReferrals: number;
  thisMonthEarnings: number;
  topCampaigns: { name: string; referrals: number }[];
}

// Mock Data
const mockAgent: AgentUser = {
  id: 'agent_001',
  name: 'Amara Kofi',
  email: 'amara.kofi@example.com',
  tier: 'Gold',
  referralCode: 'HARVESTA-AMARA2026',
  totalReferrals: 145,
  activeReferrals: 89,
  totalEarnings: 2850000,
  pendingEarnings: 450000,
  joinedAt: new Date('2025-03-15'),
};

const mockReferrals: Referral[] = [
  {
    id: 'ref_001',
    referralCode: 'HARVESTA-AMARA2026',
    referredUserId: 'user_101',
    referredUserName: 'Fresh Foods Cameroon',
    referredUserType: 'seller',
    status: 'active',
    commission: 75000,
    createdAt: new Date('2026-01-10'),
  },
  {
    id: 'ref_002',
    referralCode: 'HARVESTA-AMARA2026',
    referredUserId: 'user_102',
    referredUserName: 'Douala Grocers',
    referredUserType: 'buyer',
    status: 'completed',
    commission: 25000,
    createdAt: new Date('2026-01-08'),
    completedAt: new Date('2026-01-11'),
  },
  {
    id: 'ref_003',
    referralCode: 'HARVESTA-AMARA2026',
    referredUserId: 'user_103',
    referredUserName: 'Yaoundé Organic Market',
    referredUserType: 'seller',
    status: 'pending',
    commission: 0,
    createdAt: new Date('2026-01-12'),
  },
];

const mockCampaigns: Campaign[] = [
  {
    id: 'camp_001',
    name: 'New Year Seller Boost',
    description: 'Earn 50% extra commission on seller referrals in January',
    commissionRate: 15,
    bonus: 50000,
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-01-31'),
    isActive: true,
    participantCount: 234,
    totalReferrals: 567,
  },
  {
    id: 'camp_002',
    name: 'Buyer Growth Initiative',
    description: 'Double points for business buyer referrals',
    commissionRate: 8,
    bonus: 25000,
    startDate: new Date('2026-01-15'),
    endDate: new Date('2026-02-28'),
    isActive: true,
    participantCount: 156,
    totalReferrals: 234,
  },
];

const mockPayouts: Payout[] = [
  {
    id: 'pay_001',
    amount: 500000,
    status: 'completed',
    method: 'mobile_money',
    requestedAt: new Date('2026-01-05'),
    processedAt: new Date('2026-01-06'),
    reference: 'MTN-CM-123456',
  },
  {
    id: 'pay_002',
    amount: 350000,
    status: 'processing',
    method: 'bank_transfer',
    requestedAt: new Date('2026-01-10'),
  },
  {
    id: 'pay_003',
    amount: 450000,
    status: 'pending',
    method: 'mobile_money',
    requestedAt: new Date('2026-01-12'),
  },
];

const mockMetrics: ReferralMetrics = {
  totalReferrals: 145,
  activeReferrals: 89,
  totalEarnings: 2850000,
  pendingEarnings: 450000,
  conversionRate: 61.4,
  thisMonthReferrals: 23,
  thisMonthEarnings: 575000,
  topCampaigns: [
    { name: 'New Year Seller Boost', referrals: 15 },
    { name: 'Buyer Growth Initiative', referrals: 8 },
  ],
};

// API Functions
export async function fetchAgentProfile(): Promise<AgentUser> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockAgent;
}

export async function fetchReferrals(): Promise<Referral[]> {
  await new Promise(resolve => setTimeout(resolve, 350));
  return mockReferrals;
}

export async function fetchReferralMetrics(): Promise<ReferralMetrics> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockMetrics;
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCampaigns;
}

export async function fetchPayouts(): Promise<Payout[]> {
  await new Promise(resolve => setTimeout(resolve, 350));
  return mockPayouts;
}

export async function requestPayout(
  amount: number, 
  method: 'mobile_money' | 'bank_transfer'
): Promise<Payout> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    id: `pay_${Date.now()}`,
    amount,
    status: 'pending',
    method,
    requestedAt: new Date(),
  };
}

export async function generateReferralLink(campaignId?: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const baseLink = `https://harvesta.cm/join?ref=${mockAgent.referralCode}`;
  return campaignId ? `${baseLink}&campaign=${campaignId}` : baseLink;
}

// Aliases for backwards compatibility with uploaded referral dashboard
export async function fetchReferralStats() {
  await new Promise(resolve => setTimeout(resolve, 400));
  return {
    totalClicks: 2847,
    totalSignups: 156,
    buyersReferred: 89,
    sellersOnboarded: 23,
    conversionRate: 5.48,
    activeReferrals: 67,
    weeklyGrowth: 12.5,
  };
}

export async function fetchCommissionDetails() {
  await new Promise(resolve => setTimeout(resolve, 400));
  return [
    {
      id: 'COM-001',
      type: 'seller_referral',
      description: 'Golden Harvest Farms - Monthly commission',
      amount: 315000,
      status: 'paid',
      date: '2026-01-08',
      seller: 'Golden Harvest Farms',
    },
    {
      id: 'COM-002',
      type: 'buyer_referral',
      description: 'Order #ORD-2026-089 - Coffee beans purchase',
      amount: 42500,
      status: 'pending',
      date: '2026-01-10',
      buyer: 'Lagos Fresh Markets',
    },
  ];
}

export async function createReferralLink(campaign?: string) {
  await new Promise(resolve => setTimeout(resolve, 300));
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  return {
    link: `https://harvesta.app/ref/${code}`,
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://harvesta.app/ref/${code}`,
    code,
  };
}
