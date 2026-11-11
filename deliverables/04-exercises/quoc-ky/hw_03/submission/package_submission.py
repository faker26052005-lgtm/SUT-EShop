#!/usr/bin/env python3
"""
Automated packaging script for HW03 submission zip.
Conforms strictly to HW03 §14 and GEMINI.md regulations.
"""
import os
import sys
import zipfile
from pathlib import Path

STUDENT_ID = "23120138"
GRADE = "100"  # 3-digit self-assessed grade
ZIP_NAME = f"{STUDENT_ID}_HW03_AI_GUIUsability_{GRADE}.zip"
BASE_DIR = Path(__file__).resolve().parent.parent
SUBMISSION_DIR = BASE_DIR / "submission"
OUTPUT_ZIP = SUBMISSION_DIR / ZIP_NAME

# Items to include in the submission zip
INCLUDED_ITEMS = [
    "README.md",
    "GEMINI.md",
    "hw03.md",
    "git-commit-log.txt",
    "Agent-Skill-script-HW03.md",
    "AI_Audit_Report.md",
    "AI_Audit_Report.pdf",
    "HW03_Report.md",
    "HW03_Report.pdf",
    "Bug_Report.md",
    "Bug_Report.pdf",
    "AI_Critique.md",
    "AI_Critique.pdf",
    "hw03-gui-checklist",
    "usability",
    "evidence",
    "skills",
    "screen-maps",
    "screen-context",
]

# Patterns or filenames to strictly exclude
EXCLUDED_PATTERNS = {
    ".env",
    ".git",
    "__pycache__",
    ".pytest_cache",
    ".DS_Store",
    "Thumbs.db",
}

def should_exclude(rel_path: Path) -> bool:
    for part in rel_path.parts:
        if part in EXCLUDED_PATTERNS or part.startswith(".env"):
            return True
        if part.endswith((".pyc", ".pyo", ".mp4", ".mkv")):
            return True
    return False

def package_submission():
    SUBMISSION_DIR.mkdir(parents=True, exist_ok=True)
    
    # 1. Ensure git commit log is freshly exported
    log_file = SUBMISSION_DIR / "git-commit-log.txt"
    os.system(f'git log --reverse --date=iso --pretty=format:"%h | %ad | %an | %s" > "{log_file}"')
    
    print(f"Creating submission package: {OUTPUT_ZIP.name}")
    file_count = 0
    
    with zipfile.ZipFile(OUTPUT_ZIP, "w", zipfile.ZIP_DEFLATED) as zf:
        # Add included items
        for item_name in INCLUDED_ITEMS:
            item_path = BASE_DIR / item_name
            if not item_path.exists():
                print(f"  ! Warning: {item_name} does not exist (optional or pending generation)")
                continue
                
            if item_path.is_file():
                zf.write(item_path, arcname=item_name)
                file_count += 1
                print(f"  + Added file: {item_name}")
            elif item_path.is_dir():
                for root, _, files in os.walk(item_path):
                    for file in files:
                        abs_file = Path(root) / file
                        rel_file = abs_file.relative_to(BASE_DIR)
                        if should_exclude(rel_file):
                            continue
                        zf.write(abs_file, arcname=str(rel_file))
                        file_count += 1
                print(f"  + Added directory: {item_name}/")

    zip_size_mb = OUTPUT_ZIP.stat().st_size / (1024 * 1024)
    print(f"\nPackaging complete!")
    print(f"Total files: {file_count}")
    print(f"Archive size: {zip_size_mb:.2f} MB")
    print(f"Archive path: {OUTPUT_ZIP}")

if __name__ == "__main__":
    package_submission()
