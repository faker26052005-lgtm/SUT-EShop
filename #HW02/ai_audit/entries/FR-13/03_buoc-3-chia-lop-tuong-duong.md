# FR-13-03 – FR-13 · Bước 3 - chia lớp tương đương

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 20:53:04 (UTC+0700) |
| Feature / bước | FR-13 – Bước 3 - chia lớp tương đương |
| Chat / phiên | FR13 |
| Commit liên quan |  |

## Prompt (nguyên văn)
BƯỚC 3 – CHIA LỚP TƯƠNG ĐƯƠNG (Domain Testing).
Với từng biến ở bước 2: (a) liệt kê các lớp hợp lệ; (b) liệt kê các lớp không hợp lệ, mỗi lớp ứng với MỘT cách vi phạm; (c) chọn một giá trị đại diện cho mỗi lớp.
Quy tắc: đại diện của lớp không hợp lệ chỉ được vi phạm đúng một điều kiện. Nếu không thể (ví dụ lỗi sai kiểu dữ liệu), hãy nói rõ vì sao. Lớp mà SRS không nói là hợp lệ hay không thì đánh dấu CẦN LÀM RÕ.
Trình bày mỗi biến một bảng: Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là kết quả **BƯỚC 3 – CHIA LỚP TƯƠNG ĐƯƠNG (Domain Testing)** cho các biến đầu vào, biến trạng thái và miền dữ liệu tổng hợp Dashboard.

---

### 1. Biến Header `Authorization` (Các API Admin)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **AUTH_V1** | Hợp lệ | *(Không vi phạm)* | `"Bearer <valid_admin_jwt>"` | R3, R4, R5, SEC-02, SEC-03 |
| **AUTH_IV1** | Không | Thiếu toàn bộ Header Authorization | `(Không gửi Header)` | R4, SEC-02 |
| **AUTH_IV2** | Không | Thiếu tiền tố `Bearer ` trong chuỗi token | `"eyJhbGciOi..."` | R4, SEC-02 |
| **AUTH_IV3** | Không | Chuỗi Token JWT sai cấu trúc/chữ ký không hợp lệ | `"Bearer invalid.jwt.string"` | R4, SEC-02 |
| **AUTH_IV4** | Không | Token JWT hợp lệ nhưng đã hết hạn thời gian (`exp`) | `"Bearer <expired_jwt>"` | R4, SEC-02 |
| **AUTH_IV5** | Không | Token JWT hợp lệ nhưng có `role = 'user'` | `"Bearer <valid_user_jwt>"` | R3, R5, SEC-03 |
| **AUTH_IV6** | Không | Token JWT hợp lệ nhưng thiếu claim `role` hoặc role rỗng | `"Bearer <valid_jwt_no_role>"` | R3, R5, SEC-03 |

---

### 2. Biến Path `:id` (`PUT /api/admin/orders/:id/status`)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **ID_V1** | Hợp lệ | *(Không vi phạm)* | `"101"` | R6 |
| **ID_IV1** | Không | ID đúng kiểu dữ liệu nhưng không tồn tại trong DB | `"999999"` | R6 |
| **ID_IV2** | Không | Sai kiểu dữ liệu (chứa chữ/ký tự đặc biệt khi ID là số) *(Lỗi vi phạm kiểu dữ liệu)* | `"abc_xyz"` | R6 |
| **ID_IV3** | Không | ID là số âm hoặc bằng `0` | `"-5"` hoặc `"0"` | R6 |
| **ID_IV4** | CẦN LÀM RÕ | Khuyết giá trị `:id` trên đường dẫn URL | `""` *(Endpoint thành `/api/admin/orders//status`)* | R6 |

---

### 3. Biến Body `status` (`PUT /api/admin/orders/:id/status`)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **ST_V1** | Hợp lệ | *(Không vi phạm - pending)* | `"pending"` | R6, R7 |
| **ST_V2** | Hợp lệ | *(Không vi phạm - confirmed)* | `"confirmed"` | R6, R7 |
| **ST_V3** | Hợp lệ | *(Không vi phạm - shipping)* | `"shipping"` | R6, R7 |
| **ST_V4** | Hợp lệ | *(Không vi phạm - delivered)* | `"delivered"` | R1, R6, R7 |
| **ST_V5** | Hợp lệ | *(Không vi phạm - canceled)* | `"canceled"` | R6, R7 |
| **ST_IV1** | Không | Giá trị chuỗi không nằm trong Enum 5 trạng thái quy định | `"completed"` | R6 |
| **ST_IV2** | Không | Sai kiểu dữ liệu (truyền kiểu Number/Boolean/Object) *(Lỗi vi phạm kiểu dữ liệu)* | `123` hoặc `true` | R6 |
| **ST_IV3** | Không | Truyền chuỗi rỗng `""` | `""` | R6 |
| **ST_IV4** | Không | Thiếu hoàn toàn thuộc tính `status` trong JSON Body | `{}` | R6 |
| **ST_IV5** | CẦN LÀM RÕ | Viết hoa chữ cái (SRS không nói rõ có chấp nhận Case-Insensitive hay không) | `"DELIVERED"` | R6 |

---

