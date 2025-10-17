'use client';

import { useEffect, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

import { useCounter } from '@components/counter/use-counter';

import { TravelItineraryForm } from '@/app/_types/form/travel-itinerary-form';

export const schema = z.object({
  tripDurationDays: z
    .string()
    .min(1, 'Field is required')
    .regex(/^[1-9][0-9]*$/, 'Only numbers greater than 0 accepted'),
  season: z.enum(['Winter', 'Spring', 'Summer', 'Autumn']),
});

export type FormFields = z.infer<typeof schema>;

type Args = {
  initialValues?: TravelItineraryForm;
};

export function useFormStep2({ initialValues }: Args = {}) {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      tripDurationDays: initialValues?.tripDurationDays || '',
      season: initialValues?.season || 'Spring',
    },
  });

  const tripDurationDaysCounter = useCounter();

  const syncedOnce = useRef(false);
  const tripDurationDays = form.watch('tripDurationDays');

  useEffect(() => {
    if (!syncedOnce.current && tripDurationDays !== '') {
      tripDurationDaysCounter.handleChange(tripDurationDays);
      syncedOnce.current = true;
    }
  }, [tripDurationDays, tripDurationDaysCounter]);

  useEffect(() => {
    if (tripDurationDaysCounter.value !== '') {
      form.setValue('tripDurationDays', tripDurationDaysCounter.value.toFixed(0));
    }
  }, [tripDurationDaysCounter.value, form]);

  return {
    form,
    tripDurationDaysCounter,
  };
}
