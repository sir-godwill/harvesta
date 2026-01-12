// Simulated data for the Affiliate/Agent System

export const simulatedData = {
  affiliateStatus: {
    isVerified: true,
    tier: 'Gold',
    joinDate: '2025-09-15',
    status: 'active',
  },

  affiliateProfile: {
    id: 'HRV-AGT-001',
    name: 'Kwame Asante',
    email: 'kwame@example.com',
    phone: '+233 24 123 4567',
    country: 'Ghana',
    preferredCurrency: 'XAF',
    paymentMethod: 'Mobile Money',
    avatar: null,
    tier: 'Gold',
    joinDate: '2025-09-15',
  },

  referralStats: {
    totalClicks: 2847,
    totalSignups: 156,
    buyersReferred: 89,
    sellersOnboarded: 23,
    conversionRate: 5.48,
    activeReferrals: 67,
    weeklyGrowth: 12.5,
  },

  referredSellers: [
    {
      id: 'SLR-001',
      name: 'Golden Harvest Farms',
      owner: 'Ama Mensah',
      country: 'Ghana',
      status: 'active',
      productsListed: 45,
      totalRevenue: 4500000,
      commission: 315000,
      joinDate: '2025-10-20',
    },
    {
      id: 'SLR-002',
      name: 'Cameroon Cocoa Co.',
      owner: 'Jean-Pierre Ndi',
      country: 'Cameroon',
      status: 'active',
      productsListed: 28,
      totalRevenue: 8200000,
      commission: 574000,
      joinDate: '2025-11-05',
    },
    {
      id: 'SLR-003',
      name: 'Niger Delta Produce',
      owner: 'Chukwudi Okoro',
      country: 'Nigeria',
      status: 'pending',
      productsListed: 0,
      totalRevenue: 0,
      commission: 0,
      joinDate: '2026-01-10',
    },
    {
      id: 'SLR-004',
      name: 'Penja Pepper Farms',
      owner: 'Marie Fouda',
      country: 'Cameroon',
      status: 'active',
      productsListed: 12,
      totalRevenue: 2100000,
      commission: 147000,
      joinDate: '2025-12-01',
    },
  ],

  sellerPerformance: {
    productsListed: 45,
    ordersReceived: 234,
    revenueGenerated: 4500000,
    rating: 4.8,
  },

  commissionSummary: {
    totalEarned: 2450000,
    pending: 380000,
    available: 1850000,
    withdrawn: 220000,
    thisMonth: 485000,
    lastMonth: 412000,
    monthlyGrowth: 17.7,
  },

  commissionDetails: [
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
    {
      id: 'COM-003',
      type: 'campaign_bonus',
      description: 'New Year Campaign Bonus',
      amount: 75000,
      status: 'approved',
      date: '2026-01-05',
      campaign: 'New Year 2026',
    },
    {
      id: 'COM-004',
      type: 'seller_referral',
      description: 'Cameroon Cocoa Co. - Monthly commission',
      amount: 574000,
      status: 'approved',
      date: '2026-01-07',
      seller: 'Cameroon Cocoa Co.',
    },
    {
      id: 'COM-005',
      type: 'buyer_referral',
      description: 'Order #ORD-2026-102 - Plantain export',
      amount: 28000,
      status: 'pending',
      date: '2026-01-11',
      buyer: 'European Foods Ltd',
    },
  ],

  payoutHistory: [
    {
      id: 'PAY-001',
      amount: 500000,
      method: 'Mobile Money (MTN)',
      status: 'completed',
      requestDate: '2025-12-28',
      processedDate: '2025-12-30',
    },
    {
      id: 'PAY-002',
      amount: 350000,
      method: 'Bank Transfer',
      status: 'completed',
      requestDate: '2025-11-25',
      processedDate: '2025-11-28',
    },
    {
      id: 'PAY-003',
      amount: 200000,
      method: 'Mobile Money (Orange)',
      status: 'processing',
      requestDate: '2026-01-08',
      processedDate: null,
    },
  ],

  campaigns: [
    {
      id: 'CMP-001',
      name: 'New Year Harvest 2026',
      description: 'Celebrate the new year with special commission rates on all referrals',
      startDate: '2026-01-01',
      endDate: '2026-01-31',
      bonusRate: 15,
      status: 'active',
      joined: true,
      referrals: 12,
      earnings: 125000,
    },
    {
      id: 'CMP-002',
      name: 'Cocoa Season Special',
      description: 'Higher commissions for cocoa and coffee product referrals',
      startDate: '2025-12-01',
      endDate: '2026-02-28',
      bonusRate: 10,
      status: 'active',
      joined: true,
      referrals: 28,
      earnings: 342000,
    },
    {
      id: 'CMP-003',
      name: 'Seller Onboarding Drive',
      description: 'Extra bonuses for every new seller you bring to Harvestá',
      startDate: '2026-01-15',
      endDate: '2026-03-15',
      bonusRate: 20,
      status: 'upcoming',
      joined: false,
      referrals: 0,
      earnings: 0,
    },
  ],

  analytics: {
    dailyClicks: [
      { date: 'Mon', clicks: 145, signups: 8, revenue: 125000 },
      { date: 'Tue', clicks: 198, signups: 12, revenue: 185000 },
      { date: 'Wed', clicks: 234, signups: 15, revenue: 210000 },
      { date: 'Thu', clicks: 189, signups: 9, revenue: 156000 },
      { date: 'Fri', clicks: 276, signups: 18, revenue: 290000 },
      { date: 'Sat', clicks: 312, signups: 22, revenue: 345000 },
      { date: 'Sun', clicks: 245, signups: 14, revenue: 220000 },
    ],
    topProducts: [
      { name: 'Fresh Cocoa Beans', referrals: 45, revenue: 890000 },
      { name: 'Premium Coffee', referrals: 38, revenue: 720000 },
      { name: 'Penja Pepper', referrals: 32, revenue: 540000 },
      { name: 'Plantains (Export)', referrals: 28, revenue: 380000 },
    ],
    conversionsByCountry: [
      { country: 'Ghana', conversions: 45, percentage: 32 },
      { country: 'Cameroon', conversions: 38, percentage: 27 },
      { country: 'Nigeria', conversions: 32, percentage: 23 },
      { country: 'France', conversions: 15, percentage: 11 },
      { country: 'Germany', conversions: 10, percentage: 7 },
    ],
  },

  notifications: [
    {
      id: 'NOT-001',
      type: 'commission',
      title: 'Commission Earned! 🎉',
      message: 'You earned 42,500 XAF from Order #ORD-2026-089',
      timestamp: '2026-01-10T14:30:00',
      read: false,
    },
    {
      id: 'NOT-002',
      type: 'seller',
      title: 'New Seller Approved',
      message: 'Niger Delta Produce has been approved and is now active',
      timestamp: '2026-01-10T10:15:00',
      read: false,
    },
    {
      id: 'NOT-003',
      type: 'campaign',
      title: 'Campaign Starting Soon',
      message: 'Seller Onboarding Drive starts in 5 days. Join now!',
      timestamp: '2026-01-10T09:00:00',
      read: true,
    },
    {
      id: 'NOT-004',
      type: 'milestone',
      title: 'Milestone Reached! 🏆',
      message: "Congratulations! You've referred 150+ users this quarter",
      timestamp: '2026-01-08T16:45:00',
      read: true,
    },
    {
      id: 'NOT-005',
      type: 'payout',
      title: 'Payout Processing',
      message: 'Your payout of 200,000 XAF is being processed',
      timestamp: '2026-01-08T11:20:00',
      read: true,
    },
  ],
};

// Helper to format currency
export function formatCurrency(amount: number, currency: string = 'XAF'): string {
  if (currency === 'XAF' || currency === 'FCFA') {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + currency;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

// Helper to format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Helper to get status color
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'paid':
    case 'approved':
      return 'success';
    case 'pending':
    case 'processing':
      return 'warning';
    case 'suspended':
    case 'failed':
    case 'rejected':
      return 'destructive';
    default:
      return 'muted';
  }
}