### 4. Biến Body `total_amount` (`POST /api/checkout`)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **AMT_V1** | Hợp lệ | *(Không vi phạm - Số nguyên dương hợp lệ)* | `200000` | R1, R2 |
| **AMT_IV1** | CẦN LÀM RÕ | Giá trị số âm (`< 0`) (SRS im lặng về việc có chặn đơn hàng âm ở Checkout không) | `-50000` | R1 |
| **AMT_IV2** | CẦN LÀM RÕ | Giá trị bằng `0` (SRS im lặng về việc chấp nhận đơn hàng 0 đồng không) | `0` | R1 |
| **AMT_IV3** | CẦN LÀM RÕ | Giá trị số thập phân/số lẻ (SRS im lặng về việc có cho phép số lẻ không) | `199000.50` | R1 |
| **AMT_IV4** | Không | Sai kiểu dữ liệu (truyền String/Boolean) *(Lỗi vi phạm kiểu dữ liệu)* | `"200000"` | R1 |
| **AMT_IV5** | Không | Thiếu thuộc tính `total_amount` trong JSON Body | `{}` | R1 |

---

### 5. Biến Body `shipping_address` (`POST /api/checkout`)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **ADDR_V1** | Hợp lệ | *(Không vi phạm - Chuỗi địa chỉ hợp lệ)* | `"123 Le Loi, TP.HCM"` | R2 |
| **ADDR_IV1** | CẦN LÀM RÕ | Chuỗi rỗng `""` (SRS im lặng về độ dài tối thiểu của địa chỉ) | `""` | R2 |
| **ADDR_IV2** | CẦN LÀM RÕ | Chuỗi chỉ chứa khoảng trắng (Whitespace) (SRS im lặng) | `"   "` | R2 |
| **ADDR_IV3** | Không | Sai kiểu dữ liệu (truyền Number/Boolean/Object) *(Lỗi vi phạm kiểu dữ liệu)* | `123456` | R2 |
| **ADDR_IV4** | Không | Thiếu thuộc tính `shipping_address` trong JSON Body | `{}` | R2 |

---

### 6. Biến Trạng Thái & Luồng Chuyển Đổi Đơn Hàng (`PUT /api/admin/orders/:id/status`)

| Lớp | Hợp lệ? | Cách vi phạm | Đại diện (Luồng chuyển) | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **TRANS_V1** | Hợp lệ | Từ `pending` sang `confirmed` | `pending` → `confirmed` | R7 |
| **TRANS_V2** | Hợp lệ | Từ `pending` sang `canceled` | `pending` → `canceled` | R7 |
| **TRANS_IV1** | Không | Từ `pending` nhảy bước sang `shipping` hoặc `delivered` | `pending` → `delivered` | R7 |
| **TRANS_V3** | Hợp lệ | Từ `confirmed` sang `shipping` | `confirmed` → `shipping` | R7 |
| **TRANS_V4** | Hợp lệ | Từ `confirmed` sang `canceled` | `confirmed` → `canceled` | R7 |
| **TRANS_IV2** | Không | Từ `confirmed` quay ngược `pending` hoặc nhảy sang `delivered` | `confirmed` → `pending` | R7 |
| **TRANS_V5** | Hợp lệ | Từ `shipping` sang `delivered` | `shipping` → `delivered` | R1, R7 |
| **TRANS_IV3** | Không | Từ `shipping` quay ngược `pending`/`confirmed` hoặc sang `canceled` | `shipping` → `canceled` | R7 |
| **TRANS_IV4** | Không | Từ trạng thái kết thúc `delivered` chuyển sang trạng thái bất kỳ | `delivered` → `canceled` | R7 |
| **TRANS_IV5** | Không | Từ trạng thái kết thúc `canceled` chuyển sang trạng thái bất kỳ | `canceled` → `confirmed` | R7 |

---

### 7. Miền Dữ Liệu Gom Nhóm Cho Dashboard (FR-13 Aggregation Domain)

| Lớp | Hợp lệ? | Cách vi phạm / Quy tắc gom nhóm | Đại diện (Trạng thái đơn trong DB) | Mã yêu cầu |
| --- | --- | --- | --- | --- |
| **DASH_V1** | Hợp lệ | Tính cả vào **Tổng Doanh Thu** và **Tổng Số Đơn Hàng** | Đơn hàng `status = 'delivered'`, `total_amount = 100000` | R1, R2 |
| **DASH_V2** | Hợp lệ | Không tính vào Doanh Thu, nhưng tính vào **Tổng Số Đơn Hàng** | Đơn hàng `status = 'pending'`, `total_amount = 100000` | R1, R2 |
| **DASH_V3** | Hợp lệ | Không tính vào Doanh Thu, nhưng tính vào **Tổng Số Đơn Hàng** | Đơn hàng `status = 'confirmed'`, `total_amount = 100000` | R1, R2 |
| **DASH_V4** | Hợp lệ | Không tính vào Doanh Thu, nhưng tính vào **Tổng Số Đơn Hàng** | Đơn hàng `status = 'shipping'`, `total_amount = 100000` | R1, R2 |
| **DASH_IV1** | CẦN LÀM RÕ | Không tính vào Doanh Thu; SRS im lặng về việc đơn `canceled` có đếm vào Tổng Đơn không | Đơn hàng `status = 'canceled'`, `total_amount = 100000` | R1, R2 |

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
