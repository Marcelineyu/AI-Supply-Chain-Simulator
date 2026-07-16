#!/usr/bin/env python3
"""Validate AI Supply Chain Simulator source structure and data integrity."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

REQUIRED_PATHS = [
    "index.html",
    "app.js",
    "styles.css",
    "assets/images/supply-chain-terminal.webp",
    "scripts/validate_simulator_data.py",
]

CRITICAL_CONSTANTS = [
    "TOTAL=4300",
    "LA_REQ=2500",
    "RTM_REQ=1800",
    "BUDGET=150000",
    "COMMITTED_UNIT_REVENUE=72",
    "INCREMENTAL_UNIT_REVENUE=78",
]

EXPECTED_CRISIS_DAYS = [3, 7, 10, 13, 16, 19, 22, 24, 26, 28]

EXPECTED_CRISIS_TITLES = [
    "Port Strike in Shanghai",
    "Supplier Price Increase",
    "Quality Issue Detected",
    "Suez Canal Congestion",
    "Rotterdam Warehouse Capacity Full",
    "Unexpected US Demand Spike",
    "Immediate US Tariff Change",
    "Cargo Damage",
    "Supplier Bankruptcy",
    "Last-Minute LA Event Shortfall",
]

EXPECTED_STRATEGIES = [
    "100% Air Freight",
    "100% Sea Freight",
    "40% Air / 60% Sea",
    "20% Air / 80% Sea",
]

PLACEHOLDER_PATTERNS = [
    "TODO_IMPLEMENT",
    "INSERT_CODE_HERE",
    "FIXME",
    "CHANGEME",
]

MERGE_MARKER_PATTERN = re.compile(
    r"^(<<<<<<<|=======|>>>>>>>)( .*)?$", re.MULTILINE
)

LARGE_BASE64_IMAGE = re.compile(
    r"data:image/(?:webp|png|jpe?g|gif);base64,", re.IGNORECASE
)

SCRIPT_TAG = re.compile(
    r'<script\b[^>]*\bsrc=["\']([^"\']+)["\'][^>]*(?:\sdefer)?\s*>',
    re.IGNORECASE,
)

LINK_STYLESHEET = re.compile(
    r'<link\b[^>]*\brel=["\']stylesheet["\'][^>]*\bhref=["\']([^"\']+)["\']',
    re.IGNORECASE,
)

LINK_STYLESHEET_ALT = re.compile(
    r'<link\b[^>]*\bhref=["\']([^"\']+)["\'][^>]*\brel=["\']stylesheet["\']',
    re.IGNORECASE,
)

IMG_SRC = re.compile(
    r'<img\b[^>]*\bsrc=["\']([^"\']+)["\']',
    re.IGNORECASE,
)

DAY_PATTERN = re.compile(r"\{day:(\d+),title:'([^']+)'")
PROB_PATTERN = re.compile(r"\bp:([0-9.]+)")
CHANCE_BLOCK = re.compile(r"chance:\[")
RESULT_FIELD = re.compile(r"\bresult:'")
FX_FIELD = re.compile(r"\bfx:\{")

FILLER_HINTS = [
    re.compile(r"//+\s*padding for linguist", re.IGNORECASE),
    re.compile(r"github language stats", re.IGNORECASE),
    re.compile(r"inflate file size", re.IGNORECASE),
]


class Validator:
    def __init__(self) -> None:
        self.failures: list[str] = []
        self.passes: list[str] = []

    def ok(self, message: str) -> None:
        self.passes.append(message)
        print(f"[PASS] {message}")

    def fail(self, message: str) -> None:
        self.failures.append(message)
        print(f"[FAIL] {message}")

    def read_text(self, relative: str) -> str | None:
        path = ROOT / relative
        if not path.is_file():
            self.fail(f"Missing file: {relative}")
            return None
        try:
            return path.read_text(encoding="utf-8")
        except OSError as exc:
            self.fail(f"Cannot read {relative}: {exc}")
            return None

    def resolve_reference(self, base_file: Path, reference: str) -> Path | None:
        if reference.startswith(("http://", "https://", "//", "data:")):
            return None
        ref = reference.split("#")[0].split("?")[0]
        if not ref:
            return None
        target = (base_file.parent / ref).resolve()
        try:
            target.relative_to(ROOT.resolve())
        except ValueError:
            self.fail(f"Asset reference escapes project root: {reference} in {base_file.name}")
            return None
        return target

    def check_required_files(self) -> None:
        missing = [p for p in REQUIRED_PATHS if not (ROOT / p).is_file()]
        if missing:
            for item in missing:
                self.fail(f"Missing required file: {item}")
        else:
            self.ok("Required files found")

    def check_nonempty_sources(self) -> None:
        for relative in ("index.html", "app.js", "styles.css"):
            path = ROOT / relative
            if not path.is_file():
                continue
            if path.stat().st_size == 0:
                self.fail(f"Required source file is empty: {relative}")
            else:
                self.ok(f"{relative} is non-empty")

    def check_merge_markers(self) -> None:
        flagged = False
        for relative in ("index.html", "app.js", "styles.css", "README.md"):
            text = self.read_text(relative)
            if text is None:
                continue
            if MERGE_MARKER_PATTERN.search(text):
                self.fail(f"Unresolved merge markers in {relative}")
                flagged = True
        if not flagged:
            self.ok("No unresolved merge markers")

    def check_html_assets(self) -> None:
        html_path = ROOT / "index.html"
        html = self.read_text("index.html")
        if html is None:
            return

        refs: list[tuple[str, str]] = []
        for pattern in (LINK_STYLESHEET, LINK_STYLESHEET_ALT):
            refs.extend(("stylesheet", m.group(1)) for m in pattern.finditer(html))
        refs.extend(("script", m.group(1)) for m in SCRIPT_TAG.finditer(html))
        refs.extend(("image", m.group(1)) for m in IMG_SRC.finditer(html))

        broken = False
        for kind, reference in refs:
            if reference.startswith(("http://", "https://", "//", "data:")):
                continue
            target = self.resolve_reference(html_path, reference)
            if target is None:
                continue
            if not target.is_file():
                self.fail(f"Broken {kind} reference in index.html: {reference}")
                broken = True
            elif target.stat().st_size == 0:
                self.fail(f"Zero-byte asset referenced from index.html: {reference}")
                broken = True

        if not broken:
            self.ok("HTML asset references resolve")

    def check_script_order(self) -> None:
        html = self.read_text("index.html")
        if html is None:
            return
        scripts = SCRIPT_TAG.findall(html)
        if scripts != ["app.js"]:
            self.fail(
                f"Unexpected script loading order or sources: {scripts or 'none'}"
            )
            return
        body = html.lower()
        css_pos = body.find('href="styles.css"')
        script_pos = body.find('src="app.js"')
        if css_pos == -1 or script_pos == -1 or css_pos > script_pos:
            self.fail("styles.css must load before app.js in index.html")
            return
        self.ok("Script loading order in index.html is valid")

    def check_constants(self, js: str) -> None:
        missing = [item for item in CRITICAL_CONSTANTS if item not in js]
        if missing:
            for item in missing:
                self.fail(f"Missing critical constant in app.js: {item}")
        else:
            self.ok("Critical simulator constants present in app.js")

    def check_crises(self, js: str) -> None:
        days = [int(m.group(1)) for m in DAY_PATTERN.finditer(js)]
        titles = [m.group(2) for m in DAY_PATTERN.finditer(js)]

        if days != EXPECTED_CRISIS_DAYS:
            self.fail(
                f"Crisis day sequence mismatch. Expected {EXPECTED_CRISIS_DAYS}, got {days}"
            )
        else:
            self.ok("All expected crisis days present in order")

        if titles != EXPECTED_CRISIS_TITLES:
            self.fail("Crisis title sequence does not match expected simulator data")
        else:
            self.ok("Crisis titles match expected simulator data")

        if len(set(titles)) != len(titles):
            self.fail("Duplicate crisis titles detected")
        else:
            self.ok("Crisis titles are unique")

        for day in days:
            if not isinstance(day, int) or day < 1 or day > 30:
                self.fail(f"Invalid crisis day value: {day}")

        if not any(f.startswith("Invalid crisis day") for f in self.failures):
            self.ok("Crisis day values are valid")

    def check_probabilities(self, js: str) -> None:
        invalid = []
        for match in PROB_PATTERN.finditer(js):
            value = float(match.group(1))
            if value < 0 or value > 1:
                invalid.append(value)
        if invalid:
            self.fail(f"Probability values outside [0, 1]: {invalid}")
        else:
            self.ok("Probability values are within 0 and 1")

    def check_decision_fields(self, js: str) -> None:
        if not CHANCE_BLOCK.search(js):
            self.fail("Expected chance-based decision blocks not found in app.js")
        if not RESULT_FIELD.search(js):
            self.fail("Expected decision result fields not found in app.js")
        if not FX_FIELD.search(js):
            self.fail("Expected decision fx fields not found in app.js")
        if not any(
            f.startswith("Expected decision")
            or f.startswith("Expected chance")
            for f in self.failures
        ):
            self.ok("Required decision outcome fields detected in app.js")

    def check_strategies(self, js: str) -> None:
        missing = [name for name in EXPECTED_STRATEGIES if name not in js]
        if missing:
            for name in missing:
                self.fail(f"Missing transportation strategy: {name}")
        else:
            self.ok("All transportation strategies present")

    def check_placeholders(self) -> None:
        flagged = False
        for relative in ("index.html", "app.js", "styles.css", "README.md"):
            text = self.read_text(relative)
            if text is None:
                continue
            for token in PLACEHOLDER_PATTERNS:
                if token in text:
                    self.fail(f"Placeholder text {token!r} found in {relative}")
                    flagged = True
        if not flagged:
            self.ok("No placeholder implementation text found")

    def check_extracted_images(self) -> None:
        image_path = ROOT / "assets/images/supply-chain-terminal.webp"
        if not image_path.is_file():
            self.fail("Extracted image missing: assets/images/supply-chain-terminal.webp")
            return
        size = image_path.stat().st_size
        if size <= 0:
            self.fail("Extracted image file is empty")
            return
        if size < 1000:
            self.fail(f"Extracted image suspiciously small ({size} bytes)")
            return
        self.ok("Extracted image assets are valid")

    def check_no_large_base64_in_html(self) -> None:
        html = self.read_text("index.html")
        if html is None:
            return
        matches = list(LARGE_BASE64_IMAGE.finditer(html))
        if matches:
            self.fail(
                f"Large embedded Base64 image data still present in index.html ({len(matches)} match(es))"
            )
        else:
            self.ok("No large Base64 image data embedded in index.html")

    def check_no_filler(self) -> None:
        flagged = False
        for path in ROOT.rglob("*"):
            if not path.is_file():
                continue
            if path.suffix.lower() not in {".html", ".js", ".css", ".py", ".md"}:
                continue
            try:
                text = path.read_text(encoding="utf-8")
            except (OSError, UnicodeDecodeError):
                continue
            rel = path.relative_to(ROOT).as_posix()
            if rel == "scripts/validate_simulator_data.py":
                continue
            for pattern in FILLER_HINTS:
                if pattern.search(text):
                    self.fail(f"Possible linguist-filler content in {rel}")
                    flagged = True
        if not flagged:
            self.ok("No obvious linguist-statistics filler content detected")

    def run(self) -> int:
        print(f"Validating AI Supply Chain Simulator at {ROOT}\n")
        self.check_required_files()
        self.check_nonempty_sources()
        self.check_merge_markers()

        js = self.read_text("app.js")
        if js is not None:
            self.check_constants(js)
            self.check_crises(js)
            self.check_probabilities(js)
            self.check_decision_fields(js)
            self.check_strategies(js)

        self.check_html_assets()
        self.check_script_order()
        self.check_placeholders()
        self.check_extracted_images()
        self.check_no_large_base64_in_html()
        self.check_no_filler()

        print()
        print(f"Passed: {len(self.passes)}")
        print(f"Failed: {len(self.failures)}")
        if self.failures:
            print("\nFailures:")
            for item in self.failures:
                print(f"  - {item}")
            return 1
        print("\nAll checks passed.")
        return 0


def main() -> int:
    try:
        return Validator().run()
    except Exception as exc:  # noqa: BLE001 — top-level guard for CI/scripts
        print(f"[FAIL] Validator crashed: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    sys.exit(main())
