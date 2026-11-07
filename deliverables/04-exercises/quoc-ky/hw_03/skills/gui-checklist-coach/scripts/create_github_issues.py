#!/usr/bin/env python3
"""
create_github_issues.py
========================
Automates GitHub Issue creation for HW03 GUI Testing Checklist (Phase 7).

Features:
- Zero external dependencies (uses Python standard library urllib.request).
- Safe token loading from environment variables or gitignored .env file.
- Follows the Phase 7 staged pipeline:
    1. --mode dry-run : Previews issues, labels, and embedded screenshot links.
    2. --mode pilot   : Submits ONLY the first issue for human inspection on GitHub.
    3. --mode batch   : Submits remaining approved issues with rate-limiting pauses.
- Automatic write-back of GitHub Issue URLs into bug-drafts/ and checklist.md.
- Prevents duplicate issue creation.
"""

import os
import sys
import re
import json
import time
import argparse
import urllib.request
import urllib.error

DEFAULT_REPO = "faker26052005-lgtm/SUT-EShop"
GITHUB_API_BASE = "https://api.github.com"

# Standard label colors
LABEL_COLORS = {
    "bug": "d73a4a",
    "severity:Blocker": "b60205",
    "severity:Major": "d93f0b",
    "severity:Minor": "fbca04",
    "severity:Cosmetic": "0e8a16",
    "IA-01": "1d76db",
    "IA-02": "0052cc",
    "IA-03": "5319e7",
    "IA-04": "006b75",
    "platform:Chrome": "e36209",
    "platform:Firefox": "ff7139",
    "platform:Safari": "1793d1",
    "platform:Android": "3ddc84",
    "platform:Expo": "4630eb",
}

def load_github_token():
    """Loads GITHUB_TOKEN from env or local .env file."""
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if token:
        return token.strip()
    
    # Check .env in current and parent directories
    for path in [".env", "../.env", "../../.env"]:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("GITHUB_TOKEN=") or line.startswith("GH_TOKEN="):
                        return line.split("=", 1)[1].strip().strip('"').strip("'")
    return None

def api_request(endpoint, method="GET", payload=None, token=None):
    """Executes an authenticated GitHub REST API request."""
    url = f"{GITHUB_API_BASE}/{endpoint.lstrip('/')}"
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "Antigravity-HW03-GUI-Coach",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    data_bytes = json.dumps(payload).encode("utf-8") if payload else None
    req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            body = resp.read().decode("utf-8")
            return status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        try:
            err_json = json.loads(error_body)
            msg = err_json.get("message", error_body)
        except Exception:
            msg = error_body
        return e.code, {"error": msg}
    except Exception as e:
        return 500, {"error": str(e)}

def parse_bug_draft(filepath):
    """Parses a bug draft Markdown file into structured issue data."""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    lines = content.splitlines()
    title = ""
    for line in lines:
        if line.startswith("# "):
            title = line[2:].strip()
            break

    # Extract metadata fields
    item_match = re.search(r"\*\*Checklist item:\*\*\s*([^\n\r]+)", content)
    platforms_match = re.search(r"\*\*Platforms affected:\*\*\s*([^\n\r]+)", content)
    severity_match = re.search(r"\*\*Severity:\*\*\s*([^\n\r]+)", content)
    issue_match = re.search(r"\*\*GitHub Issue:\*\*\s*\[?#?(\d+)\]?", content)

    item_id = item_match.group(1).strip() if item_match else os.path.splitext(os.path.basename(filepath))[0]
    platforms_str = platforms_match.group(1).strip() if platforms_match else ""
    severity_raw = severity_match.group(1).strip() if severity_match else "Minor"
    existing_issue = issue_match.group(1) if issue_match else None

    # Clean severity string (e.g. "Major (student confirms)" -> "Major")
    severity = severity_raw.split()[0].replace("(", "").capitalize()
    if severity not in ["Blocker", "Major", "Minor", "Cosmetic"]:
        severity = "Minor"

    # Derive labels
    labels = ["bug", f"severity:{severity}"]
    ia_match = re.search(r"IA\d{2}", item_id)
    if not ia_match:
        ia_match = re.search(r"\*\*Interface Aspect:\*\*\s*`?(IA-\d{2})`?", content)
        if not ia_match:
            ia_match = re.search(r"IA-\d{2}", content)
    if ia_match:
        raw_ia = ia_match.group(1) if ia_match.groups() else ia_match.group(0)
        num_match = re.search(r"\d{2}", raw_ia)
        if num_match:
            labels.append(f"IA-{num_match.group(0)}")
    
    # Platform labels
    for plat in ["Chrome", "Firefox", "Safari", "Android", "Expo"]:
        if plat.lower() in platforms_str.lower():
            labels.append(f"platform:{plat}")

    return {
        "file_path": filepath,
        "title": title,
        "item_id": item_id,
        "severity": severity,
        "platforms": platforms_str,
        "labels": labels,
        "body": content,
        "existing_issue": existing_issue
    }

