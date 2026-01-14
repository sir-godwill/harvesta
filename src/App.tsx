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
import Messages from "./pages/Messages";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import SellerRegister from "./pages/seller/SellerRegister";
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
import Sellers from "./pages/marketplace/Sellers";

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
import AdminCompliance from "./pages/admin/AdminCompliance";
// Admin Sub-pages
import SellerApplications from "./pages/admin/sellers/SellerApplications";
import SellerCommissions from "./pages/admin/sellers/SellerCommissions";
import SellerVerification from "./pages/admin/sellers/SellerVerification";
import AdminCarriers from "./pages/admin/logistics/AdminCarriers";
import AdminZones from "./pages/admin/logistics/AdminZones";
import AdminCategories from "./pages/admin/products/AdminCategories";
import AdminPendingProducts from "./pages/admin/products/AdminPendingProducts";
import AdminPendingOrders from "./pages/admin/orders/AdminPendingOrders";
import AdminReturns from "./pages/admin/orders/AdminReturns";
import AdminProductAdd from "./pages/admin/AdminProductAdd";

// Logistics Pages
import { LogisticsLayout } from "@/components/logistics/LogisticsLayout";
import LogisticsDashboard from "./pages/logistics/LogisticsDashboard";
import LogisticsShipments from "./pages/logistics/LogisticsShipments";
import LogisticsTracking from "./pages/logistics/LogisticsTracking";
import LogisticsPartners from "./pages/logistics/LogisticsPartners";
import LogisticsReports from "./pages/logistics/LogisticsReports";
import LogisticsAlerts from "./pages/logistics/LogisticsAlerts";
import LogisticsDisputes from "./pages/logistics/LogisticsDisputes";
import LogisticsReturns from "./pages/logistics/LogisticsReturns";
import LogisticsCalculator from "./pages/logistics/LogisticsCalculator";
import LogisticsIntegrations from "./pages/logistics/LogisticsIntegrations";
import LogisticsSettings from "./pages/logistics/LogisticsSettings";

// Seller Pages
import { SellerLayout } from "@/components/seller/SellerLayout";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerProductAdd from "./pages/seller/SellerProductAdd";
import SellerProductEdit from "./pages/seller/SellerProductEdit";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerAnalytics from "./pages/seller/SellerAnalytics";
import SellerLogistics from "./pages/seller/SellerLogistics";
import SellerCarriers from "./pages/seller/SellerCarriers";
import SellerMessages from "./pages/seller/SellerMessages";
import SellerRFQs from "./pages/seller/SellerRFQs";
import SellerSettings from "./pages/seller/SellerSettings";
import SellerFinance from "./pages/seller/SellerFinance";
import SellerInventory from "./pages/seller/SellerInventory";
import SellerOnboarding from "./pages/seller/SellerOnboarding";
import SellerProfile from "./pages/seller/SellerProfile";

