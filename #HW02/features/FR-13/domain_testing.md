# FR-13 – Dashboard & Quản lý đơn hàng · Domain Testing

## Bước 1: Trích yêu cầu

### 1.1 Trích nguyên văn từ SRS & Tài liệu API
**FR-13: Dashboard**
- Hiển thị tổng doanh thu: Chỉ tính tổng `total_amount` của các đơn có `status = 'delivered'`.
- Hiển thị tổng số đơn hàng.

**FR-12: Kiểm soát truy cập (Access Control)**
- Phân hệ Admin chỉ dành cho tài khoản có `role = 'admin'`.
- Tất cả các API Admin (`/api/admin/*`) đều phải yêu cầu: Token JWT hợp lệ và `role = 'admin'` trong Token.

**FR-10: Trạng thái Đơn hàng**
- 5 trạng thái: `pending`, `confirmed`, `shipping`, `delivered`, `canceled`.
- Luồng hợp lệ: `pending` → `confirmed` → `shipping` → `delivered`; `pending`/`confirmed` → `canceled`.
- `delivered` và `canceled` là trạng thái kết thúc.

**Yêu cầu bảo mật & API:**
- **SEC-02**: Các API có tính bảo mật phải yêu cầu JWT Token hợp lệ.
- **SEC-03**: API Admin phải kiểm tra `role = 'admin'` trong Token, không chỉ kiểm tra sự tồn tại của Token.
- **POST /api/checkout**: Header `Authorization: Bearer <token>`, Body `{"total_amount": number, "shipping_address": string}`.
- **GET /api/admin/orders**: Lấy danh sách đơn hàng toàn hệ thống (dùng tính số liệu Dashboard).
- **PUT /api/admin/orders/:id/status**: Cập nhật trạng thái đơn hàng.

### 1.2 Bảng yêu cầu
| Mã | Yêu cầu (ngắn gọn) | Nguồn | Loại |
| :--- | :--- | :--- | :--- |
| R1 | Tổng doanh thu Dashboard chỉ cộng dồn `total_amount` của các đơn có `status = 'delivered'` | FR-13 | Nghiệp vụ |
| R2 | Hiển thị tổng số lượng đơn hàng hiện có trên hệ thống | FR-13 | Nghiệp vụ |
| R3 | Phân hệ Admin chỉ dành cho tài khoản có `role = 'admin'` | FR-12 | Truy cập |
| R4 | Tất cả API Admin (`/api/admin/*`) phải có JWT Token hợp lệ | FR-12, SEC-02 | Bảo mật |
| R5 | API Admin phải kiểm tra `role = 'admin'` trong Token | FR-12, SEC-03 | Bảo mật / Truy cập |
| R6 | Trạng thái đơn hàng gồm 5 loại: `pending`, `confirmed`, `shipping`, `delivered`, `canceled` | FR-10 | Input |
| R7 | Luồng chuyển trạng thái phải tuân thủ đúng quy định SRS | FR-10 | Nghiệp vụ |

### 1.3 Endpoint liên quan
| Method | Endpoint | Cần token? | Body / tham số |
| :--- | :--- | :-: | :--- |
| GET | `/api/admin/orders` | Có (Admin) | Không có |
| PUT | `/api/admin/orders/:id/status` | Có (Admin) | `{"status": "confirmed"}` (JSON) |
| POST | `/api/checkout` | Có (Bearer) | `{"total_amount": 200000, "shipping_address": "123 Le Loi"}` (JSON) |
| POST | `/api/login` | Không | `{"email": "...", "password": "..."}` (dùng lấy token test) |

### 1.4 Giả định và chỗ SRS im lặng
| # | Điều chưa rõ | Giả định tạm | Đã hỏi GV/TA? |
| :-: | :--- | :--- | :-: |
| 1 | `total_amount` bằng `0` hoặc âm (`< 0`) có được checkout không | `total_amount` phải là số nguyên dương (`> 0`) | Chưa |
| 2 | `total_amount` gửi chuỗi số (vd: `"200000"`) hệ thống xử lý thế nào | Ép kiểu thành số hoặc từ chối 4xx | Chưa |
| 3 | `shipping_address` rỗng `""` hoặc chỉ khoảng trắng có hợp lệ không | Địa chỉ nhận hàng không được để rỗng | Chưa |
| 4 | `status` viết hoa (vd: `"DELIVERED"`) có chấp nhận không | Hệ thống phân biệt hoa thường (Case-sensitive) | Chưa |
| 5 | Tổng số đơn hàng trên Dashboard có đếm đơn `canceled` không | Đếm toàn bộ bản ghi đơn hàng trong hệ thống | Chưa |

