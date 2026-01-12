import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser, fetchCurrentAdmin } from '@/lib/api';

interface AdminContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  hasPermission: (module: string, action: 'read' | 'write' | 'approve' | 'override') => boolean;
  hasRegionAccess: (region: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAdmin = async () => {
      try {
        const adminData = await fetchCurrentAdmin();
        setAdmin(adminData);
      } catch (error) {
        console.error('Failed to load admin:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAdmin();
  }, []);

  const hasPermission = (module: string, action: 'read' | 'write' | 'approve' | 'override'): boolean => {
    if (!admin) return false;
    if (admin.role === 'super_admin') return true;
    return admin.permissions.some(
      (perm) => (perm.module === '*' || perm.module === module) && perm.actions.includes(action)
    );
  };

  const hasRegionAccess = (region: string): boolean => {
    if (!admin) return false;
    if (admin.role === 'super_admin') return true;
    if (!admin.region) return true;
    return admin.region === region;
  };

  return (
    <AdminContext.Provider value={{ admin, isLoading, hasPermission, hasRegionAccess }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
