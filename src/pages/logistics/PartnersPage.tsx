import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Search, MoreHorizontal, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { fetchPartners, type LogisticsPartner } from '@/services/logistics-api';

export default function PartnersPage() {
  const { toast } = useToast();
  const [partners, setPartners] = useState<LogisticsPartner[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<LogisticsPartner | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await fetchPartners();
        setPartners(data);
      } catch (error) {
        console.error('Failed to load partners:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssignJob = () => {
    toast({ title: 'Job assigned', description: 'Job assigned to partner successfully' });
  };

  const handleToggleStatus = () => {
    toast({
      title: selectedPartner?.isActive ? 'Partner suspended' : 'Partner activated',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Logistics Partners</h1>
            <p className="text-muted-foreground">Partner management and performance</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Partner
          </Button>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search partners..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Partners List */}
          <div className="lg:col-span-2 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredPartners.map((partner, index) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`cursor-pointer transition-all ${
                      selectedPartner?.id === partner.id
                        ? 'ring-2 ring-primary'
                        : 'hover:bg-muted/30'
                    }`}
                    onClick={() => setSelectedPartner(partner)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm">{partner.name}</h4>
                            <p className="text-xs text-muted-foreground capitalize">
                              {partner.type}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`h-2.5 w-2.5 rounded-full ${
                            partner.isActive ? 'bg-emerald-500' : 'bg-muted-foreground'
                          }`}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded bg-muted/30 p-2">
                          <p className="text-sm font-semibold">{partner.rating}</p>
                          <p className="text-[10px] text-muted-foreground">Rating</p>
                        </div>
                        <div className="rounded bg-muted/30 p-2">
                          <p className="text-sm font-semibold">{partner.onTimeRate}%</p>
                          <p className="text-[10px] text-muted-foreground">On-Time</p>
                        </div>
                        <div className="rounded bg-muted/30 p-2">
                          <p className="text-sm font-semibold">{partner.totalDeliveries}</p>
                          <p className="text-[10px] text-muted-foreground">Deliveries</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-[10px]">
                          {partner.type}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Partner Detail */}
          <div>
            {selectedPartner ? (
              <Card className="sticky top-4">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Partner Details</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleAssignJob}>
                          Assign Job Manually
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleToggleStatus}>
                          {selectedPartner.isActive ? 'Suspend Partner' : 'Enable Partner'}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Remove Partner
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedPartner.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={selectedPartner.isActive ? 'default' : 'secondary'}>
                          {selectedPartner.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="text-xs text-muted-foreground capitalize">
                          {selectedPartner.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Rating</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          {selectedPartner.rating}
                        </span>
                      </div>
                      <Progress value={selectedPartner.rating * 20} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>On-Time Rate</span>
                        <span>{selectedPartner.onTimeRate}%</span>
                      </div>
                      <Progress value={selectedPartner.onTimeRate} className="h-2" />
                    </div>
                  </div>

                  <div className="pt-3 border-t space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Deliveries</span>
                      <span>{selectedPartner.totalDeliveries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="text-xs capitalize">{selectedPartner.type}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <Button className="flex-1" variant="outline">
                      View History
                    </Button>
                    <Button className="flex-1" onClick={handleAssignJob}>
                      Assign Job
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Select a partner to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
