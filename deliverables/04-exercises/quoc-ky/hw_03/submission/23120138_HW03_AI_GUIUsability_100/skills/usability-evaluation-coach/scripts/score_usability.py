#!/usr/bin/env python3
"""
score_usability.py
Helper script for the usability-evaluation-coach skill (HW03 Task 2).
Computes SUS scores, performance statistics, and criticality rankings
from raw CSV data, outputting formatted Markdown tables for 06-analysis.md.
"""

import argparse
import csv
import math
import sys
from pathlib import Path

def calculate_stats(values):
    if not values:
        return {"n": 0, "mean": 0.0, "median": 0.0, "min": 0.0, "max": 0.0, "sd": 0.0}
    n = len(values)
    s_vals = sorted(values)
    mean_val = sum(s_vals) / n
    if n % 2 == 1:
        median_val = s_vals[n // 2]
    else:
        median_val = (s_vals[n // 2 - 1] + s_vals[n // 2]) / 2.0
    min_val = s_vals[0]
    max_val = s_vals[-1]
    if n > 1:
        variance = sum((x - mean_val) ** 2 for x in s_vals) / (n - 1)
        sd_val = math.sqrt(variance)
    else:
        sd_val = 0.0
    return {
        "n": n,
        "mean": mean_val,
        "median": median_val,
        "min": min_val,
        "max": max_val,
        "sd": sd_val,
    }

def process_sus(sus_csv_path):
    rows = []
    with open(sus_csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            p_id = r["participant"].strip()
            # Items 1 to 10
            odd_items = [int(r[f"q{i}"]) - 1 for i in [1, 3, 5, 7, 9]]
            even_items = [5 - int(r[f"q{i}"]) for i in [2, 4, 6, 8, 10]]
            score = (sum(odd_items) + sum(even_items)) * 2.5
            rows.append({"participant": p_id, "score": score})
    scores = [r["score"] for r in rows]
    stats = calculate_stats(scores)
    return rows, stats

def process_performance(perf_csv_path, benchmark_seconds=None):
    rows = []
    with open(perf_csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows.append({
                "participant": r["participant"].strip(),
                "time": float(r["time_seconds"]),
                "outcome": r["outcome"].strip().lower(),  # success, assisted, fail
                "errors": int(r["error_count"]),
                "help": int(r.get("help_requests", 0)),
            })
    n = len(rows)
    if n == 0:
        return {}, {}
    
    # Outcomes
    success_count = sum(1 for r in rows if r["outcome"] == "success")
    assisted_count = sum(1 for r in rows if r["outcome"] == "assisted")
    fail_count = sum(1 for r in rows if r["outcome"] == "fail")
    completed = [r for r in rows if r["outcome"] in ("success", "assisted")]
    
    completed_times = [r["time"] for r in completed]
    time_stats = calculate_stats(completed_times)
    
    error_stats = calculate_stats([r["errors"] for r in rows])
    help_stats = calculate_stats([r["help"] for r in rows])
    
    within_bm_count = 0
    if benchmark_seconds is not None:
        within_bm_count = sum(1 for r in rows if r["outcome"] == "success" and r["time"] <= benchmark_seconds)
    
    summary = {
        "total_participants": n,
        "success_rate": (success_count / n) * 100,
        "assisted_rate": (assisted_count / n) * 100,
        "fail_rate": (fail_count / n) * 100,
        "completion_rate": ((success_count + assisted_count) / n) * 100,
        "time_stats": time_stats,
        "avg_errors": error_stats["mean"],
        "avg_help": help_stats["mean"],
        "benchmark_seconds": benchmark_seconds,
        "within_bm_rate": (within_bm_count / n) * 100 if benchmark_seconds else None,
    }
    return rows, summary

def process_findings(findings_csv_path, total_participants=7):
    severity_map = {
        "4": ("Blocker", 4),
        "blocker": ("Blocker", 4),
        "3": ("Major", 3),
        "major": ("Major", 3),
        "2": ("Minor", 2),
        "minor": ("Minor", 2),
        "1": ("Cosmetic", 1),
        "cosmetic": ("Cosmetic", 1),
    }
    rows = []
    with open(findings_csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            f_id = r["id"].strip()
            title = r["title"].strip()
            f_type = r["type"].strip().lower()
            raw_sev = r["severity"].strip().lower()
            sev_name, sev_score = severity_map.get(raw_sev, (raw_sev.capitalize(), 2))
            
            affected = [p.strip() for p in r["affected_participants"].split(";") if p.strip()]
            aff_count = len(affected)
            prob = aff_count / total_participants if total_participants > 0 else 0
            crit = sev_score * prob
            
            # Blocker / Major Override Rule
            if sev_score == 4:
                band = "Fix First (Blocker Override)"
            elif sev_score == 3 and aff_count >= 2:
                band = "Fix First (Major Override)"
            elif crit >= 2.0:
                band = "Fix First"
            elif crit >= 1.0:
                band = "High"
            elif crit >= 0.5:
                band = "Medium"
            else:
                band = "Low"
                
            rows.append({
                "id": f_id,
                "title": title,
                "type": f_type,
                "severity_name": sev_name,
                "severity_score": sev_score,
                "affected": affected,
                "affected_count": aff_count,
                "probability": prob,
                "criticality": crit,
                "band": band,
            })
            
    # Sort descending by severity score then criticality
    rows.sort(key=lambda x: (x["severity_score"], x["criticality"]), reverse=True)
    return rows

def generate_markdown(sus_rows, sus_stats, perf_rows, perf_summary, findings):
    md = []
    md.append("## Usability Evaluation Quantitative Summary\n")
    
    # 1. SUS
    md.append("### 1. System Usability Scale (SUS) Results\n")
    md.append("| Participant | SUS Score (0–100) | Interpretation (vs. Industry Avg ~68) |")
    md.append("|---|:---:|---|")
    for r in sus_rows:
        diff = r["score"] - 68.0
        interp = f"+{diff:.1f} (Above Average)" if diff >= 0 else f"{diff:.1f} (Below Average)"
        md.append(f"| {r['participant']} | {r['score']:.1f} | {interp} |")
    md.append("")
    md.append(f"- **Sample Size ($n$):** {sus_stats['n']}")
    md.append(f"- **Mean SUS Score:** {sus_stats['mean']:.2f}")
    md.append(f"- **Median SUS Score:** {sus_stats['median']:.2f}")
    md.append(f"- **Standard Deviation ($s$):** {sus_stats['sd']:.2f}")
    md.append(f"- **Range:** {sus_stats['min']:.1f} – {sus_stats['max']:.1f}\n")
    
    # 2. Performance
    md.append("### 2. Task Performance Summary\n")
    t_stats = perf_summary["time_stats"]
    md.append(f"- **Completion Rate:** {perf_summary['completion_rate']:.1f}% "
              f"({perf_summary['success_rate']:.1f}% unassisted, {perf_summary['assisted_rate']:.1f}% assisted, {perf_summary['fail_rate']:.1f}% failed)")
    if perf_summary["benchmark_seconds"]:
        md.append(f"- **Within Benchmark (≤ {perf_summary['benchmark_seconds']}s):** {perf_summary['within_bm_rate']:.1f}%")
    md.append(f"- **Mean Time on Task (completed):** {t_stats['mean']:.1f}s (Median: {t_stats['median']:.1f}s, SD: {t_stats['sd']:.1f}s, Range: {t_stats['min']:.1f}s – {t_stats['max']:.1f}s)")
    md.append(f"- **Average Errors per Session:** {perf_summary['avg_errors']:.2f}")
    md.append(f"- **Average Help Requests:** {perf_summary['avg_help']:.2f}\n")
    
    # 3. Criticality Table
    md.append("### 3. Criticality-Ranked Findings Table\n")
    md.append("| ID | Title | Type | Severity | Affected ($n=7$) | Prob | Criticality | Priority Band |")
    md.append("|---|---|:---:|:---:|---|:---:|:---:|---|")
    for f in findings:
        aff_str = f"[{', '.join(f['affected'])}] ({f['affected_count']})"
        md.append(f"| {f['id']} | {f['title']} | {f['type']} | {f['severity_name']} | {aff_str} | {f['probability']:.2f} | {f['criticality']:.2f} | **{f['band']}** |")
    md.append("")
    return "\n".join(md)

def main():
    parser = argparse.ArgumentParser(description="Calculate usability evaluation metrics.")
    parser.add_argument("--dir", default="usability/data", help="Directory containing sus.csv, performance.csv, and findings.csv")
    parser.add_argument("--benchmark", type=float, default=None, help="Benchmark completion time in seconds")
    parser.add_argument("--output", default=None, help="Optional output Markdown file")
    args = parser.parse_args()

    data_dir = Path(args.dir)
    sus_file = data_dir / "sus.csv"
    perf_file = data_dir / "performance.csv"
    findings_file = data_dir / "findings.csv"

    if not (sus_file.exists() and perf_file.exists() and findings_file.exists()):
        print(f"Error: Required CSV files not found in {data_dir}. Expected sus.csv, performance.csv, findings.csv", file=sys.stderr)
        sys.exit(1)

    sus_rows, sus_stats = process_sus(sus_file)
    perf_rows, perf_summary = process_performance(perf_file, benchmark_seconds=args.benchmark)
    findings = process_findings(findings_file, total_participants=len(perf_rows) or 7)

    markdown_output = generate_markdown(sus_rows, sus_stats, perf_rows, perf_summary, findings)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(markdown_output)
        print(f"Metrics written to {args.output}")
    else:
        print(markdown_output)

if __name__ == "__main__":
    main()
