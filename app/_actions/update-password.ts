'use server';

import { createClient } from '@/utils/supabase/server';

export async function updatePassword(fields: { password: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.updateUser({
    password: fields.password,
  });

  if (error) {
    return { success: false, error };
  }

  return { success: true, data };
}
