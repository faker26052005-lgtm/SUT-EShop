# FR-08-07 – FR-08 · Bước 7 - Kiểm tra lại

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 20:47:39 (UTC+0700) |
| Feature / bước | FR-08 – Bước 7 - Kiểm tra lại |
| Chat / phiên | FR8 |
| Commit liên quan | |

## Prompt (nguyên văn)
Hãy rà soát lại toàn bộ test case bạn đã sinh ở các bước 4, 5 và 6. Sau một thao tác ghi (tạo, sửa, xóa hoặc áp dụng), ngoài dữ liệu được gửi lên thì còn những trạng thái nào khác có thể bị thay đổi (các trường không gửi, bản ghi khác, dữ liệu liên quan)? Đã có test nào kiểm tra điều đó chưa? Nếu chưa, hãy bổ sung test case

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Khi thực hiện thao tác **Checkout (`POST /api/checkout`)**, request payload từ client **chỉ gửi lên 2 trường**: `total_amount` và `shipping_address`.

Tuy nhiên, về mặt hệ thống, một hành vi ghi (Checkout) thành công sẽ tạo ra nhiều **tác dụng phụ (side-effects)** và làm biến đổi trạng thái của các đối tượng dữ liệu liên quan khác.

---

### 1. Phân tích các trạng thái & dữ liệu liên quan bị ảnh hưởng (Side-effects)

1. **Bản ghi Đơn hàng mới (`Order`):**
* **Danh sách chi tiết sản phẩm (`Order Items`):** Phải được sao chép/snapshot chính xác từ giỏ hàng sang đơn hàng, dù client không truyền field này trong body `/api/checkout`.
* **Các trường hệ thống tự sinh (Un-sent Fields):** Mã đơn hàng (`order_id`), thời gian tạo (`created_at`), trạng thái mặc định của đơn hàng (`order_status` như `PENDING` / `PROCESSING`).
* **Chủ sở hữu đơn hàng (`User ID`):** Được gán tự động dựa trên JWT Token của user thực hiện request.


2. **Tính cách ly dữ liệu giữa các User (Data Isolation / Multi-tenancy):**
* Đơn hàng mới tạo của User A chỉ được xuất hiện trong lịch sử đơn hàng của User A (`GET /api/orders/my-orders`), tuyệt đối không rò rỉ sang User B.


3. **Tính bất biến của dữ liệu lịch sử (Data Snapshot Integrity):**
* Danh sách và giá của các sản phẩm trong đơn hàng đã tạo phải giữ nguyên, không bị ảnh hưởng nếu sản phẩm trong danh mục (Catalog/Database) bị sửa tên hoặc sửa giá *sau thời điểm thanh toán*.


4. **Trạng thái tồn kho sản phẩm (Inventory Stock):**
* *(CẦN LÀM RÕ)* Số lượng tồn kho của các sản phẩm có bị trừ tương ứng sau khi thanh toán thành công không?


5. **Trạng thái Giỏ hàng (`Cart`):**
* Xóa toàn bộ sản phẩm trong giỏ hàng của User thực hiện checkout *(Đã kiểm thử ở BL-02 và BL-03)*.



---

### 2. Kết quả rà soát các Test Case đã có (Steps 4, 5, 6)

* **ĐÃ KIỂM TRA:**
* Giỏ hàng bị xóa sau khi checkout thành công (`BL-02`).
* Giỏ hàng không bị xóa khi checkout thất bại (`BL-03`).
* `total_amount` của đơn hàng lưu đúng theo Backend tự tính (`BL-01`).


* **CHƯA KIỂM TRA (Còn thiếu):**
* Danh sách sản phẩm chi tiết trong đơn hàng được tạo (`Order Items Snapshot`).
* Các trường hệ thống tự sinh của đơn hàng (`order_id`, `created_at`, `status`).
* Tính cách ly dữ liệu đơn hàng giữa các tài khoản người dùng khác nhau (Data Isolation).
* Tính bất biến của lịch sử đơn hàng khi danh mục sản phẩm thay đổi sau thanh toán.
* Sự thay đổi số lượng tồn kho sản phẩm (Inventory Stock).

---

### 3. Bổ sung các Test Case kiểm tra Trạng thái & Dữ liệu liên quan

Dưới đây là các test case bổ sung để đảm bảo bao phủ hoàn toàn các side-effects của hệ thống:

| ID | Mô tả | Cách dựng và Input | Kỳ vọng theo SRS | Mã YC |
| --- | --- | --- | --- | --- |
| **BL-07** | Kiểm tra danh sách sản phẩm trong giỏ hàng được chuyển đầy đủ sang Đơn hàng mới | **Setup:** Thêm SP A (SL: 2, Giá: 100k) và SP B (SL: 1, Giá: 50k) vào giỏ.<br>**Endpoint:** `POST /api/checkout`<br>**Body:** `{"total_amount": 250000, "shipping_address": "123 Le Loi"}`<br>**Verify:** Gọi `GET /api/orders/my-orders`. | 2xx và dữ liệu được lưu đúng *(Đơn hàng mới lưu đủ 2 SP A và 1 SP B với đúng đơn giá/số lượng từ giỏ)* | R3, R4 |
| **BL-08** | Kiểm tra các trường hệ thống tự sinh của Đơn hàng mới | **Setup:** Giỏ hàng có 1 SP -> Gọi `POST /api/checkout` thành công.<br>**Verify:** Gọi `GET /api/orders/my-orders` kiểm tra bản ghi đơn hàng vừa tạo. | 2xx và dữ liệu được lưu đúng *(Có đầy đủ `order_id` hợp lệ, `created_at` đúng thời gian thực, và `status` mặc định)* | R4 |
| **BL-09** | Kiểm tra tính cách ly dữ liệu đơn hàng giữa các tài khoản (Data Isolation) | **Setup:** User A thanh toán thành công đơn hàng X.<br>**Verify:** User B đăng nhập và gọi `GET /api/orders/my-orders`. | 2xx và dữ liệu được lưu đúng *(Lịch sử đơn hàng của User B không chứa đơn hàng X của User A)* | R1, R6 |
| **BL-10** | Kiểm tra tính bất biến của lịch sử đơn hàng khi sản phẩm đổi giá/tên sau thanh toán (Snapshot) | **Setup:** User A mua SP A (giá 100k) -> Thanh toán thành công.<br>**Action:** Admin đổi giá SP A trong DB thành 200k.<br>**Verify:** User A gọi `GET /api/orders/my-orders`. | 2xx và dữ liệu được lưu đúng *(Đơn hàng cũ vẫn giữ nguyên giá SP A = 100k và `total_amount` = 100k)* | R4 |
| **BL-11** | Kiểm tra sự biến động số lượng tồn kho (Inventory Stock) sau thanh toán | **Setup:** Kiểm tra tồn kho SP A = 10 -> User A mua 2 SP A và thanh toán thành công.<br>**Verify:** Kiểm tra lại số lượng tồn kho của SP A trong hệ thống. | CẦN LÀM RÕ *(Do SRS không đề cập đến việc trừ kho)* | R4 |


## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
