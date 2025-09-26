'use client';

import { useFormStep7 } from '@/app/(home)/_components/suggestion-form/steps/step-7/use-form-step-7';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/chadcn/components/ui/form';
import { Textarea } from '@/chadcn/components/ui/textarea';

type Props = ReturnType<typeof useFormStep7>['form'] & {};

export function FormStep7(formProps: Props) {
  return (
    <Form {...formProps}>
      <h2 className="text-xl font-semibold mb-4">✨ Personal Context — Make It Truly Yours</h2>

      <form className="flex flex-col gap-6 max-w-lg w-full">
        <FormField
          control={formProps.control}
          name="tripSuccessDefinition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>This trip will be successful if…</FormLabel>
              <FormControl>
                <Textarea
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
          control={formProps.control}
          name="perfectDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Describe your perfect vacation day</FormLabel>
              <FormControl>
                <Textarea
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
