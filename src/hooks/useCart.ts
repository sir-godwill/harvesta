import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import {
  getOrCreateCart,
  fetchCartItems,
  addToCart as addToCartService,
  updateCartItemQuantity as updateQuantityService,
  removeCartItem as removeItemService,
  clearCart as clearCartService,
} from "@/lib/supabaseService";
import { toast } from "sonner";

export function useCart() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get or create cart
  const cartQuery = useQuery({
    queryKey: ["cart", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await getOrCreateCart(user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch cart items
  const itemsQuery = useQuery({
    queryKey: ["cart-items", cartQuery.data?.id],
    queryFn: async () => {
      if (!cartQuery.data?.id) return [];
      const { data, error } = await fetchCartItems(cartQuery.data.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!cartQuery.data?.id,
  });

  // Add to cart mutation
  const addToCart = useMutation({
    mutationFn: async ({ productVariantId, quantity }: { productVariantId: string; quantity: number }) => {
      if (!cartQuery.data?.id) throw new Error("No cart available");
      const { data, error } = await addToCartService(cartQuery.data.id, productVariantId, quantity);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      toast.success("Added to cart");
    },
    onError: (error) => {
      toast.error("Failed to add to cart");
      console.error("Add to cart error:", error);
    },
  });

  // Update quantity mutation
  const updateQuantity = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const { data, error } = await updateQuantityService(itemId, quantity);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
    },
    onError: (error) => {
      toast.error("Failed to update quantity");
      console.error("Update quantity error:", error);
    },
  });

  // Remove item mutation
  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await removeItemService(itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      toast.success("Item removed from cart");
    },
    onError: (error) => {
      toast.error("Failed to remove item");
      console.error("Remove item error:", error);
    },
  });

  // Clear cart mutation
  const clearCart = useMutation({
    mutationFn: async () => {
      if (!cartQuery.data?.id) throw new Error("No cart available");
      const { error } = await clearCartService(cartQuery.data.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-items"] });
      toast.success("Cart cleared");
    },
    onError: (error) => {
      toast.error("Failed to clear cart");
      console.error("Clear cart error:", error);
    },
  });

  // Calculate totals
  const calculateTotals = () => {
    const items = itemsQuery.data || [];
    let subtotal = 0;
    let itemCount = 0;

    items.forEach((item: any) => {
      const pricingTiers = item.product_variant?.pricing_tiers || [];
      const sortedTiers = [...pricingTiers].sort((a: any, b: any) => a.min_quantity - b.min_quantity);
      
      // Find applicable pricing tier
      const applicableTier = sortedTiers.find((tier: any) => 
        item.quantity >= tier.min_quantity && 
        (tier.max_quantity === null || item.quantity <= tier.max_quantity)
      ) || sortedTiers[0];
      
      const unitPrice = item.unit_price || applicableTier?.price_per_unit || 0;
      subtotal += unitPrice * item.quantity;
      itemCount++;
    });

    const taxes = subtotal * 0.1925; // 19.25% VAT
    const deliveryTotal = 0; // Will be calculated based on delivery options
    const grandTotal = subtotal + taxes + deliveryTotal;

    return { subtotal, taxes, deliveryTotal, grandTotal, itemCount };
  };

  // Group items by supplier
  const groupBySupplier = () => {
    const items = itemsQuery.data || [];
    const groups: Record<string, any> = {};

    items.forEach((item: any) => {
      const supplier = item.product_variant?.product?.supplier;
      if (!supplier) return;

      if (!groups[supplier.id]) {
        groups[supplier.id] = {
          supplier: {
            id: supplier.id,
            name: supplier.company_name,
            logo: supplier.logo_url,
            isVerified: supplier.verification_status === "verified",
          },
          items: [],
          subtotal: 0,
        };
      }

      const pricingTiers = item.product_variant?.pricing_tiers || [];
      const sortedTiers = [...pricingTiers].sort((a: any, b: any) => a.min_quantity - b.min_quantity);
      const applicableTier = sortedTiers.find((tier: any) => 
        item.quantity >= tier.min_quantity && 
        (tier.max_quantity === null || item.quantity <= tier.max_quantity)
      ) || sortedTiers[0];
      const unitPrice = item.unit_price || applicableTier?.price_per_unit || 0;

      groups[supplier.id].items.push({
        ...item,
        calculatedPrice: unitPrice,
        totalPrice: unitPrice * item.quantity,
      });
      groups[supplier.id].subtotal += unitPrice * item.quantity;
    });

    return Object.values(groups);
  };

  return {
    cart: cartQuery.data,
    items: itemsQuery.data || [],
    isLoading: cartQuery.isLoading || itemsQuery.isLoading,
    error: cartQuery.error || itemsQuery.error,
    addToCart: addToCart.mutate,
    updateQuantity: updateQuantity.mutate,
    removeItem: removeItem.mutate,
    clearCart: clearCart.mutate,
    isAddingToCart: addToCart.isPending,
    calculateTotals,
    groupBySupplier,
    itemCount: (itemsQuery.data || []).length,
  };
}
