'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormState = {
  fields: {
    email: string;
    password: string;
  };
  success: boolean;
  apiError?: string;
  errors?: {
    email?: { errors: string[] };
    password?: { errors: string[] };
  };
};

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient();

  const fields = {
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  };

  const parsed = loginSchema.safeParse(fields);

  if (!parsed.success) {
    return {
      errors: z.treeifyError(parsed.error).properties,
      success: false,
      fields,
    };
  }

  const { email, password } = parsed.data;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      apiError: error.message,
      success: false,
      fields,
    };
  }

  revalidatePath('/');
  redirect('/');
}
