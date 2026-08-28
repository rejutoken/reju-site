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

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  category: 'crypto' | 'health';
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

async function markdownToHtml(markdown: string): Promise<string> {
  const normalized = normalizeBlogImages(markdown);
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(normalized);

  return processedContent.toString();
}

function readPostMeta(fileName: string): PostMeta {
  const slug = fileName.replace(/\.mdx$/, '');
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data } = matter(fileContents);

  return {
    slug,
    title: data.title || 'Untitled',
    date: data.date || new Date().toISOString().split('T')[0],
    category: (data.category as 'crypto' | 'health') || 'crypto',
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
            content: await markdownToHtml(content),
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

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    if (!/^[a-zA-Z0-9_-]{1,180}$/.test(slug)) return null;
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    if (!fullPath.startsWith(postsDirectory)) return null;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      category: (data.category as 'crypto' | 'health') || 'crypto',
      description: data.description || '',
      content: await markdownToHtml(content),
    };
  } catch {
    return null;
  }
}