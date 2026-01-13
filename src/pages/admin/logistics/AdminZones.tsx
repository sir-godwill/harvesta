import { motion } from 'framer-motion';
import { MapPin, Plus, Edit2, Truck, DollarSign, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

const mockZones = [
  { id: '1', name: 'West Africa', countries: ['Nigeria', 'Ghana', 'Senegal'], baseRate: 25, deliveryDays: '5-7', active: true },
  { id: '2', name: 'East Africa', countries: ['Kenya', 'Tanzania', 'Uganda'], baseRate: 30, deliveryDays: '4-6', active: true },
  { id: '3', name: 'Europe', countries: ['UK', 'Germany', 'France', 'Netherlands'], baseRate: 85, deliveryDays: '7-10', active: true },
  { id: '4', name: 'North America', countries: ['USA', 'Canada'], baseRate: 95, deliveryDays: '8-12', active: true },
  { id: '5', name: 'Middle East', countries: ['UAE', 'Saudi Arabia', 'Qatar'], baseRate: 70, deliveryDays: '6-8', active: false },
];

export default function AdminZones() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">Shipping Zones</h1>
          <p className="text-muted-foreground">Manage delivery zones and shipping rates</p>
        </div>
        <Button><Plus className="mr-2 h-4 w-4" />Add Zone</Button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockZones.map((zone) => (
          <Card key={zone.id} className={`${!zone.active && 'opacity-60'}`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {zone.name}
                </CardTitle>
                <Badge variant={zone.active ? 'default' : 'secondary'}>{zone.active ? 'Active' : 'Inactive'}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-1">
                {zone.countries.map((c) => <span key={c} className="text-xs px-2 py-1 bg-muted rounded-full">{c}</span>)}
              </div>
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground"><DollarSign className="h-4 w-4" />${zone.baseRate}/kg</span>
                <span className="flex items-center gap-1 text-muted-foreground"><Clock className="h-4 w-4" />{zone.deliveryDays} days</span>
              </div>
              <Button variant="outline" size="sm" className="w-full"><Edit2 className="mr-1 h-4 w-4" />Edit Zone</Button>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </motion.div>
  );
}
