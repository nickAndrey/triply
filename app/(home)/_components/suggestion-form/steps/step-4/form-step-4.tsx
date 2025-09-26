'use client';

import { schema, useFormStep4 } from '@/app/(home)/_components/suggestion-form/steps/step-4/use-form-step-4';
import { RadioButtonCard } from '@/app/_components/radio-button-card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/chadcn/components/ui/form';
import { RadioGroup } from '@/chadcn/components/ui/radio-group';

type Props = ReturnType<typeof useFormStep4>['form'] & {};

export function FormStep4(formProps: Props) {
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
    <Form {...formProps}>
      <form className="flex flex-col gap-3 max-w-lg w-full">
        <FormField
          control={formProps.control}
          name="tripVibe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vibe:</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid sm:grid-cols-2">
                  {schema.shape.tripVibe.options.map((opt) => (
                    <FormItem key={opt} className="w-full">
                      <FormControl>
                        <RadioButtonCard value={opt} title={opt} description={descriptions.tripVibe[opt]} />
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
          name="pace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pace:</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid sm:grid-cols-2">
                  {schema.shape.pace.options.map((opt) => (
                    <FormItem key={opt} className="w-full">
                      <FormControl>
                        <RadioButtonCard value={opt} title={opt} description={descriptions.pace[opt]} />
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
          name="activityIntensity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Activity Intensity:</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid sm:grid-cols-2">
                  {schema.shape.activityIntensity.options.map((opt) => (
                    <FormItem key={opt} className="w-full">
                      <FormControl>
                        <RadioButtonCard value={opt} title={opt} description={descriptions.activityIntensity[opt]} />
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
          name="planningStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Planning Style:</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid sm:grid-cols-2">
                  {schema.shape.planningStyle.options.map((opt) => (
                    <FormItem key={opt} className="w-full">
                      <FormControl>
                        <RadioButtonCard value={opt} title={opt} description={descriptions.planningStyle[opt]} />
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
