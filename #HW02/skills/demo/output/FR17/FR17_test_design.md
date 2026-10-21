# FR-17 – Quản lý Mã Giảm Giá (Coupon CRUD) · Test design

> **Nguồn đầu vào:** `specs/system_requirements_specification.md` và `specs/api_specification.md`
> Base URL: `http://localhost:3000` | Admin: `admin@eshop.com / Admin123!` | User test: `test@eshop.com / Test1234!`

---

## Bước 0: FR slice

### A. SRS — FR-17 (nguyên văn)

> **FR-17: Quản lý Mã Giảm Giá (Coupon CRUD)**
>
> - Admin có thể Thêm / Xem / Xóa mã giảm giá.
> - Các trường bắt buộc: `code` (duy nhất), `type` (percent/fixed), `discount_value` (dương),
>   `expired_at`, `min_order_amount` (>= 0), `max_uses_per_user` (>= 1).

### B. SEC / FR liên quan (nguyên văn)

> **FR-12: Kiểm soát truy cập**
> - Phân hệ Admin chỉ dành cho tài khoản có `role = 'admin'`.
> - **Tất cả** các API Admin (`/api/admin/*`) và các API có tính ảnh hưởng dữ liệu
>   (`POST/PUT/DELETE /api/products`, `/api/categories`, `/api/coupons`) đều phải yêu cầu:
>   1. Token JWT hợp lệ.
>   2. `role = 'admin'` trong Token.
>
> **SEC-02:** Các API có tính bảo mật phải yêu cầu JWT Token hợp lệ.
>
> **SEC-03:** API Admin phải kiểm tra `role = 'admin'` trong Token, không chỉ kiểm tra sự tồn tại của Token.

### C. API endpoints (nguyên văn)

> **6.4 Quản lý Mã Giảm Giá**
> - **Thêm mới mã:** `POST /api/admin/coupons`
>   - Header: `Authorization: Bearer <token>` (admin)
>   - Body (JSON):
>     ```json
>     { "code":"TET2025", "type":"percent", "discount_value":15,
>       "min_order_amount":200000, "expired_at":"2025-01-31", "max_uses_per_user":1 }
>     ```
> - **Xóa mã:** `DELETE /api/admin/coupons/:id`
>   - Header: `Authorization: Bearer <token>` (admin)
>
> **5.2 Lấy danh sách mã giảm giá (Dành cho Admin)**
> - **Endpoint:** `GET /api/coupons`
>   - Header: `Authorization: Bearer <token>`

---

## Bước 1: Trích yêu cầu

### 1.1 Bảng yêu cầu

| Mã  | Nội dung | Nguồn | Loại |
|-----|----------|-------|------|
| R1  | Admin có thể Thêm mã giảm giá | FR-17 | nghiệp vụ |
| R2  | Admin có thể Xem danh sách mã giảm giá | FR-17 | nghiệp vụ |
| R3  | Admin có thể Xóa mã giảm giá | FR-17 | nghiệp vụ |
| R4  | Trường `code` là bắt buộc | FR-17 | input |
| R5  | Trường `code` phải là duy nhất trong hệ thống | FR-17 | input |
| R6  | Trường `type` là bắt buộc; chỉ nhận `percent` hoặc `fixed` | FR-17 | input |
| R7  | Trường `discount_value` là bắt buộc và phải là số dương (> 0) | FR-17 | input |
| R8  | Trường `expired_at` là bắt buộc | FR-17 | input |
| R9  | Trường `min_order_amount` là bắt buộc và phải >= 0 | FR-17 | input |
| R10 | Trường `max_uses_per_user` là bắt buộc và phải >= 1 | FR-17 | input |
| R11 | Chỉ tài khoản `role = 'admin'` mới được truy cập các thao tác Thêm/Xóa coupon | FR-12 | truy cập |
| R12 | Tất cả API Admin phải yêu cầu JWT Token hợp lệ | FR-12, SEC-02 | bảo mật |
| R13 | API Admin phải kiểm tra `role = 'admin'` trong Token, không chỉ sự tồn tại của Token | FR-12, SEC-03 | bảo mật |

