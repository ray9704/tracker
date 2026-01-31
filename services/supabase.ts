
import { createClient } from '@supabase/supabase-js';

/**
 * RAYYAN: LINKING STATUS
 * Aapne credentials sahi paste kar diye hain.
 * Ab ye logic check karega ke placeholders remove ho gaye hain ya nahi.
 */
const SUPABASE_URL = 'https://cnklzyyillazmfqcoyqf.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNua2x6eXlpbGxhem1mcWNveXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4Njc3OTEsImV4cCI6MjA4NTQ0Mzc5MX0._sPjiIhg-IGWyfuNONPQIdmX0DUca4-fcn0B6uMLJ7E';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const isSupabaseConfigured = () => {
  // Check if the URL is a valid Supabase URL and not the initial placeholder
  return (
    SUPABASE_URL.includes('supabase.co') && 
    !SUPABASE_URL.includes('your-project-url') &&
    SUPABASE_ANON_KEY.length > 20
  );
};
