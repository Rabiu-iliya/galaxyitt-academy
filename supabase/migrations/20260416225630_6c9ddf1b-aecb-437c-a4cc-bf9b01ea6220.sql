
CREATE TYPE public.scholarship_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.scholarship_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  program_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status public.scholarship_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID,
  review_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.scholarship_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications"
  ON public.scholarship_applications FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin_or_super_admin(auth.uid()));

CREATE POLICY "Users can create own application"
  ON public.scholarship_applications FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update applications"
  ON public.scholarship_applications FOR UPDATE TO authenticated
  USING (public.is_admin_or_super_admin(auth.uid()));

CREATE POLICY "Admins can delete applications"
  ON public.scholarship_applications FOR DELETE TO authenticated
  USING (public.is_admin_or_super_admin(auth.uid()));

CREATE TRIGGER update_scholarship_applications_updated_at
  BEFORE UPDATE ON public.scholarship_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_scholarship_user ON public.scholarship_applications(user_id);
CREATE INDEX idx_scholarship_status ON public.scholarship_applications(status);