### 1.2 Endpoint

| Method | Path | Token | Role | Body / Path param |
|--------|------|-------|------|-------------------|
| POST   | `/api/admin/coupons` | Có (admin) | admin | `code`, `type`, `discount_value`, `min_order_amount`, `expired_at`, `max_uses_per_user` |
| DELETE | `/api/admin/coupons/:id` | Có (admin) | admin | path: `id` |
| GET    | `/api/coupons` | Có | không rõ (CLR-7) | — |

### 1.3 CẦN LÀM RÕ

| # | Vấn đề |
|---|--------|
| CLR-1 | SRS không nêu mã lỗi HTTP cụ thể khi validation thất bại (400, 409, 422?) |
| CLR-2 | SRS không nêu giới hạn độ dài tối đa của `code` |
| CLR-3 | SRS không nêu giới hạn tối đa của `discount_value` (percent > 100 có hợp lệ?) |
| CLR-4 | SRS không nêu giới hạn tối đa của `max_uses_per_user` |
| CLR-5 | SRS không nêu giới hạn tối đa của `min_order_amount` |
| CLR-6 | SRS không nêu định dạng `expired_at` (YYYY-MM-DD?) và ngày quá khứ có được tạo không |
| CLR-7 | SRS không nêu rõ `GET /api/coupons` yêu cầu role gì (user hay admin?) |
| CLR-8 | SRS không nêu hành vi khi xóa coupon đang liên quan đến đơn hàng chờ xử lý |
| CLR-9 | SRS không nêu `is_active` — mặc định là 1 hay client tự đặt? |

---

## Bước 2: Biến

### 2.1 Biến đầu vào

| Biến | Vị trí | Kiểu | Ràng buộc SRS | SRS im lặng | Có thứ tự? | Vai trò |
|------|--------|------|--------------|-------------|-----------|---------|
| `code` | body | string | Bắt buộc, duy nhất | Độ dài tối đa, ký tự cho phép, case-sensitive | Không | validated |
| `type` | body | enum | Bắt buộc; `percent` hoặc `fixed` | Giá trị khác | Không | validated |
| `discount_value` | body | number | Bắt buộc, > 0 | Giới hạn tối đa, integer hay float | Có | validated |
| `expired_at` | body | date string | Bắt buộc | Định dạng, ngày quá khứ | Có (ngày) | validated |
| `min_order_amount` | body | number | Bắt buộc, >= 0 | Giới hạn tối đa | Có | validated |
| `max_uses_per_user` | body | integer | Bắt buộc, >= 1 | Giới hạn tối đa | Có | validated |
| `Authorization` header | header | JWT string | Bắt buộc; admin token | Thông báo lỗi khi thiếu | Không | validated |
| `:id` (DELETE) | path | integer | id coupon tồn tại | id không tồn tại | Không | validated |

### 2.2 Biến trạng thái

| Biến trạng thái | Mô tả | Cách dựng |
|----------------|-------|-----------|
| Tài khoản admin | `role = 'admin'` | `POST /api/login` với `admin@eshop.com / Admin123!` |
| Tài khoản user thường | `role = 'user'` | `POST /api/login` với `test@eshop.com / Test1234!` |
| Coupon code đã tồn tại | SAVE10 có sẵn trong SRS sample data | Dùng SAVE10 trực tiếp |
| Coupon do test tạo | Coupon mới tạo để lấy id | `POST /api/admin/coupons` → lưu id |

### 2.3 Đầu ra quan sát

| Đầu ra | Cách kiểm tra |
|--------|--------------|
| HTTP status code | Đọc response status |
| Response body (`id`, `code`, các field) | Đọc JSON response |
| Dữ liệu persisted | `GET /api/coupons` sau POST để xác nhận coupon đã lưu |
| Coupon bị xóa | `GET /api/coupons` sau DELETE; coupon không còn xuất hiện |

