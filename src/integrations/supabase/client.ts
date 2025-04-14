
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fksilcutrywgzlvxqdks.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2lsY3V0cnl3Z3psdnhxZGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2Mzk3ODUsImV4cCI6MjA2MDIxNTc4NX0.0b70zPidWwylIfOHgNvl-4NBbZJjBFvY0F1go0aznZ8";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
  }
});
