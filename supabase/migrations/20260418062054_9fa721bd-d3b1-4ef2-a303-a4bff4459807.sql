
-- Revert the over-permissive policies from the previous migration
DROP POLICY IF EXISTS "Public can view profile names for verification" ON public.profiles;
DROP POLICY IF EXISTS "Public verification of certificates" ON public.certificates;
DROP VIEW IF EXISTS public.profiles_public;

-- Safe verification function: returns only minimal public info for one certificate
CREATE OR REPLACE FUNCTION public.verify_certificate(cert_id UUID)
RETURNS TABLE (
  certificate_id UUID,
  student_name TEXT,
  program_name TEXT,
  issued_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.id,
    p.full_name,
    pr.name,
    c.issued_at::timestamptz
  FROM public.certificates c
  LEFT JOIN public.profiles p ON p.user_id = c.user_id
  LEFT JOIN public.programs pr ON pr.id = c.program_id
  WHERE c.id = cert_id
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.verify_certificate(UUID) TO anon, authenticated;
