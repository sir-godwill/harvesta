// Simulated API functions for the Affiliate/Agent System
// These placeholders will be replaced with real API calls when Supabase is integrated

import { simulatedData } from './mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ============ AFFILIATE REGISTRATION & ONBOARDING ============

export async function registerAffiliate(data: {
  name: string;
  email: string;
  phone: string;
  country: string;
  agentId?: string;
}) {
  await delay(800);
  return {
    success: true,
    affiliateId: `HRV-${Date.now().toString(36).toUpperCase()}`,
    message: 'Registration successful! Welcome to Harvestá Affiliate Program.',
  };
}

export async function verifyAffiliate(code: string) {
  await delay(500);
  return { verified: true, message: 'Verification successful!' };
}

export async function fetchAffiliateStatus() {
  await delay(300);
  return simulatedData.affiliateStatus;
}

export async function fetchAffiliateProfile() {
  await delay(300);
  return simulatedData.affiliateProfile;
}

export async function updateAffiliateProfile(data: any) {
  await delay(500);
  return { success: true, message: 'Profile updated successfully!' };
}

// ============ SELLER ONBOARDING ============

export async function submitSellerOnboarding(data: {
  businessName: string;
  email: string;
  phone: string;
  country: string;
}) {
  await delay(800);
  return {
    success: true,
    sellerId: `SLR-${Date.now().toString(36).toUpperCase()}`,
    message: 'Seller invitation sent successfully!',
  };
}

export async function fetchReferredSellers() {
  await delay(400);
  return simulatedData.referredSellers;
}

export async function trackSellerPerformance(sellerId: string) {
  await delay(300);
  return simulatedData.sellerPerformance;
}

export async function approveSellerOnboarding(sellerId: string) {
  await delay(500);
  return { success: true, message: 'Seller approved!' };
}

// ============ REFERRAL TRACKING ============

export async function createReferralLink(campaign?: string) {
  await delay(300);
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  return {
    link: `https://harvesta.app/ref/${code}`,
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://harvesta.app/ref/${code}`,
    code,
  };
}

export async function trackReferralClick(code: string) {
  await delay(100);
  return { success: true };
}

export async function fetchReferralStats() {
  await delay(400);
  return simulatedData.referralStats;
}

// ============ COMMISSION MANAGEMENT ============

export async function calculateAffiliateCommission() {
  await delay(300);
  return simulatedData.commissionSummary;
}

export async function fetchCommissionDetails() {
  await delay(400);
  return simulatedData.commissionDetails;
}

// ============ PAYOUTS ============

export async function requestPayout(amount: number, method: string) {
  await delay(800);
  return {
    success: true,
    payoutId: `PAY-${Date.now().toString(36).toUpperCase()}`,
    message: 'Payout request submitted successfully!',
  };
}

export async function fetchPayoutHistory() {
  await delay(400);
  return simulatedData.payoutHistory;
}

// ============ CAMPAIGNS ============

export async function fetchAffiliateCampaigns() {
  await delay(400);
  return simulatedData.campaigns;
}

export async function joinCampaign(campaignId: string) {
  await delay(500);
  return { success: true, message: 'Successfully joined campaign!' };
}

export async function leaveCampaign(campaignId: string) {
  await delay(500);
  return { success: true, message: 'Left campaign successfully.' };
}

// ============ ANALYTICS ============

export async function fetchAffiliateAnalytics() {
  await delay(500);
  return simulatedData.analytics;
}

export async function exportAnalyticsCSV() {
  await delay(1000);
  return { success: true, downloadUrl: '#' };
}

// ============ NOTIFICATIONS ============

export async function fetchAffiliateNotifications() {
  await delay(300);
  return simulatedData.notifications;
}

export async function markNotificationRead(notificationId: string) {
  await delay(200);
  return { success: true };
}

export async function sendAffiliateNotification(data: any) {
  await delay(300);
  return { success: true };
}
