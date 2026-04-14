
-- Drop the overly broad SELECT policy
DROP POLICY IF EXISTS "Anyone can view lesson videos" ON storage.objects;

-- Replace with a policy that allows reading specific files but not listing
CREATE POLICY "Authenticated can view lesson videos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'lesson-videos');
