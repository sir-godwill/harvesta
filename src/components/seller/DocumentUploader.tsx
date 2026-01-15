import { useState, useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface DocumentUploaderProps {
    documentType: 'government_id' | 'business_license' | 'tax_document' | 'other';
    label: string;
    description?: string;
    onUpload: (file: File) => Promise<void>;
    existingFile?: {
        name: string;
        url: string;
        status?: 'pending' | 'approved' | 'rejected';
    };
    onDelete?: () => Promise<void>;
    maxSizeMB?: number;
    acceptedFormats?: string[];
}

export function DocumentUploader({
    documentType,
    label,
    description,
    onUpload,
    existingFile,
    onDelete,
    maxSizeMB = 5,
    acceptedFormats = ['.pdf', '.jpg', '.jpeg', '.png']
}: DocumentUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const validateFile = (file: File): boolean => {
        // Check file size
        const maxSize = maxSizeMB * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error(`File size must be less than ${maxSizeMB}MB`);
            return false;
        }

        // Check file type
        const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!acceptedFormats.includes(fileExt)) {
            toast.error(`Please upload a file in one of these formats: ${acceptedFormats.join(', ')}`);
            return false;
        }

        return true;
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            await handleFileUpload(files[0]);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            await handleFileUpload(files[0]);
        }
    };

    const handleFileUpload = async (file: File) => {
        if (!validateFile(file)) return;

        setUploading(true);
        try {
            await onUpload(file);
            toast.success('Document uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload document');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = async () => {
        if (!onDelete) return;

        setDeleting(true);
        try {
            await onDelete();
            toast.success('Document deleted');
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete document');
        } finally {
            setDeleting(false);
        }
    };

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'rejected':
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
        }
    };

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') {
            return <FileText className="h-8 w-8 text-red-500" />;
        }
        return <ImageIcon className="h-8 w-8 text-blue-500" />;
    };

    return (
        <Card className="p-4">
            <div className="space-y-3">
                <div>
                    <h3 className="font-medium text-sm">{label}</h3>
                    {description && (
                        <p className="text-xs text-muted-foreground mt-1">{description}</p>
                    )}
                </div>

                {existingFile ? (
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            {getFileIcon(existingFile.name)}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{existingFile.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    {existingFile.status && getStatusIcon(existingFile.status)}
                                    <span className="text-xs text-muted-foreground capitalize">
                                        {existingFile.status || 'pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(existingFile.url, '_blank')}
                            >
                                View
                            </Button>
                            {onDelete && existingFile.status !== 'approved' && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                >
                                    {deleting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <X className="h-4 w-4" />
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div
                        className={cn(
                            'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
                            dragActive ? 'border-primary bg-primary/5' : 'border-border',
                            uploading && 'opacity-50 pointer-events-none'
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept={acceptedFormats.join(',')}
                            onChange={handleFileChange}
                            disabled={uploading}
                        />

                        {uploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">Uploading...</p>
                            </div>
                        ) : (
                            <>
                                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm font-medium mb-1">
                                    Drag and drop or{' '}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-primary hover:underline"
                                    >
                                        browse
                                    </button>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {acceptedFormats.join(', ')} • Max {maxSizeMB}MB
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
