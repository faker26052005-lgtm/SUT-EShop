# FR-15-07 – FR-15 · Bước 7 - Kiểm tra lại

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 09:05:01 (UTC+0700) |
| Feature / bước | FR-15 – Bước 7 - Kiểm tra lại |
| Chat / phiên | FR15 |
| Commit liên quan |  |

## Prompt (nguyên văn)
Hãy rà soát lại toàn bộ test case bạn đã sinh ở các bước 4, 5 và 6. Sau một thao tác ghi (tạo, sửa, xóa hoặc áp dụng), ngoài dữ liệu được gửi lên thì còn những trạng thái nào khác có thể bị thay đổi (các trường không gửi, bản ghi khác, dữ liệu liên quan)? Đã có test nào kiểm tra điều đó chưa? Nếu chưa, hãy bổ sung test case

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Chào bạn, đây là một câu hỏi rà soát rất hay và đúng chuẩn tư duy của một kỹ sư kiểm thử (Tester/QA).

Khi rà soát lại các bước 4, 5 và 6, ta thấy các test case hiện tại mới chỉ tập trung vào:

1. **Kiểm tra input hợp lệ / không hợp lệ** (Domain & BVA).
2. **Kiểm soát truy cập và bảo mật** (Token, Role, XSS, SQLi).
3. **Tính độc lập của bản ghi bị thay đổi** (BL-01: sửa SP này không ảnh hưởng SP khác).
4. **Kiểm tra CRUD cơ bản trên chính bản ghi đó** (BL-02: POST xong GET ra đúng).

**NHỮNG TRẠNG THÁI / SIDE EFFECTS CÒN THIẾU (Chưa được test):**
Dựa vào đặc tả API, một thao tác GHI (POST/PUT/DELETE) không chỉ ảnh hưởng đến chi tiết của bản ghi đó (`GET /api/products/:id`) mà còn làm thay đổi các trạng thái liên đới sau:

1. **Trạng thái của Danh sách tổng (List State):** Khi Thêm/Xóa, API `GET /api/products` có cập nhật ngay lập tức không?
2. **Trạng thái của Bộ máy Tìm kiếm (Search Index State):** Khi Sửa tên (PUT) hoặc Xóa (DELETE), kết quả của `GET /api/products?search=...` có được cập nhật đồng bộ không?
3. **Tính bất biến của ID (ID Immutability):** API là `PUT /api/products/:id`, nhưng nếu attacker cố tình gửi thêm trường `"id": 999` vào trong Body thì ID thật trong DB có bị ghi đè không?
4. **Hành vi ghi đè của PUT với các trường tùy chọn:** Vì tài liệu ghi "Body khi Thêm/Sửa (JSON)" dùng chung 1 format, nếu khi Sửa ta không truyền các trường tùy chọn (`description`, `imageUrl`), hệ thống sẽ giữ nguyên giá trị cũ hay gán chúng thành `null`?

Dưới đây là các Test Case (Side Effects - SE) bổ sung để bao phủ các lỗ hổng này:

### Bảng Test Case: Kiểm tra Trạng thái Liên đới (Side Effects & State Mutation)

| ID | Mô tả Test Case | Cách dựng và Input | Kỳ vọng theo SRS / API | Mã Y/C |
| --- | --- | --- | --- | --- |
| **SE-01** | Đồng bộ Danh sách sau khi Thêm mới (POST). | **Dựng:** Gọi `GET /api/products` đếm số lượng SP hiện có là `N`.<br>**Input:** Dùng token Admin, gọi `POST /api/products` để tạo SP mới. Sau đó gọi lại `GET /api/products`. | 2xx. Danh sách phải trả về `N + 1` sản phẩm, và sản phẩm mới phải xuất hiện trong list. | R1 |
| **SE-02** | Đồng bộ Tìm kiếm sau khi Sửa tên (PUT). | **Dựng:** Dùng token Admin tạo SP có `name` = "Áo Thun A".<br>**Input:** Gọi `PUT /api/products/:id` đổi `name` thành "Quần Jean B". Sau đó gọi `GET /api/products?search=Áo Thun` và `GET /api/products?search=Quần Jean`. | 2xx. Tìm "Áo Thun" không ra SP này nữa. Tìm "Quần Jean" phải trả về đúng SP vừa sửa. | R1 |
| **SE-03** | Đồng bộ Danh sách & Tìm kiếm sau khi Xóa (DELETE). | **Dựng:** Dùng token Admin tạo SP "Giày thể thao" (`id=1`).<br>**Input:** Gọi `DELETE /api/products/1`. Sau đó gọi `GET /api/products` và `GET /api/products?search=Giày thể thao`. | 2xx. SP `id=1` không còn xuất hiện trong mảng dữ liệu của danh sách tổng cũng như kết quả tìm kiếm. | R1 |
| **SE-04** | Tính bất biến của định danh (`id`) khi Sửa. | **Dựng:** Dùng token Admin tạo SP (`id=10`).<br>**Input:** Gọi `PUT /api/products/10` với Body chuẩn nhưng cố tình nhét thêm `"id": 9999` vào JSON. Sau đó gọi `GET /api/products/10` và `GET /api/products/9999`. | 2xx và dữ liệu được lưu đúng. NHƯNG `id` vẫn phải là `10`. Gọi `GET 9999` phải ra 404 (Không cho phép can thiệp ghi đè ID). | R1, R5 |
| **SE-05** | Trạng thái các trường tùy chọn khi Sửa (PUT Replace vs Patch). | **Dựng:** Dùng token Admin tạo SP đầy đủ `name`, `price`, `category_id`, `description`, `imageUrl`.<br>**Input:** Gọi `PUT /api/products/:id` nhưng Body **lược bỏ** 2 key `description` và `imageUrl`. Sau đó gọi `GET /api/products/:id`. | CẦN LÀM RÕ. (Bản chất HTTP PUT là thay thế toàn bộ. Nếu lược bỏ, DB có bị update thành `null`/chuỗi rỗng không, hay hệ thống thông minh tự giữ lại dữ liệu cũ?). | R1 |

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
