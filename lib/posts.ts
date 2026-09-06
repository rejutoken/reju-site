// lib/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';

const postsDirectory = path.join(process.cwd(), 'app/content/blog');
const RESERVED_BLOG_SLUGS = new Set(['crypto', 'rejuvenation']);

export type BlogTheme = 'crypto' | 'rejuvenation';

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  category: 'crypto' | 'health';
  theme: BlogTheme;
  description: string;
};

export type Post = PostMeta & {
  content: string;
};

function normalizeBlogImages(markdown: string): string {
  return markdown.replace(
    /<Image\b[\s\S]*?\/>/gi,
    (block) => {
      const src = block.match(/src=["']([^"']+)["']/i)?.[1];
      const alt = block.match(/alt=["']([^"']*)["']/i)?.[1] ?? "";
      if (!src) return "";
      return `![${alt}](${src})`;
    }
  );
}

function stripDuplicateTitleHeading(markdown: string, title: string): string {
  const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return markdown.replace(new RegExp(`^\\s*#\\s+${escaped}\\s*\\n+`, "i"), "");
}

async function markdownToHtml(markdown: string, title?: string): Promise<string> {
  const withoutDuplicateTitle = title
    ? stripDuplicateTitleHeading(markdown, title)
    : markdown;
  const normalized = normalizeBlogImages(withoutDuplicateTitle);
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(normalized);

  return processedContent.toString();
}

export function categoryToTheme(category: PostMeta['category']): BlogTheme {
  return category === 'health' ? 'rejuvenation' : 'crypto';
}

export function themeToCategory(theme: BlogTheme): PostMeta['category'] {
  return theme === 'rejuvenation' ? 'health' : 'crypto';
}

function readPostMeta(fileName: string): PostMeta {
  const slug = fileName.replace(/\.mdx$/, '');
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data } = matter(fileContents);
  const category = (data.category as 'crypto' | 'health') || 'crypto';

  return {
    slug,
    title: data.title || 'Untitled',
    date: data.date || new Date().toISOString().split('T')[0],
    category,
    theme: categoryToTheme(category),
    description: data.description || '',
  };
}

export async function getAllPostsMeta(): Promise<PostMeta[]> {
  try {
    const files = fs.readdirSync(postsDirectory);

    return files
      .filter((file) => file.endsWith('.mdx'))
      .map(readPostMeta)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const files = fs.readdirSync(postsDirectory);

    const posts = await Promise.all(
      files
        .filter((file) => file.endsWith('.mdx'))
        .map(async (fileName) => {
          const meta = readPostMeta(fileName);
          const fullPath = path.join(postsDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { content } = matter(fileContents);

          return {
            ...meta,
            content: await markdownToHtml(content, meta.title),
          };
        })
    );

    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

export async function getPostsByTheme(theme: BlogTheme): Promise<PostMeta[]> {
  const posts = await getAllPostsMeta();
  return posts.filter((post) => post.theme === theme);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    if (!/^[a-zA-Z0-9_-]{1,180}$/.test(slug)) return null;
    if (RESERVED_BLOG_SLUGS.has(slug)) return null;
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    if (!fullPath.startsWith(postsDirectory)) return null;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const category = (data.category as 'crypto' | 'health') || 'crypto';

    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      category,
      theme: categoryToTheme(category),
      description: data.description || '',
      content: await markdownToHtml(content, data.title || 'Untitled'),
    };
  } catch {
    return null;
  }
}