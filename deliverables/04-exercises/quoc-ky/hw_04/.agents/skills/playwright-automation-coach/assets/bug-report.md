# [BUG-<FR>-<NN>] <Short, descriptive defect title>

- **GitHub Issue:** #<Issue_Number> (<Link to GitHub Issue in student repo>)
- **Test Case liên quan:** `TC_<FR>_<NN>` (ví dụ: `TC_FR02_03`)
- **Trình duyệt bị ảnh hưởng:** `chromium`, `firefox`, `webkit`
- **Môi trường:** Linux Ubuntu 24.04 LTS / Node.js v20 / Playwright v1.4x / Local SUT
- **Mức độ nghiêm trọng (Severity):** Major / Critical / Minor
- **Đối chiếu SRS:** Trích dẫn điều khoản tại `specs/system_requirements_specification.md`
- **Đối chiếu HW02:** `BUG-FR02-xx` (nếu trùng) hoặc "Lỗi mới phát hiện ở HW04"

---

## 1. Mô tả chi tiết (Description)
<Mô tả ngắn gọn hành vi sai của hệ thống khi chạy automation test>

## 2. Các bước tái hiện (Steps to Reproduce)
1. Khởi động SUT với `./run_servers.sh`.
2. Mở trình duyệt truy cập `<URL>`.
3. Thực hiện thao tác: ...
4. Quan sát kết quả hiển thị / phản hồi mạng.

## 3. Kết quả mong đợi (Expected Result)
<Theo đặc tả SRS: mã HTTP mong đợi, giao diện mong đợi, thông báo lỗi mong đợi>

## 4. Kết quả thực tế (Actual Result)
<Hệ thống thực tế trả về: lỗi gì, lệch với SRS ra sao>

## 5. Assertion thất bại trong Playwright
```typescript
// Đoạn code assertion bị fail và lỗi in ra trên terminal/report
await expect(...).toHaveText(...);
// Error: Timed out 5000ms waiting for expect(locator).toHaveText(expected)
```

## 6. Bằng chứng (Evidence & Screenshots)
- **Ảnh chụp màn hình lỗi:** `evidence/<screenshot_file>.png`
- **HTML Report tương ứng:** `reports/<feature>/<browser>/index.html`
- **Ảnh GitHub Issue:** `evidence/issue_<id>.png`
