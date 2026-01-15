import { supabase } from '@/integrations/supabase/client';

// =====================================================
// TYPES
// =====================================================

export interface LogisticsPartner {
  id: string;
  user_id: string;
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  operating_regions: string[];
  vehicle_types: string[];
  capacity_kg: number;
  license_number?: string;
  documents: any[];
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  rejection_reason?: string;
  performance_score: number;
  total_deliveries: number;
  successful_deliveries: number;
  failed_deliveries: number;
  average_delivery_time?: number;
  created_at: string;
  updated_at: string;
}

export interface Delivery {
  id: string;
  order_id: string;
  logistics_partner_id?: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed' | 'cancelled';
  pickup_address: any;
  delivery_address: any;
  pickup_time?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  tracking_number: string;
  notes?: string;
  failure_reason?: string;
  proof_of_delivery?: any;
  distance_km?: number;
  delivery_fee?: number;
  created_at: string;
  updated_at: string;
}

export interface DeliveryTracking {
  id: string;
  delivery_id: string;
  status: string;
  location?: any;
  notes?: string;
  created_at: string;
}

export interface LogisticsVehicle {
  id: string;
  logistics_partner_id: string;
  vehicle_type: string;
  registration_number: string;
  capacity_kg: number;
  status: 'active' | 'maintenance' | 'inactive';
  current_location?: any;
  created_at: string;
  updated_at: string;
}

// =====================================================
// LOGISTICS PARTNER OPERATIONS
// =====================================================

/**
 * Apply as logistics partner
 */
export async function applyAsLogisticsPartner(data: {
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  operating_regions: string[];
  vehicle_types: string[];
  capacity_kg: number;
  license_number?: string;
  documents?: any[];
}): Promise<{ data: LogisticsPartner | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: application, error } = await supabase
      .from('logistics_partners')
      .insert({
        user_id: user.id,
        ...data,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return { data: application, error: null };
  } catch (error) {
    console.error('Error applying as logistics partner:', error);
    return { data: null, error };
  }
}

/**
 * Get logistics partner profile
 */
export async function getLogisticsProfile(): Promise<{ data: LogisticsPartner | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('logistics_partners')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching logistics profile:', error);
    return { data: null, error };
  }
}

/**
 * Get assigned deliveries for logistics partner
 */
export async function getAssignedDeliveries(
  filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }
): Promise<{ data: Delivery[] | null; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: partner } = await getLogisticsProfile();
    if (!partner) throw new Error('Not a logistics partner');

    let query = supabase
      .from('deliveries')
      .select('*, order:orders(*)')
      .eq('logistics_partner_id', partner.id);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    query = query.order('created_at', { ascending: false });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching assigned deliveries:', error);
    return { data: null, error };
  }
}

/**
 * Update delivery status
 */
