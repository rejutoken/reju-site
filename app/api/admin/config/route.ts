import { NextResponse } from "next/server";
import {
  getRejuConfig,
  toPublicAdminConfig,
  updateRejuConfig,
  verifyPassword,
} from "../../../../lib/rejuConfig";
import { clientIp, rateLimit } from "../../../../lib/rateLimit";
import { publicErrorMessage } from "../../../../lib/safeError";

export const runtime = "nodejs";

function adminHeader(req: Request) {
  return req.headers.get("x-reju-admin")?.trim() || "";
}

export async function GET(req: Request) {
  try {
    const ip = clientIp(req);
    if (!rateLimit(`admin-get:${ip}`, 30, 15 * 60 * 1000)) {
      return NextResponse.json({ success: false, error: "Too many attempts." }, { status: 429 });
    }

    const adminPassword = adminHeader(req);
    if (!adminPassword || !(await verifyPassword("admin", adminPassword))) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const config = await getRejuConfig();
    return NextResponse.json({
      success: true,
      config: toPublicAdminConfig(config),
    });
  } catch (error) {
    console.error("ADMIN CONFIG GET ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to load config" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    if (!rateLimit(`admin-post:${ip}`, 20, 15 * 60 * 1000)) {
      return NextResponse.json({ success: false, error: "Too many attempts." }, { status: 429 });
    }

    const body = await req.json();
    const {
      adminPassword,
      newAdminPassword,
      registrationPassword,
      bookPassword,
      xPostPassword,
      currentCohort,
      active,
    } = body || {};

    const offered = String(adminPassword || adminHeader(req) || "").trim();
    if (!offered) {
      return NextResponse.json({ success: false, error: "Admin password required" }, { status: 400 });
    }

    const isAdmin = await verifyPassword("admin", offered);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: "Invalid admin password" }, { status: 401 });
    }

    const updates: Record<string, string | boolean> = {};
    if (typeof registrationPassword === "string" && registrationPassword.trim()) {
      updates.registrationPassword = registrationPassword.trim();
    }
    if (typeof bookPassword === "string" && bookPassword.trim()) {
      updates.bookPassword = bookPassword.trim();
    }
    if (typeof xPostPassword === "string" && xPostPassword.trim()) {
      updates.xPostPassword = xPostPassword.trim();
    }
    if (typeof newAdminPassword === "string" && newAdminPassword.trim()) {
      if (newAdminPassword.trim().length < 10) {
        return NextResponse.json(
          { success: false, error: "New admin password must be at least 10 characters." },
          { status: 400 }
        );
      }
      updates.adminPassword = newAdminPassword.trim();
    }
    if (typeof currentCohort === "string") {
      updates.currentCohort = currentCohort.trim();
    }
    if (typeof active === "boolean") {
      updates.active = active;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: false, error: "No valid updates provided" }, { status: 400 });
    }

    const updated = await updateRejuConfig(updates);

    return NextResponse.json({
      success: true,
      config: toPublicAdminConfig(updated),
    });
  } catch (error) {
    console.error("ADMIN CONFIG UPDATE ERROR:", error);
    return NextResponse.json(
      { success: false, error: publicErrorMessage(error, "Update failed") },
      { status: 500 }
    );
  }
}
