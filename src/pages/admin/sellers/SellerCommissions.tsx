import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Percent, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  Save,
  Plus,
  Edit2,
  Trash2,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface CommissionTier {
  id: string;
  name: string;
  minSales: number;
  maxSales: number;
  rate: number;
}

const mockTiers: CommissionTier[] = [
  { id: '1', name: 'Starter', minSales: 0, maxSales: 5000, rate: 15 },
  { id: '2', name: 'Bronze', minSales: 5001, maxSales: 20000, rate: 12 },
  { id: '3', name: 'Silver', minSales: 20001, maxSales: 50000, rate: 10 },
  { id: '4', name: 'Gold', minSales: 50001, maxSales: 100000, rate: 8 },
  { id: '5', name: 'Platinum', minSales: 100001, maxSales: 999999999, rate: 5 },
];

const categoryRates = [
  { category: 'Grains & Cereals', rate: 10 },
  { category: 'Vegetables', rate: 12 },
  { category: 'Fruits', rate: 12 },
  { category: 'Legumes', rate: 10 },
  { category: 'Spices & Herbs', rate: 15 },
  { category: 'Oils & Fats', rate: 8 },
  { category: 'Dairy Products', rate: 10 },
];

export default function SellerCommissions() {
  const [tiers, setTiers] = useState(mockTiers);
  const [defaultRate, setDefaultRate] = useState('10');
  const [autoTiering, setAutoTiering] = useState(true);
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');

  const handleSaveSettings = () => {
    toast.success('Commission settings saved successfully!');
  };

  const stats = {
    totalCommissions: 45280,
    avgRate: 10.5,
    topTier: 'Gold',
    pendingPayouts: 12450,
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold">Commission Management</h1>
        <p className="text-muted-foreground">Configure seller commission rates and payment structures</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <DollarSign className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Earned</p>
              <p className="text-xl font-bold">${stats.totalCommissions.toLocaleString()}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Percent className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Rate</p>
              <p className="text-xl font-bold">{stats.avgRate}%</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <TrendingUp className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Top Tier</p>
              <p className="text-xl font-bold">{stats.topTier}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <DollarSign className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-xl font-bold">${stats.pendingPayouts.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Commission Settings */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          {/* Tier Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Commission Tiers</CardTitle>
                  <CardDescription>Rate decreases as seller volume increases</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Tier
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tier</TableHead>
                    <TableHead>Sales Range</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tiers.map((tier) => (
                    <TableRow key={tier.id}>
                      <TableCell className="font-medium">{tier.name}</TableCell>
                      <TableCell>
                        ${tier.minSales.toLocaleString()} - {tier.maxSales > 999999 ? '∞' : `$${tier.maxSales.toLocaleString()}`}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-primary/10 text-primary">
                          {tier.rate}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Category Rates */}
          <Card>
            <CardHeader>
              <CardTitle>Category-Based Rates</CardTitle>
              <CardDescription>Override rates for specific product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoryRates.map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">{cat.category}</span>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        className="w-20 h-8 text-center" 
                        defaultValue={cat.rate}
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings Panel */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Default Commission Rate</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={defaultRate}
                    onChange={(e) => setDefaultRate(e.target.value)}
                    className="w-24"
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Frequency</Label>
                <Select value={paymentFrequency} onValueChange={setPaymentFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Tier Upgrade</p>
                  <p className="text-sm text-muted-foreground">Automatically upgrade seller tiers</p>
                </div>
                <Switch checked={autoTiering} onCheckedChange={setAutoTiering} />
              </div>

              <div className="pt-4 border-t">
                <Button onClick={handleSaveSettings} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </div>

              <div className="p-3 bg-info/10 rounded-lg flex items-start gap-2">
                <Info className="h-4 w-4 text-info mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Commission rates are applied at checkout and deducted from seller payouts automatically.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
