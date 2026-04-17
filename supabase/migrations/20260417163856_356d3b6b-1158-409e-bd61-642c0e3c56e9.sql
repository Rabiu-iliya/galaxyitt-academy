
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own certificates"
ON public.certificates FOR SELECT TO authenticated
USING (user_id = auth.uid() OR is_admin_or_super_admin(auth.uid()));

CREATE POLICY "Admins manage certificates"
ON public.certificates FOR ALL TO authenticated
USING (is_admin_or_super_admin(auth.uid()))
WITH CHECK (is_admin_or_super_admin(auth.uid()));

CREATE POLICY "System can insert certificates"
ON public.certificates FOR INSERT TO authenticated
WITH CHECK (true);
