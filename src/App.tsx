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
import AdminDashboard from "./pages/admin/Dashboard";

// Seller Dashboard
import { SellerLayout } from "@/components/seller/SellerLayout";
import SellerDashboard from "./pages/seller/Dashboard";

// Logistics Dashboard
import { LogisticsLayout } from "@/components/logistics/LogisticsLayout";
import LogisticsDashboard from "./pages/logistics/Dashboard";

// Affiliate Dashboard
import { ReferralLayout } from "@/components/referral/ReferralLayout";
import AffiliateDashboard from "./pages/affiliate/Dashboard";

// Chat
import ChatPage from "./pages/messages/ChatPage";

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
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
              <Route path="/admin/*" element={<AdminLayout><AdminDashboard /></AdminLayout>} />

              {/* Seller Dashboard Routes */}
              <Route path="/seller" element={<SellerLayout />}>
                <Route index element={<SellerDashboard />} />
                <Route path="*" element={<SellerDashboard />} />
              </Route>

              {/* Logistics Dashboard Routes */}
              <Route path="/logistics" element={<LogisticsLayout />}>
                <Route index element={<LogisticsDashboard />} />
                <Route path="*" element={<LogisticsDashboard />} />
              </Route>

              {/* Affiliate Dashboard Routes */}
              <Route path="/affiliate" element={<ReferralLayout />}>
                <Route index element={<AffiliateDashboard />} />
                <Route path="*" element={<AffiliateDashboard />} />
              </Route>

              {/* Chat Route */}
              <Route path="/messages" element={<ChatPage />} />

              {/* Main App Routes */}
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

                    {/* Auth Routes */}
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                    <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />

                    {/* Protected Routes */}
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
