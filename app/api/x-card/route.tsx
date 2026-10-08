import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import {
  BANNER_HEIGHT,
  BANNER_WIDTH,
  buildBannerElement,
  buildPinnedElement,
  cardImageResponse,
  loadCardFonts,
  signCardParams,
} from "../../../lib/xCards";
import { CARD_HEIGHT, CARD_WIDTH, variantsFor, type CardSpec, type CardVariant } from "../../../lib/xCardVariants";
import { EVENT_BANK, TOKEN_BANK, TOKEN_BRIDGES } from "../../../lib/xContentBank";
import { getXPostSession } from "../../../lib/xPostAuth";

export const runtime = "nodejs";

function pickVariant(account: CardSpec["account"], requested: string | null): CardVariant {
  const all = variantsFor(account);
  return (all as readonly string[]).includes(requested || "") ? (requested as CardVariant) : all[0];
}

/**
 * Preview a branded X card (the auto route renders the same cards in-process).
 *  /api/x-card?id=ev-fact-soda&variant=chapter     approved bank post, public
 *  /api/x-card?id=br-seasons&variant=door          approved token bridge line, public
 *  /api/x-card?asset=banner&account=crypto         profile header 1500x500, public
 *  /api/x-card?asset=pinned&account=rejuvenation   pinned-post image, public
 *  /api/x-card?account=crypto&line=..&kicker=..    custom text: X Post session or ?sig= required
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const account: CardSpec["account"] = q.get("account") === "rejuvenation" ? "rejuvenation" : "crypto";

  const asset = q.get("asset");
  if (asset === "banner" || asset === "pinned") {
    const element = asset === "banner" ? buildBannerElement(account) : buildPinnedElement(account);
    return new ImageResponse(element, {
      width: asset === "banner" ? BANNER_WIDTH : CARD_WIDTH,
      height: asset === "banner" ? BANNER_HEIGHT : CARD_HEIGHT,
      fonts: loadCardFonts(),
    });
  }

  const id = q.get("id");
  if (id) {
    const post = [...EVENT_BANK, ...TOKEN_BANK].find((p) => p.id === id);
    const bridge = TOKEN_BRIDGES.find((b) => b.id === id);
    if (!post && !bridge) return NextResponse.json({ error: "Unknown id" }, { status: 404 });
    const cardAccount: CardSpec["account"] = post && EVENT_BANK.includes(post as (typeof EVENT_BANK)[number]) ? "rejuvenation" : "crypto";
    const spec: CardSpec = post
      ? { account: cardAccount, variant: pickVariant(cardAccount, q.get("variant")), line: post.cardLine, kicker: post.cardKicker, badge: post.cardBadge }
      : { account: "crypto", variant: pickVariant("crypto", q.get("variant")), line: bridge!.cardLine, kicker: "REJU · Launching soon" };
    return cardImageResponse(spec);
  }

  const line = (q.get("line") || "").trim().slice(0, 120);
  const kicker = (q.get("kicker") || "").trim().slice(0, 40);
  const badge = (q.get("badge") || "").trim().slice(0, 4);
  const variant = pickVariant(account, q.get("variant"));
  if (!line) return NextResponse.json({ error: "Pass id=, asset=, or line=" }, { status: 400 });

  const sig = q.get("sig");
  const signed = Boolean(process.env.CRON_SECRET) && sig === signCardParams([account, variant, line, kicker, badge]);
  const session = signed ? null : await getXPostSession().catch(() => null);
  if (!signed && !session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return cardImageResponse({ account, variant, line, kicker, badge: badge || undefined });
}
