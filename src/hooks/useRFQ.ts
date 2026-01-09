import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { createRFQ, fetchRFQs } from "@/lib/supabaseService";
import { toast } from "sonner";

export function useRFQs() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["rfqs", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await fetchRFQs(user.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
}

export function useCreateRFQ() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (rfqData: {
      productName: string;
      quantity: number;
      unit: string;
      categoryId?: string;
      description?: string;
      qualityRequirements?: string;
      targetPrice?: number;
      deliveryLocation?: string;
      deliveryDeadline?: string;
    }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await createRFQ({
        userId: user.id,
        ...rfqData,
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rfqs"] });
      toast.success("RFQ submitted successfully!");
      return data;
    },
    onError: (error) => {
      toast.error("Failed to submit RFQ");
      console.error("Create RFQ error:", error);
    },
  });
}

// RFQ status info
export function getRFQStatusInfo(status: string) {
  const statusMap: Record<string, { label: string; color: string }> = {
    open: { label: "Open", color: "bg-blue-100 text-blue-800" },
    quoted: { label: "Quoted", color: "bg-green-100 text-green-800" },
    negotiating: { label: "Negotiating", color: "bg-yellow-100 text-yellow-800" },
    accepted: { label: "Accepted", color: "bg-emerald-100 text-emerald-800" },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
    expired: { label: "Expired", color: "bg-gray-100 text-gray-800" },
    cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-800" },
  };

  return statusMap[status] || { label: status, color: "bg-gray-100 text-gray-800" };
}
