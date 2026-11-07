#!/usr/bin/env python3
"""
generate_checklist_excel.py
Generates the multi-platform checklist.xlsx file from checklist.md or structured data.
Includes data validation for Passed/Failed results and automated summary formulas.
"""

import sys
import os
import re

def ensure_openpyxl():
    try:
        import openpyxl
        return openpyxl
    except ImportError:
        # Check if local virtualenv has openpyxl or try to create one
        print("[INFO] openpyxl not found in active python environment. Attempting virtualenv setup...")
        venv_dir = os.path.join(os.path.dirname(__file__), ".venv")
        if not os.path.exists(venv_dir):
            import subprocess
            subprocess.run([sys.executable, "-m", "venv", venv_dir], check=True)
            pip_bin = os.path.join(venv_dir, "bin", "pip")
            subprocess.run([pip_bin, "install", "openpyxl"], check=True)
        py_bin = os.path.join(venv_dir, "bin", "python")
        # Re-execute with venv python
        os.execv(py_bin, [py_bin] + sys.argv)

def parse_markdown_checklist(md_path):
    """
    Parses checklist.md Markdown table rows into a list of dicts.
    Supports both the 14-column execution format and the 10-column design format.
    """
    if not os.path.exists(md_path):
        print(f"[ERROR] Checklist Markdown file not found: {md_path}")
        sys.exit(1)

    with open(md_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    current_ia = ""
    items = []
    for line in lines:
        line = line.strip()
        if line.startswith("## IA-"):
            current_ia = line.split(":")[0].replace("##", "").strip()
        if line.startswith("| `") and "|" in line:
            parts = [p.strip() for p in line.split("|")[1:-1]]
            if not parts:
                continue
            item_id = parts[0].replace("`", "")
            screen = parts[1]
            
            # Format detection: 14 columns execution format vs 10 columns design format
            if len(parts) >= 12:
                cat = parts[2].replace("`", "")
                full_check = parts[3].replace("<br>", "\n").replace("\\|", "|")
                expected = parts[4].replace("\\|", "|")
                priority = parts[5]
                source = parts[6]
                why_missed = parts[7].replace("\\|", "|")
            else:
                cat = parts[2].replace("`", "")
                cond = parts[3]
                chk = parts[4]
                expected = parts[5]
                observed = parts[6] if len(parts) > 6 else ""
                priority = parts[7] if len(parts) > 7 else "Medium"
                tech_notes = parts[9] if len(parts) > 9 else ""

                source = "Human" if ("Human" in tech_notes or item_id.startswith("H-")) else "AI"
                why_missed = ""
                if source == "Human":
                    m = re.search(r'\[Lý do AI bỏ sót:\s*(.*?)\]', tech_notes)
                    if m:
                        why_missed = m.group(1).strip()
                full_check = f"[Điều kiện] {cond}\n[Kiểm tra] {chk}" if cond else chk

            # Deduce IA if not parsed
            ia_val = current_ia
            if not ia_val:
                m_ia = re.search(r'IA-?0?([1-4])', item_id)
                if m_ia:
                    ia_val = f"IA-0{m_ia.group(1)}"

            items.append({
                "id": item_id,
                "screen": screen,
                "ia": ia_val,
                "category": cat,
                "check": full_check,
                "expected": expected,
                "priority": priority,
                "source": source,
                "why_missed": why_missed
            })
    return items

def create_excel_checklist(items, output_xlsx, platforms=("Chrome", "Firefox", "Safari")):
    openpyxl = ensure_openpyxl()
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
    from openpyxl.worksheet.datavalidation import DataValidation

    wb = Workbook()
    
    # --- Sheet 1: Checklist ---
    ws = wb.active
    ws.title = "Checklist"

    headers = [
        "ID", "Screen", "IA", "Category", "Check", "Expected result",
        "Priority", "Source", "Why AI missed it (human items)"
    ]
    for plat in platforms:
        headers.append(f"Result: {plat}")
    headers.extend(["Notes", "Screenshot ref", "Bug ID"])

    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    header_fill = PatternFill(start_color="1F497D", end_color="1F497D", fill_type="solid")
    center_align = Alignment(horizontal="center", vertical="center", wrap_text=True)
    left_align = Alignment(horizontal="left", vertical="center", wrap_text=True)
    border_thin = Border(
        left=Side(style='thin', color='D9D9D9'),
        right=Side(style='thin', color='D9D9D9'),
        top=Side(style='thin', color='D9D9D9'),
        bottom=Side(style='thin', color='D9D9D9')
    )

    ws.append(headers)
    ws.row_dimensions[1].height = 28
    for col_idx in range(1, len(headers) + 1):
        cell = ws.cell(row=1, column=col_idx)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = center_align

    # Add items
    for row_idx, item in enumerate(items, start=2):
        row_data = [
            item["id"],
            item["screen"],
            item["ia"],
            item["category"],
            item["check"],
            item["expected"],
            item["priority"],
            item["source"],
            item["why_missed"],
            "", "", "",  # Platform results
            "", "", ""   # Notes, Screenshot ref, Bug ID
        ]
        ws.append(row_data)
        ws.row_dimensions[row_idx].height = 50

        for col_idx in range(1, len(headers) + 1):
            cell = ws.cell(row=row_idx, column=col_idx)
            cell.border = border_thin
            if col_idx in [1, 2, 3, 7, 8, 10, 11, 12, 15]:
                cell.alignment = center_align
            else:
                cell.alignment = left_align

    # Data Validation for Passed / Failed
    dv = DataValidation(type="list", formula1='"Passed,Failed"', allow_blank=True)
    ws.add_data_validation(dv)
    
    max_row = max(len(items) + 1, 100)
    dv.add(f"J2:L{max_row}")

    # Set column widths
    col_widths = {
        "A": 16, "B": 14, "C": 10, "D": 26, "E": 44, "F": 46,
        "G": 12, "H": 10, "I": 32, "J": 15, "K": 15, "L": 15,
        "M": 30, "N": 30, "O": 15
    }
    for col, width in col_widths.items():
        ws.column_dimensions[col].width = width

    ws.freeze_panes = "A2"

    # --- Sheet 2: Summary ---
    ws_sum = wb.create_sheet(title="Summary")
    ws_sum.views.sheetView[0].showGridLines = True
    
    ws_sum.cell(row=1, column=1, value="GUI Checklist Execution Summary").font = Font(name="Calibri", size=14, bold=True, color="1F497D")

    summary_headers = ["Metric"] + list(platforms)
    ws_sum.append([])
    ws_sum.append(summary_headers)
    ws_sum.row_dimensions[3].height = 24

    for c_idx in range(1, len(summary_headers) + 1):
        c = ws_sum.cell(row=3, column=c_idx)
        c.font = header_font
        c.fill = header_fill
        c.alignment = center_align

    total_items = len(items)
    row_count = total_items + 1

    metrics = [
        ("Items Designed", [f"=COUNTA(Checklist!A2:A{row_count})"] * len(platforms)),
        ("Items Executed", [f'=COUNTIF(Checklist!{chr(ord("J")+i)}2:{chr(ord("J")+i)}{row_count}, "<>")' for i in range(len(platforms))]),
        ("Passed", [f'=COUNTIF(Checklist!{chr(ord("J")+i)}2:{chr(ord("J")+i)}{row_count}, "Passed")' for i in range(len(platforms))]),
        ("Failed", [f'=COUNTIF(Checklist!{chr(ord("J")+i)}2:{chr(ord("J")+i)}{row_count}, "Failed")' for i in range(len(platforms))])
    ]

    for label, formulas in metrics:
        ws_sum.append([label] + formulas)

    for r in range(4, 8):
        ws_sum.row_dimensions[r].height = 20
        ws_sum.cell(row=r, column=1).font = Font(name="Calibri", size=11, bold=True)
        for c in range(1, len(summary_headers) + 1):
            cell = ws_sum.cell(row=r, column=c)
            cell.border = border_thin
            if c > 1:
                cell.alignment = center_align

    ws_sum.column_dimensions["A"].width = 25
    for i in range(len(platforms)):
        col_letter = chr(ord('B') + i)
        ws_sum.column_dimensions[col_letter].width = 16

    wb.save(output_xlsx)
    print(f"[SUCCESS] Multi-platform checklist Excel created: {output_xlsx}")

if __name__ == "__main__":
    md_file = sys.argv[1] if len(sys.argv) > 1 else "checklist.md"
    out_file = sys.argv[2] if len(sys.argv) > 2 else "checklist.xlsx"
    items = parse_markdown_checklist(md_file)
    create_excel_checklist(items, out_file)
