import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
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
              <Route path="/" element={<Index />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/dashboard" element={<BuyerDashboard />} />
              <Route path="/profile" element={<BuyerProfile />} />
              <Route path="/orders" element={<OrderList />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/saved-products" element={<SavedProducts />} />
              <Route path="/saved-suppliers" element={<SavedSuppliers />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/rfq" element={<RFQ />} />
              <Route path="/track/:orderId" element={<OrderTracking />} />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
