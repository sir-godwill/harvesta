import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { fetchBuyerDashboardStats } from "@/lib/supabaseService";

export function useDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["dashboard-stats", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return {
          totalOrders: 0,
          activeOrders: 0,
          pendingPayments: 0,
          savedSuppliers: 0,
        };
      }
      return await fetchBuyerDashboardStats(user.id);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}
