import Link from 'next/link';
import { source } from '@/lib/source';

export const metadata = {
  title: 'My Blog',
  description: 'Stories, notes, and experiments powered by Fumadocs.',
};

export default function BlogIndexPage() {
  const posts = [...source.getPages()].sort((a, b) => {
    const dateA = getDate(a.data.date);
    const dateB = getDate(b.data.date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <main className="mx-auto flex w-full max-w-[72rem] flex-1 flex-col gap-12 px-6 py-16">
      <header className="flex flex-col gap-3">
        <p className="text-[0.9rem] uppercase tracking-[0.08em]">
          Personal Blog
        </p>
        <h1 className="text-4xl font-bold">My Blog</h1>
        <p className="m-0 leading-relaxed text-[color:var(--color-fd-muted-foreground)]">
          Welcome! Here you can find quick notes and longer posts built with the Fumadocs blog
          pipeline.
        </p>
      </header>

      <div className="flex flex-col gap-7">
        {posts.map((post) => {
          const publishedAt = getDate(post.data.date);
          return (
            <article key={post.url} className="flex flex-col gap-3">
              <h2 className="text-[1.75rem] font-semibold">
                <Link href={post.url} className="text-[inherit] no-underline">
                  {post.data.title}
                </Link>
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-[0.95rem] text-[color:var(--color-fd-muted-foreground)]">
                <time dateTime={publishedAt.toISOString()} className="text-[inherit]">
                  {formatDate(publishedAt)}
                </time>
                {post.data.tags && post.data.tags.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {post.data.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[color:var(--color-fd-muted)] px-3 py-1 text-[0.8rem] uppercase tracking-[0.08em] text-[color:var(--color-fd-primary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              {post.data.description ? (
                <p className="m-0 leading-relaxed text-[color:var(--color-fd-muted-foreground)]">
                  {post.data.description}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </main>
  );
}

function getDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'string') return new Date(value);
  return new Date();
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
