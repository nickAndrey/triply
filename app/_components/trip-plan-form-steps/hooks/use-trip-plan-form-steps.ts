'use client';

import { TravelItineraryForm } from '@/app/_types/form/travel-itinerary-form';

import { useFormStep1 } from '../steps/step-1/use-form-step-1';
import { useFormStep2 } from '../steps/step-2/use-form-step-2';
import { useFormStep3 } from '../steps/step-3/use-form-step-3';
import { useFormStep4 } from '../steps/step-4/use-form-step-4';
import { useFormStep5 } from '../steps/step-5/use-form-step-5';
import { useFormStep6 } from '../steps/step-6/use-form-step-6';
import { useFormStep7 } from '../steps/step-7/use-form-step-7';

type Args = {
  initialValues?: TravelItineraryForm;
};

export function useTripPlanFormSteps({ initialValues }: Args = {}) {
  const formStep1 = useFormStep1({ initialValues });
  const formStep2 = useFormStep2({ initialValues });
  const formStep3 = useFormStep3({ initialValues });
  const formStep4 = useFormStep4({ initialValues });
  const formStep5 = useFormStep5({ initialValues });
  const formStep6 = useFormStep6({ initialValues });
  const formStep7 = useFormStep7({ initialValues });

  const processFormSteps = () => {
    const mergedSteps = {
      ...formStep1.form.getValues(),
      ...formStep2.form.getValues(),
      ...formStep3.form.getValues(),
      ...formStep4.form.getValues(),
      ...formStep5.form.getValues(),
      ...formStep6.form.getValues(),
      ...formStep7.form.getValues(),
    };

    switch (mergedSteps.companions) {
      case 'Solo':
      case 'Couple':
        mergedSteps.children = [];
        mergedSteps.adults = [];
        mergedSteps.friends = [];
        break;
      case 'Family':
        mergedSteps.friends = [];
        break;
      case 'Friends':
        mergedSteps.children = [];
        mergedSteps.adults = [];
        break;
      default:
        const _exhaustiveCheck: never = mergedSteps.companions;
        return _exhaustiveCheck;
    }

    return mergedSteps;
  };

  return {
    forms: [formStep1, formStep2, formStep3, formStep4, formStep5, formStep6, formStep7] as const,
    processFormSteps,
  };
}
