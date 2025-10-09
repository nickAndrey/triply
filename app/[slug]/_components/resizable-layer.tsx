'use client';

import { ReactNode, useEffect, useState } from 'react';

import { useMediaQuery } from 'usehooks-ts';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@chadcn/components/ui/resizable';

type Props = {
  children: ReactNode;
  aside: ReactNode;
};

export function ResizableLayer({ children, aside }: Props) {
  const isSmallScreen = useMediaQuery('(width <= 64rem)');
  const [hydrated, setHydrated] = useState(false);

  // Prevent layout jump on hydration
  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return (
      <div className="flex h-[100dvh] py-4">
        <div className="w-1/4 px-2" />
        <div className="w-px bg-border" />
        <div className="flex-1 px-2" />
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction={isSmallScreen ? 'vertical' : 'horizontal'} className="!h-[100dvh] bg-card">
      {/* ASIDE PANEL */}
      <ResizablePanel className="px-4 py-4 overflow-y-auto" defaultSize={25} maxSize={isSmallScreen ? 80 : 35}>
        <div className="h-full pr-2 overflow-y-auto">{aside}</div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* MAIN CONTENT PANEL */}
      <ResizablePanel className="overflow-y-auto" defaultSize={75} maxSize={isSmallScreen ? 95 : 80}>
        <div className="h-full overflow-y-auto px-4 py-4">{children}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
