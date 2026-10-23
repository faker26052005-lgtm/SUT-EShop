# Workflow AI có người duyệt (Human-in-the-loop) cho kiểm thử API

**Quy trình:** Nạp Skill -> Agent sinh test matrix có truy vết -> **Người duyệt ca test** -> Agent sinh Karate feature -> **Người quyết định chạy** -> Chạy và đánh giá.

Ý tưởng chính: AI sai nhiều nhất ở khoảng giữa "kế hoạch" và "code", nên người chen vào hai chỗ: duyệt matrix trước khi sinh code, và đọc feature trước khi chạy. Skill `api-test-design` ép Agent lấy kỳ vọng từ đặc tả (SRS), không từ hành vi quan sát được của hệ thống.

## Cấu trúc

```
ai-workflow/
├── inputs/                 # SRS, OpenAPI, dữ liệu mẫu (Agent phải đọc cả ba)
├── skills/api-test-design/ # Skill: SKILL.md, references/, examples/, scripts/
├── prompts/                # Lời nhắc hệ thống và ba lời nhắc nhiệm vụ
├── karate/                 # karate-config.js, helpers/login.feature, (đặt karate-1.5.2.jar vào đây)
└── executions/             # Lưu vết từng lần chạy: matrix, feature, báo cáo, kết quả
```

## Chuẩn bị (một lần)

1. **Java 17 trở lên** (đã kiểm chứng với Java 21): `java -version`.
2. **Karate:** tải `karate-1.5.2.jar` ở trang phát hành https://github.com/karatelabs/karate/releases và đặt vào thư mục `karate/`.
3. **EShop:** tải `ttbhanh/eshop-sut`, chạy `npm install` trong `backend`.
4. **Antigravity:** mở thư mục `ai-workflow` làm workspace, rồi chép Skill vào nơi Antigravity tự tìm (theo tài liệu Antigravity, thư mục workspace là `.agents/skills/`; kiểm tra lại với phiên bản bạn dùng). PowerShell:
   ```
   New-Item -ItemType Directory -Force .agents\skills
   Copy-Item -Recurse skills\api-test-design .agents\skills\
   ```
   Sửa Skill ở `skills/` thì nhớ chép lại. Dán `prompts/system-prompt.md` vào phần hướng dẫn của Agent.

## Một lần chạy

1. Tạo `executions/run-01-<phạm vi>/`, chép `_template/test-matrix.md` và `_template/result.md` vào.
2. Dán **Bước 1** trong `prompts/tasks.md`. Agent sinh `test-matrix.md` rồi dừng.
3. **Người duyệt** cột Duyệt (Y, S, N). 
4. Dán **Bước 2**. Agent sinh `features/` và chạy `check_coverage.py`, rồi dừng.
5. **Người đọc feature**, sửa chỗ assertion yếu, kiểm tra thao tác phá dữ liệu mẫu.
6. Khởi động máy chủ EShop **mới** (`node server.js` trong `backend`), rồi chạy Karate từ thư mục `karate/`:
   ```
   # Windows (PowerShell)
   java -cp "karate-1.5.2.jar;." com.intuit.karate.Main -o ../executions/run-01-<phạm vi>/report ../executions/run-01-<phạm vi>/features
   # Linux, macOS: đổi ";" thành ":" trong classpath
   ```
   Báo cáo: `report/karate-reports/karate-summary.html`.
7. Điền `result.md`: phân loại từng ca đỏ (HT, HT-mới, KY, SC) và **kiểm chứng bằng gọi API trực tiếp**.

## Đã kiểm chứng

Hai ví dụ trong `skills/api-test-design/examples/` (6 scenario) đã được chạy thật với Karate 1.5.2 trên EShop: 2 xanh, 4 đỏ. Bốn ca đỏ khớp bốn lỗi đã biết: B1 (đăng nhập lộ mật khẩu), B4 (công thức phần trăm sai), B14 (đúng ngưỡng bị từ chối), B26 (áp mã không cần đăng nhập). Script `check_coverage.py` đã được thử trên một lần chạy giả lập. **Chưa kiểm chứng:** Agent thực (Antigravity/Gemini) có tuân theo Skill hay không; việc này cần chạy thật và ghi vào `executions/`.

## Giới hạn

- Ví dụ trong `examples/` dùng dữ liệu của EShop; đổi hệ thống khác thì viết lại ví dụ và `inputs/`.
- Dùng chung dự án Karate Maven của nhóm: đặt `login.feature` trong `src/test/java/helpers` và chạy theo cách của dự án; cú pháp feature giữ nguyên.
