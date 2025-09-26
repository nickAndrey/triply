'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

export const schema = z.object({
  tripVibe: z.enum(['Beach', 'City', 'Nature']),
  pace: z.enum(['Slow', 'Balanced', 'Fast']),
  activityIntensity: z.enum(['Sedentary', 'Light', 'High']),
  planningStyle: z.enum(['Hour-by-Hour', 'Loose Outline', 'Go With the Flow']),
});

export type FormFields = z.infer<typeof schema>;

export function useFormStep4() {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      tripVibe: undefined,
      pace: undefined,
      activityIntensity: undefined,
      planningStyle: undefined,
    },
  });

  return {
    form,
  };
}
