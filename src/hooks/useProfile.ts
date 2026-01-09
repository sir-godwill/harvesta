import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type UserStatus = 'active' | 'suspended' | 'pending_verification' | 'inactive';
export type BuyerType = 'individual' | 'business' | 'cooperative' | 'government';
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'expired';

export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  avatar_url: string | null;
  status: UserStatus;
  preferred_language: string;
  preferred_currency: string;
  email_verified: boolean;
  phone_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface BuyerProfile {
  id: string;
  user_id: string;
  business_name: string | null;
  business_registration_number: string | null;
  tax_id: string | null;
  buyer_type: BuyerType;
  verification_status: VerificationStatus;
  verified_at: string | null;
  default_currency: string;
  credit_limit: number;
  payment_terms_days: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setBuyerProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch both profiles in parallel
      const [profileResult, buyerProfileResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single(),
        supabase
          .from('buyer_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single(),
      ]);

      if (profileResult.error) {
        console.error('Error fetching profile:', profileResult.error);
        setError('Failed to load profile');
      } else {
        setProfile(profileResult.data as Profile);
      }

      if (buyerProfileResult.error) {
        console.error('Error fetching buyer profile:', buyerProfileResult.error);
      } else {
        setBuyerProfile(buyerProfileResult.data as BuyerProfile);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('profiles')
      .update(updates as Record<string, unknown>)
      .eq('id', user.id);

    if (!error) {
      await fetchProfile();
    }

    return { error };
  };

  const updateBuyerProfile = async (updates: Partial<Omit<BuyerProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('buyer_profiles')
      .update(updates as Record<string, unknown>)
      .eq('user_id', user.id);

    if (!error) {
      await fetchProfile();
    }

    return { error };
  };

  return {
    profile,
    buyerProfile,
    isLoading,
    error,
    updateProfile,
    updateBuyerProfile,
    refreshProfile: fetchProfile,
  };
}
