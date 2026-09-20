// Live internet research for X post generation — news, studies, and trends.

export interface ResearchNote {
  id: string;
  text: string;
  source: string;
  url?: string;
  publishedAt?: string;
}

export interface WebResearchResult {
  notes: ResearchNote[];
  queryUsed: string;
  sourcesUsed: string[];
  fetchedAt: string;
}

interface RssItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  source: string;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(text: string): string {
  return decodeEntities(
    text
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .replace(/<a[^>]*>/gi, " ")
      .replace(/<\/a>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function truncate(text: string, max: number): string {
  const clean = text.trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 3);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim() + "...";
}

function decodeXmlEntities(text: string): string {
  return decodeEntities(text);
}

function cleanArticleUrl(url: string): string {
  try {
    const parsed = new URL(url);
    for (const key of [...parsed.searchParams.keys()]) {
      if (key.toLowerCase().startsWith("utm_") || key.toLowerCase() === "fbclid") {
        parsed.searchParams.delete(key);
      }
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

function extractTag(block: string, tag: string): string {
  const cdata = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, "i");
  const cdataMatch = block.match(cdata);
  if (cdataMatch?.[1]) return decodeXmlEntities(cdataMatch[1].trim());

  const plain = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const plainMatch = block.match(plain);
  return plainMatch?.[1] ? decodeXmlEntities(stripHtml(plainMatch[1])) : "";
}

function extractLink(block: string): string {
  const orig = block.match(/<(?:feedburner:)?origLink[^>]*>(https?:\/\/[^<]+)</i);
  if (orig?.[1]) return cleanArticleUrl(orig[1].trim());
  const href = block.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i);
  if (href?.[1] && /^https?:\/\//i.test(href[1])) return cleanArticleUrl(href[1].trim());
  const tagged = block.match(/<link[^>]*>\s*(https?:\/\/[^<\s]+)\s*<\/link>/i);
  if (tagged?.[1]) return cleanArticleUrl(tagged[1].trim());
  const guid = block.match(/<guid[^>]*>\s*(https?:\/\/[^<\s]+)\s*<\/guid>/i);
  if (guid?.[1]) return cleanArticleUrl(guid[1].trim());
  return "";
}

function parseRssFeed(xml: string, feedSource: string, limit: number): RssItem[] {
  const items: RssItem[] = [];
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  const entryBlocks = xml.match(/<entry[\s\S]*?<\/entry>/gi) ?? [];
  const blocks = itemBlocks.length > 0 ? itemBlocks : entryBlocks;

  for (const block of blocks.slice(0, limit * 3)) {
    const title = extractTag(block, "title");
    if (!title) continue;

    items.push({
      title,
      description: extractTag(block, "description") || extractTag(block, "summary") || extractTag(block, "content"),
      link: extractLink(block),
      pubDate: extractTag(block, "pubDate") || extractTag(block, "updated") || extractTag(block, "published"),
      source: feedSource,
    });
    if (items.length >= limit) break;
  }

  return items;
}

function queryKeywords(query: string): string[] {
  const stop = new Set([
    "the", "and", "for", "with", "from", "that", "this", "news", "today", "latest", "about", "crypto", "cryptocurrency",
  ]);
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !stop.has(w));
}

function matchesQuery(text: string, query: string): boolean {
  const keywords = queryKeywords(query);
  if (keywords.length === 0) return true;
  const haystack = text.toLowerCase();
  const hits = keywords.filter((k) => haystack.includes(k)).length;
  return hits >= Math.min(2, keywords.length) || (keywords.length === 1 && hits === 1);
}

function rssToNotes(items: RssItem[], prefix: string): ResearchNote[] {
  return items.map((item, i) => {
    const cleanTitle = stripHtml(item.title).replace(/\s+-\s+[^-]+$/, "").trim();
    const cleanDesc = stripHtml(item.description);
    const snippet = cleanDesc && !cleanDesc.startsWith(cleanTitle) ? `: ${truncate(cleanDesc, 140)}` : "";
    return {
      id: `${prefix}-${i}`,
      text: truncate(`${cleanTitle}${snippet}`, 280),
      source: item.source,
      url: item.link || undefined,
      publishedAt: item.pubDate || undefined,
    };
  });
}

async function fetchRss(url: string, sourceLabel: string): Promise<RssItem[]> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "REJU-XPost-Research/1.0" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRssFeed(xml, sourceLabel, 12);
  } catch {
    return [];
  }
}

async function fetchGoogleNews(query: string, limit = 8): Promise<ResearchNote[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
  const items = sortNewest(await fetchRss(url, "Google News"));
  return rssToNotes(items.slice(0, limit), "gnews");
}

const CRYPTO_RSS_FEEDS = [
  { url: "https://www.coindesk.com/arc/outboundfeeds/rss", label: "CoinDesk" },
  { url: "https://cointelegraph.com/rss", label: "Cointelegraph" },
  { url: "https://decrypt.co/feed", label: "Decrypt" },
  { url: "https://www.theblock.co/rss.xml", label: "The Block" },
  { url: "https://bitcoinmagazine.com/feed", label: "Bitcoin Magazine" },
  { url: "https://blockworks.com/feed", label: "Blockworks" },
  { url: "https://cryptoslate.com/feed", label: "CryptoSlate" },
  { url: "https://news.bitcoin.com/feed/", label: "Bitcoin.com" },
];

const CRYPTO_THEME_FILTERS: Record<string, RegExp> = {
  bitcoin_news: /\b(bitcoin|btc)\b/i,
  crypto_policy:
    /\b(sec|cftc|congress|senate|regulat|lawmaker|legislation|bill\b|government|policy|fed\b|treasury|mica|ban|license|court|white house|parliament|ofac|irs|esma|fca|mas\b)\b/i,
  crypto_international:
    /\b(eu\b|europe|european|uk\b|britain|england|japan|china|hong kong|india|brazil|salvador|uae|dubai|australia|canada|mica|international|global|korea|singapore|nigeria|argentina|switzerland|france|germany)\b/i,
};

function itemMatchesTheme(item: RssItem, theme: string): boolean {
  const filter = CRYPTO_THEME_FILTERS[theme];
  if (!filter) return true;
  return filter.test(`${item.title} ${item.description} ${item.source}`);
}

function publishedAtMs(value: string | undefined): number {
  if (!value) return 0;
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? 0 : ms;
}

function sortNewest(items: RssItem[]): RssItem[] {
  return [...items].sort((a, b) => publishedAtMs(b.pubDate) - publishedAtMs(a.pubDate));
}

async function fetchCryptoRssNews(query: string, theme = "", limit = 8): Promise<ResearchNote[]> {
  const batches = await Promise.all(CRYPTO_RSS_FEEDS.map((f) => fetchRss(f.url, f.label)));
  const merged = sortNewest(batches.flat());
  const themed = theme ? merged.filter((item) => itemMatchesTheme(item, theme)) : merged;
  const queried = merged.filter((item) => matchesQuery(`${item.title} ${item.description}`, query));
  const picked = (themed.length > 0 ? themed : queried.length > 0 ? queried : merged).slice(0, limit);
  return rssToNotes(picked, "crypto-rss");
}

interface PubMedSummary {
  uid: string;
  title?: string;
  source?: string;
  pubdate?: string;
  authors?: Array<{ name: string }>;
}

async function fetchPubMedStudies(query: string, limit = 5): Promise<ResearchNote[]> {
  const notes: ResearchNote[] = [];
  try {
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${limit}&retmode=json&sort=relevance`;
    const searchRes = await fetch(searchUrl, { cache: "no-store" });
    if (!searchRes.ok) return notes;

    const searchData = await searchRes.json();
    const ids: string[] = searchData?.esearchresult?.idlist ?? [];
    if (ids.length === 0) return notes;

    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(",")}&retmode=json`;
    const summaryRes = await fetch(summaryUrl, { cache: "no-store" });
    if (!summaryRes.ok) return notes;

    const summaryData = await summaryRes.json();
    const result = summaryData?.result ?? {};

    ids.forEach((id, i) => {
      const article = result[id] as PubMedSummary | undefined;
      if (!article?.title) return;
      const journal = article.source ? ` (${article.source})` : "";
      const date = article.pubdate ? ` — ${article.pubdate}` : "";
      notes.push({
        id: `pubmed-${i}`,
        text: truncate(`${article.title}${journal}${date}`, 280),
        source: "PubMed",
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        publishedAt: article.pubdate,
      });
    });
  } catch {
    // Non-fatal
  }
  return notes;
}

interface CoinGeckoTrending {
  coins: Array<{ item: { name: string; symbol: string; market_cap_rank?: number } }>;
}

async function fetchCryptoTrending(): Promise<ResearchNote[]> {
  const notes: ResearchNote[] = [];
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/search/trending", { cache: "no-store" });
    if (!res.ok) return notes;

    const data = (await res.json()) as CoinGeckoTrending;
    const coins = data.coins?.slice(0, 6) ?? [];
    if (coins.length > 0) {
      const names = coins.map((c) => `${c.item.name} (${c.item.symbol})`).join(", ");
      notes.push({
        id: "trending-overview",
        text: `Live trending on CoinGecko right now: ${names}.`,
        source: "CoinGecko Trending (live)",
      });
    }
    coins.slice(0, 4).forEach((c, i) => {
      notes.push({
        id: `trending-${i}`,
        text: `${c.item.name} (${c.item.symbol}) is trending${c.item.market_cap_rank ? ` at market cap rank #${c.item.market_cap_rank}` : ""}.`,
        source: "CoinGecko Trending (live)",
      });
    });
  } catch {
    // Non-fatal
  }
  return notes;
}

