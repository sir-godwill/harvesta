import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ProductImage {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductGalleryProps {
  images: ProductImage[];
  video?: {
    url: string;
    thumbnail: string;
  };
  productName: string;
}

export function ProductGallery({ images, video, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Sort images by sortOrder, primary first
  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.sortOrder - b.sortOrder;
  });

  const currentImage = sortedImages[selectedIndex];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, sortedImages.length]);

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? sortedImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === sortedImages.length - 1 ? 0 : prev + 1));
  };

  // Touch handlers for mobile swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  if (sortedImages.length === 0) {
    return (
      <div className="aspect-square rounded-xl bg-muted flex items-center justify-center">
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div 
        className="relative aspect-square rounded-xl overflow-hidden bg-muted group cursor-pointer"
        onClick={() => setIsZoomOpen(true)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={currentImage?.url || '/placeholder.svg'}
          alt={currentImage?.altText || productName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Image Counter */}
        <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
          {selectedIndex + 1} / {sortedImages.length}
        </div>

        {/* Zoom Icon */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black/60 text-white p-2 rounded-full">
            <ZoomIn className="w-4 h-4" />
          </div>
        </div>

        {/* Navigation Arrows - Desktop */}
        {sortedImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity hidden lg:flex"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity hidden lg:flex"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Mobile Dots Indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden">
          {sortedImages.slice(0, 5).map((_, index) => (
            <div
              key={index}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                index === selectedIndex ? 'bg-white' : 'bg-white/50'
              )}
            />
          ))}
          {sortedImages.length > 5 && (
            <div className="text-white text-xs ml-1">+{sortedImages.length - 5}</div>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {sortedImages.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              'shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
              selectedIndex === index 
                ? 'border-primary ring-2 ring-primary/20' 
                : 'border-transparent hover:border-muted-foreground/30'
            )}
          >
            <img 
              src={image.url} 
              alt={image.altText || `${productName} ${index + 1}`} 
              className="w-full h-full object-cover" 
            />
          </button>
        ))}
        {video && (
          <button
            className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-transparent hover:border-muted-foreground/30 relative"
          >
            <img 
              src={video.thumbnail} 
              alt="Product video" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </button>
        )}
      </div>

      {/* Zoom Modal */}
      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-w-4xl p-0 bg-black/95">
          <div className="relative aspect-square">
            <img
              src={currentImage?.url}
              alt={currentImage?.altText || productName}
              className="w-full h-full object-contain"
            />
            {sortedImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white"
                  onClick={goToNext}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
