'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/chadcn/components/ui/form';
import { Textarea } from '@/chadcn/components/ui/textarea';
import { useFormStep7 } from './use-form-step-7';

type Props = ReturnType<typeof useFormStep7> & {};

export function FormStep7({ form }: Props) {
  return (
    <Form {...form}>
      <form className="flex flex-col gap-6 max-w-lg w-full">
        <FormField
          control={form.control}
          name="tripSuccessDefinition"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="tripSuccessDefinition">This trip will be successful if…</FormLabel>
              <FormControl>
                <Textarea
                  id="tripSuccessDefinition"
                  rows={10}
                  placeholder="e.g. I get to relax without worrying about work, spend quality time with my kids, and try authentic local food."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="perfectDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="perfectDay">Describe your perfect vacation day</FormLabel>
              <FormControl>
                <Textarea
                  id="perfectDay"
                  rows={10}
                  placeholder="e.g. A slow morning with coffee by the beach, exploring a hidden town in the afternoon, and ending the day with sunset and live music"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