// Affiliate Pages
import { AffiliateLayout } from "@/components/affiliate/AffiliateLayout";
import AffiliateDashboard from "./pages/affiliate/AffiliateDashboard";
import AffiliateOnboarding from "./pages/affiliate/AffiliateOnboarding";
import AffiliateReferrals from "./pages/affiliate/AffiliateReferrals";
import AffiliateSellers from "./pages/affiliate/AffiliateSellers";
import AffiliateCommissions from "./pages/affiliate/AffiliateCommissions";
import AffiliateCampaigns from "./pages/affiliate/AffiliateCampaigns";
import AffiliateAnalytics from "./pages/affiliate/AffiliateAnalytics";
import AffiliatePayouts from "./pages/affiliate/AffiliatePayouts";
import AffiliateSettings from "./pages/affiliate/AffiliateSettings";

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
              {/* Messages Route - Outside Layout */}
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

              {/* Admin Routes - Outside main Layout */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/sellers" element={<ProtectedRoute><AdminLayout><AdminSellers /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/sellers/applications" element={<ProtectedRoute><AdminLayout><SellerApplications /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/sellers/commissions" element={<ProtectedRoute><AdminLayout><SellerCommissions /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/sellers/verification" element={<ProtectedRoute><AdminLayout><SellerVerification /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute><AdminLayout><AdminProducts /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/products/add" element={<ProtectedRoute><AdminLayout><AdminProductAdd /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/products/edit/:id" element={<ProtectedRoute><AdminLayout><AdminProductAdd /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/products/categories" element={<ProtectedRoute><AdminLayout><AdminCategories /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/products/pending" element={<ProtectedRoute><AdminLayout><AdminPendingProducts /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/orders" element={<ProtectedRoute><AdminLayout><AdminOrders /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/orders/pending" element={<ProtectedRoute><AdminLayout><AdminPendingOrders /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/orders/returns" element={<ProtectedRoute><AdminLayout><AdminReturns /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute><AdminLayout><AdminAnalytics /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/buyers" element={<ProtectedRoute><AdminLayout><AdminBuyers /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/disputes" element={<ProtectedRoute><AdminLayout><AdminDisputes /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/payments" element={<ProtectedRoute><AdminLayout><AdminPayments /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/marketing" element={<ProtectedRoute><AdminLayout><AdminMarketing /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/compliance" element={<ProtectedRoute><AdminLayout><AdminCompliance /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/logistics" element={<ProtectedRoute><AdminLayout><AdminLogistics /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/logistics/carriers" element={<ProtectedRoute><AdminLayout><AdminCarriers /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/logistics/zones" element={<ProtectedRoute><AdminLayout><AdminZones /></AdminLayout></ProtectedRoute>} />
              <Route path="/admin/*" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />

              {/* Logistics Routes - With LogisticsLayout */}
              <Route path="/logistics" element={<ProtectedRoute><LogisticsLayout><LogisticsDashboard /></LogisticsLayout></ProtectedRoute>} />
              <Route path="/logistics/shipments" element={<ProtectedRoute><LogisticsLayout><LogisticsShipments /></LogisticsLayout></ProtectedRoute>} />
              <Route path="/logistics/tracking" element={<ProtectedRoute><LogisticsLayout><LogisticsTracking /></LogisticsLayout></ProtectedRoute>} />
              <Route path="/logistics/partners" element={<ProtectedRoute><LogisticsLayout><LogisticsPartners /></LogisticsLayout></ProtectedRoute>} />
              <Route path="/logistics/reports" element={<ProtectedRoute><LogisticsLayout><LogisticsReports /></LogisticsLayout></ProtectedRoute>} />
              <Route path="/logistics/alerts" element={<ProtectedRoute><LogisticsLayout><LogisticsAlerts /></LogisticsLayout></ProtectedRoute>} />
              <Route path="/logistics/disputes" element={<ProtectedRoute><LogisticsLayout><LogisticsDisputes /></LogisticsLayout></ProtectedRoute>} />
              <Route path="/logistics/returns" element={<ProtectedRoute><LogisticsLayout><LogisticsReturns /></LogisticsLayout></ProtectedRoute>} />
              <Route path="/logistics/calculator" element={<ProtectedRoute><LogisticsLayout><LogisticsCalculator /></LogisticsLayout></ProtectedRoute>} />
              <Route path="/logistics/integrations" element={<ProtectedRoute><LogisticsLayout><LogisticsIntegrations /></LogisticsLayout></ProtectedRoute>} />
              <Route path="/logistics/settings" element={<ProtectedRoute><LogisticsLayout><LogisticsSettings /></LogisticsLayout></ProtectedRoute>} />
              <Route path="/logistics/*" element={<ProtectedRoute><LogisticsLayout><LogisticsDashboard /></LogisticsLayout></ProtectedRoute>} />

              {/* Seller Routes - SellerLayout is already inside pages */}
              <Route path="/seller" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
              <Route path="/seller/onboarding" element={<ProtectedRoute><SellerOnboarding /></ProtectedRoute>} />
              <Route path="/seller/products" element={<ProtectedRoute><SellerProducts /></ProtectedRoute>} />
              <Route path="/seller/products/add" element={<ProtectedRoute><SellerProductAdd /></ProtectedRoute>} />
              <Route path="/seller/products/edit/:id" element={<ProtectedRoute><SellerProductEdit /></ProtectedRoute>} />
              <Route path="/seller/inventory" element={<ProtectedRoute><SellerInventory /></ProtectedRoute>} />
              <Route path="/seller/orders" element={<ProtectedRoute><SellerOrders /></ProtectedRoute>} />
              <Route path="/seller/finance" element={<ProtectedRoute><SellerFinance /></ProtectedRoute>} />
              <Route path="/seller/analytics" element={<ProtectedRoute><SellerAnalytics /></ProtectedRoute>} />
              <Route path="/seller/logistics" element={<ProtectedRoute><SellerLogistics /></ProtectedRoute>} />
              <Route path="/seller/logistics/carriers" element={<ProtectedRoute><SellerCarriers /></ProtectedRoute>} />
              <Route path="/seller/carriers" element={<ProtectedRoute><SellerCarriers /></ProtectedRoute>} />
              <Route path="/seller/messages" element={<ProtectedRoute><SellerMessages /></ProtectedRoute>} />
              <Route path="/seller/rfqs" element={<ProtectedRoute><SellerRFQs /></ProtectedRoute>} />
              <Route path="/seller/profile" element={<ProtectedRoute><SellerProfile /></ProtectedRoute>} />
              <Route path="/seller/settings" element={<ProtectedRoute><SellerSettings /></ProtectedRoute>} />
              <Route path="/seller/*" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />

              {/* Affiliate Routes - With AffiliateLayout */}
              <Route path="/affiliate" element={<ProtectedRoute><AffiliateLayout><AffiliateDashboard /></AffiliateLayout></ProtectedRoute>} />
              <Route path="/affiliate/onboarding" element={<ProtectedRoute><AffiliateLayout><AffiliateOnboarding /></AffiliateLayout></ProtectedRoute>} />
              <Route path="/affiliate/referrals" element={<ProtectedRoute><AffiliateLayout><AffiliateReferrals /></AffiliateLayout></ProtectedRoute>} />
              <Route path="/affiliate/sellers" element={<ProtectedRoute><AffiliateLayout><AffiliateSellers /></AffiliateLayout></ProtectedRoute>} />
              <Route path="/affiliate/commissions" element={<ProtectedRoute><AffiliateLayout><AffiliateCommissions /></AffiliateLayout></ProtectedRoute>} />
              <Route path="/affiliate/campaigns" element={<ProtectedRoute><AffiliateLayout><AffiliateCampaigns /></AffiliateLayout></ProtectedRoute>} />
              <Route path="/affiliate/analytics" element={<ProtectedRoute><AffiliateLayout><AffiliateAnalytics /></AffiliateLayout></ProtectedRoute>} />
              <Route path="/affiliate/payouts" element={<ProtectedRoute><AffiliateLayout><AffiliatePayouts /></AffiliateLayout></ProtectedRoute>} />
              <Route path="/affiliate/settings" element={<ProtectedRoute><AffiliateLayout><AffiliateSettings /></AffiliateLayout></ProtectedRoute>} />
              <Route path="/affiliate/*" element={<ProtectedRoute><AffiliateLayout><AffiliateDashboard /></AffiliateLayout></ProtectedRoute>} />

              <Route path="/*" element={
                <Layout>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/supplier/:supplierId" element={<SupplierProfile />} />
                    <Route path="/sellers" element={<Sellers />} />
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
                    <Route path="/register/seller" element={<PublicRoute><SellerRegister /></PublicRoute>} />
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
