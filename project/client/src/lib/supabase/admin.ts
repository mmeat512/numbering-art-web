import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * 관리자용 Supabase 클라이언트 (Service Role Key 사용)
 * RLS를 우회하여 Storage 업로드 및 DB 작업 수행
 * 주의: 서버 사이드에서만 사용할 것
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase admin credentials')
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
