'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const schema = z.object({
  username: z.string().min(1, 'Field is required'),
  email: z.email('Email is invalid'),
  password: z.string().min(1, 'Field is required'),
});

type FormFields = z.infer<typeof schema>;

export async function signup(formData: FormFields) {
  const supabase = await createClient();
  const validatedFields = schema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.treeifyError(validatedFields.error).properties,
    };
  }

  const { error } = await supabase.auth.signUp({
    ...validatedFields.data,
    options: {
      emailRedirectTo: '/login',
      data: {
        username: validatedFields.data.username,
      },
    },
  });

  if (error) {
    switch (error.code) {
      case 'user_already_exists':
      case 'email_exists':
        return {
          success: false,
          errors: { email: { errors: [error.message] } },
        };
      case 'weak_password':
        return {
          success: false,
          errors: { password: { errors: [error.message] } },
        };
      default:
        return {
          success: false,
          errors: { general: { errors: [error.message] } },
        };
    }
  }

  redirect('/signup?confirmation_sent=true');
}
