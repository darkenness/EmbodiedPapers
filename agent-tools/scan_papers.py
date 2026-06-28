import re
import pathlib

root = pathlib.Path("papers")
for p in sorted(root.glob("@*.md")):
    text = p.read_text(encoding="utf-8")
    title_m = re.search(r'^title:\s*"(.+)"', text, re.M)
    title = title_m.group(1) if title_m else p.stem
    one = re.search(r"## 一句话问题\n\n(.+?)(?=\n\n## )", text, re.S)
    one_line = one.group(1).strip().replace("\n", " ")[:220] if one else "(no summary)"
    topics_m = re.search(r"^topics:\n((?:  - .+\n)+)", text, re.M)
    topics = re.findall(r"^  - (.+)$", topics_m.group(1), re.M) if topics_m else []
    print(f"=== {p.stem} ===")
    print(f"T: {title[:100]}")
    print(f"topics: {', '.join(topics[:8])}")
    print(f"1: {one_line}")
    print()