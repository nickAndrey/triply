import { Metadata } from 'next';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@chadcn/components/ui/card';

import { ForgotPasswordForm } from '@/app/(auth)/forgot-password/_components/forgot-password-form';

export const metadata: Metadata = {
  title: 'Triply | Forgot Password',
  description: 'Triply — AI-Powered Travel Planner',
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex items-center px-4 justify-center min-h-screen">
      <Card className="w-md">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            Enter your registered email and we’ll send you instructions to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col">
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </main>
  );
}
