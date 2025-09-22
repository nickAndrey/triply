'use server';

import { createClient } from '@/utils/supabase/server';

export async function sendResetPasswordEmail(fields: { email: string }) {
  const supabase = await createClient();

  const { error, data } = await supabase.auth.resetPasswordForEmail(
    fields.email
  );

  if (error) {
    switch (error.code) {
      case 'user_not_found':
        return {
          success: false,
          errors: { email: { errors: [error.message] } },
        };
      default:
        return {
          success: false,
          errors: { general: { errors: [error.message] } },
        };
    }
  }

  return { success: true, data };
}
