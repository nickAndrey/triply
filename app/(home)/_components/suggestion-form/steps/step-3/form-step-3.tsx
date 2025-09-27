'use client';

import { formStepsConfig } from '@/app/(home)/_components/suggestion-form/configs/form-steps-config';
import { GroupCounter } from '@/app/(home)/_components/suggestion-form/steps/step-3/_components/group-counter/group-counter';
import { schema, useFormStep3 } from '@/app/(home)/_components/suggestion-form/steps/step-3/use-form-step-3';
import { RadioButtonCard } from '@/app/_components/radio-button-card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/chadcn/components/ui/form';
import { RadioGroup } from '@/chadcn/components/ui/radio-group';

type Props = ReturnType<typeof useFormStep3> & {};

export function FormStep3({ form, controls, counters }: Props) {
  const companionDescriptions = {
    Solo: 'It`s all about you — freedom to choose, explore at your own pace, and discover hidden gems without compromise.',
    Couple: 'A trip for two — cozy dinners, sunset walks, and experiences made to share.',
    Family: 'Fun for all ages — activities that kids enjoy, parents can relax, and memories are made together.',
    Friends: 'Group vibes — shared laughs, nightlife, and adventures that are better with company.',
  };

  const { fields } = formStepsConfig[2];

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6 max-w-lg w-full">
        <FormField
          control={form.control}
          name="companions"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="companions_0">{fields.companions.label}</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid sm:grid-cols-2">
                  {schema.shape.companions.options.map((opt, idx) => (
                    <FormItem key={opt} className="w-full">
                      <FormControl>
                        <RadioButtonCard
                          id={`companions_${idx}`}
                          value={opt}
                          title={opt}
                          description={companionDescriptions[opt]}
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

        {form.watch('companions') === 'Friends' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h4>Travel Buddies</h4>
              <GroupCounter {...counters.groupCounter_friends} />
            </div>
          </div>
        )}

        {form.watch('companions') === 'Family' && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h4>Adults in your group</h4>
              <GroupCounter {...counters.groupCounter_adults} />
            </div>

            <div className="flex flex-col gap-3">
              <h4>Young Travelers</h4>
              <GroupCounter {...counters.groupCounter_children} />

              <ul className="flex flex-col gap-3">
                {controls.childrenFormControl.fields.map((field, idx) => (
                  <li key={field.id} className="flex flex-col gap-3">
                    <span>Young Traveler #{idx + 1}:</span>

                    <FormField
                      control={form.control}
                      name={`children.${idx}.group`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="children_0">Age Group</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="grid sm:grid-cols-[repeat(auto-fit,minmax(0,1fr))]"
                            >
                              {[
                                { value: '0-3', title: '👶 ', description: '0–3 years' },
                                { value: '4-9', title: '🧒 ', description: '4–9 years' },
                                { value: '10-16', title: '👦 ', description: '10–16 years' },
                              ].map((opt) => (
                                <FormItem key={opt.value} className="w-full">
                                  <FormControl>
                                    <RadioButtonCard
                                      id={`children_${idx}`}
                                      value={opt.value}
                                      title={opt.title}
                                      description={opt.description}
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
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}
