import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string[];
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const {
    user,
    isLoading,
    roles,
    supplierProfile,
    isSuperAdmin,
    isAdmin,
    isSeller,
    isLogistics,
    isAffiliate
  } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Super Admin can bypass everything EXCEPT blocked status (if we add that)
  if (isSuperAdmin) return <>{children}</>;

  // Admin Route Protection
  if (location.pathname.startsWith('/admin')) {
    if (!isAdmin) return <Navigate to="/" replace />;
  }

  // Seller Dashboard Protection
  if (location.pathname.startsWith('/seller')) {
    if (location.pathname === '/seller/onboarding') return <>{children}</>;

    if (!isSeller || !supplierProfile || !supplierProfile.is_active) {
      return supplierProfile ? <Navigate to="/seller/onboarding" replace /> : <Navigate to="/register/seller" replace />;
    }
  }

  // Logistics Dashboard Protection
  if (location.pathname.startsWith('/logistics')) {
    if (!isLogistics) return <Navigate to="/" replace />;
  }

  // Affiliate Dashboard Protection
  if (location.pathname.startsWith('/affiliate')) {
    if (!isAffiliate) return <Navigate to="/" replace />;
  }

  // Generic Role Check (if passed as prop)
  if (requiredRole && !requiredRole.some(r => roles.includes(r))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
