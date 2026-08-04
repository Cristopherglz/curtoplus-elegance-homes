CREATE POLICY "Public read property images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'property-images');