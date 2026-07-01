from pathlib import Path

BOOK_SOURCE_DIR = Path(r"C:\Users\wifis\OneDrive\Desktop\Kat's Legacy")

# Published English complete book (Amazon edition)
PRIMARY_PDF = BOOK_SOURCE_DIR / "Kat's Legacy, A Science Based Path to Healing and Longevity[1].pdf"

PDF_PRIORITY = [
    PRIMARY_PDF,
    BOOK_SOURCE_DIR / "Helth Book n Course" / "Kat's Legacy to Regain your health.pdf",
]


def resolve_pdf() -> Path:
    for path in PDF_PRIORITY:
        if path.exists():
            return path
    pdfs = list(BOOK_SOURCE_DIR.rglob("*.pdf"))
    if not pdfs:
        raise FileNotFoundError(f"No PDF found in {BOOK_SOURCE_DIR}")
    import pypdf

    best = max(
        pdfs,
        key=lambda p: sum(
            len(pypdf.PdfReader(str(p)).pages[i].extract_text() or "")
            for i in range(len(pypdf.PdfReader(str(p)).pages))
        ),
    )
    return best