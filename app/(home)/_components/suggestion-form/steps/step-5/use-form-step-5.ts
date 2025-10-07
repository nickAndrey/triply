'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

export const enums = {
  foodPreferencesEnum: z.enum([
    'LocalSpecialties',
    'StreetFood',
    'FineDining',
    'VeganFriendly',
    'CoffeeAndCafes',
    'WineAndBars',
  ]),
};

export const schema = z.object({
  foodPreferences: z.array(enums.foodPreferencesEnum),
  foodRestrictions: z.string().optional(),
});

export type FormFields = z.infer<typeof schema>;

export type FoodPreferencesEnum = z.infer<typeof enums.foodPreferencesEnum>;

export function useFormStep5() {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      foodPreferences: [],
      foodRestrictions: '',
    },
  });

  return {
    form,
  };
}
