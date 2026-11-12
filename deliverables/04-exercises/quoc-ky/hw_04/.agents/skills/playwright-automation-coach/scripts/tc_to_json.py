#!/usr/bin/env python3
"""tc_to_json.py - Parser to transform HW02 Test Case tables into HW04 Data-Driven JSON files.

Extracts test cases from HW02 Main_Report.md and converts them into structured JSON
files in data/ (<slug>.json). Each case preserves its original TC ID (e.g., TC_FR02_01),
objective title, type classification, raw inputs, and expected outcomes.

Usage:
  python3 scripts/tc_to_json.py [--source ../hw_02/Main_Report.md] [--fr FR-02|FR-07|FR-17|ALL] [--output-dir data]
"""

import argparse
import json
import os
import re
import sys
from pathlib import Path

FEATURE_CONFIG = {
    "FR-02": {
        "prefix": "TC_FR02_",
        "slug": "fr02-login",
        "name": "Đăng nhập & khóa tài khoản",
    },
    "FR-07": {
        "prefix": "TC_FR07_",
        "slug": "fr07-cart",
        "name": "Giỏ hàng",
    },
    "FR-17": {
        "prefix": "TC_FR17_",
        "slug": "fr17-coupon",
        "name": "Quản lý mã giảm giá Admin",
    },
}


def clean_cell(text: str) -> str:
    cleaned = text.strip()
    # Remove markdown backticks, asterisks, math dollars, backslashes
    cleaned = re.sub(r"[`*$\\]", "", cleaned).strip()
    return cleaned


def determine_type(classification: str, title: str) -> str:
    c_lower = classification.lower()
    t_lower = title.lower()
    if "negative" in c_lower or "iep" in c_lower:
        return "negative"
    if "bva" in c_lower or "boundary" in t_lower or "edge" in c_lower or "on-point" in t_lower or "off-point" in t_lower:
        return "edge"
    return "positive"


def parse_fr02_inputs(input_raw: str, expected_raw: str):
    inputs = {}
    expected = {}
    # Extract HTTP status
    status_match = re.search(r"HTTP\s+(\d{3})", expected_raw)
    expected["status"] = int(status_match.group(1)) if status_match else 200

    # Extract redirect or URL
    if "redirect" in expected_raw.lower() or "/" in expected_raw:
        url_match = re.search(r"redirect\s+[`'\"]?(/[^`'\s\"]*)", expected_raw)
        expected["url"] = url_match.group(1) if url_match else "/"

    # Extract username / password from input_raw
    parts = input_raw.split("/")
    if len(parts) >= 2:
        username = clean_cell(parts[0]).replace("$", "").strip()
        password = clean_cell(parts[1]).replace("$", "").split("(")[0].strip()
        inputs["username"] = username
        inputs["password"] = password
    else:
        inputs["username"] = input_raw
        inputs["password"] = ""

    return inputs, expected


def parse_fr07_inputs(input_raw: str, expected_raw: str):
    inputs = {}
    expected = {}
    # Extract product ID if present: id = 1
    id_match = re.search(r"id\s*=\s*['\"]?(\w+)", input_raw)
    inputs["product_id"] = id_match.group(1) if id_match else "1"

    # Extract quantity: Q = 1
    q_match = re.search(r"Q\s*=\s*(-?\d+)", input_raw)
    q_val = int(q_match.group(1)) if q_match else 1
    inputs["quantity"] = q_val
    expected["quantity"] = q_val if q_val > 0 else 0

    return inputs, expected


def parse_fr17_inputs(input_raw: str, expected_raw: str):
    inputs = {}
    expected = {}
    # Extract code="PROMO2026"
    code_match = re.search(r"code\s*=\s*\"([^\"]+)\"", input_raw)
    inputs["code"] = code_match.group(1) if code_match else "PROMO2026"

    # Extract type="percent" | "fixed"
    type_match = re.search(r"type\s*=\s*\"([^\"]+)\"", input_raw)
    inputs["discount_type"] = type_match.group(1) if type_match else "percent"

    # Extract val=10
    val_match = re.search(r"val\s*=\s*([0-9.]+)", input_raw)
    inputs["discount_value"] = float(val_match.group(1)) if val_match else 10.0

    status_match = re.search(r"HTTP\s+(\d{3})", expected_raw)
    expected["status"] = int(status_match.group(1)) if status_match else 201

    return inputs, expected


