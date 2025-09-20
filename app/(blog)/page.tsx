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
    <main className="mx-auto flex w-full max-w-[60rem] flex-1 flex-col gap-12 px-6 py-16">
      <header className="flex flex-col gap-3">
        <p className="text-[0.9rem] uppercase tracking-[0.08em]">
          Personal Blog
        </p>
        <h1 className="text-4xl font-bold">My Blog</h1>
        <p className="m-0 text-fd-muted-foreground leading-relaxed">
          Welcome! Here you can find quick notes and longer posts built with the Fumadocs blog
          pipeline.
        </p>
      </header>

      <div className="flex flex-col gap-7">
        {posts.map((post) => {
          const publishedAt = getDate(post.data.date);
          return (
            <article key={post.url} className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <time dateTime={publishedAt.toISOString()} className="text-[0.95rem] text-fd-muted-foreground">
                  {formatDate(publishedAt)}
                </time>
                {post.data.tags && post.data.tags.length > 0 ? (
                  <span className="rounded-full bg-fd-muted px-2 py-1 text-[0.8rem] uppercase tracking-[0.08em] text-fd-primary">
                    {post.data.tags.join(' / ')}
                  </span>
                ) : null}
              </div>
              <h2 className="text-[1.75rem] font-semibold">
                <Link href={post.url} className="text-inherit no-underline">
                  {post.data.title}
                </Link>
              </h2>
              <p className="m-0 text-fd-muted-foreground leading-relaxed">
                {post.data.description}
              </p>
              <div>
                <Link href={post.url} className="font-semibold underline decoration-2 underline-offset-4">
                  Read more →
                </Link>
              </div>
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
