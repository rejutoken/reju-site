// Missed-post alerts. The repo has no mail library, so every channel here is plain fetch() and
// switched on by env vars. With none set, alerts go to the Vercel function log and the
// /api/x-post/health JSON (which always shows the status).
//
//   Email (Resend):  RESEND_API_KEY, X_ALERT_EMAIL_TO (comma separated), optional X_ALERT_EMAIL_FROM
//   Webhook:         X_ALERT_WEBHOOK_URL (Slack or Discord incoming webhook, or any JSON endpoint)
//   Telegram:        TELEGRAM_BOT_TOKEN + TELEGRAM_ALERT_CHAT_ID

function env(name: string): string {
  return process.env[name]?.trim() || "";
}

export function alertChannelsConfigured(): string[] {
  const out: string[] = [];
  if (env("RESEND_API_KEY") && env("X_ALERT_EMAIL_TO")) out.push("email");
  if (env("X_ALERT_WEBHOOK_URL")) out.push("webhook");
  if (env("TELEGRAM_BOT_TOKEN") && env("TELEGRAM_ALERT_CHAT_ID")) out.push("telegram");
  return out;
}

async function post(url: string, body: unknown, headers: Record<string, string> = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

/** Send to every configured channel. Returns the channels that accepted the message. */
export async function sendAlert(subject: string, message: string): Promise<{ delivered: string[]; errors: string[] }> {
  console.error(`X ALERT: ${subject}\n${message}`);
  const delivered: string[] = [];
  const errors: string[] = [];

  if (env("RESEND_API_KEY") && env("X_ALERT_EMAIL_TO")) {
    try {
      await post(
        "https://api.resend.com/emails",
        {
          from: env("X_ALERT_EMAIL_FROM") || "REJU X Bot <onboarding@resend.dev>",
          to: env("X_ALERT_EMAIL_TO").split(",").map((s) => s.trim()).filter(Boolean),
          subject,
          text: message,
        },
        { Authorization: `Bearer ${env("RESEND_API_KEY")}` }
      );
      delivered.push("email");
    } catch (error) {
      errors.push(`email: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (env("X_ALERT_WEBHOOK_URL")) {
    try {
      const text = `${subject}\n${message}`;
      await post(env("X_ALERT_WEBHOOK_URL"), { text, content: text.slice(0, 1900) });
      delivered.push("webhook");
    } catch (error) {
      errors.push(`webhook: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (env("TELEGRAM_BOT_TOKEN") && env("TELEGRAM_ALERT_CHAT_ID")) {
    try {
      await post(`https://api.telegram.org/bot${env("TELEGRAM_BOT_TOKEN")}/sendMessage`, {
        chat_id: env("TELEGRAM_ALERT_CHAT_ID"),
        text: `${subject}\n${message}`,
        disable_web_page_preview: true,
      });
      delivered.push("telegram");
    } catch (error) {
      errors.push(`telegram: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return { delivered, errors };
}
