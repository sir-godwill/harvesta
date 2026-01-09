import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProductById, fetchProductBySlug, ProductWithDetails } from "@/lib/supabaseService";

export function useProducts(options?: {
  category_id?: string;
  supplier_id?: string;
  is_featured?: boolean;
  search?: string;
  limit?: number;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ["products", options],
    queryFn: async () => {
      const { data, error } = await fetchProducts(options);
      if (error) throw error;
      return data || [];
    },
    enabled: options?.enabled !== false,
  });
}

export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: ["products", "featured", limit],
    queryFn: async () => {
      const { data, error } = await fetchProducts({ is_featured: true, limit });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useProduct(productId: string | undefined) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!productId) return null;
      const { data, error } = await fetchProductById(productId);
      if (error) throw error;
      return data;
    },
    enabled: !!productId,
  });
}

export function useProductBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", "slug", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await fetchProductBySlug(slug);
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

// Helper to transform DB product to frontend format
export function transformProduct(product: ProductWithDetails) {
  const defaultVariant = product.variants?.find(v => v.is_default) || product.variants?.[0];
  const pricingTiers = defaultVariant?.pricing_tiers || [];
  const sortedTiers = [...pricingTiers].sort((a, b) => a.min_quantity - b.min_quantity);
  const lowestPrice = sortedTiers[0]?.price_per_unit || 0;
  const highestPrice = sortedTiers[sortedTiers.length - 1]?.price_per_unit || lowestPrice;
  const primaryImage = product.images?.find(i => i.is_primary) || product.images?.[0];

  return {
    id: product.id,
    name: product.name,
    image: primaryImage?.image_url || "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
    price: lowestPrice,
    priceMax: highestPrice,
    moq: product.min_order_quantity || 1,
    unit: product.unit_of_measure,
    supplier: product.supplier?.company_name || "Unknown Supplier",
    supplierId: product.supplier_id,
    location: product.supplier?.city || product.supplier?.country || "",
    rating: product.supplier?.rating || 0,
    sold: product.order_count || 0,
    verified: product.supplier?.verification_status === "verified",
    goldSupplier: product.supplier?.is_featured || false,
    category: product.category?.name || "",
    origin: `${product.origin_region || ""}, ${product.origin_country || ""}`.replace(/^, |, $/g, ""),
    grade: defaultVariant?.grade || defaultVariant?.quality || "",
    isOrganic: product.is_organic,
    pricingTiers: sortedTiers.map(t => ({
      minQuantity: t.min_quantity,
      maxQuantity: t.max_quantity,
      pricePerUnit: t.price_per_unit,
    })),
  };
}
