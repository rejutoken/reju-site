"""Build structured book knowledge from extracted PDF text."""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from book_source_config import BOOK_SOURCE_DIR, resolve_pdf

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "lib" / "katsLegacyBook.extracted.txt"
OUT = ROOT / "lib" / "katsLegacyBook.knowledge.json"

CHAPTER_THEME_MAP = {
    "CHAPTER 1": "lymphatic",
    "CHAPTER 2": "immunity",
    "CHAPTER 3": "event",
    "CHAPTER 4": "health",
    "CHAPTER 5": "health",
    "CHAPTER 6": "cellular_repair",
    "CHAPTER 7": "health",
    "CHAPTER 8": "ketosis",
    "CHAPTER 9": "cellular_repair",
    "CHAPTER 10": "health",
    "CHAPTER 11": "event",
}

THEME_CHAPTERS = {
    "health": ["Introduction", "CHAPTER 7", "CHAPTER 10", "Four-Week Reset"],
    "ketosis": ["CHAPTER 8", "Week 2"],
    "cellular_repair": ["CHAPTER 6", "CHAPTER 9", "Week 2"],
    "immunity": ["CHAPTER 2", "CHAPTER 7"],
    "lymphatic": ["CHAPTER 1"],
    "event": ["Four-Week Reset", "CHAPTER 11", "Kat's JOL"],
}


def normalize(text: str) -> str:
    text = text.replace("\r", "")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def split_sections(text: str) -> dict[str, str]:
    markers = [
        "Introduction",
        "CHAPTER 1",
        "CHAPTER 2",
        "CHAPTER 3",
        "CHAPTER 4",
        "CHAPTER 5",
        "CHAPTER 6",
        "CHAPTER 7",
        "CHAPTER 8",
        "CHAPTER 9",
        "CHAPTER 10",
        "CHAPTER 11",
        "Overview of the Four-Week Reset Program",
        "Kat's Journey and the Birth of Kat's JOL",
    ]
    positions = []
    for m in markers:
        for match in re.finditer(re.escape(m), text):
            positions.append((match.start(), m))
    positions.sort()

    sections: dict[str, str] = {}
    for i, (start, name) in enumerate(positions):
        end = positions[i + 1][0] if i + 1 < len(positions) else len(text)
        chunk = normalize(text[start:end])
        if len(chunk) > 200:
            key = name
            if name == "Overview of the Four-Week Reset Program":
                key = "Four-Week Reset"
            if name.startswith("Kat's Journey"):
                key = "Kat's JOL"
            sections[key] = chunk
    return sections


def best_excerpt(section: str, max_len: int = 520) -> str:
    paras = [p.strip() for p in section.split("\n") if len(p.strip()) > 60]
    paras = [re.sub(r"\s+", " ", p) for p in paras if not re.fullmatch(r"[\d\s\.]+", p)]
    out = ""
    for p in paras:
        if len(out) + len(p) + 1 > max_len:
            break
        out += p + " "
    excerpt = out.strip()
    if len(excerpt) > max_len:
        cut = excerpt[: max_len - 3]
        last = max(cut.rfind(". "), cut.rfind("! "), cut.rfind("? "))
        if last > 120:
            cut = cut[: last + 1]
        excerpt = cut + "..."
    return excerpt


def curated_hooks() -> dict[str, str]:
    return {
        "health": "Autophagy is your body's built-in recycling service — and Kat's Legacy shows exactly how to activate it.",
        "ketosis": "Kat's Legacy teaches ketosis as anti-inflammatory fuel: when glucose drops, ketone bodies power brain and body.",
        "cellular_repair": "Clearing damaged cells is only half the story. Kat's Legacy maps the repair phase — Week 2 of the 4-Week Reset.",
        "immunity": "Your immune system is your defense army. Kat's Legacy explains how fasting, ketosis, and autophagy reinforce it.",
        "lymphatic": "The lymphatic system is your body's silent drainage network — Chapter 1 of Kat's Legacy starts the healing journey here.",
        "event": "Kat's 4-Week Reset Program in the book: detox → cellular repair → ketosis → renewed vitality, documented from Kat's journey.",
    }


