'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

export const schema = z.object({
  tripDurationDays: z.string().min(1, 'Field is required').regex(/^\d+$/, 'Only numbers accepted'),
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

  return {
    form,
  };
}