---

## Bước 2: Xác định biến

### 2.1 Biến đầu vào
| Biến | Vị trí | Kiểu | Ràng buộc SRS nêu rõ | SRS im lặng về | Có thứ tự / số? (→ BVA) |
| :--- | :--- | :--- | :--- | :--- | :-: |
| `total_amount` | body | số | Số tiền của đơn hàng khi checkout | Giới hạn nhỏ nhất/lớn nhất, xử lý số âm, bằng 0, thập phân | **Có**: Giá trị số |
| `shipping_address` | body | chuỗi | Địa chỉ nhận hàng | Độ dài tối thiểu/tối đa, rỗng, khoảng trắng | **Có**: Độ dài chuỗi |
| `status` | body | chuỗi | Nhận 1 trong 5 giá trị Enum (FR-10) | Phân biệt hoa thường, giá trị ngoài Enum | Không (Enum) |
| `:id` | path | số | Định danh đơn hàng cần cập nhật status | Xử lý khi ID không tồn tại hoặc không phải số | Không |
| `Authorization` | header | JWT | Bắt buộc, chứa `role = 'admin'` cho API Admin | Token hết hạn, sai chữ ký, token role `user` | Không |

### 2.2 Biến trạng thái / điều kiện ẩn
| Biến | Ảnh hưởng | Cách dựng trạng thái cho test |
| :--- | :--- | :--- |
| Trạng thái đơn hàng hiện tại trong CSDL | Quyết định chuyển đổi status hợp lệ hay không (R7) | Gọi `POST /api/checkout` rồi `PUT status` từng bước để đưa đơn về status mong muốn (`pending`, `confirmed`, `shipping`, `delivered`, `canceled`) |
| Token & Vai trò người gọi (Auth State) | Quyết định quyền gọi API Admin (R3, R4, R5) | Đăng nhập lấy Token Admin (`role='admin'`), Token User (`role='user'`), hoặc gửi Token không hợp lệ |

### 2.3 Đầu ra cần quan sát
- **Mã lỗi HTTP**: `200/201` khi hợp lệ, `400` khi sai input/luồng, `401` khi thiếu token, `403` khi sai role, `404` khi không tìm thấy ID.
- **Số liệu Dashboard**:
  - `Total Revenue`: Chỉ cộng tổng $total\_amount$ của đơn `delivered`.
  - `Total Orders`: Tổng số bản ghi đơn hàng thu được.
- **Tác dụng phụ (Side-effect)**: Cập nhật status không làm thay đổi $total\_amount$ và $shipping\_address$ của đơn hàng gốc.

---

## Bước 3–4: Chia lớp tương đương và test case Domain Testing

### 3.1 Lớp tương đương theo từng biến

#### Biến `total_amount` & `shipping_address` (Checkout API)
| Lớp | Hợp lệ? | Đặc điểm / cách vi phạm | Đại diện | Test ID |
| :--- | :-: | :--- | :--- | :--- |
| AMT-V1 | ✔ | Số nguyên dương hợp lệ | `200000` | DT-01 |
| AMT-I1 | ✘ | Thiếu thuộc tính `total_amount` | `undefined` | DT-02 |
| AMT-U1 | CẦN LÀM RÕ | Chuỗi số `"200000"` | `"200000"` | DT-03 |
| AMT-I2 | ✘ | Sai kiểu boolean | `true` | DT-04 |
| ADDR-I1 | ✘ | Thiếu thuộc tính `shipping_address` | `undefined` | DT-05 |
| ADDR-U1 | CẦN LÀM RÕ | Chuỗi rỗng `""` | `""` | DT-06 |
| ADDR-U2 | CẦN LÀM RÕ | Chuỗi chỉ có khoảng trắng | `"   "` | DT-07 |

