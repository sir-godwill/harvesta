import { ReactNode, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Leaf, LayoutDashboard, Package, MapPin, AlertTriangle, Users, BarChart3, Settings, Truck, Calculator, Plug, Menu, Bell, Search, User, ChevronLeft, ChevronRight, RotateCcw, MessageSquareWarning } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface LogisticsLayoutProps {
  children: ReactNode;
}

const navGroups = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", url: "/logistics", icon: LayoutDashboard }],
  },
  {
    label: "Operations",
    items: [
      { title: "All Shipments", url: "/logistics/shipments", icon: Package },
      { title: "Live Tracking", url: "/logistics/tracking", icon: MapPin },
      { title: "Alerts", url: "/logistics/alerts", icon: AlertTriangle, badge: "5" },
      { title: "Disputes", url: "/logistics/disputes", icon: MessageSquareWarning, badge: "2" },
      { title: "Returns", url: "/logistics/returns", icon: RotateCcw },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Partners", url: "/logistics/partners", icon: Users },
      { title: "Cost Calculator", url: "/logistics/calculator", icon: Calculator },
    ],
  },
  {
    label: "Analytics & Config",
    items: [
      { title: "Reports", url: "/logistics/reports", icon: BarChart3 },
      { title: "Integrations", url: "/logistics/integrations", icon: Plug },
      { title: "Settings", url: "/logistics/settings", icon: Settings },
    ],
  },
];

function Sidebar({ isMobile = false, onNavigate }: { isMobile?: boolean; onNavigate?: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isCollapsed = isMobile ? false : collapsed;

  return (
    <aside className={cn("flex h-full flex-col border-r bg-card transition-all duration-300", isMobile ? "w-full" : isCollapsed ? "w-16" : "w-64")}>
      <div className="flex h-14 md:h-16 items-center justify-between border-b px-3 md:px-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold">Harvestá</span>
              <span className="text-[10px] font-medium text-muted-foreground">Logistics</span>
            </div>
          )}
        </div>
        {!isMobile && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCollapsed(!collapsed)}>
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {navGroups.map((group, groupIndex) => (
          <div key={group.label} className={cn(groupIndex > 0 && "mt-4")}>
            {!isCollapsed && <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{group.label}</p>}
            <div className="space-y-0.5 md:space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <NavLink key={item.url} to={item.url} onClick={onNavigate} className={cn("relative flex items-center gap-3 rounded-lg px-3 py-2 md:py-2.5 text-sm font-medium transition-colors", isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                    <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item.badge && <Badge variant="secondary" className="text-[10px]">{item.badge}</Badge>}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export function LogisticsLayout({ children }: LogisticsLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="hidden lg:block"><Sidebar /></div>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0"><Sidebar isMobile onNavigate={() => setMobileOpen(false)} /></SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-14 md:h-16 shrink-0 items-center justify-between border-b bg-card px-3 md:px-6 gap-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu className="h-5 w-5" /></Button>
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search shipments..." className="w-48 xl:w-64 pl-9 text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge variant="destructive" className="absolute -right-0.5 -top-0.5 h-4 min-w-4 justify-center px-1 text-[9px]">3</Badge>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-1.5"><Avatar className="h-7 w-7"><AvatarFallback className="bg-primary text-primary-foreground text-xs">AD</AvatarFallback></Avatar></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
