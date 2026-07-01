from pathlib import Path
import pypdf

root = Path(r"C:\Users\wifis\OneDrive\Desktop\Kat's Legacy")
for pdf in sorted(root.rglob("*.pdf")):
    try:
        r = pypdf.PdfReader(str(pdf))
        text = "".join((p.extract_text() or "") for p in r.pages)
        print(f"{len(text):>7} chars | {len(r.pages):>3} pages | {pdf.name}")
    except Exception as e:
        print(f"ERR {pdf.name}: {e}")