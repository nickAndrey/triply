'use client';

import { useCounter } from '@/app/_components/counter/use-counter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

export const schema = z.object({
  tripDurationDays: z
    .string()
    .min(1, 'Field is required')
    .regex(/^[1-9][0-9]*$/, 'Only numbers greater than 0 accepted'),
  season: z.enum(['Winter', 'Spring', 'Summer', 'Autumn']),
});

export type FormFields = z.infer<typeof schema>;

export function useFormStep2() {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      tripDurationDays: '',
      season: 'Spring',
    },
  });

  const tripDurationDaysCounter = useCounter();

  useEffect(() => {
    if (tripDurationDaysCounter.groupMembers !== '') {
      form.setValue('tripDurationDays', tripDurationDaysCounter.groupMembers.toFixed(0));
    }
  }, [tripDurationDaysCounter.groupMembers, form]);

  return {
    form,
    tripDurationDaysCounter,
  };
}
