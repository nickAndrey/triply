import { useRef } from 'react';

import { Plane } from 'lucide-react';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@chadcn/components/ui/context-menu';
import { cn } from '@chadcn/lib/utils';

import { NavLink } from '@components/header/nav-bar/components/nav-link';
import { SearchBox } from '@components/header/nav-bar/components/search-box/search-box';
import { useSearchBox } from '@components/header/nav-bar/components/search-box/use-search-box';
import { NavBarItem } from '@components/header/nav-bar/types/nav-bar-item';

import { useTripActions } from '@/app/_hooks/use-trip-actions';

type Props = {
  navbarItems: NavBarItem[];
  actions: ReturnType<typeof useTripActions>;
};

export function NavItems({ navbarItems, actions }: Props) {
  const ulRef = useRef<HTMLUListElement>(null);

  const searchProps = useSearchBox({ navbarItems, ulRef });

  const grouped = Object.groupBy(searchProps.filteredNavbarItems, ({ trip_core }) => trip_core.destination);

  return (
    <ul className="flex flex-col gap-3 px-3 pb-4 w-full overflow-auto" ref={ulRef}>
      <li className="py-2 sticky top-0 z-10 bg-background">
        <SearchBox {...searchProps} />
      </li>

      {Object.entries(grouped).map(([groupKey, values]) => {
        return (
          <li key={groupKey} className="not-last:border-b-1 pb-2">
            <h4 className="mb-1 font-semibold">{groupKey}</h4>

            <ul>
              {values?.map((navBarItem) => {
                const { id, trip_core } = navBarItem;

                if (!trip_core) return null;

                const navTitle = trip_core?.navTitle;
                const duration = `${trip_core.tripDurationDays}-day`;
                const subtitle = `${duration}`;

                return (
                  <li key={navBarItem.id}>
                    <ContextMenu>
                      <ContextMenuTrigger>
                        <NavLink
                          href={`/${id}`}
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
                              item.label === 'Delete' &&
                                'text-destructive hover:!bg-destructive/20 hover:!text-destructive'
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
          </li>
        );
      })}
    </ul>
  );
}
