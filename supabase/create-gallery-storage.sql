-- Create storage bucket for gallery images (run in Supabase SQL Editor)

INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users (admins) to upload
CREATE POLICY "Admins can upload gallery images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery-images');

-- Allow authenticated users to update/replace
CREATE POLICY "Admins can update gallery images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'gallery-images');

-- Allow authenticated users to delete
CREATE POLICY "Admins can delete gallery images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery-images');

-- Allow public read access (images displayed on public gallery)
CREATE POLICY "Public can view gallery images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'gallery-images');
