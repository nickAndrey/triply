'use client';

import { useLoginForm } from '@/app/(auth)/login/_components/use-login-form';
import { InputPassword } from '@/app/_components/input-password';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/chadcn/components/ui/alert';
import { Button } from '@/chadcn/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/chadcn/components/ui/form';
import { Input } from '@/chadcn/components/ui/input';
import { AlertCircleIcon, LoaderCircle } from 'lucide-react';
import Link from 'next/link';

export function LoginForm() {
  const { form, isPending, generalError, handleSubmit } = useLoginForm();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Provide your email."
                  autoComplete="email"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <fieldset className="flex flex-col gap-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <InputPassword
                    placeholder="Provide password."
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Link
            href="/forgot-password"
            className="text-sm hover:underline"
          >
            Forgot Password?
          </Link>
        </fieldset>
        {generalError && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>{generalError}</AlertTitle>
            <AlertDescription>
              Please check your email and password and try again
            </AlertDescription>
          </Alert>
        )}
        <Button
          type="submit"
          className="py-5 flex items-center gap-3"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin" />
              <span>Logging in</span>
            </>
          ) : (
            'Log in'
          )}
        </Button>
      </form>
    </Form>
  );
}