---

## Bước 3: Lớp tương đương

### `code`

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã YC |
|-----|---------|-------------|---------|-------|
| C_code.1 | Hợp lệ | — | `"NEWTEST01"` (chưa tồn tại) | R4, R5 |
| C_code.2 | Không hợp lệ | Rỗng (vi phạm bắt buộc) | `""` | R4 |
| C_code.3 | Không hợp lệ | Trùng code đã có | `"SAVE10"` | R5 |

### `type`

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã YC |
|-----|---------|-------------|---------|-------|
| C_type.1 | Hợp lệ | — | `"percent"` | R6 |
| C_type.2 | Hợp lệ | — | `"fixed"` | R6 |
| C_type.3 | Không hợp lệ | Giá trị ngoài enum | `"amount"` | R6 |
| C_type.4 | Không hợp lệ | Thiếu trường | *(bỏ qua)* | R6 |

### `discount_value`

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã YC |
|-----|---------|-------------|---------|-------|
| C_dv.1 | Hợp lệ | — | `10` | R7 |
| C_dv.2 | Không hợp lệ | Bằng 0 (không dương) | `0` | R7 |
| C_dv.3 | Không hợp lệ | Âm | `-5` | R7 |
| C_dv.4 | Không hợp lệ | Thiếu trường | *(bỏ qua)* | R7 |

### `expired_at`

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã YC |
|-----|---------|-------------|---------|-------|
| C_exp.1 | Hợp lệ | — | `"2099-12-31"` (tương lai xa) | R8 |
| C_exp.2 | Không hợp lệ | Thiếu trường | *(bỏ qua)* | R8 |
| C_exp.3 | CẦN LÀM RÕ | Ngày quá khứ — SRS không nêu | `"2020-01-01"` | R8, CLR-6 |
| C_exp.4 | CẦN LÀM RÕ | Định dạng sai | `"31-12-2099"` | CLR-6 |

### `min_order_amount`

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã YC |
|-----|---------|-------------|---------|-------|
| C_moa.1 | Hợp lệ | — | `200000` | R9 |
| C_moa.2 | Hợp lệ | — biên dưới | `0` (SRS cho phép >= 0) | R9 |
| C_moa.3 | Không hợp lệ | Âm (< 0) | `-1` | R9 |
| C_moa.4 | Không hợp lệ | Thiếu trường | *(bỏ qua)* | R9 |

### `max_uses_per_user`

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã YC |
|-----|---------|-------------|---------|-------|
| C_mu.1 | Hợp lệ | — biên dưới | `1` | R10 |
| C_mu.2 | Hợp lệ | — trên biên | `2` | R10 |
| C_mu.3 | Không hợp lệ | Bằng 0 (< 1) | `0` | R10 |
| C_mu.4 | Không hợp lệ | Âm | `-1` | R10 |
| C_mu.5 | Không hợp lệ | Thiếu trường | *(bỏ qua)* | R10 |

### `Authorization` header

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã YC |
|-----|---------|-------------|---------|-------|
| C_auth.1 | Hợp lệ | — | Token admin hợp lệ | R12 |
| C_auth.2 | Không hợp lệ | Thiếu header | *(không gửi)* | R12, SEC-02 |
| C_auth.3 | Không hợp lệ | Sai định dạng (không có `Bearer `) | `Authorization: rawtoken` | R12, SEC-02 |
| C_auth.4 | Không hợp lệ | Token bị giả mạo | `Bearer eyJhbGc.tampered.sig` | R12, SEC-02 |
| C_auth.5 | Không hợp lệ | Token user thường (sai role) | Token của `test@eshop.com` | R13, SEC-03 |

