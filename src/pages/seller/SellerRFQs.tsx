import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, Clock, CheckCircle, XCircle, MessageSquare, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { toast } from 'sonner';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const mockRFQs = [
  {
    id: 'RFQ-001',
    product: 'Organic Tomatoes',
    buyer: 'Fresh Markets Inc',
    quantity: '500 kg',
    targetPrice: '12,000 XAF/kg',
    deadline: '2024-01-20',
    status: 'pending',
    message: 'Looking for premium quality organic tomatoes for our restaurant chain.'
  },
  {
    id: 'RFQ-002',
    product: 'Cassava Flour',
    buyer: 'Global Foods Ltd',
    quantity: '2 tons',
    targetPrice: '8,500 XAF/kg',
    deadline: '2024-01-18',
    status: 'quoted',
    message: 'Need high-grade cassava flour for export.'
  },
  {
    id: 'RFQ-003',
    product: 'Palm Oil',
    buyer: 'Local Supermarket',
    quantity: '200 liters',
    targetPrice: '5,000 XAF/liter',
    deadline: '2024-01-15',
    status: 'accepted',
    message: 'Regular supply needed for retail.'
  },
  {
    id: 'RFQ-004',
    product: 'Cocoa Beans',
    buyer: 'Euro Imports',
    quantity: '1 ton',
    targetPrice: '15,000 XAF/kg',
    deadline: '2024-01-12',
    status: 'expired',
    message: 'Premium grade cocoa for chocolate production.'
  },
];

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  quoted: { color: 'bg-blue-100 text-blue-800', icon: DollarSign },
  accepted: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  rejected: { color: 'bg-red-100 text-red-800', icon: XCircle },
  expired: { color: 'bg-gray-100 text-gray-800', icon: Clock },
};

export default function SellerRFQs() {
  const [activeTab, setActiveTab] = useState('all');

  const handleQuote = (id: string) => {
    toast.success(`Quote submitted for ${id}`);
  };

  const filteredRFQs = activeTab === 'all' 
    ? mockRFQs 
    : mockRFQs.filter(rfq => rfq.status === activeTab);

  return (
    <SellerLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">RFQ Management</h1>
          <p className="text-muted-foreground">Respond to buyer requests for quotation</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Quoted</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-muted-foreground">Won</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">75%</p>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search RFQs..." className="pl-10" />
          </div>
          <Button variant="outline"><Filter className="mr-2 h-4 w-4" />Filter</Button>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="quoted">Quoted</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4 space-y-4">
              {filteredRFQs.map((rfq) => {
                const StatusIcon = statusConfig[rfq.status].icon;
                return (
                  <Card key={rfq.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{rfq.product}</h3>
                            <Badge className={statusConfig[rfq.status].color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{rfq.message}</p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span><strong>Buyer:</strong> {rfq.buyer}</span>
                            <span><strong>Quantity:</strong> {rfq.quantity}</span>
                            <span><strong>Target:</strong> {rfq.targetPrice}</span>
                            <span><strong>Deadline:</strong> {rfq.deadline}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />Chat
                          </Button>
                          {rfq.status === 'pending' && (
                            <Button size="sm" onClick={() => handleQuote(rfq.id)}>
                              <DollarSign className="h-4 w-4 mr-1" />Submit Quote
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </SellerLayout>
  );
}
