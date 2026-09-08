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

function listMdxFiles(): string[] {
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.mdx'));
}

export function slugifyBlogName(fileName: string): string {
  return fileName
    .replace(/\.mdx$/i, '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 180);
}

function frontmatterValue(data: Record<string, unknown>, names: string[]): unknown {
  const entries = Object.entries(data);
  for (const name of names) {
    const hit = entries.find(([key]) => key.toLowerCase() === name.toLowerCase());
    if (hit && hit[1] !== undefined && hit[1] !== null && hit[1] !== '') {
      return hit[1];
    }
  }
  return undefined;
}

function frontmatterString(data: Record<string, unknown>, names: string[], fallback = ''): string {
  const value = frontmatterValue(data, names);
  if (typeof value === 'string') return value.trim();
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().split('T')[0];
  }
  if (typeof value === 'number') return String(value);
  return fallback;
}

function normalizeCategory(raw: string): PostMeta['category'] {
  const value = raw.toLowerCase();
  if (value === 'health' || value === 'rejuvenation') return 'health';
  return 'crypto';
}

function normalizeDate(raw: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().split('T')[0];
  return new Date().toISOString().split('T')[0];
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
  const slug = slugifyBlogName(fileName);
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data } = matter(fileContents);
  const category = normalizeCategory(frontmatterString(data, ['category', 'desk', 'theme'], 'crypto'));

  return {
    slug,
    title: frontmatterString(data, ['title'], 'Untitled'),
    date: normalizeDate(frontmatterString(data, ['date'])),
    category,
    theme: categoryToTheme(category),
    description: frontmatterString(data, ['description', 'summary']),
  };
}

export async function getAllPostsMeta(): Promise<PostMeta[]> {
  try {
    return listMdxFiles()
      .map(readPostMeta)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const posts = await Promise.all(
      listMdxFiles()
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

function findPostFileName(slug: string): string | null {
  if (!/^[a-zA-Z0-9_-]{1,180}$/.test(slug)) return null;
  if (RESERVED_BLOG_SLUGS.has(slug)) return null;
  const exact = `${slug}.mdx`;
  const exactPath = path.join(postsDirectory, exact);
  if (exactPath.startsWith(postsDirectory) && fs.existsSync(exactPath)) return exact;
  return listMdxFiles().find((fileName) => slugifyBlogName(fileName) === slug) || null;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const fileName = findPostFileName(slug);
    if (!fileName) return null;
    const fullPath = path.join(postsDirectory, fileName);
    if (!fullPath.startsWith(postsDirectory)) return null;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { content } = matter(fileContents);
    const meta = readPostMeta(fileName);

    return {
      ...meta,
      content: await markdownToHtml(content, meta.title),
    };
  } catch {
    return null;
  }
}