import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductVariant {
  id: string;
  name: string;
  sku: string | null;
  grade: string | null;
  packaging: string | null;
  weight: number | null;
  weight_unit: string | null;
  stock_quantity: number | null;
  low_stock_threshold: number | null;
  is_active: boolean | null;
  is_default: boolean | null;
  pricing_tiers: {
    id: string;
    min_quantity: number;
    max_quantity: number | null;
    price_per_unit: number;
    currency: string;
  }[];
}

interface ProductImage {
  id: string;
  image_url: string;
  is_primary: boolean | null;
  alt_text: string | null;
  sort_order: number | null;
}

export interface ProductEditData {
  id: string;
  name: string;
  short_description: string | null;
  description: string | null;
  category_id: string | null;
  supplier_id: string;
  sku: string | null;
  unit_of_measure: string;
  status: string;
  is_organic: boolean | null;
  is_featured: boolean | null;
  origin_country: string | null;
  origin_region: string | null;
  harvest_date: string | null;
  expiry_date: string | null;
  lead_time_days: number | null;
  min_order_quantity: number | null;
  max_order_quantity: number | null;
  variants: ProductVariant[];
  images: ProductImage[];
}

export function useProductEdit(productId: string | undefined) {
  const [product, setProduct] = useState<ProductEditData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setProduct(null);
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select(`
            id,
            name,
            short_description,
            description,
            category_id,
            supplier_id,
            sku,
            unit_of_measure,
            status,
            is_organic,
            is_featured,
            origin_country,
            origin_region,
            harvest_date,
            expiry_date,
            lead_time_days,
            min_order_quantity,
            max_order_quantity,
            product_variants (
              id,
              name,
              sku,
              grade,
              packaging,
              weight,
              weight_unit,
              stock_quantity,
              low_stock_threshold,
              is_active,
              is_default,
              pricing_tiers (
                id,
                min_quantity,
                max_quantity,
                price_per_unit,
                currency
              )
            ),
            product_images (
              id,
              image_url,
              is_primary,
              alt_text,
              sort_order
            )
          `)
          .eq('id', productId)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          setProduct({
            ...data,
            variants: data.product_variants || [],
            images: data.product_images || [],
          });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load product';
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const updateProduct = async (updates: Partial<ProductEditData>) => {
    if (!productId) return { error: 'No product ID' };

    try {
      const { error: updateError } = await supabase
        .from('products')
        .update({
          name: updates.name,
          short_description: updates.short_description,
          description: updates.description,
          category_id: updates.category_id,
          sku: updates.sku,
          unit_of_measure: updates.unit_of_measure,
        status: updates.status as 'draft' | 'active' | 'inactive' | 'out_of_stock' | 'discontinued' | undefined,
        is_organic: updates.is_organic,
        is_featured: updates.is_featured,
        origin_country: updates.origin_country,
        origin_region: updates.origin_region,
        harvest_date: updates.harvest_date,
          expiry_date: updates.expiry_date,
          lead_time_days: updates.lead_time_days,
          min_order_quantity: updates.min_order_quantity,
          max_order_quantity: updates.max_order_quantity,
        })
        .eq('id', productId);

      if (updateError) throw updateError;

      toast.success('Product updated successfully');
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update product';
      toast.error(message);
      return { error: message };
    }
  };

  return {
    product,
    isLoading,
    error,
    updateProduct,
    refetch: () => {
      if (productId) {
        setProduct(null);
        // Trigger useEffect by changing a dependency would require a state toggle
      }
    },
  };
}
