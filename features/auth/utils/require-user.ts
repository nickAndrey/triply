import { redirect } from 'next/navigation';

import { createClient } from '@/utils/supabase/server';

export async function requireUser() {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) redirect('/login');

  return { user: authData.user, supabase };
}
