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
    <main
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem',
        padding: '4rem 1.5rem',
        maxWidth: '960px',
        margin: '0 auto',
      }}
    >
      <header style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <p style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Personal Blog
        </p>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 700 }}>My Blog</h1>
        <p style={{ color: 'var(--muted-foreground, #666)', lineHeight: 1.6 }}>
          Welcome! Here you can find quick notes and longer posts built with the Fumadocs blog
          pipeline.
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {posts.map((post) => {
          const publishedAt = getDate(post.data.date);
          return (
            <article key={post.url} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <time
                  dateTime={publishedAt.toISOString()}
                  style={{ fontSize: '0.95rem', color: 'var(--muted-foreground, #666)' }}
                >
                  {formatDate(publishedAt)}
                </time>
                {post.data.tags && post.data.tags.length > 0 ? (
                  <span
                    style={{
                      fontSize: '0.8rem',
                      background: 'var(--fd-muted, rgba(99,102,241,0.1))',
                      color: 'var(--fd-primary, #6366f1)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {post.data.tags.join(' / ')}
                  </span>
                ) : null}
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 600 }}>
                <Link href={post.url} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {post.data.title}
                </Link>
              </h2>
              <p style={{ margin: 0, color: 'var(--muted-foreground, #666)', lineHeight: 1.6 }}>
                {post.data.description}
              </p>
              <div>
                <Link
                  href={post.url}
                  style={{
                    fontWeight: 600,
                    textDecoration: 'underline',
                    textDecorationThickness: '2px',
                    textUnderlineOffset: '4px',
                  }}
                >
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
