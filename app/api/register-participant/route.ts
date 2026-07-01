import { google } from "googleapis";
import { NextResponse } from "next/server";
import { verifyPassword, getRejuConfig } from "../../../lib/rejuConfig";

export const runtime = "nodejs";

function value(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function createParticipantId() {
  const now = new Date();
  const stamp = now
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);

  const random = Math.floor(1000 + Math.random() * 9000);

  return `REJU-${stamp}-${random}`;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const firstName = value(formData, "firstName");
    const lastName = value(formData, "lastName");
    const email = value(formData, "email");
    const phone = value(formData, "phone");
    const telegram = value(formData, "telegram");
    const address1 = value(formData, "address1");
    const address2 = value(formData, "address2");
    const city = value(formData, "city");
    const stateProvince = value(formData, "stateProvince");
    const zipPostalCode = value(formData, "zipPostalCode");
    const country = value(formData, "country");
    const accessPassword = value(formData, "accessPassword");

    if (!firstName || !lastName || !email || !city || !stateProvince || !country) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    // Enforce registration password gate (paid participants only)
    const config = await getRejuConfig();
    if (config.active) {
      if (!accessPassword) {
        return NextResponse.json(
          { error: "Registration access password is required. Please enter the event password provided to paid participants." },
          { status: 403 }
        );
      }
      const ok = await verifyPassword("registration", accessPassword);
      if (!ok) {
        return NextResponse.json(
          { error: "Invalid registration access password. Access is restricted to verified paid participants." },
          { status: 403 }
        );
      }
    }

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const spreadsheetId =
      process.env.GOOGLE_SHEETS_PARTICIPANT_REGISTRY_ID?.trim();

    if (!clientEmail || !privateKey || !spreadsheetId) {
      return NextResponse.json(
        { error: "Google Sheets configuration is missing." },
        { status: 500 }
      );
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
      ],
    });

    await auth.authorize();

    const sheets = google.sheets({ version: "v4", auth });

    const participantId = createParticipantId();
    const registrationDate = new Date().toISOString();

    const row = [
      registrationDate,
      participantId,
      firstName,
      lastName,
      email,
      phone,
      telegram,
      address1,
      address2,
      city,
      stateProvince,
      zipPostalCode,
      country,
      `Pending • ${config.currentCohort}`,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "'Participants'!A:N",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });

    return NextResponse.json({
      success: true,
      participantId,
    });
  } catch (error: any) {
    console.error("PARTICIPANT REGISTRATION ERROR:", error);

    const message =
      error?.response?.data?.error?.message ||
      error?.message ||
      "Registration failed.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}