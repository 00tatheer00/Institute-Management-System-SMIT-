import { getSupabaseBrowserClient, isSupabaseConfigured } from "./client";

export type StorageBucket =
  | "student-documents"
  | "profile-images"
  | "certificates"
  | "learning-materials"
  | "project-files"
  | "gallery"
  | "support-attachments";

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Upload a file to a designated Supabase Storage bucket.
 * In offline/demo mode, simulates an upload and returns a local object URL or placeholder.
 */
export async function uploadFile(
  bucket: StorageBucket,
  path: string,
  file: File | Blob
): Promise<UploadResult> {
  if (!isSupabaseConfigured()) {
    // Graceful offline fallback
    const mockUrl = `/uploads/${bucket}/${path.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    return {
      success: true,
      url: mockUrl,
      path,
    };
  }

  try {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrlData.publicUrl,
      path: data.path,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to upload file to storage",
    };
  }
}

/**
 * Get a public URL for a file in a public bucket.
 */
export function getStoragePublicUrl(bucket: StorageBucket, path: string): string {
  if (!isSupabaseConfigured()) {
    return `/uploads/${bucket}/${path}`;
  }
  const supabase = getSupabaseBrowserClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Create a signed temporary URL for sensitive private buckets (e.g. student-documents).
 */
export async function createSignedUrl(
  bucket: StorageBucket,
  path: string,
  expiresInSeconds = 3600
): Promise<string | null> {
  if (!isSupabaseConfigured()) {
    return `/uploads/${bucket}/${path}`;
  }
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSeconds);
  if (error || !data) return null;
  return data.signedUrl;
}
