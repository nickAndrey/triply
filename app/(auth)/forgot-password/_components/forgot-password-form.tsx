'use client';

import { useForgotPasswordForm } from '@/app/(auth)/forgot-password/_components/use-forgot-password-form';
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
import { LoaderCircle } from 'lucide-react';

export function ForgotPasswordForm() {
  const { form, isPending, handleSubmit } = useForgotPasswordForm();

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
        <Button
          type="submit"
          className="py-5 flex items-center gap-3 w-full"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            'Send recovery link'
          )}
        </Button>
      </form>
    </Form>
  );
}
