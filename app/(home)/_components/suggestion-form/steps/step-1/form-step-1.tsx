'use client';

import { formStepsConfig } from '@/app/(home)/_components/suggestion-form/configs/form-steps-config';
import { useFormStep1 } from '@/app/(home)/_components/suggestion-form/steps/step-1/use-form-step-1';
import { Button } from '@/chadcn/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/chadcn/components/ui/form';
import { Input } from '@/chadcn/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/chadcn/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/chadcn/components/ui/tooltip';
import { cn } from '@/chadcn/lib/utils';
import { MapPin, X } from 'lucide-react';
import { useRef, useState } from 'react';

type Props = ReturnType<typeof useFormStep1> & {};

export function FormStep1({ form, suggestions, setSkipNextSearch }: Props) {
  const { fields } = formStepsConfig[0];

  const searchBtnContainerRef = useRef<HTMLDivElement | null>(null);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="destinationSearch"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <div className="w-full flex flex-col items-center text-center">
                  <FormLabel htmlFor="destination">
                    <h2 className="text-2xl font-semibold mb-2">{fields.destination.label}</h2>
                  </FormLabel>
                  <p className="text-muted-foreground mb-6">{fields.destination.description}</p>

                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <div className="relative group  w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">✈️</span>

                        <Input
                          id="destination"
                          placeholder={fields.destination.placeholder}
                          className={cn(
                            'transition-all w-full rounded-full border bg-background pl-10 py-6 text-sm shadow-sm focus:ring-2 focus:ring-primary truncate',
                            fieldState.error && 'border-destructive'
                          )}
                          style={{
                            paddingRight: searchBtnContainerRef?.current?.offsetWidth
                              ? `${searchBtnContainerRef.current.offsetWidth + 8}px`
                              : undefined,
                          }}
                          {...field}
                        />

                        <div
                          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-3"
                          ref={searchBtnContainerRef}
                        >
                          <Button
                            size="icon"
                            type="button"
                            variant="ghost"
                            className={cn(
                              'rounded-full w-6 h-6 transition-all duration-200 opacity-0 scale-0 pointer-events-none',
                              form.watch('destinationSearch') !== '' &&
                                isPopoverOpen &&
                                'opacity-100 scale-100 pointer-events-auto'
                            )}
                            onClick={(e) => {
                              e.preventDefault();
                              form.setValue('destination', '');
                              form.setValue('destinationSearch', '');
                            }}
                          >
                            <X className="!size-3" />
                          </Button>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>
                                <Button
                                  disabled
                                  hidden
                                  className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-medium pointer-events-none"
                                >
                                  <span>Surprise me</span> 🎲
                                </Button>
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Surprise ¯\_(ツ)_/¯</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </PopoverTrigger>

                    <PopoverContent
                      align="start"
                      sideOffset={10}
                      className="w-[var(--radix-popover-trigger-width)] rounded-4xl"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                      <div className="flex flex-col w-full">
                        {!suggestions.length && <p>No Suggestions.</p>}
                        {suggestions.map((item) => (
                          <Button
                            key={item.osm_id}
                            variant="ghost"
                            className="flex items-center justify-start gap-2"
                            onClick={() => {
                              form.setValue('destination', item.display_name);
                              field.onChange(item.display_name);
                              setIsPopoverOpen(false);
                              setSkipNextSearch(true);
                            }}
                          >
                            <MapPin />
                            <span className="text-ellipsis line-clamp-1">{item.display_name}</span>
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
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
