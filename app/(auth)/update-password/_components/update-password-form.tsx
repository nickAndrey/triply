'use client';

import { useUpdatePasswordForm } from '@/app/(auth)/update-password/_components/use-update-password-form';
import { InputPassword } from '@/app/_components/input-password';
import { Button } from '@/chadcn/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/chadcn/components/ui/form';
import { LoaderCircle } from 'lucide-react';

export function UpdatePasswordForm() {
  const { form, isPending, handleSubmit } = useUpdatePasswordForm();

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
          name="password_confirm"
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
              <span>Updating Password ...</span>
            </>
          ) : (
            <span>Update Password</span>
          )}
        </Button>
      </form>
    </Form>
  );
}
