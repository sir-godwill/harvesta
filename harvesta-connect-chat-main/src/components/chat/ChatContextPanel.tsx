import { useState, useEffect } from 'react';
import { X, Package, FileText, Truck, AlertTriangle, Star, MapPin, Calendar, DollarSign, Users, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      fetchChatContext(context)
        .then(setData)
        .finally(() => setLoading(false));
    }
  }, [context]);

  if (!context || context.type === 'general') {
    return (
      <div className="h-full flex flex-col bg-card border-l border-border">
        <PanelHeader title="Chat Info" onClose={onClose} />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <p className="text-sm">No context available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card border-l border-border w-80">
      <PanelHeader 
        title={context.type.charAt(0).toUpperCase() + context.type.slice(1) + ' Details'} 
        onClose={onClose} 
      />
      
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="p-4 space-y-4">
            <div className="h-20 bg-muted animate-pulse rounded-lg" />
            <div className="h-32 bg-muted animate-pulse rounded-lg" />
          </div>
        ) : data && (
          <>
            {context.type === 'product' && <ProductDetails data={data} />}
            {context.type === 'order' && <OrderDetails data={data} />}
            {context.type === 'rfq' && <RFQDetails data={data} />}
            {context.type === 'delivery' && <DeliveryDetails data={data} />}
          </>
        )}
      </ScrollArea>
    </div>
  );
}

function PanelHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
      <h3 className="font-semibold">{title}</h3>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}

