'use client';

import { Button } from '@/chadcn/components/ui/button';
import { Calendar } from '@/chadcn/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/chadcn/components/ui/form';
import { Input } from '@/chadcn/components/ui/input';
import MultipleSelector, { Option } from '@/chadcn/components/ui/multi-selector';
import { Popover, PopoverContent, PopoverTrigger } from '@/chadcn/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/chadcn/components/ui/tooltip';
import { cn } from '@/chadcn/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, CircleQuestionMark, LoaderCircle } from 'lucide-react';
import { FormEventHandler, startTransition, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { getPersonalSuggestion } from '../../_actions/get-personal-suggestion';

const schema = z.object({
  destination: z.string().min(1, 'Field is required'),
  dateFrom: z.date(),
  dateTo: z.date(),
  budget: z.string().min(1, 'Field is required'),
  preferences: z.array(z.string()).min(1, 'Field is required'),
});

const preferences: Option[] = [
  { label: 'Culture', value: 'culture' },
  { label: 'Beaches', value: 'beaches' },
  { label: 'Nature', value: 'nature' },
  { label: 'Food', value: 'food' },
  { label: 'Nightlife', value: 'nightlife' },
  { label: 'Family', value: 'family' },
  { label: 'Solo', value: 'solo' },
];

type FormFields = z.infer<typeof schema>;

export function GenerateSuggestionsForm() {
  const [state, action, isPending] = useActionState(getPersonalSuggestion, null);

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      destination: '',
      dateFrom: new Date(),
      dateTo: new Date(),
      budget: '',
      preferences: [],
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const isValid = await form.trigger();
    if (!isValid) return;

    startTransition(() => action(form.getValues()));
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Destination
                <Tooltip>
                  <TooltipTrigger>
                    <CircleQuestionMark className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Where do you want to go? Type a city or select from suggested destinations.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter your dream city or country" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <fieldset className="flex items-start gap-4 w-full">
          <FormField
            control={form.control}
            name="dateFrom"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>
                  Start Date
                  <Tooltip>
                    <TooltipTrigger>
                      <CircleQuestionMark className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>When will your trip begin?</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'pl-3 text-left font-normal bg-transparent',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick your arrival date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateTo"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>
                  End Date
                  <Tooltip>
                    <TooltipTrigger>
                      <CircleQuestionMark className="size-4" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>When will your trip end?</p>
                    </TooltipContent>
                  </Tooltip>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'pl-3 text-left font-normal bg-transparent',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick your departure date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Budget
                <Tooltip>
                  <TooltipTrigger>
                    <CircleQuestionMark className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Enter your budget as an amount or range. The AI will interpret your input to
                      suggest a suitable plan.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g., 1000 USD or 200-450 USD or 100$" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferences"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                Travel Preferences
                <Tooltip>
                  <TooltipTrigger>
                    <CircleQuestionMark className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Select one or more preferences to guide your trip plan. For example:
                      Culture,Beaches, Food, Nightlife, Family, Solo.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <FormControl>
                <MultipleSelector
                  className={cn(fieldState.error ? 'border-destructive' : '')}
                  value={preferences.filter((item) => field.value.includes(item.value))}
                  defaultOptions={preferences}
                  onChange={(options) =>
                    form.setValue(
                      'preferences',
                      options.map((opt) => opt.value)
                    )
                  }
                  hidePlaceholderWhenSelected
                  placeholder="Select the preference"
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                      no results found.
                    </p>
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="default" disabled={isPending}>
          {isPending ? (
            <>
              <LoaderCircle className="animate-spin" />
              <span>Generating Suggestions</span>
            </>
          ) : (
            <span>Generate Suggestions</span>
          )}
        </Button>
      </form>
    </Form>
  );
}
