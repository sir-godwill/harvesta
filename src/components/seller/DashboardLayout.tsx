import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Overview of your business" },
  "/dashboard/products": { title: "Products", subtitle: "Manage your inventory" },
  "/dashboard/orders": { title: "Orders", subtitle: "Track and manage orders" },
  "/dashboard/deliveries": { title: "Deliveries", subtitle: "Manage shipments" },
  "/dashboard/rfq": { title: "RFQ Inbox", subtitle: "Quote requests from buyers" },
  "/dashboard/finance": { title: "Finance", subtitle: "Earnings & withdrawals" },
  "/dashboard/messages": { title: "Messages", subtitle: "Buyer conversations" },
  "/dashboard/analytics": { title: "Analytics", subtitle: "Business insights" },
  "/dashboard/profile": { title: "Profile", subtitle: "Your seller profile" },
  "/dashboard/settings": { title: "Settings", subtitle: "Account settings" },
};

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const currentPage = pageTitles[location.pathname] || { title: "Dashboard" };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Header with Menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-card/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px]">
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-foreground truncate">{currentPage.title}</h1>
            {currentPage.subtitle && (
              <p className="text-xs text-muted-foreground truncate">{currentPage.subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:ml-[260px] transition-all duration-300 pt-14 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
