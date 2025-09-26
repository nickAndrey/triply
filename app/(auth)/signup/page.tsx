import { SignupForm } from '@/app/(auth)/signup/_components/signup-form/signup-form';
import { Alert, AlertDescription, AlertTitle } from '@/chadcn/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/chadcn/components/ui/card';
import { CheckCircle2Icon } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Triply | Sign Up',
  description: 'Create a new account on Triply — your AI-Powered Travel Planner',
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SignupPage({ searchParams }: PageProps) {
  const { confirmation_sent } = await searchParams;

  if (Boolean(confirmation_sent)) {
    return (
      <main className="flex items-center px-4 justify-center min-h-screen">
        <Alert className="w-md">
          <CheckCircle2Icon />
          <AlertTitle>Account created successfully</AlertTitle>
          <AlertDescription>
            <p>
              We’ve sent you a confirmation link. Please check your{' '}
              <span>
                <strong>email</strong>
              </span>{' '}
              to verify your account before logging in.
            </p>
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  return (
    <main className="flex items-center px-4 justify-center min-h-screen">
      <Card className="w-md">
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
          <CardDescription>Create your account to start planning amazing trips with Triply.</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col">
          <SignupForm />
          <p className="text-sm inline-flex items-center gap-2 mt-4 ml-auto">
            Already have an account?
            <Link href="/login" className="hover:underline font-bold">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