function ProductDetails({ data }: { data: Record<string, any> }) {
  return (
    <div className="p-4 space-y-4">
      {/* Product Image */}
      <div className="aspect-video rounded-lg bg-muted overflow-hidden">
        <img 
          src={data.image || '/placeholder.svg'} 
          alt={data.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div>
        <h4 className="font-semibold text-lg">{data.name}</h4>
        <div className="flex items-center gap-2 mt-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-medium">{data.rating}</span>
          <span className="text-sm text-muted-foreground">({data.reviewCount} reviews)</span>
        </div>
      </div>

      <Separator />

      {/* Pricing */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-primary">
            {data.currency} {data.price?.toLocaleString()}
          </span>
          <span className="text-muted-foreground">/{data.unit}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">MOQ: </span>
            <span className="font-medium">{data.minOrder} {data.unit}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Available: </span>
            <span className="font-medium text-primary">{data.availableQuantity} {data.unit}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Seller Info */}
      <div className="p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-role-seller flex items-center justify-center text-white font-semibold">
            {data.seller?.name?.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{data.seller?.name}</p>
            <p className="text-xs text-muted-foreground">Verified Seller</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button className="flex-1">Make Offer</Button>
        <Button variant="outline" className="flex-1">
          <ExternalLink className="w-4 h-4 mr-2" />
          View Product
        </Button>
      </div>
    </div>
  );
}

function OrderDetails({ data }: { data: Record<string, any> }) {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-primary',
    'in-transit': 'bg-role-logistics',
    delivered: 'bg-chat-online',
    cancelled: 'bg-destructive',
  };

  return (
    <div className="p-4 space-y-4">
      {/* Order Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Order Number</p>
          <p className="font-mono font-semibold">{data.orderNumber}</p>
        </div>
        <Badge className={cn(statusColors[data.status], "text-white capitalize")}>
          {data.status?.replace('-', ' ')}
        </Badge>
      </div>

      <Separator />

      {/* Items */}
      <div>
        <h5 className="font-medium mb-2">Items</h5>
        <div className="space-y-2">
          {data.items?.map((item: any, i: number) => (
            <div key={i} className="flex justify-between text-sm p-2 bg-muted/50 rounded">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-muted-foreground">{item.quantity} {item.unit}</p>
              </div>
              <p className="font-medium">{data.currency} {item.price?.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="font-medium">Total</span>
        <span className="text-xl font-bold text-primary">
          {data.currency} {data.totalAmount?.toLocaleString()}
        </span>
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Ordered:</span>
          <span>{data.createdAt && format(new Date(data.createdAt), 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Truck className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">ETA:</span>
          <span className="text-primary font-medium">
            {data.estimatedDelivery && format(new Date(data.estimatedDelivery), 'MMM dd, yyyy')}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1">Track Order</Button>
        <Button variant="outline" className="flex-1">View Invoice</Button>
      </div>
    </div>
  );
}

function RFQDetails({ data }: { data: Record<string, any> }) {
  const isOpen = data.status === 'open';
  const timeLeft = data.deadline ? formatDistanceToNow(new Date(data.deadline)) : '';

  return (
    <div className="p-4 space-y-4">
      {/* RFQ Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-5 h-5 text-secondary" />
          <Badge variant={isOpen ? 'default' : 'secondary'} className="capitalize">
            {data.status}
          </Badge>
        </div>
        <h4 className="font-semibold">{data.title}</h4>
      </div>

      <Separator />

      {/* Requirements */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">
            <span className="text-muted-foreground">Quantity: </span>
            <span className="font-medium">{data.quantity?.toLocaleString()} {data.unit}</span>
          </span>
        </div>

        {data.budget && (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              <span className="text-muted-foreground">Budget: </span>
              <span className="font-medium">
                {data.budget.currency} {data.budget.min?.toLocaleString()} - {data.budget.max?.toLocaleString()}
              </span>
            </span>
          </div>
        )}
      </div>

      <Separator />

      {/* Deadline */}
      {isOpen && (
        <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/30">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium">Deadline</span>
          </div>
          <p className="text-lg font-bold text-secondary">{timeLeft} left</p>
          <p className="text-xs text-muted-foreground">
            {data.deadline && format(new Date(data.deadline), 'MMMM dd, yyyy - h:mm a')}
          </p>
        </div>
      )}

      {/* Quotes Received */}
      <div className="p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Quotes Received</span>
          <span className="text-lg font-bold text-primary">{data.quotesReceived}</span>
        </div>
        <Progress value={(data.quotesReceived / 10) * 100} className="h-2" />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button className="flex-1">View All Quotes</Button>
        <Button variant="outline" className="flex-1">
          <ExternalLink className="w-4 h-4 mr-2" />
          View RFQ
        </Button>
      </div>
    </div>
  );
}

function DeliveryDetails({ data }: { data: Record<string, any> }) {
  const statusSteps = ['confirmed', 'packaging', 'picked-up', 'in-transit', 'delivered'];
  const currentStep = statusSteps.indexOf(data.status);
  const progress = ((currentStep + 1) / statusSteps.length) * 100;

  return (
    <div className="p-4 space-y-4">
      {/* Tracking Number */}
      <div className="p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">Tracking Number</p>
        <p className="font-mono font-semibold">{data.trackingNumber}</p>
      </div>

      {/* Carrier */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-role-logistics flex items-center justify-center">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-medium">{data.carrier}</p>
          <p className="text-xs text-muted-foreground">Carrier</p>
        </div>
      </div>

      <Separator />

      {/* Progress */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium capitalize">{data.status?.replace('-', ' ')}</span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Locations */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Pickup</p>
            <p className="text-sm font-medium">{data.pickupLocation}</p>
          </div>
        </div>

        {data.currentLocation && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center mt-0.5">
              <Truck className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current Location</p>
              <p className="text-sm font-medium">{data.currentLocation}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-chat-online/20 flex items-center justify-center mt-0.5">
            <MapPin className="w-4 h-4 text-chat-online" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Delivery</p>
            <p className="text-sm font-medium">{data.deliveryLocation}</p>
          </div>
        </div>
      </div>

      {/* ETA */}
      <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Estimated Delivery</span>
        </div>
        <p className="text-lg font-bold text-primary mt-1">
          {data.estimatedDelivery && format(new Date(data.estimatedDelivery), 'MMMM dd, yyyy')}
        </p>
      </div>

      {/* Actions */}
      <Button className="w-full">
        <ExternalLink className="w-4 h-4 mr-2" />
        Track on Map
      </Button>
    </div>
  );
}
