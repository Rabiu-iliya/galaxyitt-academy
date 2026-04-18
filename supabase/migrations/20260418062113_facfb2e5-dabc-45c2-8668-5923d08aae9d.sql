
DROP POLICY IF EXISTS "Public can view signature images" ON storage.objects;

-- Replace any over-broad lesson-videos/signatures listing policies with admin-only listing.
-- Public URL access still works because public buckets serve files at /object/public/<bucket>/<path> without RLS.
CREATE POLICY "Admins can list signature objects"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'signatures' AND public.is_admin_or_super_admin(auth.uid()));

-- For lesson-videos: drop any wide-open SELECT and let only admins/instructors list.
-- (Public URL playback still works for students.)
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects'
      AND policyname ILIKE '%lesson%'
      AND cmd = 'SELECT'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "Staff can list lesson-videos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'lesson-videos'
    AND (public.is_admin_or_super_admin(auth.uid()) OR public.has_role(auth.uid(), 'instructor'::app_role))
  );
