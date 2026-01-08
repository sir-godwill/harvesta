import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Building2,
  MessageCircle,
  Phone,
  Mail,
  Star,
  CheckCircle2,
  MapPin,
  Clock,
  Package,
  Trash2,
  ExternalLink,
  Filter,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VendorTrustBadge } from "@/components/common/VendorTrustBadge";
import { useToast } from "@/hooks/use-toast";

// Mock saved suppliers
const mockSavedSuppliers = [
  {
    id: "vendor-1",
    name: "Green Valley Farms",
    logo: "",
    category: "Fresh Produce",
    location: "Yaoundé, Cameroon",
    isVerified: true,
    tradeAssurance: true,
    rating: 4.8,
    reviewCount: 342,
    responseTime: "< 2 hours",
    yearsOnPlatform: 3,
    totalProducts: 156,
    completedOrders: 1250,
    specialties: ["Organic Vegetables", "Fresh Fruits", "Herbs"],
    savedAt: "2026-01-05"
  },
  {
    id: "vendor-2",
    name: "AgroPlus Supplies",
    logo: "",
    category: "Agricultural Inputs",
    location: "Douala, Cameroon",
    isVerified: true,
    tradeAssurance: true,
    rating: 4.6,
    reviewCount: 189,
    responseTime: "< 4 hours",
    yearsOnPlatform: 5,
    totalProducts: 423,
    completedOrders: 2100,
    specialties: ["Fertilizers", "Seeds", "Pesticides"],
    savedAt: "2026-01-04"
  },
  {
    id: "vendor-3",
    name: "Farm Fresh Co.",
    logo: "",
    category: "Grains & Cereals",
    location: "Bafoussam, Cameroon",
    isVerified: true,
    tradeAssurance: false,
    rating: 4.9,
    reviewCount: 98,
    responseTime: "< 1 hour",
    yearsOnPlatform: 2,
    totalProducts: 67,
    completedOrders: 450,
    specialties: ["Maize", "Rice", "Wheat"],
    savedAt: "2026-01-03"
  },
  {
    id: "vendor-4",
    name: "Tropical Harvest",
    logo: "",
    category: "Tropical Fruits",
    location: "Limbé, Cameroon",
    isVerified: false,
    tradeAssurance: false,
    rating: 4.4,
    reviewCount: 56,
    responseTime: "< 6 hours",
    yearsOnPlatform: 1,
    totalProducts: 34,
    completedOrders: 120,
    specialties: ["Plantains", "Bananas", "Pineapples"],
    savedAt: "2026-01-02"
  },
  {
    id: "vendor-5",
    name: "Cameroon Livestock Co.",
    logo: "",
    category: "Livestock & Poultry",
    location: "Ngaoundéré, Cameroon",
    isVerified: true,
    tradeAssurance: true,
    rating: 4.7,
    reviewCount: 234,
    responseTime: "< 3 hours",
    yearsOnPlatform: 4,
    totalProducts: 89,
    completedOrders: 890,
    specialties: ["Cattle", "Poultry", "Goats"],
    savedAt: "2026-01-01"
  }
];

const SavedSuppliers = () => {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState(mockSavedSuppliers);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || supplier.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleRemoveSupplier = (supplierId: string) => {
    setSuppliers(suppliers.filter(s => s.id !== supplierId));
    toast({
      title: "Supplier Removed",
      description: "Supplier removed from your saved list",
    });
  };

  const categories = [...new Set(suppliers.map(s => s.category))];

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
                  <Building2 className="h-5 w-5 text-primary" />
                  Saved Suppliers
                </h1>
                <p className="text-sm text-muted-foreground">{suppliers.length} trusted partners</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Suppliers</p>
                  <p className="text-2xl font-bold">{suppliers.length}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Verified</p>
                  <p className="text-2xl font-bold">{suppliers.filter(s => s.isVerified).length}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Trade Assured</p>
                  <p className="text-2xl font-bold">{suppliers.filter(s => s.tradeAssurance).length}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Rating</p>
                  <p className="text-2xl font-bold">
                    {(suppliers.reduce((acc, s) => acc + s.rating, 0) / suppliers.length).toFixed(1)}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Star className="h-5 w-5 text-amber-600 fill-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="py-3">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recently Added</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="orders">Most Orders</SelectItem>
                    <SelectItem value="products">Most Products</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suppliers List */}
        {filteredSuppliers.length > 0 ? (
          <div className="space-y-4">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Supplier Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={supplier.logo} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                          {supplier.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{supplier.name}</h3>
                            <div className="flex items-center flex-wrap gap-2 mt-1">
                              {supplier.isVerified && <VendorTrustBadge level="verified" />}
                              {supplier.tradeAssurance && (
                                <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                                  Trade Assurance
                                </Badge>
                              )}
                              <Badge variant="secondary">{supplier.category}</Badge>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleRemoveSupplier(supplier.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {supplier.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Response: {supplier.responseTime}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {supplier.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="font-normal">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:w-64">
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 flex-1">
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-center gap-1 text-amber-600">
                            <Star className="h-4 w-4 fill-amber-500" />
                            <span className="font-bold">{supplier.rating}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {supplier.reviewCount} reviews
                          </p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="font-bold">{supplier.totalProducts}</p>
                          <p className="text-xs text-muted-foreground">Products</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="font-bold">{supplier.completedOrders}</p>
                          <p className="text-xs text-muted-foreground">Orders</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-lg">
                          <p className="font-bold">{supplier.yearsOnPlatform}yr</p>
                          <p className="text-xs text-muted-foreground">Experience</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button className="w-full">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact Supplier
                        </Button>
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Empty State
          <Card className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <Building2 className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-xl mb-2">No Saved Suppliers</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Save suppliers you trust to quickly access them later. Build your network of reliable partners.
              </p>
              <Link to="/">
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Find Suppliers
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Tips Card */}
        {filteredSuppliers.length > 0 && (
          <Card className="mt-6 bg-green-50 border-green-200">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Pro Tip: Verified Suppliers</p>
                  <p className="text-sm text-green-700 mt-1">
                    Look for the verified badge and Trade Assurance for secure B2B transactions with quality guarantees.
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

export default SavedSuppliers;
