import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicRoute from "@/components/auth/PublicRoute";
import Layout from "@/components/layout/Layout";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";

// Dashboard Pages
import BuyerDashboard from "./pages/dashboard/BuyerDashboard";
import BuyerProfile from "./pages/dashboard/BuyerProfile";
import OrderList from "./pages/dashboard/OrderList";
import OrderDetails from "./pages/dashboard/OrderDetails";
import OrderConfirmation from "./pages/dashboard/OrderConfirmation";
import SavedProducts from "./pages/dashboard/SavedProducts";
import SavedSuppliers from "./pages/dashboard/SavedSuppliers";

// Marketplace Pages
import Cart from "./pages/marketplace/Cart";
import Checkout from "./pages/marketplace/Checkout";
import RFQ from "./pages/marketplace/RFQ";
import OrderTracking from "./pages/marketplace/OrderTracking";
import Search from "./pages/marketplace/Search";
import SupplierProfile from "./pages/marketplace/SupplierProfile";

// Info Pages
import About from "./pages/info/About";
import Contact from "./pages/info/Contact";
import FAQ from "./pages/info/FAQ";
import HelpCenter from "./pages/info/HelpCenter";
import Terms from "./pages/info/Terms";
import Privacy from "./pages/info/Privacy";
import Refunds from "./pages/info/Refunds";
import BuyerProtection from "./pages/info/BuyerProtection";
import TrustSafety from "./pages/info/TrustSafety";

// Admin Pages
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSellers from "./pages/admin/AdminSellers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminLogistics from "./pages/admin/AdminLogistics";
import AdminBuyers from "./pages/admin/AdminBuyers";
import AdminDisputes from "./pages/admin/AdminDisputes";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminMarketing from "./pages/admin/AdminMarketing";
import AdminSettings from "./pages/admin/AdminSettings";

// Logistics Pages
import { LogisticsLayout } from "@/components/logistics/LogisticsLayout";
import LogisticsDashboard from "./pages/logistics/LogisticsDashboard";
import LogisticsShipments from "./pages/logistics/LogisticsShipments";
import LogisticsTracking from "./pages/logistics/LogisticsTracking";
import LogisticsPartners from "./pages/logistics/LogisticsPartners";
import LogisticsReports from "./pages/logistics/LogisticsReports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Admin Routes - Outside main Layout */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout><AdminDashboard /></AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/sellers" element={
                <ProtectedRoute>
                  <AdminLayout><AdminSellers /></AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/sellers/*" element={
                <ProtectedRoute>
                  <AdminLayout><AdminSellers /></AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <ProtectedRoute>
                  <AdminLayout><AdminProducts /></AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/products/*" element={
                <ProtectedRoute>
                  <AdminLayout><AdminProducts /></AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute>
                  <AdminLayout><AdminOrders /></AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/orders/*" element={
                <ProtectedRoute>
                  <AdminLayout><AdminOrders /></AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute>
                  <AdminLayout><AdminAnalytics /></AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/analytics/*" element={
                <ProtectedRoute>
                  <AdminLayout><AdminAnalytics /></AdminLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/buyers" element={<ProtectedRoute><AdminLayout><AdminBuyers /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/disputes" element={<ProtectedRoute><AdminLayout><AdminDisputes /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/payments" element={<ProtectedRoute><AdminLayout><AdminPayments /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/marketing" element={<ProtectedRoute><AdminLayout><AdminMarketing /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/logistics" element={<ProtectedRoute><AdminLayout><AdminLogistics /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/*" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />

              {/* Logistics Routes */}
              <Route path="/logistics" element={<ProtectedRoute><LogisticsLayout><LogisticsDashboard /></LogisticsLayout></ProtectedRoute>} />
              <Route path="/logistics/shipments" element={<ProtectedRoute><LogisticsLayout><LogisticsShipments /></LogisticsLayout></ProtectedRoute>} />
              <Route path="/logistics/tracking" element={<ProtectedRoute><LogisticsLayout><LogisticsTracking /></LogisticsLayout></ProtectedRoute>} />
              <Route path="/logistics/partners" element={<ProtectedRoute><LogisticsLayout><LogisticsPartners /></LogisticsLayout></ProtectedRoute>} />
              <Route path="/logistics/reports" element={<ProtectedRoute><LogisticsLayout><LogisticsReports /></LogisticsLayout></ProtectedRoute>} />
              <Route path="/logistics/*" element={<ProtectedRoute><LogisticsLayout><LogisticsDashboard /></LogisticsLayout></ProtectedRoute>} />

              {/* Main Layout Routes */}
              <Route path="/*" element={
                <Layout>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/supplier/:supplierId" element={<SupplierProfile />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/help" element={<HelpCenter />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/refunds" element={<Refunds />} />
                    <Route path="/buyer-protection" element={<BuyerProtection />} />
                    <Route path="/trust-safety" element={<TrustSafety />} />

                    {/* Auth Routes (redirect if logged in) */}
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                    <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />

                    {/* Protected Routes (require authentication) */}
                    <Route path="/dashboard" element={<ProtectedRoute><BuyerDashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><BuyerProfile /></ProtectedRoute>} />
                    <Route path="/orders" element={<ProtectedRoute><OrderList /></ProtectedRoute>} />
                    <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
                    <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
                    <Route path="/saved-products" element={<ProtectedRoute><SavedProducts /></ProtectedRoute>} />
                    <Route path="/saved-suppliers" element={<ProtectedRoute><SavedSuppliers /></ProtectedRoute>} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/rfq" element={<ProtectedRoute><RFQ /></ProtectedRoute>} />
                    <Route path="/track/:orderId" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              } />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
