import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PartnerDashboard from "./pages/partner/PartnerDashboard";
import AvailableJobsPage from "./pages/partner/AvailableJobsPage";
import ActiveDeliveriesPage from "./pages/partner/ActiveDeliveriesPage";
import EarningsPage from "./pages/partner/EarningsPage";
import PerformancePage from "./pages/partner/PerformancePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AllShipmentsPage from "./pages/admin/AllShipmentsPage";
import LiveTrackingPage from "./pages/admin/LiveTrackingPage";
import AlertsPage from "./pages/admin/AlertsPage";
import PartnersPage from "./pages/admin/PartnersPage";
import SLARulesPage from "./pages/admin/SLARulesPage";
import ReportsPage from "./pages/admin/ReportsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import DisputesPage from "./pages/admin/DisputesPage";
import CostCalculatorPage from "./pages/admin/CostCalculatorPage";
import IntegrationHubPage from "./pages/admin/IntegrationHubPage";
import ReturnsPage from "./pages/admin/ReturnsPage";
import BuyerPickupPage from "./pages/delivery/BuyerPickupPage";
import OrderDetail from "./pages/order/OrderDetail";
import DeliverySelection from "./pages/delivery/DeliverySelection";
import CustomerTrackingPage from "./pages/tracking/CustomerTrackingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Partner Routes */}
          <Route path="/partner" element={<PartnerDashboard />} />
          <Route path="/partner/jobs" element={<AvailableJobsPage />} />
          <Route path="/partner/active" element={<ActiveDeliveriesPage />} />
          <Route path="/partner/earnings" element={<EarningsPage />} />
          <Route path="/partner/performance" element={<PerformancePage />} />
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/shipments" element={<AllShipmentsPage />} />
          <Route path="/admin/tracking" element={<LiveTrackingPage />} />
          <Route path="/admin/alerts" element={<AlertsPage />} />
          <Route path="/admin/partners" element={<PartnersPage />} />
          <Route path="/admin/sla" element={<SLARulesPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/disputes" element={<DisputesPage />} />
          <Route path="/admin/calculator" element={<CostCalculatorPage />} />
          <Route path="/admin/integrations" element={<IntegrationHubPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="/admin/returns" element={<ReturnsPage />} />
          <Route path="/admin/pickup" element={<BuyerPickupPage />} />
          {/* Order & Delivery Routes */}
          <Route path="/order/:id" element={<OrderDetail />} />
          <Route path="/delivery-selection" element={<DeliverySelection />} />
          {/* Public Tracking */}
          <Route path="/track" element={<CustomerTrackingPage />} />
          <Route path="/track/:id" element={<CustomerTrackingPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
