'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { TravelItineraryForm } from '@/app/_types/form/travel-itinerary-form';

export const schema = z.object({
  tripVibe: z.enum(['Beach', 'City', 'Nature']),
  pace: z.enum(['Slow', 'Balanced', 'Fast']),
  activityIntensity: z.enum(['Sedentary', 'Light', 'High']),
  planningStyle: z.enum(['Hour-by-Hour', 'Loose Outline', 'Go With the Flow']),
});

export type FormFields = z.infer<typeof schema>;

type Args = {
  initialValues?: TravelItineraryForm;
};

export function useFormStep4({ initialValues }: Args = {}) {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      tripVibe: initialValues?.tripVibe,
      pace: initialValues?.pace,
      activityIntensity: initialValues?.activityIntensity,
      planningStyle: initialValues?.planningStyle,
    },
  });

  return {
    form,
  };
}
