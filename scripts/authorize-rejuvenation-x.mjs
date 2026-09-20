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

function clean(value) {
  return String(value || "")
    .replace(/^\uFEFF/, "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/[•·●◦*]/g, "")
    .replace(/\s+/g, "");
}

function extractPin(raw) {
  const text = String(raw || "").trim();
  const fromUrl = text.match(/oauth_verifier=([^&]+)/i);
  if (fromUrl) return decodeURIComponent(fromUrl[1]);
  return text.replace(/\s+/g, "");
}

async function ask(label) {
  const value = (await rl.question(label)).trim();
  return value;
}

async function main() {
  let appKey = clean(process.env.X_API_KEY);
  let appSecret = clean(process.env.X_API_SECRET);

  if (!appKey || !appSecret) {
    console.log("API Key and Secret were not found in .env.local.");
    console.log("Use the SAME app keys already posting as @rejutoken. Do not generate a new app.");
    console.log("API Key is the Consumer Key, usually about 25 characters.");
    console.log("Do not paste Access Token (that one often starts with numbers then a dash).");
    appKey = clean(await ask("X API Key (consumer key): "));
    appSecret = clean(await ask("X API Secret (consumer secret): "));
  } else {
    console.log("Using X_API_KEY and X_API_SECRET from .env.local (same app as @rejutoken).");
  }

  if (!appKey || !appSecret) {
    throw new Error("API Key and Secret are required.");
  }
  if (appKey.length < 15 || appKey.length > 60) {
    throw new Error(
      `API Key length looks wrong (${appKey.length} chars). Copy the full Consumer Key from Keys and tokens, not a hidden/dotted value.`
    );
  }
  if (appSecret.length < 30) {
    throw new Error(
      `API Secret length looks wrong (${appSecret.length} chars). Copy API Key Secret, not Access Token.`
    );
  }

  const app = new TwitterApi({ appKey, appSecret });
  const callbacks = ["oob", "https://rejutkn.com", "https://rejutkn.com/", "https://www.rejutkn.com"];
  let authLink;
  let lastError = "";
  for (const callback of callbacks) {
    try {
      authLink = await app.generateAuthLink(callback, {
        authAccessType: "write",
        linkMode: "authorize",
        forceLogin: true,
      });
      console.log(`Keys accepted. Callback mode: ${callback}`);
      break;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  if (!authLink) {
    throw new Error(
      `X rejected the keys or the callback (${lastError}). Use API Key and API Key Secret from Keys and tokens, not Client ID, not Access Token.`
    );
  }

  console.log("");
  console.log("Leave this window open. Open the URL below NOW as @REJUvenationTKN.");
  console.log("Click Allow. Type the PIN here within one minute.");
  console.log("");
  console.log(authLink.url);
  console.log("");
  const pin = extractPin(await ask("PIN (numbers only): "));
  if (!pin) {
    throw new Error("No PIN entered.");
  }

  const loginClient = new TwitterApi({
    appKey,
    appSecret,
    accessToken: authLink.oauth_token,
    accessSecret: authLink.oauth_token_secret,
  });
  let result;
  try {
    result = await loginClient.login(pin);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `X rejected the PIN (${detail}). Run the script again and open the NEW url within a minute. Use only the PIN or the oauth_verifier value.`
    );
  }
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
