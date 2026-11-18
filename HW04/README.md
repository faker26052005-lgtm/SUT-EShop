# HW04 - Automation Testing (EShop SUT) - MSSV 23120056

Playwright (TypeScript), data-driven, chạy trên Chromium / Firefox / WebKit. Mỗi lượt chạy (feature x trình duyệt) sinh một báo cáo HTML riêng trong `reports/`, tiêu đề có "Run by: 23120056" và timestamp ISO.

## Chạy (Windows PowerShell)

1. Bật SUT: backend `node server.js` (3000), `frontend-web` `npm run dev` (5173), `frontend-admin` `npm run dev` (5174).
2. Trong thư mục này:
   ```
   npm install -D @playwright/test
   npx playwright install chromium firefox webkit
   npm run test:fr13        # 3 lượt chạy (3 trình duyệt) cho FR-13
   npm run summary          # số liệu cho README -> docs/test-summary.md
   npx playwright show-report reports/fr13-chromium
   ```
3. Gom bằng chứng: `npm run gitlog` (xuất git log UTF-8 + đếm commit có sửa file `.spec`), `npm run whoami` (cho video).

## Cấu trúc

| Thư mục | Nội dung |
| :-- | :-- |
| `tests/*.spec.ts` | Test theo feature (`fr13-`, `fr04-`, `fr08-`). |
| `tests/helpers/` | Hàm hỗ trợ: gọi API để dựng trạng thái, locator, đọc số trên giao diện. |
| `data/*.json` | Dữ liệu test (không có dữ liệu nằm trong code). |
| `scripts/` | `run-matrix.js` (feature x trình duyệt), `summarize.js`, `git-log.js`. |
| `reports/` | Báo cáo HTML của từng lượt chạy (`reports/_json` là kết quả cho `summarize`). |
| `docs/` | Ghi chú spec, AI Audit, review/gap analysis, tổng kết. |
| `bugs/` | Bug report (Markdown) và ảnh chụp issue trên GitHub. |

## Bảng tự đánh giá (điền cuối cùng)

| No. | Tiêu chí | Điểm | Tự chấm |
| :-: | :-- | :-: | :-: |
| 1 | Task 1 - Feature A (FR-04) | 25 | |
| 1 | Task 1 - Feature B (FR-08) | 25 | |
| 1 | Task 1 - Feature C (FR-13) | 25 | |
| 2 | Task 2 - Demo video | 15 | |
| 3 | Agent Skills | 10 | |
| | **Tổng** | **100** | |

## Tóm tắt kết quả kiểm thử

| Lượt chạy (Run) | Đã thực thi | Đạt (Passed) | Lỗi (Failed) | Bỏ qua | Chập chờn | Ghi nhận là CLARIFY |
| :-- | --: | --: | --: | --: | --: | --: |
| fr04-chromium | 26 | 18 | 8 | 0 | 0 | 7 |
| fr04-firefox | 26 | 18 | 8 | 0 | 0 | 7 |
| fr04-webkit | 26 | 18 | 8 | 0 | 0 | 7 |
| fr08-chromium | 15 | 11 | 4 | 0 | 0 | 2 |
| fr08-firefox | 15 | 11 | 4 | 0 | 0 | 2 |
| fr08-webkit | 15 | 11 | 4 | 0 | 0 | 2 |
| fr13-chromium | 19 | 11 | 8 | 0 | 0 | 4 |
| fr13-firefox | 19 | 11 | 8 | 0 | 0 | 4 |
| fr13-webkit | 19 | 11 | 8 | 0 | 0 | 4 |

## Theo từng tính năng (số test case tự động hóa = số test case trong một lượt chạy trình duyệt)

| Tính năng | Tự động hóa | Lượt chạy trình duyệt | Đã thực thi (tất cả lượt) | Đạt (Passed) | Lỗi (Failed) |
| :-- | --: | --: | --: | --: | --: |
| FR04 | 26 | 3 | 78 | 54 | 24 |
| FR08 | 15 | 3 | 45 | 33 | 12 |
| FR13 | 19 | 3 | 57 | 33 | 24 |

Lượt chạy trình duyệt: **9** (yêu cầu >= 9). Số tính năng: **3**.

## Các test case bị lỗi 

- P01 10 chữ số bắt đầu bằng 0 được chấp nhận và lưu - lỗi trên: chromium, firefox, webkit
- P02 11 chữ số bắt đầu bằng 0 được chấp nhận và lưu - lỗi trên: chromium, firefox, webkit
- P03 Biên: 10 chữ số (giới hạn dưới) được chấp nhận - lỗi trên: chromium, firefox, webkit
- P04 Biên: 11 chữ số (giới hạn trên) được chấp nhận - lỗi trên: chromium, firefox, webkit
- P05 10 chữ số không bắt đầu bằng 0 bị từ chối - lỗi trên: chromium, firefox, webkit
- P13 Chữ số đầu tiên là 1 (kế bên 0 hợp lệ) bị từ chối - lỗi trên: chromium, firefox, webkit
- X01 SEC-04: tên chứa thẻ HTML được hiển thị dưới dạng văn bản thuần túy (plain text) trên tiêu đề trang - lỗi trên: chromium, firefox, webkit
- X02 SEC-04: tên chứa payload <img onerror> không được chạy bất kỳ script nào - lỗi trên: chromium, firefox, webkit
- C05 R4: client gửi total_amount = 1 không được làm thay đổi tổng tiền đã lưu - lỗi trên: chromium, firefox, webkit
- C06 R4: client gửi total_amount = 0 không được làm thay đổi tổng tiền đã lưu - lỗi trên: chromium, firefox, webkit
- C09 R2: tổng tiền thanh toán không thể bị người dùng chỉnh sửa - lỗi trên: chromium, firefox, webkit
- C10 R5: sau khi thanh toán thành công, giỏ hàng phải trống - lỗi trên: chromium, firefox, webkit
- S01 - Một đơn hàng đã giao (delivered) được cộng vào doanh thu - lỗi trên: chromium, firefox, webkit
- S06 - Biên: số tiền đã giao nhỏ nhất (1 VNĐ) được cộng chính xác - lỗi trên: chromium, firefox, webkit
- S07 - Biên: số tiền 32-bit lớn nhất (2147483647) được cộng chính xác - lỗi trên: chromium, firefox, webkit
- S08 - Đơn hàng hỗn hợp: chỉ hai đơn hàng đã giao (delivered) mới được tính tổng - lỗi trên: chromium, firefox, webkit
- S09 - Admin duyệt vòng đời trạng thái đơn hàng pending > confirmed > shipping > delivered trên UI; doanh thu chỉ thay đổi ở trạng thái delivered - lỗi trên: chromium, firefox, webkit
- S12 - FR-10: đơn hàng bị hủy (canceled) là trạng thái cuối cùng, danh sách đơn hàng không cung cấp thao tác nào cho nó - lỗi trên: chromium, firefox, webkit
- S13 - Ô doanh thu bằng tổng tất cả các đơn hàng đã giao trong hệ thống, ô đơn hàng bằng số lượng đơn hàng - lỗi trên: chromium, firefox, webkit
- A04 - Một JWT không phải của admin đặt trong web admin không được mở dashboard (FR-12, SEC-03) - lỗi trên: chromium, firefox, webkit

- Số feature: 3
- Số test case tự động hóa / thực thi / pass / fail: 60 / 180 / 120 / 60
- Số lượt chạy trình duyệt: 9
- Số bug: 20
- Link video demo: 
