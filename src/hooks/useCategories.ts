import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchCategoryBySlug, CategoryWithChildren } from "@/lib/supabaseService";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await fetchCategories();
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
  });
}

export function useCategory(slug: string | undefined) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await fetchCategoryBySlug(slug);
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

// Icon mapping for categories
const categoryIcons: Record<string, string> = {
  grains: "🌾",
  tubers: "🥔",
  vegetables: "🥬",
  fruits: "🍎",
  livestock: "🐄",
  "agro-inputs": "🌱",
  dairy: "🥛",
  processed: "📦",
  organic: "🌿",
};

export function getCategoryIcon(slug: string): string {
  return categoryIcons[slug.toLowerCase()] || "📦";
}

// Transform DB category to frontend format
export function transformCategory(category: CategoryWithChildren) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon: category.icon || getCategoryIcon(category.slug),
    description: category.description || "",
    image: category.image_url || "",
    subCategories: category.children?.map(child => ({
      id: child.id,
      name: child.name,
      slug: child.slug,
      productCount: 0, // Would need a separate query for accurate counts
    })) || [],
    productCount: 0,
  };
}
