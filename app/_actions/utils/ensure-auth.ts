'use server';

import { type User } from '@supabase/supabase-js';

import { createClient } from '@/utils/supabase/server';

export async function ensureAuth(): Promise<User> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error('Authentication error — please sign in again.');
  if (!data.user) throw new Error('Session expired or user not signed in.');

  return data.user;
}
