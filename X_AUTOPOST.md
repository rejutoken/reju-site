# X auto-posting engine

One post per day on each account, with a branded image card on every post.

| Account | Content | Card variants |
|---|---|---|
| @REJUvenationTKN | Event bank (`lib/xContentBank.ts`, 51 posts) on a 7-day pillar rotation: fact, story, fact, day in the Event, practice, question, status | page, sunrise, journal, chapter, weeks, petals, cream |
| @REJUTOKEN | Fresh crypto headline (36h max) + one-sentence take + REJU bridge line; non-news days use the token bank (build, Path B, question, Event quote, founder note) | horizon, door, grid, lock, ledger, gold, rays |

## Schedule (vercel.json)

| Cron (UTC) | Route | What it does |
|---|---|---|
| `0 14 * * *` | `/api/x-post/auto` | Posts both accounts. 7 AM PDT, 6 AM PST after Nov 1. |
| `0 16 * * *` | `/api/x-post/health` | Missed-post check: any account without a post in 26h raises an alert. |
| `0 17 * * 1` | `/api/x-post/metrics` | Weekly: reads public_metrics for last week's posts and stores a summary. |

All three require `Authorization: Bearer $CRON_SECRET` (Vercel adds it to cron calls).
`/api/x-post/auto?dry=1` plans and renders without uploading or posting.

## How a post is chosen (`lib/xAutoEngine.ts`)

1. Today's pillar comes from the rotation (day number in Pacific time).
2. Candidates are built for that pillar, then checked by the quality gate (`lib/xQualityGate.ts`).
3. Up to 6 attempts on the primary pillar, then the fallback stream (other pillars, least recently used first). @REJUTOKEN has a last-resort evergreen stream (standalone take + bridge), so a day is never skipped.
4. Every third post per account carries a link (rejutkn.com/program for the Event, rejutkn.com for the token), decided from the log so it is deterministic.
5. "Follow @REJUvenationTKN for the Event." appears on at most 2 token posts in any 7 days, never on a post that already has a link.

Quality gate rejects: "...", "…", square brackets, "ready to paste", "(or their", TODO, double spaces, em and en dashes, Clarity, Rejunomics, Allocation Clarity, Token Intent, month seven, enrollment-open claims, disease or guarantee claims, more than 280 weighted characters, a second post on the same account within 6h, an exact repeat within 45 days, more than 60% word overlap with any post in the last 30 days, and headlines that are cut off, older than 36h, carry a past month or year, or were already used.

## Images (`lib/xCards.tsx`, `lib/xCardVariants.ts`)

Cards are 1600x900 PNGs rendered in the auto route with `next/og` (fonts and the REJU mark live in `assets/`, traced into the function by `next.config.ts`). A variant used in the account's last 3 posts is skipped. The PNG is uploaded with the same X credentials that post (`lib/xPublish.ts`):

* OAuth 1.0a keys (the four `X_*` keys): v2 `/2/media/upload`, falling back to v1.1 `upload.twitter.com`. No new permission needed.
* OAuth 2.0 user token (access token without a secret): needs the `media.write` scope. A 401/403 is logged with a re-authorize message.

If rendering or upload fails, the post goes out text-only and the log records why. `/api/x-card?id=<bank id>` previews any bank card; `?asset=banner|pinned&account=crypto|rejuvenation` renders the profile assets.

## Storage

Everything lives in the existing `x-auto-log.json` (Google Drive, or `.data/` locally): the last 200 posts with pillar, source, headline, link, card variant and media status; failures; weekly metrics; alerts sent.

## Environment variables

Existing and unchanged: `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET`, `X_REJUV_ACCESS_TOKEN`, `X_REJUV_ACCESS_TOKEN_SECRET`, optional `X_REJUV_API_KEY`, `X_REJUV_API_SECRET`, `CRON_SECRET`, `GOOGLE_*`.

Optional, all off by default:

| Variable | Effect |
|---|---|
| `X_MEDIA_UPLOAD=off` | Post text-only (kill switch for images). |
| `X_FOUNDER_NOTES_APPROVED=1` | Allow the two founder-note posts (`requiresApproval` in the bank) once Wilson has approved the wording. |
| `X_HEALTH_RETRY=1` | When the health check finds a missed post, run the poster once for that account. |
| `RESEND_API_KEY`, `X_ALERT_EMAIL_TO`, `X_ALERT_EMAIL_FROM` | Missed-post alerts by email through Resend. |
| `X_ALERT_WEBHOOK_URL` | Missed-post alerts to a Slack or Discord incoming webhook. |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ALERT_CHAT_ID` | Missed-post alerts by Telegram. |

With no alert channel set, alerts go to the Vercel function log and `GET /api/x-post/health` (public summary) shows `ok: false`. At most one alert per 20h.

## Checking changes locally

```
npx tsx scripts/x-simulate.ts --csv path/to/posts.csv --out x_preview/sample_posts.md [--live]
npx tsx scripts/x-render-previews.tsx --out x_preview
```

The simulation runs the real engine for 21 days per account (plus 120-day and zero-news runs) and fails loudly on any rule break. Nothing is posted.
