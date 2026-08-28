import { NextResponse } from "next/server";
import { verifyPassword } from "../../../lib/rejuConfig";
import { clientIp, rateLimit } from "../../../lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    if (!rateLimit(`verify:${ip}`, 12, 15 * 60 * 1000)) {
      return NextResponse.json({ ok: false, error: "Too many attempts. Please wait." }, { status: 429 });
    }

    const { type, password } = await req.json();

    if (!type || !password) {
      return NextResponse.json({ ok: false, error: "Missing type or password" }, { status: 400 });
    }

    if (type !== "registration" && type !== "book" && type !== "admin" && type !== "xpost") {
      return NextResponse.json({ ok: false, error: "Invalid type" }, { status: 400 });
    }

    const ok = await verifyPassword(type, String(password));
    return NextResponse.json({ ok });
  } catch (error) {
    console.error("VERIFY PASSWORD ERROR:", error);
    return NextResponse.json({ ok: false, error: "Verification failed" }, { status: 500 });
  }
}
