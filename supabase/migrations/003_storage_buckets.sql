-- =============================================================================
-- MOHSIN AND HUMA IT CENTER (MHIT) × SMIT PORTAL
-- Migration 003: Supabase Storage Buckets & Access Control Policies
-- =============================================================================

-- 1. Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('student-documents', 'student-documents', false, 10485760, ARRAY['image/jpeg', 'image/png', 'application/pdf']),
  ('profile-images', 'profile-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('certificates', 'certificates', true, 10485760, ARRAY['image/png', 'application/pdf']),
  ('learning-materials', 'learning-materials', false, 52428800, ARRAY['application/pdf', 'application/zip', 'text/plain', 'image/jpeg', 'image/png']),
  ('project-files', 'project-files', true, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('gallery', 'gallery', true, 15728640, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('support-attachments', 'support-attachments', false, 10485760, ARRAY['image/jpeg', 'image/png', 'application/pdf', 'text/plain'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage Policies for Student Documents (Private)
CREATE POLICY "Students can read their own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'student-documents'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR is_admin_or_super())
  );

CREATE POLICY "Students can upload their own documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'student-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 3. Storage Policies for Profile Images (Public Read, Owner Update)
CREATE POLICY "Public can view profile avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload their own profile avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 4. Storage Policies for Certificates (Public Read, Admin Write)
CREATE POLICY "Public can view issued certificates"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'certificates');

CREATE POLICY "Admins can upload certificates"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'certificates'
    AND is_admin_or_super()
  );

-- 5. Storage Policies for Learning Materials (Authenticated Read, Trainer/Admin Write)
CREATE POLICY "Enrolled students and staff can view learning materials"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'learning-materials'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Trainers and Admins can upload learning materials"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'learning-materials'
    AND (is_admin_or_super() OR current_user_role() = 'trainer')
  );

-- 6. Storage Policies for Gallery (Public Read, Admin Write)
CREATE POLICY "Public can view media gallery images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Admins can upload gallery images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'gallery'
    AND is_admin_or_super()
  );
