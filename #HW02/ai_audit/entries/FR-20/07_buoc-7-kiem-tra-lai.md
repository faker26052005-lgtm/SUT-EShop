# FR-20-07 – FR-20 · Bước 7 - Kiểm tra lại

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 08:44:06 (UTC+0700) |
| Feature / bước | FR-20 – Bước 7 - Kiểm tra lại |
| Chat / phiên | FR20 |
| Commit liên quan |  |

## Prompt (nguyên văn)
Hãy rà soát lại toàn bộ test case bạn đã sinh ở các bước 4, 5 và 6. Sau một thao tác ghi (tạo, sửa, xóa hoặc áp dụng), ngoài dữ liệu được gửi lên thì còn những trạng thái nào khác có thể bị thay đổi (các trường không gửi, bản ghi khác, dữ liệu liên quan)? Đã có test nào kiểm tra điều đó chưa? Nếu chưa, hãy bổ sung test case

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Sau khi rà soát lại bộ Test Case ở các bước 4, 5, và 6, tôi nhận thấy các test case trước đó chủ yếu tập trung vào việc **bản thân thao tác đó có thành công/thất bại đúng như điều kiện đầu vào hay không**, và chỉ kiểm tra trực tiếp vào trường dữ liệu đích (VD: tạo được user, đổi được trạng thái `status`).

Tuy nhiên, đối với một thao tác **Ghi (Write)**, chúng ta cần kiểm tra thêm các **tác dụng phụ (Side-effects) và tính toàn vẹn dữ liệu**. Cụ thể, còn những trạng thái sau có thể bị thay đổi sai lệch mà bộ test trước chưa bao phủ:

1. **Dữ liệu ẩn / Trường không được phép gửi (Mass Assignment):** Trong lúc Đăng ký, hacker có thể nhồi thêm các trường ẩn vào JSON (như `role`, `is_admin`, `balance`) để leo thang đặc quyền.
2. **Các trường dữ liệu khác trên cùng một bản ghi:** Khi Hủy đơn hàng, chỉ duy nhất trạng thái đổi thành `canceled`, các dữ liệu khác của đơn hàng (Tổng tiền, Ngày đặt, Danh sách sản phẩm) tuyệt đối không được biến mất hay thay đổi.
3. **Các bản ghi khác cùng cấp (Record Isolation):** Việc hủy đơn hàng A không được phép gây ảnh hưởng ngầm đến trạng thái của đơn hàng B (dù của cùng một user).

*(Lưu ý: SRS không đề cập đến việc hoàn số lượng sản phẩm (Inventory/Stock) hay giỏ hàng khi hủy đơn, nên tôi tuân thủ nguyên tắc không tự suy đoán thêm test case về Stock).*

Dưới đây là các Test Case bổ sung (Ký hiệu **SC - State Change**) nhằm lấp đầy lỗ hổng này:

### Bảng Test Case Bổ sung: Kiểm thử Tác dụng phụ và Toàn vẹn dữ liệu

| ID | Trạng thái / Khía cạnh kiểm tra | Mô tả Test Case | Cách dựng và Input (Hành động) | Kết quả mong đợi (Expected Result) | Mã Yêu cầu liên quan |
| --- | --- | --- | --- | --- | --- |
| **SC-01** | **Bảo vệ trường ẩn**<br>(Mass Assignment) | Kiểm tra việc nhồi thêm trường `role` vào payload Đăng ký để cố tình lấy quyền Admin. | **Input:** Gửi `POST /api/register` với Body:<br>`{"name": "User", "email": "hack@domain.com", "password": "Password123!@", "role": "admin"}`<br>**Check:** Dùng API Login lấy Token của user này gọi một API Admin. | API Đăng ký trả về 200 OK (hoặc 400 Bad Request tùy logic). **Quan trọng:** Nếu thành công, User sinh ra CHỈ mang role mặc định, thao tác gọi API Admin phải bị chặn (403 Forbidden). | SEC-03, FR-01 |
| **SC-02** | **Bảo vệ trường khác**<br>(Data Integrity) | Đảm bảo Hủy đơn hàng không làm mất hoặc sai lệch thông tin chi tiết của chính đơn hàng đó. | **Setup:** Dùng `POST /api/checkout` tạo đơn ID `1` (Tổng 200k). Lưu lại Response chi tiết.<br>**Input:** Gọi Hủy đơn `1`.<br>**Check:** Gọi `GET /api/orders/1`. | Chỉ có `status` đổi thành `canceled`. Các trường khác: Mã đơn, Ngày đặt, Tổng tiền (200k), Địa chỉ giao hàng phải được **giữ nguyên 100%** như lúc vừa tạo. | FR-10, FR-11 |
| **SC-03** | **Bảo vệ bản ghi khác**<br>(Record Isolation) | Đảm bảo Hủy đơn hàng này không làm "vạ lây" sang đơn hàng khác của cùng User. | **Setup:** Tạo 2 đơn hàng ID `2` và ID `3` (đều đang `pending` của User A).<br>**Input:** Gọi Hủy đơn ID `2`.<br>**Check:** Gọi `GET /api/orders/3`. | Đơn hàng ID `2` bị hủy. Đơn hàng ID `3` **vẫn giữ nguyên** trạng thái `pending`. | FR-10 |
| **SC-04** | **Trạng thái Giỏ hàng**<br>(State Dependency) | CẦN LÀM RÕ: Khi đặt hàng (`checkout`) thành công, giỏ hàng có bị làm trống không? | **Setup:** Gọi `POST /api/cart` thêm sản phẩm. Gọi `POST /api/checkout` tạo đơn ID `4`.<br>**Check:** Gọi `GET /api/cart` để xem giỏ hàng. | **CẦN LÀM RÕ** (SRS im lặng về việc clear giỏ hàng sau khi checkout, nhưng đây là flow rất dễ lỗi trong thực tế). | Mục 4 (Cart & Orders) |

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
