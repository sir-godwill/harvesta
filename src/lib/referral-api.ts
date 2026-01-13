/**
 * Harvestá Referral/Affiliate API Layer
 * All functions return mock data, ready for Supabase integration
 */

// ============ TYPES ============

export type AgentTier = 'bronze' | 'silver' | 'gold' | 'platinum';
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type CampaignStatus = 'active' | 'scheduled' | 'paused' | 'ended';

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: AgentTier;
  referralCode: string;
  totalReferrals: number;
  activeSellers: number;
  totalEarnings: number;
  pendingEarnings: number;
  conversionRate: number;
  joinedAt: string;
  lastActive: string;
}

export interface Referral {
  id: string;
  agentId: string;
  sellerName: string;
  sellerEmail: string;
  status: 'pending' | 'approved' | 'rejected' | 'active';
  signupDate: string;
  firstSaleDate?: string;
  totalSales: number;
  commission: number;
}

export interface SellerOnboarding {
  id: string;
  agentId: string;
  sellerName: string;
  businessName: string;
  category: string;
  status: 'applied' | 'documents' | 'verification' | 'approved' | 'rejected';
  progress: number;
  appliedAt: string;
  updatedAt: string;
}

export interface Commission {
  id: string;
  agentId: string;
  referralId: string;
  sellerName: string;
  orderId: string;
  orderAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'pending' | 'confirmed' | 'paid';
  earnedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'bonus' | 'contest' | 'milestone';
  status: CampaignStatus;
  reward: string;
  target: number;
  progress: number;
  startDate: string;
  endDate: string;
  participants: number;
}

export interface Payout {
  id: string;
  agentId: string;
  amount: number;
  method: 'mobile_money' | 'bank_transfer' | 'crypto';
  status: PayoutStatus;
  reference: string;
  requestedAt: string;
  processedAt?: string;
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  pendingApproval: number;
  thisMonthReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  availableBalance: number;
  conversionRate: number;
  averageOrderValue: number;
  topCategory: string;
}

export interface AnalyticsData {
  earningsChart: { date: string; earnings: number }[];
  referralsChart: { date: string; referrals: number }[];
  categoryBreakdown: { name: string; value: number }[];
  regionBreakdown: { region: string; referrals: number; earnings: number }[];
  topPerformers: { name: string; referrals: number; earnings: number }[];
}

// ============ MOCK DATA ============

const mockStats: ReferralStats = {
  totalReferrals: 47,
  activeReferrals: 38,
  pendingApproval: 5,
  thisMonthReferrals: 12,
  totalEarnings: 2850000,
  pendingEarnings: 450000,
  availableBalance: 1200000,
  conversionRate: 68,
  averageOrderValue: 125000,
  topCategory: 'Coffee & Cocoa',
};

const mockReferrals: Referral[] = [
  { id: 'ref-001', agentId: 'agent-001', sellerName: 'Kofi Farms', sellerEmail: 'kofi@farms.com', status: 'active', signupDate: '2024-01-10', firstSaleDate: '2024-01-15', totalSales: 2500000, commission: 125000 },
  { id: 'ref-002', agentId: 'agent-001', sellerName: 'Lagos Organics', sellerEmail: 'lagos@org.ng', status: 'active', signupDate: '2024-01-12', firstSaleDate: '2024-01-20', totalSales: 1800000, commission: 90000 },
  { id: 'ref-003', agentId: 'agent-001', sellerName: 'Cameroon Cocoa', sellerEmail: 'cocoa@cm.com', status: 'pending', signupDate: '2024-01-25', totalSales: 0, commission: 0 },
  { id: 'ref-004', agentId: 'agent-001', sellerName: 'Ethiopian Coffee', sellerEmail: 'eth@coffee.et', status: 'approved', signupDate: '2024-01-28', totalSales: 0, commission: 0 },
];

const mockSellers: SellerOnboarding[] = [
  { id: 'onb-001', agentId: 'agent-001', sellerName: 'Pierre Mballa', businessName: 'Mballa Farms', category: 'Vegetables', status: 'documents', progress: 40, appliedAt: '2024-01-20', updatedAt: '2024-01-22' },
  { id: 'onb-002', agentId: 'agent-001', sellerName: 'Fatou Ndiaye', businessName: 'Ndiaye Exports', category: 'Nuts & Seeds', status: 'verification', progress: 70, appliedAt: '2024-01-18', updatedAt: '2024-01-25' },
  { id: 'onb-003', agentId: 'agent-001', sellerName: 'Amara Diallo', businessName: 'Diallo Organic', category: 'Coffee', status: 'approved', progress: 100, appliedAt: '2024-01-10', updatedAt: '2024-01-15' },
];

