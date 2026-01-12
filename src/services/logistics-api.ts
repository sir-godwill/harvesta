// Logistics Dashboard API Service
// This module provides API endpoints for the logistics dashboard

export interface Shipment {
  id: string;
  trackingNumber: string;
  orderId: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'delayed' | 'failed';
  pickupLocation: {
    address: string;
    city: string;
    region: string;
  };
  deliveryLocation: {
    address: string;
    city: string;
    region: string;
  };
  estimatedDelivery: Date;
  actualDelivery?: Date;
  partnerId: string;
  partnerName: string;
  weight: number;
  notes: string[];
  createdAt: Date;
}

export interface LogisticsPartner {
  id: string;
  name: string;
  logo?: string;
  rating: number;
  onTimeRate: number;
  totalDeliveries: number;
  activeShipments: number;
  coverageRegions: string[];
  isActive: boolean;
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

// Mock Data
const mockShipments: Shipment[] = [
  {
    id: 'ship_a1b2c3d4',
    trackingNumber: 'HRV-2026-001234',
    orderId: 'ord_a1b2c3d4',
    status: 'in_transit',
    pickupLocation: { address: 'Golden Harvest Farm', city: 'Buea', region: 'South-West' },
    deliveryLocation: { address: 'Fresh Foods Warehouse', city: 'Douala', region: 'Littoral' },
    estimatedDelivery: new Date('2026-01-14'),
    partnerId: 'part_001',
    partnerName: 'Swift Logistics',
    weight: 250,
    notes: ['Fragile items', 'Keep cool'],
    createdAt: new Date('2026-01-12'),
  },
  {
    id: 'ship_e5f6g7h8',
    trackingNumber: 'HRV-2026-001235',
    orderId: 'ord_e5f6g7h8',
    status: 'delayed',
    pickupLocation: { address: 'Cameroon Coffee Coop', city: 'Bamenda', region: 'North-West' },
    deliveryLocation: { address: 'Export Hub', city: 'Douala Port', region: 'Littoral' },
    estimatedDelivery: new Date('2026-01-13'),
    partnerId: 'part_002',
    partnerName: 'Trans-Cam Express',
    weight: 500,
    notes: ['Road blockage - weather'],
    createdAt: new Date('2026-01-11'),
  },
  {
    id: 'ship_i9j0k1l2',
    trackingNumber: 'HRV-2026-001236',
    orderId: 'ord_i9j0k1l2',
    status: 'out_for_delivery',
    pickupLocation: { address: 'Spice Valley', city: 'Foumban', region: 'West' },
    deliveryLocation: { address: 'Lagos Spice Traders', city: 'Lagos', region: 'Nigeria' },
    estimatedDelivery: new Date('2026-01-12'),
    partnerId: 'part_003',
    partnerName: 'CrossBorder Freight',
    weight: 150,
    notes: [],
    createdAt: new Date('2026-01-10'),
  },
  {
    id: 'ship_m3n4o5p6',
    trackingNumber: 'HRV-2026-001237',
    orderId: 'ord_m3n4o5p6',
    status: 'pending',
    pickupLocation: { address: 'Organic Farms', city: 'Limbe', region: 'South-West' },
    deliveryLocation: { address: 'Abuja Fresh Market', city: 'Abuja', region: 'Nigeria' },
    estimatedDelivery: new Date('2026-01-16'),
    partnerId: 'part_001',
    partnerName: 'Swift Logistics',
    weight: 400,
    notes: ['Awaiting pickup'],
    createdAt: new Date('2026-01-12'),
  },
];

const mockPartners: LogisticsPartner[] = [
  {
    id: 'part_001',
    name: 'Swift Logistics',
    rating: 4.8,
    onTimeRate: 95,
    totalDeliveries: 1250,
    activeShipments: 45,
    coverageRegions: ['South-West', 'Littoral', 'Centre', 'West'],
    isActive: true,
  },
  {
    id: 'part_002',
    name: 'Trans-Cam Express',
    rating: 4.5,
    onTimeRate: 88,
    totalDeliveries: 890,
    activeShipments: 32,
    coverageRegions: ['North-West', 'West', 'Littoral'],
    isActive: true,
  },
  {
    id: 'part_003',
    name: 'CrossBorder Freight',
    rating: 4.6,
    onTimeRate: 91,
    totalDeliveries: 650,
    activeShipments: 28,
    coverageRegions: ['All Cameroon', 'Nigeria', 'Ghana', 'Gabon'],
    isActive: true,
  },
];

const mockMetrics: LogisticsMetrics = {
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

// API Functions
export async function fetchLogisticsMetrics(): Promise<LogisticsMetrics> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockMetrics;
}

export async function fetchShipments(): Promise<Shipment[]> {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockShipments;
}

export async function fetchShipmentById(id: string): Promise<Shipment | null> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockShipments.find(s => s.id === id) || null;
}

export async function fetchPartners(): Promise<LogisticsPartner[]> {
  await new Promise(resolve => setTimeout(resolve, 350));
  return mockPartners;
}

export async function fetchDelayedShipments(): Promise<Shipment[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockShipments.filter(s => s.status === 'delayed');
}

export async function updateShipmentStatus(
  id: string, 
  status: Shipment['status']
): Promise<Shipment | null> {
  await new Promise(resolve => setTimeout(resolve, 400));
  const shipment = mockShipments.find(s => s.id === id);
  if (shipment) {
    shipment.status = status;
    return shipment;
  }
  return null;
}
