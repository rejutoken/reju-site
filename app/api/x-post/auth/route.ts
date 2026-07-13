import { NextRequest, NextResponse } from "next/server";
import {
  getXPostSession,
  signXPostSession,
  verifyXPostPassword,
  XPOST_SESSION_COOKIE,
  xPostSessionCookieOptions,
} from "../../../../lib/xPostAuth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getXPostSession();
    if (!session) {
      return NextResponse.json({ authenticated: false });
    }
    return NextResponse.json({
      authenticated: true,
      role: session.role,
    });
  } catch (error) {
    console.error("X-POST AUTH GET ERROR:", error);
    return NextResponse.json({ authenticated: false, error: "Session check failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const password = typeof body.password === "string" ? body.password.trim() : "";

    if (!password) {
      return NextResponse.json({ success: false, error: "Password required" }, { status: 400 });
    }

    const role = await verifyXPostPassword(password);
    if (!role) {
      return NextResponse.json(
        { success: false, error: "Invalid password or collaborator access not configured." },
        { status: 401 }
      );
    }

    const token = signXPostSession(role);
    const res = NextResponse.json({ success: true, role });
    res.cookies.set(XPOST_SESSION_COOKIE, token, xPostSessionCookieOptions());
    return res;
  } catch (error) {
    console.error("X-POST AUTH POST ERROR:", error);
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(XPOST_SESSION_COOKIE, "", { ...xPostSessionCookieOptions(0), maxAge: 0 });
  return res;
}