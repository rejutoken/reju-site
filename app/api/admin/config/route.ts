import { NextResponse } from "next/server";
import { getRejuConfig, updateRejuConfig, verifyPassword } from "../../../../lib/rejuConfig";

export const runtime = "nodejs";

export async function GET() {
  try {
    const config = await getRejuConfig();
    // Return safe view for admin UI (do not hide, admin unlocks with pw first)
    return NextResponse.json({
      success: true,
      config: {
        registrationPassword: config.registrationPassword,
        bookPassword: config.bookPassword,
        adminPassword: config.adminPassword,
        currentCohort: config.currentCohort,
        active: config.active,
      },
    });
  } catch (error: any) {
    console.error("ADMIN CONFIG GET ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to load config" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { adminPassword, registrationPassword, bookPassword, currentCohort, active } = body || {};

    if (!adminPassword) {
      return NextResponse.json({ success: false, error: "Admin password required" }, { status: 400 });
    }

    const isAdmin = await verifyPassword("admin", adminPassword);
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: "Invalid admin password" }, { status: 401 });
    }

    const updates: any = {};
    if (typeof registrationPassword === "string" && registrationPassword.trim()) {
      updates.registrationPassword = registrationPassword.trim();
    }
    if (typeof bookPassword === "string" && bookPassword.trim()) {
      updates.bookPassword = bookPassword.trim();
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
      config: {
        registrationPassword: updated.registrationPassword,
        bookPassword: updated.bookPassword,
        currentCohort: updated.currentCohort,
        active: updated.active,
        // do not echo admin pw back
      },
    });
  } catch (error: any) {
    console.error("ADMIN CONFIG UPDATE ERROR:", error);
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}