def main() -> None:
    text = SRC.read_text(encoding="utf-8")
    sections = split_sections(text)
    hooks = curated_hooks()

    theme_knowledge = {}
    for theme, keys in THEME_CHAPTERS.items():
        combined = []
        for key in keys:
            if key in sections:
                combined.append(sections[key])
        merged = "\n\n".join(combined) if combined else ""
        theme_knowledge[theme] = {
            "hook": hooks[theme],
            "excerpt": best_excerpt(merged, 580) if merged else "",
            "chapters": keys,
            "source": "Kat's Legacy (complete PDF)",
        }

    # High-value fixed excerpts from the book (verbatim, curated)
    theme_knowledge["health"]["hook"] = (
        "At 16 hours of fasting, autophagy begins — Kat's Legacy shows what happens inside your cells during Week 1 of the Reset."
    )
    theme_knowledge["health"]["excerpt"] = (
        "Autophagy is your body's natural internal cleansing system. Dr. Yoshinori Ohsumi's Nobel Prize research "
        "showed how cells break down damaged parts during stress or nutrient shortage. At 16 hours of fasting, "
        "autophagy activates — damaged organelles are recycled, inflammation drops, and immune efficiency improves. "
        "Kat's 4-Week Reset Week 1 uses 16-hour fasting windows with Kat's JOL™ so your body begins true cellular housekeeping."
    )
    theme_knowledge["ketosis"]["excerpt"] = (
        "In ketosis, your liver converts stored fat into ketone bodies — β-hydroxybutyrate, acetoacetate, and acetone — "
        "that fuel your brain and body when carbohydrates are limited to roughly 20–50 grams per day. Kat's Legacy describes "
        "ketosis as a state of anti-inflammatory health: insulin drops, fat burning rises, and inflammation stays in check. "
        "Week 2 of the Reset deepens ketosis with 20-hour fasting and Kat's JOL™."
    )
    theme_knowledge["cellular_repair"]["excerpt"] = (
        "Week 2 of Kat's 4-Week Reset targets cellular repair: 20-hour fasting intensifies autophagy, ketosis becomes the "
        "primary fuel source, and cells eliminate damaged components while building new healthy structures. "
        "The book frames cellular repair as routine maintenance — like a full tune-up — essential for longevity."
    )
    theme_knowledge["immunity"]["excerpt"] = (
        "Kat's Legacy opens with the immune system as the body's defense army — innate and adaptive immunity working together. "
        "Autophagy helps eliminate harmful invaders; ketosis reduces inflammation that weakens immune efficiency. "
        "Kat herself avoided common illnesses for over a decade, including during COVID-19, while on Kat's JOL™."
    )
    theme_knowledge["lymphatic"]["excerpt"] = (
        "Chapter 1 calls the lymphatic system your body's hidden drainage network — it clears waste, transports immune cells, "
        "and balances fluids. Without movement and hydration, toxins accumulate and immune defenses weaken. "
        "Kat's Legacy teaches lymphatic support through hydration, movement, and detoxification as the foundation of healing."
    )
    theme_knowledge["event"]["excerpt"] = (
        "The Four-Week Reset Program in Kat's Legacy: Preparation (3 days) → Week 1 Detoxification → Week 2 Cellular Repair → "
        "Week 3 Transition to Solids → Week 4 Balanced Maintenance — all fueled by Kat's JOL™ and structured fasting. "
        "Document your baseline before you begin. This is the self-guided foundation of the REJU Rejuvenation Event™."
    )

    # Complete single X posts (≤280 chars) — book-trained, rotated daily
    single_posts = {
        "health": [
            "At 16 hours of fasting, autophagy begins — your body's built-in recycling system clears damaged organelles and inflammation drops. Week 1 of Kat's 4-Week Reset in Kat's Legacy by Wilson Fischmann. REJU Rejuvenation Event → rejutkn.com",
            "Autophagy = cellular self-renewal, not self-harm. Dr. Ohsumi's Nobel research + Kat's Legacy show how Week 1 fasting triggers internal cleanup. Establish your REJU Health Benchmark → rejutkn.com",
            "Kat's Legacy Week 1: 16-hour fasting / 8-hour eating — glycogen depletes, autophagy activates, immune efficiency improves. Born from Kat's recovery journey. → rejutkn.com",
        ],
        "ketosis": [
            "In ketosis, ketone bodies fuel brain and body — insulin drops, inflammation eases. Kat's Legacy Week 2: 20-hour fasting + Kat's JOL™ through the REJU Protocol™. → rejutkn.com",
            "When carbs stay low (~20–50g), your liver makes ketones from stored fat. Kat's Legacy calls this anti-inflammatory fuel — deepened in Week 2 of the Reset. → rejutkn.com",
            "Ketosis isn't a fad — it's metabolic flexibility. Kat's Legacy maps the shift from glucose to fat fuel during the 4-Week Reset. REJU Rejuvenation Event → rejutkn.com",
        ],
        "cellular_repair": [
            "Autophagy clears. Cellular repair rebuilds. Week 2 of Kat's 4-Week Reset intensifies both — 20-hour fasting, ketosis, new healthy structures. From Kat's Legacy → rejutkn.com",
            "Cellular repair is the tune-up after the cleanup. Kat's Legacy Week 2 targets mitochondrial quality and protein recycling through structured fasting. REJU Protocol™ → rejutkn.com",
            "Damaged components out. Resilience in. Kat's Legacy frames Week 2 as deep cellular repair — the foundation of the REJU Transformation Book. → rejutkn.com",
        ],
        "immunity": [
            "Chapter 2 of Kat's Legacy: your immune system is a defense army. Fasting + ketosis reduce inflammation so immunity stays calibrated. Kat thrived on JOL™ for 12+ years. → rejutkn.com",
            "Autophagy clears pathogens. Ketosis lowers inflammatory noise. Kat avoided common illness for a decade — including COVID — on Kat's JOL™. Science in Kat's Legacy. → rejutkn.com",
            "Immune resilience isn't luck — it's metabolic environment. Wilson Fischmann documents this in Kat's Legacy. Track yours in the REJU Health Benchmark™. → rejutkn.com",
        ],
        "lymphatic": [
            "Chapter 1 of Kat's Legacy: the lymphatic system is your drainage network — no pump, only movement and hydration. Support it through the 4-Week Reset. → rejutkn.com",
            "Toxins accumulate when lymphatic flow stalls. Kat's Legacy starts healing here — hydration, movement, fasting protocols in the REJU Rejuvenation Event. → rejutkn.com",
            "Your lymphatic system clears waste and carries immune cells. Kat's Legacy teaches how to support it before deep detox begins. Week 1 awaits. → rejutkn.com",
        ],
        "event": [
            "Kat's 4-Week Reset in Kat's Legacy: 3-day prep → detox → cellular repair → ketosis → vitality. Document your baseline. Author your REJU Transformation Book. → rejutkn.com",
            "Born from Kat's recovery journey: Kat's JOL™ + structured fasting + the 4-Week Reset. Self-guided in the book. Guided in the REJU Rejuvenation Event™. → rejutkn.com",
            "Wilson Fischmann wrote Kat's Legacy after saving his daughter — then healed himself. That protocol is the REJU foundation. Begin → rejutkn.com",
        ],
    }

    for theme, posts in single_posts.items():
        for i, post in enumerate(posts):
            if len(post) > 280:
                raise ValueError(f"{theme} variant {i} is {len(post)} chars (max 280): {post}")
        theme_knowledge[theme]["singlePosts"] = posts

    pdf_path = resolve_pdf()
    payload = {
        "title": "Kat's Legacy: A Science-Based Path to Healing and Longevity",
        "author": "Wilson Fischmann CA",
        "bookSourceDir": str(BOOK_SOURCE_DIR),
        "pdfSource": str(pdf_path),
        "amazonPaperback": "https://www.amazon.com/Kats-Legacy-Longevity-Unblocking-Rejuvenate/dp/B0FF2D7WVL",
        "extractedChars": len(text),
        "sectionCount": len(sections),
        "themes": theme_knowledge,
        "coreConcepts": [
            "Kat's JOL (Juice of Life)",
            "4-Week Reset Program",
            "Autophagy",
            "Ketosis",
            "Cellular repair",
            "Lymphatic system",
            "Immune system",
            "Detoxification",
            "Metabolic flexibility",
            "Health baseline",
        ],
        "chapters": list(sections.keys()),
        "voiceGuidelines": [
            "Lead with one clear, book-backed insight — never repeat the same idea twice in one post.",
            "Ground claims in Kat's Legacy by Wilson Fischmann CA — cite chapters, weeks, or Kat's JOL™ when relevant.",
            "Tie science to REJU: Protocol™, Rejuvenation Event™, Health Benchmark™, or Transformation Book.",
            "Use complete sentences only. Single posts must be ≤280 characters with a CTA.",
            "Do not mix crypto/Rejunomics content into rejuvenation posts.",
        ],
    }

    OUT.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(f"written {OUT}")
    print(f"sections={len(sections)} themes={len(theme_knowledge)}")


if __name__ == "__main__":
    main()