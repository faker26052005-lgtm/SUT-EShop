# Task 2 – Usability Evaluation Executive Summary

## 1. Key Metrics Overview

| Metric | Target / Course Standard | Observed Usability Result | Assessment |
|---|:---:|:---:|:---:|
| **Evaluated User Flow** | 1 End-to-End Core Flow | `Product selection → Add to cart → Apply coupon → Checkout` | Full transaction flow covering FR-05, FR-06, FR-07, FR-09, FR-08 |
| **SUT Platform & Baseline** | Working desktop web app | Google Chrome Desktop / Ubuntu & Windows (`http://localhost:3000`) | Baseline commit `35b8c5a` |
| **Participants Recruited** | 7 real participants + 1 pilot | **8 participants total** (1 Pilot + 7 Experimental P01–P07) | 100% outside course; zero CSC13003 students |
| **Evaluation Protocol** | Assessment Testing | Concurrent Think-Aloud (CTA) with 1-on-1 moderation | Zero moderator hints unless deadlocked > 2 min |
| **Time on Task Benchmark** | Calibrated duration | **$\le 150$ seconds** (Calibrated from 142s pilot run) | Initial 180s formally refined in Phase 5 |
| **Unassisted Completion Rate** | Primary success metric | **85.7%** (6 / 7 participants unassisted) | 1 assisted (P05 due to coupon threshold); 0 failed |
| **Overall Completion Rate** | Completion before timeout | **100.0%** (7 / 7 participants completed) | 100% reached order confirmation screen |
| **Mean Time on Task** | Total execution time | **140.9 seconds** ($\approx 2$m 21s) | Median: 135.0s, SD: 31.0s, Range: 105s – 195s |
| **Within Benchmark ($\le 150$s)**| Speed efficiency target | **71.4%** (5 / 7 participants) | P02 (+18s) and P05 (+45s) exceeded benchmark |
| **Average Errors / Session** | Cognitive/motor slips | **1.29 errors / participant** | Total 9 errors recorded across 7 sessions |
| **System Usability Scale (SUS)**| Standard Brooke formula | **76.79 / 100** ($\bar{x}$) | Median: 77.50, SD: 18.64, Range: 42.5 – 100.0 |
| **SUS vs. Industry Average** | Industry Benchmark (~68.0) | **+8.79 points Above Average** | Grade B / Good usability overall |
| **Genuine Usability Bugs** | Filed on GitHub | **2 issues** ([#159](https://github.com/faker26052005-lgtm/SUT-EShop/issues/159), [#160](https://github.com/faker26052005-lgtm/SUT-EShop/issues/160)) | F-01 (Major, Fix First) & F-02 (Minor, Low) |
| **Usability Design Issues** | Prioritized in Report | **3 findings** (F-03, F-04, F-05) | Success toast, visual prominence, drawer hierarchy |

---

## 2. Post-Task Probe Dimension Scores (1–5 Likert Scale)

| Dimension | Average Score ($\bar{x}$) | Median | Primary Participant Feedback |
|---|:---:|:---:|---|
| **Speed & Flow** | **4.43 / 5.0** | 5.0 | Very fast client-side navigation, instant cart quantity updates, and responsive checkout confirmation. |
| **Trust** | **4.43 / 5.0** | 5.0 | Transparent order breakdown, exact 10% coupon math, and familiar Cash on Delivery (COD) option reassure users. |
| **Clarity** | **3.71 / 5.0** | 4.0 | Bright visual design, but coupon input field is visually understated and easily overlooked on cart screen. |
| **Error Recovery** | **3.29 / 5.0** | 3.0 | Weakest dimension. Generic error toasts fail to explain why coupons are rejected; absence of success toast causes double-clicks. |
