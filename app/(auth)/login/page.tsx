import { Metadata } from 'next';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@chadcn/components/ui/card';

import { LoginForm } from '@/app/(auth)/login/_components/login-form';

export const metadata: Metadata = {
  title: 'Triply | Login',
  description: 'Triply — AI-Powered Travel Planner',
};

export default function LoginPage() {
  return (
    <main className="flex items-center px-4 justify-center min-h-screen">
      <Card className="w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Use your registered email and password to continue.</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col">
          <LoginForm />
          <p className="text-sm flex items-center gap-2 ml-auto mt-4">
            Don&apos;t have an account?
            <Link href="/signup" className="hover:underline font-bold">
              Sign up now
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
