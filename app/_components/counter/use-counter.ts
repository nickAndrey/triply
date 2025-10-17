'use client';

import { useEffect, useRef, useState } from 'react';

export function useCounter() {
  const [value, setValue] = useState<number | ''>(0);
  const [isInputActive, setIsInputActive] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isInputActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputActive]);

  const handleDecrease = () => {
    setValue((prev) => {
      if (prev === '' || prev <= 0) return 0;
      return prev - 1;
    });
  };

  const handleIncrease = () => {
    setValue((prev) => (prev === '' ? 1 : prev + 1));
  };

  const handleChange = (value: string) => {
    if (value === '') {
      setValue('');
    } else {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        setValue(parsed);
      }
    }
  };

  return {
    value,
    isInputActive,
    inputRef,
    setIsInputActive,
    handleDecrease,
    handleIncrease,
    handleChange,
  };
}
