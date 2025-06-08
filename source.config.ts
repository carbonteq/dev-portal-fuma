import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import { remarkCodeHike, recmaCodeHike } from 'codehike/mdx';

/** @type {import('codehike/mdx').CodeHikeConfig} */
const chConfig = {
  // Use React Server Components (RSC) for better performance
  components: { code: "Code" },
};

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.vercel.app/docs/mdx/collections#define-docs
export const docs = defineDocs({
  docs: {
    schema: frontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // CodeHike MDX plugins for advanced code features
    remarkPlugins: (v) => [[remarkCodeHike, chConfig], ...v],
    recmaPlugins: [
      [recmaCodeHike, chConfig],
    ],
    jsx: true,
  },
});
