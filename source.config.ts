import { defineConfig, defineDocs, frontmatterSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';

// Define the blog as a docs collection so we get both MDX pages and metadata.
// Each post lives in `content/blog` and must include a title, description, and
// publish date in the frontmatter. Tags are optional but useful for grouping.
export const blog = defineDocs({
  dir: 'content/blog',
  docs: {
    schema: frontmatterSchema.extend({
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
    }),
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