### `:id` (DELETE)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã YC |
|-----|---------|-------------|---------|-------|
| C_id.1 | Hợp lệ | — | id coupon vừa tạo | R3 |
| C_id.2 | Không hợp lệ | id không tồn tại | `99999` | R3 |

---

## Bước 4: Test case Domain Testing

**Baseline (dùng cho mọi test POST trừ khi nêu khác):**
```
POST http://localhost:3000/api/admin/coupons
Authorization: Bearer <admin_token>
{
  "code":              "NEWTEST01",
  "type":              "percent",
  "discount_value":    10,
  "min_order_amount":  200000,
  "expired_at":        "2099-12-31",
  "max_uses_per_user": 1
}
```

| ID | Lớp | Mô tả | Input (delta so với baseline) | Kỳ vọng | Mã YC |
|----|-----|-------|-------------------------------|---------|-------|
| DT-01 | C_code.1, C_type.1, C_dv.1, C_exp.1, C_moa.1, C_mu.1, C_auth.1 | Tạo coupon hợp lệ — type percent | Baseline đầy đủ (code="NEWTEST01") | 2xx và dữ liệu được lưu đúng — coupon xuất hiện trong GET /api/coupons | R1, R4–R10 |
| DT-02 | C_type.2 | Tạo coupon hợp lệ — type fixed | type="fixed", discount_value=50000, code="NEWTEST02" | 2xx và dữ liệu được lưu đúng | R6 |
| DT-03 | C_code.2 | `code` rỗng | code="" | 4xx và dữ liệu không đổi | R4 |
| DT-04 | C_code.3 | `code` trùng đã tồn tại | code="SAVE10" | 4xx và dữ liệu không đổi — SAVE10 vẫn chỉ có 1 bản | R5 |
| DT-05 | C_type.3 | `type` không hợp lệ | type="amount", code="NEWTEST03" | 4xx và dữ liệu không đổi | R6 |
| DT-06 | C_type.4 | `type` thiếu | bỏ trường type, code="NEWTEST04" | 4xx và dữ liệu không đổi | R6 |
| DT-07 | C_dv.3 | `discount_value` âm | discount_value=-5, code="NEWTEST05" | 4xx và dữ liệu không đổi | R7 |
| DT-08 | C_dv.4 | `discount_value` thiếu | bỏ trường discount_value, code="NEWTEST06" | 4xx và dữ liệu không đổi | R7 |
| DT-09 | C_exp.2 | `expired_at` thiếu | bỏ trường expired_at, code="NEWTEST07" | 4xx và dữ liệu không đổi | R8 |
| DT-10 | C_moa.4 | `min_order_amount` thiếu | bỏ trường min_order_amount, code="NEWTEST08" | 4xx và dữ liệu không đổi | R9 |
| DT-11 | C_mu.4 | `max_uses_per_user` âm | max_uses_per_user=-1, code="NEWTEST09" | 4xx và dữ liệu không đổi | R10 |
| DT-12 | C_mu.5 | `max_uses_per_user` thiếu | bỏ trường max_uses_per_user, code="NEWTEST10" | 4xx và dữ liệu không đổi | R10 |
| DT-13 | C_exp.3 | `expired_at` ngày quá khứ | expired_at="2020-01-01", code="NEWTEST11" | CẦN LÀM RÕ — SRS không nêu ngày quá khứ có được tạo không | R8 |
| DT-14 | C_exp.4 | `expired_at` sai định dạng | expired_at="31-12-2099", code="NEWTEST12" | CẦN LÀM RÕ — SRS không nêu định dạng bắt buộc | R8 |
| DT-15 | C_id.1 | Xóa coupon tồn tại | Admin token; DELETE /api/admin/coupons/{id tạo từ DT-01} | 2xx và dữ liệu được lưu đúng — coupon không còn trong GET /api/coupons | R3 |
| DT-16 | C_id.2 | Xóa coupon — id không tồn tại | Admin token; DELETE /api/admin/coupons/99999 | 4xx và dữ liệu không đổi | R3 |

---

