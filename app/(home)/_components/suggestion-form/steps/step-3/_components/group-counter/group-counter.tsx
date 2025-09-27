'use client';

import { useGroupCounter } from '@/app/(home)/_components/suggestion-form/steps/step-3/_components/group-counter/use-group-counter';
import { Button } from '@/chadcn/components/ui/button';
import { Input } from '@/chadcn/components/ui/input';
import { Minus, Plus } from 'lucide-react';

type Props = ReturnType<typeof useGroupCounter>;

export function GroupCounter({
  groupMembers,
  isInputActive,
  inputRef,
  setIsInputActive,
  handleDecrease,
  handleIncrease,
  handleChange,
}: Props) {
  return (
    <div className="flex gap-3">
      <Button type="button" size="icon" className="rounded-full" onClick={handleDecrease} disabled={groupMembers === 0}>
        <Minus />
      </Button>

      {isInputActive ? (
        <Input
          ref={inputRef}
          type="number"
          min={0}
          value={groupMembers}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => setIsInputActive(false)}
          className="w-16"
        />
      ) : (
        <div
          className="border w-16 text-sm rounded-sm cursor-pointer dark:bg-input/30 flex items-center justify-center leading-none"
          onClick={() => setIsInputActive(true)}
        >
          {groupMembers}
        </div>
      )}

      <Button type="button" size="icon" className="rounded-full" onClick={handleIncrease}>
        <Plus />
      </Button>
    </div>
  );
}
