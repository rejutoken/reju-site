import { NextResponse } from "next/server";
import { verifyPassword } from "../../../lib/rejuConfig";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { type, password } = await req.json();

    if (!type || !password) {
      return NextResponse.json({ ok: false, error: "Missing type or password" }, { status: 400 });
    }

    if (type !== "registration" && type !== "book" && type !== "admin") {
      return NextResponse.json({ ok: false, error: "Invalid type" }, { status: 400 });
    }

    const ok = await verifyPassword(type as any, password);
    return NextResponse.json({ ok });
  } catch (error) {
    console.error("VERIFY PASSWORD ERROR:", error);
    return NextResponse.json({ ok: false, error: "Verification failed" }, { status: 500 });
  }
}
