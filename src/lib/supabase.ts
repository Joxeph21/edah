
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = `https://${import.meta.env.PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey!)
import {
  getSecret,
 } from 'astro:env/server';



const serverBase = createClient(supabaseUrl, getSecret('SUPABASE_SERVICE_ROLE')!)


export default supabase

export {serverBase}