// Logistics Dashboard API Service
// Complete types matching harvesta-logistics folder structure

// Type aliases and enums
export type ShipmentStatus = 'pending' | 'picked-up' | 'in-transit' | 'out-for-delivery' | 'delivered' | 'delayed' | 'failed' | 'returned';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type ZoneType = 'urban' | 'semi-urban' | 'rural-accessible' | 'rural-difficult';
export type DeliveryModel = 'harvesta' | 'supplier' | 'third-party' | 'pickup';
export type JobStatus = 'available' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';

export interface Location {
  street: string;
  city: string;
  region: string;
  country: string;
}

export interface ShipmentItem {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  volume: number;
  isPerishable: boolean;
  temperatureRequired?: string;
}

export interface CostBreakdown {
  handlingFee: number;
  packagingFee: number;
  platformFee: number;
  distanceCost: number;
  weightCost: number;
  perishabilityMultiplier: number;
  roadConditionMultiplier: number;
  fuelBuffer: number;
  total: number;
  currency: string;
}

export interface TimelineEvent {
  id: string;
  status: string;
  timestamp: string;
  description: string;
  location?: string;
  actor: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  orderId: string;
  vendorId: string;
  vendorName: string;
  buyerId: string;
  buyerName: string;
  deliveryModel: DeliveryModel;
  status: ShipmentStatus;
  riskLevel: RiskLevel;
  productType: string;
  items: ShipmentItem[];
  pickupLocation: Location;
  deliveryLocation: Location;
  zone: ZoneType;
  estimatedDelivery: string;
  actualDelivery?: string;
  assignedPartner?: LogisticsPartner;
  partnerId: string;
  partnerName: string;
  weight: number;
  costBreakdown: CostBreakdown;
  timeline: TimelineEvent[];
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LogisticsPartner {
  id: string;
  name: string;
  type: 'driver' | 'company' | 'transporter';
  rating: number;
  onTimeRate: number;
  successRate: number;
  totalDeliveries: number;
  vehicleType: string;
  zones: ZoneType[];
  isActive: boolean;
  contactPhone: string;
  licenseNumber: string;
}

export interface DeliveryWindow {
  start: string;
  end: string;
}

export interface LogisticsJob {
  id: string;
  shipmentId: string;
  pickupLocation: Location;
  deliveryLocation: Location;
  productType: string;
  weight: number;
  volume: number;
  deliveryWindow: DeliveryWindow;
  riskLevel: RiskLevel;
  payment: number;
  status: JobStatus;
  specialInstructions?: string;
}

export interface DeliveryOption {
  id: string;
  model: DeliveryModel;
  name: string;
  description: string;
  estimatedDays: string;
  cost: CostBreakdown;
  riskLevel: RiskLevel;
  isAvailable: boolean;
}

export interface PerformanceMetrics {
  onTimeRate: number;
  successRate: number;
  avgDeliveryTime: number;
  totalDeliveries: number;
  rating: number;
  earnings: {
    today: number;
    week: number;
    month: number;
    total: number;
    currency: string;
  };
}

export interface SLARule {
  id: string;
  name: string;
  zone: ZoneType;
  productType: string;
  maxDeliveryHours: number;
  maxDelayPenalty: number;
  conditions: string[];
  isActive: boolean;
}

export interface Alert {
  id: string;
  type: 'delay' | 'risk' | 'sla-breach' | 'incident' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  shipmentId?: string;
  timestamp: string;
  isRead: boolean;
  actionRequired?: string;
}

export interface Incident {
  id: string;
  shipmentId: string;
  type: 'vehicle-breakdown' | 'accident' | 'theft' | 'weather' | 'road-block' | 'other';
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  reportedAt: string;
  resolvedAt?: string;
  resolution?: string;
}

export interface AnalyticsData {
  period: string;
  deliveries: number;
  onTime: number;
  delayed: number;
  revenue: number;
}

export interface RegionalAnalytics {
  region: string;
  deliveries: number;
  onTimeRate: number;
  avgDeliveryTime: number;
  topPartner: string;
  issues: number;
}

export interface PartnerAnalytics {
  partnerId: string;
  partnerName: string;
  deliveries: number;
  onTimeRate: number;
  rating: number;
  revenue: number;
}

export interface LogisticsZone {
  id: string;
  name: string;
  type: ZoneType;
  regions: string[];
  baseRate: number;
  multiplier: number;
  avgDeliveryTime: number;
  isActive: boolean;
}

export interface CostConfiguration {
  baseHandlingFee: number;
  basePackagingFee: number;
  basePlatformFee: number;
  perKmRate: number;
  perKgRate: number;
  perishableMultiplier: number;
  fragileMultiplier: number;
  expressMultiplier: number;
  zoneMultipliers: Record<ZoneType, number>;
  fuelBufferPercent: number;
}

export interface TrackingUpdate {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  location: Location;
  timestamp: string;
  description: string;
  photo?: string;
  signature?: string;
}

export interface LogisticsMetrics {
  totalActiveShipments: number;
  inTransit: number;
  delayed: number;
  onTimeRate: number;
  pendingPickup: number;
  deliveredToday: number;
  topDelayReasons: { reason: string; count: number }[];
  regionBreakdown: { region: string; active: number; delayed: number }[];
}

// API Functions
export async function fetchLogisticsMetrics(): Promise<LogisticsMetrics> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    totalActiveShipments: 156,
    inTransit: 78,
    delayed: 12,
    onTimeRate: 91,
    pendingPickup: 23,
    deliveredToday: 34,
    topDelayReasons: [
      { reason: 'Weather conditions', count: 5 },
      { reason: 'Road conditions', count: 4 },
      { reason: 'Customs delay', count: 2 },
      { reason: 'Vehicle breakdown', count: 1 },
    ],
    regionBreakdown: [
      { region: 'Littoral', active: 45, delayed: 3 },
      { region: 'Centre', active: 38, delayed: 2 },
      { region: 'South-West', active: 32, delayed: 4 },
      { region: 'West', active: 25, delayed: 2 },
      { region: 'North-West', active: 16, delayed: 1 },
    ],
  };
}

