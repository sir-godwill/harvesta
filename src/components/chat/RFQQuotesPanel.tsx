import { useState, useEffect } from 'react';
import { X, Clock, Check, Star, TrendingDown, ArrowRight, Award, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow, differenceInSeconds } from 'date-fns';

interface Quote { id: string; sellerId: string; sellerName: string; sellerRating: number; pricePerUnit: number; currency: string; quantity: number; unit: string; totalPrice: number; deliveryDays: number; validUntil: Date; status: 'pending' | 'accepted' | 'rejected' | 'expired'; isLowestPrice: boolean; isFastestDelivery: boolean; notes?: string; createdAt: Date; }
interface RFQQuotesPanelProps { rfqId: string; onClose: () => void; onSelectQuote: (quoteId: string) => void; }

const mockQuotes: Quote[] = [
  { id: 'quote_1', sellerId: 'seller_1', sellerName: 'Kofi Asante Farms', sellerRating: 4.8, pricePerUnit: 2200, currency: 'XAF', quantity: 2000, unit: 'kg', totalPrice: 4400000, deliveryDays: 7, validUntil: new Date(Date.now() + 86400000 * 2), status: 'pending', isLowestPrice: true, isFastestDelivery: false, notes: 'Organic certified', createdAt: new Date(Date.now() - 3600000 * 2) },
  { id: 'quote_2', sellerId: 'seller_2', sellerName: 'GreenHarvest Co.', sellerRating: 4.5, pricePerUnit: 2350, currency: 'XAF', quantity: 2000, unit: 'kg', totalPrice: 4700000, deliveryDays: 5, validUntil: new Date(Date.now() + 86400000 * 3), status: 'pending', isLowestPrice: false, isFastestDelivery: true, notes: 'Express delivery', createdAt: new Date(Date.now() - 3600000 * 5) },
];

export function RFQQuotesPanel({ rfqId, onClose, onSelectQuote }: RFQQuotesPanelProps) {
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [sortBy, setSortBy] = useState<'price' | 'delivery' | 'rating'>('price');
  const [rfqDeadline] = useState(new Date(Date.now() + 86400000 * 5));
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const diff = differenceInSeconds(rfqDeadline, new Date());
      if (diff <= 0) { setCountdown('Expired'); return; }
      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      setCountdown(days > 0 ? `${days}d ${hours}h ${minutes}m` : `${hours}h ${minutes}m`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [rfqDeadline]);

  const sortedQuotes = [...quotes].sort((a, b) => sortBy === 'price' ? a.pricePerUnit - b.pricePerUnit : sortBy === 'delivery' ? a.deliveryDays - b.deliveryDays : b.sellerRating - a.sellerRating);
  const activeQuotes = sortedQuotes.filter(q => q.status !== 'expired');
  const lowestPrice = Math.min(...activeQuotes.map(q => q.pricePerUnit));
  const fastestDelivery = Math.min(...activeQuotes.map(q => q.deliveryDays));

  return (
    <div className="h-full flex flex-col bg-card border-l border-border w-96">
      <div className="p-4 border-b border-border bg-orange-50">
        <div className="flex items-center justify-between mb-3"><h3 className="font-semibold text-lg">Quote Comparison</h3><Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button></div>
        <div className={cn("p-3 rounded-lg border-2 mb-3", countdown === 'Expired' ? "bg-destructive/10 border-destructive" : "bg-orange-100 border-orange-400")}>
          <div className="flex items-center gap-2 mb-1"><Clock className={cn("w-4 h-4", countdown === 'Expired' ? "text-destructive" : "text-orange-600")} /><span className="text-sm font-medium">RFQ Deadline</span></div>
          <p className={cn("text-2xl font-bold font-mono", countdown === 'Expired' ? "text-destructive" : "text-orange-600")}>{countdown}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-background rounded-lg"><p className="text-lg font-bold text-green-600">{activeQuotes.length}</p><p className="text-xs text-muted-foreground">Quotes</p></div>
          <div className="p-2 bg-background rounded-lg"><p className="text-lg font-bold text-green-600">{lowestPrice.toLocaleString()}</p><p className="text-xs text-muted-foreground">Lowest/unit</p></div>
          <div className="p-2 bg-background rounded-lg"><p className="text-lg font-bold text-green-600">{fastestDelivery}d</p><p className="text-xs text-muted-foreground">Fastest</p></div>
        </div>
      </div>
      <div className="p-2 border-b border-border">
        <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
          <TabsList className="w-full grid grid-cols-3"><TabsTrigger value="price" className="text-xs"><TrendingDown className="w-3 h-3 mr-1" />Price</TabsTrigger><TabsTrigger value="delivery" className="text-xs"><Clock className="w-3 h-3 mr-1" />Delivery</TabsTrigger><TabsTrigger value="rating" className="text-xs"><Star className="w-3 h-3 mr-1" />Rating</TabsTrigger></TabsList>
        </Tabs>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {sortedQuotes.map((quote, index) => (
            <button key={quote.id} onClick={() => onSelectQuote(quote.id)} disabled={quote.status === 'expired'} className={cn("w-full p-4 rounded-xl border-2 text-left transition-all", quote.status === 'expired' ? "bg-muted/50 border-muted opacity-60 cursor-not-allowed" : "bg-card border-border hover:border-green-500 hover:shadow-md")}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">{index === 0 && quote.status !== 'expired' && <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center"><Award className="w-3 h-3 text-white" /></div>}<div><h4 className="font-semibold text-sm">{quote.sellerName}</h4><div className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /><span className="text-xs text-muted-foreground">{quote.sellerRating}</span></div></div></div>
                <div className="text-right"><p className="text-lg font-bold text-green-600">{quote.currency} {quote.pricePerUnit.toLocaleString()}</p><p className="text-xs text-muted-foreground">/{quote.unit}</p></div>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {quote.isLowestPrice && <Badge className="bg-green-600 text-white text-xs"><TrendingDown className="w-3 h-3 mr-1" />Lowest</Badge>}
                {quote.isFastestDelivery && <Badge className="bg-orange-500 text-white text-xs"><Clock className="w-3 h-3 mr-1" />Fastest</Badge>}
                {quote.status === 'expired' && <Badge variant="destructive" className="text-xs"><AlertCircle className="w-3 h-3 mr-1" />Expired</Badge>}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-3"><div><span className="text-muted-foreground">Total: </span><span className="font-medium">{quote.currency} {quote.totalPrice.toLocaleString()}</span></div><div><span className="text-muted-foreground">Delivery: </span><span className="font-medium">{quote.deliveryDays} days</span></div></div>
              {quote.notes && <p className="text-xs text-muted-foreground italic mb-3 line-clamp-2">"{quote.notes}"</p>}
              {quote.status !== 'expired' && <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Valid for {formatDistanceToNow(quote.validUntil)}</span><ArrowRight className="w-4 h-4 text-green-600" /></div>}
            </button>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-border bg-muted/30"><Button className="w-full bg-green-600 hover:bg-green-700" size="lg"><Check className="w-4 h-4 mr-2" />Award Best Quote</Button></div>
    </div>
  );
}
