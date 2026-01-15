import { supabase } from "@/integrations/supabase/client";

export interface VerificationDocument {
    id?: string;
    supplier_id: string;
    document_type: 'government_id' | 'business_license' | 'tax_document' | 'other';
    file_url: string;
    file_name: string;
    file_size?: number;
    uploaded_at?: string;
    status?: 'pending' | 'approved' | 'rejected';
}

export interface VerificationRequest {
    id?: string;
    supplier_id: string;
    status: 'pending' | 'approved' | 'rejected';
    submitted_at?: string;
    reviewed_at?: string;
    reviewed_by?: string;
    rejection_reason?: string;
    admin_notes?: string;
}

/**
 * Upload a verification document to Supabase Storage
 */
export async function uploadVerificationDocument(
    supplierId: string,
    file: File,
    documentType: VerificationDocument['document_type']
): Promise<{ data: string | null; error: any }> {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${documentType}_${Date.now()}.${fileExt}`;
        const filePath = `${supplierId}/${fileName}`;

        const { data, error } = await supabase.storage
            .from('verification-documents')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('verification-documents')
            .getPublicUrl(filePath);

        return { data: publicUrl, error: null };
    } catch (error) {
        console.error('Error uploading verification document:', error);
        return { data: null, error };
    }
}

/**
 * Save verification document metadata to database
 */
export async function saveVerificationDocument(
    doc: VerificationDocument
): Promise<{ data: VerificationDocument | null; error: any }> {
    try {
        const { data, error } = await supabase
            .from('verification_documents')
            .insert({
                supplier_id: doc.supplier_id,
                document_type: doc.document_type,
                file_url: doc.file_url,
                file_name: doc.file_name,
                file_size: doc.file_size,
                status: 'pending'
            })
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error saving verification document:', error);
        return { data: null, error };
    }
}

/**
 * Submit verification request
 */
export async function submitVerificationRequest(
    supplierId: string
): Promise<{ data: VerificationRequest | null; error: any }> {
    try {
        const { data, error } = await supabase
            .from('verification_requests')
            .insert({
                supplier_id: supplierId,
                status: 'pending',
                submitted_at: new Date().toISOString()
            })
            .select()
            .single();

        if (error) throw error;

        // Update supplier status to pending
        await supabase
            .from('suppliers')
            .update({ verification_status: 'pending' })
            .eq('id', supplierId);

        return { data, error: null };
    } catch (error) {
        console.error('Error submitting verification request:', error);
        return { data: null, error };
    }
}

/**
 * Fetch verification documents for a supplier
 */
export async function fetchVerificationDocuments(
    supplierId: string
): Promise<{ data: VerificationDocument[] | null; error: any }> {
    try {
        const { data, error } = await supabase
            .from('verification_documents')
            .select('*')
            .eq('supplier_id', supplierId)
            .order('uploaded_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching verification documents:', error);
        return { data: null, error };
    }
}

/**
 * Fetch verification status for a supplier
 */
export async function fetchVerificationStatus(
    supplierId: string
): Promise<{ data: VerificationRequest | null; error: any }> {
    try {
        const { data, error } = await supabase
            .from('verification_requests')
            .select('*')
            .eq('supplier_id', supplierId)
            .order('submitted_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // Ignore "no rows" error
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching verification status:', error);
        return { data: null, error };
    }
}

/**
 * Fetch all pending verification requests (Admin only)
 */
export async function fetchPendingVerifications(): Promise<{
    data: Array<VerificationRequest & { supplier: any; documents: VerificationDocument[] }> | null;
    error: any;
}> {
    try {
        const { data, error } = await supabase
            .from('verification_requests')
            .select(`
        *,
        supplier:suppliers(*)
      `)
            .eq('status', 'pending')
            .order('submitted_at', { ascending: true });

        if (error) throw error;

        // Fetch documents for each request
        const requestsWithDocs = await Promise.all(
            (data || []).map(async (request) => {
                const { data: docs } = await fetchVerificationDocuments(request.supplier_id);
                return {
                    ...request,
                    documents: docs || []
                };
            })
        );

        return { data: requestsWithDocs, error: null };
    } catch (error) {
        console.error('Error fetching pending verifications:', error);
        return { data: null, error };
    }
}

/**
 * Approve verification request (Admin only)
 */
export async function approveVerification(
    requestId: string,
    supplierId: string,
    adminNotes?: string
): Promise<{ data: any; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Update verification request
        const { error: requestError } = await supabase
            .from('verification_requests')
            .update({
                status: 'approved',
                reviewed_at: new Date().toISOString(),
                reviewed_by: user.id,
                admin_notes: adminNotes
            })
            .eq('id', requestId);

        if (requestError) throw requestError;

        // Update supplier status
        const { error: supplierError } = await supabase
            .from('suppliers')
            .update({
                verification_status: 'verified',
                verified_at: new Date().toISOString()
            })
            .eq('id', supplierId);

        if (supplierError) throw supplierError;

        // Approve all documents
        const { error: docsError } = await supabase
            .from('verification_documents')
            .update({ status: 'approved' })
            .eq('supplier_id', supplierId);

        if (docsError) throw docsError;

        return { data: { success: true }, error: null };
    } catch (error) {
        console.error('Error approving verification:', error);
        return { data: null, error };
    }
}

/**
 * Reject verification request (Admin only)
 */
export async function rejectVerification(
    requestId: string,
    supplierId: string,
    reason: string,
    adminNotes?: string
): Promise<{ data: any; error: any }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Update verification request
        const { error: requestError } = await supabase
            .from('verification_requests')
            .update({
                status: 'rejected',
                reviewed_at: new Date().toISOString(),
                reviewed_by: user.id,
                rejection_reason: reason,
                admin_notes: adminNotes
            })
            .eq('id', requestId);

        if (requestError) throw requestError;

        // Update supplier status
        const { error: supplierError } = await supabase
            .from('suppliers')
            .update({ verification_status: 'rejected' })
            .eq('id', supplierId);

        if (supplierError) throw supplierError;

        // Reject all pending documents
        const { error: docsError } = await supabase
            .from('verification_documents')
            .update({ status: 'rejected' })
            .eq('supplier_id', supplierId)
            .eq('status', 'pending');

        if (docsError) throw docsError;

        return { data: { success: true }, error: null };
    } catch (error) {
        console.error('Error rejecting verification:', error);
        return { data: null, error };
    }
}

/**
 * Delete a verification document
 */
export async function deleteVerificationDocument(
    documentId: string,
    fileUrl: string
): Promise<{ data: any; error: any }> {
    try {
        // Extract file path from URL
        const urlParts = fileUrl.split('/verification-documents/');
        if (urlParts.length > 1) {
            const filePath = urlParts[1];

            // Delete from storage
            await supabase.storage
                .from('verification-documents')
                .remove([filePath]);
        }

        // Delete from database
        const { error } = await supabase
            .from('verification_documents')
            .delete()
            .eq('id', documentId);

        if (error) throw error;
        return { data: { success: true }, error: null };
    } catch (error) {
        console.error('Error deleting verification document:', error);
        return { data: null, error };
    }
}
