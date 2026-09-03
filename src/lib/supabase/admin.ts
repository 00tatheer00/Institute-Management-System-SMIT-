import { createClient } from "@supabase/supabase-js";

let adminClient: any = null;

export function getSupabaseAdminClient() {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY is not defined. Falling back to anon key (restricted).");
    return createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key");
  }

  adminClient = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}
