'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { TravelItineraryForm } from '@/app/_types/form/travel-itinerary-form';

export const schema = z.object({
  tripSuccessDefinition: z.string().optional(),
  perfectDay: z.string().optional(),
});

export type FormFields = z.infer<typeof schema>;

type Args = {
  initialValues?: TravelItineraryForm;
};

export function useFormStep7({ initialValues }: Args = {}) {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      tripSuccessDefinition: initialValues?.tripSuccessDefinition || '',
      perfectDay: initialValues?.perfectDay || '',
    },
  });

  return {
    form,
  };
}
