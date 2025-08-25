import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm'

const supabaseUrl = 'https://yucfdutylfiolnptzkvt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1Y2ZkdXR5bGZpb2xucHR6a3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MjExMDgsImV4cCI6MjA2MzA5NzEwOH0.Fg80AmrhVvBuyxU855xc4qV7HfucWFF2VhmiFTiKUDo'

export const supabase = createClient(supabaseUrl, supabaseKey) 