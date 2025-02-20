
import { createClient } from '@supabase/supabase-js';

// استبدل هذه القيم بالقيم من لوحة تحكم Supabase الخاصة بك
const supabaseUrl = process.env.SUPABASE_URL || 'https://qfnbsvxtunwbtgixoecg.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbmJzdnh0dW53YnRnaXhvZWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0MDE0NDYsImV4cCI6MjAyMjk3NzQ0Nn0.b2q9wsXNzBcCJ9A7gZVkIR9KeK1_J2RRvJKS0QzWkgE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
