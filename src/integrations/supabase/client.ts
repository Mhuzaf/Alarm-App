// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zxebjakcyrwrzupwqpup.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZWJqYWtjeXJ3cnp1cHdxcHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjg0NTUsImV4cCI6MjA2MDg0NDQ1NX0.qoaZijeUSuTb9uk4sHFfjId8vm2Q9aaDA8EV_k_uJdo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);