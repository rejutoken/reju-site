import { TwitterApi } from "twitter-api-v2";

export type XPublishResult =
  | { posted: false; reason: string }
  | { posted: true; tweetId: string; url: string };

function env(name: string): string {
  return process.env[name]?.trim() || "";
}

export function getXClient(): TwitterApi | null {
  const appKey = env("X_API_KEY");
  const appSecret = env("X_API_SECRET");
  const accessToken = env("X_ACCESS_TOKEN");
  const accessSecret = env("X_ACCESS_TOKEN_SECRET");

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

export async function publishTweet(text: string): Promise<XPublishResult> {
  const body = text.trim();
  if (!body) return { posted: false, reason: "Empty post text." };
  if (body.length > 280) {
    return { posted: false, reason: `Post is ${body.length} characters (max 280).` };
  }

  const client = getXClient();
  if (!client) {
    return {
      posted: false,
      reason:
        "X keys are not set. Add either the four OAuth 1.0a keys, or X_ACCESS_TOKEN from Keys & tokens (Read and Write @rejutoken).",
    };
  }

  try {
    const tweet = await client.v2.tweet(body);
    const id = tweet.data.id;
    return {
      posted: true,
      tweetId: id,
      url: `https://x.com/rejutoken/status/${id}`,
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
    return { posted: false, reason: detail };
  }
}
