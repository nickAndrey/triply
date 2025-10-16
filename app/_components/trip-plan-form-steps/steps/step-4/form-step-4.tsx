'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@chadcn/components/ui/form';
import { RadioGroup } from '@chadcn/components/ui/radio-group';

import { RadioButtonCard } from '@components/radio-button-card';

import { formStepsConfig } from '../../configs/form-steps-config';
import { schema, useFormStep4 } from './use-form-step-4';

type Props = ReturnType<typeof useFormStep4> & {};

export function FormStep4({ form }: Props) {
  const { fields } = formStepsConfig[3];

  const descriptions = {
    tripVibe: {
      Beach: 'Relax on the coast, sun, sea, and sand.',
      City: 'Culture, nightlife, and urban energy.',
      Nature: 'Forests, hikes, fresh air, lakes, and tranquil landscapes.',
    },
    pace: {
      Slow: 'Take it easy, plenty of downtime.',
      Balanced: 'A mix of exploring and relaxing.',
      Fast: 'Pack the days, maximize experiences.',
    },
    activityIntensity: {
      Sedentary: 'Minimal walking, mostly restful.',
      Light: 'Gentle strolls and easy activities.',
      High: 'Active days with lots of movement.',
    },
    planningStyle: {
      'Hour-by-Hour': 'Detailed schedules and fixed plans.',
      'Loose Outline': 'Some structure with room for spontaneity.',
      'Go With the Flow': 'Minimal planning, follow the moment.',
    },
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6 w-full">
        <FormField
          control={form.control}
          name="tripVibe"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="tripVibe_0">{fields.tripVibe.label}</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid sm:grid-cols-3">
                  {schema.shape.tripVibe.options.map((opt, idx) => (
                    <FormItem key={opt} className="w-full">
                      <FormControl>
                        <RadioButtonCard
                          id={`tripVibe_${idx}`}
                          value={opt}
                          title={opt}
                          description={descriptions.tripVibe[opt]}
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
          control={form.control}
          name="pace"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="pace_0">{fields.pace.label}</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid sm:grid-cols-3">
                  {schema.shape.pace.options.map((opt, idx) => (
                    <FormItem key={opt} className="w-full">
                      <FormControl>
                        <RadioButtonCard
                          id={`pace_${idx}`}
                          value={opt}
                          title={opt}
                          description={descriptions.pace[opt]}
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
          control={form.control}
          name="activityIntensity"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="activityIntensity_0">{fields.activityIntensity.label}</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid sm:grid-cols-3">
                  {schema.shape.activityIntensity.options.map((opt, idx) => (
                    <FormItem key={opt} className="w-full">
                      <FormControl>
                        <RadioButtonCard
                          id={`activityIntensity_${idx}`}
                          value={opt}
                          title={opt}
                          description={descriptions.activityIntensity[opt]}
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
          control={form.control}
          name="planningStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="planningStyle_0">{fields.planningStyle.label}</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid sm:grid-cols-3">
                  {schema.shape.planningStyle.options.map((opt, idx) => (
                    <FormItem key={opt} className="w-full">
                      <FormControl>
                        <RadioButtonCard
                          id={`planningStyle_${idx}`}
                          value={opt}
                          title={opt}
                          description={descriptions.planningStyle[opt]}
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
      </form>
    </Form>
  );
}
