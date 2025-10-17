'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@chadcn/components/ui/form';
import { RadioGroup } from '@chadcn/components/ui/radio-group';

import { Counter } from '@components/counter/counter';
import { RadioButtonCard } from '@components/radio-button-card';

import { formStepsConfig } from '../../configs/form-steps-config';
import { schema, useFormStep2 } from './use-form-step-2';

type Props = ReturnType<typeof useFormStep2> & {};

export function FormStep2({ form, tripDurationDaysCounter }: Props) {
  const { fields } = formStepsConfig[1];

  const seasonDescriptions = {
    Spring: 'Blooming landscapes, mild weather, and fewer crowds.',
    Summer: 'Sunny skies, beach escapes, and vibrant festivals.',
    Autumn: 'Colorful foliage, cozy vibes, and cooler adventures.',
    Winter: 'Snowy escapes, festive markets, and crisp air.',
  };

  return (
    <Form {...form}>
      {/* max width lg */}
      <form className="flex flex-col gap-6 w-full">
        <FormField
          control={form.control}
          name="tripDurationDays"
          render={() => (
            <FormItem className="flex flex-col w-full">
              <FormLabel htmlFor="tripDurationDays">{fields.tripDurationDays.label}</FormLabel>
              <Counter {...tripDurationDaysCounter} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="season"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="season_0">{fields.season.label}</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid sm:grid-cols-2">
                  {schema.shape.season.options.map((opt, idx) => (
                    <FormItem key={opt} className="w-full">
                      <FormControl>
                        <RadioButtonCard
                          id={`season_${idx}`}
                          value={opt}
                          title={opt}
                          description={seasonDescriptions[opt]}
                        />
                      </FormControl>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
