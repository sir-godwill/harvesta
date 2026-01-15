import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertCircle, CheckCircle2, FileText, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { DocumentUploader } from '@/components/seller/DocumentUploader';
import { supabase } from '@/integrations/supabase/client';
import {
    uploadVerificationDocument,
    saveVerificationDocument,
    submitVerificationRequest,
    fetchVerificationDocuments,
    fetchVerificationStatus,
    deleteVerificationDocument,
    VerificationDocument
} from '@/lib/verification-api';
import { toast } from 'sonner';

export default function SellerVerification() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [supplierId, setSupplierId] = useState<string>('');
    const [documents, setDocuments] = useState<VerificationDocument[]>([]);
    const [verificationStatus, setVerificationStatus] = useState<any>(null);

    useEffect(() => {
        loadVerificationData();
    }, []);

    const loadVerificationData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }

            // Get supplier ID
            const { data: supplier } = await supabase
                .from('suppliers')
                .select('id, verification_status')
                .eq('user_id', user.id)
                .single();

            if (!supplier) {
                toast.error('Supplier profile not found');
                navigate('/seller');
                return;
            }

            setSupplierId(supplier.id);

            // Load documents
            const { data: docs } = await fetchVerificationDocuments(supplier.id);
            setDocuments(docs || []);

            // Load verification status
            const { data: status } = await fetchVerificationStatus(supplier.id);
            setVerificationStatus(status);

        } catch (error) {
            console.error('Error loading verification data:', error);
            toast.error('Failed to load verification data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file: File, documentType: VerificationDocument['document_type']) => {
        try {
            // Upload to storage
            const { data: fileUrl, error: uploadError } = await uploadVerificationDocument(
                supplierId,
                file,
                documentType
            );

            if (uploadError || !fileUrl) {
                throw new Error('Failed to upload file');
            }

            // Save metadata
            const { data: doc, error: saveError } = await saveVerificationDocument({
                supplier_id: supplierId,
                document_type: documentType,
                file_url: fileUrl,
                file_name: file.name,
                file_size: file.size
            });

            if (saveError || !doc) {
                throw new Error('Failed to save document');
            }

            // Reload documents
            await loadVerificationData();
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    const handleDelete = async (documentId: string, fileUrl: string) => {
        try {
            await deleteVerificationDocument(documentId, fileUrl);
            await loadVerificationData();
        } catch (error) {
            console.error('Delete error:', error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        // Validate that at least government ID is uploaded
        const hasGovId = documents.some(d => d.document_type === 'government_id');
        if (!hasGovId) {
            toast.error('Please upload a government-issued ID before submitting');
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await submitVerificationRequest(supplierId);
            if (error) throw error;

            toast.success('Verification request submitted successfully!');
            await loadVerificationData();
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Failed to submit verification request');
        } finally {
            setSubmitting(false);
        }
    };

    const getDocumentByType = (type: VerificationDocument['document_type']) => {
        return documents.find(d => d.document_type === type);
    };

    const canSubmit = () => {
        const hasGovId = documents.some(d => d.document_type === 'government_id');
        const hasNoRejected = !documents.some(d => d.status === 'rejected');
        const notAlreadySubmitted = !verificationStatus || verificationStatus.status === 'rejected';
        return hasGovId && hasNoRejected && notAlreadySubmitted;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto space-y-6"
        >
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/seller')}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Seller Verification</h1>
                    <p className="text-muted-foreground">
                        Complete your verification to unlock full platform access
                    </p>
                </div>
            </div>

            {/* Status Alert */}
            {verificationStatus && (
                <Alert className={
                    verificationStatus.status === 'approved' ? 'border-green-500 bg-green-50' :
                        verificationStatus.status === 'rejected' ? 'border-red-500 bg-red-50' :
                            'border-yellow-500 bg-yellow-50'
                }>
                    <div className="flex items-start gap-3">
                        {verificationStatus.status === 'approved' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        ) : verificationStatus.status === 'rejected' ? (
                            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        ) : (
                            <ShieldCheck className="h-5 w-5 text-yellow-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                            <h3 className="font-semibold">
                                {verificationStatus.status === 'approved' && 'Verification Approved'}
                                {verificationStatus.status === 'rejected' && 'Verification Rejected'}
                                {verificationStatus.status === 'pending' && 'Verification Pending'}
                            </h3>
                            <AlertDescription className="mt-1">
                                {verificationStatus.status === 'approved' && 'Your seller account has been verified. You now have full access to all platform features.'}
                                {verificationStatus.status === 'rejected' && (
                                    <>
                                        {verificationStatus.rejection_reason || 'Your verification was rejected. Please review and resubmit your documents.'}
                                    </>
                                )}
                                {verificationStatus.status === 'pending' && 'Your verification request is under review. We\'ll notify you once it\'s processed.'}
                            </AlertDescription>
                        </div>
                    </div>
                </Alert>
            )}

            {/* Instructions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Required Documents
                    </CardTitle>
                    <CardDescription>
                        Upload the following documents to verify your seller account. All documents must be clear and legible.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2 text-sm">
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-medium">Government-issued ID (Required)</p>
                                <p className="text-muted-foreground text-xs">National ID, Passport, or Driver's License</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="font-medium">Business License (Optional)</p>
                                <p className="text-muted-foreground text-xs">Business registration certificate or trade license</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="font-medium">Tax Documents (Optional)</p>
                                <p className="text-muted-foreground text-xs">Tax ID or VAT registration certificate</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Document Uploaders */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Upload Documents</h2>

                <DocumentUploader
                    documentType="government_id"
                    label="Government-Issued ID *"
                    description="Upload a clear photo or scan of your ID (Required)"
                    onUpload={(file) => handleUpload(file, 'government_id')}
                    existingFile={getDocumentByType('government_id') ? {
                        name: getDocumentByType('government_id')!.file_name,
                        url: getDocumentByType('government_id')!.file_url,
                        status: getDocumentByType('government_id')!.status
                    } : undefined}
                    onDelete={getDocumentByType('government_id') ?
                        () => handleDelete(getDocumentByType('government_id')!.id!, getDocumentByType('government_id')!.file_url) :
                        undefined
                    }
                />

                <DocumentUploader
                    documentType="business_license"
                    label="Business License"
                    description="Upload your business registration or trade license (Optional)"
                    onUpload={(file) => handleUpload(file, 'business_license')}
                    existingFile={getDocumentByType('business_license') ? {
                        name: getDocumentByType('business_license')!.file_name,
                        url: getDocumentByType('business_license')!.file_url,
                        status: getDocumentByType('business_license')!.status
                    } : undefined}
                    onDelete={getDocumentByType('business_license') ?
                        () => handleDelete(getDocumentByType('business_license')!.id!, getDocumentByType('business_license')!.file_url) :
                        undefined
                    }
                />

                <DocumentUploader
                    documentType="tax_document"
                    label="Tax Documents"
                    description="Upload tax ID or VAT registration (Optional)"
                    onUpload={(file) => handleUpload(file, 'tax_document')}
                    existingFile={getDocumentByType('tax_document') ? {
                        name: getDocumentByType('tax_document')!.file_name,
                        url: getDocumentByType('tax_document')!.file_url,
                        status: getDocumentByType('tax_document')!.status
                    } : undefined}
                    onDelete={getDocumentByType('tax_document') ?
                        () => handleDelete(getDocumentByType('tax_document')!.id!, getDocumentByType('tax_document')!.file_url) :
                        undefined
                    }
                />
            </div>

            {/* Submit Button */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Ready to submit?</p>
                            <p className="text-sm text-muted-foreground">
                                Make sure all required documents are uploaded before submitting
                            </p>
                        </div>
                        <Button
                            onClick={handleSubmit}
                            disabled={!canSubmit() || submitting}
                            size="lg"
                            className="gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4" />
                                    Submit for Verification
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
