'use client';

import { formStepsConfig } from '@/app/(home)/_components/suggestion-form/configs/form-steps-config';
import { schema, useFormStep2 } from '@/app/(home)/_components/suggestion-form/steps/step-2/use-form-step-2';
import { RadioButtonCard } from '@/app/_components/radio-button-card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/chadcn/components/ui/form';
import { Input } from '@/chadcn/components/ui/input';
import { RadioGroup } from '@/chadcn/components/ui/radio-group';

type Props = ReturnType<typeof useFormStep2> & {};

export function FormStep2({ form }: Props) {
  const { fields } = formStepsConfig[1];

  const seasonDescriptions = {
    Spring: 'Blooming landscapes, mild weather, and fewer crowds.',
    Summer: 'Sunny skies, beach escapes, and vibrant festivals.',
    Autumn: 'Colorful foliage, cozy vibes, and cooler adventures.',
    Winter: 'Snowy escapes, festive markets, and crisp air.',
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6 max-w-lg w-full">
        <FormField
          control={form.control}
          name="tripDurationDays"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel htmlFor="tripDurationDays">{fields.tripDurationDays.label}</FormLabel>
              <FormControl>
                <Input id="tripDurationDays" placeholder={fields.tripDurationDays.placeholder} {...field} />
              </FormControl>
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
