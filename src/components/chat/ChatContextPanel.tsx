import { useState, useEffect } from 'react';
import { X, Package, FileText, Truck, Star, MapPin, Calendar, DollarSign, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChatContext, fetchChatContext } from '@/lib/chat-api';
import { format, formatDistanceToNow } from 'date-fns';

interface ChatContextPanelProps { 
  context?: ChatContext; 
  onClose: () => void; 
}

export function ChatContextPanel({ context, onClose }: ChatContextPanelProps) {
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (context && context.type !== 'general') { 
      setLoading(true); 
      fetchChatContext(context).then(setData).finally(() => setLoading(false)); 
    }
  }, [context]);

  if (!context || context.type === 'general') {
    return (
      <div className="h-full flex flex-col bg-card border-l border-border">
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <h3 className="font-semibold">Chat Info</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <p className="text-sm">No context available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card border-l border-border w-80">
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <h3 className="font-semibold">{context.type.charAt(0).toUpperCase() + context.type.slice(1)} Details</h3>
        <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
      </div>
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="p-4 space-y-4">
            <div className="h-20 bg-muted animate-pulse rounded-lg" />
            <div className="h-32 bg-muted animate-pulse rounded-lg" />
          </div>
        ) : data && (
          <div className="p-4 space-y-4">
            {context.type === 'product' && (
              <>
                <div className="aspect-video rounded-lg bg-muted overflow-hidden">
                  <img src={data.image || '/placeholder.svg'} alt={data.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{data.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{data.rating}</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-green-600">{data.currency} {data.price?.toLocaleString()}</span>
                    <span className="text-muted-foreground">/{data.unit}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">Make Offer</Button>
                  <Button variant="outline" className="flex-1"><ExternalLink className="w-4 h-4 mr-2" />View</Button>
                </div>
              </>
            )}
            {context.type === 'order' && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Number</p>
                    <p className="font-mono font-semibold">{data.orderNumber}</p>
                  </div>
                  <Badge className="bg-green-600 text-white capitalize">{data.status?.replace('-', ' ')}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold text-green-600">{data.currency} {data.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">Track Order</Button>
                  <Button variant="outline" className="flex-1">View Invoice</Button>
                </div>
              </>
            )}
            {context.type === 'rfq' && (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-5 h-5 text-orange-500" />
                    <Badge variant={data.status === 'open' ? 'default' : 'secondary'} className="capitalize">{data.status}</Badge>
                  </div>
                  <h4 className="font-semibold">{data.title}</h4>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="text-muted-foreground">Quantity: </span>
                      <span className="font-medium">{data.quantity?.toLocaleString()} {data.unit}</span>
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-orange-500 hover:bg-orange-600">View All Quotes</Button>
                </div>
              </>
            )}
            {context.type === 'delivery' && (
              <>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Tracking Number</p>
                  <p className="font-mono font-semibold">{data.trackingNumber}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{data.carrier}</p>
                    <p className="text-xs text-muted-foreground">Carrier</p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                      <MapPin className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Delivery</p>
                      <p className="text-sm font-medium">{data.deliveryLocation}</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <ExternalLink className="w-4 h-4 mr-2" />Track on Map
                </Button>
              </>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
