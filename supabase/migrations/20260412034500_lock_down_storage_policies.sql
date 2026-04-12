-- Lock down public file mutations before production rollout.
-- Public assets stay readable, while writes are limited to owner users only.

DROP POLICY IF EXISTS "Allow upload to product assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow update on product assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete on product assets" ON storage.objects;

DROP POLICY IF EXISTS "Allow upload to 3d models" ON storage.objects;
DROP POLICY IF EXISTS "Allow update on 3d models" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete on 3d models" ON storage.objects;

DROP POLICY IF EXISTS "Allow upload to design files" ON storage.objects;
DROP POLICY IF EXISTS "Allow update on design files" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete on design files" ON storage.objects;

DROP POLICY IF EXISTS "Public read access for uploaded files" ON public.uploaded_files;
DROP POLICY IF EXISTS "Allow insert on uploaded files" ON public.uploaded_files;
DROP POLICY IF EXISTS "Allow update on uploaded files" ON public.uploaded_files;
DROP POLICY IF EXISTS "Allow delete on uploaded files" ON public.uploaded_files;

CREATE POLICY "Owners can upload product assets"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-assets'
  AND auth.uid() IN (SELECT id FROM public.users WHERE role = 'owner')
);

CREATE POLICY "Owners can update product assets"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-assets'
  AND auth.uid() IN (SELECT id FROM public.users WHERE role = 'owner')
)
WITH CHECK (
  bucket_id = 'product-assets'
  AND auth.uid() IN (SELECT id FROM public.users WHERE role = 'owner')
);

CREATE POLICY "Owners can delete product assets"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-assets'
  AND auth.uid() IN (SELECT id FROM public.users WHERE role = 'owner')
);

CREATE POLICY "Owners can upload 3d models"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = '3d-models'
  AND auth.uid() IN (SELECT id FROM public.users WHERE role = 'owner')
);

CREATE POLICY "Owners can update 3d models"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = '3d-models'
  AND auth.uid() IN (SELECT id FROM public.users WHERE role = 'owner')
)
WITH CHECK (
  bucket_id = '3d-models'
  AND auth.uid() IN (SELECT id FROM public.users WHERE role = 'owner')
);

CREATE POLICY "Owners can delete 3d models"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = '3d-models'
  AND auth.uid() IN (SELECT id FROM public.users WHERE role = 'owner')
);

CREATE POLICY "Owners can upload design files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'design-files'
  AND auth.uid() IN (SELECT id FROM public.users WHERE role = 'owner')
);

CREATE POLICY "Owners can update design files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'design-files'
  AND auth.uid() IN (SELECT id FROM public.users WHERE role = 'owner')
)
WITH CHECK (
  bucket_id = 'design-files'
  AND auth.uid() IN (SELECT id FROM public.users WHERE role = 'owner')
);

CREATE POLICY "Owners can delete design files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'design-files'
  AND auth.uid() IN (SELECT id FROM public.users WHERE role = 'owner')
);

CREATE POLICY "Owners can view uploaded files"
ON public.uploaded_files
FOR SELECT
TO authenticated
USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'owner'));

CREATE POLICY "Owners can insert uploaded files"
ON public.uploaded_files
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IN (SELECT id FROM public.users WHERE role = 'owner'));

CREATE POLICY "Owners can update uploaded files"
ON public.uploaded_files
FOR UPDATE
TO authenticated
USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'owner'))
WITH CHECK (auth.uid() IN (SELECT id FROM public.users WHERE role = 'owner'));

CREATE POLICY "Owners can delete uploaded files"
ON public.uploaded_files
FOR DELETE
TO authenticated
USING (auth.uid() IN (SELECT id FROM public.users WHERE role = 'owner'));
