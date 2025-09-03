import { Button } from '@/chadcn/components/ui/button';
import { Input } from '@/chadcn/components/ui/input';
import { Label } from '@/chadcn/components/ui/label';
import { login } from '../actions';

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <form className="flex flex-col gap-3 w-xl bg-secondary px-6 py-4 rounded-md">
        <h4>Login</h4>
        <Label htmlFor="email">Email:</Label>
        <Input id="email" name="email" type="email" defaultValue="user@gmail.com" required />
        <Label htmlFor="password">Password:</Label>
        <Input id="password" name="password" type="password" required defaultValue="user1234" />
        <Button
          variant="default"
          className="bg-accent text-black hover:bg-accent/80"
          formAction={login}
        >
          Log in
        </Button>
      </form>
    </main>
  );
}
