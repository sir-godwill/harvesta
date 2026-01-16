-- Fix missing user_profiles view referenced by application code
-- This view maps to the existing profiles table.

CREATE OR REPLACE VIEW public.user_profiles AS
SELECT * FROM public.profiles;

-- Grant access to authenticated users
GRANT SELECT ON public.user_profiles TO authenticated;
GRANT SELECT ON public.user_profiles TO service_role;
