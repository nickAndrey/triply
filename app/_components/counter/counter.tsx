'use client';

import { Minus, Plus } from 'lucide-react';

import { Button } from '@chadcn/components/ui/button';
import { Input } from '@chadcn/components/ui/input';

import { useCounter } from '@components/counter/use-counter';

type Props = ReturnType<typeof useCounter>;

export function Counter({
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
