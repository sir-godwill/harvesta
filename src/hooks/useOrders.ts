import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchOrders, fetchOrderById, createOrder } from "@/lib/supabaseService";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

export function useOrders(options?: { status?: OrderStatus; limit?: number }) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["orders", user?.id, options],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await fetchOrders(user.id, options);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
}

export function useRecentOrders(limit = 5) {
  return useOrders({ limit });
}

export function useOrder(orderId: string | undefined) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const { data, error } = await fetchOrderById(orderId);
      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (orderData: {
      shippingAddressId: string;
      billingAddressId?: string;
      items: {
        productVariantId: string;
        supplierId: string;
        productName: string;
        variantName?: string;
        quantity: number;
        unitPrice: number;
      }[];
      notes?: string;
    }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await createOrder({
        userId: user.id,
        ...orderData,
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      toast.success("Order placed successfully!");
      return data;
    },
    onError: (error) => {
      toast.error("Failed to place order");
      console.error("Create order error:", error);
    },
  });
}

// Transform order status for display
export function getOrderStatusInfo(status: string) {
  const statusMap: Record<string, { label: string; color: string; icon: string }> = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: "⏳" },
    confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800", icon: "✓" },
    processing: { label: "Processing", color: "bg-purple-100 text-purple-800", icon: "⚙️" },
    shipped: { label: "Shipped", color: "bg-indigo-100 text-indigo-800", icon: "📦" },
    in_transit: { label: "In Transit", color: "bg-cyan-100 text-cyan-800", icon: "🚚" },
    delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: "✅" },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: "❌" },
    refunded: { label: "Refunded", color: "bg-gray-100 text-gray-800", icon: "↩️" },
  };

  return statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800", icon: "•" };
}

export function getPaymentStatusInfo(status: string) {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    processing: { label: "Processing", color: "bg-blue-100 text-blue-800" },
    completed: { label: "Paid", color: "bg-green-100 text-green-800" },
    failed: { label: "Failed", color: "bg-red-100 text-red-800" },
    refunded: { label: "Refunded", color: "bg-gray-100 text-gray-800" },
    cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-800" },
  };

  return statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" };
}
