'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { TravelItineraryForm } from '@/app/_types/form/travel-itinerary-form';

export const schema = z.object({
  budget: z.enum(['$', '$$', '$$$']),
  placesToSee: z.string().optional(),
  placesAvoidToSee: z.string().optional(),
});

export type FormFields = z.infer<typeof schema>;

type Args = {
  initialValues?: TravelItineraryForm;
};

export function useFormStep6({ initialValues }: Args = {}) {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      budget: initialValues?.budget || '$',
      placesToSee: initialValues?.placesToSee || '',
      placesAvoidToSee: initialValues?.placesAvoidToSee || '',
    },
  });

  return {
    form,
  };
}
