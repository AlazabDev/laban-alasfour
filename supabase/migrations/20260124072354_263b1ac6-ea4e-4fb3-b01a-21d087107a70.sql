-- Create storage bucket for product assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-assets', 
  'product-assets', 
  true,
  52428800, -- 50MB limit
  ARRAY[
    'image/jpeg',
    'image/png', 
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'model/gltf-binary',
    'model/gltf+json',
    'application/octet-stream',
    'application/json',
    'text/plain',
    'application/pdf'
  ]
);

-- Create storage bucket for 3D models
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES (
  '3d-models', 
  '3d-models', 
  true,
  104857600 -- 100MB limit for 3D models
);

-- Create storage bucket for design files
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES (
  'design-files', 
  'design-files', 
  true,
  209715200 -- 200MB limit for design files
);

-- Allow public read access to product-assets
CREATE POLICY "Public read access for product assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-assets');

-- Allow authenticated users to upload to product-assets
CREATE POLICY "Allow upload to product assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-assets');

-- Allow update on product-assets
CREATE POLICY "Allow update on product assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-assets');

-- Allow delete on product-assets
CREATE POLICY "Allow delete on product assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-assets');

-- Allow public read access to 3d-models
CREATE POLICY "Public read access for 3d models"
ON storage.objects FOR SELECT
USING (bucket_id = '3d-models');

-- Allow upload to 3d-models
CREATE POLICY "Allow upload to 3d models"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = '3d-models');

-- Allow update on 3d-models
CREATE POLICY "Allow update on 3d models"
ON storage.objects FOR UPDATE
USING (bucket_id = '3d-models');

-- Allow delete on 3d-models
CREATE POLICY "Allow delete on 3d models"
ON storage.objects FOR DELETE
USING (bucket_id = '3d-models');

-- Allow public read access to design-files
CREATE POLICY "Public read access for design files"
ON storage.objects FOR SELECT
USING (bucket_id = 'design-files');

-- Allow upload to design-files
CREATE POLICY "Allow upload to design files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'design-files');

-- Allow update on design-files
CREATE POLICY "Allow update on design files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'design-files');

-- Allow delete on design-files
CREATE POLICY "Allow delete on design files"
ON storage.objects FOR DELETE
USING (bucket_id = 'design-files');

-- Create table to track uploaded files metadata
CREATE TABLE public.uploaded_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  bucket_id TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  file_type TEXT NOT NULL, -- 'image', '3d-model', 'design', 'video', 'document'
  metadata JSONB DEFAULT '{}',
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  uploaded_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on uploaded_files
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;

-- Allow public read on uploaded_files
CREATE POLICY "Public read access for uploaded files"
ON public.uploaded_files FOR SELECT
USING (true);

-- Allow insert on uploaded_files
CREATE POLICY "Allow insert on uploaded files"
ON public.uploaded_files FOR INSERT
WITH CHECK (true);

-- Allow update on uploaded_files
CREATE POLICY "Allow update on uploaded files"
ON public.uploaded_files FOR UPDATE
USING (true);

-- Allow delete on uploaded_files
CREATE POLICY "Allow delete on uploaded files"
ON public.uploaded_files FOR DELETE
USING (true);

-- Create index for better performance
CREATE INDEX idx_uploaded_files_product_id ON public.uploaded_files(product_id);
CREATE INDEX idx_uploaded_files_category_id ON public.uploaded_files(category_id);
CREATE INDEX idx_uploaded_files_file_type ON public.uploaded_files(file_type);
CREATE INDEX idx_uploaded_files_bucket_id ON public.uploaded_files(bucket_id);