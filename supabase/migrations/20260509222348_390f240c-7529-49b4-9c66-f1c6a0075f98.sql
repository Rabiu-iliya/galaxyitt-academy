
-- Cohorts: assign instructor
ALTER TABLE public.cohorts ADD COLUMN IF NOT EXISTS instructor_id uuid;

-- Modules / Lessons: link to cohort & instructor
ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS cohort_id uuid;
ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS instructor_id uuid;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS cohort_id uuid;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS instructor_id uuid;

-- Tighten RLS for instructors on modules
DROP POLICY IF EXISTS "Instructors can manage modules" ON public.modules;
CREATE POLICY "Instructors manage own modules" ON public.modules
  FOR ALL TO authenticated
  USING (instructor_id = auth.uid())
  WITH CHECK (instructor_id = auth.uid());

-- Tighten RLS for instructors on lessons
DROP POLICY IF EXISTS "Instructors can manage lessons" ON public.lessons;
CREATE POLICY "Instructors manage own lessons" ON public.lessons
  FOR ALL TO authenticated
  USING (instructor_id = auth.uid())
  WITH CHECK (instructor_id = auth.uid());

-- Announcements
DO $$ BEGIN
  CREATE TYPE public.announcement_audience AS ENUM ('all','students','instructors');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  audience public.announcement_audience NOT NULL DEFAULT 'all',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read announcements" ON public.announcements
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage announcements" ON public.announcements
  FOR ALL TO authenticated
  USING (is_admin_or_super_admin(auth.uid()))
  WITH CHECK (is_admin_or_super_admin(auth.uid()));

-- App settings (single row)
CREATE TABLE IF NOT EXISTS public.app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'GalaxyITT Technology Academy',
  contact_email text NOT NULL DEFAULT 'info@galaxyitt.com.ng',
  contact_phone text NOT NULL DEFAULT '08039606006',
  scholarship_open boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read settings" ON public.app_settings
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins update settings" ON public.app_settings
  FOR UPDATE TO authenticated USING (is_admin_or_super_admin(auth.uid()));
CREATE POLICY "Admins insert settings" ON public.app_settings
  FOR INSERT TO authenticated WITH CHECK (is_admin_or_super_admin(auth.uid()));

INSERT INTO public.app_settings (site_name) 
SELECT 'GalaxyITT Technology Academy'
WHERE NOT EXISTS (SELECT 1 FROM public.app_settings);

CREATE TRIGGER trg_app_settings_updated
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
