'use client';

import { Input } from '@chadcn/components/ui/input';

import { useInputRenameNavItem } from '@components/header/nav-bar/components/input-rename-nav-item/use-input-rename-nav-item';

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
