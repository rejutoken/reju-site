import { TwitterApi } from "twitter-api-v2";

export type XAccount = "crypto" | "rejuvenation";

export const X_ACCOUNT_HANDLES: Record<XAccount, string> = {
  crypto: "rejutoken",
  rejuvenation: "REJUvenationTKN",
};

export type XPublishResult =
  | { posted: false; reason: string; account: XAccount }
  | { posted: true; tweetId: string; url: string; account: XAccount };

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

export function getXClient(account: XAccount = "crypto"): TwitterApi | null {
  const { appKey, appSecret, accessToken, accessSecret } = keysFor(account);

  if (appKey && appSecret && accessToken && accessSecret) {
    return new TwitterApi({
      appKey,
      appSecret,
      accessToken,
      accessSecret,
    });
  }

  // Newer X console: Client ID + Client Secret + user Access Token (OAuth 2.0).
  if (accessToken && !accessSecret) {
    return new TwitterApi(accessToken);
  }

  return null;
}

export async function publishTweet(
  text: string,
  account: XAccount = "crypto"
): Promise<XPublishResult> {
  const body = text.trim();
  if (!body) return { posted: false, reason: "Empty post text.", account };
  if (body.length > 280) {
    return {
      posted: false,
      reason: `Post is ${body.length} characters (max 280).`,
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
          : "X keys are not set. Add either the four OAuth 1.0a keys, or X_ACCESS_TOKEN from Keys and tokens (Read and Write @rejutoken).",
    };
  }

  try {
    const tweet = await client.v2.tweet(body);
    const id = tweet.data.id;
    return {
      posted: true,
      tweetId: id,
      account,
      url: `https://x.com/${handle}/status/${id}`,
    };
  } catch (error: unknown) {
    const err = error as {
      message?: string;
      code?: number;
      data?: { detail?: string; title?: string; errors?: Array<{ message?: string }> };
    };
    const detail =
      err.data?.detail ||
      err.data?.title ||
      err.data?.errors?.[0]?.message ||
      err.message ||
      "X API rejected the post.";
    console.error("X PUBLISH ERROR:", detail);
    return { posted: false, reason: detail, account };
  }
}
