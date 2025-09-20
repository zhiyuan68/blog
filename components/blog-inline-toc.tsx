'use client';

import { useMemo, useRef } from 'react';
import { ChevronDown } from 'fumadocs-ui/internal/icons';
import { cn } from 'fumadocs-ui/utils/cn';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'fumadocs-ui/components/ui/collapsible';
import { TocThumb } from 'fumadocs-ui/components/layout/toc-thumb';
import * as TocPrimitive from 'fumadocs-core/toc';
import type { InlineTocProps } from 'fumadocs-ui/components/inline-toc';

type BlogInlineTOCProps = InlineTocProps;
type TOCItem = BlogInlineTOCProps['items'][number];

type TocTreeNode = TOCItem & {
  children: TocTreeNode[];
};

export function BlogInlineTOC({ items, className, children, ...props }: BlogInlineTOCProps) {
  if (!items || items.length === 0) {
    return null;
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const tree = useMemo(() => buildTocTree(items), [items]);

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
            <div ref={containerRef} className="ps-2">
              <TocTree nodes={tree} />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </TocPrimitive.AnchorProvider>
  );
}

function TocTree({ nodes, level = 1 }: { nodes: TocTreeNode[]; level?: number }) {
  if (nodes.length === 0) {
    return null;
  }

  return (
    <ul className={cn('list-none space-y-1', level > 1 && 'ps-2')}>
      {nodes.map((node) => (
        <li key={node.url} className="space-y-1">
          <TocPrimitive.TOCItem
            href={node.url}
            className={cn(
              'block border-s-2 border-transparent pe-2 py-1.5 text-fd-muted-foreground transition-colors hover:text-fd-accent-foreground data-[active=true]:border-fd-primary data-[active=true]:text-fd-primary',
              level === 1 && 'ps-3',
              level === 2 && 'ps-6',
              level >= 3 && 'ps-8',
            )}
          >
            {node.title}
          </TocPrimitive.TOCItem>
          {node.children.length > 0 ? (
            <TocTree nodes={node.children} level={level + 1} />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function buildTocTree(items: TOCItem[]): TocTreeNode[] {
  const root: TocTreeNode[] = [];
  const stack: TocTreeNode[] = [];

  for (const item of items) {
    const node: TocTreeNode = { ...item, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].depth >= item.depth) {
      stack.pop();
    }

    const parent = stack[stack.length - 1];

    if (parent) {
      parent.children.push(node);
    } else {
      root.push(node);
    }

    stack.push(node);
  }

  return root;
}