## Bước 5: Boundary Value Analysis

### 5.1 Biến chọn / loại và lý do

| Biến | Chọn BVA? | Lý do |
|------|-----------|-------|
| `discount_value` | **Có** | Ràng buộc số thứ tự: > 0. Ranh giới tại B = 0 (bước = 1 đơn vị nhỏ nhất) |
| `min_order_amount` | **Có** | Ràng buộc số thứ tự: >= 0. Ranh giới tại B = 0 |
| `max_uses_per_user` | **Có** | Ràng buộc số nguyên: >= 1. Ranh giới tại B = 1 |
| `code` | Không | Không có giới hạn độ dài trong SRS → chỉ probe nếu cần (CLR-2) |
| `type` | Không | Enum/categorical, không có thứ tự |
| `expired_at` | Không | SRS không nêu ranh giới ngày cho việc tạo (CLR-6) |

### 5.2 Bảng giá trị biên

**`discount_value` — SRS: > 0, ranh giới B = 0, toán tử `x > 0` (x > T với T=0):**

| Giá trị | Ý nghĩa (3-value) | Kỳ vọng |
|---------|------------------|---------|
| -1 (B−1) | Dưới biên, < 0 → không hợp lệ | 4xx và dữ liệu không đổi |
| 0 (B) | Đúng biên, = 0 → không hợp lệ (SRS: phải > 0) | 4xx và dữ liệu không đổi |
| 1 (B+1) | Trên biên, > 0 → hợp lệ | 2xx và dữ liệu được lưu đúng |

**`min_order_amount` — SRS: >= 0, ranh giới B = 0, toán tử `x >= 0`:**

| Giá trị | Ý nghĩa (3-value) | Kỳ vọng |
|---------|------------------|---------|
| -1 (B−1) | Dưới biên, < 0 → không hợp lệ | 4xx và dữ liệu không đổi |
| 0 (B) | Đúng biên, = 0 → hợp lệ | 2xx và dữ liệu được lưu đúng |
| 1 (B+1) | Trên biên, > 0 → hợp lệ | 2xx và dữ liệu được lưu đúng |

**`max_uses_per_user` — SRS: >= 1, ranh giới B = 1, toán tử `x >= 1`:**

| Giá trị | Ý nghĩa (3-value) | Kỳ vọng |
|---------|------------------|---------|
| 0 (B−1) | Dưới biên, < 1 → không hợp lệ | 4xx và dữ liệu không đổi |
| 1 (B) | Đúng biên, = 1 → hợp lệ | 2xx và dữ liệu được lưu đúng |
| 2 (B+1) | Trên biên, > 1 → hợp lệ | 2xx và dữ liệu được lưu đúng |

### 5.3 Test case BVA

| ID | Biến | Giá trị | Ý nghĩa | Kỳ vọng | Mã YC |
|----|------|---------|---------|---------|-------|
| BV-01 | `discount_value` | -1 | B−1: âm, dưới biên | 4xx và dữ liệu không đổi | R7 |
| BV-02 | `discount_value` | 0 | B: đúng biên, không dương | 4xx và dữ liệu không đổi | R7 |
| BV-03 | `discount_value` | 1 | B+1: dương tối thiểu | 2xx và dữ liệu được lưu đúng | R7 |
| BV-04 | `min_order_amount` | -1 | B−1: âm, dưới biên | 4xx và dữ liệu không đổi | R9 |
| BV-05 | `min_order_amount` | 0 | B: đúng biên, hợp lệ | 2xx và dữ liệu được lưu đúng | R9 |
| BV-06 | `min_order_amount` | 1 | B+1: dương nhỏ nhất | 2xx và dữ liệu được lưu đúng | R9 |
| BV-07 | `max_uses_per_user` | 0 | B−1: dưới biên | 4xx và dữ liệu không đổi | R10 |
| BV-08 | `max_uses_per_user` | 1 | B: đúng biên, hợp lệ tối thiểu | 2xx và dữ liệu được lưu đúng | R10 |
| BV-09 | `max_uses_per_user` | 2 | B+1: hợp lệ | 2xx và dữ liệu được lưu đúng | R10 |

