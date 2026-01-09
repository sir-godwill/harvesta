import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type AppRole = 'buyer_individual' | 'buyer_business' | 'supplier' | 'admin' | 'logistics_partner';

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      if (!user) {
        setRole(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole(null);
        } else {
          setRole(data?.role as AppRole || null);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRole();
  }, [user]);

  const isBuyer = role === 'buyer_individual' || role === 'buyer_business';
  const isSupplier = role === 'supplier';
  const isAdmin = role === 'admin';
  const isLogisticsPartner = role === 'logistics_partner';

  return {
    role,
    isLoading,
    isBuyer,
    isSupplier,
    isAdmin,
    isLogisticsPartner,
  };
}
