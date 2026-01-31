
import { createClient } from '@supabase/supabase-js';

/**
 * RAYYAN: LINKING INSTRUCTIONS
 * 1. Go to https://supabase.com
 * 2. Create a Project.
 * 3. Go to Project Settings -> API.
 * 4. Copy 'Project URL' and 'anon' public key.
 * 5. Replace the strings below.
 */
const SUPABASE_URL = 'https://cnklzyyillazmfqcoyqf.supabase.co'; // <--- PASTE URL HERE
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNua2x6eXlpbGxhem1mcWNveXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4Njc3OTEsImV4cCI6MjA4NTQ0Mzc5MX0._sPjiIhg-IGWyfuNONPQIdmX0DUca4-fcn0B6uMLJ7E';           // <--- PASTE KEY HERE

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const isSupabaseConfigured = () => {
  return SUPABASE_URL !== 'https://cnklzyyillazmfqcoyqf.supabase.co' && SUPABASE_ANON_KEY !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNua2x6eXlpbGxhem1mcWNveXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4Njc3OTEsImV4cCI6MjA4NTQ0Mzc5MX0._sPjiIhg-IGWyfuNONPQIdmX0DUca4-fcn0B6uMLJ7E';
};
