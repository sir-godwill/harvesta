-- Verification Documents Table
CREATE TABLE IF NOT EXISTS public.verification_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('government_id', 'business_license', 'tax_document', 'other')),
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verification Requests Table
CREATE TABLE IF NOT EXISTS public.verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id),
    rejection_reason TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_verification_documents_supplier ON public.verification_documents(supplier_id);
CREATE INDEX IF NOT EXISTS idx_verification_documents_status ON public.verification_documents(status);
CREATE INDEX IF NOT EXISTS idx_verification_requests_supplier ON public.verification_requests(supplier_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_status ON public.verification_requests(status);

-- Add RLS policies
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- Sellers can view their own documents
CREATE POLICY "Sellers can view own verification documents"
ON public.verification_documents FOR SELECT
USING (
    supplier_id IN (
        SELECT id FROM public.suppliers WHERE user_id = auth.uid()
    )
);

-- Sellers can insert their own documents
CREATE POLICY "Sellers can upload verification documents"
ON public.verification_documents FOR INSERT
WITH CHECK (
    supplier_id IN (
        SELECT id FROM public.suppliers WHERE user_id = auth.uid()
    )
);

-- Admins can view all documents
CREATE POLICY "Admins can view all verification documents"
ON public.verification_documents FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE user_id = auth.uid() AND app_role = 'admin'
    )
);

-- Admins can update document status
CREATE POLICY "Admins can update verification documents"
ON public.verification_documents FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE user_id = auth.uid() AND app_role = 'admin'
    )
);

-- Sellers can view their own verification requests
CREATE POLICY "Sellers can view own verification requests"
ON public.verification_requests FOR SELECT
USING (
    supplier_id IN (
        SELECT id FROM public.suppliers WHERE user_id = auth.uid()
    )
);

-- Sellers can create verification requests
CREATE POLICY "Sellers can create verification requests"
ON public.verification_requests FOR INSERT
WITH CHECK (
    supplier_id IN (
        SELECT id FROM public.suppliers WHERE user_id = auth.uid()
    )
);

-- Admins can view all verification requests
CREATE POLICY "Admins can view all verification requests"
ON public.verification_requests FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE user_id = auth.uid() AND app_role = 'admin'
    )
);

-- Admins can update verification requests
CREATE POLICY "Admins can update verification requests"
ON public.verification_requests FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE user_id = auth.uid() AND app_role = 'admin'
    )
);

-- Add verified_at column to suppliers table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='suppliers' AND column_name='verified_at') THEN
        ALTER TABLE public.suppliers ADD COLUMN verified_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Create storage bucket for verification documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('verification-documents', 'verification-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for verification documents
CREATE POLICY "Sellers can upload verification documents to storage"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'verification-documents' AND
    (storage.foldername(name))[1] IN (
        SELECT id::text FROM public.suppliers WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Sellers can view own verification documents in storage"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'verification-documents' AND
    (storage.foldername(name))[1] IN (
        SELECT id::text FROM public.suppliers WHERE user_id = auth.uid()
    )
);

CREATE POLICY "Admins can view all verification documents in storage"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'verification-documents' AND
    EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE user_id = auth.uid() AND app_role = 'admin'
    )
);
