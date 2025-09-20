import type { ReactNode } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { source } from '@/lib/source';
import { BlogDirectory, type BlogDirectoryTree } from '@/components/blog-directory';

type PostEntry = {
  title: string;
  url: string;
  date: Date;
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  const posts = collectPosts();
  const tree = buildDirectory(posts);

  return (
    <HomeLayout {...baseOptions()} style={{ flex: 1 }}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:flex-row lg:gap-16 lg:px-8">
        <BlogDirectory tree={tree} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </HomeLayout>
  );
}

function collectPosts(): PostEntry[] {
  return [...source.getPages()]
    .map((page) => ({
      title: page.data.title ?? humanizeSlug(page.slugs.at(-1) ?? page.url),
      url: page.url,
      date: coerceDate(page.data.date),
    }))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

function buildDirectory(posts: PostEntry[]): BlogDirectoryTree[] {
  const byYear = new Map<number, Map<number, { label: string; posts: PostEntry[] }>>();
  const monthFormatter = new Intl.DateTimeFormat(undefined, { month: 'long' });
  const dateFormatter = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });

  for (const post of posts) {
    const year = post.date.getFullYear();
    const month = post.date.getMonth();
    let months = byYear.get(year);
    if (!months) {
      months = new Map();
      byYear.set(year, months);
    }
    let bucket = months.get(month);
    if (!bucket) {
      bucket = { label: monthFormatter.format(post.date), posts: [] };
      months.set(month, bucket);
    }
    bucket.posts.push(post);
  }

  return Array.from(byYear.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, months]) => ({
      year,
      months: Array.from(months.entries())
        .sort((a, b) => b[0] - a[0])
        .map(([month, bucket]) => ({
          month,
          label: bucket.label,
          posts: bucket.posts
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .map((post) => ({
              title: post.title,
              url: post.url,
              dateLabel: dateFormatter.format(post.date),
            })),
        })),
    })) as BlogDirectoryTree[];
}

function coerceDate(input: unknown): Date {
  if (input instanceof Date) return input;
  if (typeof input === 'string') {
    const parsed = new Date(input);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date();
}

function humanizeSlug(value: string): string {
  const slug = value.replace(/^\/+|\/+$/g, '');
  if (!slug) return 'Untitled';
  const lastSegment = slug.split('/').at(-1) ?? slug;
  const label = lastSegment
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
  return label || 'Untitled';
}
