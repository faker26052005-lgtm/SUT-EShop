# FR-04-01 – FR-04 · Bước 1 - trích yêu cầu

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-19 13:20:02 (UTC+0700) |
| Feature / bước | FR-04 – Bước 1 - trích yêu cầu |
| Chat / phiên | 1 |
| Commit liên quan | chores: AI audit |

## Prompt (nguyên văn)
Bạn là kỹ sư kiểm thử phần mềm. Tôi sẽ kiểm thử black-box feature {FR_ID} của hệ thống EShop bằng Domain Testing và Boundary Value Analysis. Ta làm theo từng bước, mỗi bước một yêu cầu riêng.

BƯỚC 1 – TRÍCH YÊU CẦU.
Dưới đây là đặc tả (SRS) và tài liệu API của feature. Chỉ dùng thông tin trong hai tài liệu này; không suy đoán thêm và không dùng kiến thức về cách hệ thống được cài đặt.

## A. Trích SRS – FR-04: Quản lý hồ sơ cá nhân
- Người dùng đã đăng nhập có thể cập nhật: **Họ Tên**, **Số điện thoại**, **Địa chỉ giao hàng mặc định**.
- **Số điện thoại hợp lệ**: bắt đầu bằng số `0`, từ 10–11 chữ số.
- Email không được phép thay đổi qua giao diện.
- Người dùng chỉ có thể cập nhật hồ sơ của chính mình; không thể tự thay đổi thuộc tính `role`.

## B. Trích SRS – Yêu cầu bảo mật liên quan
| Mã | Nội dung |
| :--- | :--- |
| SEC-02 | Các API có tính bảo mật phải yêu cầu JWT Token hợp lệ. |
| SEC-04 | Mọi dữ liệu từ user nhập vào khi hiển thị trên UI phải được escape đúng cách, không dùng `innerHTML` trực tiếp. |
| SEC-06 | API cập nhật hồ sơ không được cho phép thay đổi trường `role` từ client. |

## C. Trích tài liệu API – Người dùng (Users)
*Lưu ý: Các API dưới đây yêu cầu truyền Token ở Header: `Authorization: Bearer <token>`*

### 2.1 Lấy thông tin cá nhân
- **Endpoint:** `GET /api/users/me`

### 2.2 Cập nhật hồ sơ cá nhân
- **Endpoint:** `PUT /api/users/me`
- **Mô tả:** Chỉ cho phép cập nhật thông tin cá nhân cơ bản.
- **Body (JSON):**
  ```json
  {
    "name": "Nguyen Van A",
    "shipping_address": "123 Le Loi, Q1, TP.HCM",
    "phone": "0912345678"
  }
  

Yêu cầu:
1. Lập bảng yêu cầu: Mã (R1, R2...), nội dung ngắn gọn, nguồn (mục SRS/SEC), loại (input / nghiệp vụ / bảo mật / truy cập).
2. Liệt kê endpoint liên quan: method, đường dẫn, có cần token không, body.
3. Liệt kê riêng các chỗ SRS im lặng hoặc mơ hồ (điều người kiểm thử cần biết để viết kỳ vọng nhưng SRS không nói). Mỗi chỗ ghi "CẦN LÀM RÕ" và không tự đoán kỳ vọng.
Chỉ trả về kết quả bước 1, chưa sinh test case.

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
### 1. Bảng yêu cầu (Requirements)

| Mã | Nội dung ngắn gọn | Nguồn | Loại yêu cầu |
| --- | --- | --- | --- |
| **R1** | Người dùng đã đăng nhập có thể cập nhật Họ Tên, Số điện thoại, Địa chỉ giao hàng. | FR-04 | Nghiệp vụ |
| **R2** | Số điện thoại bắt đầu bằng `0`, độ dài từ 10–11 chữ số. | FR-04 | Input |
| **R3** | Email không được phép thay đổi qua giao diện UI. | FR-04 | Nghiệp vụ |
| **R4** | Người dùng chỉ có thể cập nhật hồ sơ của chính mình. | FR-04 | Truy cập |
| **R5** | Không thể tự thay đổi thuộc tính `role` từ giao diện và API client. | FR-04, SEC-06 | Bảo mật |
| **R6** | Các API phải yêu cầu JWT Token hợp lệ ở header. | SEC-02 | Bảo mật / Truy cập |
| **R7** | Dữ liệu hiển thị trên UI phải được escape, không dùng `innerHTML`. | SEC-04 | Bảo mật |

### 2. Các Endpoint liên quan

* **API Lấy thông tin cá nhân**
* **Method:** `GET`
* **Đường dẫn:** `/api/users/me`
* **Token:** Có (`Authorization: Bearer <token>`)
* **Body:** Không có


* **API Cập nhật hồ sơ cá nhân**
* **Method:** `PUT`
* **Đường dẫn:** `/api/users/me`
* **Token:** Có (`Authorization: Bearer <token>`)
* **Body (JSON):**
```json
{
  "name": "string",
  "shipping_address": "string",
  "phone": "string"
}

```

```
### 3. Các điểm chưa rõ ràng (SRS im lặng hoặc mơ hồ)

* **CẦN LÀM RÕ:** Giới hạn độ dài (min/max length) và bộ ký tự cho phép của trường `name` là gì? Có cho phép số, ký tự đặc biệt, hoặc khoảng trắng ở đầu/cuối không?
* **CẦN LÀM RÕ:** Giới hạn độ dài (min/max length) và ký tự đặc biệt của `shipping_address` là gì?
* **CẦN LÀM RÕ:** Trường hợp để trống (empty string `""`) hoặc truyền `null` cho các trường `name`, `phone`, `shipping_address` có được phép hay không (trường nào bắt buộc, trường nào tùy chọn)?
* **CẦN LÀM RÕ:** Số điện thoại có cho phép chứa khoảng trắng (ví dụ: `091 234 5678`) hoặc dấu gạch ngang (`091-234-5678`) không, hay bắt buộc chỉ là các chữ số viết liền?
* **CẦN LÀM RÕ:** API `PUT /api/users/me` có hỗ trợ cập nhật từng phần (Partial update/PATCH) không? Nếu client chỉ gửi lên 1 trường (ví dụ chỉ có `phone`), hệ thống báo lỗi hay sẽ giữ nguyên các trường còn lại?
* **CẦN LÀM RÕ:** Nếu người dùng cố ý gửi thêm trường `email` vào body JSON của API `PUT`, hệ thống sẽ trả về lỗi (400 Bad Request) hay chỉ đơn giản là bỏ qua trường đó và cập nhật các trường hợp lệ?

## Rà soát của tôi (human review)
- Chấp nhận: TODO
- Sửa: TODO (sửa gì, vì sao)
- Loại bỏ: TODO
- AI bỏ sót (ghi tiếp sang `08_ai_gap_analysis.md`): TODO
