import { TwitterApi } from "twitter-api-v2";

export type XAccount = "crypto" | "rejuvenation";

export const X_ACCOUNT_HANDLES: Record<XAccount, string> = {
  crypto: "REJUTOKEN",
  rejuvenation: "REJUvenationTKN",
};

export type XPublishResult =
  | { posted: false; reason: string; account: XAccount }
  | { posted: true; tweetId: string; url: string; account: XAccount; mediaIds?: string[] };

/**
 * How a given account authenticates:
 *  - "oauth1a": X_API_KEY + X_API_SECRET + X_ACCESS_TOKEN + X_ACCESS_TOKEN_SECRET
 *               (rejuvenation: X_REJUV_ACCESS_TOKEN + X_REJUV_ACCESS_TOKEN_SECRET, app keys shared
 *               unless X_REJUV_API_KEY / X_REJUV_API_SECRET are set). Never expires. Media upload
 *               works with the app's Read and Write permission, no extra scope.
 *  - "oauth2":  only the access token is set (no secret). This is an OAuth 2.0 user token and
 *               needs the media.write scope for images. OAuth 2.0 user tokens also expire after
 *               2 hours unless refreshed, so a long-running cron almost certainly uses OAuth 1.0a.
 */
export type XAuthMode = "oauth1a" | "oauth2" | "none";

function env(name: string): string {
  return process.env[name]?.trim() || "";
}

function keysFor(account: XAccount) {
  if (account === "rejuvenation") {
    return {
      appKey: env("X_REJUV_API_KEY") || env("X_API_KEY"),
      appSecret: env("X_REJUV_API_SECRET") || env("X_API_SECRET"),
      accessToken: env("X_REJUV_ACCESS_TOKEN"),
      accessSecret: env("X_REJUV_ACCESS_TOKEN_SECRET"),
    };
  }
  return {
    appKey: env("X_API_KEY"),
    appSecret: env("X_API_SECRET"),
    accessToken: env("X_ACCESS_TOKEN"),
    accessSecret: env("X_ACCESS_TOKEN_SECRET"),
  };
}

export function xAuthMode(account: XAccount): XAuthMode {
  const { appKey, appSecret, accessToken, accessSecret } = keysFor(account);
  if (appKey && appSecret && accessToken && accessSecret) return "oauth1a";
  if (accessToken && !accessSecret) return "oauth2";
  return "none";
}

export function getXClient(account: XAccount = "crypto"): TwitterApi | null {
  const { appKey, appSecret, accessToken, accessSecret } = keysFor(account);
  const mode = xAuthMode(account);
  if (mode === "oauth1a") {
    return new TwitterApi({ appKey, appSecret, accessToken, accessSecret });
  }
  // Newer X console: Client ID + Client Secret + user Access Token (OAuth 2.0).
  if (mode === "oauth2") return new TwitterApi(accessToken);
  return null;
}

type XApiError = {
  message?: string;
  code?: number;
  data?: { detail?: string; title?: string; errors?: Array<{ message?: string }> };
};

function describeXError(error: unknown, fallback: string): string {
  const err = error as XApiError;
  const detail =
    err?.data?.detail ||
    err?.data?.title ||
    err?.data?.errors?.[0]?.message ||
    err?.message ||
    fallback;
  return err?.code ? `${detail} (HTTP ${err.code})` : detail;
}

export type XMediaUploadResult =
  | { ok: true; mediaId: string; endpoint: "v2" | "v1.1" }
  | { ok: false; reason: string; needsReauth?: boolean };

/**
 * Upload one image for a post.
 *  - OAuth 1.0a: X API v2 POST /2/media/upload (initialize, append, finalize), which accepts
 *    OAuth 1.0a user context. If v2 refuses, retry once on the v1.1 upload.twitter.com endpoint.
 *  - OAuth 2.0 user token: v2 only, and the token must carry the media.write scope.
 * Never throws: the caller posts text-only when this fails.
 */
