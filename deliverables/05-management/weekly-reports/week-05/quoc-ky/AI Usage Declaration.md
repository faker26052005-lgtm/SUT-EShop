# AI Usage Declaration — Tuần 05

**Môn học:** Kiểm thử phần mềm (Software Testing) — FIT@HCMUS  
**Chủ đề:** T06 · API & Contract Testing  
**Nhóm thực hiện:** Nhóm 11 (FIT@HCMUS)  
**Thành viên:** Nguyễn Quốc Kỳ (Phụ trách Karate, K1–K3), Hà Quốc Kiên, Nguyễn Hoàng Anh Tú  
**Công cụ AI sử dụng:** Google Antigravity (Gemini 3.8 Flash)  
**Môi trường:** Linux (Ubuntu) · Antigravity Agent Runtime  

---

## 1. Tuyên Bố & Mục Đích Sử Dụng AI trong Tuần

Theo quy định của môn học Seminar Kiểm thử phần mềm (FIT@HCMUS):
- **Phạm vi hỗ trợ của AI:** Hỗ trợ phân tích yêu cầu từ `weekly-report-requirements.md`, đối chiếu tài liệu đặc tả API, phác thảo kế hoạch và cú pháp kịch bản kiểm thử Karate (DSL/Gherkin), hỗ trợ tra cứu giải pháp kỹ thuật.
- **Cam kết chính chủ & Human-in-the-loop:** Toàn bộ mã nguồn kiểm thử Karate, cấu hình dự án Maven, và kết quả chạy test trên SUT (EShop) đều do thành viên nhóm trực tiếp kiểm chứng, thực thi thực tế trên môi trường local, đối chiếu lỗi và chịu trách nhiệm 100% về tính chính xác. AI đóng vai trò trợ lý đề xuất, không thay thế việc kiểm thử thực tế.

---

## 2. Nhật Ký Phiên Làm Việc (Sessions Log)

<!-- START_SESSION: 73ecf000 -->
### Phiên làm việc: 2026-10-21 15:00:06 (Session ID: `73ecf000`)
- **Mô hình / Công cụ:** Google Antigravity (Gemini 3.8 Flash)
- **Tổng số lượt tương tác (Turns):** 2
- **Thời gian bắt đầu:** 2026-10-21 15:00:06

#### Bảng Tổng Hợp Tương Tác & Kết Quả (Executive Summary Table)
| Lượt | Thời gian | Yêu cầu người dùng (Prompt đầy đủ) | Kết quả thực tế từ AI (Actual Deliverables & Outcomes) | Quyết định / Review của SV |
| :--- | :--- | :--- | :--- | :--- |
| #1 | 2026-10-21 15:00:06 | đọc task_assignment.md, ở phase 2, tôi còn bỏ sót Pact C3. Anh Tú đã thực hiện C1 và C2 rồi. Hãy phân tích Pact hiện tại và đưa ra kế hoạch thực hiện chi tiết cho C3. | <strong>Sản phẩm/Tác vụ:</strong><br/>Tạo file: `implementation_plan.md`<br/><br/><strong>Nội dung phản hồi / Giải pháp:</strong><br/>• Tôi đã đọc kĩ `task_assignment.md`, đối chiếu với `demo-script.md`, lịch sử commit Git và toàn bộ mã nguồn Pact hiện tại trong dự án.<br/>• 1. Phân tích hiện trạng Pact và lý do bạn bị "bỏ sót" C3<br/>• 1. **Phân công trách nhiệm:** | Thành viên nhóm review & phê duyệt kết quả |
| #2 | 2026-10-21 15:11:09 | triển khai kế hoạch hoạch đồng thời tạo một tài liệu về những gì thực hiện cho C3 task tại weekly-reports/week-05/quoc-ky/ | <strong>Sản phẩm/Tác vụ:</strong><br/>Tạo file: `Pact_C3_Execution_Guide.md`, `Weekly_Technical_Report.html`, `Weekly_Technical_Report.md`, `pact-c3-runner.js`<br/>Cập nhật file: `README.md`, `package.json`, `pact-c3-runner.js`, `task-assignment.md`<br/><br/><strong>Nội dung phản hồi / Giải pháp:</strong><br/>• Đang tiến hành cài đặt thư viện cho Pact JS (`npm install` trong `tests/pact`). Hệ thống sẽ tự động cập nhật khi quá trình hoàn tất. | Thành viên nhóm review & phê duyệt kết quả |

