import { NavLink } from '@/app/_components/header/nav-bar/components/nav-link';
import { SearchBox } from '@/app/_components/header/nav-bar/components/search-box/search-box';
import { useSearchBox } from '@/app/_components/header/nav-bar/components/search-box/use-search-box';
import { useNavBarActions } from '@/app/_components/header/nav-bar/hooks/use-nav-bar-actions';
import { NavBarItem } from '@/app/_components/header/nav-bar/types/nav-bar-item';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/chadcn/components/ui/context-menu';
import { cn } from '@/chadcn/lib/utils';
import { Plane } from 'lucide-react';
import { useRef } from 'react';

type Props = {
  navbarItems: NavBarItem[];
  actions: ReturnType<typeof useNavBarActions>;
};

export function NavItems({ navbarItems, actions }: Props) {
  const ulRef = useRef<HTMLUListElement>(null);

  const searchProps = useSearchBox({ navbarItems, ulRef });

  return (
    <ul className="flex flex-col gap-1 px-3 pb-4 w-full overflow-auto" ref={ulRef}>
      <li className="py-2 sticky top-0 z-10 bg-background">
        <SearchBox {...searchProps} />
      </li>

      {searchProps.filteredNavbarItems.map((navBarItem) => {
        const { id, trip_plan_details } = navBarItem;

        const navTitle = trip_plan_details.navTitle;
        const duration = `${trip_plan_details.tripDurationDays}-day`;
        const subtitle = `${duration} ${trip_plan_details.companions.type.toLowerCase()} trip • ${trip_plan_details.season.toLowerCase()}`;

        return (
          <li key={id}>
            <ContextMenu>
              <ContextMenuTrigger>
                <NavLink
                  href={`/${trip_plan_details.slug}`}
                  label={navTitle}
                  subtitle={subtitle}
                  actions={actions}
                  navBarItem={navBarItem}
                  icon={<Plane className="w-4 h-4" />}
                />
              </ContextMenuTrigger>
              <ContextMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
                {actions.actionsConfig.map((item) => (
                  <ContextMenuItem
                    key={item.id}
                    onClick={() => item.action(navBarItem)}
                    className={cn(
                      item.label === 'Delete' && 'text-destructive hover:!bg-destructive/20 hover:!text-destructive'
                    )}
                  >
                    {item.label}
                  </ContextMenuItem>
                ))}
              </ContextMenuContent>
            </ContextMenu>
          </li>
        );
      })}
    </ul>
  );
}