export async function updateDeliveryStatus(
  deliveryId: string,
  status: Delivery['status'],
  notes?: string,
  location?: any
): Promise<{ data: Delivery | null; error: any }> {
  try {
    const updates: any = { status };

    if (status === 'picked_up' && !updates.pickup_time) {
      updates.pickup_time = new Date().toISOString();
    }

    if (status === 'delivered') {
      updates.actual_delivery = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('deliveries')
      .update(updates)
      .eq('id', deliveryId)
      .select()
      .single();

    if (error) throw error;

    // Add tracking entry with location if provided
    if (location) {
      await supabase
        .from('delivery_tracking')
        .insert({
          delivery_id: deliveryId,
          status,
          location,
          notes
        });
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error updating delivery status:', error);
    return { data: null, error };
  }
}

/**
 * Get delivery tracking history
 */
export async function getDeliveryTracking(deliveryId: string): Promise<{ data: DeliveryTracking[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('delivery_tracking')
      .select('*')
      .eq('delivery_id', deliveryId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching delivery tracking:', error);
    return { data: null, error };
  }
}

/**
 * Upload proof of delivery
 */
export async function uploadProofOfDelivery(
  deliveryId: string,
  proofData: any
): Promise<{ data: Delivery | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('deliveries')
      .update({
        proof_of_delivery: proofData,
        status: 'delivered',
        actual_delivery: new Date().toISOString()
      })
      .eq('id', deliveryId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error uploading proof of delivery:', error);
    return { data: null, error };
  }
}

/**
 * Report delivery issue
 */
export async function reportDeliveryIssue(
  deliveryId: string,
  disputeType: string,
  description: string
): Promise<{ data: any; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('logistics_disputes')
      .insert({
        delivery_id: deliveryId,
        reported_by: user.id,
        dispute_type: disputeType,
        description,
        status: 'open'
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error reporting delivery issue:', error);
    return { data: null, error };
  }
}

/**
 * Get vehicles for logistics partner
 */
export async function getVehicles(): Promise<{ data: LogisticsVehicle[] | null; error: any }> {
  try {
    const { data: partner } = await getLogisticsProfile();
    if (!partner) throw new Error('Not a logistics partner');

    const { data, error } = await supabase
      .from('logistics_vehicles')
      .select('*')
      .eq('logistics_partner_id', partner.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return { data: null, error };
  }
}

/**
 * Add vehicle
 */
export async function addVehicle(vehicleData: {
  vehicle_type: string;
  registration_number: string;
  capacity_kg: number;
}): Promise<{ data: LogisticsVehicle | null; error: any }> {
  try {
    const { data: partner } = await getLogisticsProfile();
    if (!partner) throw new Error('Not a logistics partner');

    const { data, error } = await supabase
      .from('logistics_vehicles')
      .insert({
        logistics_partner_id: partner.id,
        ...vehicleData,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error adding vehicle:', error);
    return { data: null, error };
  }
}

// =====================================================
// ADMIN OPERATIONS
// =====================================================

/**
 * Get all logistics partners (admin only)
 */
export async function getAllLogisticsPartners(
  filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }
): Promise<{ data: LogisticsPartner[] | null; error: any }> {
  try {
    let query = supabase
      .from('logistics_partners')
      .select('*, user:user_profiles(*)');

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    query = query.order('created_at', { ascending: false });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching all logistics partners:', error);
    return { data: null, error };
  }
}

/**
 * Approve logistics partner (admin only)
 */
export async function approveLogisticsPartner(partnerId: string): Promise<{ data: any; error: any }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('logistics_partners')
      .update({
        status: 'approved',
        approved_by: user.id,
        approved_at: new Date().toISOString()
      })
      .eq('id', partnerId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error approving logistics partner:', error);
    return { data: null, error };
  }
}

/**
 * Reject logistics partner (admin only)
 */
export async function rejectLogisticsPartner(
  partnerId: string,
  reason: string
): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await supabase
      .from('logistics_partners')
      .update({
        status: 'rejected',
        rejection_reason: reason
      })
      .eq('id', partnerId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error rejecting logistics partner:', error);
    return { data: null, error };
  }
}

/**
 * Suspend logistics partner (admin only)
 */
export async function suspendLogisticsPartner(
  partnerId: string,
  reason: string
): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await supabase
      .from('logistics_partners')
      .update({
        status: 'suspended',
        rejection_reason: reason
      })
      .eq('id', partnerId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error suspending logistics partner:', error);
    return { data: null, error };
  }
}

/**
 * Assign delivery to logistics partner (admin only)
 */
export async function assignDeliveryToPartner(
  deliveryId: string,
  partnerId: string
): Promise<{ data: Delivery | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('deliveries')
      .update({
        logistics_partner_id: partnerId,
        status: 'assigned'
      })
      .eq('id', deliveryId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error assigning delivery:', error);
    return { data: null, error };
  }
}

/**
 * Get logistics analytics (admin only)
 */
export async function getLogisticsAnalytics(): Promise<{ data: any; error: any }> {
  try {
    const { data: partners } = await supabase
      .from('logistics_partners')
      .select('*');

    const { data: deliveries } = await supabase
      .from('deliveries')
      .select('*');

    const { data: disputes } = await supabase
      .from('logistics_disputes')
      .select('*');

    const analytics = {
      totalPartners: partners?.length || 0,
      activePartners: partners?.filter(p => p.status === 'approved').length || 0,
      pendingApplications: partners?.filter(p => p.status === 'pending').length || 0,
      totalDeliveries: deliveries?.length || 0,
      completedDeliveries: deliveries?.filter(d => d.status === 'delivered').length || 0,
      failedDeliveries: deliveries?.filter(d => d.status === 'failed').length || 0,
      activeDeliveries: deliveries?.filter(d => ['assigned', 'picked_up', 'in_transit'].includes(d.status)).length || 0,
      openDisputes: disputes?.filter(d => d.status === 'open').length || 0,
      averageDeliveryTime: partners?.reduce((sum, p) => sum + (p.average_delivery_time || 0), 0) / (partners?.length || 1),
    };

    return { data: analytics, error: null };
  } catch (error) {
    console.error('Error fetching logistics analytics:', error);
    return { data: null, error };
  }
}

/**
 * Get delivery by tracking number
 */
export async function getDeliveryByTracking(trackingNumber: string): Promise<{ data: Delivery | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('deliveries')
      .select('*, order:orders(*), logistics_partner:logistics_partners(*)')
      .eq('tracking_number', trackingNumber)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching delivery by tracking:', error);
    return { data: null, error };
  }
}
