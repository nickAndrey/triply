import { DividerWithText } from '@/app/(auth)/signup/_components/divider-with-text';
import { SignupForm } from '@/app/(auth)/signup/_components/signup-form/signup-form';
import { Button } from '@/chadcn/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/chadcn/components/ui/card';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Triply | Sign Up',
  description:
    'Create a new account on Triply — your AI-Powered Travel Planner',
};

export default function SignupPage() {
  return (
    <main className="flex items-center px-4 justify-center min-h-screen">
      <Card className="w-md">
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
          <CardDescription>
            Create your account to start planning amazing trips with
            Triply.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SignupForm />
          <DividerWithText text="or" />
          <Button className="w-full" variant="outline">
            <Image
              src="/google-logo.png"
              alt="Google logo"
              width="0"
              height="0"
              className="w-5 h-5"
            />
            Sign up with Google
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
