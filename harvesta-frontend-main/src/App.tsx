import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Refunds from "./pages/Refunds";
import HelpCenter from "./pages/HelpCenter";
import BuyerProtection from "./pages/BuyerProtection";
import SupplierCodeOfConduct from "./pages/SupplierCodeOfConduct";
import TrustSafety from "./pages/TrustSafety";
import Compliance from "./pages/Compliance";
import Search from "./pages/Search";
import Category from "./pages/Category";
import SupplierProfile from "./pages/SupplierProfile";
import RFQ from "./pages/RFQ";
import OrderTracking from "./pages/OrderTracking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/refunds" element={<Refunds />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/buyer-protection" element={<BuyerProtection />} />
          <Route path="/supplier-code" element={<SupplierCodeOfConduct />} />
          <Route path="/trust-safety" element={<TrustSafety />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/search" element={<Search />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/supplier/:supplierId" element={<SupplierProfile />} />
          <Route path="/rfq" element={<RFQ />} />
          <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