#### Biến `status` & Luồng chuyển trạng thái (Order Status API)
| Lớp | Hợp lệ? | Đặc điểm / Luồng chuyển | Đại diện | Test ID |
| :--- | :-: | :--- | :--- | :--- |
| ST-V1 | ✔ | Luồng `pending` → `confirmed` | `pending` → `confirmed` | TRANS-01 |
| ST-V2 | ✔ | Luồng `confirmed` → `shipping` | `confirmed` → `shipping` | TRANS-02 |
| ST-V3 | ✔ | Luồng `shipping` → `delivered` | `shipping` → `delivered` | TRANS-03 |
| ST-V4 | ✔ | Luồng `pending` → `canceled` | `pending` → `canceled` | TRANS-04 |
| ST-V5 | ✔ | Luồng `confirmed` → `canceled` | `confirmed` → `canceled` | TRANS-05 |
| ST-I1 | ✘ | Nhảy bước: `pending` → `delivered` | `pending` → `delivered` | TRANS-06 |
| ST-I2 | ✘ | Quay ngược: `confirmed` → `pending` | `confirmed` → `pending` | TRANS-07 |
| ST-I3 | ✘ | Sai luồng: `shipping` → `canceled` | `shipping` → `canceled` | TRANS-08 |
| ST-I4 | ✘ | Trạng thái kết thúc: `delivered` → `canceled` | `delivered` → `canceled` | TRANS-09 |
| ST-I5 | ✘ | Trạng thái kết thúc: `canceled` → `confirmed` | `canceled` → `confirmed` | TRANS-10 |
| ST-I6 | ✘ | Giá trị không nằm trong Enum | `"completed"` | TRANS-11 |
| ST-U1 | CẦN LÀM RÕ | Giá trị viết hoa | `"DELIVERED"` | TRANS-12 |

#### Biến Path `:id`
| Lớp | Hợp lệ? | Đặc điểm | Đại diện | Test ID |
| :--- | :-: | :--- | :--- | :--- |
| ID-I1 | ✘ | Order ID không tồn tại trong CSDL | `999999` | ID-01 |
| ID-I2 | ✘ | Order ID sai kiểu dữ liệu (chuỗi) | `"abc"` | ID-02 |

### 3.2 Bảng Test Case Domain Testing
| ID | Lớp | Mô tả | Input (Request Body / Path) | Kỳ vọng (theo SRS) | Req |
| :--- | :--- | :--- | :--- | :--- | :--- |
| DT-01 | AMT-V1 | Baseline Checkout hợp lệ | `{"total_amount": 200000, "shipping_address": "123 Le Loi"}` | 2xx và dữ liệu được lưu đúng | R1, R2 |
| DT-02 | AMT-I1 | Thiếu trường `total_amount` | `{"shipping_address": "123 Le Loi"}` | 4xx và dữ liệu không đổi | R1 |
| DT-03 | AMT-U1 | `total_amount` truyền dạng chuỗi | `{"total_amount": "200000", "shipping_address": "123 Le Loi"}` | CẦN LÀM RÕ | R1 |
| DT-04 | AMT-I2 | `total_amount` sai kiểu boolean | `{"total_amount": true, "shipping_address": "123 Le Loi"}` | 4xx và dữ liệu không đổi | R1 |
| DT-05 | ADDR-I1 | Thiếu trường `shipping_address` | `{"total_amount": 200000}` | 4xx và dữ liệu không đổi | R2 |
| DT-06 | ADDR-U1 | `shipping_address` chuỗi rỗng | `{"total_amount": 200000, "shipping_address": ""}` | CẦN LÀM RÕ | R2 |
| DT-07 | ADDR-U2 | `shipping_address` toàn khoảng trắng | `{"total_amount": 200000, "shipping_address": "   "}` | CẦN LÀM RÕ | R2 |
| TRANS-01 | ST-V1 | Chuyển `pending` → `confirmed` | `PUT /api/admin/orders/:id/status` `{"status": "confirmed"}` | 2xx và dữ liệu được lưu đúng | R7 |
| TRANS-02 | ST-V2 | Chuyển `confirmed` → `shipping` | `PUT /api/admin/orders/:id/status` `{"status": "shipping"}` | 2xx và dữ liệu được lưu đúng | R7 |
| TRANS-03 | ST-V3 | Chuyển `shipping` → `delivered` | `PUT /api/admin/orders/:id/status` `{"status": "delivered"}` | 2xx và dữ liệu được lưu đúng | R1, R7 |
| TRANS-04 | ST-V4 | Chuyển `pending` → `canceled` | `PUT /api/admin/orders/:id/status` `{"status": "canceled"}` | 2xx và dữ liệu được lưu đúng | R7 |
| TRANS-05 | ST-V5 | Chuyển `confirmed` → `canceled` | `PUT /api/admin/orders/:id/status` `{"status": "canceled"}` | 2xx và dữ liệu được lưu đúng | R7 |
| TRANS-06 | ST-I1 | Chuyển `pending` → `delivered` (nhảy bước) | `PUT /api/admin/orders/:id/status` `{"status": "delivered"}` | 4xx và dữ liệu không đổi | R7 |
| TRANS-07 | ST-I2 | Chuyển `confirmed` → `pending` (quay ngược) | `PUT /api/admin/orders/:id/status` `{"status": "pending"}` | 4xx và dữ liệu không đổi | R7 |
| TRANS-08 | ST-I3 | Chuyển `shipping` → `canceled` (sai luồng) | `PUT /api/admin/orders/:id/status` `{"status": "canceled"}` | 4xx và dữ liệu không đổi | R7 |
| TRANS-09 | ST-I4 | Chuyển `delivered` → `canceled` (trạng thái kết thúc) | `PUT /api/admin/orders/:id/status` `{"status": "canceled"}` | 4xx và dữ liệu không đổi | R7 |
| TRANS-10 | ST-I5 | Chuyển `canceled` → `confirmed` (trạng thái kết thúc) | `PUT /api/admin/orders/:id/status` `{"status": "confirmed"}` | 4xx và dữ liệu không đổi | R7 |
| TRANS-11 | ST-I6 | Status không nằm trong Enum | `PUT /api/admin/orders/:id/status` `{"status": "completed"}` | 4xx và dữ liệu không đổi | R6 |
| TRANS-12 | ST-U1 | Status dạng viết hoa | `PUT /api/admin/orders/:id/status` `{"status": "DELIVERED"}` | CẦN LÀM RÕ | R6 |
| ID-01 | ID-I1 | Cập nhật status cho Order ID không tồn tại | `PUT /api/admin/orders/999999/status` `{"status": "confirmed"}` | 4xx và dữ liệu không đổi | R6 |
| ID-02 | ID-I2 | Cập nhật status cho Order ID không phải số | `PUT /api/admin/orders/abc/status` `{"status": "confirmed"}` | 4xx và dữ liệu không đổi | R6 |

