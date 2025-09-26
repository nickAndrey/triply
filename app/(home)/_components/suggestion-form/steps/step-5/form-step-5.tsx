'use client';

import {
  enums,
  FoodPreferencesEnum,
  useFormStep5,
} from '@/app/(home)/_components/suggestion-form/steps/step-5/use-form-step-5';
import { RadioButtonCard } from '@/app/_components/radio-button-card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/chadcn/components/ui/form';
import { RadioGroup } from '@/chadcn/components/ui/radio-group';
import { Textarea } from '@/chadcn/components/ui/textarea';

type Props = ReturnType<typeof useFormStep5>['form'] & {};

export function FormStep5(formProps: Props) {
  const foodPreferences: Record<FoodPreferencesEnum, { title: string; description: string }> = {
    LocalSpecialties: {
      title: 'Local Specialties',
      description: 'Authentic regional dishes that highlight the culture and traditions of the destination.',
    },
    StreetFood: {
      title: 'Street Food',
      description: 'Casual and affordable bites from street vendors, food stalls, and local markets.',
    },
    FineDining: {
      title: 'Fine Dining',
      description: 'Upscale restaurants with refined cuisine, elegant presentation, and attentive service.',
    },
    VeganFriendly: {
      title: 'Vegan Friendly',
      description: 'Plant-based options, vegan restaurants, and menus with meat-free alternatives.',
    },
    CoffeeAndCafes: {
      title: 'Coffee And Cafes',
      description: 'Cozy cafés, specialty coffee shops, and spots for relaxing with a hot drink.',
    },
    WineAndBars: {
      title: 'Wine And Bars',
      description: 'Wine tasting, cocktail bars, breweries, and vibrant nightlife experiences.',
    },
  };

  return (
    <Form {...formProps}>
      <form className="flex flex-col gap-3 max-w-lg w-full">
        <FormField
          control={formProps.control}
          name="foodPreferences"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Food Preferences:</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid sm:grid-cols-2">
                  {enums.foodPreferencesEnum.options.map((opt) => (
                    <FormItem key={opt} className="w-full">
                      <FormControl>
                        <RadioButtonCard
                          value={opt}
                          title={foodPreferences[opt].title}
                          description={foodPreferences[opt].description}
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

        <FormField
          control={formProps.control}
          name="foodRestrictions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Food Restrictions:</FormLabel>
              <FormControl>
                <Textarea rows={10} placeholder="Foods allergies, foods you don't like or want to avoid" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
