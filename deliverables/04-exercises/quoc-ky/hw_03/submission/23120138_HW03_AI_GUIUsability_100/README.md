# HW03 – GUI & Usability Testing (Software Testing, CSC13003)

**Student Name:** Nguyễn Quốc Kỳ  
**Student ID:** 23120138  
**Class / Cohort:** CSC13003 – FIT @ HCMUS  
**Student Email:** `quockinguyen.lv@gmail.com`  
**SUT Repository:** [faker26052005-lgtm/SUT-EShop](https://github.com/faker26052005-lgtm/SUT-EShop)  
**Branch:** `QuocKy-HW03`  

---

## 1. Self-Assessment Table

| No. | Criteria | Max Grade | Self-Assessed Grade | Justification & Verification Link |
|---|---|---|---|---|
| **1** | **Task 1 — GUI Checklist**<br>(Design + Execution + Bug Report) | 30 | *[30 / 30]* | Designed >40 items covering IA-01 to IA-04; reviewed AI drafts; added human items with explicit rationale; executed against SUT; filed detailed GitHub issues with screenshots. See [HW03_Report.md](HW03_Report.md) & [Bug_Report.md](Bug_Report.md). |
| **2** | **Task 2 — Usability Evaluation**<br>(Task Scenario + 7 Sessions + Analysis) | 40 | *[40 / 40]* | Conducted 1 pilot + 7 moderated Think-Aloud sessions with real participants outside class; scored SUS according to standard Brooke formula; ranked findings via Criticality matrix ($S \times P$); reported bugs. |
| **3** | **Task 3 — Cross-Browser / Cross-Platform**<br>(≥ 3 Platforms) | 20 | *[20 / 20]* | Executed checklist across 3 platforms (Chrome, Firefox, Safari/Expo Go mobile); captured empirical screenshots featuring mandatory student email/ID overlay and localhost URL. |
| **4** | **Task 4 — Agent Skills & Demos** | 10 | *[10 / 10]* | Developed reusable agent skills (`gui-checklist-coach`, `usability-evaluation-coach`) and recorded end-to-end demonstration videos published on YouTube. |
| | **Total Grade** | **100** | **[100 / 100]** | |

---

## 2. Test Summary Report

| Metric | Target / Requirement | Actual Result |
|---|---|---|
| **Screens Tested (Task 1 & 3)** | $\ge 1$ screen (2 recommended) | **2 screens:** `Cart` & `Checkout` |
| **Usability Flow Tested (Task 2)** | 1 End-to-End User Flow | `Product Selection → Add to Cart → Apply Coupon → Checkout` |
| **Checklist Items Designed** | $> 40$ items | **73 items** (70 AI + 3 Human items across IA-01..IA-04) |
| **Checklist Items Executed (per platform)** | Complete execution on $\ge 3$ platforms | **73 per platform** (100% executed on Chrome, Firefox, Safari) |
| **Checklist Passed (Platform 1: Chrome)** | Audited Pass/Fail | **51 Passed** |
| **Checklist Failed (Platform 1: Chrome)** | Audited with Notes & Screenshots | **22 Failed** (Audited with empirical screenshots) |
| **Checklist Passed (Platform 2: Firefox)** | Audited Pass/Fail | **51 Passed** |
| **Checklist Failed (Platform 2: Firefox)** | Audited with Notes & Screenshots | **22 Failed** (Audited with empirical screenshots) |
| **Checklist Passed (Platform 3: Safari/Mobile)**| Audited Pass/Fail | **51 Passed** |
| **Checklist Failed (Platform 3: Safari/Mobile)**| Audited with Notes & Screenshots | **22 Failed** (Audited with empirical screenshots) |
| **Genuine Bugs Discovered & Logged** | Reported in Markdown + GitHub Issues | **24 Bugs** (22 GUI Bugs #117–#138 + 2 Usability Bugs #159, #160) |
| **Real Usability Participants Tested** | Exactly 7 non-classmate participants | **7 participants** (`P01` to `P07`) + 1 pilot (`PILOT`) |
| **Average System Usability Score (SUS)**| Evaluated vs. industry avg (68) | **76.79 / 100** (Median: 77.50; +8.79 vs. industry avg ~68.0) |

---

## 3. Demonstration Videos (YouTube Links)

- **Agent Skills Demonstration (`gui-checklist-coach` & `usability-evaluation-coach`):** [https://www.youtube.com/watch?v=hHmWuolx5Dk](https://www.youtube.com/watch?v=hHmWuolx5Dk)  
  *(Comprehensive walkthrough of both agent skills: GUI checklist 7-phase execution, Pilot & Batch GitHub automation, think-aloud usability evaluation, and automated SUS/Criticality computation).*

---

## 4. Deliverables Index & Submission Architecture

Tất cả các tài liệu nộp bài được tổ chức khoa học, tuân thủ nghiêm ngặt quy chế §14 ([hw03.md](hw03.md)) và giải quyết triệt để giới hạn dung lượng tải lên của Moodle ($\le 20\text{ MB}$):

### 4.1 Báo cáo & Tài liệu nghiệm thu (Reports & Documents)

| Tài liệu | Định dạng | Mục đích & Nội dung chi tiết |
|---|:---:|---|
| **Main Testing Report** | [`HW03_Report.md`](HW03_Report.md)<br>[`HW03_Report.pdf`](HW03_Report.pdf) | Báo cáo chính toàn diện kết hợp: Task 1 (Thiết kế & thực thi 73 items GUI Checklist), Task 2 (Kế hoạch, kịch bản, bảng điểm SUS 76.79 trên 7 người dùng), Task 3 (Ma trận so sánh cross-platform Chrome/Firefox/Safari), và Task 4 (Tổng quan 2 Agent Skills). |
| **Defect Bug Report** | [`Bug_Report.md`](Bug_Report.md)<br>[`Bug_Report.pdf`](Bug_Report.pdf) | Báo cáo chi tiết **24 lỗi thực tế** (22 lỗi GUI #117–#138, 2 lỗi Usability #159, #160). Mỗi lỗi đều được đặc tả theo chuẩn IEEE 829 với đầy đủ bước tái hiện, kết quả mong đợi/thực tế và ảnh minh chứng nhúng trực tiếp. |
| **AI Audit Report** | [`AI_Audit_Report.md`](AI_Audit_Report.md)<br>[`AI_Audit_Report.pdf`](AI_Audit_Report.pdf) | Phụ lục kiểm toán bắt buộc ghi nhận chi tiết 24 artifacts tương tác AI theo chuẩn FIT@HCMUS, có đầy đủ prompt, output, phán quyết, trích dẫn ISTQB FL v4.0 và kết luận. |
| **AI Critique** | [`AI_Critique.md`](AI_Critique.md)<br>[`AI_Critique.pdf`](AI_Critique.pdf) | Đoạn văn phản biện bắt buộc 200–300 từ (thực tế: **292 từ**) do sinh viên trực tiếp đúc kết từ trải nghiệm thực tế với AI, phân tích ảo giác DOM/CSS, thiên kiến US và bài học về vai trò trung tâm của con người. |
| **Git Commit Log** | [`git-commit-log.txt`](git-commit-log.txt) | Toàn bộ lịch sử commit Git định dạng chuẩn `%h \| %ad \| %an \| %s`, phản ánh timeline thực tế của từng bước kiểm thử (checklist, review, execution, 7 sessions, bugs, reports). |
| **YouTube Video Demo** | [`youtube-demo-link.txt`](youtube-demo-link.txt) | File text độc lập lưu trữ thông tin sinh viên, kịch bản tóm tắt và đường link video YouTube trình diễn trọn vẹn 2 Agent Skills: [https://www.youtube.com/watch?v=hHmWuolx5Dk](https://www.youtube.com/watch?v=hHmWuolx5Dk). |

### 4.2 Dữ liệu kiểm thử & Hồ sơ minh chứng (Test Artifacts & Evidence)

| Hạng mục | Thư mục / File | Mô tả chi tiết |
|---|---|---|
| **GUI Checklist** | [`hw03-gui-checklist/`](hw03-gui-checklist/) | Gồm file bảng tính `checklist.xlsx` (73 items phủ 4 khía cạnh IA-01..IA-04, có công thức đếm động cho 3 nền tảng), bản sao `checklist.md`, và báo cáo đối chiếu `test-summary.md`. |
| **Hồ sơ Usability** | [`usability/`](usability/) | Kế hoạch kiểm thử (`01-test-plan.md`), kịch bản nhiệm vụ (`02-task-scenario.md`), bộ công cụ tiếng Việt (`03-instruments-vi.md`), báo cáo pilot (`05-pilot-review.md`), ghi chép 7 phiên thực tế (`sessions/P01..P07`), dữ liệu định lượng (`data/*.csv`), và báo cáo tổng kết (`08-usability-report.md`). |
| **Danh sách 7 người tham gia** | [`usability/participants.md`](usability/participants.md) | Bảng thông tin 7 người tham gia thực tế ngoài lớp + 1 pilot (đã che 4 số giữa SĐT để bảo mật). File này được đưa vào gói ZIP để phục vụ TA gọi ngẫu nhiên hậu kiểm (§11). |
| **Mã nguồn Agent Skills** | [`skills/`](skills/) | Mã nguồn hoàn chỉnh của 2 skills: `gui-checklist-coach` và `usability-evaluation-coach`, kèm các script tự động hóa (`generate_checklist_excel.py`, `create_github_issues.py`, `score_usability.py`). |
| **Kịch bản Demo Video** | [`Agent-Skill-script-HW03.md`](Agent-Skill-script-HW03.md) | Bản kịch bản chi tiết từng bước, lời thoại và thao tác quay màn hình cho video demo 2 Agent Skills. |

### 4.3 Lưu ý về Hình ảnh Minh chứng & Giới hạn dung lượng Moodle (20 MB)

> [!NOTE]
> **Giải pháp tối ưu dung lượng gói nộp bài:**
> 1. **Hiển thị trực quan:** Toàn bộ 81 ảnh minh chứng lỗi giao diện đa nền tảng đã được **nhúng trực tiếp, sắc nét trong file `Bug_Report.pdf` và `HW03_Report.pdf`** để Giảng viên và TA thuận tiện xem và chấm điểm ngay lập tức.
> 2. **Lưu trữ gốc trên GitHub:** Do hệ thống Moodle giới hạn file tải lên tối đa **20 MB**, toàn bộ 81 file ảnh PNG gốc chất lượng cao (~39 MB) được lưu trữ vĩnh viễn trên repository:  
>    🔗 **Remote Evidence:** [`faker26052005-lgtm/SUT-EShop/evidence/screenshots`](https://github.com/faker26052005-lgtm/SUT-EShop/tree/QuocKy-HW03/deliverables/04-exercises/quoc-ky/hw_03/evidence/screenshots)  
>    Từng issue trên GitHub (`#117`–`#138`) và từng mục trong file Markdown đều liên kết trực tiếp (commit-pinned) tới các ảnh này.
