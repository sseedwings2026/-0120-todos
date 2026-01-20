
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mmyrsouqnuevyoxxryso.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable__aPsUxL63ASkPODr2GPARA_1BMEoQ4W';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Supabase SQL Schema (Run this in your Supabase SQL Editor):
 * 
 * CREATE TABLE todos (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   created_at TIMESTAMPTZ DEFAULT now(),
 *   title TEXT NOT NULL,
 *   is_completed BOOLEAN DEFAULT false,
 *   priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
 *   category TEXT
 * );
 * 
 * -- Enable Row Level Security
 * ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
 * 
 * -- Create a policy that allows anyone to read/write for this demo
 * -- (In production, use auth.uid() checks)
 * CREATE POLICY "Allow public access" ON todos FOR ALL USING (true) WITH CHECK (true);
 */
