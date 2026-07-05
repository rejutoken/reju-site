import { google } from "googleapis";
import { randomUUID } from "crypto";

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
};

export type BlogEngagementStore = {
  articles: Record<string, ArticleEngagement>;
};

const ENGAGEMENT_FILE_NAME = "blog-engagement.json";

function emptyArticleEngagement(): ArticleEngagement {
  return { likeCount: 0, likes: [], comments: [] };
}

function getEnv() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const folderId = process.env.GOOGLE_DRIVE_UPLOADBOOKADMIN;

  if (!clientEmail || !privateKey || !folderId) {
    throw new Error("Missing Google credentials for blog engagement storage.");
  }

  return { clientEmail, privateKey, folderId };
}

async function getDriveAndFolder() {
  const { clientEmail, privateKey, folderId } = getEnv();
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  const drive = google.drive({ version: "v3", auth });
  return { drive, folderId };
}

async function findEngagementFileId(drive: ReturnType<typeof google.drive>, folderId: string) {
  const list = await drive.files.list({
    q: `'${folderId}' in parents and name = '${ENGAGEMENT_FILE_NAME}' and trashed = false`,
    fields: "files(id)",
    supportsAllDrives: true,
  });
  return list.data.files?.[0]?.id || null;
}

async function readStore(): Promise<BlogEngagementStore> {
  const { drive, folderId } = await getDriveAndFolder();
  const fileId = await findEngagementFileId(drive, folderId);

  if (!fileId) {
    return { articles: {} };
  }

  const res = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "text" }
  );

  const raw = JSON.parse((res.data as string) || "{}");
  return {
    articles: raw.articles && typeof raw.articles === "object" ? raw.articles : {},
  };
}

async function writeStore(store: BlogEngagementStore): Promise<void> {
  const { drive, folderId } = await getDriveAndFolder();
  const body = JSON.stringify(store, null, 2);
  let fileId = await findEngagementFileId(drive, folderId);

  if (!fileId) {
    await drive.files.create({
      requestBody: {
        name: ENGAGEMENT_FILE_NAME,
        parents: [folderId],
      },
      media: {
        mimeType: "application/json",
        body,
      },
      fields: "id",
      supportsAllDrives: true,
    });
    return;
  }

  await drive.files.update({
    fileId,
    media: {
      mimeType: "application/json",
      body,
    },
    fields: "id",
    supportsAllDrives: true,
  });
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

export async function getArticleEngagement(slug: string, voterId?: string) {
  const store = await readStore();
  const article = getArticle(store, slug);

  return {
    likeCount: article.likeCount,
    likedByViewer: voterId ? article.likes.includes(voterId) : false,
    comments: article.comments,
  };
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