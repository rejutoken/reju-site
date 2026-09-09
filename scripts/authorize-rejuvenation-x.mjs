import { createInterface } from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { TwitterApi } from "twitter-api-v2";

function loadEnvLocal() {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf-8").split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (!m) continue;
    const key = m[1].trim();
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val.replace(/\\n/g, "\n");
  }
}

loadEnvLocal();

const rl = createInterface({ input, output });

async function ask(label) {
  const value = (await rl.question(label)).trim();
  return value;
}

async function main() {
  let appKey = (process.env.X_API_KEY || "").trim();
  let appSecret = (process.env.X_API_SECRET || "").trim();

  if (!appKey || !appSecret) {
    console.log("API Key and Secret were not found in .env.local.");
    console.log("Use the SAME app keys already posting as @rejutoken. Do not generate a new app.");
    appKey = await ask("X API Key (consumer key): ");
    appSecret = await ask("X API Secret (consumer secret): ");
  } else {
    console.log("Using X_API_KEY and X_API_SECRET from .env.local (same app as @rejutoken).");
  }

  if (!appKey || !appSecret) {
    throw new Error("API Key and Secret are required.");
  }

  const app = new TwitterApi({ appKey, appSecret });
  const authLink = await app.generateAuthLink("oob", {
    authAccessType: "write",
    linkMode: "authenticate",
  });

  console.log("");
  console.log("1. Open a private/incognito window.");
  console.log("2. Log in to X as @REJUvenationTKN (not @rejutoken).");
  console.log("3. Open this URL:");
  console.log("");
  console.log(authLink.url);
  console.log("");
  console.log("4. Click Authorize app. X will show a PIN.");
  const pin = await ask("Paste the PIN here: ");

  const loginClient = new TwitterApi({
    appKey,
    appSecret,
    accessToken: authLink.oauth_token,
    accessSecret: authLink.oauth_token_secret,
  });
  const result = await loginClient.login(pin);
  const screenName = result.screenName || "";

  console.log("");
  console.log(`Authorized as @${screenName}`);
  if (screenName.toLowerCase() !== "rejuvenationtkn") {
    console.log("That is not @REJUvenationTKN. Log out, log in as the rejuvenation account, and run this again.");
    process.exit(1);
  }

  console.log("");
  console.log("Add these two values in Vercel → Project → Settings → Environment Variables → Production:");
  console.log("");
  console.log("X_REJUV_ACCESS_TOKEN");
  console.log(result.accessToken);
  console.log("");
  console.log("X_REJUV_ACCESS_TOKEN_SECRET");
  console.log(result.accessSecret);
  console.log("");
  console.log("Do not change X_API_KEY, X_API_SECRET, or the existing @rejutoken access tokens.");
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(() => rl.close());
