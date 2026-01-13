/**
 * Logistics API Types and Services
 * Contains types for the Harvestá Logistics System
 */

export type ShipmentStatus = 'pending' | 'picked-up' | 'in-transit' | 'delayed' | 'delivered' | 'cancelled';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type ZoneType = 'urban' | 'semi-urban' | 'rural-accessible' | 'rural-difficult';
export type ProductType = 'perishable' | 'non-perishable' | 'bulk' | 'fragile';
export type DeliveryModel = 'harvesta' | 'supplier' | 'third-party';

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
  status: ShipmentStatus;
  timestamp: string;
  description: string;
  location?: string;
  actor: string;
}

export interface LogisticsPartner {
  id: string;
  name: string;
  type: 'driver' | 'transporter' | 'company';
  rating: number;
  onTimeRate: number;
  successRate: number;
  totalDeliveries: number;
  vehicleType: string;
  zones: string[];
  isActive: boolean;
  contactPhone: string;
  licenseNumber: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  vendorId: string;
  vendorName: string;
  buyerId: string;
  buyerName: string;
  deliveryModel: DeliveryModel;
  status: ShipmentStatus;
  riskLevel: RiskLevel;
  productType: ProductType;
  items: ShipmentItem[];
  pickupLocation: Location;
  deliveryLocation: Location;
  zone: ZoneType;
  estimatedDelivery: string;
  actualDelivery?: string;
  assignedPartner?: LogisticsPartner;
  costBreakdown: CostBreakdown;
  timeline: TimelineEvent[];
  notes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LogisticsJob {
  id: string;
  shipmentId: string;
  pickupLocation: Location;
  deliveryLocation: Location;
  productType: ProductType;
  weight: number;
  volume: number;
  deliveryWindow: { start: string; end: string };
  riskLevel: RiskLevel;
  payment: number;
  status: 'available' | 'assigned' | 'completed';
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
  averageDeliveryTime: number;
  totalDeliveries: number;
  successRate: number;
  customerRating: number;
  activeJobs: number;
  earnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export interface AdminMetrics {
  totalActiveShipments: number;
  inTransit: number;
  delayed: number;
  delivered: number;
  onTimeRate: number;
  topDelayReasons: { reason: string; count: number }[];
  regionBreakdown: { region: string; active: number; delayed: number }[];
}

export interface Alert {
  id: string;
  type: 'delay' | 'risk' | 'sla-breach' | 'incident' | 'weather';
  severity: 'low' | 'warning' | 'critical';
  status: 'active' | 'acknowledged' | 'investigating' | 'resolved';
  title: string;
  description: string;
  shipmentId?: string;
  region?: string;
  createdAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
}

export interface Incident {
  id: string;
  shipmentId: string;
  type: 'damage' | 'theft' | 'accident' | 'delay' | 'other';
  severity: 'low' | 'warning' | 'critical';
  description: string;
  evidenceUrls: string[];
  resolution?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AnalyticsData {
  period: string;
  totalDeliveries: number;
  onTimeRate: number;
  averageDeliveryTime: number;
  costPerDelivery: number;
  failureRate: number;
}

export interface RegionalAnalytics {
  region: string;
  deliveries: number;
  onTimeRate: number;
  avgCost: number;
  topPartner: string;
}

export interface PartnerAnalytics {
  partnerId: string;
  partnerName: string;
  deliveries: number;
  onTimeRate: number;
  rating: number;
  revenue: number;
}

export interface TrackingUpdate {
  shipmentId: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  milestone: string;
  estimatedArrival: string;
  delayReason?: string;
}

export interface SLARule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  isActive: boolean;
}

export interface LogisticsZone {
  id: string;
  name: string;
  type: ZoneType;
  regions: string[];
  isActive: boolean;
}

export interface CostConfiguration {
  handlingFeeBase: number;
  packagingFeeBase: number;
  platformFeePercentage: number;
  distanceCostPerKm: number;
  weightCostPerKg: number;
  volumeCostPerCubicM: number;
  fuelBufferPercentage: number;
  perishabilityMultipliers: Record<ProductType, number>;
  zoneMultipliers: Record<ZoneType, number>;
}

// Dormant API functions - will be connected to Supabase later
export async function fetchShipments(): Promise<Shipment[]> {
  console.log('[DORMANT] fetchShipments called');
  return [];
}

export async function fetchLogisticsPartners(): Promise<LogisticsPartner[]> {
  console.log('[DORMANT] fetchLogisticsPartners called');
  return [];
}

export async function updateShipmentStatus(id: string, status: ShipmentStatus): Promise<void> {
  console.log('[DORMANT] updateShipmentStatus called', { id, status });
}

export async function assignPartner(shipmentId: string, partnerId: string): Promise<void> {
  console.log('[DORMANT] assignPartner called', { shipmentId, partnerId });
}

export async function estimateDeliveryCost(params: {
  pickupZone: ZoneType;
  deliveryZone: ZoneType;
  weight: number;
  volume: number;
  productType: ProductType;
  deliveryModel: DeliveryModel;
}): Promise<CostBreakdown> {
  console.log('[DORMANT] estimateDeliveryCost called', params);
  return {} as CostBreakdown;
}
