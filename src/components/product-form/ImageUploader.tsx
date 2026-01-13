import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  ImagePlus,
  X,
  Star,
  GripVertical,
  Upload,
  Trash2,
  ZoomIn,
  Info,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface ImageItem {
  id: string;
  url: string;
  file?: File;
  isPrimary: boolean;
  altText?: string;
}

interface ImageUploaderProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  maxImages?: number;
  acceptVideo?: boolean;
}

export function ImageUploader({
  images,
  onChange,
  maxImages = 6,
  acceptVideo = true,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const remainingSlots = maxImages - images.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);
    
    const newImages: ImageItem[] = filesToAdd.map((file, index) => ({
      id: `img_${Date.now()}_${index}`,
      url: URL.createObjectURL(file),
      file,
      isPrimary: images.length === 0 && index === 0,
      altText: file.name,
    }));

    onChange([...images, ...newImages]);
  }, [images, maxImages, onChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const removeImage = (id: string) => {
    const newImages = images.filter(img => img.id !== id);
    // If we removed the primary image, make the first one primary
    if (newImages.length > 0 && !newImages.some(img => img.isPrimary)) {
      newImages[0].isPrimary = true;
    }
    onChange(newImages);
  };

  const setPrimaryImage = (id: string) => {
    const newImages = images.map(img => ({
      ...img,
      isPrimary: img.id === id,
    }));
    onChange(newImages);
  };

  const handleReorder = (reorderedImages: ImageItem[]) => {
    onChange(reorderedImages);
  };

  const acceptedTypes = acceptVideo
    ? 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm'
    : 'image/jpeg,image/png,image/webp,image/gif';

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
          images.length >= maxImages && "opacity-50 pointer-events-none"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={images.length >= maxImages}
        />
        
        <motion.div
          initial={false}
          animate={{ scale: isDragging ? 1.02 : 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className={cn(
              "w-8 h-8 transition-colors",
              isDragging ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {isDragging ? 'Drop images here' : 'Click or drag images to upload'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              JPG, PNG, WebP {acceptVideo && 'or MP4'} • Max {maxImages} files
            </p>
          </div>
        </motion.div>
      </div>

      {/* Image Grid */}
      <AnimatePresence mode="popLayout">
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Reorder.Group
              axis="x"
              values={images}
              onReorder={handleReorder}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
            >
              {images.map((image, index) => (
                <Reorder.Item
                  key={image.id}
                  value={image}
                  className="relative aspect-square rounded-lg overflow-hidden group cursor-grab active:cursor-grabbing"
                >
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="w-full h-full"
                  >
                    {/* Image or Video */}
                    {image.file?.type.startsWith('video/') ? (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Video className="w-8 h-8 text-muted-foreground" />
                      </div>
                    ) : (
                      <img
                        src={image.url}
                        alt={image.altText || `Product image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage(image.url);
                          }}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(image.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {!image.isPrimary && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPrimaryImage(image.id);
                          }}
                        >
                          <Star className="h-3 w-3 mr-1" />
                          Set Primary
                        </Button>
                      )}
                    </div>

                    {/* Primary Badge */}
                    {image.isPrimary && (
                      <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Primary
                      </Badge>
                    )}

                    {/* Order Badge */}
                    <Badge
                      variant="secondary"
                      className="absolute top-2 right-2 h-6 w-6 p-0 flex items-center justify-center"
                    >
                      {index + 1}
                    </Badge>

                    {/* Drag Handle */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="h-5 w-5 text-white" />
                    </div>
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper Text */}
      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
        <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-1">Image Tips:</p>
          <ul className="list-disc list-inside space-y-0.5 text-xs">
            <li>First image is shown in search results and listings</li>
            <li>Drag to reorder images</li>
            <li>Recommended size: 1000×1000 pixels (square)</li>
            <li>Use good lighting and clear backgrounds</li>
          </ul>
        </div>
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