---

## Bước 6: Nghiệp vụ, bảo mật, truy cập

### 6.1 Test case Bảo mật, Truy cập & Nghiệp vụ tích hợp
| ID | Mô tả | Cách dựng / Input | Kỳ vọng (theo SRS) | Req |
| :--- | :--- | :--- | :--- | :--- |
| AC-01 | Xem danh sách đơn hàng không có Token | `GET /api/admin/orders` (Không truyền Header `Authorization`) | 401/403 và dữ liệu không đổi | R4, SEC-02 |
| AC-02 | Xem danh sách đơn hàng bằng Token User thường (`role='user'`) | `GET /api/admin/orders` (Header `Bearer <user_token>`) | 401/403 và dữ liệu không đổi | R3, R5, SEC-03 |
| AC-03 | Xem danh sách đơn hàng với Token sai chữ ký | `GET /api/admin/orders` (Header `Bearer abc.def.ghi`) | 401/403 và dữ liệu không đổi | R4, SEC-02 |
| AC-04 | Cập nhật status đơn hàng không có Token | `PUT /api/admin/orders/:id/status` (Không Token) | 401/403 và dữ liệu không đổi | R4, SEC-02 |
| AC-05 | Cập nhật status đơn hàng bằng Token User thường | `PUT /api/admin/orders/:id/status` (Token User) | 401/403 và dữ liệu không đổi | R3, R5, SEC-03 |
| AC-06 | Đặt hàng Checkout không có Token | `POST /api/checkout` (Không Token) | 401/403 và dữ liệu không đổi | R4, SEC-02 |
| BL-01 | Doanh thu Dashboard tính chuẩn CHỈ từ đơn `delivered`, Tổng đơn đếm đủ | Tạo đơn ở cả 5 trạng thái, kiểm tra `GET /api/admin/orders` | 2xx, Doanh thu chỉ cộng đơn `delivered` | R1, R2, FR-13 |
| BL-02 | Chuyển đơn sang `delivered` làm tăng Doanh thu chính xác +200,000 | Chuyển đơn từ `shipping` → `delivered` và đọc lại số liệu | 2xx, Doanh thu Dashboard tăng đúng +200,000 | R1, FR-13 |
| BL-03 | Cập nhật status không làm đổi `total_amount` và `shipping_address` | Tạo đơn `150000`, đổi status sang `confirmed` và kiểm tra lại | 2xx, `total_amount` và `shipping_address` giữ nguyên | R6, FR-10 |
| BL-04 | Cập nhật status chứa payload SQL Injection | `PUT /api/admin/orders/:id/status` với `{"status": "' OR '1'='1"}` | 400 Bad Request, không lỗi 5xx | R6, SEC-05 |