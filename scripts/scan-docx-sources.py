from pathlib import Path
from docx import Document

root = Path(r"C:\Users\wifis\OneDrive\Desktop\Kat's Legacy")
for docx in sorted(root.rglob("*.docx")):
    if docx.name.startswith("~$"):
        continue
    try:
        d = Document(str(docx))
        text = "\n".join(p.text for p in d.paragraphs if p.text.strip())
        if len(text) > 5000:
            print(f"{len(text):>7} chars | {docx.relative_to(root)}")
    except Exception as e:
        print(f"ERR {docx.name}: {e}")