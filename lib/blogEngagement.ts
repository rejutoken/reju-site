import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { Readable } from "stream";
import { getDriveClient, getJsonFilesFolderId } from "./driveJsonFolder";

export type BlogReply = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type BlogComment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
  replies: BlogReply[];
};

export type ArticleEngagement = {
  likeCount: number;
  likes: string[];
  comments: BlogComment[];
  viewCount: number;
};

export type BlogEngagementStore = {
  articles: Record<string, ArticleEngagement>;
};

export type ArticlePublicStats = {
  viewCount: number;
  likeCount: number;
  commentCount: number;
};

const ENGAGEMENT_FILE_NAME = "blog-engagement.json";
const LOCAL_STORE_PATH = path.join(process.cwd(), ".data", "blog-engagement.json");

function emptyArticleEngagement(): ArticleEngagement {
  return { likeCount: 0, likes: [], comments: [], viewCount: 0 };
}

function normalizeArticle(raw: Partial<ArticleEngagement> | undefined): ArticleEngagement {
  const comments = Array.isArray(raw?.comments) ? raw.comments : [];
  return {
    likeCount: Math.max(0, Number(raw?.likeCount || 0)),
    likes: Array.isArray(raw?.likes) ? raw.likes.filter((id) => typeof id === "string") : [],
    comments,
    viewCount: Math.max(0, Number(raw?.viewCount || 0)),
  };
}

function normalizeStore(raw: unknown): BlogEngagementStore {
  const articles =
    raw && typeof raw === "object" && "articles" in raw && raw.articles && typeof raw.articles === "object"
      ? (raw.articles as Record<string, Partial<ArticleEngagement>>)
      : {};

  return {
    articles: Object.fromEntries(
      Object.entries(articles).map(([slug, article]) => [slug, normalizeArticle(article)])
    ),
  };
}

function driveConfigured() {
  return Boolean(
    process.env.GOOGLE_DRIVE_JSONFILES?.trim() &&
      process.env.GOOGLE_CLIENT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY
  );
}

async function getDriveAndFolder() {
  const drive = getDriveClient();
  const folderId = getJsonFilesFolderId();
  return { drive, folderId };
}

