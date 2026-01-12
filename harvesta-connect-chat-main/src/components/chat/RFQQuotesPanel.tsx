import { useState, useEffect } from 'react';
import { X, Clock, Check, Star, TrendingDown, TrendingUp, ArrowRight, Award, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow, differenceInSeconds } from 'date-fns';

interface Quote {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  pricePerUnit: number;
  currency: string;
  quantity: number;
  unit: string;
  totalPrice: number;
  deliveryDays: number;
  validUntil: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  isLowestPrice: boolean;
  isFastestDelivery: boolean;
  notes?: string;
  createdAt: Date;
}

interface RFQQuotesPanelProps {
  rfqId: string;
  onClose: () => void;
  onSelectQuote: (quoteId: string) => void;
}

// Mock quotes data
const mockQuotes: Quote[] = [
  {
    id: 'quote_1',
    sellerId: 'seller_1',
    sellerName: 'Kofi Asante Farms',
    sellerRating: 4.8,
    pricePerUnit: 2200,
    currency: 'XAF',
    quantity: 2000,
    unit: 'kg',
    totalPrice: 4400000,
    deliveryDays: 7,
    validUntil: new Date(Date.now() + 86400000 * 2),
    status: 'pending',
    isLowestPrice: true,
    isFastestDelivery: false,
    notes: 'Organic certified, can provide certificates',
    createdAt: new Date(Date.now() - 3600000 * 2),
  },
  {
    id: 'quote_2',
    sellerId: 'seller_2',
    sellerName: 'GreenHarvest Co.',
    sellerRating: 4.5,
    pricePerUnit: 2350,
    currency: 'XAF',
    quantity: 2000,
    unit: 'kg',
    totalPrice: 4700000,
    deliveryDays: 5,
    validUntil: new Date(Date.now() + 86400000 * 3),
    status: 'pending',
    isLowestPrice: false,
    isFastestDelivery: true,
    notes: 'Express delivery available',
    createdAt: new Date(Date.now() - 3600000 * 5),
  },
  {
    id: 'quote_3',
    sellerId: 'seller_3',
    sellerName: 'Cameroon Agri Ltd',
    sellerRating: 4.9,
    pricePerUnit: 2280,
    currency: 'XAF',
    quantity: 2000,
    unit: 'kg',
    totalPrice: 4560000,
    deliveryDays: 10,
    validUntil: new Date(Date.now() + 86400000),
    status: 'pending',
    isLowestPrice: false,
    isFastestDelivery: false,
    notes: 'Premium grade, bulk discount applied',
    createdAt: new Date(Date.now() - 3600000 * 8),
  },
  {
    id: 'quote_4',
    sellerId: 'seller_4',
    sellerName: 'West Africa Produce',
    sellerRating: 4.2,
    pricePerUnit: 2500,
    currency: 'XAF',
    quantity: 2000,
    unit: 'kg',
    totalPrice: 5000000,
    deliveryDays: 14,
    validUntil: new Date(Date.now() - 86400000),
    status: 'expired',
    isLowestPrice: false,
    isFastestDelivery: false,
    createdAt: new Date(Date.now() - 86400000 * 3),
  },
];

