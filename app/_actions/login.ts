'use server';

import { z } from 'zod';

import { createClient } from '@/utils/supabase/server';

const schema = z.object({
  email: z.email('Email is required'),
  password: z.string().min(1, 'Field is required'),
});

type FormFields = z.infer<typeof schema>;

export async function login(formData: FormFields) {
  const supabase = await createClient();
  const validatedFields = schema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.treeifyError(validatedFields.error).properties,
    };
  }

  const {
    error,
    data: { user },
  } = await supabase.auth.signInWithPassword(validatedFields.data);

  if (error) {
    switch (error.code) {
      case 'invalid_credentials':
        return {
          success: false,
          errors: { invalid_credentials: { errors: [error.message] } },
        };
      case 'email_not_confirmed':
        return {
          success: false,
          errors: { email_not_confirmed: { errors: [error.message] } },
        };
      default:
        return {
          success: false,
          errors: { general: { errors: [error.message] } },
        };
    }
  }

  return { success: true, user };
}
