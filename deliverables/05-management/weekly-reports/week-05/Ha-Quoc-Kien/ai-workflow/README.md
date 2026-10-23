# Workflow AI có người duyệt (Human-in-the-loop) cho kiểm thử API

**Quy trình:** Nạp Skill -> Agent sinh test matrix có truy vết -> **Người duyệt ca test** -> Agent sinh Karate feature -> **Người quyết định chạy** -> Chạy và đánh giá.

Ý tưởng chính: AI sai nhiều nhất ở khoảng giữa "kế hoạch" và "code", nên người chen vào hai chỗ: duyệt matrix trước khi sinh code, và đọc feature trước khi chạy. Skill `api-test-design` ép Agent lấy kỳ vọng từ đặc tả, không từ hành vi quan sát được của hệ thống. **Thứ tự ưu tiên: SRS quyết định hành vi đúng; OpenAPI quyết định hình dạng giao diện; hai bên khác nhau thì theo SRS và ghi lại mâu thuẫn.**

## Cấu trúc

```
ai-workflow/
├── inputs/                 # SRS, OpenAPI, dữ liệu mẫu (Agent phải đọc cả ba)
├── skills/api-test-design/ # Skill: SKILL.md, references/, examples/, scripts/
├── prompts/                # Lời nhắc hệ thống và ba lời nhắc nhiệm vụ
├── karate/                 # karate-config.js, helpers/ (login, create-user), (đặt karate-1.5.2.jar vào đây)
├── tools/                  # make_agent_openapi.py: sinh bản OpenAPI sạch (không đáp án) cho Agent
└── executions/             # Lưu vết từng lần chạy: matrix, feature, báo cáo, kết quả, hội thoại
```

## Chuẩn bị (một lần)

1. **Java 17 trở lên** (đã kiểm chứng với Java 21): `java -version`.
2. **Karate:** tải `karate-1.5.2.jar` ở trang phát hành https://github.com/karatelabs/karate/releases và đặt vào thư mục `karate/`.
3. **EShop:** tải `ttbhanh/eshop-sut`, chạy `npm install` trong `backend`.
4. **Antigravity:** mở thư mục `ai-workflow` làm workspace, rồi chép Skill vào nơi Antigravity tự tìm (theo tài liệu Antigravity, thư mục workspace là `.agents/skills/`). PowerShell:
   ```
   New-Item -ItemType Directory -Force .agents\skills
   Copy-Item -Recurse skills\api-test-design .agents\skills\
   ```
   Sửa Skill ở `skills/` thì nhớ chép lại. Dán `prompts/system-prompt.md` vào phần hướng dẫn của Agent.
5. **Kiểm tra Agent có nhận skill (bắt buộc trước khi quay demo):** hỏi Agent "bạn thấy những skill nào?" hoặc xem danh sách skill trong giao diện. Nếu không thấy, đường dẫn có thể khác ở phiên bản của bạn: thử `.agent/skills/` hoặc phần cài đặt skill của Antigravity; trong khi chưa nhận được, dùng cách dự phòng là dán `system-prompt.md` (đã có câu bảo Agent tự đọc `skills/api-test-design/SKILL.md`).
6. **OpenAPI:** bản gốc có đáp án (nếu có) để ngoài workspace; sinh `inputs/openapi.yaml` bằng `tools/make_agent_openapi.py` (xem `inputs/README.md`).

## Một lần chạy

1. Tạo `executions/run-01-<phạm vi>/`, chép ba tệp trong `_template/` (`test-matrix.md`, `result.md`, `conversation.md`) vào. Điền tên và phiên bản mô hình ở đầu `result.md` và `conversation.md`.
2. Dán **Bước 1** trong `prompts/tasks.md`. Agent sinh `test-matrix.md` rồi dừng.
3. **Người duyệt** cột Duyệt (Y, S, N). 
4. Dán **Bước 2**. Agent sinh `features/` và chạy `check_coverage.py`, rồi dừng.
5. **Người đọc feature**, sửa chỗ assertion yếu, kiểm tra thao tác phá dữ liệu mẫu.
6. Khởi động máy chủ EShop **mới** (`node server.js` trong `backend`), rồi chạy Karate từ thư mục `karate/`:
   ```
   # Windows (PowerShell)
   java -cp "karate-1.5.2.jar;." com.intuit.karate.Main -t "~@slow" -o ../executions/run-01-<phạm vi>/report ../executions/run-01-<phạm vi>/features
   # Linux, macOS: đổi ";" thành ":" trong classpath. Bỏ -t "~@slow" để chạy cả ca phải chờ.
   ```
   Báo cáo: `report/karate-reports/karate-summary.html`.
7. Điền `result.md`: phân loại từng ca đỏ (HT, HT-mới, KY, SC) và **kiểm chứng bằng gọi API trực tiếp**.

## Đã kiểm chứng

Trên EShop thật, với Karate 1.5.2 và Java 21 (Linux):
- Hai ví dụ trong `examples/` (6 scenario): 2 xanh, 4 đỏ, khớp bốn lỗi đã biết B1, B4, B14, B26.
- Các mẫu trong `references/karate-guide.md` (tài khoản tạm, đọc `login_attempts` qua API admin, chờ 31 giây, `Examples`, thẻ `@slow`) chạy đúng cú pháp; các ca đỏ trong mẫu là lỗi thật (B15, B27, B7, B4).
- `check_coverage.py`: bắt ca đã duyệt thiếu scenario, scenario thừa, scenario không có `match`, scenario chỉ kiểm kiểu dữ liệu.
- `tools/make_agent_openapi.py`: làm sạch một bản master giả lập có đáp án, và không làm đổi bản OpenAPI hiện có.

**Chưa kiểm chứng:** (1) Agent thật (Antigravity/Gemini) có nhận skill và tuân theo quy trình hay không; (2) đường dẫn tự tìm skill trên phiên bản Antigravity của bạn; (3) lệnh chạy trên Windows (chỉ khác dấu `;` trong classpath).

## Giới hạn

- Ví dụ trong `examples/` dùng dữ liệu của EShop; đổi hệ thống khác thì viết lại ví dụ và `inputs/`.
- Dùng chung dự án Karate Maven của nhóm: đặt `login.feature` trong `src/test/java/helpers` và chạy theo cách của dự án; cú pháp feature giữ nguyên.
