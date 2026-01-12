import { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Plus, Star, MapPin, Phone, Mail, MoreHorizontal, Eye, Edit, Ban, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

interface Carrier {
  id: string;
  name: string;
  type: 'air' | 'sea' | 'road' | 'rail';
  coverage: string[];
  rating: number;
  totalShipments: number;
  onTimeRate: number;
  status: 'active' | 'suspended';
  contact: { phone: string; email: string };
}

const mockCarriers: Carrier[] = [
  { id: '1', name: 'DHL Africa Express', type: 'air', coverage: ['West Africa', 'Europe', 'Americas'], rating: 4.8, totalShipments: 2456, onTimeRate: 94, status: 'active', contact: { phone: '+237 6XX XXX XXX', email: 'africa@dhl.com' } },
  { id: '2', name: 'Maersk Line', type: 'sea', coverage: ['Global'], rating: 4.5, totalShipments: 1823, onTimeRate: 89, status: 'active', contact: { phone: '+237 6XX XXX XXX', email: 'africa@maersk.com' } },
  { id: '3', name: 'TransAfrica Logistics', type: 'road', coverage: ['West Africa', 'Central Africa'], rating: 4.2, totalShipments: 3241, onTimeRate: 85, status: 'active', contact: { phone: '+237 6XX XXX XXX', email: 'info@transafrica.cm' } },
  { id: '4', name: 'Kenya Railways', type: 'rail', coverage: ['East Africa'], rating: 3.9, totalShipments: 567, onTimeRate: 78, status: 'suspended', contact: { phone: '+254 XXX XXX XXX', email: 'cargo@krc.co.ke' } },
];

const typeColors = {
  air: 'bg-info/10 text-info',
  sea: 'bg-primary/10 text-primary',
  road: 'bg-warning/10 text-warning',
  rail: 'bg-accent/10 text-accent',
};

export default function Carriers() {
  const [carriers, setCarriers] = useState(mockCarriers);

  const handleSuspend = (id: string) => {
    setCarriers(prev => prev.map(c => c.id === id ? { ...c, status: 'suspended' as const } : c));
    toast.success('Carrier suspended');
  };

  const handleActivate = (id: string) => {
    setCarriers(prev => prev.map(c => c.id === id ? { ...c, status: 'active' as const } : c));
    toast.success('Carrier activated');
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" />
            Carrier Partners
          </h1>
          <p className="text-muted-foreground">Manage logistics and shipping partners</p>
        </div>
        <Button onClick={() => toast.info('Add carrier form coming soon')}>
          <Plus className="mr-2 h-4 w-4" />Add Carrier
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Carriers', value: carriers.length, color: 'text-primary' },
          { label: 'Active', value: carriers.filter(c => c.status === 'active').length, color: 'text-success' },
          { label: 'Avg. On-Time Rate', value: `${Math.round(carriers.reduce((a, c) => a + c.onTimeRate, 0) / carriers.length)}%`, color: 'text-info' },
          { label: 'Total Shipments', value: carriers.reduce((a, c) => a + c.totalShipments, 0).toLocaleString(), color: 'text-accent' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Carriers Grid */}
      <motion.div variants={itemVariants} className="grid sm:grid-cols-2 gap-4">
        {carriers.map((carrier) => (
          <Card key={carrier.id} className={cn(carrier.status === 'suspended' && 'opacity-60')}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 rounded-xl">
                  <AvatarFallback className="rounded-xl bg-primary/10 text-primary text-lg">
                    {carrier.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{carrier.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={typeColors[carrier.type]} variant="secondary">
                          {carrier.type}
                        </Badge>
                        <Badge variant={carrier.status === 'active' ? 'default' : 'destructive'}>
                          {carrier.status}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toast.info('View details coming soon')}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info('Edit form coming soon')}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        {carrier.status === 'active' ? (
                          <DropdownMenuItem className="text-destructive" onClick={() => handleSuspend(carrier.id)}>
                            <Ban className="mr-2 h-4 w-4" /> Suspend
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleActivate(carrier.id)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Activate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {carrier.coverage.map((region) => (
                      <span key={region} className="text-xs px-2 py-0.5 bg-muted rounded-full">
                        {region}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t">
                    <div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-warning fill-warning" />
                        <span className="font-bold">{carrier.rating}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Rating</p>
                    </div>
                    <div>
                      <p className="font-bold">{carrier.totalShipments.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">Shipments</p>
                    </div>
                    <div>
                      <p className="font-bold">{carrier.onTimeRate}%</p>
                      <p className="text-[10px] text-muted-foreground">On-Time</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Progress value={carrier.onTimeRate} className="h-1.5" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </motion.div>
  );
}
