import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useGuestTracking } from "@/hooks/useGuestTracking";
import ProductCard from "@/components/home/ProductCard";
import { SellerCarousel } from "./SellerCarousel";
import { TrendingProductsCarousel } from "./TrendingProductsCarousel";
import { RecentlyViewedCarousel } from "./RecentlyViewedCarousel";
import { GuestPromptModal } from "./GuestPromptModal";
import { supabase } from "@/integrations/supabase/client";

const PRODUCTS_PER_PAGE = 20;

export function InfiniteProductFeed() {
  const {
    shouldShowPrompt,
    trackScrollDepth,
    dismissPrompt,
    timeOnPage,
    scrollDepth,
  } = useGuestTracking({
    timeThreshold: 30,
    scrollThreshold: 50,
  });

  const fetchProducts = useCallback(async (page: number) => {
    const offset = page * PRODUCTS_PER_PAGE;

    const { data, error, count } = await supabase
      .from("products")
      .select("*, supplier:suppliers(*), product_images(*)", { count: "exact" })
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .range(offset, offset + PRODUCTS_PER_PAGE - 1);

    if (error) {
      console.error("Error fetching products:", error);
      return { data: [], hasMore: false };
    }

    const hasMore = (count || 0) > offset + PRODUCTS_PER_PAGE;

    return {
      data: data || [],
      hasMore,
    };
  }, []);

  const {
    items: products,
    loading,
    hasMore,
    loadMoreRef,
  } = useInfiniteScroll(fetchProducts);

  // Track scroll depth for guest users
  useEffect(() => {
    trackScrollDepth(products.length);
  }, [products.length, trackScrollDepth]);

  const renderInterruption = (index: number) => {
    const position = index + 1;

    // Interruption pattern
    if (position === 10) {
      return (
        <motion.div
          key={`interruption-sellers-${position}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full my-8"
        >
          <SellerCarousel />
        </motion.div>
      );
    }

    if (position === 20) {
      return (
        <motion.div
          key={`interruption-recent-${position}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full my-8"
        >
          <RecentlyViewedCarousel />
        </motion.div>
      );
    }

    if (position === 30) {
      return (
        <motion.div
          key={`interruption-trending-${position}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full my-8"
        >
          <TrendingProductsCarousel />
        </motion.div>
      );
    }

    if (position === 50) {
      return (
        <motion.div
          key={`interruption-sellers-2-${position}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full my-8"
        >
          <SellerCarousel />
        </motion.div>
      );
    }

    if (position % 40 === 0) {
      return (
        <motion.div
          key={`interruption-trending-${position}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-full my-8"
        >
          <TrendingProductsCarousel />
        </motion.div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">All Products</h2>
          <p className="text-sm text-muted-foreground">
            {products.length} products loaded
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <>
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % PRODUCTS_PER_PAGE) * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>

              {/* Insert interruptions */}
              {renderInterruption(index)}
            </>
          ))}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading more products...</span>
            </div>
          </div>
        )}

        {/* Load More Trigger */}
        {hasMore && !loading && (
          <div
            ref={loadMoreRef}
            className="h-20 flex items-center justify-center"
          >
            <div className="text-sm text-muted-foreground">Scroll for more</div>
          </div>
        )}

        {/* End of Content */}
        {!hasMore && products.length > 0 && (
          <div className="text-center py-12">
            <p className="text-lg font-medium mb-2">You've reached the end!</p>
            <p className="text-sm text-muted-foreground">
              You've viewed all {products.length} products
            </p>
          </div>
        )}

        {/* No Products */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg font-medium mb-2">No products found</p>
            <p className="text-sm text-muted-foreground">
              Check back later for new products
            </p>
          </div>
        )}
      </div>

      {/* Guest Prompt Modal */}
      <GuestPromptModal
        isOpen={shouldShowPrompt}
        onClose={dismissPrompt}
        timeOnPage={timeOnPage}
        scrollDepth={scrollDepth}
      />
    </>
  );
}
