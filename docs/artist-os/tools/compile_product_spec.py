#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "COMPILED_FULL_PRODUCT_SPEC.md"

skip_names = {"COMPILED_FULL_PRODUCT_SPEC.md"}
parts = [
    "# Artist OS — Compiled Full Product Specification\n",
    "> Generated file. Do not edit manually. Edit modular specs instead.\n",
]

for domain in sorted(p for p in ROOT.iterdir() if p.is_dir() and p.name[:2].isdigit()):
    if domain.name == "00_governance":
        continue
    readme = domain / "README.md"
    if readme.exists():
        parts.append(f"\n# DOMAIN: {domain.name}\n")
    for path in sorted(domain.glob("[0-9][0-9]_*.md")):
        parts.append("\n---\n")
        parts.append(path.read_text(encoding="utf-8"))

OUT.write_text("\n".join(parts), encoding="utf-8")
print(f"Wrote {OUT}")
