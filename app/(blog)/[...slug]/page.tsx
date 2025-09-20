import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { DocsBody } from 'fumadocs-ui/page';
import { source } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';
import { BlogInlineTOC } from '@/components/blog-inline-toc';

type BlogPageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function Page(props: BlogPageProps) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDXContent = page.data.body;
  const publishedAt = getDate(page.data.date);
  const toc = page.data.toc ?? [];

  return (
    <article
      style={{
        margin: '0 auto',
        padding: '4rem 1.5rem 5rem',
        width: '100%',
        maxWidth: '768px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem',
      }}
    >
      <header style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Link
          href="/"
          style={{
            alignSelf: 'flex-start',
            textDecoration: 'none',
            fontSize: '0.9rem',
            color: 'var(--muted-foreground, #666)',
          }}
        >
          ← Back to posts
        </Link>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <time dateTime={publishedAt.toISOString()} style={{ color: 'var(--muted-foreground, #666)' }}>
            {formatDate(publishedAt)}
          </time>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>{page.data.title}</h1>
          {page.data.description ? (
            <p style={{ margin: 0, color: 'var(--muted-foreground, #666)', lineHeight: 1.6 }}>
              {page.data.description}
            </p>
          ) : null}
          {page.data.tags && page.data.tags.length > 0 ? (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {page.data.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: '0.8rem',
                    background: 'var(--fd-muted, rgba(99,102,241,0.12))',
                    color: 'var(--fd-primary, #6366f1)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </header>

      <BlogInlineTOC items={toc} defaultOpen>
        On this page
      </BlogInlineTOC>

      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </article>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: BlogPageProps): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const publishedAt = getDate(page.data.date);

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      title: page.data.title,
      description: page.data.description ?? undefined,
      type: 'article',
      publishedTime: publishedAt.toISOString(),
      url: page.url,
    },
  };
}

function getDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'string') return new Date(value);
  return new Date();
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
