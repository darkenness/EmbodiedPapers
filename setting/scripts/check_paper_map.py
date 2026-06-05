#!/usr/bin/env python3
"""Check that the root paper map links every canonical paper note."""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


LINK_RE = re.compile(r"\[\[([^\]#|]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--map",
        default="论文地图.md",
        help="paper map path relative to the vault root",
    )
    args = parser.parse_args()

    root = Path(__file__).resolve().parents[2]
    paper_dir = root / "papers"
    map_path = root / args.map

    if not paper_dir.exists():
        print(f"Missing paper directory: {paper_dir}", file=sys.stderr)
        return 2

    if not map_path.exists():
        print(f"Missing paper map: {map_path}", file=sys.stderr)
        return 2

    papers = {path.stem: path for path in paper_dir.glob("@*.md")}
    map_text = map_path.read_text(encoding="utf-8")
    linked = {
        normalize_link(match.group(1))
        for match in LINK_RE.finditer(map_text)
    }
    linked_papers = {name for name in linked if name.startswith("@")}

    missing = sorted(set(papers) - linked_papers)
    stale = sorted(linked_papers - set(papers))

    if missing:
        print("Missing from paper map:")
        for name in missing:
            print(f"  - {papers[name].relative_to(root).as_posix()}")

    if stale:
        print("Paper map links without matching papers/@*.md note:")
        for name in stale:
            print(f"  - {name}")

    if missing or stale:
        return 1

    print(f"Paper map OK: {len(papers)}/{len(papers)} canonical paper notes covered.")
    return 0


def normalize_link(link: str) -> str:
    value = link.strip().replace("\\", "/")
    if value.endswith(".md"):
        value = value[:-3]
    return value.rsplit("/", 1)[-1]


if __name__ == "__main__":
    raise SystemExit(main())
