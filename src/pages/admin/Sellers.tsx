import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  TrendingUp,
  Users,
  Eye,
  Edit,
  Ban,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface Seller {
  id: string;
  businessName: string;
  ownerName: string;
  avatar?: string;
  status: 'active' | 'pending' | 'suspended' | 'rejected';
  trustScore: number;
  region: string;
  totalProducts: number;
  totalOrders: number;
  commissionRate: number;
}

const mockSellers: Seller[] = [
  { id: '1', businessName: 'Kofi Organic Farms', ownerName: 'Kofi Mensah', status: 'active', trustScore: 95, region: 'Ashanti', totalProducts: 45, totalOrders: 234, commissionRate: 8 },
  { id: '2', businessName: 'Lagos Agro Export', ownerName: 'Chukwu Okonkwo', status: 'active', trustScore: 88, region: 'Lagos', totalProducts: 32, totalOrders: 189, commissionRate: 10 },
  { id: '3', businessName: 'Cameroon Fresh Produce', ownerName: 'Paul Mbeki', status: 'pending', trustScore: 0, region: 'Centre', totalProducts: 0, totalOrders: 0, commissionRate: 12 },
  { id: '4', businessName: 'Ethiopian Coffee Ltd', ownerName: 'Alemayehu Bekele', status: 'active', trustScore: 92, region: 'Addis Ababa', totalProducts: 18, totalOrders: 567, commissionRate: 7 },
  { id: '5', businessName: 'Kenya Spice Traders', ownerName: 'Wanjiku Kamau', status: 'suspended', trustScore: 45, region: 'Nairobi', totalProducts: 12, totalOrders: 45, commissionRate: 15 },
];

function StatCard({ title, value, icon: Icon, color, trend }: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: number;
}) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
              <p className="text-xl sm:text-2xl font-bold mt-1">{value}</p>
              {trend !== undefined && (
                <div className="flex items-center gap-1 mt-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+{trend}%</span>
                </div>
              )}
            </div>
            <div className={cn('p-2 sm:p-3 rounded-xl', color)}>
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SellerCard({ seller, isMobile }: { seller: Seller; isMobile: boolean }) {
  const statusColors = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    rejected: 'bg-muted text-muted-foreground',
  };

  if (isMobile) {
    return (
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden active:scale-[0.99] transition-transform">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12 rounded-xl">
                <AvatarImage src={seller.avatar} />
                <AvatarFallback className="rounded-xl bg-primary/10 text-primary">
                  {seller.businessName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold truncate">{seller.businessName}</h3>
                  <Badge className={cn('ml-2', statusColors[seller.status])}>
                    {seller.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{seller.ownerName}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    {seller.trustScore}%
                  </span>
                  <span>•</span>
                  <span>{seller.region}</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-lg font-bold">{seller.totalProducts}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Products</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{seller.totalOrders}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Orders</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{seller.commissionRate}%</p>
                <p className="text-[10px] text-muted-foreground uppercase">Commission</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.tr variants={itemVariants} className="border-b transition-colors hover:bg-muted/50">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-lg">
            <AvatarImage src={seller.avatar} />
            <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
              {seller.businessName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{seller.businessName}</p>
            <p className="text-sm text-muted-foreground">{seller.ownerName}</p>
          </div>
        </div>
      </td>
      <td className="p-4">
        <Badge className={statusColors[seller.status]}>{seller.status}</Badge>
      </td>
      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-1">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span className="font-medium">{seller.trustScore}%</span>
        </div>
      </td>
      <td className="p-4 text-center">{seller.totalProducts}</td>
      <td className="p-4 text-center">{seller.totalOrders}</td>
      <td className="p-4 text-center">{seller.region}</td>
      <td className="p-4 text-center">{seller.commissionRate}%</td>
      <td className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
            <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit Seller</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive"><Ban className="mr-2 h-4 w-4" /> Suspend</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </motion.tr>
  );
}

export default function AdminSellers() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSellers(mockSellers);
      setIsLoading(false);
    }, 500);
  }, []);

  const stats = {
    total: sellers.length,
    active: sellers.filter((s) => s.status === 'active').length,
    pending: sellers.filter((s) => s.status === 'pending').length,
    suspended: sellers.filter((s) => s.status === 'suspended').length,
  };

  const filteredSellers = filter === 'all' ? sellers : sellers.filter((s) => s.status === filter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4 sm:space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            Seller Management
          </h1>
          <p className="text-sm text-muted-foreground">Manage vendors, applications, and commissions</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Users className="mr-2 h-4 w-4" /> Add Seller
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Total Sellers" value={stats.total} icon={Store} color="bg-primary" trend={12} />
        <StatCard title="Active" value={stats.active} icon={CheckCircle2} color="bg-green-600" />
        <StatCard title="Pending" value={stats.pending} icon={Clock} color="bg-yellow-500" />
        <StatCard title="Suspended" value={stats.suspended} icon={XCircle} color="bg-red-500" />
      </div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search sellers..." className="pl-9" />
              </div>
              <div className="flex gap-2">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sellers List */}
      <motion.div variants={itemVariants}>
        {isMobile ? (
          <div className="space-y-3">
            {filteredSellers.map((seller) => (
              <SellerCard key={seller.id} seller={seller} isMobile />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-4 text-left font-medium">Seller</th>
                      <th className="p-4 text-left font-medium">Status</th>
                      <th className="p-4 text-center font-medium">Trust Score</th>
                      <th className="p-4 text-center font-medium">Products</th>
                      <th className="p-4 text-center font-medium">Orders</th>
                      <th className="p-4 text-center font-medium">Region</th>
                      <th className="p-4 text-center font-medium">Commission</th>
                      <th className="p-4 text-center font-medium">Actions</th>
                    </tr>
                  </thead>
                  <motion.tbody variants={containerVariants}>
                    {filteredSellers.map((seller) => (
                      <SellerCard key={seller.id} seller={seller} isMobile={false} />
                    ))}
                  </motion.tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </motion.div>
  );
}