def ensure_github_labels(repo, labels, token):
    """Checks and creates missing labels in the repository."""
    status, repo_labels = api_request(f"repos/{repo}/labels?per_page=100", token=token)
    existing = set()
    if status == 200 and isinstance(repo_labels, list):
        existing = {lbl["name"] for lbl in repo_labels}

    for lbl in labels:
        if lbl not in existing:
            color = LABEL_COLORS.get(lbl, "cfd3d7")
            post_status, _ = api_request(
                f"repos/{repo}/labels",
                method="POST",
                payload={"name": lbl, "color": color},
                token=token
            )
            if post_status == 201:
                print(f"  [+] Created label on GitHub: '{lbl}' (color: #{color})")
                existing.add(lbl)

def write_back_issue_link(draft_path, checklist_md_path, item_id, issue_number, issue_url):
    """Updates bug-drafts/<ID>.md and checklist.md with the live GitHub Issue link."""
    # 1. Update draft file
    with open(draft_path, "r", encoding="utf-8") as f:
        draft_content = f.read()

    link_line = f"**GitHub Issue:** [#{issue_number}]({issue_url})"
    if "**GitHub Issue:**" in draft_content:
        draft_content = re.sub(r"\*\*GitHub Issue:\*\*.*", link_line, draft_content)
    else:
        # Insert after title
        draft_content = re.sub(r"(# [^\n]+\n)", r"\1\n" + link_line + "\n", draft_content, count=1)

    with open(draft_path, "w", encoding="utf-8") as f:
        f.write(draft_content)

    # 2. Update checklist.md Bug ID column if file exists
    if checklist_md_path and os.path.exists(checklist_md_path):
        with open(checklist_md_path, "r", encoding="utf-8") as f:
            lines = f.readlines()

        new_lines = []
        for line in lines:
            if f"| {item_id} " in line or f"|{item_id}|" in line.replace(" ", ""):
                parts = line.split("|")
                # Expected: Bug ID is usually the last column before the trailing pipe
                if len(parts) >= 12:
                    parts[-2] = f" [#{issue_number}]({issue_url}) "
                    line = "|".join(parts)
            new_lines.append(line)

        with open(checklist_md_path, "w", encoding="utf-8") as f:
            f.writelines(new_lines)

