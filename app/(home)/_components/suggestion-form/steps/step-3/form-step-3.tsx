'use client';

import { schema, useFormStep3 } from '@/app/(home)/_components/suggestion-form/steps/step-3/use-form-step-3';
import { RadioButtonCard } from '@/app/_components/radio-button-card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/chadcn/components/ui/form';
import { Input } from '@/chadcn/components/ui/input';
import { RadioGroup } from '@/chadcn/components/ui/radio-group';

type Props = ReturnType<typeof useFormStep3>['form'] & {};

export function FormStep3(formProps: Props) {
  const companionDescriptions = {
    Solo: 'It`s all about you — freedom to choose, explore at your own pace, and discover hidden gems without compromise.',
    Couple: 'A trip for two — cozy dinners, sunset walks, and experiences made to share.',
    Family: 'Fun for all ages — activities that kids enjoy, parents can relax, and memories are made together.',
    Friends: 'Group vibes — shared laughs, nightlife, and adventures that are better with company.',
  };

  return (
    <Form {...formProps}>
      <form className="flex flex-col gap-3 max-w-lg w-full">
        <FormField
          control={formProps.control}
          name="companions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Companions?:</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid sm:grid-cols-2">
                  {schema.shape.companions.options.map((opt) => (
                    <FormItem key={opt} className="w-full">
                      <FormControl>
                        <RadioButtonCard value={opt} title={opt} description={companionDescriptions[opt]} />
                      </FormControl>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(formProps.watch('companions') === 'Family' || formProps.watch('companions') === 'Friends') && (
          <fieldset>
            <FormField
              control={formProps.control}
              name="childrenAges"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>How many people in a group supposed to be?</FormLabel>
                  <FormControl>
                    <Input placeholder="Set amount of people in a group" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
        )}
      </form>
    </Form>
  );
}
