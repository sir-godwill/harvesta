import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  FileText,
  ChevronRight,
  Scale,
  ThumbsUp,
  ThumbsDown,
  Upload,
  MoreHorizontal,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
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

interface Dispute {
  id: string;
  orderId: string;
  type: 'quality' | 'delivery' | 'payment' | 'other';
  status: 'open' | 'investigating' | 'escalated' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  buyer: string;
  seller: string;
  amount: number;
  reason: string;
  createdAt: string;
  lastUpdate: string;
}

const mockDisputes: Dispute[] = [
  { id: 'DSP-001', orderId: 'ORD-4521', type: 'quality', status: 'escalated', priority: 'critical', buyer: 'EuroFoods GmbH', seller: 'Kofi Organic Farms', amount: 2500000, reason: 'Product quality below specified grade', createdAt: new Date(Date.now() - 172800000).toISOString(), lastUpdate: new Date().toISOString() },
  { id: 'DSP-002', orderId: 'ORD-4498', type: 'delivery', status: 'investigating', priority: 'high', buyer: 'AsiaSpice Ltd', seller: 'Lagos Agro Export', amount: 1800000, reason: 'Delayed delivery - 15 days past ETA', createdAt: new Date(Date.now() - 432000000).toISOString(), lastUpdate: new Date(Date.now() - 86400000).toISOString() },
  { id: 'DSP-003', orderId: 'ORD-4456', type: 'payment', status: 'open', priority: 'medium', buyer: 'Fresh Imports Co', seller: 'Ethiopian Coffee', amount: 4200000, reason: 'Payment not received by seller', createdAt: new Date(Date.now() - 86400000).toISOString(), lastUpdate: new Date(Date.now() - 3600000).toISOString() },
  { id: 'DSP-004', orderId: 'ORD-4402', type: 'quality', status: 'resolved', priority: 'low', buyer: 'Global Organics', seller: 'Cameroon Cocoa', amount: 890000, reason: 'Packaging damaged on arrival', createdAt: new Date(Date.now() - 604800000).toISOString(), lastUpdate: new Date(Date.now() - 172800000).toISOString() },
];

function DisputeCard({ dispute }: { dispute: Dispute }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount);

  const statusColors = {
    open: 'bg-warning/10 text-warning border-warning/30',
    investigating: 'bg-info/10 text-info border-info/30',
    escalated: 'bg-destructive/10 text-destructive border-destructive/30',
    resolved: 'bg-success/10 text-success border-success/30',
    closed: 'bg-muted text-muted-foreground border-muted',
  };

  const priorityColors = {
    low: 'text-muted-foreground',
    medium: 'text-warning',
    high: 'text-orange-500',
    critical: 'text-destructive',
  };

  const typeIcons = {
    quality: AlertCircle,
    delivery: Clock,
    payment: Scale,
    other: AlertTriangle,
  };

  const TypeIcon = typeIcons[dispute.type];

  return (
    <motion.div variants={itemVariants} layout>
      <Card className={cn('overflow-hidden border-l-4 transition-all', statusColors[dispute.status].split(' ')[2])}>
        <CardContent className="p-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-4 text-left flex items-start gap-3 hover:bg-muted/30 transition-colors"
          >
            <div className={cn('p-2 rounded-lg', statusColors[dispute.status].split(' ').slice(0, 2).join(' '))}>
              <TypeIcon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono font-medium text-sm">{dispute.id}</span>
                <Badge variant="outline" className="text-[10px]">{dispute.type}</Badge>
                <span className={cn('text-xs font-medium', priorityColors[dispute.priority])}>
                  {dispute.priority.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{dispute.reason}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>{dispute.buyer}</span>
                <span>vs</span>
                <span>{dispute.seller}</span>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="font-bold">{formatPrice(dispute.amount)}</p>
              <Badge className={statusColors[dispute.status]}>{dispute.status}</Badge>
            </div>
            <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 border-t bg-muted/20">
                  <div className="grid sm:grid-cols-3 gap-4 py-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Order ID</p>
                      <p className="font-medium">{dispute.orderId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Dispute Value</p>
                      <p className="font-bold text-primary">{formatPrice(dispute.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Last Updated</p>
                      <p className="font-medium">{new Date(dispute.lastUpdate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Textarea placeholder="Add a note or resolution..." className="min-h-[80px]" />
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4 mr-1" /> Add Evidence
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" /> Message Parties
                      </Button>
                      <Button size="sm" className="bg-success hover:bg-success/90">
                        <ThumbsUp className="h-4 w-4 mr-1" /> Resolve for Buyer
                      </Button>
                      <Button size="sm" variant="destructive">
                        <ThumbsDown className="h-4 w-4 mr-1" /> Resolve for Seller
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Disputes() {
  const [activeTab, setActiveTab] = useState('all');

  const stats = {
    total: mockDisputes.length,
    open: mockDisputes.filter(d => d.status === 'open').length,
    escalated: mockDisputes.filter(d => d.status === 'escalated').length,
    resolved: mockDisputes.filter(d => d.status === 'resolved').length,
  };

  const filteredDisputes = activeTab === 'all' ? mockDisputes :
    mockDisputes.filter(d => d.status === activeTab);

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
            <AlertTriangle className="h-6 w-6 text-warning" />
            Dispute Resolution
          </h1>
          <p className="text-sm text-muted-foreground">Manage disputes, mediation, and resolutions</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <FileText className="mr-2 h-4 w-4" /> Resolution Guidelines
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Disputes', value: stats.total, icon: Scale, color: 'bg-primary/10 text-primary' },
          { label: 'Open', value: stats.open, icon: Clock, color: 'bg-warning/10 text-warning' },
          { label: 'Escalated', value: stats.escalated, icon: AlertTriangle, color: 'bg-destructive/10 text-destructive' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'bg-success/10 text-success' },
        ].map((stat) => (
          <motion.div key={stat.label} variants={itemVariants} whileHover={{ y: -2 }}>
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
            <TabsList className="h-auto p-1 flex-wrap justify-start">
              <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
              <TabsTrigger value="open" className="text-xs sm:text-sm">Open</TabsTrigger>
              <TabsTrigger value="investigating" className="text-xs sm:text-sm">Investigating</TabsTrigger>
              <TabsTrigger value="escalated" className="text-xs sm:text-sm">
                Escalated
                {stats.escalated > 0 && <Badge variant="destructive" className="ml-1 h-5 px-1.5">{stats.escalated}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="resolved" className="text-xs sm:text-sm">Resolved</TabsTrigger>
            </TabsList>
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search disputes..." className="pl-9" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-4">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
              {filteredDisputes.map((dispute) => (
                <DisputeCard key={dispute.id} dispute={dispute} />
              ))}
              {filteredDisputes.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>No disputes found</p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
