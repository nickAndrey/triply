'use client';

import { formStepsConfig } from '@/app/(home)/_components/suggestion-form/configs/form-steps-config';
import { useFormStep1 } from '@/app/(home)/_components/suggestion-form/steps/step-1/use-form-step-1';
import { Button } from '@/chadcn/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/chadcn/components/ui/form';
import { Input } from '@/chadcn/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/chadcn/components/ui/tooltip';
import { cn } from '@/chadcn/lib/utils';

type Props = ReturnType<typeof useFormStep1>['form'];

export function FormStep1(formProps: Props) {
  const { fields } = formStepsConfig[0];

  return (
    <Form {...formProps}>
      <form>
        <FormField
          control={formProps.control}
          name="destination"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <div className="w-full flex flex-col items-center text-center">
                  <FormLabel htmlFor="destination">
                    <h2 className="text-2xl font-semibold mb-2">{fields.destination.label}</h2>
                  </FormLabel>
                  <p className="text-muted-foreground mb-6">{fields.destination.description}</p>

                  <div className="relative w-full max-w-lg">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">✈️</span>
                    <Input
                      id="destination"
                      placeholder={fields.destination.placeholder}
                      className={cn(
                        'w-full rounded-full border bg-background pl-10 pr-28 py-6 text-sm shadow-sm focus:ring-2 focus:ring-primary',
                        fieldState.error && 'border-destructive'
                      )}
                      {...field}
                    />

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2">
                          <Button
                            disabled
                            className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-medium pointer-events-none"
                          >
                            Surprise me 🎲
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Surprise ¯\_(ツ)_/¯</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
