import { NextRequest, NextResponse } from "next/server";
import { MATERIALS_COOKIE, parseMaterialsSession } from "./lib/materialsAuth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(MATERIALS_COOKIE)?.value;
  const ok = await parseMaterialsSession(token);
  if (ok) return NextResponse.next();

  const login = req.nextUrl.clone();
  login.pathname = "/reju-event-materials";
  login.search = "";
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/materials/:path*"],
};
