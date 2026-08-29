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
