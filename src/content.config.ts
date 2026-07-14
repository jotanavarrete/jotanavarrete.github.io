import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog posts live under src/content/blog/<lang>/*.md(x).
// The folder is the source of truth for language, and `lang` in the
// frontmatter mirrors it so we can filter/type it safely.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      lang: z.enum(['es', 'en']),
      // Shared id to link a post with its translations across languages.
      // Same value in each language's file; the switcher uses it to jump
      // to the matching post even when slugs differ.
      translationKey: z.string().optional(),
      heroImage: image().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
