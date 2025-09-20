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
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 pt-16 pb-20">
      <header className="flex flex-col gap-4">
        <Link
          href="/"
          className="self-start text-[0.9rem] text-[color:var(--color-fd-muted-foreground)] no-underline"
        >
          ← Back to posts
        </Link>
        <div className="flex flex-col gap-3">
          <time
            dateTime={publishedAt.toISOString()}
            className="text-[color:var(--color-fd-muted-foreground)]"
          >
            {formatDate(publishedAt)}
          </time>
          <h1 className="m-0 text-[2.5rem] font-bold">{page.data.title}</h1>
          {page.data.description ? (
            <p className="m-0 leading-relaxed text-[color:var(--color-fd-muted-foreground)]">
              {page.data.description}
            </p>
          ) : null}
          {page.data.tags && page.data.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {page.data.tags.map((tag) => (
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
