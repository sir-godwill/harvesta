import { ShoppingCart, FileText, MessageSquare, Heart, Share2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProductActionsProps {
  productId: string;
  productName: string;
  isOutOfStock: boolean;
  isBelowMoq: boolean;
  moq: number;
  unit: string;
  quantity: number;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onRequestQuote: () => void;
  onContactSeller: () => void;
  onSendOffer: () => void;
  className?: string;
}

export function ProductActions({
  productId,
  productName,
  isOutOfStock,
  isBelowMoq,
  moq,
  unit,
  quantity,
  onAddToCart,
  onBuyNow,
  onRequestQuote,
  onContactSeller,
  onSendOffer,
  className,
}: ProductActionsProps) {
  const handleSave = () => {
    toast.success('Product saved to wishlist');
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          url: url,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className={className}>
      {/* Desktop Actions */}
      <div className="hidden lg:grid grid-cols-2 gap-3">
        <Button
          size="lg"
          className="bg-primary hover:bg-primary/90 gap-2 h-12"
          onClick={onBuyNow}
          disabled={isOutOfStock || isBelowMoq}
        >
          <ShoppingCart className="h-5 w-5" />
          Buy Now
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-primary text-primary hover:bg-primary/5 gap-2 h-12"
          onClick={onAddToCart}
          disabled={isOutOfStock || isBelowMoq}
        >
          <ShoppingCart className="h-5 w-5" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>

        <Button
          size="lg"
          variant="secondary"
          className="bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground gap-2 h-12"
          onClick={onSendOffer}
        >
          <Phone className="h-4 w-4" />
          Send Offer
        </Button>
        <Button
          size="lg"
          className="bg-gradient-primary hover:opacity-90 gap-2 h-12"
          onClick={onContactSeller}
        >
          <MessageSquare className="h-5 w-5" />
          Chat Now
        </Button>

        <div className="col-span-2 flex gap-2">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={onRequestQuote}
          >
            <FileText className="h-4 w-4" />
            Request Custom Quote (RFQ)
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 shrink-0"
            onClick={handleSave}
          >
            <Heart className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 shrink-0"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>


      {/* MOQ Warning */}
      {isBelowMoq && !isOutOfStock && (
        <p className="text-sm text-amber-600 mt-3 text-center hidden lg:block">
          ⚠️ Minimum order is {moq} {unit}. Adjust quantity to proceed.
        </p>
      )}
    </div>
  );
}

// Mobile Fixed Bottom Actions
export function ProductActionsMobile({
  isOutOfStock,
  isBelowMoq,
  onAddToCart,
  onBuyNow,
  onRequestQuote,
  onContactSeller,
  onSendOffer,
  onVisitStore,
}: {
  isOutOfStock: boolean;
  isBelowMoq: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onRequestQuote: () => void;
  onContactSeller: () => void;
  onSendOffer: () => void;
  onVisitStore: () => void;
}) {
  const handleSave = () => {
    toast.success('Product saved to wishlist');
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 space-y-3 z-50 shadow-2xl">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={onVisitStore}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={onContactSeller}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={handleSave}
        >
          <Heart className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-secondary border-secondary"
          onClick={onSendOffer}
        >
          Offer
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-primary border-primary"
          onClick={onRequestQuote}
        >
          RFQ
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 text-primary border-primary font-bold h-12"
          onClick={onAddToCart}
          disabled={isOutOfStock || isBelowMoq}
        >
          Add to Cart
        </Button>
        <Button
          className="flex-1 bg-primary hover:bg-primary/90 font-bold h-12"
          onClick={onBuyNow}
          disabled={isOutOfStock || isBelowMoq}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}