*(Mỗi BV test: các biến còn lại dùng baseline; code dùng code riêng để tránh conflict)*

### 5.4 Trùng với DT và quyết định giữ/loại

| BV | Trùng DT nào | Quyết định |
|----|-------------|-----------|
| BV-01 | DT-07 (discount_value=-5): cùng lớp âm nhưng **khác giá trị** (-1 ≠ -5); -1 là ranh giới chính xác | **Giữ cả hai** — BV-01 là biên; DT-07 là đại diện lớp |
| BV-02 | DT không có discount_value=0 | **Giữ BV-02** |
| BV-03 | DT không có discount_value=1 | **Giữ BV-03** |
| BV-04 | DT không có min_order_amount=-1 | **Giữ BV-04** |
| BV-05 | DT không có min_order_amount=0 | **Giữ BV-05** |
| BV-06 | DT không có min_order_amount=1 | **Giữ BV-06** |
| BV-07 | DT không có max_uses_per_user=0 | **Giữ BV-07** |
| BV-08 | DT-01 có max_uses_per_user=1: **trùng hoàn toàn** | **Bỏ BV-08**, giữ DT-01 (test tổng hợp; BV-08 không thêm thông tin mới) |
| BV-09 | DT-02 có max_uses_per_user=2: **trùng hoàn toàn** | **Bỏ BV-09**, giữ DT-02 |

---

## Bước 6: Nghiệp vụ, bảo mật, truy cập

| ID | Mô tả | Cách dựng và input | Kỳ vọng | Mã YC |
|----|-------|-------------------|---------|-------|
| AC-01 | POST — thiếu Authorization header | Không gửi header; POST /api/admin/coupons; baseline body | 4xx và dữ liệu không đổi — xác nhận qua GET /api/coupons | R12, SEC-02 |
| AC-02 | POST — header sai định dạng (thiếu `Bearer `) | Header: `Authorization: rawtoken`; POST /api/admin/coupons; baseline body | 4xx và dữ liệu không đổi | R12, SEC-02 |
| AC-03 | POST — token bị giả mạo (signature sai) | Header: `Authorization: Bearer eyJhbGc.tampered.sig`; POST baseline | 4xx và dữ liệu không đổi | R12, SEC-02 |
| AC-04 | POST — token user thường (role sai) | Login test@eshop.com → lấy token; POST /api/admin/coupons; baseline body | 4xx và dữ liệu không đổi — user không được tạo coupon | R11, R13, SEC-03 |
| AC-05 | DELETE — thiếu Authorization header | Không gửi header; DELETE /api/admin/coupons/{id hợp lệ} | 4xx và dữ liệu không đổi — coupon vẫn còn trong GET /api/coupons | R12, SEC-02 |
| AC-06 | DELETE — token user thường (role sai) | User token; DELETE /api/admin/coupons/{id hợp lệ} | 4xx và dữ liệu không đổi | R11, R13, SEC-03 |
| BL-01 | Xem danh sách — admin thấy các coupon hệ thống | Admin token; GET /api/coupons | 2xx và dữ liệu được lưu đúng — list chứa SAVE10, BIGBUY, VIP100, EXPIRED | R2 |
| BL-02 | Tạo thành công → coupon xuất hiện trong list | Admin tạo coupon NEWTEST-BL02 → GET /api/coupons | 2xx và dữ liệu được lưu đúng — NEWTEST-BL02 xuất hiện với đúng các field | R1, R2 |
| BL-03 | Xóa thành công → coupon biến mất khỏi list | Admin tạo NEWTEST-BL03 → ghi id → DELETE id → GET /api/coupons | 2xx và dữ liệu được lưu đúng — NEWTEST-BL03 không còn trong list | R3 |
| BL-04 | Mass assignment: gửi thêm `is_active=0` | Admin token; POST /api/admin/coupons; baseline body + `"is_active":0` | CẦN LÀM RÕ — SRS không nêu client có đặt is_active không | R1 |