#### Nhật Ký Chi Tiết Hội Thoại (Traceable Chat Log)
<details>
<summary><strong>Turn #1: đọc task_assignment.md, ở phase 2, tôi còn bỏ sót Pact C3. Anh Tú đã thực hiện C1 và C2 rồi. Hãy phân tích Pact hiện tại và đưa ra kế hoạch thực hiện chi tiết cho C3.</strong> (2026-10-21 15:00:06)</summary>

**Yêu cầu của Người dùng (Prompt đầy đủ):**
```text
đọc task_assignment.md, ở phase 2, tôi còn bỏ sót Pact C3. Anh Tú đã thực hiện C1 và C2 rồi. Hãy phân tích Pact hiện tại và đưa ra kế hoạch thực hiện chi tiết cho C3.
```

**Các hành động & Công cụ đã thực thi:**
- `find_by_name`: Find task assignment file
- `list_dir`: List root directory
- `find_by_name`: Find markdown files
- `find_by_name`: Find project files
- `view_file`: Read task-assignment.md
- `view_file`: Read demo-script.md
- `find_by_name`: Find pact files
- `list_dir`: List tests/pact contents
- `view_file`: Read pact package.json
- `view_file`: Read tests/pact/README.md
- `view_file`: Read product-client.js
- `view_file`: Read product.consumer.test.js
- `view_file`: Read provider verify.js
- `view_file`: Read verify-breaking.js
- `run_command`: Check recent git commits
- `run_command`: Check recent git commits
- `run_command`: Check recent git commits
- `run_command`: Check SUT-EShop git status
- `run_command`: Check SUT-EShop git history
- `run_command`: Show commit 726c9a8 details
- `find_by_name`: Find weekly report files
- `view_file`: Read Anh Tu technical report
- `view_file`: Read Quoc Ky evidence summary
- `view_file`: Read lab-guide.md
- `grep_search`: Grep C3 in deliverables
- `view_file`: Read server.js product endpoint
- `run_command`: Check git branches
- `run_command`: Check QuocKy-Phase2 branch commits
- `run_command`: Show commit e021d17
- `run_command`: List tests/pact files
- `run_command`: Check node and npm version
- `view_file`: Read EShopMobile-EShopBackend.json
- `write_to_file`: Write implementation_plan.md

**Kết quả phản hồi của AI:**

Tôi đã đọc kĩ [`task_assignment.md`](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/05-management/task-assignment.md), đối chiếu với [`demo-script.md`](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/03-demo-videos/demo-script.md), lịch sử commit Git và toàn bộ mã nguồn Pact hiện tại trong dự án.

### 1. Phân tích hiện trạng Pact và lý do bạn bị "bỏ sót" C3

1. **Phân công trách nhiệm:**
   - Theo `task_assignment.md` (Phase 2): Anh Tú phụ trách **C1, C2**; Bạn (**Kỳ**) phụ trách chính kịch bản **C3** (*"Tạo Breaking Change, verify & Viết hướng dẫn (C3)"*).
   - Tuy nhiên, ở giai đoạn trước, bạn đã tập trung hoàn thiện bộ test **Karate (K1, K2, K3)** và tài liệu liên quan, nên chưa thực hiện trọn vẹn phần việc C3 của mình.
   - Anh Tú trong commit `726c9a8` đã làm C1 (`product.consumer.test.js`), C2 (`verify.js`), đồng thời dựng tạm một script mô phỏng `breaking-change/verify-breaking.js` và ghi nhận cả C3 vào báo cáo cá nhân của anh Tú.

2. **Hạn chế kỹ thuật của kịch bản C3 hiện tại:**
   - **Tách rời SUT thật:** Script `verify-breaking.js` hiện tại dựng một Express server độc lập (cổng 3001) với JSON hardcoded, chưa kiểm chứng tương tác thực tế với Backend SUT EShop (`backend/server.js`).
   - **Thiếu quy trình 3 bước chuẩn:** Theo đặc tả seminar (`demo-script.md` §5.5), kịch bản C3 cần thể hiện trọn vẹn: *Baseline PASS* $\to$ *Tiêm Breaking Change* $\to$ *Pact Verifier FAIL có giải thích* $\to$ *Hoàn nguyên (Rollback) & PASS lại*.
   - **Thiếu deliverables của Kỳ:** Chưa có Git commit cá nhân mang tên Kỳ, chưa có tài liệu hướng dẫn kỹ thuật chi tiết (`Pact_C3_Execution_Guide.md`), và chưa có bộ ảnh chụp/log minh chứng chạy thực tế của Kỳ để nộp theo chuẩn Trụ cột 3 (Pillar 3).

---

### 2. Kế hoạch thực hiện chi tiết cho C3

