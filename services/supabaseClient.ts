import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sjkodhsuwixzlhpxhfay.supabase.co';
const supabaseKey = 'sb_publishable_-DNsRCpvGqMrGyrRfnKv7w_5c0dQBuv';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be provided.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);