---

## Bước 7: Side-effect review

### POST /api/admin/coupons (tạo coupon)

| # | Câu hỏi | Trả lời |
|---|---------|---------|
| 1 | Field không gửi có bị thay đổi? | Covered bởi BL-02 (đọc lại toàn bộ record) |
| 2 | Bản ghi cart/order của admin: không bị ảnh hưởng? | N/A — tạo coupon không liên quan |
| 3 | Coupon của user khác: không bị ảnh hưởng? | Covered bởi BL-01 (list vẫn đúng sau tạo mới) |
| 4 | Giá trị aggregate: count coupon cập nhật? | CẦN LÀM RÕ — SRS không nêu counter; kiểm tra qua GET /api/coupons |
| 5 | Cleanup: không áp dụng khi tạo | N/A |
| 6 | Failure path: reject không tạo record partial | Covered bởi DT-03 đến DT-12, AC-01→AC-04 (xác nhận qua GET sau fail) |
| 7 | Double submit cùng code | Covered bởi DT-04 (code trùng bị reject) |
| 8 | Snapshot: thay đổi coupon sau tạo không ảnh hưởng đơn cũ | CẦN LÀM RÕ — SRS không nêu |
| 9 | System-generated field: `id`, timestamp có trong response? | Covered bởi BL-02 (đọc response) |
| 10 | Response không lộ data của user khác | Covered bởi BL-01 |

### DELETE /api/admin/coupons/:id (xóa coupon)

| # | Câu hỏi | Trả lời |
|---|---------|---------|
| 1 | Coupon khác không bị xóa nhầm? | Covered bởi BL-03 (GET sau DELETE chỉ đúng coupon đó biến mất) |
| 6 | id không tồn tại: không ảnh hưởng data khác? | Covered bởi DT-16 |
| 7 | Double delete (xóa id đã xóa): hành vi ra sao? | **BL-05** — test mới |

### Test mới từ side-effect

| ID | Mô tả | Cách dựng và input | Kỳ vọng | Mã YC |
|----|-------|-------------------|---------|-------|
| BL-05 | Double delete — xóa coupon đã xóa lần 2 | Admin token; DELETE /api/admin/coupons/{id vừa xóa ở BL-03} lần 2 | CẦN LÀM RÕ — SRS không nêu; kỳ vọng là 4xx nhưng cần xác nhận | R3, CLR-8 |

---

## Danh sách test cuối cùng (sau khi loại trùng)

*Đã loại: BV-08 (trùng DT-01), BV-09 (trùng DT-02).*
*DT-07 (discount_value=-5) và BV-01 (discount_value=-1) giữ cả hai — giá trị khác nhau, BV là ranh giới.*

