import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface SupplierProfile {
  id: string;
  is_active: boolean;
  verification_status: string;
  company_name: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  roles: string[];
  supplierProfile: SupplierProfile | null;
  refreshProfile: () => Promise<void>;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isSeller: boolean;
  isLogistics: boolean;
  isAffiliate: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);
  const [supplierProfile, setSupplierProfile] = useState<SupplierProfile | null>(null);

  const fetchUserRolesAndProfile = async (userId: string) => {
    try {
      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (!rolesError && rolesData) {
        setRoles(rolesData.map(r => r.role));
      }

      // Fetch supplier profile
      const { data: supplierData, error: supplierError } = await supabase
        .from('suppliers')
        .select('id, is_active, verification_status, company_name')
        .eq('user_id', userId)
        .maybeSingle();

      if (!supplierError) {
        setSupplierProfile(supplierData);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserRolesAndProfile(user.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserRolesAndProfile(session.user.id);
        } else {
          setRoles([]);
          setSupplierProfile(null);
        }

        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await fetchUserRolesAndProfile(session.user.id);
      }

      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setRoles([]);
    setSupplierProfile(null);
  };

  const isSuperAdmin = roles.includes('super_admin');
  const isAdmin = roles.includes('admin') || isSuperAdmin;
  const isSeller = roles.includes('supplier');
  const isLogistics = roles.includes('logistics_partner');
  const isAffiliate = roles.includes('affiliate');

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      signOut,
      roles,
      supplierProfile,
      refreshProfile,
      isSuperAdmin,
      isAdmin,
      isSeller,
      isLogistics,
      isAffiliate
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
