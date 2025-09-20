'use client';

import { useRef } from 'react';
import { ChevronDown } from 'fumadocs-ui/internal/icons';
import { cn } from 'fumadocs-ui/utils/cn';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'fumadocs-ui/components/ui/collapsible';
import { TocThumb } from 'fumadocs-ui/components/layout/toc-thumb';
import * as TocPrimitive from 'fumadocs-core/toc';
import type { InlineTocProps } from 'fumadocs-ui/components/inline-toc';

type BlogInlineTOCProps = InlineTocProps;

export function BlogInlineTOC({ items, className, children, ...props }: BlogInlineTOCProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <TocPrimitive.AnchorProvider toc={items}>
      <Collapsible
        {...props}
        className={cn(
          'not-prose rounded-lg border bg-fd-card text-fd-card-foreground shadow-sm',
          className,
        )}
      >
        <CollapsibleTrigger className="group inline-flex w-full items-center justify-between px-4 py-2.5 font-medium">
          {children ?? 'On this page'}
          <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="relative px-2 pb-3 pt-1 text-sm">
            <TocThumb
              containerRef={containerRef}
              className="pointer-events-none absolute left-0 top-[--fd-top] h-[--fd-height] w-px rounded-full bg-fd-primary transition-all"
            />
            <div ref={containerRef} className="flex flex-col ps-2">
              {items.map((item) => (
                <TocPrimitive.TOCItem
                  key={item.url}
                  href={item.url}
                  className={cn(
                    'border-s-2 border-transparent py-1.5 text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground data-[active=true]:border-fd-primary data-[active=true]:text-fd-primary',
                    item.depth <= 2 && 'ps-3',
                    item.depth === 3 && 'ps-6',
                    item.depth >= 4 && 'ps-8',
                  )}
                >
                  {item.title}
                </TocPrimitive.TOCItem>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </TocPrimitive.AnchorProvider>
  );
}
