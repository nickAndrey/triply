import { redirect } from 'next/navigation';

export async function requireAuth<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if ((error as Error).message === 'UNAUTHORIZED') {
      redirect('/login');
    }
    throw error;
  }
}
