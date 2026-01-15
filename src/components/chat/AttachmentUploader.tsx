import { useRef, useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { uploadChatAttachment } from '@/lib/chat-api';
import { toast } from 'sonner';

interface AttachmentUploaderProps {
    conversationId: string;
    onUploadComplete: (fileUrl: string, fileName: string, fileType: string) => void;
}

export function AttachmentUploader({ conversationId, onUploadComplete }: AttachmentUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size must be less than 10MB');
            return;
        }

        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setUploadProgress(0);

        try {
            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const { data: fileUrl, error } = await uploadChatAttachment(selectedFile, conversationId);

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (error) throw error;

            onUploadComplete(fileUrl!, selectedFile.name, selectedFile.type);
            toast.success('File uploaded successfully');

            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Failed to upload file');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
        if (type.includes('pdf')) return <FileText className="h-4 w-4" />;
        return <File className="h-4 w-4" />;
    };

    return (
        <div className="space-y-4">
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            />

            {!selectedFile ? (
                <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full gap-2"
                >
                    <Upload className="h-4 w-4" />
                    Select File
                </Button>
            ) : (
                <Card className="p-4">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {getFileIcon(selectedFile.type)}
                            <div>
                                <p className="text-sm font-medium">{selectedFile.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {(selectedFile.size / 1024).toFixed(2)} KB
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedFile(null)}
                            disabled={uploading}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {uploading && (
                        <div className="space-y-2 mb-4">
                            <Progress value={uploadProgress} />
                            <p className="text-xs text-center text-muted-foreground">
                                Uploading... {uploadProgress}%
                            </p>
                        </div>
                    )}

                    <Button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full"
                    >
                        {uploading ? 'Uploading...' : 'Upload & Send'}
                    </Button>
                </Card>
            )}
        </div>
    );
}