async function findEngagementFileId(drive: ReturnType<typeof getDriveClient>, folderId: string) {
  const list = await drive.files.list({
    q: `'${folderId}' in parents and name = '${ENGAGEMENT_FILE_NAME}' and trashed = false`,
    fields: "files(id)",
    orderBy: "modifiedTime desc",
    pageSize: 1,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  return list.data.files?.[0]?.id || null;
}

function readLocalStore(): BlogEngagementStore {
  try {
    if (!fs.existsSync(LOCAL_STORE_PATH)) return { articles: {} };
    return normalizeStore(JSON.parse(fs.readFileSync(LOCAL_STORE_PATH, "utf8")));
  } catch {
    return { articles: {} };
  }
}

function writeLocalStore(store: BlogEngagementStore): void {
  fs.mkdirSync(path.dirname(LOCAL_STORE_PATH), { recursive: true });
  fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

async function readDriveStore(): Promise<BlogEngagementStore> {
  const { drive, folderId } = await getDriveAndFolder();
  const fileId = await findEngagementFileId(drive, folderId);

  if (!fileId) {
    return { articles: {} };
  }

  const res = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "text" }
  );

  return normalizeStore(JSON.parse((res.data as string) || "{}"));
}

async function writeDriveStore(store: BlogEngagementStore): Promise<void> {
  const { drive, folderId } = await getDriveAndFolder();
  const body = JSON.stringify(store, null, 2);
  let fileId = await findEngagementFileId(drive, folderId);

  const media = {
    mimeType: "application/json",
    body: Readable.from(Buffer.from(body, "utf8")),
  };

  if (!fileId) {
    await drive.files.create({
      requestBody: {
        name: ENGAGEMENT_FILE_NAME,
        parents: [folderId],
      },
      media,
      fields: "id",
      supportsAllDrives: true,
    });
    return;
  }

  await drive.files.update({
    fileId,
    media,
    fields: "id",
    supportsAllDrives: true,
  });
}

async function readStore(): Promise<BlogEngagementStore> {
  if (driveConfigured()) {
    try {
      return await readDriveStore();
    } catch (error) {
      console.error("Drive engagement read failed, using local store:", error);
    }
  }
  return readLocalStore();
}

async function writeStore(store: BlogEngagementStore): Promise<void> {
  if (driveConfigured()) {
    try {
      await writeDriveStore(store);
      return;
    } catch (error) {
      console.error("Drive engagement write failed, using local store:", error);
    }
  }
  writeLocalStore(store);
}

function getArticle(store: BlogEngagementStore, slug: string): ArticleEngagement {
  return store.articles[slug] || emptyArticleEngagement();
}

export function sanitizeText(value: string, maxLength: number): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function isValidVoterId(voterId: string): boolean {
  return /^[a-zA-Z0-9-]{8,64}$/.test(voterId);
}

function toPublicStats(article: ArticleEngagement): ArticlePublicStats {
  return {
    viewCount: article.viewCount,
    likeCount: article.likeCount,
    commentCount: article.comments.length,
  };
}

export async function getArticleEngagement(slug: string, voterId?: string) {
  const store = await readStore();
  const article = getArticle(store, slug);

  return {
    viewCount: article.viewCount,
    likeCount: article.likeCount,
    likedByViewer: voterId ? article.likes.includes(voterId) : false,
    comments: article.comments,
  };
}

export async function getArticlesPublicStats(
  slugs: string[]
): Promise<Record<string, ArticlePublicStats>> {
  const empty: ArticlePublicStats = { viewCount: 0, likeCount: 0, commentCount: 0 };
  try {
    const store = await readStore();
    return Object.fromEntries(
      slugs.map((slug) => [slug, toPublicStats(getArticle(store, slug))])
    );
  } catch {
    return Object.fromEntries(slugs.map((slug) => [slug, empty]));
  }
}

export async function recordArticleView(slug: string) {
  const store = await readStore();
  const article = getArticle(store, slug);
  article.viewCount += 1;
  store.articles[slug] = article;
  await writeStore(store);
  return { viewCount: article.viewCount };
}

export async function toggleArticleLike(slug: string, voterId: string) {
  const store = await readStore();
  const article = getArticle(store, slug);
  const alreadyLiked = article.likes.includes(voterId);

  if (alreadyLiked) {
    article.likes = article.likes.filter((id) => id !== voterId);
    article.likeCount = Math.max(0, article.likeCount - 1);
  } else {
    article.likes.push(voterId);
    article.likeCount += 1;
  }

  store.articles[slug] = article;
  await writeStore(store);

  return {
    likeCount: article.likeCount,
    likedByViewer: !alreadyLiked,
    viewCount: article.viewCount,
  };
}

export async function addArticleComment(
  slug: string,
  authorName: string,
  body: string
) {
  const store = await readStore();
  const article = getArticle(store, slug);

  const comment: BlogComment = {
    id: randomUUID(),
    authorName,
    body,
    createdAt: new Date().toISOString(),
    replies: [],
  };

  article.comments.unshift(comment);
  store.articles[slug] = article;
  await writeStore(store);

  return comment;
}

export async function addCommentReply(
  slug: string,
  commentId: string,
  authorName: string,
  body: string
) {
  const store = await readStore();
  const article = getArticle(store, slug);
  const comment = article.comments.find((item) => item.id === commentId);

  if (!comment) {
    throw new Error("Comment not found.");
  }

  const reply: BlogReply = {
    id: randomUUID(),
    authorName,
    body,
    createdAt: new Date().toISOString(),
  };

  comment.replies.push(reply);
  store.articles[slug] = article;
  await writeStore(store);

  return reply;
}
