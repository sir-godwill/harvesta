import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator' | 'support';
  avatar?: string;
  region?: string;
  permissions: {
    module: string;
    actions: ('read' | 'write' | 'approve' | 'override')[];
  }[];
}

interface AdminContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  hasPermission: (module: string, action: 'read' | 'write' | 'approve' | 'override') => boolean;
  hasRegionAccess: (region: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Mock admin data for development
const mockAdmin: AdminUser = {
  id: 'admin-001',
  name: 'Admin User',
  email: 'admin@harvesta.com',
  role: 'super_admin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  permissions: [
    { module: '*', actions: ['read', 'write', 'approve', 'override'] }
  ]
};

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin] = useState<AdminUser | null>(mockAdmin);
  const [isLoading] = useState(false);

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