| ID | Mô tả ngắn | Endpoint | Kỳ vọng |
|----|-----------|---------|---------|
| DT-01 | Tạo coupon hợp lệ — type percent (baseline) | POST /api/admin/coupons | 2xx và dữ liệu được lưu đúng |
| DT-02 | Tạo coupon hợp lệ — type fixed | POST /api/admin/coupons | 2xx và dữ liệu được lưu đúng |
| DT-03 | code rỗng | POST /api/admin/coupons | 4xx và dữ liệu không đổi |
| DT-04 | code trùng (SAVE10) | POST /api/admin/coupons | 4xx và dữ liệu không đổi |
| DT-05 | type không hợp lệ ("amount") | POST /api/admin/coupons | 4xx và dữ liệu không đổi |
| DT-06 | type thiếu | POST /api/admin/coupons | 4xx và dữ liệu không đổi |
| DT-07 | discount_value âm (-5) | POST /api/admin/coupons | 4xx và dữ liệu không đổi |
| DT-08 | discount_value thiếu | POST /api/admin/coupons | 4xx và dữ liệu không đổi |
| DT-09 | expired_at thiếu | POST /api/admin/coupons | 4xx và dữ liệu không đổi |
| DT-10 | min_order_amount thiếu | POST /api/admin/coupons | 4xx và dữ liệu không đổi |
| DT-11 | max_uses_per_user âm (-1) | POST /api/admin/coupons | 4xx và dữ liệu không đổi |
| DT-12 | max_uses_per_user thiếu | POST /api/admin/coupons | 4xx và dữ liệu không đổi |
| DT-13 | expired_at ngày quá khứ | POST /api/admin/coupons | CẦN LÀM RÕ |
| DT-14 | expired_at sai định dạng | POST /api/admin/coupons | CẦN LÀM RÕ |
| DT-15 | Xóa coupon tồn tại | DELETE /api/admin/coupons/:id | 2xx và dữ liệu được lưu đúng |
| DT-16 | Xóa coupon — id không tồn tại (99999) | DELETE /api/admin/coupons/99999 | 4xx và dữ liệu không đổi |
| BV-01 | discount_value = -1 (B−1) | POST /api/admin/coupons | 4xx và dữ liệu không đổi |
| BV-02 | discount_value = 0 (B) | POST /api/admin/coupons | 4xx và dữ liệu không đổi |
| BV-03 | discount_value = 1 (B+1) | POST /api/admin/coupons | 2xx và dữ liệu được lưu đúng |
| BV-04 | min_order_amount = -1 (B−1) | POST /api/admin/coupons | 4xx và dữ liệu không đổi |
| BV-05 | min_order_amount = 0 (B) | POST /api/admin/coupons | 2xx và dữ liệu được lưu đúng |
| BV-06 | min_order_amount = 1 (B+1) | POST /api/admin/coupons | 2xx và dữ liệu được lưu đúng |
| BV-07 | max_uses_per_user = 0 (B−1) | POST /api/admin/coupons | 4xx và dữ liệu không đổi |
| AC-01 | POST — thiếu Authorization header | POST /api/admin/coupons | 4xx và dữ liệu không đổi |
| AC-02 | POST — header sai định dạng | POST /api/admin/coupons | 4xx và dữ liệu không đổi |
| AC-03 | POST — token giả mạo | POST /api/admin/coupons | 4xx và dữ liệu không đổi |
| AC-04 | POST — token user thường | POST /api/admin/coupons | 4xx và dữ liệu không đổi |
| AC-05 | DELETE — thiếu Authorization header | DELETE /api/admin/coupons/:id | 4xx và dữ liệu không đổi |
| AC-06 | DELETE — token user thường | DELETE /api/admin/coupons/:id | 4xx và dữ liệu không đổi |
| BL-01 | Xem danh sách coupon (admin) | GET /api/coupons | 2xx và dữ liệu được lưu đúng |
| BL-02 | Tạo → kiểm tra xuất hiện trong list | POST → GET /api/coupons | 2xx và dữ liệu được lưu đúng |
| BL-03 | Xóa → kiểm tra biến mất khỏi list | DELETE → GET /api/coupons | 2xx và dữ liệu được lưu đúng |
| BL-04 | Mass assignment is_active=0 | POST /api/admin/coupons | CẦN LÀM RÕ |
| BL-05 | Double delete | DELETE /api/admin/coupons/:id (lần 2) | CẦN LÀM RÕ |

**Thống kê:**

| Kỳ vọng | Số test |
|---------|--------|
| 2xx và dữ liệu được lưu đúng | 10 (DT-01, DT-02, DT-15, BV-03, BV-05, BV-06, BL-01, BL-02, BL-03, + DT-01 cover BV-08) |
| 4xx và dữ liệu không đổi | 21 |
| CẦN LÀM RÕ | 4 (DT-13, DT-14, BL-04, BL-05) |
| **Tổng** | **35** |
