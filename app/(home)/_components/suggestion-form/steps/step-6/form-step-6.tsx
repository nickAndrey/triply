'use client';

import { schema, useFormStep6 } from '@/app/(home)/_components/suggestion-form/steps/step-6/use-form-step-6';
import { RadioButtonCard } from '@/app/_components/radio-button-card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/chadcn/components/ui/form';
import { RadioGroup } from '@/chadcn/components/ui/radio-group';
import { Textarea } from '@/chadcn/components/ui/textarea';

type Props = ReturnType<typeof useFormStep6> & {};

export function FormStep6({ form }: Props) {
  const descriptions = {
    $: 'Keeping things simple and affordable — focusing on basic stays, casual meals, and cost-conscious activities.',
    $$: 'A balanced approach — comfortable lodging, a mix of casual and nicer dining, and a variety of activities without overspending.',
    $$$: 'Prioritizing comfort and premium experiences — higher-end stays, fine dining, and exclusive activities or services.',
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6 max-w-xl w-full">
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="budget_0">Budget:</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid sm:grid-cols-2">
                  {schema.shape.budget.options.map((opt, idx) => (
                    <FormItem key={opt} className="w-full">
                      <FormControl>
                        <RadioButtonCard id={`budget_${idx}`} value={opt} title={opt} description={descriptions[opt]} />
                      </FormControl>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placesToSee"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="placesToSee">Places You’d Love to Visit:</FormLabel>
              <FormControl>
                <Textarea
                  id="placesToSee"
                  rows={10}
                  placeholder="e.g. Eiffel Tower, Tokyo Skytree, local markets, hiking trails"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placesAvoidToSee"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="placesAvoidToSee">Places You’d Prefer to Skip:</FormLabel>
              <FormControl>
                <Textarea
                  id="placesAvoidToSee"
                  rows={10}
                  placeholder="e.g. crowded tourist traps, busy nightlife areas, museums, theme parks"
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
