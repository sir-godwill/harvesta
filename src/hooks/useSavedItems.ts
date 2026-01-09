import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchSavedProducts,
  saveProduct,
  unsaveProduct,
  isProductSaved,
  fetchSavedSuppliers,
  saveSupplier,
  unsaveSupplier,
} from "@/lib/supabaseService";
import { toast } from "sonner";

// ============================================
// SAVED PRODUCTS
// ============================================

export function useSavedProducts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["saved-products", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await fetchSavedProducts(user.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
}

export function useIsProductSaved(productId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["is-product-saved", user?.id, productId],
    queryFn: async () => {
      if (!user?.id) return false;
      return await isProductSaved(user.id, productId);
    },
    enabled: !!user?.id && !!productId,
  });
}

export function useToggleSaveProduct() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ productId, isSaved }: { productId: string; isSaved: boolean }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      if (isSaved) {
        const { error } = await unsaveProduct(user.id, productId);
        if (error) throw error;
      } else {
        const { error } = await saveProduct(user.id, productId);
        if (error) throw error;
      }
      
      return !isSaved;
    },
    onSuccess: (newSavedState, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ["saved-products"] });
      queryClient.setQueryData(["is-product-saved", user?.id, productId], newSavedState);
      toast.success(newSavedState ? "Product saved" : "Product removed from saved");
    },
    onError: (error) => {
      toast.error("Failed to update saved products");
      console.error("Toggle save product error:", error);
    },
  });
}

// ============================================
// SAVED SUPPLIERS
// ============================================

export function useSavedSuppliers() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["saved-suppliers", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await fetchSavedSuppliers(user.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
}

export function useToggleSaveSupplier() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ supplierId, isSaved }: { supplierId: string; isSaved: boolean }) => {
      if (!user?.id) throw new Error("User not authenticated");
      
      if (isSaved) {
        const { error } = await unsaveSupplier(user.id, supplierId);
        if (error) throw error;
      } else {
        const { error } = await saveSupplier(user.id, supplierId);
        if (error) throw error;
      }
      
      return !isSaved;
    },
    onSuccess: (newSavedState) => {
      queryClient.invalidateQueries({ queryKey: ["saved-suppliers"] });
      toast.success(newSavedState ? "Supplier saved" : "Supplier removed from saved");
    },
    onError: (error) => {
      toast.error("Failed to update saved suppliers");
      console.error("Toggle save supplier error:", error);
    },
  });
}