export async function uploadImage(
  image: Buffer,
  account: XAccount,
  mimeType: "image/png" | "image/jpeg" = "image/png"
): Promise<XMediaUploadResult> {
  if (env("X_MEDIA_UPLOAD") === "off") return { ok: false, reason: "Media upload disabled by X_MEDIA_UPLOAD=off." };
  if (image.length > 5 * 1024 * 1024) return { ok: false, reason: "Image is larger than 5 MB." };
  const client = getXClient(account);
  const mode = xAuthMode(account);
  if (!client) return { ok: false, reason: "X keys are not set for this account." };

  try {
    const mediaId = await client.v2.uploadMedia(image, { media_type: mimeType, media_category: "tweet_image" });
    return { ok: true, mediaId, endpoint: "v2" };
  } catch (v2Error) {
    const v2Reason = describeXError(v2Error, "v2 media upload failed");
    const code = (v2Error as XApiError)?.code;
    if (mode === "oauth2") {
      const scope = code === 401 || code === 403;
      return {
        ok: false,
        reason: scope
          ? `v2 media upload refused (${v2Reason}). The OAuth 2.0 token likely lacks the media.write scope; re-authorize @${X_ACCOUNT_HANDLES[account]} with media.write.`
          : v2Reason,
        needsReauth: scope,
      };
    }
    try {
      const mediaId = await client.v1.uploadMedia(image, { mimeType });
      console.warn(`X media: v2 upload failed (${v2Reason}), v1.1 upload worked.`);
      return { ok: true, mediaId, endpoint: "v1.1" };
    } catch (v1Error) {
      return {
        ok: false,
        reason: `v2: ${v2Reason}; v1.1: ${describeXError(v1Error, "v1.1 media upload failed")}`,
      };
    }
  }
}

export async function publishTweet(
  text: string,
  account: XAccount = "crypto",
  options: { mediaIds?: string[] } = {}
): Promise<XPublishResult> {
  const body = text.trim();
  if (!body) return { posted: false, reason: "Empty post text.", account };
  const weightedLength = body.replace(/https?:\/\/\S+/gi, "x".repeat(23)).length;
  if (weightedLength > 280) {
    return {
      posted: false,
      reason: `Post is ${weightedLength} characters (max 280).`,
      account,
    };
  }

  const client = getXClient(account);
  const handle = X_ACCOUNT_HANDLES[account];
  if (!client) {
    return {
      posted: false,
      account,
      reason:
        account === "rejuvenation"
          ? "Rejuvenation X keys are not set. Add X_REJUV_ACCESS_TOKEN and X_REJUV_ACCESS_TOKEN_SECRET for @REJUvenationTKN. The crypto app key and secret are reused if X_REJUV_API_KEY is omitted."
          : "X keys are not set. Add either the four OAuth 1.0a keys, or X_ACCESS_TOKEN from Keys and tokens (Read and Write @REJUTOKEN).",
    };
  }

  const mediaIds = (options.mediaIds || []).filter(Boolean).slice(0, 4);
  try {
    const tweet = mediaIds.length
      ? await client.v2.tweet(body, {
          media: { media_ids: mediaIds as [string] | [string, string] | [string, string, string] | [string, string, string, string] },
        })
      : await client.v2.tweet(body);
    const id = tweet.data.id;
    return {
      posted: true,
      tweetId: id,
      account,
      url: `https://x.com/${handle}/status/${id}`,
      mediaIds: mediaIds.length ? mediaIds : undefined,
    };
  } catch (error: unknown) {
    const detail = describeXError(error, "X API rejected the post.");
    console.error("X PUBLISH ERROR:", detail);
    return { posted: false, reason: detail, account };
  }
}

export type XTweetMetrics = {
  id: string;
  created_at?: string;
  impressions: number;
  likes: number;
  replies: number;
  reposts: number;
  quotes: number;
  bookmarks: number;
};

/** Read public_metrics for up to 100 tweet ids (one X API read). */
export async function fetchTweetMetrics(ids: string[], account: XAccount): Promise<XTweetMetrics[]> {
  const client = getXClient(account);
  if (!client || ids.length === 0) return [];
  const res = await client.v2.tweets(ids.slice(0, 100), { "tweet.fields": ["public_metrics", "created_at"] });
  return (res.data || []).map((t) => {
    const m = (t.public_metrics || {}) as Record<string, number | undefined>;
    return {
      id: t.id,
      created_at: t.created_at,
      impressions: m.impression_count ?? 0,
      likes: m.like_count ?? 0,
      replies: m.reply_count ?? 0,
      reposts: m.retweet_count ?? 0,
      quotes: m.quote_count ?? 0,
      bookmarks: m.bookmark_count ?? 0,
    };
  });
}
