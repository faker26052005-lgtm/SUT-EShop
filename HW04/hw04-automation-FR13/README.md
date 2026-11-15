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

## Test summary (điền từ `npm run summary`)

- Số feature: 
- Số test case tự động hóa / thực thi / pass / fail: 
- Số lượt chạy trình duyệt: 
- Số bug: 
- Link video demo: 
