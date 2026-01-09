import { useQuery } from "@tanstack/react-query";
import { fetchSuppliers, fetchSupplierById } from "@/lib/supabaseService";
import type { Tables } from "@/integrations/supabase/types";

export function useSuppliers(options?: {
  is_featured?: boolean;
  search?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["suppliers", options],
    queryFn: async () => {
      const { data, error } = await fetchSuppliers(options);
      if (error) throw error;
      return data || [];
    },
  });
}

export function useFeaturedSuppliers(limit = 4) {
  return useQuery({
    queryKey: ["suppliers", "featured", limit],
    queryFn: async () => {
      const { data, error } = await fetchSuppliers({ is_featured: true, limit });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useSupplier(supplierId: string | undefined) {
  return useQuery({
    queryKey: ["supplier", supplierId],
    queryFn: async () => {
      if (!supplierId) return null;
      const { data, error } = await fetchSupplierById(supplierId);
      if (error) throw error;
      return data;
    },
    enabled: !!supplierId,
  });
}

// Transform DB supplier to frontend format
export function transformSupplier(supplier: Tables<"suppliers">) {
  return {
    id: supplier.id,
    name: supplier.company_name,
    logo: supplier.logo_url || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
    rating: supplier.rating || 0,
    years: Math.floor((Date.now() - new Date(supplier.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365)),
    responseRate: supplier.response_rate || 0,
    onTimeDelivery: 90, // Would need delivery analytics for accurate calculation
    verified: supplier.verification_status === "verified",
    goldSupplier: supplier.is_featured || false,
    location: `${supplier.city || ""}, ${supplier.country}`.replace(/^, /, ""),
    products: [], // Would need to fetch products for this
    totalSales: supplier.total_orders || 0,
    totalProducts: supplier.total_products || 0,
    totalReviews: supplier.total_reviews || 0,
    responseTime: supplier.response_time_hours ? `< ${supplier.response_time_hours} hours` : "< 24 hours",
    description: supplier.description || "",
    coverImage: supplier.banner_url,
    isVerified: supplier.verification_status === "verified",
    isQualityChecked: supplier.verification_status === "verified",
  };
}
