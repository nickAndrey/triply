'use client';

import { useState } from 'react';

import { Button } from '@/chadcn/components/ui/button';
import { Input } from '@/chadcn/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

export function InputPassword({
  className,
  ...props
}: React.ComponentProps<'input'>) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        id="password"
        type={show ? 'text' : 'password'}
        placeholder="Enter your password"
        className={className}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent rounded-full"
        onClick={() => setShow(!show)}
      >
        {show ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}