const THEME_QUERIES: Record<string, string> = {
  bitcoin_news: "Bitcoin news when:2d",
  crypto_news: "(Bitcoin OR Ethereum OR cryptocurrency) news when:1d",
  crypto_news_today: "(Bitcoin OR Ethereum OR cryptocurrency) news when:1d",
  crypto_policy:
    "(cryptocurrency OR bitcoin OR crypto) (SEC OR CFTC OR Congress OR regulation OR Senate OR Treasury OR Fed OR government) when:7d",
  crypto_international:
    "(cryptocurrency OR bitcoin) (EU OR MiCA OR UK OR Japan OR China OR India OR Brazil OR UAE OR Canada OR Australia OR Singapore) when:7d",
  crypto_trends: "Bitcoin cryptocurrency market news when:2d",
  rejunomics: "cryptocurrency tokenomics transparency token release",
  industry: "cryptocurrency regulation government policy news",
  crypto: "cryptocurrency Bitcoin Ethereum news when:1d",
  token_utility: "Bitcoin cryptocurrency news when:1d",
  health: "autophagy fasting longevity study",
  ketosis: "ketosis metabolic health fasting study",
  cellular_repair: "cellular repair autophagy aging research",
  immunity: "fasting immune system inflammation study",
  lymphatic: "lymphatic system detox health research",
  event: "fasting rejuvenation wellness program research",
};

