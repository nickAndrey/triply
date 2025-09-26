import { UpdatePasswordForm } from '@/app/(auth)/update-password/_components/update-password-form';
import { Alert, AlertDescription, AlertTitle } from '@/chadcn/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/chadcn/components/ui/card';
import { AlertCircleIcon, SquareArrowOutUpRight } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Triply | Update Password',
  description: 'Securely update your Triply account password.',
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function UpdatePasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const isExpiredSession = 'error' in params && 'error_code' in params && params.error_code === 'otp_expired';

  return (
    <main className="flex flex-col items-center px-4 justify-center min-h-screen">
      {isExpiredSession && (
        <Alert variant="destructive" className="mb-6 w-md">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>Session expired</AlertTitle>
          <AlertDescription>
            Your password reset link has expired. Please request a new one to continue.
            <Link href="/forgot-password" className="mt-2 underline flex items-center gap-2">
              <span>Send recovery link</span>
              <SquareArrowOutUpRight width={16} height={16} />
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <Card className="w-md">
        <CardHeader>
          <CardTitle>Set a new password</CardTitle>
          <CardDescription>
            Choose a strong password for your Triply account. This will replace your old one.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col">
          <UpdatePasswordForm />
        </CardContent>
      </Card>
    </main>
  );
}
