'use client';

import z from 'zod';

import { schema as schemaFormStep1, useFormStep1 } from '../steps/step-1/use-form-step-1';
import { schema as schemaFormStep2, useFormStep2 } from '../steps/step-2/use-form-step-2';
import { schema as schemaFormStep3, useFormStep3 } from '../steps/step-3/use-form-step-3';
import { schema as schemaFormStep4, useFormStep4 } from '../steps/step-4/use-form-step-4';
import { schema as schemaFormStep5, useFormStep5 } from '../steps/step-5/use-form-step-5';
import { schema as schemaFormStep6, useFormStep6 } from '../steps/step-6/use-form-step-6';
import { schema as schemaFormStep7, useFormStep7 } from '../steps/step-7/use-form-step-7';

export function useTripPlanFormSteps() {
  const formStep1 = useFormStep1();
  const formStep2 = useFormStep2();
  const formStep3 = useFormStep3();
  const formStep4 = useFormStep4();
  const formStep5 = useFormStep5();
  const formStep6 = useFormStep6();
  const formStep7 = useFormStep7();

  /**
   * @description
   * `mergedFormsShapes` combines the `.shape` of all step schemas into a single Zod object.
   * This serves as the canonical schema for the complete travel itinerary form.
   *
   * ⚠️ Note: It is required for accurate `z.infer` typing across all steps.
   * Even if not directly used for validation in this hook, it must remain defined.
   */
  const mergedFormsShapes = z.object({
    ...schemaFormStep1.shape,
    ...schemaFormStep2.shape,
    ...schemaFormStep3.shape,
    ...schemaFormStep4.shape,
    ...schemaFormStep5.shape,
    ...schemaFormStep6.shape,
    ...schemaFormStep7.shape,
  });

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
    mergedFormsShapes,
    processFormSteps,
  };
}
