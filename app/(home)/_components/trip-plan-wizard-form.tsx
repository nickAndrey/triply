'use client';

import { useEffect, useState } from 'react';

import { LoaderCircle } from 'lucide-react';

import { useRequest } from '@providers/request-context';
import { SocketEvent, useSocket } from '@providers/socket-context';

import { Button } from '@chadcn/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@chadcn/components/ui/card';

import { Stepper } from '@components/stepper';
import { formStepsConfig } from '@components/trip-plan-form-steps/configs/form-steps-config';
import { useTripPlanFormSteps } from '@components/trip-plan-form-steps/hooks/use-trip-plan-form-steps';
import { FormStep1 } from '@components/trip-plan-form-steps/steps/step-1/form-step-1';
import { FormStep2 } from '@components/trip-plan-form-steps/steps/step-2/form-step-2';
import { FormStep3 } from '@components/trip-plan-form-steps/steps/step-3/form-step-3';
import { FormStep4 } from '@components/trip-plan-form-steps/steps/step-4/form-step-4';
import { FormStep5 } from '@components/trip-plan-form-steps/steps/step-5/form-step-5';
import { FormStep6 } from '@components/trip-plan-form-steps/steps/step-6/form-step-6';
import { FormStep7 } from '@components/trip-plan-form-steps/steps/step-7/form-step-7';

import { API_PATHS } from '@/constants/paths';
import { api } from '@/utils/api';

export function TripPlanWizardForm() {
  const { socket, connect, disconnect, joinItinerary } = useSocket();

  const { forms, processFormSteps } = useTripPlanFormSteps();

  const { isPending } = useRequest();

  const [step, setStep] = useState(0);

  const handleSubmit = async () => {
    try {
      await connect();

      const response = await api.post<{ itineraryId: string }>(API_PATHS.itinerary.create, {
        form: processFormSteps(),
      });

      joinItinerary(response.itineraryId);
    } catch (error) {
      console.error({ error });
      disconnect();
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(SocketEvent.ITINERARY_UPDATED, (data) => {
      console.log('Progress:', data);
    });

    socket.on(SocketEvent.ITINERARY_FAILED, (data) => {
      // Todo!: add logger to track errors
      console.error('Failed:', data);
      disconnect();
    });

    return () => {
      socket.off(SocketEvent.ITINERARY_UPDATED);
      socket.off(SocketEvent.ITINERARY_FAILED);
    };
  }, [socket]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>{formStepsConfig[step].title}</CardTitle>
        <CardDescription>{formStepsConfig[step].description}</CardDescription>
      </CardHeader>

      <CardContent>
        <Stepper
          className="max-w-xl"
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
                  <Button onClick={handleSubmit} disabled={isPending}>
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