export function buildResearchQuery(
  category: "crypto" | "rejuvenation",
  themes: string[] = [],
  customQuery?: string
): string {
  const trimmed = customQuery?.trim();
  if (trimmed) return trimmed;

  const primary = themes[0];
  if (primary && THEME_QUERIES[primary]) return THEME_QUERIES[primary];

  return category === "crypto"
    ? "Bitcoin OR cryptocurrency news when:1d"
    : "autophagy fasting rejuvenation research";
}

function dedupeNotes(notes: ResearchNote[]): ResearchNote[] {
  const merged: ResearchNote[] = [];
  const seen = new Set<string>();

  for (const note of notes) {
    const key = note.text.slice(0, 70).toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(note);
    }
  }
  return merged;
}

export async function fetchWebResearch(params: {
  query?: string;
  category: "crypto" | "rejuvenation";
  themes?: string[];
}): Promise<WebResearchResult> {
  const { category, themes = [] } = params;
  const queryUsed = buildResearchQuery(category, themes, params.query);
  const primaryTheme = themes[0] ?? "";
  const sourcesUsed: string[] = [];

  const tasks: Array<{ label: string; run: () => Promise<ResearchNote[]> }> = [];

  if (category === "crypto") {
    tasks.push({ label: "Google News", run: () => fetchGoogleNews(queryUsed, 10) });
    tasks.push({
      label: "Wire services",
      run: () =>
        fetchGoogleNews(
          `${queryUsed} (site:reuters.com OR site:apnews.com OR site:bloomberg.com OR site:bbc.com)`,
          6
        ),
    });
    tasks.push({
      label: "Crypto RSS",
      run: () => fetchCryptoRssNews(queryUsed, primaryTheme, 10),
    });
  } else {
    tasks.push({ label: "Google News", run: () => fetchGoogleNews(queryUsed, 6) });
    tasks.push({ label: "PubMed", run: () => fetchPubMedStudies(queryUsed, 5) });
  }

  const results = await Promise.all(
    tasks.map(async (task) => {
      const notes = await task.run();
      if (notes.length > 0) sourcesUsed.push(task.label);
      return notes;
    })
  );

  const merged = dedupeNotes(results.flat()).sort(
    (a, b) => publishedAtMs(b.publishedAt) - publishedAtMs(a.publishedAt)
  );

  if (merged.length === 0) {
    throw new Error(
      `No live internet results found for "${queryUsed}". Try a broader search term or check your network connection.`
    );
  }

  return {
    notes: merged.slice(0, 12),
    queryUsed,
    sourcesUsed,
    fetchedAt: new Date().toISOString(),
  };
}