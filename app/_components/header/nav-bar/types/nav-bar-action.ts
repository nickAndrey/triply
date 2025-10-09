import { NavBarItem } from '@components/header/nav-bar/types/nav-bar-item';

export type NavBarAction = {
  id: number;
  label: string;
  action: (params: NavBarItem) => void;
};
