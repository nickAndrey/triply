import { KeyboardEvent, RefObject, useEffect, useState } from 'react';

import { useDebounce } from '@chadcn/components/ui/multi-selector';

import { NavBarItem } from '@components/header/nav-bar/types/nav-bar-item';

type Params = {
  navbarItems: NavBarItem[];
  ulRef: RefObject<HTMLUListElement | null>;
};

export function useSearchBox({ navbarItems, ulRef }: Params) {
  const [searchValue, setSearchValue] = useState('');
  const searchValueDebounced = useDebounce(searchValue, 500);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [filteredNavbarItems, setFilteredNavbarItems] = useState(navbarItems);

  const handleClearValue = () => {
    setSearchValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!ulRef.current) return;

    const links = Array.from(ulRef.current.querySelectorAll('a'));

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % links.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + links.length) % links.length);
        break;
      case 'Enter':
        (links[activeIndex] as HTMLAnchorElement)?.click();
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    const links = ulRef.current?.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
    links?.forEach((link, idx) => {
      link.classList.toggle('bg-blue-100', idx === activeIndex);
    });
  }, [activeIndex, ulRef]);

  useEffect(() => {
    const regex = new RegExp(searchValueDebounced, 'i');
    const filtered = navbarItems.filter((item) => regex.test(item.trip_core.city));

    setFilteredNavbarItems(filtered);
  }, [searchValueDebounced, navbarItems]);

  return {
    searchValue,
    filteredNavbarItems,
    setSearchValue,
    handleKeyDown,
    handleClearValue,
  };
}