export async function fetchShipments(): Promise<Shipment[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return [];
}

export async function fetchShipmentById(id: string): Promise<Shipment | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return null;
}

export async function fetchPartners(): Promise<LogisticsPartner[]> {
  await new Promise(resolve => setTimeout(resolve, 350));
  return [];
}

export async function fetchDelayedShipments(): Promise<Shipment[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [];
}

export async function updateShipmentStatus(
  id: string, 
  status: ShipmentStatus
): Promise<Shipment | null> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return null;
}

export async function fetchJobs(): Promise<LogisticsJob[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return [];
}

export async function fetchDeliveryOptions(): Promise<DeliveryOption[]> {
  await new Promise(resolve => setTimeout(resolve, 350));
  return [];
}

export async function fetchPerformanceMetrics(): Promise<PerformanceMetrics> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return {
    onTimeRate: 94,
    successRate: 98,
    avgDeliveryTime: 2.5,
    totalDeliveries: 1247,
    rating: 4.8,
    earnings: {
      today: 45000,
      week: 285000,
      month: 1250000,
      total: 15800000,
      currency: 'XAF',
    },
  };
}

export async function fetchAlerts(): Promise<Alert[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [];
}

export async function fetchSLARules(): Promise<SLARule[]> {
  await new Promise(resolve => setTimeout(resolve, 350));
  return [];
}

export async function fetchAnalytics(): Promise<AnalyticsData[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [];
}

export async function fetchRegionalAnalytics(): Promise<RegionalAnalytics[]> {
  await new Promise(resolve => setTimeout(resolve, 450));
  return [];
}
