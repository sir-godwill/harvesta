import { Link } from 'react-router-dom';
import { 
  Shield, 
  Store, 
  Truck, 
  Users, 
  ChevronRight,
  Lock,
  LucideIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserRole, AppRole } from '@/hooks/useUserRole';
import { cn } from '@/lib/utils';

interface DashboardLink {
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
  requiredRoles: AppRole[];
  color: string;
}

const dashboardLinks: DashboardLink[] = [
  {
    title: 'Admin Dashboard',
    description: 'Manage platform, users, and settings',
    path: '/admin',
    icon: Shield,
    requiredRoles: ['admin'],
    color: 'bg-red-500',
  },
  {
    title: 'Seller Dashboard',
    description: 'Manage products, orders, and analytics',
    path: '/seller',
    icon: Store,
    requiredRoles: ['supplier', 'admin'],
    color: 'bg-green-600',
  },
  {
    title: 'Logistics Dashboard',
    description: 'Track shipments and manage deliveries',
    path: '/logistics',
    icon: Truck,
    requiredRoles: ['logistics_partner', 'admin'],
    color: 'bg-blue-600',
  },
  {
    title: 'Affiliate Dashboard',
    description: 'Track referrals and commissions',
    path: '/affiliate',
    icon: Users,
    requiredRoles: ['buyer_individual', 'buyer_business', 'supplier', 'admin'],
    color: 'bg-purple-600',
  },
];

export function DashboardAccessCard() {
  const { role, isLoading, isAdmin } = useUserRole();

  const hasAccess = (requiredRoles: AppRole[]) => {
    if (!role) return false;
    if (isAdmin) return true; // Admin has access to all dashboards
    return requiredRoles.includes(role);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Access</CardTitle>
          <CardDescription>Loading your access permissions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const accessibleDashboards = dashboardLinks.filter(d => hasAccess(d.requiredRoles));
  const lockedDashboards = dashboardLinks.filter(d => !hasAccess(d.requiredRoles));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Dashboard Access
        </CardTitle>
        <CardDescription>
          Access your authorized dashboards based on your role
          {role && (
            <Badge variant="secondary" className="ml-2 capitalize">
              {role.replace('_', ' ')}
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Accessible Dashboards */}
        {accessibleDashboards.map((dashboard) => (
          <Link key={dashboard.path} to={dashboard.path}>
            <div className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group">
              <div className={cn('p-2.5 rounded-lg', dashboard.color)}>
                <dashboard.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm group-hover:text-primary transition-colors">
                  {dashboard.title}
                </p>
                <p className="text-xs text-muted-foreground">{dashboard.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Link>
        ))}

        {/* Locked Dashboards */}
        {lockedDashboards.length > 0 && (
          <>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider pt-2">
              Upgrade to Access
            </div>
            {lockedDashboards.map((dashboard) => (
              <div 
                key={dashboard.path} 
                className="flex items-center gap-4 p-3 rounded-lg border border-dashed opacity-50"
              >
                <div className="p-2.5 rounded-lg bg-muted">
                  <dashboard.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-muted-foreground">
                    {dashboard.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{dashboard.description}</p>
                </div>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </>
        )}

        {accessibleDashboards.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No additional dashboards available for your current role.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