Tôi đã xây dựng tài liệu kế hoạch chi tiết trong artifact [implementation_plan.md](file:///home/quocky05/.gemini/antigravity/brain/73ecf000-a0d7-49e6-8b6d-1b5f1834dfa1/implementation_plan.md) bao gồm:

- **Bộ script C3 hoàn chỉnh (2 chế độ):**
  1. *Chế độ đối soát trực tiếp SUT thật:* Script điều phối tiêm lỗi trên SUT Backend cổng 3000, đối soát hợp đồng Pact, bắt lỗi và tự động rollback.
  2. *Chế độ chạy mô phỏng độc lập:* Dành cho demo nhanh hoặc bài tập lab của sinh viên.
- **2 ca phá vỡ hợp đồng tiêu biểu:**
  1. Đổi tên trường (`price` $\to$ `unit_price`) — đối chiếu việc Postman vẫn báo 200 OK nhưng Pact chặn đứng bản build lỗi làm sập Mobile app.
  2. Lệch kiểu dữ liệu (`price` từ Integer $\to$ String) — liên kết trực tiếp với defect của SUT phát hiện ở kịch bản Karate K2.
- **Tài liệu hướng dẫn kỹ thuật C3:** `tests/pact/breaking-change/Pact_C3_Execution_Guide.md` do Kỳ biên soạn.
- **Gói minh chứng & Báo cáo:** Chạy thực tế, trích xuất log terminal, cập nhật báo cáo cá nhân và commit Git cho bạn.

Xin mời bạn xem xét kế hoạch tại [implementation_plan.md](file:///home/quocky05/.gemini/antigravity/brain/73ecf000-a0d7-49e6-8b6d-1b5f1834dfa1/implementation_plan.md). Nếu bạn đồng ý với kế hoạch trên hoặc có điểm cần điều chỉnh, hãy phản hồi để tôi tiến hành triển khai!

</details>

<details>
<summary><strong>Turn #2: triển khai kế hoạch hoạch đồng thời tạo một tài liệu về những gì thực hiện cho C3 task tại weekly-reports/week-05/quoc-ky/</strong> (2026-10-21 15:11:09)</summary>

**Yêu cầu của Người dùng (Prompt đầy đủ):**
```text
triển khai kế hoạch hoạch đồng thời tạo một tài liệu về những gì thực hiện cho C3 task tại weekly-reports/week-05/quoc-ky/
```

**Các hành động & Công cụ đã thực thi:**
- `list_dir`: List weekly-reports
- `view_file`: Read weekly-report-requirements.md
- `list_dir`: List week-04 quoc-ky files
- `list_dir`: List week-04 anh-tu files
- `run_command`: Run npm install in tests/pact
- `manage_task`: Check task status
- `run_command`: Run consumer test
- `run_command`: Run test:breaking
- `run_command`: Run provider verification
- `view_file`: Read ai-usage-logger skill
- `write_to_file`: Create pact-c3-runner.js
- `write_to_file`: Write pact-c3-runner.js
- `run_command`: Test pact-c3-runner.js
- `run_command`: Test Pact type matcher with non-numeric string
- `run_command`: Check type coercion in Pact Rust verifier
- `replace_file_content`: Update Pha 2B in pact-c3-runner.js
- `run_command`: Run updated pact-c3-runner.js
- `view_file`: Read package.json
- `replace_file_content`: Add test:c3 to package.json
- `view_file`: Read README.md C3 section
- `replace_file_content`: Update README.md with C3 documentation
- `write_to_file`: Write Pact_C3_Execution_Guide.md
- `view_file`: Read task-assignment.md lines 28-43
- `replace_file_content`: Update task-assignment.md status
- `write_to_file`: Write week-05 Weekly_Technical_Report.md
- `view_file`: Read HTML template styling
- `write_to_file`: Write week-05 Weekly_Technical_Report.html
- `run_command`: Check extract_ai_usage.py help
- `run_command`: Run extract_ai_usage.py for week 05

**Kết quả phản hồi của AI:**

Đang tiến hành cài đặt thư viện cho Pact JS (`npm install` trong `tests/pact`). Hệ thống sẽ tự động cập nhật khi quá trình hoàn tất.

</details>
<!-- END_SESSION: 73ecf000 -->

---

## 3. Tổng Hợp Đánh Giá & Quyết Định của Thành Viên Nhóm (Human Review)

- Mọi mã nguồn và cấu hình do AI đề xuất đều được thành viên nhóm đối chiếu trực tiếp với đặc tả `api_specification.md` và mã nguồn backend `server.js` trước khi thực thi.

---
*Báo cáo được tổng hợp tự động và trích xuất minh chứng từ Antigravity Session Transcript.*
