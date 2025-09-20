'use server';

import { createClient } from '@/utils/supabase/server';

export async function sendResetPasswordEmail(fields: { email: string }) {
  const supabase = await createClient();

  const { error, data } = await supabase.auth.resetPasswordForEmail(
    fields.email
  );

  if (error) {
    return { success: false, error };
  }

  return { success: true, data };
}
