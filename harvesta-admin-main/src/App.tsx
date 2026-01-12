import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { CommandPalette } from "@/components/CommandPalette";
import { AddSellerModal } from "@/components/modals/AddSellerModal";
import { AddProductModal } from "@/components/modals/AddProductModal";
import { AddOrderModal } from "@/components/modals/AddOrderModal";

// Main Pages
import Dashboard from "./pages/Dashboard";
import Sellers from "./pages/Sellers";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Logistics from "./pages/Logistics";
import Payments from "./pages/Payments";
import Buyers from "./pages/Buyers";
import Disputes from "./pages/Disputes";
import Analytics from "./pages/Analytics";
import Marketing from "./pages/Marketing";
import Compliance from "./pages/Compliance";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Sub-module Pages
import Applications from "./pages/sellers/Applications";
import Verification from "./pages/sellers/Verification";
import Commissions from "./pages/sellers/Commissions";
import PendingProducts from "./pages/products/PendingProducts";
import Categories from "./pages/products/Categories";
import PendingOrders from "./pages/orders/PendingOrders";
import Returns from "./pages/orders/Returns";
import Zones from "./pages/logistics/Zones";

const queryClient = new QueryClient();

const App = () => {
  const [addSellerOpen, setAddSellerOpen] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [addOrderOpen, setAddOrderOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CommandPalette
            onAddSeller={() => setAddSellerOpen(true)}
            onAddProduct={() => setAddProductOpen(true)}
            onAddOrder={() => setAddOrderOpen(true)}
          />
          <AddSellerModal open={addSellerOpen} onOpenChange={setAddSellerOpen} />
          <AddProductModal open={addProductOpen} onOpenChange={setAddProductOpen} />
          <AddOrderModal open={addOrderOpen} onOpenChange={setAddOrderOpen} />
          <AdminLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sellers" element={<Sellers />} />
              <Route path="/sellers/applications" element={<Applications />} />
              <Route path="/sellers/verification" element={<Verification />} />
              <Route path="/sellers/commissions" element={<Commissions />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/pending" element={<PendingProducts />} />
              <Route path="/products/categories" element={<Categories />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/pending" element={<PendingOrders />} />
              <Route path="/orders/returns" element={<Returns />} />
              <Route path="/logistics" element={<Logistics />} />
              <Route path="/logistics/zones" element={<Zones />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/buyers" element={<Buyers />} />
              <Route path="/disputes" element={<Disputes />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/marketing" element={<Marketing />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AdminLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
