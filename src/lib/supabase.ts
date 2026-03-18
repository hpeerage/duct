import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://avtdtuiocdiycmtpykid.supabase.co';
const supabaseAnonKey = 'sb_publishable_eSklQCAiYJI2Z08opTd8FA_wBheTPmy';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
