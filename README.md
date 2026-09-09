# REJU website

Next.js site for rejutkn.com — public marketing, Event enrollment, daily book authoring, and hidden operator tools.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Environment variables live in `.env.local` (never commit this file). Production values live in Vercel.

## Operator map

Enrollment path: `/program` → `/onboarding` → Square / Streamflow → `/participant-registration` → `/reju-event-materials` → `/daily-transformation-log`.

Hidden controls:

- `/admin` — passwords, cohort name, global on/off
- `/admin/generate-book` — compile a participant Transformation Book (admin password required)
- `/x-post` — X Post Studio (admin or collaborator password)

Proof uploads: `/uploadbookadmin` ($69), `/uploadfiatpay` ($600), `/uploadrejulock` (Streamflow), `/uploadcrp` (CRP).

## Storage

- `GOOGLE_DRIVE_JSONFILES` — `reju-config.json` (passwords) and `blog-engagement.json` (blog likes/comments)
- `GOOGLE_DRIVE_UPLOADBOOKADMIN` — compiled books and $69 receipts only
- Other Drive folders — lock proofs, fiat receipts, CRP receipts, daily journal PDFs
- Google Sheet — participant registry

After each Event: rotate registration and book passwords in `/admin` and share the new values only with paid participants. Change the admin password from `/admin` after first access. Do not print passwords on the public site, in README, or in Telegram.

## Deploy

Push to `main` (GitHub → Vercel) or run `vercel --prod` when logged in.

Enrollment payments are gated by `enrollmentOpen` in `lib/siteNews.ts`. Set that to `true` when Wilson is ready to accept Square / Streamflow payments.

`www.rejutkn.com` must use a valid Vercel certificate. In Vercel: Project → Settings → Domains → `www.rejutkn.com` → Refresh. The apex `rejutkn.com` certificate is separate.

## Automatic X posts

`vercel.json` runs `GET /api/x-post/auto` twice daily: 14:00 UTC (morning pair, 7am PT / 10am ET) and 22:00 UTC (afternoon pair, 3pm PT / 6pm ET). Each run publishes two related posts: crypto to `@rejutoken`, rejuvenation to `@REJUvenationTKN`. Wednesday and Friday crypto posts are Rejunomics (Allocation Clarity and Token Intent) with `rejutkn.com/rejunomics`. Wednesday and Friday rejuvenation posts include `rejutkn.com/program`. Other days have no URL. Vercel sends `Authorization: Bearer $CRON_SECRET`. Set these on Vercel (Production):

- `CRON_SECRET` — same value as local `.env.local`
- Crypto `@rejutoken`: `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET` (OAuth 1.0a), or `X_ACCESS_TOKEN` alone for OAuth 2.0
- Rejuvenation `@REJUvenationTKN`: `X_REJUV_ACCESS_TOKEN` and `X_REJUV_ACCESS_TOKEN_SECRET`. Optional `X_REJUV_API_KEY` / `X_REJUV_API_SECRET` if that account uses a different app; otherwise the crypto app key and secret are reused.

Without the X keys, the cron still generates a draft but does not publish. Opening the URL in a browser returns 401; that is expected.
