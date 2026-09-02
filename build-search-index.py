#!/usr/bin/env python3
"""Regenerate search-index.json from the site's HTML pages.

Run this after editing page content so site search stays current:
    python3 build-search-index.py
"""

import glob
import html
import json
import re

# Pages excluded from search results
EXCLUDE = {"privacy.html"}

# Friendly section labels shown next to each result
SECTION = {
    "index.html": "Home",
    "about.html": "About",
    "blog.html": "Blog",
    "training.html": "Training",
    "success-stories.html": "Success Stories",
    "other-services.html": "Other Services",
    "canada-immigration.html": "Canada",
}


def clean_text(markup: str) -> str:
    """Strip chrome and tags, returning readable page text."""
    # Drop non-content blocks (nav/footer repeat on every page and pollute results)
    for block in ("script", "style", "nav", "footer", "svg"):
        markup = re.sub(rf"<{block}\b.*?</{block}>", " ", markup, flags=re.S | re.I)
    markup = re.sub(r"<!--.*?-->", " ", markup, flags=re.S)
    markup = re.sub(r"<[^>]+>", " ", markup)
    return re.sub(r"\s+", " ", html.unescape(markup)).strip()


def build():
    entries = []
    for path in sorted(glob.glob("*.html")):
        if path in EXCLUDE:
            continue
        markup = open(path, encoding="utf-8").read()

        title_match = re.search(r"<title>(.*?)</title>", markup, re.S)
        title = html.unescape(title_match.group(1)).split("—")[0].split("|")[0].strip() if title_match else path

        desc_match = re.search(r'<meta name="description" content="([^"]*)"', markup)
        description = html.unescape(desc_match.group(1)) if desc_match else ""

        headings = [
            re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", h))).strip()
            for h in re.findall(r"<h[123][^>]*>(.*?)</h[123]>", markup, re.S)
        ]
        headings = [h for h in headings if h][:12]

        body = clean_text(markup)[:1500]

        entries.append({
            "url": path,
            "title": title,
            "section": SECTION.get(path, "Australia"),
            "description": description,
            "headings": headings,
            "body": body,
        })

    with open("search-index.json", "w", encoding="utf-8") as fh:
        json.dump(entries, fh, ensure_ascii=False, separators=(",", ":"))
    return entries


if __name__ == "__main__":
    built = build()
    print(f"search-index.json written — {len(built)} pages indexed")
