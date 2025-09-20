'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from 'fumadocs-ui/utils/cn';

export type BlogDirectoryTree = {
  year: number;
  months: {
    month: number;
    label: string;
    posts: {
      title: string;
      url: string;
      dateLabel: string;
    }[];
  }[];
};

type BlogDirectoryProps = {
  tree: BlogDirectoryTree[];
};

function isActivePath(pathname: string, url: string) {
  if (url === '/') {
    return pathname === '/';
  }
  return pathname === url || pathname.startsWith(`${url}/`);
}

export function BlogDirectory({ tree }: BlogDirectoryProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[240px] shrink-0 lg:block">
      <nav aria-label="Blog directory" className="sticky top-24 space-y-6">
        <DirectoryLink
          href="/"
          label="All posts"
          active={isActivePath(pathname, '/')}
        />
        {tree.map((year) => (
          <section key={year.year} className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
              {year.year}
            </p>
            <div className="space-y-2">
              {year.months.map((month) => (
                <div key={`${year.year}-${month.month}`} className="space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-fd-muted-foreground/80">
                    {month.label}
                  </p>
                  <ul className="space-y-1.5">
                    {month.posts.map((post) => (
                      <li key={post.url}>
                        <DirectoryLink
                          href={post.url}
                          label={post.title}
                          hint={post.dateLabel}
                          active={isActivePath(pathname, post.url)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </nav>
    </aside>
  );
}

type DirectoryLinkProps = {
  href: string;
  label: string;
  hint?: string;
  active?: boolean;
};

function DirectoryLink({ href, label, hint, active }: DirectoryLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group flex items-center justify-between rounded-md border border-transparent px-3 py-2 text-sm text-fd-muted-foreground transition-colors hover:border-fd-muted/60 hover:bg-fd-muted/70 hover:text-fd-foreground',
        active && 'border-fd-primary/40 bg-fd-primary/10 text-fd-primary shadow-sm'
      )}
    >
      <span className="truncate font-medium">{label}</span>
      {hint ? (
        <span
          className={cn(
            'ms-3 shrink-0 text-xs font-normal text-fd-muted-foreground transition-colors group-hover:text-fd-accent-foreground',
            active && 'text-fd-primary/80'
          )}
        >
          {hint}
        </span>
      ) : null}
    </Link>
  );
}
