'use client';

import { useFormStep1 } from '@/app/(home)/_components/suggestion-form/steps/step-1/use-form-step-1';
import { useFormStep2 } from '@/app/(home)/_components/suggestion-form/steps/step-2/use-form-step-2';
import { useFormStep3 } from '@/app/(home)/_components/suggestion-form/steps/step-3/use-form-step-3';
import { useFormStep4 } from '@/app/(home)/_components/suggestion-form/steps/step-4/use-form-step-4';
import { useFormStep5 } from '@/app/(home)/_components/suggestion-form/steps/step-5/use-form-step-5';
import { useFormStep6 } from '@/app/(home)/_components/suggestion-form/steps/step-6/use-form-step-6';
import { useFormStep7 } from '@/app/(home)/_components/suggestion-form/steps/step-7/use-form-step-7';
import { useFormStep8 } from '@/app/(home)/_components/suggestion-form/steps/step-8/use-form-step-8';

export function useSuggestionForm() {
  const { form: formStep1 } = useFormStep1();
  const { form: formStep2 } = useFormStep2();
  const { form: formStep3 } = useFormStep3();
  const { form: formStep4 } = useFormStep4();
  const { form: formStep5 } = useFormStep5();
  const { form: formStep6 } = useFormStep6();
  const { form: formStep7 } = useFormStep7();
  const { form: formStep8 } = useFormStep8();

  return {
    forms: [formStep1, formStep2, formStep3, formStep4, formStep5, formStep6, formStep7, formStep8] as const,
  };
}
