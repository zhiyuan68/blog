# Fumadocs blog starter

This project was bootstrapped with
[Create Fumadocs](https://github.com/fuma-nama/fumadocs) and adapted to ship a
blog instead of a documentation website. The homepage lists the latest posts
and each article is rendered from an MDX file in `content/blog`.

Run development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open http://localhost:3000 with your browser to see the result. The root route
(`/`) now shows the blog index.

## Explore

In the project, you can see:

- `lib/source.ts`: Sets up the shared blog content source using [`loader()`](https://fumadocs.dev/docs/headless/source-api).
- `lib/layout.shared.tsx`: Shared options for navigation across the blog.
- `source.config.ts`: Defines the blog MDX collection and its frontmatter schema.

| Route                              | Description                                           |
| ---------------------------------- | ----------------------------------------------------- |
| `app/(blog)/page.tsx`              | Landing page that lists all blog posts.               |
| `app/(blog)/[...slug]/page.tsx`    | Dynamic route that renders individual blog articles.  |
| `app/api/search/route.ts`          | Route handler for search across the blog content.     |

### Fumadocs MDX

The `content/blog` directory holds the MDX posts. Create a new file and include
frontmatter with a `title`, `description`, `date` and optional `tags` to add a
new article.

Read the [blog guide](https://fumadocs.dev/blog/make-a-blog) and the
[MDX Introduction](https://fumadocs.dev/docs/mdx) for further details.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.vercel.app) - learn about Fumadocs
