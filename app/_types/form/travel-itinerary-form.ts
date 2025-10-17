import z from 'zod';

import { schema as schemaFormStep1 } from '@/app/_components/trip-plan-form-steps/steps/step-1/use-form-step-1';
import { schema as schemaFormStep2 } from '@/app/_components/trip-plan-form-steps/steps/step-2/use-form-step-2';
import { schema as schemaFormStep3 } from '@/app/_components/trip-plan-form-steps/steps/step-3/use-form-step-3';
import { schema as schemaFormStep4 } from '@/app/_components/trip-plan-form-steps/steps/step-4/use-form-step-4';
import { schema as schemaFormStep5 } from '@/app/_components/trip-plan-form-steps/steps/step-5/use-form-step-5';
import { schema as schemaFormStep6 } from '@/app/_components/trip-plan-form-steps/steps/step-6/use-form-step-6';
import { schema as schemaFormStep7 } from '@/app/_components/trip-plan-form-steps/steps/step-7/use-form-step-7';

/**
 * @description
 * `mergedFormsShapes` combines the `.shape` of all step schemas into a single Zod object.
 * This serves as the canonical schema for the complete travel itinerary form.
 *
 * ⚠️ Note: It is required for accurate `z.infer` typing across all steps.
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

export type TravelItineraryForm = z.infer<typeof mergedFormsShapes> & {};
