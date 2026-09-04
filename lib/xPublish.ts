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

  if (!appKey || !appSecret || !accessToken || !accessSecret) {
    return null;
  }

  return new TwitterApi({
    appKey,
    appSecret,
    accessToken,
    accessSecret,
  });
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
        "X API keys are not set. Add X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, and X_ACCESS_TOKEN_SECRET on Vercel.",
    };
  }

  const tweet = await client.v2.tweet(body);
  const id = tweet.data.id;
  return {
    posted: true,
    tweetId: id,
    url: `https://x.com/rejutoken/status/${id}`,
  };
}
