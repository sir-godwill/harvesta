import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, User, Store, Calendar, DollarSign, MessageSquare } from 'lucide-react';
import { Dispute, resolveDispute } from '@/lib/admin-api';
import { toast } from 'sonner';

interface DisputeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dispute: Dispute | null;
  onResolved?: () => void;
}

const statusColors: Record<string, string> = {
  open: 'bg-yellow-500/10 text-yellow-600 border-yellow-200',
  under_review: 'bg-blue-500/10 text-blue-600 border-blue-200',
  resolved: 'bg-green-500/10 text-green-600 border-green-200',
  escalated: 'bg-red-500/10 text-red-600 border-red-200',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-500/10 text-gray-600',
  medium: 'bg-yellow-500/10 text-yellow-600',
  high: 'bg-red-500/10 text-red-600',
};

export function DisputeModal({ open, onOpenChange, dispute, onResolved }: DisputeModalProps) {
  const [resolution, setResolution] = useState('');
  const [resolutionType, setResolutionType] = useState('');
  const [loading, setLoading] = useState(false);

  if (!dispute) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const handleResolve = async () => {
    if (!resolution || !resolutionType) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    await resolveDispute(dispute.id, resolution);
    toast.success('Dispute resolved successfully');
    setLoading(false);
    onOpenChange(false);
    onResolved?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Dispute {dispute.id}
            </DialogTitle>
            <div className="flex gap-2">
              <Badge className={priorityColors[dispute.priority]}>
                {dispute.priority}
              </Badge>
              <Badge className={statusColors[dispute.status]}>
                {dispute.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Dispute Info */}
          <Card>
            <CardContent className="pt-4 grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Buyer:</span>
                  <span className="font-medium">{dispute.buyerName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Seller:</span>
                  <span className="font-medium">{dispute.sellerName}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{new Date(dispute.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">{formatCurrency(dispute.amount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reason */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Dispute Reason
            </h4>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              {dispute.reason}
            </p>
          </div>

          {/* Resolution Form */}
          {dispute.status !== 'resolved' && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Resolution Type</Label>
                <Select value={resolutionType} onValueChange={setResolutionType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select resolution type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_refund">Full Refund to Buyer</SelectItem>
                    <SelectItem value="partial_refund">Partial Refund</SelectItem>
                    <SelectItem value="replacement">Product Replacement</SelectItem>
                    <SelectItem value="seller_favor">Resolved in Seller's Favor</SelectItem>
                    <SelectItem value="mutual">Mutual Agreement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Resolution Notes</Label>
                <Textarea
                  placeholder="Describe the resolution..."
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {dispute.status !== 'resolved' && (
            <>
              {dispute.status !== 'escalated' && (
                <Button variant="destructive">Escalate</Button>
              )}
              <Button onClick={handleResolve} disabled={loading}>
                {loading ? 'Resolving...' : 'Resolve Dispute'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
