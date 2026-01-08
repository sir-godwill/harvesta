import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Heart, 
  ShoppingCart,
  Trash2,
  Filter,
  Grid3X3,
  List,
  AlertCircle,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Mock saved products
const mockSavedProducts = [
  {
    id: "prod-1",
    name: "Organic Tomatoes (Fresh)",
    vendor: "Green Valley Farms",
    vendorVerified: true,
    image: "",
    price: 250,
    originalPrice: 300,
    currency: "XAF",
    unit: "kg",
    moq: 100,
    inStock: true,
    stockQuantity: 5000,
    rating: 4.8,
    reviewCount: 124,
    savedAt: "2026-01-05"
  },
  {
    id: "prod-2",
    name: "Premium Rice Bags (50kg)",
    vendor: "AgroPlus Supplies",
    vendorVerified: true,
    image: "",
    price: 4500,
    originalPrice: null,
    currency: "XAF",
    unit: "bag",
    moq: 50,
    inStock: true,
    stockQuantity: 200,
    rating: 4.6,
    reviewCount: 89,
    savedAt: "2026-01-04"
  },
  {
    id: "prod-3",
    name: "Maize Seeds (Certified)",
    vendor: "Farm Fresh Co.",
    vendorVerified: true,
    image: "",
    price: 1200,
    originalPrice: 1500,
    currency: "XAF",
    unit: "kg",
    moq: 25,
    inStock: false,
    stockQuantity: 0,
    rating: 4.9,
    reviewCount: 56,
    savedAt: "2026-01-03"
  },
  {
    id: "prod-4",
    name: "Plantain Bunches",
    vendor: "Tropical Harvest",
    vendorVerified: false,
    image: "",
    price: 600,
    originalPrice: null,
    currency: "XAF",
    unit: "bunch",
    moq: 50,
    inStock: true,
    stockQuantity: 150,
    rating: 4.4,
    reviewCount: 42,
    savedAt: "2026-01-02"
  },
  {
    id: "prod-5",
    name: "NPK Fertilizer (25kg)",
    vendor: "AgroPlus Supplies",
    vendorVerified: true,
    image: "",
    price: 8500,
    originalPrice: 9000,
    currency: "XAF",
    unit: "bag",
    moq: 20,
    inStock: true,
    stockQuantity: 80,
    rating: 4.7,
    reviewCount: 98,
    savedAt: "2026-01-01"
  }
];

const SavedProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState(mockSavedProducts);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recent");

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleRemoveSelected = () => {
    setProducts(products.filter(p => !selectedProducts.includes(p.id)));
    setSelectedProducts([]);
    toast({
      title: "Products Removed",
      description: `${selectedProducts.length} items removed from your saved list`,
    });
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast({
      title: "Product Removed",
      description: "Item removed from your saved list",
    });
  };

  const handleAddToCart = (productId: string) => {
    toast({
      title: "Added to Cart",
      description: "Product added to your cart",
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  Saved Products
                </h1>
                <p className="text-sm text-muted-foreground">{products.length} items saved</p>
              </div>
            </div>
            {selectedProducts.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{selectedProducts.length} selected</Badge>
                <Button variant="outline" size="sm" onClick={handleRemoveSelected}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Selected
                </Button>
                <Button size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Filters Bar */}
        <Card className="mb-6">
          <CardContent className="py-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="selectAll"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <label htmlFor="selectAll" className="text-sm text-muted-foreground cursor-pointer">
                    Select All
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recently Added</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border rounded-md">
                  <Button 
                    variant={viewMode === "grid" ? "secondary" : "ghost"} 
                    size="icon"
                    className="rounded-r-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === "list" ? "secondary" : "ghost"} 
                    size="icon"
                    className="rounded-l-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid/List */}
        {products.length > 0 ? (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
            : "space-y-4"
          }>
            {products.map((product) => (
              <Card 
                key={product.id} 
                className={`overflow-hidden hover:shadow-md transition-shadow ${
                  !product.inStock ? 'opacity-75' : ''
                }`}
              >
                <CardContent className={viewMode === "grid" ? "p-0" : "p-4"}>
                  {viewMode === "grid" ? (
                    // Grid View
                    <>
                      <div className="relative">
                        <div className="aspect-square bg-muted flex items-center justify-center">
                          <Package className="h-16 w-16 text-muted-foreground" />
                        </div>
                        <div className="absolute top-2 left-2">
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={(checked) => handleSelectProduct(product.id, !!checked)}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 bg-background/80 hover:bg-background"
                          onClick={() => handleRemoveProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        {product.originalPrice && (
                          <Badge className="absolute bottom-2 left-2 bg-red-500">
                            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                          </Badge>
                        )}
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                            <Badge variant="secondary">Out of Stock</Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">{product.vendor}</p>
                        <h3 className="font-medium text-sm line-clamp-2 mb-2">{product.name}</h3>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-lg font-bold text-primary">
                            {formatCurrency(product.price, product.currency)}
                          </span>
                          <span className="text-xs text-muted-foreground">/{product.unit}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatCurrency(product.originalPrice, product.currency)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          MOQ: {product.moq} {product.unit}s
                        </p>
                        <Button 
                          className="w-full" 
                          size="sm"
                          disabled={!product.inStock}
                          onClick={() => handleAddToCart(product.id)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </>
                  ) : (
                    // List View
                    <div className="flex gap-4">
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) => handleSelectProduct(product.id, !!checked)}
                        className="mt-1"
                      />
                      <div className="h-24 w-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">{product.vendor}</p>
                            <h3 className="font-medium">{product.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm">⭐ {product.rating}</span>
                              <span className="text-xs text-muted-foreground">
                                ({product.reviewCount} reviews)
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold text-primary">
                                {formatCurrency(product.price, product.currency)}
                              </span>
                              <span className="text-xs text-muted-foreground">/{product.unit}</span>
                            </div>
                            {product.originalPrice && (
                              <span className="text-xs text-muted-foreground line-through">
                                {formatCurrency(product.originalPrice, product.currency)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <Badge variant={product.inStock ? "secondary" : "outline"}>
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              MOQ: {product.moq} {product.unit}s
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleRemoveProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                            <Button 
                              size="sm"
                              disabled={!product.inStock}
                              onClick={() => handleAddToCart(product.id)}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Empty State
          <Card className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <Heart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-xl mb-2">No Saved Products</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Start browsing and save products you're interested in. They'll appear here for easy access.
              </p>
              <Link to="/">
                <Button>
                  <Package className="h-4 w-4 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Stock Alert */}
        {products.some(p => !p.inStock) && (
          <Card className="mt-6 border-amber-200 bg-amber-50">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800">Some items are out of stock</p>
                  <p className="text-sm text-amber-700">
                    We'll notify you when they become available again.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default SavedProducts;