export function RFQQuotesPanel({ rfqId, onClose, onSelectQuote }: RFQQuotesPanelProps) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [sortBy, setSortBy] = useState<'price' | 'delivery' | 'rating'>('price');
  const [rfqDeadline] = useState(new Date(Date.now() + 86400000 * 5));
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    // Fetch quotes (mock)
    setQuotes(mockQuotes);
  }, [rfqId]);

  // Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = differenceInSeconds(rfqDeadline, now);
      
      if (diff <= 0) {
        setCountdown('Expired');
        return;
      }

      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      if (days > 0) {
        setCountdown(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setCountdown(`${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [rfqDeadline]);

  const sortedQuotes = [...quotes].sort((a, b) => {
    if (sortBy === 'price') return a.pricePerUnit - b.pricePerUnit;
    if (sortBy === 'delivery') return a.deliveryDays - b.deliveryDays;
    return b.sellerRating - a.sellerRating;
  });

  const activeQuotes = sortedQuotes.filter(q => q.status !== 'expired');
  const lowestPrice = Math.min(...activeQuotes.map(q => q.pricePerUnit));
  const fastestDelivery = Math.min(...activeQuotes.map(q => q.deliveryDays));

  return (
    <div className="h-full flex flex-col bg-card border-l border-border w-96">
      {/* Header */}
      <div className="p-4 border-b border-border bg-rfq">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Quote Comparison</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Countdown Timer */}
        <div className={cn(
          "p-3 rounded-lg border-2 mb-3",
          countdown === 'Expired' 
            ? "bg-destructive/10 border-destructive" 
            : "bg-secondary/10 border-secondary"
        )}>
          <div className="flex items-center gap-2 mb-1">
            <Clock className={cn(
              "w-4 h-4",
              countdown === 'Expired' ? "text-destructive" : "text-secondary"
            )} />
            <span className="text-sm font-medium">RFQ Deadline</span>
          </div>
          <p className={cn(
            "text-2xl font-bold font-mono",
            countdown === 'Expired' ? "text-destructive" : "text-secondary"
          )}>
            {countdown}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {format(rfqDeadline, 'MMM dd, yyyy - h:mm a')}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-background rounded-lg">
            <p className="text-lg font-bold text-primary">{activeQuotes.length}</p>
            <p className="text-xs text-muted-foreground">Quotes</p>
          </div>
          <div className="p-2 bg-background rounded-lg">
            <p className="text-lg font-bold text-primary">{lowestPrice.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Lowest/unit</p>
          </div>
          <div className="p-2 bg-background rounded-lg">
            <p className="text-lg font-bold text-primary">{fastestDelivery}d</p>
            <p className="text-xs text-muted-foreground">Fastest</p>
          </div>
        </div>
      </div>

      {/* Sort Tabs */}
      <div className="p-2 border-b border-border">
        <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="price" className="text-xs">
              <TrendingDown className="w-3 h-3 mr-1" />
              Price
            </TabsTrigger>
            <TabsTrigger value="delivery" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Delivery
            </TabsTrigger>
            <TabsTrigger value="rating" className="text-xs">
              <Star className="w-3 h-3 mr-1" />
              Rating
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Quotes List */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {sortedQuotes.map((quote, index) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              rank={index + 1}
              isExpired={quote.status === 'expired'}
              onSelect={() => onSelectQuote(quote.id)}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border bg-muted/30">
        <Button className="w-full" size="lg">
          <Check className="w-4 h-4 mr-2" />
          Award Best Quote
        </Button>
      </div>
    </div>
  );
}

interface QuoteCardProps {
  quote: Quote;
  rank: number;
  isExpired: boolean;
  onSelect: () => void;
}

function QuoteCard({ quote, rank, isExpired, onSelect }: QuoteCardProps) {
  const timeLeft = formatDistanceToNow(quote.validUntil, { addSuffix: false });

  return (
    <button
      onClick={onSelect}
      disabled={isExpired}
      className={cn(
        "w-full p-4 rounded-xl border-2 text-left transition-all",
        isExpired 
          ? "bg-muted/50 border-muted opacity-60 cursor-not-allowed"
          : "bg-card border-border hover:border-primary hover:shadow-md"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {rank === 1 && !isExpired && (
            <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
              <Award className="w-3 h-3 text-white" />
            </div>
          )}
          <div>
            <h4 className="font-semibold text-sm">{quote.sellerName}</h4>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs text-muted-foreground">{quote.sellerRating}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary">
            {quote.currency} {quote.pricePerUnit.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">/{quote.unit}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1 mb-3">
        {quote.isLowestPrice && (
          <Badge className="bg-primary text-primary-foreground text-xs">
            <TrendingDown className="w-3 h-3 mr-1" />
            Lowest Price
          </Badge>
        )}
        {quote.isFastestDelivery && (
          <Badge className="bg-secondary text-secondary-foreground text-xs">
            <Clock className="w-3 h-3 mr-1" />
            Fastest
          </Badge>
        )}
        {isExpired && (
          <Badge variant="destructive" className="text-xs">
            <AlertCircle className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        )}
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <div>
          <span className="text-muted-foreground">Total: </span>
          <span className="font-medium">{quote.currency} {quote.totalPrice.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Delivery: </span>
          <span className="font-medium">{quote.deliveryDays} days</span>
        </div>
      </div>

      {/* Notes */}
      {quote.notes && (
        <p className="text-xs text-muted-foreground italic mb-3 line-clamp-2">
          "{quote.notes}"
        </p>
      )}

      {/* Validity */}
      {!isExpired && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Valid for {timeLeft}</span>
          <ArrowRight className="w-4 h-4 text-primary" />
        </div>
      )}
    </button>
  );
}
