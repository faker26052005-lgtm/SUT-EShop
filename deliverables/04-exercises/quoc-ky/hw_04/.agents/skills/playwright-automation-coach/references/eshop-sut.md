# Đặc thù SUT EShop & Chiến lược Automation Testing (HW04)

Tài liệu này tổng hợp toàn bộ các đặc thù kỹ thuật của hệ thống **EShop** (`https://github.com/ttbhanh/eshop-sut`) để áp dụng xuyên suốt quá trình thiết kế test automation.

---

## 1. Kiến trúc phân hệ & Biến môi trường

SUT EShop chạy trên môi trường local thông qua script `./run_servers.sh` ở thư mục gốc:

| Phân hệ | Cổng (Port) | Biến môi trường | Mục đích trong HW04 |
| :--- | :--- | :--- | :--- |
| **Backend REST API** | `http://localhost:3000` | `API_URL` | Setup/cleanup qua API (`/api/register`, `/api/admin/coupons`) |
| **Frontend Web** | `http://localhost:5173` | `BASE_URL` | Kiểm thử giao diện người dùng **FR-02** và **FR-07** |
| **Admin Web** | `http://localhost:5174` | `ADMIN_URL` | Kiểm thử giao diện quản trị **FR-17** (Quản lý coupon) |

> [!IMPORTANT]
> Toàn bộ URL và tài khoản mặc định **không được hardcode** trong code spec. Phải nạp từ file `.env` thông qua biến môi trường.

---

## 2. Chiến lược Reset & Cách ly Dữ liệu

SUT EShop không cung cấp endpoint chuyên dụng để reset database hay mở khóa tài khoản (unlock account). Do đó, chiến lược reset dữ liệu được phân chia theo 3 cấp:

### 2.1 Cấp toàn bộ Test Suite (Suite-level Reseed)
- Trước khi chạy toàn bộ test suite (`run-all.mjs`), dừng server và reseed lại database sạch:
  ```bash
  # Tạm dừng server nếu đang chạy
  cd SUT-EShop/backend && node database.js
  # Khởi động lại server
  cd SUT-EShop && ./run_servers.sh
  ```
- **Quy tắc an toàn:** Không bao giờ reseed database khi test đang chạy song song giữa các worker.

### 2.2 Cấp Feature: FR-02 (Đăng nhập & Khóa tài khoản)
- **Vấn đề:** Mỗi lần đăng nhập sai sẽ tăng counter `login_attempts` trong cơ sở dữ liệu SQLite của SUT. Sau 3 lần sai liên tiếp, user bị khóa. Nếu dùng chung một user cố định, các test case sẽ bị phụ thuộc trạng thái (state pollution).
- **Giải pháp:** Mỗi test case tự động đăng ký một tài khoản mới tinh thông qua `POST /api/register` (xem helper `registerFreshUser()` trong `assets/fixtures.ts`). Email được sinh ngẫu nhiên với timestamp và số ngẫu nhiên: `test_user_<timestamp>_<random>@eshop.com`.
- **Lưu ý đặc thù về khóa tài khoản:**
  - Code thực tế của SUT đang set thời gian khóa là **180 giây** (`lock_until = Date.now() + 180 * 1000`).
  - Tài liệu đặc tả SRS quy định thời gian khóa môi trường demo là **30 giây**.
  - `page.clock` của Playwright chỉ tua được đồng hồ trình duyệt, **không thể tua được đồng hồ server SQLite/Node.js**.
  - Đối với các test case kiểm tra hết khóa (t=30s / t=180s): Nếu không muốn dùng fixed sleep 180s làm chậm pipeline, hãy đánh dấu là **"Not automated"** kèm lý giải kỹ thuật rõ ràng trong `docs/main-report.md`.

### 2.3 Cấp Feature: FR-07 (Giỏ hàng)
- **Vấn đề:** Giỏ hàng có lưu trên server không?
- **Đặc thù SUT:** Trong SUT EShop web, giỏ hàng được quản lý hoàn toàn ở React state (`CartContext.jsx`) và lưu trong trình duyệt (hoặc mất khi refresh), **không gọi `/api/cart`** của backend.
- **Giải pháp:** Vì mỗi test case trong Playwright mở một `page` / `context` mới tinh, giỏ hàng tự động rỗng và sạch sẽ giữa các test case. Không cần API cleanup giỏ hàng. Chỉ cần đăng ký user mới khi test bước tiến hành thanh toán (checkout).

### 2.4 Cấp Feature: FR-17 (Quản lý mã giảm giá Admin)
- **Vấn đề:** Tạo mã giảm giá có thể gây trùng lặp mã code (Unique constraint `code` trong database).
- **Giải pháp:**
  - Sinh mã coupon duy nhất (ví dụ: `TEST_<timestamp>`).
  - Sử dụng API Admin (`POST /api/admin/coupons`) để setup dữ liệu nếu cần.
  - Luôn dọn dẹp bằng `DELETE /api/admin/coupons/:id` trong hook `afterEach` để tránh rác cơ sở dữ liệu.

---

## 3. Quy tắc Đối chiếu Bug (Defect Verification)

1. **Đặc tả SRS là chân lý duy nhất:** Trước khi kết luận một assertion thất bại là bug của SUT, bắt buộc đối chiếu với `specs/system_requirements_specification.md`.
2. **Đối chiếu HW02:** Kiểm tra báo cáo `../hw_02/Bug_Report.md` hoặc `../hw_02/Main_Report.md`:
   - Nếu lỗi đã được phát hiện ở HW02 (ví dụ: `BUG-FR02-01`, `BUG-FR07-01`): Ghi rõ mã tham chiếu `BUG-FRxx-xx` vào báo cáo để thể hiện tính liên tục và kiểm chứng hồi quy (regression verification).
   - Nếu là lỗi mới phát sinh từ giao diện hoặc đa trình duyệt: Ghi nhận đầy đủ thông tin vào `docs/bug-report.md` và tạo GitHub Issue mới.
3. **Quy tắc vàng:** Test fail vì lỗi thật của SUT thì **tuyệt đối không được sửa test script hay sửa expected value cho pass**. Phải giữ nguyên assertion đúng theo SRS để ghi nhận bug.
