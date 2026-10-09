
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = `https://${import.meta.env.PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey!)


export default supabase