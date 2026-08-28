import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { verifyPassword } from "./rejuConfig";

export type XPostRole = "admin" | "collaborator";

export const XPOST_SESSION_COOKIE = "reju_xpost_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function sessionSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET || process.env.CRON_SECRET;
  if (!secret) {
    throw new Error("Missing NEXTAUTH_SECRET or CRON_SECRET for X Post sessions.");
  }
  return secret;
}

export function signXPostSession(role: XPostRole): string {
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = `${role}:${exp}`;
  const sig = crypto.createHmac("sha256", sessionSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function parseXPostSession(token: string): { role: XPostRole } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return null;

    const [role, expStr, sig] = parts;
    if (role !== "admin" && role !== "collaborator") return null;

    const exp = Number(expStr);
    if (!exp || Date.now() > exp) return null;

    const payload = `${role}:${exp}`;
    const expected = crypto.createHmac("sha256", sessionSecret()).update(payload).digest("hex");
    if (sig !== expected) return null;

    return { role };
  } catch {
    return null;
  }
}

export async function getXPostSession(): Promise<{ role: XPostRole } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(XPOST_SESSION_COOKIE)?.value;
  if (!token) return null;
  return parseXPostSession(token);
}

export async function verifyXPostPassword(password: string): Promise<XPostRole | null> {
  const offered = String(password || "").trim();
  if (!offered) return null;
  if (await verifyPassword("admin", offered)) return "admin";
  if (await verifyPassword("xpost", offered)) return "collaborator";
  return null;
}

export function xPostSessionCookieOptions(maxAgeSec = SESSION_TTL_MS / 1000) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSec,
  };
}

export async function requireXPostSession(): Promise<{ role: XPostRole } | NextResponse> {
  const session = await getXPostSession();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized — X Post login required." },
      { status: 401 }
    );
  }
  return session;
}