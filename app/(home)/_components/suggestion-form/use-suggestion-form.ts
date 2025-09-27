'use client';

import { useFormStep1 } from '@/app/(home)/_components/suggestion-form/steps/step-1/use-form-step-1';
import { useFormStep2 } from '@/app/(home)/_components/suggestion-form/steps/step-2/use-form-step-2';
import { useFormStep3 } from '@/app/(home)/_components/suggestion-form/steps/step-3/use-form-step-3';
import { useFormStep4 } from '@/app/(home)/_components/suggestion-form/steps/step-4/use-form-step-4';
import { useFormStep5 } from '@/app/(home)/_components/suggestion-form/steps/step-5/use-form-step-5';
import { useFormStep6 } from '@/app/(home)/_components/suggestion-form/steps/step-6/use-form-step-6';
import { useFormStep7 } from '@/app/(home)/_components/suggestion-form/steps/step-7/use-form-step-7';
import { useRequest } from '@/app/_providers/request-context';

export function useSuggestionForm() {
  const formStep1 = useFormStep1();
  const formStep2 = useFormStep2();
  const formStep3 = useFormStep3();
  const formStep4 = useFormStep4();
  const formStep5 = useFormStep5();
  const formStep6 = useFormStep6();
  const formStep7 = useFormStep7();

  const { start, finish, isPending } = useRequest();

  const handleSubmit = async () => {
    const mergedSteps = {
      ...formStep1.form.getValues(),
      ...formStep2.form.getValues(),
      ...formStep3.form.getValues(),
      ...formStep4.form.getValues(),
      ...formStep5.form.getValues(),
      ...formStep6.form.getValues(),
      ...formStep7.form.getValues(),
    };

    const processFormSteps = () => {
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

    start('Gathering the best suggestions...');

    console.log(processFormSteps());

    await new Promise((res) => setTimeout(res, 3000));

    finish({ message: 'Your trip is ready!' });

    // fail('Something went wrong — please try again.')''
  };

  return {
    forms: [formStep1, formStep2, formStep3, formStep4, formStep5, formStep6, formStep7] as const,
    isPending,
    handleSubmit,
  };
}
