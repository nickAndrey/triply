'use client';

import { schema, useFormStep2 } from '@/app/(home)/_components/suggestion-form/steps/step-2/use-form-step-2';
import { RadioButtonCard } from '@/app/_components/radio-button-card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/chadcn/components/ui/form';
import { Input } from '@/chadcn/components/ui/input';
import { RadioGroup } from '@/chadcn/components/ui/radio-group';

type Props = ReturnType<typeof useFormStep2>['form'] & {};

export function FormStep2(formProps: Props) {
  const seasonDescriptions = {
    Spring: 'Blooming landscapes, mild weather, and fewer crowds.',
    Summer: 'Sunny skies, beach escapes, and vibrant festivals.',
    Autumn: 'Colorful foliage, cozy vibes, and cooler adventures.',
    Winter: 'Snowy escapes, festive markets, and crisp air.',
  };

  return (
    <Form {...formProps}>
      <form className="flex flex-col gap-3 max-w-lg w-full">
        <FormField
          control={formProps.control}
          name="tripDurationDays"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Tell us how many days you are planning to spend on this travel?</FormLabel>
              <FormControl>
                <Input placeholder="Set travel duration in days" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={formProps.control}
          name="season"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Season:</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid sm:grid-cols-2">
                  {schema.shape.season.options.map((opt) => (
                    <FormItem key={opt} className="w-full">
                      <FormControl>
                        <RadioButtonCard value={opt} title={opt} description={seasonDescriptions[opt]} />
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