def parse_test_cases(markdown_path: Path, prefix: str, fr_code: str):
    if not markdown_path.exists():
        raise FileNotFoundError(f"Source file not found: {markdown_path}")

    lines = markdown_path.read_text(encoding="utf-8").splitlines()
    cases = []
    seen_ids = set()

    for line in lines:
        stripped = line.strip()
        # Look for table rows starting with | `TC_FRxx_yy` |
        if not (stripped.startswith("|") and f"`{prefix}" in stripped):
            continue

        cols = [c.strip() for c in stripped.split("|")]
        # Split gives empty string at ends: ['', ' `TC_...` ', ' Objective ', ...]
        if len(cols) < 8:
            continue

        tc_id = clean_cell(cols[1])
        if not tc_id.startswith(prefix) or tc_id in seen_ids:
            continue

        seen_ids.add(tc_id)
        objective = clean_cell(cols[2])
        classification = clean_cell(cols[3])
        ep_code = clean_cell(cols[4])
        bva_code = clean_cell(cols[5]) if len(cols) > 5 else ""
        raw_input = clean_cell(cols[6]) if len(cols) > 6 else ""
        raw_expected = clean_cell(cols[7]) if len(cols) > 7 else ""

        tc_type = determine_type(classification, objective)

        record = {
            "id": tc_id,
            "title": objective,
            "type": tc_type,
            "automation_decision": "automate",
            "test_layer": "ui_e2e",
            "ep_code": ep_code,
            "bva_code": bva_code,
            "preconditions": {},
            "raw_input": raw_input,
            "raw_expected": raw_expected,
            "expected": {},
            "human_verification": "TODO: verify with specs/system_requirements_specification.md",
        }

        # Feature-specific parsing helpers
        if fr_code == "FR-02":
            specifics, expected_obj = parse_fr02_inputs(raw_input, raw_expected)
            record.update(specifics)
            record["expected"] = expected_obj
        elif fr_code == "FR-07":
            specifics, expected_obj = parse_fr07_inputs(raw_input, raw_expected)
            record.update(specifics)
            record["expected"] = expected_obj
        elif fr_code == "FR-17":
            specifics, expected_obj = parse_fr17_inputs(raw_input, raw_expected)
            record.update(specifics)
            record["expected"] = expected_obj

        cases.append(record)

    return cases


def main():
    parser = argparse.ArgumentParser(description="Parse HW02 Main_Report.md into HW04 test data JSON files.")
    parser.add_argument("--source", default="../hw_02/Main_Report.md", help="Path to HW02 Main_Report.md")
    parser.add_argument("--fr", default="ALL", choices=["FR-02", "FR-07", "FR-17", "ALL"], help="Target feature")
    parser.add_argument("--output-dir", default="data", help="Output directory for JSON files")
    args = parser.parse_args()

    src_path = Path(args.source).resolve()
    out_dir = Path(args.output_dir).resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    targets = list(FEATURE_CONFIG.keys()) if args.fr == "ALL" else [args.fr]

    print(f"Reading test cases from: {src_path}")
    print(f"Output directory: {out_dir}\n")

    for fr in targets:
        cfg = FEATURE_CONFIG[fr]
        try:
            cases = parse_test_cases(src_path, cfg["prefix"], fr)
            out_file = out_dir / f"{cfg['slug']}.json"
            out_file.write_text(json.dumps(cases, indent=2, ensure_ascii=False), encoding="utf-8")
            print(f"[{fr}] {cfg['name']}:")
            print(f"  -> Extracted: {len(cases)} test cases")
            print(f"  -> File: {out_file.relative_to(Path.cwd()) if out_file.is_relative_to(Path.cwd()) else out_file}")
            print(f"  -> Types: positive={sum(1 for c in cases if c['type']=='positive')}, "
                  f"negative={sum(1 for c in cases if c['type']=='negative')}, "
                  f"edge={sum(1 for c in cases if c['type']=='edge')}\n")
        except Exception as e:
            print(f"Error processing {fr}: {e}", file=sys.stderr)


if __name__ == "__main__":
    main()
