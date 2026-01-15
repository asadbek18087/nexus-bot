import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://fjbvkzwcptdkwuyqhptv.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_KEY || 'sbp_100f89a0dee0e7ace0877585f4f49082f081df7a'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
