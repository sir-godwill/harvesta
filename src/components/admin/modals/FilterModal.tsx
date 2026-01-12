import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'sellers' | 'products' | 'orders' | 'buyers' | 'shipments';
  onApply?: (filters: Record<string, any>) => void;
}

export function FilterModal({ open, onOpenChange, type, onApply }: FilterModalProps) {
  const [filters, setFilters] = useState<Record<string, any>>({
    status: [],
    region: '',
    dateRange: '30d',
    minAmount: 0,
    maxAmount: 10000000,
  });

  const statusOptions = {
    sellers: ['active', 'pending', 'suspended'],
    products: ['live', 'pending', 'draft', 'rejected'],
    orders: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    buyers: ['active', 'flagged', 'blocked'],
    shipments: ['pending', 'in_transit', 'delivered', 'delayed'],
  };

  const regionOptions = ['West Africa', 'East Africa', 'Europe', 'Americas', 'Asia', 'Middle East'];

  const handleStatusToggle = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s: string) => s !== status)
        : [...prev.status, status]
    }));
  };

  const handleApply = () => {
    onApply?.(filters);
    toast.success('Filters applied');
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilters({
      status: [],
      region: '',
      dateRange: '30d',
      minAmount: 0,
      maxAmount: 10000000,
    });
  };

  const activeFilterCount = filters.status.length + (filters.region ? 1 : 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount} active</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Filter */}
          <div className="space-y-3">
            <Label>Status</Label>
            <div className="flex flex-wrap gap-2">
              {statusOptions[type].map((status) => (
                <Badge
                  key={status}
                  variant={filters.status.includes(status) ? 'default' : 'outline'}
                  className="cursor-pointer capitalize"
                  onClick={() => handleStatusToggle(status)}
                >
                  {status.replace('_', ' ')}
                  {filters.status.includes(status) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Region Filter */}
          <div className="space-y-2">
            <Label>Region</Label>
            <Select value={filters.region} onValueChange={(value) => setFilters({ ...filters, region: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All regions</SelectItem>
                {regionOptions.map((region) => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Select value={filters.dateRange} onValueChange={(value) => setFilters({ ...filters, dateRange: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount Range */}
          {(type === 'orders' || type === 'buyers') && (
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Amount Range</Label>
                <span className="text-sm text-muted-foreground">
                  {filters.minAmount.toLocaleString()} - {filters.maxAmount.toLocaleString()} XAF
                </span>
              </div>
              <Slider
                value={[filters.minAmount, filters.maxAmount]}
                min={0}
                max={10000000}
                step={100000}
                onValueChange={([min, max]) => setFilters({ ...filters, minAmount: min, maxAmount: max })}
                className="mt-2"
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
