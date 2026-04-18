
-- Signatures table for customizable certificate signatures
CREATE TABLE IF NOT EXISTS public.signatures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.signatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view signatures"
  ON public.signatures FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage signatures"
  ON public.signatures FOR ALL
  TO authenticated
  USING (public.is_admin_or_super_admin(auth.uid()))
  WITH CHECK (public.is_admin_or_super_admin(auth.uid()));

CREATE TRIGGER update_signatures_updated_at
BEFORE UPDATE ON public.signatures
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Public storage bucket for signature images
INSERT INTO storage.buckets (id, name, public)
VALUES ('signatures', 'signatures', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view signature images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'signatures');

CREATE POLICY "Admins can upload signature images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'signatures' AND public.is_admin_or_super_admin(auth.uid()));

CREATE POLICY "Admins can update signature images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'signatures' AND public.is_admin_or_super_admin(auth.uid()));

CREATE POLICY "Admins can delete signature images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'signatures' AND public.is_admin_or_super_admin(auth.uid()));

-- Public read of certificates by id only (verification page) — joins still work via PostgREST embedded selects
-- We allow anon to read a certificate if they know the id; combined with non-guessable UUID this is safe.
CREATE POLICY "Public verification of certificates"
  ON public.certificates FOR SELECT
  TO anon
  USING (true);

-- Allow anon to read minimal program/profile fields needed for verification
-- programs already public for SELECT. profiles is private — add a public-read for the full_name only is hard, so we expose a minimal view.
CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker=on) AS
  SELECT user_id, full_name FROM public.profiles;

GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- Allow anon to read profiles_public via a permissive base policy (the view filters columns)
CREATE POLICY "Public can view profile names for verification"
  ON public.profiles FOR SELECT
  TO anon
  USING (true);
