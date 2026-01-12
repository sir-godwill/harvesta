import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Star,
  MoreHorizontal,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Eye,
  Ban,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  type: 'b2b' | 'b2c';
  region: string;
  totalOrders: number;
  totalSpent: number;
  trustScore: number;
  status: 'active' | 'flagged' | 'blocked';
  lastOrder: string;
}

const mockBuyers: Buyer[] = [
  { id: 'b1', name: 'Hans Mueller', email: 'hans@eurofoods.de', phone: '+49123456789', company: 'EuroFoods GmbH', type: 'b2b', region: 'Europe', totalOrders: 156, totalSpent: 245000000, trustScore: 95, status: 'active', lastOrder: new Date(Date.now() - 86400000).toISOString() },
  { id: 'b2', name: 'Chen Wei', email: 'chen@asiaspice.cn', phone: '+8612345678901', company: 'AsiaSpice Ltd', type: 'b2b', region: 'Asia', totalOrders: 89, totalSpent: 156000000, trustScore: 88, status: 'active', lastOrder: new Date(Date.now() - 172800000).toISOString() },
  { id: 'b3', name: 'John Smith', email: 'john@email.com', phone: '+1234567890', type: 'b2c', region: 'Americas', totalOrders: 12, totalSpent: 4500000, trustScore: 72, status: 'flagged', lastOrder: new Date(Date.now() - 604800000).toISOString() },
  { id: 'b4', name: 'Marie Dupont', email: 'marie@freshimports.fr', phone: '+33123456789', company: 'Fresh Imports', type: 'b2b', region: 'Europe', totalOrders: 234, totalSpent: 378000000, trustScore: 98, status: 'active', lastOrder: new Date().toISOString() },
  { id: 'b5', name: 'Ahmed Hassan', email: 'ahmed@dubaitrade.ae', phone: '+97150123456', company: 'Dubai Trade Co', type: 'b2b', region: 'Asia', totalOrders: 67, totalSpent: 120000000, trustScore: 45, status: 'blocked', lastOrder: new Date(Date.now() - 2592000000).toISOString() },
];

function BuyerCard({ buyer }: { buyer: Buyer }) {
  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', notation: 'compact', maximumFractionDigits: 1 }).format(amount);

  const statusColors = {
    active: 'bg-success/10 text-success',
    flagged: 'bg-warning/10 text-warning',
    blocked: 'bg-destructive/10 text-destructive',
  };

  return (
    <motion.div variants={itemVariants} whileHover={{ y: -2 }}>
      <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <Avatar className="h-12 w-12 rounded-xl">
              <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-semibold">
                {buyer.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm sm:text-base">{buyer.name}</h3>
                    <Badge variant="outline" className="text-[10px]">{buyer.type.toUpperCase()}</Badge>
                  </div>
                  {buyer.company && <p className="text-sm text-muted-foreground">{buyer.company}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[buyer.status]}>{buyer.status}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View Profile</DropdownMenuItem>
                      <DropdownMenuItem><MessageSquare className="mr-2 h-4 w-4" /> Contact</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive"><Ban className="mr-2 h-4 w-4" /> Block</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Orders</p>
                  <p className="font-bold">{buyer.totalOrders}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Spent</p>
                  <p className="font-bold text-primary">{formatPrice(buyer.totalSpent)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Trust</p>
                  <div className="flex items-center gap-1">
                    <Star className={cn('h-3 w-3', buyer.trustScore >= 80 ? 'text-warning fill-warning' : 'text-muted-foreground')} />
                    <span className="font-bold">{buyer.trustScore}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Region</p>
                  <p className="font-medium text-sm">{buyer.region}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Buyers() {
  const [activeTab, setActiveTab] = useState('all');

  const stats = {
    total: mockBuyers.length,
    b2b: mockBuyers.filter(b => b.type === 'b2b').length,
    b2c: mockBuyers.filter(b => b.type === 'b2c').length,
    flagged: mockBuyers.filter(b => b.status === 'flagged').length,
  };

  const filteredBuyers = activeTab === 'all' ? mockBuyers :
    activeTab === 'b2b' ? mockBuyers.filter(b => b.type === 'b2b') :
    activeTab === 'b2c' ? mockBuyers.filter(b => b.type === 'b2c') :
    mockBuyers.filter(b => b.status === 'flagged');

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
          <h1 className="text-xl sm:text-2xl font-display font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Buyer Management
          </h1>
          <p className="text-sm text-muted-foreground">Manage buyer profiles and support</p>
        </div>
        <Button className="w-full sm:w-auto">
          <MessageSquare className="mr-2 h-4 w-4" /> Support Center
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Buyers', value: stats.total, icon: Users, color: 'bg-primary/10 text-primary' },
          { label: 'B2B Accounts', value: stats.b2b, icon: ShoppingBag, color: 'bg-info/10 text-info' },
          { label: 'B2C Customers', value: stats.b2c, icon: Users, color: 'bg-accent/10 text-accent' },
          { label: 'Flagged', value: stats.flagged, icon: AlertTriangle, color: 'bg-warning/10 text-warning' },
        ].map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={cn('p-2 rounded-lg', stat.color.split(' ')[0])}>
                    <stat.icon className={cn('h-4 w-4', stat.color.split(' ')[1])} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs & Search */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row gap-3">
            <TabsList className="h-auto p-1">
              <TabsTrigger value="all" className="text-xs sm:text-sm">All Buyers</TabsTrigger>
              <TabsTrigger value="b2b" className="text-xs sm:text-sm">B2B</TabsTrigger>
              <TabsTrigger value="b2c" className="text-xs sm:text-sm">B2C</TabsTrigger>
              <TabsTrigger value="flagged" className="text-xs sm:text-sm">
                Flagged
                {stats.flagged > 0 && <Badge variant="destructive" className="ml-1 h-5 px-1.5">{stats.flagged}</Badge>}
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search buyers..." className="pl-9" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-4">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
              {filteredBuyers.map((buyer) => (
                <BuyerCard key={buyer.id} buyer={buyer} />
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
