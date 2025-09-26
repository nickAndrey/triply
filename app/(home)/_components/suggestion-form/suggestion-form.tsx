'use client';

import { Stepper } from '@/app/(home)/_components/stepper';
import { FormStep1 } from '@/app/(home)/_components/suggestion-form/steps/step-1/form-step-1';
import { FormStep2 } from '@/app/(home)/_components/suggestion-form/steps/step-2/form-step-2';
import { FormStep3 } from '@/app/(home)/_components/suggestion-form/steps/step-3/form-step-3';
import { FormStep4 } from '@/app/(home)/_components/suggestion-form/steps/step-4/form-step-4';
import { FormStep5 } from '@/app/(home)/_components/suggestion-form/steps/step-5/form-step-5';
import { FormStep6 } from '@/app/(home)/_components/suggestion-form/steps/step-6/form-step-6';
import { FormStep7 } from '@/app/(home)/_components/suggestion-form/steps/step-7/form-step-7';
import { FormStep8 } from '@/app/(home)/_components/suggestion-form/steps/step-8/form-step-8';
import { useSuggestionForm } from '@/app/(home)/_components/suggestion-form/use-suggestion-form';
import { Button } from '@/chadcn/components/ui/button';

export function SuggestionForm() {
  const { forms } = useSuggestionForm();

  return (
    <Stepper
      steps={[
        { step: 1, element: <FormStep1 {...forms[0]} /> },
        { step: 2, element: <FormStep2 {...forms[1]} /> },
        { step: 3, element: <FormStep3 {...forms[2]} /> },
        { step: 4, element: <FormStep4 {...forms[3]} /> },
        { step: 5, element: <FormStep5 {...forms[4]} /> },
        { step: 6, element: <FormStep6 {...forms[5]} /> },
        { step: 7, element: <FormStep7 {...forms[6]} /> },
        { step: 8, element: <FormStep8 {...forms[7]} /> },
      ]}
      renderNavigationButtons={({ currentStep, helpers }) => {
        return (
          <div className="flex gap-3">
            <Button onClick={() => helpers.goToPrevStep()}>Prev</Button>
            <Button
              onClick={async () => {
                const isStepValid = await forms[currentStep - 1].trigger();
                if (!isStepValid) return;

                helpers.goToNextStep();
              }}
            >
              Next
            </Button>
          </div>
        );
      }}
    />
  );
}
