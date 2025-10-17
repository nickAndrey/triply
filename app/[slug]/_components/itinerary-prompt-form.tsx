'use client';

import { LoaderCircle } from 'lucide-react';

import { useRequest } from '@providers/request-context';

import { Button } from '@chadcn/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@chadcn/components/ui/sheet';

import { useTripPlanFormSteps } from '@components/trip-plan-form-steps/hooks/use-trip-plan-form-steps';
import { FormStep1 } from '@components/trip-plan-form-steps/steps/step-1/form-step-1';
import { FormStep2 } from '@components/trip-plan-form-steps/steps/step-2/form-step-2';
import { FormStep3 } from '@components/trip-plan-form-steps/steps/step-3/form-step-3';
import { FormStep4 } from '@components/trip-plan-form-steps/steps/step-4/form-step-4';
import { FormStep5 } from '@components/trip-plan-form-steps/steps/step-5/form-step-5';
import { FormStep6 } from '@components/trip-plan-form-steps/steps/step-6/form-step-6';
import { FormStep7 } from '@components/trip-plan-form-steps/steps/step-7/form-step-7';

import { useCreateItineraryFromPrompt } from '@/app/_hooks/use-create-itinerary-from-prompt';
import { TravelItineraryForm } from '@/app/_types/form/travel-itinerary-form';

type Props = {
  itineraryForm: TravelItineraryForm;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function ItineraryPromptForm({ itineraryForm, open, onOpenChange }: Props) {
  const { forms, processFormSteps } = useTripPlanFormSteps({ initialValues: itineraryForm });
  const { onCreateItineraryFromPrompt } = useCreateItineraryFromPrompt();

  const { isPending } = useRequest();

  const onSubmit = async () => {
    const processedForm = processFormSteps();
    await onCreateItineraryFromPrompt(processedForm);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-[480px] lg:max-w-[600px]">
        <SheetHeader>
          <SheetTitle>Edit Your Trip Prompt</SheetTitle>
          <SheetDescription>
            Update your trip prompt to fine-tune destinations, style, and itinerary results.
          </SheetDescription>
          <hr className="bg-border w-full" />
        </SheetHeader>

        <div className="flex flex-col gap-6 overflow-y-auto items-center px-10">
          <FormStep1 {...forms[0]} />
          <hr className="bg-border w-full" />
          <FormStep2 {...forms[1]} />
          <hr className="bg-border w-full" />
          <FormStep3 {...forms[2]} />
          <hr className="bg-border w-full" />
          <FormStep4 {...forms[3]} />
          <hr className="bg-border w-full" />
          <FormStep5 {...forms[4]} />
          <hr className="bg-border w-full" />
          <FormStep6 {...forms[5]} />
          <hr className="bg-border w-full" />
          <FormStep7 {...forms[6]} />
        </div>

        <SheetFooter>
          <Button variant="default" className="w-full" onClick={onSubmit}>
            {isPending ? (
              <>
                <LoaderCircle className="animate-spin" />
                <span>Creating new itinerary...</span>
              </>
            ) : (
              <span>Save as New</span>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
