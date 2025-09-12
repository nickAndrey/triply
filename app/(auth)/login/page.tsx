import { Metadata } from 'next';
import { LoginForm } from './_components/login-form';

export const metadata: Metadata = {
  title: 'Triply | Login',
  description: 'Triply — AI-Powered Travel Planner',
};

export default function LoginPage() {
  return (
    <main className="flex items-center px-4 justify-center min-h-screen">
      <LoginForm />
    </main>
  );
}
