'use client';

import { useInputRenameNavItem } from '@/app/_components/header/nav-bar/components/input-rename-nav-item/use-input-rename-nav-item';
import { Input } from '@/chadcn/components/ui/input';

type Props = ReturnType<typeof useInputRenameNavItem>;

export function InputRenameNavItem(props: Props) {
  return (
    <Input
      ref={props.linkRef}
      value={props.linkLabel}
      onChange={props.handleInputChange}
      onKeyDown={props.handleKeyDown}
      onBlur={props.handleBlur}
    />
  );
}
