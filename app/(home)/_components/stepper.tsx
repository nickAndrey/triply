'use client';

import { Button } from '@/chadcn/components/ui/button';
import { cn } from '@/chadcn/lib/utils';
import { ReactNode } from 'react';
import { useStep } from 'usehooks-ts';

type Props = {
  steps: { step: number; element: ReactNode }[];
  renderNavigationButtons?: (params: { helpers: ReturnType<typeof useStep>['1']; currentStep: number }) => ReactNode;
};

export function Stepper({ steps, renderNavigationButtons }: Props) {
  const [currentStep, helpers] = useStep(steps.length);

  const stepToRender = steps.find((item) => item.step === currentStep)?.element;

  return (
    <div className="flex flex-col gap-10 justify-center items-center">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(20px,64px))] w-full justify-center items-center gap-4">
        {Array.from({ length: steps.length }).map((_, idx) => (
          <div
            key={idx}
            className={cn('h-1.5 rounded-full bg-secondary-foreground/30', idx + 1 <= currentStep ? 'bg-primary' : '')}
          />
        ))}
      </div>

      {stepToRender}

      {renderNavigationButtons?.({ helpers, currentStep }) || (
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={helpers.goToPrevStep}>
            Go to previous step
          </Button>
          <Button variant="secondary" onClick={helpers.goToNextStep}>
            Go to next step
          </Button>
        </div>
      )}
    </div>
  );
}
