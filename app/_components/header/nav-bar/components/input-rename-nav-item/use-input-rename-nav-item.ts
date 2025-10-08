import { useNavBarActions } from '@/app/_components/header/nav-bar/hooks/use-nav-bar-actions';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';

type Params = {
  label: string;
  navItemId: string;
  actions: ReturnType<typeof useNavBarActions>;
  isEditMode: boolean;
};

export function useInputRenameNavItem({ label, navItemId, actions, isEditMode }: Params) {
  const [linkLabel, setLinkLabel] = useState(label);
  const linkRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      actions.handleRename(navItemId, linkLabel);
    }
  };

  const handleBlur = () => {
    actions.handleRename(navItemId, linkLabel);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLinkLabel(e.target.value);
  };

  useEffect(() => {
    if (isEditMode) {
      const timer = setTimeout(() => {
        linkRef.current?.focus();
        linkRef.current?.select();
      }, 200); // TODO!: find a better way to make that input focusable
      return () => clearTimeout(timer);
    }
  }, [isEditMode]);

  return {
    linkLabel,
    linkRef,
    handleInputChange,
    handleKeyDown,
    handleBlur,
  };
}
