import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyPassword } from "../../../lib/rejuConfig";
import {
  MATERIALS_COOKIE,
  materialsCookieOptions,
  parseMaterialsSession,
  signMaterialsSession,
} from "../../../lib/materialsAuth";
import { clientIp, rateLimit } from "../../../lib/rateLimit";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(MATERIALS_COOKIE)?.value;
  const authenticated = await parseMaterialsSession(token);
  return NextResponse.json({ authenticated });
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`materials-auth:${ip}`, 12, 15 * 60 * 1000)) {
    return NextResponse.json({ ok: false, error: "Too many attempts." }, { status: 429 });
  }

  try {
    const body = await req.json();
    const password = String(body.password || "").trim();
    if (!password) {
      return NextResponse.json({ ok: false, error: "Password required." }, { status: 400 });
    }

    const ok = await verifyPassword("registration", password);
    if (!ok) {
      return NextResponse.json(
        { ok: false, error: "Incorrect password or access is closed." },
        { status: 401 }
      );
    }

    const token = await signMaterialsSession();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(MATERIALS_COOKIE, token, materialsCookieOptions());
    return res;
  } catch (error) {
    console.error("MATERIALS AUTH ERROR:", error);
    return NextResponse.json({ ok: false, error: "Verification failed." }, { status: 500 });
  }
}
