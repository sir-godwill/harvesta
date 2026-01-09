import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type AddressType = 'billing' | 'shipping' | 'warehouse' | 'office';

export interface Address {
  id: string;
  user_id: string;
  address_type: AddressType;
  label: string | null;
  recipient_name: string | null;
  recipient_phone: string | null;
  country: string;
  region: string | null;
  city: string;
  district: string | null;
  address_line_1: string;
  address_line_2: string | null;
  postal_code: string | null;
  landmark: string | null;
  latitude: number | null;
  longitude: number | null;
  is_default: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export function useAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (!user) {
      setAddresses([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching addresses:', fetchError);
        setError('Failed to load addresses');
      } else {
        setAddresses((data as Address[]) || []);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const addAddress = async (address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: new Error('Not authenticated') };

    // If this is being set as default, unset other defaults first
    if (address.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('address_type', address.address_type as AddressType);
    }

    const { error } = await supabase
      .from('addresses')
      .insert({
        address_line_1: address.address_line_1,
        address_line_2: address.address_line_2,
        address_type: address.address_type as AddressType,
        city: address.city,
        country: address.country,
        district: address.district,
        is_default: address.is_default,
        is_verified: address.is_verified,
        label: address.label,
        landmark: address.landmark,
        latitude: address.latitude,
        longitude: address.longitude,
        postal_code: address.postal_code,
        recipient_name: address.recipient_name,
        recipient_phone: address.recipient_phone,
        region: address.region,
        user_id: user.id,
      });

    if (!error) {
      await fetchAddresses();
    }

    return { error };
  };

  const updateAddress = async (id: string, updates: Partial<Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return { error: new Error('Not authenticated') };

    // If this is being set as default, unset other defaults first
    if (updates.is_default) {
      const currentAddress = addresses.find(a => a.id === id);
      if (currentAddress) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id)
          .eq('address_type', currentAddress.address_type as AddressType)
          .neq('id', id);
      }
    }

    const { error } = await supabase
      .from('addresses')
      .update(updates as Record<string, unknown>)
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) {
      await fetchAddresses();
    }

    return { error };
  };

  const deleteAddress = async (id: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) {
      await fetchAddresses();
    }

    return { error };
  };

  const getDefaultAddress = (type: AddressType = 'shipping') => {
    return addresses.find(a => a.address_type === type && a.is_default) || addresses.find(a => a.address_type === type);
  };

  return {
    addresses,
    isLoading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    getDefaultAddress,
    refreshAddresses: fetchAddresses,
  };
}
