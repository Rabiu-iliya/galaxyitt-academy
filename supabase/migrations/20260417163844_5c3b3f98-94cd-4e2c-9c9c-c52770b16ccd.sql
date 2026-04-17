
-- PROJECTS TABLE
CREATE TYPE public.project_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  program_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  repo_url TEXT,
  live_url TEXT,
  status public.project_status NOT NULL DEFAULT 'pending',
  review_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own projects"
ON public.projects FOR SELECT TO authenticated
USING (student_id = auth.uid() OR is_admin_or_super_admin(auth.uid()) OR has_role(auth.uid(), 'instructor'::app_role));

CREATE POLICY "Students can create own projects"
ON public.projects FOR INSERT TO authenticated
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own pending projects"
ON public.projects FOR UPDATE TO authenticated
USING (student_id = auth.uid() AND status = 'pending');

CREATE POLICY "Instructors and admins can review projects"
ON public.projects FOR UPDATE TO authenticated
USING (is_admin_or_super_admin(auth.uid()) OR has_role(auth.uid(), 'instructor'::app_role));

CREATE POLICY "Admins can delete projects"
ON public.projects FOR DELETE TO authenticated
USING (is_admin_or_super_admin(auth.uid()));

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- NOTIFICATIONS TABLE
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notifications"
ON public.notifications FOR SELECT TO authenticated
USING (user_id = auth.uid() OR is_admin_or_super_admin(auth.uid()));

CREATE POLICY "Users update own notifications"
ON public.notifications FOR UPDATE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can insert notifications"
ON public.notifications FOR INSERT TO authenticated
WITH CHECK (is_admin_or_super_admin(auth.uid()) OR has_role(auth.uid(), 'instructor'::app_role) OR user_id = auth.uid());

CREATE POLICY "Users can delete own notifications"
ON public.notifications FOR DELETE TO authenticated
USING (user_id = auth.uid() OR is_admin_or_super_admin(auth.uid()));

CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read);

-- SUPPORT MESSAGES TABLE
CREATE TABLE public.support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  admin_reply TEXT,
  replied_by UUID,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own support messages"
ON public.support_messages FOR SELECT TO authenticated
USING (user_id = auth.uid() OR is_admin_or_super_admin(auth.uid()));

CREATE POLICY "Users create own support messages"
ON public.support_messages FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins reply to support messages"
ON public.support_messages FOR UPDATE TO authenticated
USING (is_admin_or_super_admin(auth.uid()));

CREATE POLICY "Admins delete support messages"
ON public.support_messages FOR DELETE TO authenticated
USING (is_admin_or_super_admin(auth.uid()));

CREATE TRIGGER update_support_messages_updated_at
BEFORE UPDATE ON public.support_messages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- TRIGGER: Project approval issues certificate + notification
CREATE OR REPLACE FUNCTION public.handle_project_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'approved' THEN
      -- Issue certificate if not already exists
      INSERT INTO public.certificates (user_id, program_id)
      SELECT NEW.student_id, NEW.program_id
      WHERE NOT EXISTS (
        SELECT 1 FROM public.certificates
        WHERE user_id = NEW.student_id AND program_id = NEW.program_id
      );
      -- Notification
      INSERT INTO public.notifications (user_id, title, message, type, link)
      VALUES (NEW.student_id, 'Project Approved 🎉',
        'Congratulations! Your project "' || NEW.title || '" has been approved. Your certificate is ready.',
        'success', '/student/certificates');
    ELSIF NEW.status = 'rejected' THEN
      INSERT INTO public.notifications (user_id, title, message, type, link)
      VALUES (NEW.student_id, 'Project Needs Revision',
        'Your project "' || NEW.title || '" was not approved. ' || COALESCE('Notes: ' || NEW.review_notes, 'Please review and resubmit.'),
        'warning', '/student/projects');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_project_reviewed
AFTER UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.handle_project_review();

-- TRIGGER: Scholarship status notification
CREATE OR REPLACE FUNCTION public.handle_scholarship_review()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'approved' THEN
      INSERT INTO public.notifications (user_id, title, message, type, link)
      VALUES (NEW.user_id, 'Scholarship Approved 🎓',
        'Your scholarship application has been approved. You now have full access to the program.',
        'success', '/student/dashboard');
    ELSIF NEW.status = 'rejected' THEN
      INSERT INTO public.notifications (user_id, title, message, type, link)
      VALUES (NEW.user_id, 'Scholarship Application Update',
        'Your scholarship application was not approved. ' || COALESCE('Notes: ' || NEW.review_notes, ''),
        'warning', '/student/scholarship');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_scholarship_reviewed
AFTER UPDATE ON public.scholarship_applications
FOR EACH ROW EXECUTE FUNCTION public.handle_scholarship_review();

-- Realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
