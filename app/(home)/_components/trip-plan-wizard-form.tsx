'use client';

import { startItineraryGeneration } from '@/app/_actions/personal-suggestion/get-personal-suggestion';
import { Stepper } from '@/app/_components/stepper';
import { formStepsConfig } from '@/app/_components/trip-plan-form-steps/configs/form-steps-config';
import { useTripPlanFormSteps } from '@/app/_components/trip-plan-form-steps/hooks/use-trip-plan-form-steps';
import { FormStep1 } from '@/app/_components/trip-plan-form-steps/steps/step-1/form-step-1';
import { FormStep2 } from '@/app/_components/trip-plan-form-steps/steps/step-2/form-step-2';
import { FormStep3 } from '@/app/_components/trip-plan-form-steps/steps/step-3/form-step-3';
import { FormStep4 } from '@/app/_components/trip-plan-form-steps/steps/step-4/form-step-4';
import { FormStep5 } from '@/app/_components/trip-plan-form-steps/steps/step-5/form-step-5';
import { FormStep6 } from '@/app/_components/trip-plan-form-steps/steps/step-6/form-step-6';
import { FormStep7 } from '@/app/_components/trip-plan-form-steps/steps/step-7/form-step-7';
import { useRequest } from '@/app/_providers/request-context';
import { useSupabaseSubscriptionContext } from '@/app/_providers/supabase-subscriptions/supabase-subscriptions-context';
import { Button } from '@/chadcn/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/chadcn/components/ui/card';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';

export function TripPlanWizardForm() {
  const { forms, processFormSteps } = useTripPlanFormSteps();

  const { isPending } = useRequest();
  const { setTripId, setSubscriberStatus } = useSupabaseSubscriptionContext();

  const [step, setStep] = useState(0);

  const handleSubmit = async () => {
    setSubscriberStatus('core_generating');
    const processedForm = processFormSteps();
    const { tripId } = await startItineraryGeneration(processedForm);
    setTripId(tripId);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>{formStepsConfig[step].title}</CardTitle>
        <CardDescription>{formStepsConfig[step].description}</CardDescription>
      </CardHeader>

      <CardContent>
        <Stepper
          steps={[
            { element: <FormStep1 {...forms[0]} /> },
            { element: <FormStep2 {...forms[1]} /> },
            { element: <FormStep3 {...forms[2]} /> },
            { element: <FormStep4 {...forms[3]} /> },
            { element: <FormStep5 {...forms[4]} /> },
            { element: <FormStep6 {...forms[5]} /> },
            { element: <FormStep7 {...forms[6]} /> },
          ]}
          renderNavigationButtons={({ currentStep, helpers }) => {
            return (
              <div className="flex gap-3">
                <Button disabled={!helpers.canGoToPrevStep} onClick={helpers.goToPrevStep}>
                  Back
                </Button>

                {helpers.canGoToNextStep ? (
                  <Button
                    onClick={async () => {
                      const isStepValid = await forms[currentStep - 1].form.trigger();
                      if (!isStepValid) return;

                      setStep(currentStep);
                      helpers.goToNextStep();
                    }}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button onClick={handleSubmit}>
                    {isPending ? (
                      <>
                        <LoaderCircle className="animate-spin" />
                        <span>Preparing your trip...</span>
                      </>
                    ) : (
                      <span>Get My Trip Plan</span>
                    )}
                  </Button>
                )}
              </div>
            );
          }}
        />
      </CardContent>
    </Card>
  );
}