def run():
    parser = argparse.ArgumentParser(description="Create GitHub Issues for HW03 GUI Testing (Phase 7)")
    parser.add_argument("--mode", choices=["dry-run", "pilot", "batch"], default="dry-run",
                        help="Execution mode (default: dry-run)")
    parser.add_argument("--repo", default=DEFAULT_REPO, help=f"Target GitHub owner/repo (default: {DEFAULT_REPO})")
    parser.add_argument("--drafts-dir", default="hw03-gui-checklist/bug-drafts", help="Path to bug-drafts directory")
    parser.add_argument("--checklist-md", default="hw03-gui-checklist/checklist.md", help="Path to checklist.md")
    parser.add_argument("--token", default=None, help="GitHub Personal Access Token (or set GITHUB_TOKEN)")
    args = parser.parse_args()

    token = args.token or load_github_token()

    drafts_dir = args.drafts_dir
    if not os.path.exists(drafts_dir):
        # Check current folder bug-drafts
        if os.path.exists("bug-drafts"):
            drafts_dir = "bug-drafts"
        else:
            print(f"[ERROR] Bug drafts directory not found: {args.drafts_dir}")
            sys.exit(1)

    # Find all .md files in drafts-dir
    draft_files = sorted([os.path.join(drafts_dir, f) for f in os.listdir(drafts_dir) if f.endswith(".md")])
    if not draft_files:
        print(f"[INFO] No bug drafts found in '{drafts_dir}'.")
        sys.exit(0)

    parsed_drafts = [parse_bug_draft(df) for df in draft_files]

    print("=" * 80)
    print(f"HW03 GitHub Issue Manager | Repo: {args.repo} | Mode: {args.mode.upper()}")
    print("=" * 80)

    # --- MODE: DRY RUN ---
    if args.mode == "dry-run":
        print(f"[DRY-RUN] Found {len(parsed_drafts)} bug draft(s):\n")
        for i, bug in enumerate(parsed_drafts, start=1):
            status_str = f"[ALREADY FILED: #{bug['existing_issue']}]" if bug['existing_issue'] else "[READY TO FILE]"
            print(f"{i}. {status_str} {bug['title']}")
            print(f"   Item ID    : {bug['item_id']}")
            print(f"   Severity   : {bug['severity']}")
            print(f"   Platforms  : {bug['platforms']}")
            print(f"   Labels     : {', '.join(bug['labels'])}")
            
            # Check for embedded image URLs
            images = re.findall(r"!\[[^\]]*\]\(([^)]+)\)", bug['body'])
            print(f"   Evidence   : {len(images)} image(s) embedded")
            for img in images:
                print(f"     -> {img}")
            print("-" * 80)

        print("\n[NOTE] Dry-run complete. No GitHub requests were sent.")
        print("To file the first pilot issue, run with: --mode pilot")
        return

    # --- REQUIRE TOKEN FOR PILOT / BATCH ---
    if not token:
        print("[ERROR] GitHub token not found. Please set GITHUB_TOKEN in your environment or in .env")
        print("Example: export GITHUB_TOKEN=\"ghp_yourPersonalAccessToken\"")
        sys.exit(1)

    # Validate target repository
    status, repo_info = api_request(f"repos/{args.repo}", token=token)
    if status != 200:
        print(f"[ERROR] Cannot access repository '{args.repo}' (HTTP {status}): {repo_info.get('error')}")
        sys.exit(1)

    # Determine items to process
    targets = []
    if args.mode == "pilot":
        # Find the first unfiled draft
        for bug in parsed_drafts:
            if not bug["existing_issue"]:
                targets = [bug]
                break
        if not targets:
            print("[INFO] All drafts have already been filed. Nothing to pilot.")
            return
    elif args.mode == "batch":
        targets = [bug for bug in parsed_drafts if not bug["existing_issue"]]
        if not targets:
            print("[INFO] All drafts have already been filed.")
            return

    # Ensure labels exist before creating
    all_labels = set()
    for t in targets:
        all_labels.update(t["labels"])
    print(f"[*] Ensuring required labels exist on GitHub repository...")
    ensure_github_labels(args.repo, all_labels, token)

    # Process issues
    for idx, bug in enumerate(targets, start=1):
        print(f"\n[{idx}/{len(targets)}] Filing: {bug['title']} ...")
        payload = {
            "title": bug["title"],
            "body": bug["body"],
            "labels": bug["labels"]
        }

        status, resp = api_request(f"repos/{args.repo}/issues", method="POST", payload=payload, token=token)
        if status == 201:
            issue_number = resp["number"]
            issue_url = resp["html_url"]
            print(f"  [SUCCESS] Created Issue #{issue_number}: {issue_url}")
            write_back_issue_link(bug["file_path"], args.checklist_md, bug["item_id"], issue_number, issue_url)
            print(f"  [+] Updated draft and checklist.md with #{issue_number}")
        else:
            print(f"  [FAILED] HTTP {status}: {resp.get('error')}")
            print("[ABORT] Stopping execution to prevent runaway errors.")
            sys.exit(1)

        # Rate-limiting safety pause between issues
        if idx < len(targets):
            time.sleep(1.2)

    print("\n" + "=" * 80)
    if args.mode == "pilot":
        print("[PILOT COMPLETE] Please check the created issue URL above in your browser.")
        print("Verify formatting, labels, and image rendering. If satisfied, run with: --mode batch")
    else:
        print("[BATCH COMPLETE] All bug reports successfully filed on GitHub Issues and recorded!")
    print("=" * 80)

if __name__ == "__main__":
    run()
