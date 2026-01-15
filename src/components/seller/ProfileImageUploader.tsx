import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    Trash2,
    ZoomIn,
    Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProfileImageUploaderProps {
    image?: string | null;
    onImageChange: (file: File | null) => void;
    label?: string;
}

export function ProfileImageUploader({
    image,
    onImageChange,
    label = "Upload Logo"
}: ProfileImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [localPreview, setLocalPreview] = useState<string | null>(null);

    const displayImage = localPreview || image;

    const handleFileSelect = useCallback((files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file (JPG, PNG, WebP)');
            return;
        }

        // Validate size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image size must be less than 2MB');
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setLocalPreview(objectUrl);
        onImageChange(file);
        toast.success('Image selected successfully');
    }, [onImageChange]);

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

    const removeImage = () => {
        setLocalPreview(null);
        onImageChange(null);
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone / Image Display */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all duration-200",
                    isDragging
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
                    "h-48 flex items-center justify-center flex-col gap-2"
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files)}
                />

                {displayImage ? (
                    <div className="relative w-full h-full group">
                        <img
                            src={displayImage}
                            alt="Profile Preview"
                            className="w-full h-full object-contain rounded-md"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-md">
                            <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0"
                                onClick={() => setPreviewImage(displayImage)}
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
                                    removeImage();
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="flex flex-col items-center gap-2 w-full h-full justify-center"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <ImageIcon className={cn(
                                "w-6 h-6 transition-colors",
                                isDragging ? "text-primary" : "text-muted-foreground"
                            )} />
                        </div>
                        <div>
                            <p className="font-medium text-foreground text-sm">
                                {label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Click or drag to upload
                            </p>
                        </div>
                    </div>
                )}
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
