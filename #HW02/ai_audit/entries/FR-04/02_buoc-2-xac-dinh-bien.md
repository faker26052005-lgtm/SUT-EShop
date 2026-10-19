# FR-04-02 – FR-04 · Bước 2 - xác định biến

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-19 13:27:49 (UTC+0700) |
| Feature / bước | FR-04 – Bước 2 - xác định biến |
| Chat / phiên | TODO (tên hoặc link chat nếu có) |
| Commit liên quan | TODO (hash sau khi commit) |

## Prompt (nguyên văn)
BƯỚC 2 – XÁC ĐỊNH BIẾN.
Dựa trên kết quả bước 1 (không thêm thông tin từ bên ngoài), hãy:
1. Lập bảng biến đầu vào: tên biến, vị trí (body/query/path/header), kiểu dữ liệu, ràng buộc SRS nêu rõ, SRS im lặng về điều gì, và biến có thứ tự/số hay không (để áp dụng BVA).
2. Liệt kê biến trạng thái và điều kiện ẩn (ví dụ token, vai trò người dùng, dữ liệu có sẵn) cùng cách dựng trạng thái cho test.
3. Liệt kê những đầu ra cần quan sát để kết luận một test pass hay fail.
Chưa chia lớp, chưa sinh test case

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Dưới đây là kết quả BƯỚC 2 – Xác định biến cho quá trình Domain Testing và Boundary Value Analysis (BVA), dựa hoàn toàn vào các thông tin đã trích xuất ở Bước 1.

### 1. Bảng Biến Đầu Vào (Input Variables)

| Tên biến | Vị trí | Kiểu dữ liệu | Ràng buộc SRS nêu rõ | SRS im lặng / Cần làm rõ | Có thứ tự/số (Áp dụng BVA)? |
| --- | --- | --- | --- | --- | --- |
| `phone` | Body (JSON) | String | Bắt đầu bằng `0`. Độ dài 10–11 chữ số. | Có được chứa khoảng trắng, gạch ngang không? Có cho phép rỗng/null không? | **Có** (BVA áp dụng cho độ dài chuỗi: 9, 10, 11, 12 ký tự). |
| `name` | Body (JSON) | String | Được phép cập nhật. | Min/max length? Ký tự đặc biệt/số? Có cho phép rỗng/null không? | **Có** (BVA áp dụng cho độ dài chuỗi: rỗng, 1 ký tự, max ký tự, max + 1). |
| `shipping_address` | Body (JSON) | String | Được phép cập nhật. | Min/max length? Ký tự đặc biệt? Có cho phép rỗng/null không? | **Có** (BVA áp dụng cho độ dài chuỗi tương tự `name`). |
| `email` | Body (JSON) | String | Không được phép thay đổi qua giao diện. | Nếu cố tình truyền vào API thì báo lỗi hay bỏ qua? | **Không** (Chỉ test hành vi chấp nhận/từ chối). |
| `role` | Body (JSON) | String | Không được phép tự thay đổi từ client/UI. | Nếu cố tình truyền vào API thì báo lỗi hay bỏ qua? | **Không** (Chỉ test hành vi chấp nhận/từ chối). |
| `Authorization` | Header | String (JWT) | Phải là JWT Token hợp lệ. | N/A | **Không** (Chỉ test tính hợp lệ: có/không, đúng/sai, hết hạn). |

---

### 2. Biến Trạng Thái & Điều Kiện Ẩn (State Variables & Hidden Conditions)

Để thực hiện test API cập nhật hồ sơ, hệ thống không chỉ phụ thuộc vào đầu vào mà còn phụ thuộc vào trạng thái hiện tại.

* **Biến trạng thái 1: Tình trạng xác thực (Authentication State)**
* *Mô tả:* Người dùng có token hợp lệ, token hết hạn, token bị sai chữ ký (invalid signature), hoặc không có token.
* *Cách dựng (Setup):* Sử dụng script hoặc API Login để sinh ra JWT Token thực tế. Cố tình sửa 1 ký tự trong token để tạo token lỗi, hoặc dùng token của phiên đăng nhập đã cũ để tạo token hết hạn.


* **Biến trạng thái 2: Dữ liệu hồ sơ hiện tại trong Database (Existing Profile Data)**
* *Mô tả:* Các giá trị `name`, `phone`, `shipping_address`, `email`, `role` của người dùng *trước khi* gọi API cập nhật.
* *Cách dựng (Setup):* Chèn (Insert) sẵn một bản ghi người dùng vào cơ sở dữ liệu (Database) thông qua SQL script hoặc API đăng ký trước mỗi ca kiểm thử, đảm bảo biết chính xác `email` và `role` gốc để đối chiếu sau khi test.


* **Biến trạng thái 3: Quyền sở hữu dữ liệu (Data Ownership - R4)**
* *Mô tả:* API là `/api/users/me`, điều kiện ẩn là hệ thống phải trích xuất đúng ID người dùng từ JWT Token để cập nhật đúng bản ghi đó, không cập nhật nhầm sang user khác.
* *Cách dựng (Setup):* Tạo 2 user khác nhau trong DB (User A và User B). Lấy token của User A để gọi API.



---

### 3. Những Đầu Ra Cần Quan Sát (Observable Outputs)

Để kết luận một Test Case là Pass (Đạt) hay Fail (Không đạt), người kiểm thử cần quan sát các đầu ra sau:

1. **HTTP Status Code:** API trả về mã lỗi gì? (Ví dụ: `200 OK` cho thành công, `400 Bad Request` cho dữ liệu đầu vào sai định dạng, `401 Unauthorized` cho lỗi token).
2. **API Response Body:** Cấu trúc JSON trả về chứa gì? (Thông báo thành công, dữ liệu user sau khi cập nhật, hoặc chi tiết thông báo lỗi cho field nào bị sai).
3. **Trạng thái Cơ sở dữ liệu (Database State Verification):**
* Các trường `name`, `phone`, `shipping_address` có thực sự được lưu mới không?
* **Quan trọng:** Các trường `email` và `role` có bị giữ nguyên giá trị cũ không (đảm bảo R3, R5).


4. **Dữ liệu trả về qua API `GET /api/users/me` (Data Integrity):**
* Gọi API `GET` để lấy lại thông tin vừa cập nhật xem hệ thống trả ra có khớp với những gì đã lưu không.


5. **Dữ liệu hiển thị (UI/Security Verification - R7):**
* Nếu mô phỏng việc hiển thị dữ liệu (chẳng hạn chuỗi chứa script `<script>alert(1)</script>` được gán vào `name`), hệ thống (cụ thể là API response hoặc front-end DOM) có thực hiện escape các ký tự đặc biệt (`<`, `>`, `&`, `"`, `'`) để ngăn chặn XSS hay không.

## Rà soát của tôi (human review)
- Chấp nhận: TODO
- Sửa: TODO (sửa gì, vì sao)
- Loại bỏ: TODO
- AI bỏ sót (ghi tiếp sang `08_ai_gap_analysis.md`): TODO
