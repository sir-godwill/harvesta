import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Truck,
  LayoutDashboard,
  Package,
  MapPin,
  Settings,
  Users,
  AlertTriangle,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Wallet,
  TrendingUp,
  Briefcase,
  Play,
  Calculator,
  MessageSquareWarning,
  Plug,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const partnerNavGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/partner", icon: LayoutDashboard },
    ],
  },
  {
    label: "Jobs",
    items: [
      { title: "Available Jobs", url: "/partner/jobs", icon: Briefcase, badge: "3" },
      { title: "Active Deliveries", url: "/partner/active", icon: Play },
    ],
  },
  {
    label: "Performance",
    items: [
      { title: "Earnings", url: "/partner/earnings", icon: Wallet },
      { title: "My Performance", url: "/partner/performance", icon: TrendingUp },
    ],
  },
];

const adminNavGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "All Shipments", url: "/admin/shipments", icon: Package },
      { title: "Live Tracking", url: "/admin/tracking", icon: MapPin },
      { title: "Alerts", url: "/admin/alerts", icon: AlertTriangle, badge: "5" },
      { title: "Disputes", url: "/admin/disputes", icon: MessageSquareWarning, badge: "2" },
      { title: "Returns", url: "/admin/returns", icon: Truck },
      { title: "Buyer Pickup", url: "/admin/pickup", icon: Package },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Partners", url: "/admin/partners", icon: Users },
      { title: "SLA Rules", url: "/admin/sla", icon: FileText },
      { title: "Cost Calculator", url: "/admin/calculator", icon: Calculator },
    ],
  },
  {
    label: "Analytics & Config",
    items: [
      { title: "Reports", url: "/admin/reports", icon: BarChart3 },
      { title: "Integrations", url: "/admin/integrations", icon: Plug },
      { title: "Settings", url: "/admin/settings", icon: Settings },
    ],
  },
];

interface AppSidebarProps {
  variant?: "partner" | "admin";
  isMobile?: boolean;
  onNavigate?: () => void;
}

export function AppSidebar({ variant = "partner", isMobile = false, onNavigate }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navGroups = variant === "admin" ? adminNavGroups : partnerNavGroups;

  // On mobile, sidebar is always expanded
  const isCollapsed = isMobile ? false : collapsed;

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        isMobile ? "w-full" : (isCollapsed ? "w-16" : "w-64")
      )}
    >
      {/* Logo */}
      <div className="flex h-14 md:h-16 items-center justify-between border-b border-sidebar-border px-3 md:px-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-primary">
            <Leaf className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-foreground">Harvestá</span>
              <span className="text-[10px] font-medium text-muted-foreground">
                {variant === "admin" ? "Admin" : "Logistics"}
              </span>
            </div>
          )}
        </div>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 md:h-8 md:w-8 shrink-0"
            onClick={() => setCollapsed(!collapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {navGroups.map((group, groupIndex) => (
          <div key={group.label} className={cn(groupIndex > 0 && "mt-4")}>
            {!isCollapsed && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5 md:space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <NavLink
                    key={item.url}
                    to={item.url}
                    onClick={onNavigate}
                    className={cn(
                      "relative flex items-center gap-3 rounded-lg px-3 py-2 md:py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-accent-foreground">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {isCollapsed && item.badge && (
                      <span className="absolute right-2 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-accent-foreground">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="border-t border-sidebar-border p-3 md:p-4">
          <div className="rounded-lg bg-primary/5 p-2.5 md:p-3">
            <p className="text-xs font-medium text-primary">Need Help?</p>
            <p className="mt-0.5 md:mt-1 text-[10px] text-muted-foreground">
              Contact support for assistance
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}