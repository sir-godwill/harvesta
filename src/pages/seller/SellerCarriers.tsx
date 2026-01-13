import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Truck,
  Plus,
  Search,
  Star,
  Clock,
  MapPin,
  DollarSign,
  MoreVertical,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Globe,
  Package,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SellerLayout } from '@/components/seller/SellerLayout';
import { mockSellerCarriers, SellerCarrier } from '@/services/seller-api';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount);
};

export default function SellerCarriers() {
  const [carriers, setCarriers] = useState(mockSellerCarriers);
  const [searchTerm, setSearchTerm] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const filteredCarriers = carriers.filter((carrier) =>
    carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carrier.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCarrierStatus = (id: string) => {
    setCarriers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Logistics Carriers</h1>
            <p className="text-muted-foreground">Manage your shipping partners</p>
          </div>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Carrier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Carrier</DialogTitle>
                <DialogDescription>
                  Connect a new logistics partner to your store.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Carrier Name</Label>
                    <Input placeholder="e.g., DHL Express" />
                  </div>
                  <div className="space-y-2">
                    <Label>Carrier Code</Label>
                    <Input placeholder="e.g., DHL" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Service Types</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="air">Air Freight</SelectItem>
                      <SelectItem value="sea">Sea Freight</SelectItem>
                      <SelectItem value="express">Express Delivery</SelectItem>
                      <SelectItem value="standard">Standard Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Base Rate (XAF)</Label>
                    <Input type="number" placeholder="50000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Per KG Rate (XAF)</Label>
                    <Input type="number" placeholder="5000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Coverage Regions</Label>
                  <Input placeholder="e.g., Europe, Asia, Americas" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => setAddDialogOpen(false)}>
                  Add Carrier
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search carriers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Carriers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCarriers.map((carrier, index) => (
            <motion.div
              key={carrier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={!carrier.isActive ? 'opacity-60' : ''}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                        {carrier.code.substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{carrier.name}</h3>
                        <p className="text-sm text-muted-foreground">{carrier.code}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleCarrierStatus(carrier.id)}>
                          {carrier.isActive ? (
                            <>
                              <ToggleLeft className="w-4 h-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <ToggleRight className="w-4 h-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant={carrier.isActive ? 'default' : 'secondary'} className={carrier.isActive ? 'bg-green-600' : ''}>
                      {carrier.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {carrier.serviceTypes.slice(0, 2).map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Star className="w-4 h-4" />
                        Rating
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{carrier.rating}</span>
                        <span className="text-muted-foreground">/ 5.0</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        On-time Rate
                      </div>
                      <span className="font-medium text-green-600">{carrier.onTimeRate}%</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        Base Rate
                      </div>
                      <span className="font-medium">{formatCurrency(carrier.baseRate)}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="w-4 h-4" />
                        Per KG
                      </div>
                      <span className="font-medium">{formatCurrency(carrier.perKgRate)}</span>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Globe className="w-4 h-4" />
                        <span className="truncate">{carrier.coverageRegions.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCarriers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No carriers found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search term.' : 'Add your first logistics carrier to get started.'}
              </p>
              {!searchTerm && (
                <Button className="bg-green-600 hover:bg-green-700" onClick={() => setAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Carrier
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </SellerLayout>
  );
}
