const COOKIE = "reju_materials_session";
const TTL_MS = 24 * 60 * 60 * 1000;

export const MATERIALS_COOKIE = COOKIE;

function secret(): string {
  return process.env.NEXTAUTH_SECRET || process.env.CRON_SECRET || "";
}

function toB64Url(bytes: ArrayBuffer): string {
  let bin = "";
  const arr = new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i += 1) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toB64Url(sig);
}

export async function signMaterialsSession(): Promise<string> {
  const exp = Date.now() + TTL_MS;
  const payload = `materials:${exp}`;
  const sig = await hmac(payload);
  return `${payload}:${sig}`;
}

export async function parseMaterialsSession(token?: string | null): Promise<boolean> {
  if (!token || !secret()) return false;
  const parts = token.split(":");
  if (parts.length !== 3) return false;
  const [kind, expStr, sig] = parts;
  if (kind !== "materials") return false;
  const exp = Number(expStr);
  if (!exp || Date.now() > exp) return false;
  const expected = await hmac(`${kind}:${expStr}`);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

export function materialsCookieOptions(maxAgeSec = TTL_MS / 1000) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSec,
  };
}
