import { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  X, 
  GripVertical, 
  ImagePlus,
  Star,
  Trash2,
  ZoomIn,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductImage {
  id: string;
  url: string;
  file?: File;
  isPrimary?: boolean;
}

interface ImageUploaderProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  maxImages?: number;
}

export function ImageUploader({ images, onChange, maxImages = 8 }: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    handleFiles(files);
  }, [images, onChange, maxImages]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, [images, onChange, maxImages]);

  const handleFiles = (files: File[]) => {
    const remainingSlots = maxImages - images.length;
    const filesToAdd = files.slice(0, remainingSlots);
    
    const newImages: ProductImage[] = filesToAdd.map((file, index) => ({
      id: `img-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      file,
      isPrimary: images.length === 0 && index === 0,
    }));

    onChange([...images, ...newImages]);
  };

  const removeImage = (id: string) => {
    const filtered = images.filter(img => img.id !== id);
    // If we removed the primary image, make the first one primary
    if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    onChange(filtered);
  };

  const setPrimary = (id: string) => {
    onChange(images.map(img => ({ ...img, isPrimary: img.id === id })));
  };

  const handleReorder = (reorderedImages: ProductImage[]) => {
    onChange(reorderedImages);
  };

  const primaryImage = images.find(img => img.isPrimary);
  const otherImages = images.filter(img => !img.isPrimary);

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
          isDragOver 
            ? "border-primary bg-primary/5 scale-[1.01]" 
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          images.length >= maxImages && "opacity-50 pointer-events-none"
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={images.length >= maxImages}
        />
        <div className="flex flex-col items-center gap-3">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
            isDragOver ? "bg-primary/20" : "bg-muted"
          )}>
            <Upload className={cn(
              "w-8 h-8 transition-colors",
              isDragOver ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <p className="font-medium text-foreground">
              {isDragOver ? "Drop images here" : "Drag & drop product images"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse • Max {maxImages} images • PNG, JPG, WebP
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" className="mt-2">
            <ImagePlus className="w-4 h-4 mr-2" />
            Select Images
          </Button>
        </div>
      </div>

      {/* Image Display with Primary Featured */}
      <AnimatePresence>
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              {images.length} of {maxImages} images • Click ⭐ to set main photo • Drag to reorder
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Primary Image - Featured Large */}
              {primaryImage && (
                <motion.div
                  layout
                  className="md:col-span-1 md:row-span-2"
                >
                  <div className="relative group rounded-xl overflow-hidden border-2 border-primary ring-2 ring-primary/20 aspect-square">
                    <img
                      src={primaryImage.url}
                      alt="Primary product"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Primary Badge */}
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      Main Photo
                    </div>

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setPreviewImage(primaryImage.url)}
                      >
                        <ZoomIn className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(primaryImage.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Other Images Grid */}
              <div className="md:col-span-2">
                <Reorder.Group
                  axis="x"
                  values={otherImages}
                  onReorder={(reordered) => {
                    const newImages = primaryImage ? [primaryImage, ...reordered] : reordered;
                    onChange(newImages);
                  }}
                  className="flex flex-wrap gap-3"
                >
                  {otherImages.map((image) => (
                    <Reorder.Item
                      key={image.id}
                      value={image}
                      className="relative group"
                    >
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 border-border cursor-grab active:cursor-grabbing transition-all hover:border-primary/50"
                      >
                        <img
                          src={image.url}
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Drag Handle */}
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripVertical className="w-4 h-4 text-white drop-shadow-lg" />
                        </div>

                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-white hover:bg-white/20"
                            onClick={() => setPreviewImage(image.url)}
                            title="Preview"
                          >
                            <ZoomIn className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-yellow-400 hover:bg-white/20"
                            onClick={() => setPrimary(image.id)}
                            title="Set as main photo"
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-white hover:bg-destructive/80"
                            onClick={() => removeImage(image.id)}
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <img src={previewImage} alt="Preview" className="w-full rounded-lg" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
