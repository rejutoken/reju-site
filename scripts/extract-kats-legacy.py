import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from book_source_config import BOOK_SOURCE_DIR, resolve_pdf
import pypdf

OUT_TXT = Path(__file__).resolve().parent.parent / "lib" / "katsLegacyBook.extracted.txt"
OUT_JSON = Path(__file__).resolve().parent.parent / "lib" / "katsLegacyBook.chunks.json"


def extract_pdf(path: Path) -> str:
    reader = pypdf.PdfReader(str(path))
    return "\n".join((page.extract_text() or "") for page in reader.pages)


def chunk_text(text: str, size: int = 1200) -> list[dict]:
    cleaned = re.sub(r"\n{3,}", "\n\n", text)
    cleaned = re.sub(r"[ \t]+", " ", cleaned)
    paragraphs = [p.strip() for p in cleaned.split("\n\n") if len(p.strip()) > 40]
    chunks = []
    current = ""
    idx = 0
    for para in paragraphs:
        if len(current) + len(para) > size and current:
            chunks.append({"id": f"chunk-{idx}", "text": current.strip()})
            idx += 1
            current = para + "\n\n"
        else:
            current += para + "\n\n"
    if current.strip():
        chunks.append({"id": f"chunk-{idx}", "text": current.strip()})
    return chunks


def main() -> int:
    path = resolve_pdf()
    text = extract_pdf(path)
    OUT_TXT.write_text(text, encoding="utf-8")
    chunks = chunk_text(text)
    OUT_JSON.write_text(
        json.dumps(
            {
                "bookSourceDir": str(BOOK_SOURCE_DIR),
                "source": str(path),
                "pageCount": len(pypdf.PdfReader(str(path)).pages),
                "chunks": chunks,
            },
            indent=2,
        ),
        encoding="utf-8",
    )

    print(f"bookSourceDir={BOOK_SOURCE_DIR}")
    print(f"source={path}")
    print(f"chars={len(text)}")
    print(f"chunks={len(chunks)}")
    print(f"written={OUT_TXT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())