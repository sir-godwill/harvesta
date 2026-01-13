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
  onRequestQuote: () => void;
  onContactSeller: () => void;
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
  onRequestQuote,
  onContactSeller,
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
      <div className="hidden lg:flex gap-3">
        <Button 
          size="lg" 
          className="flex-1 bg-gradient-primary hover:opacity-90 gap-2"
          onClick={onContactSeller}
        >
          <MessageSquare className="h-5 w-5" />
          Contact Seller
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2"
          onClick={onAddToCart}
          disabled={isOutOfStock}
        >
          <ShoppingCart className="h-5 w-5" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
        <Button 
          size="icon" 
          variant="outline" 
          className="h-12 w-12"
          onClick={handleSave}
        >
          <Heart className="h-5 w-5" />
        </Button>
        <Button 
          size="icon" 
          variant="outline" 
          className="h-12 w-12"
          onClick={handleShare}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      {/* B2B Request Quote Button */}
      <Button 
        variant="outline" 
        className="w-full mt-3 gap-2 hidden lg:flex"
        onClick={onRequestQuote}
      >
        <FileText className="h-4 w-4" />
        Request Custom Quote (RFQ)
      </Button>

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
  onRequestQuote,
  onContactSeller,
  onVisitStore,
}: {
  isOutOfStock: boolean;
  isBelowMoq: boolean;
  onAddToCart: () => void;
  onRequestQuote: () => void;
  onContactSeller: () => void;
  onVisitStore: () => void;
}) {
  const handleSave = () => {
    toast.success('Product saved to wishlist');
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-3 flex items-center gap-2 z-50 shadow-lg">
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
        className="flex-1 text-primary border-primary"
        onClick={onAddToCart}
        disabled={isOutOfStock}
      >
        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </Button>
      <Button 
        className="flex-1 bg-gradient-primary"
        onClick={onRequestQuote}
      >
        Get Quote
      </Button>
    </div>
  );
}
