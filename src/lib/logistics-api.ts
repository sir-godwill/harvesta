/**
 * Harvestá Logistics API Layer
 * All functions return mock data, ready for Supabase integration
 */

// ============ TYPES ============

export type ShipmentStatus = 'pending' | 'picked-up' | 'in-transit' | 'out-for-delivery' | 'delivered' | 'delayed' | 'exception';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type DeliveryModel = 'harvesta' | 'supplier' | 'third-party' | 'pickup';
export type ZoneType = 'urban' | 'semi-urban' | 'rural-accessible' | 'rural-difficult';

export interface Location {
  street: string;
  city: string;
  region: string;
  country: string;
  coordinates?: { lat: number; lng: number };
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
  productType: string;
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

export interface AdminMetrics {
  totalActiveShipments: number;
  inTransit: number;
  delivered: number;
  delayed: number;
  exceptions: number;
  onTimeRate: number;
  topDelayReasons: { reason: string; count: number }[];
  regionBreakdown: { region: string; active: number; delayed: number }[];
}

export interface Alert {
  id: string;
  shipmentId: string;
  type: 'delay' | 'exception' | 'sla-breach' | 'temperature' | 'damage';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  createdAt: string;
  isResolved: boolean;
}

// ============ MOCK DATA ============

const mockPartners: LogisticsPartner[] = [
  { id: 'LP001', name: 'Jean-Pierre Mbarga', type: 'driver', rating: 4.8, onTimeRate: 94, successRate: 98, totalDeliveries: 1247, vehicleType: 'Toyota Hilux', zones: ['urban', 'semi-urban'], isActive: true, contactPhone: '+237 6XX XXX XXX', licenseNumber: 'CMR-DRV-2024-001' },
  { id: 'LP002', name: 'Cameroon Agro Logistics', type: 'company', rating: 4.6, onTimeRate: 89, successRate: 96, totalDeliveries: 5420, vehicleType: 'Fleet - Mixed', zones: ['urban', 'semi-urban', 'rural-accessible'], isActive: true, contactPhone: '+237 2XX XXX XXX', licenseNumber: 'CMR-TRP-2024-015' },
  { id: 'LP003', name: 'Marie Ngono', type: 'transporter', rating: 4.9, onTimeRate: 97, successRate: 99, totalDeliveries: 823, vehicleType: 'Refrigerated Van', zones: ['urban'], isActive: true, contactPhone: '+237 6XX XXX XXX', licenseNumber: 'CMR-DRV-2024-089' },
  { id: 'LP004', name: 'Paul Nkomo', type: 'driver', rating: 4.5, onTimeRate: 88, successRate: 94, totalDeliveries: 456, vehicleType: 'Mitsubishi Canter', zones: ['semi-urban', 'rural-accessible'], isActive: true, contactPhone: '+237 6XX XXX XXX', licenseNumber: 'CMR-DRV-2024-112' },
  { id: 'LP005', name: 'Trans-Cameroon Express', type: 'company', rating: 4.7, onTimeRate: 92, successRate: 97, totalDeliveries: 3210, vehicleType: 'Fleet - Heavy Duty', zones: ['urban', 'semi-urban', 'rural-accessible', 'rural-difficult'], isActive: true, contactPhone: '+237 2XX XXX XXX', licenseNumber: 'CMR-TRP-2024-008' },
];

const mockShipments: Shipment[] = [
  {
    id: 'SHP-2024-001',
    orderId: 'ORD-2024-4521',
    vendorId: 'VND-001',
    vendorName: 'Cooperative Agricole de Bamenda',
    buyerId: 'BYR-001',
    buyerName: 'Restaurant Le Jardin',
    deliveryModel: 'harvesta',
    status: 'in-transit',
    riskLevel: 'medium',
    productType: 'perishable',
    items: [
      { id: 'ITM-001', name: 'Fresh Tomatoes', quantity: 50, weight: 25, volume: 0.5, isPerishable: true, temperatureRequired: '10-15°C' },
      { id: 'ITM-002', name: 'Green Peppers', quantity: 30, weight: 15, volume: 0.3, isPerishable: true, temperatureRequired: '10-15°C' },
    ],
    pickupLocation: { street: 'Marché Central', city: 'Bamenda', region: 'Northwest', country: 'Cameroon' },
    deliveryLocation: { street: 'Quartier Bastos', city: 'Yaoundé', region: 'Centre', country: 'Cameroon' },
    zone: 'semi-urban',
    estimatedDelivery: '2024-01-15T14:00:00Z',
    assignedPartner: mockPartners[2],
    costBreakdown: { handlingFee: 2500, packagingFee: 1500, platformFee: 1000, distanceCost: 8500, weightCost: 2000, perishabilityMultiplier: 1.3, roadConditionMultiplier: 1.1, fuelBuffer: 1200, total: 21500, currency: 'XAF' },
    timeline: [
      { id: 'TL-001', status: 'pending', timestamp: '2024-01-14T08:00:00Z', description: 'Order placed', actor: 'System' },
      { id: 'TL-002', status: 'picked-up', timestamp: '2024-01-14T10:30:00Z', description: 'Picked up from vendor', location: 'Bamenda', actor: 'Marie Ngono' },
      { id: 'TL-003', status: 'in-transit', timestamp: '2024-01-14T11:00:00Z', description: 'En route to destination', location: 'National Road N1', actor: 'Marie Ngono' },
    ],
    notes: ['Handle with care - fresh produce', 'Buyer prefers morning delivery'],
    createdAt: '2024-01-14T08:00:00Z',
    updatedAt: '2024-01-14T11:00:00Z',
  },
  {
    id: 'SHP-2024-002',
    orderId: 'ORD-2024-4522',
    vendorId: 'VND-002',
    vendorName: 'Ferme Bio Douala',
    buyerId: 'BYR-002',
    buyerName: 'SuperMarché Central',
    deliveryModel: 'supplier',
    status: 'pending',
    riskLevel: 'low',
    productType: 'non-perishable',
    items: [
      { id: 'ITM-003', name: 'Dried Cassava', quantity: 100, weight: 200, volume: 2, isPerishable: false },
      { id: 'ITM-004', name: 'Palm Oil (5L)', quantity: 20, weight: 100, volume: 0.5, isPerishable: false },
    ],
    pickupLocation: { street: 'Zone Industrielle Bonabéri', city: 'Douala', region: 'Littoral', country: 'Cameroon' },
    deliveryLocation: { street: 'Avenue Kennedy', city: 'Douala', region: 'Littoral', country: 'Cameroon' },
    zone: 'urban',
    estimatedDelivery: '2024-01-16T10:00:00Z',
    costBreakdown: { handlingFee: 3000, packagingFee: 2000, platformFee: 1500, distanceCost: 3500, weightCost: 5000, perishabilityMultiplier: 1.0, roadConditionMultiplier: 1.0, fuelBuffer: 800, total: 15800, currency: 'XAF' },
    timeline: [{ id: 'TL-004', status: 'pending', timestamp: '2024-01-14T14:00:00Z', description: 'Order placed', actor: 'System' }],
    notes: ['Bulk order - requires large vehicle'],
    createdAt: '2024-01-14T14:00:00Z',
    updatedAt: '2024-01-14T14:00:00Z',
  },
  {
    id: 'SHP-2024-003',
    orderId: 'ORD-2024-4523',
    vendorId: 'VND-003',
    vendorName: 'Plantation Mbalmayo',
    buyerId: 'BYR-003',
    buyerName: 'Grossiste Alimentaire SA',
    deliveryModel: 'harvesta',
    status: 'delayed',
    riskLevel: 'high',
    productType: 'perishable',
    items: [
      { id: 'ITM-005', name: 'Fresh Plantains', quantity: 200, weight: 400, volume: 4, isPerishable: true },
      { id: 'ITM-006', name: 'Cocoyam', quantity: 150, weight: 300, volume: 3, isPerishable: true },
    ],
    pickupLocation: { street: 'Route de Mbalmayo', city: 'Mbalmayo', region: 'Centre', country: 'Cameroon' },
    deliveryLocation: { street: 'Marché Mokolo', city: 'Yaoundé', region: 'Centre', country: 'Cameroon' },
    zone: 'rural-accessible',
    estimatedDelivery: '2024-01-14T16:00:00Z',
    assignedPartner: mockPartners[0],
    costBreakdown: { handlingFee: 4000, packagingFee: 2500, platformFee: 2000, distanceCost: 5000, weightCost: 8000, perishabilityMultiplier: 1.4, roadConditionMultiplier: 1.25, fuelBuffer: 1500, total: 34750, currency: 'XAF' },
    timeline: [
      { id: 'TL-005', status: 'pending', timestamp: '2024-01-14T06:00:00Z', description: 'Order placed', actor: 'System' },
      { id: 'TL-006', status: 'picked-up', timestamp: '2024-01-14T08:00:00Z', description: 'Picked up from plantation', location: 'Mbalmayo', actor: 'Jean-Pierre Mbarga' },
      { id: 'TL-007', status: 'delayed', timestamp: '2024-01-14T12:00:00Z', description: 'Road blocked due to rain - detour required', location: 'Route N10', actor: 'System' },
    ],
    notes: ['URGENT: Perishable goods delayed', 'Customer notified of delay'],
    createdAt: '2024-01-14T06:00:00Z',
    updatedAt: '2024-01-14T12:00:00Z',
  },
];

// ============ API FUNCTIONS ============

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchShipments(filters?: { status?: ShipmentStatus; riskLevel?: RiskLevel }): Promise<Shipment[]> {
  await delay(400);
  let results = [...mockShipments];
  if (filters?.status) results = results.filter(s => s.status === filters.status);
  if (filters?.riskLevel) results = results.filter(s => s.riskLevel === filters.riskLevel);
  return results;
}

export async function fetchShipmentById(id: string): Promise<Shipment | null> {
  await delay(300);
  return mockShipments.find(s => s.id === id) || null;
}

export async function fetchPartners(): Promise<LogisticsPartner[]> {
  await delay(350);
  return mockPartners;
}

export async function fetchAdminMetrics(): Promise<AdminMetrics> {
  await delay(400);
  return {
    totalActiveShipments: 47,
    inTransit: 23,
    delivered: 892,
    delayed: 5,
    exceptions: 2,
    onTimeRate: 94,
    topDelayReasons: [
      { reason: 'Weather conditions', count: 12 },
      { reason: 'Road conditions', count: 8 },
      { reason: 'Vehicle breakdown', count: 5 },
      { reason: 'Traffic congestion', count: 4 },
    ],
    regionBreakdown: [
      { region: 'Centre', active: 15, delayed: 2 },
      { region: 'Littoral', active: 12, delayed: 1 },
      { region: 'West', active: 8, delayed: 0 },
      { region: 'Northwest', active: 6, delayed: 1 },
      { region: 'South', active: 4, delayed: 1 },
    ],
  };
}

export async function fetchAlerts(): Promise<Alert[]> {
  await delay(300);
  return [
    { id: 'ALT-001', shipmentId: 'SHP-2024-003', type: 'delay', severity: 'high', message: 'Shipment SHP-2024-003 delayed due to road conditions', createdAt: new Date().toISOString(), isResolved: false },
    { id: 'ALT-002', shipmentId: 'SHP-2024-007', type: 'sla-breach', severity: 'critical', message: 'SLA breach risk for SHP-2024-007 - vehicle breakdown', createdAt: new Date().toISOString(), isResolved: false },
    { id: 'ALT-003', shipmentId: 'SHP-2024-001', type: 'temperature', severity: 'medium', message: 'Temperature fluctuation detected for perishable goods', createdAt: new Date().toISOString(), isResolved: false },
  ];
}

export async function updateShipmentStatus(shipmentId: string, status: ShipmentStatus, notes?: string): Promise<{ success: boolean }> {
  await delay(400);
  console.log('[API] Updating shipment status:', shipmentId, status, notes);
  return { success: true };
}

export async function assignPartner(shipmentId: string, partnerId: string): Promise<{ success: boolean }> {
  await delay(400);
  console.log('[API] Assigning partner:', shipmentId, partnerId);
  return { success: true };
}

export async function resolveAlert(alertId: string): Promise<{ success: boolean }> {
  await delay(300);
  console.log('[API] Resolving alert:', alertId);
  return { success: true };
}

export async function calculateDeliveryCost(params: {
  origin: Location;
  destination: Location;
  weight: number;
  isPerishable: boolean;
}): Promise<CostBreakdown> {
  await delay(500);
  return {
    handlingFee: 2500,
    packagingFee: 1500,
    platformFee: 1000,
    distanceCost: 8500,
    weightCost: params.weight * 100,
    perishabilityMultiplier: params.isPerishable ? 1.3 : 1.0,
    roadConditionMultiplier: 1.1,
    fuelBuffer: 1200,
    total: 21500,
    currency: 'XAF',
  };
}
