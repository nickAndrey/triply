'use client';

import { LoaderCircle } from 'lucide-react';

import { Button } from '@chadcn/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@chadcn/components/ui/form';
import { Input } from '@chadcn/components/ui/input';

import { InputPassword } from '@components/input-password';

import { useSignupForm } from '@/app/(auth)/signup/_components/signup-form/use-signup-form';

export function SignupForm() {
  const { form, isPending, handleSubmit } = useSignupForm();

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Provide your public display name." autoComplete="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Provide your email." type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <InputPassword placeholder="Provide password." autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <InputPassword placeholder="Repeat the password." autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin" />
              <span>Creating Account</span>
            </>
          ) : (
            <span>Sign Up</span>
          )}
        </Button>
      </form>
    </Form>
  );
}