const mockCommissions: Commission[] = [
  { id: 'com-001', agentId: 'agent-001', referralId: 'ref-001', sellerName: 'Kofi Farms', orderId: 'ORD-4521', orderAmount: 500000, commissionRate: 5, commissionAmount: 25000, status: 'confirmed', earnedAt: '2024-01-25' },
  { id: 'com-002', agentId: 'agent-001', referralId: 'ref-001', sellerName: 'Kofi Farms', orderId: 'ORD-4522', orderAmount: 750000, commissionRate: 5, commissionAmount: 37500, status: 'pending', earnedAt: '2024-01-26' },
  { id: 'com-003', agentId: 'agent-001', referralId: 'ref-002', sellerName: 'Lagos Organics', orderId: 'ORD-4523', orderAmount: 320000, commissionRate: 5, commissionAmount: 16000, status: 'paid', earnedAt: '2024-01-20' },
];

const mockCampaigns: Campaign[] = [
  { id: 'camp-001', name: 'Q1 Power Start', description: 'Refer 10 sellers this quarter', type: 'milestone', status: 'active', reward: '250,000 XAF Bonus', target: 10, progress: 7, startDate: '2024-01-01', endDate: '2024-03-31', participants: 145 },
  { id: 'camp-002', name: 'Coffee Season Push', description: 'Special bonus for coffee sellers', type: 'bonus', status: 'active', reward: '10% Extra Commission', target: 5, progress: 3, startDate: '2024-01-15', endDate: '2024-02-28', participants: 89 },
  { id: 'camp-003', name: 'Top Agent Contest', description: 'Monthly leaderboard competition', type: 'contest', status: 'active', reward: '500,000 XAF Prize', target: 20, progress: 12, startDate: '2024-01-01', endDate: '2024-01-31', participants: 234 },
];

const mockPayouts: Payout[] = [
  { id: 'pay-001', agentId: 'agent-001', amount: 500000, method: 'mobile_money', status: 'completed', reference: 'MM-2024-001', requestedAt: '2024-01-20', processedAt: '2024-01-21' },
  { id: 'pay-002', agentId: 'agent-001', amount: 350000, method: 'bank_transfer', status: 'processing', reference: 'BT-2024-002', requestedAt: '2024-01-25' },
];

// ============ API FUNCTIONS ============

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchReferralStats(): Promise<ReferralStats> {
  await delay(400);
  return mockStats;
}

export async function fetchReferrals(): Promise<Referral[]> {
  await delay(350);
  return mockReferrals;
}

export async function fetchSellerOnboarding(): Promise<SellerOnboarding[]> {
  await delay(350);
  return mockSellers;
}

export async function fetchCommissions(): Promise<Commission[]> {
  await delay(350);
  return mockCommissions;
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  await delay(300);
  return mockCampaigns;
}

export async function fetchPayouts(): Promise<Payout[]> {
  await delay(300);
  return mockPayouts;
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  await delay(500);
  return {
    earningsChart: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      earnings: 50000 + Math.floor(Math.random() * 100000),
    })),
    referralsChart: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      referrals: Math.floor(Math.random() * 5),
    })),
    categoryBreakdown: [
      { name: 'Coffee', value: 35 },
      { name: 'Cocoa', value: 25 },
      { name: 'Nuts', value: 20 },
      { name: 'Vegetables', value: 12 },
      { name: 'Others', value: 8 },
    ],
    regionBreakdown: [
      { region: 'Centre', referrals: 15, earnings: 750000 },
      { region: 'Littoral', referrals: 12, earnings: 600000 },
      { region: 'West', referrals: 10, earnings: 500000 },
      { region: 'Northwest', referrals: 6, earnings: 300000 },
    ],
    topPerformers: [
      { name: 'Amadou B.', referrals: 45, earnings: 2250000 },
      { name: 'Fatou N.', referrals: 38, earnings: 1900000 },
      { name: 'Pierre M.', referrals: 32, earnings: 1600000 },
    ],
  };
}

export async function generateReferralLink(channel?: string): Promise<string> {
  await delay(200);
  const code = 'HRV' + Math.random().toString(36).substring(2, 8).toUpperCase();
  return `https://harvesta.cm/join/${code}${channel ? `?utm_source=${channel}` : ''}`;
}

export async function requestPayout(amount: number, method: Payout['method']): Promise<{ success: boolean; payoutId: string }> {
  await delay(500);
  console.log('[API] Requesting payout:', amount, method);
  return { success: true, payoutId: `pay-${Date.now()}` };
}

export async function updateOnboardingStatus(onboardingId: string, status: SellerOnboarding['status']): Promise<{ success: boolean }> {
  await delay(400);
  console.log('[API] Updating onboarding status:', onboardingId, status);
  return { success: true };
}
