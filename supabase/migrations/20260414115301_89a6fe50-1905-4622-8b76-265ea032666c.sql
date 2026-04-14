
-- Modules table
CREATE TABLE public.modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_number INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view modules" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Admins can manage modules" ON public.modules FOR ALL TO authenticated
  USING (is_admin_or_super_admin(auth.uid())) WITH CHECK (is_admin_or_super_admin(auth.uid()));
CREATE POLICY "Instructors can manage modules" ON public.modules FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'instructor')) WITH CHECK (has_role(auth.uid(), 'instructor'));

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Lessons table
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  order_number INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Admins can manage lessons" ON public.lessons FOR ALL TO authenticated
  USING (is_admin_or_super_admin(auth.uid())) WITH CHECK (is_admin_or_super_admin(auth.uid()));
CREATE POLICY "Instructors can manage lessons" ON public.lessons FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'instructor')) WITH CHECK (has_role(auth.uid(), 'instructor'));

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Live classes table
CREATE TABLE public.live_classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  cohort_id UUID REFERENCES public.cohorts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  meeting_link TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view live classes" ON public.live_classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage live classes" ON public.live_classes FOR ALL TO authenticated
  USING (is_admin_or_super_admin(auth.uid())) WITH CHECK (is_admin_or_super_admin(auth.uid()));
CREATE POLICY "Instructors can manage live classes" ON public.live_classes FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'instructor')) WITH CHECK (has_role(auth.uid(), 'instructor'));

CREATE TRIGGER update_live_classes_updated_at BEFORE UPDATE ON public.live_classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Assignments table
CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view assignments" ON public.assignments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage assignments" ON public.assignments FOR ALL TO authenticated
  USING (is_admin_or_super_admin(auth.uid())) WITH CHECK (is_admin_or_super_admin(auth.uid()));
CREATE POLICY "Instructors can manage assignments" ON public.assignments FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'instructor')) WITH CHECK (has_role(auth.uid(), 'instructor'));

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Submissions table
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  file_url TEXT,
  notes TEXT,
  grade TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own submissions" ON public.submissions FOR SELECT TO authenticated
  USING ((student_id = auth.uid()) OR is_admin_or_super_admin(auth.uid()) OR has_role(auth.uid(), 'instructor'));
CREATE POLICY "Students can create own submissions" ON public.submissions FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());
CREATE POLICY "Admins can manage submissions" ON public.submissions FOR ALL TO authenticated
  USING (is_admin_or_super_admin(auth.uid())) WITH CHECK (is_admin_or_super_admin(auth.uid()));
CREATE POLICY "Instructors can update submissions" ON public.submissions FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'instructor'));

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add is_paid to enrollments
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS is_paid BOOLEAN NOT NULL DEFAULT true;

-- Storage bucket for lesson videos
INSERT INTO storage.buckets (id, name, public) VALUES ('lesson-videos', 'lesson-videos', true);

CREATE POLICY "Anyone can view lesson videos" ON storage.objects FOR SELECT USING (bucket_id = 'lesson-videos');
CREATE POLICY "Admins can upload lesson videos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'lesson-videos' AND (is_admin_or_super_admin(auth.uid()) OR has_role(auth.uid(), 'instructor')));
CREATE POLICY "Admins can delete lesson videos" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'lesson-videos' AND (is_admin_or_super_admin(auth.uid()) OR has_role(auth.uid(), 'instructor')));
