# FR-15-04 – FR-15 · Bước 4 - Testcase domain testing

| Trường | Giá trị |
| :--- | :--- |
| Công cụ AI | Gemini 3.1 Pro |
| Ngày giờ | 2026-10-20 08:57:41 (UTC+0700) |
| Feature / bước | FR-15 – Bước 4 - Testcase domain testing |
| Chat / phiên | FR15 |
| Commit liên quan |  |

## Prompt (nguyên văn)
BƯỚC 4 – TEST CASE DOMAIN TESTING.
Từ các lớp ở bước 3, sinh test case, mỗi lớp ít nhất một test. Bảng gồm: ID (DT-01, DT-02...), lớp, mô tả, input (body JSON cụ thể), kỳ vọng theo SRS, mã yêu cầu.
Kỳ vọng chỉ nhận một trong ba dạng: "2xx và dữ liệu được lưu đúng", "4xx và dữ liệu không đổi", hoặc "CẦN LÀM RÕ".
Mỗi test chỉ vi phạm một điều kiện; các biến còn lại dùng giá trị hợp lệ chuẩn. Chưa sinh test BVA ở bước này

## Output của AI (nguyên văn, CHƯA chỉnh sửa)
Chào bạn, dưới đây là **BƯỚC 4 – TEST CASE DOMAIN TESTING**.

Để đảm bảo quy tắc "mỗi test chỉ vi phạm một điều kiện", ta quy ước một **Body chuẩn (Valid Base Body)** dùng cho tất cả các test case như sau (áp dụng cho method `POST /api/products` và `PUT /api/products/:id`):
`{"name": "Áo thun", "price": 100000, "category_id": 1, "description": "Mô tả", "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}`

*(Lưu ý: Đối với biến `search` của API GET, vì hệ thống không thực hiện thao tác lưu dữ liệu nên không hoàn toàn khớp với định dạng kỳ vọng "lưu đúng/không đổi". Theo đúng luật bắt buộc của bạn, tôi sẽ gán kết quả là "CẦN LÀM RÕ" cho các test case của API GET).*

### Bảng Test Case Domain Testing

| ID | Lớp (Biến) | Mô tả Test Case | Input (Body JSON cụ thể / URL) | Kỳ vọng | Mã Y/C |
| --- | --- | --- | --- | --- | --- |
| **DT-01** | name (L1) | Tạo SP với tất cả thông tin hợp lệ (Happy case). | `{"name": "Áo thun", "price": 100000, "category_id": 1, "description": "Mô tả", "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}` | 2xx và dữ liệu được lưu đúng | R1, R2 |
| **DT-02** | name (L2) | Tạo SP nhưng không gửi trường `name`. | `{"price": 100000, "category_id": 1, "description": "Mô tả", "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}` | 4xx và dữ liệu không đổi | R2 |
| **DT-03** | name (L3) | Tạo SP với `name` là chuỗi rỗng. | `{"name": "", "price": 100000, "category_id": 1, "description": "Mô tả", "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}` | 4xx và dữ liệu không đổi | R2 |
| **DT-04** | name (L4) | Tạo SP với `name` dài 256 ký tự. | `{"name": "A...A", "price": 100000, "category_id": 1, "description": "Mô tả", "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}` *(name gồm 256 chữ A)* | 4xx và dữ liệu không đổi | R2 |
| **DT-05** | name (L5) | Tạo SP với `name` sai kiểu dữ liệu (số). | `{"name": 12345, "price": 100000, "category_id": 1, "description": "Mô tả", "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}` | 4xx và dữ liệu không đổi | R2 |
| **DT-06** | name (L6) | Tạo SP với `name` chỉ chứa khoảng trắng. | `{"name": "   ", "price": 100000, "category_id": 1, "description": "Mô tả", "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}` | CẦN LÀM RÕ | R2 |
| **DT-07** | name (L7) | Tạo SP với `name` đã tồn tại trong DB. | `{"name": "Áo thun", "price": 100000, "category_id": 1, "description": "Mô tả", "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}` *(Gửi 2 lần)* | CẦN LÀM RÕ | R2 |
| **DT-08** | price (L2) | Tạo SP nhưng không gửi trường `price`. | `{"name": "Áo thun", "category_id": 1, "description": "Mô tả", "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}` | 4xx và dữ liệu không đổi | R3 |
| **DT-09** | price (L3) | Tạo SP với `price` bằng 0. | `{"name": "Áo thun", "price": 0, "category_id": 1, "description": "Mô tả", "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}` | 4xx và dữ liệu không đổi | R3 |
| **DT-10** | price (L4) | Tạo SP với `price` là số âm. | `{"name": "Áo thun", "price": -10000, "category_id": 1, "description": "Mô tả", "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}` | 4xx và dữ liệu không đổi | R3 |
| **DT-11** | price (L5) | Tạo SP với `price` sai kiểu (chuỗi). | `{"name": "Áo thun", "price": "100000", "category_id": 1, "description": "Mô tả", "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}` | 4xx và dữ liệu không đổi | R3 |
| **DT-12** | price (L6) | Tạo SP với `price` là số thập phân. | `{"name": "Áo thun", "price": 10.5, "category_id": 1, "description": "Mô tả", "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}` | CẦN LÀM RÕ | R3 |
| **DT-13** | price (L7) | Tạo SP với `price` vượt quá max int. | `{"name": "Áo thun", "price": 9999999999999999, "category_id": 1, "description": "Mô tả", "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}` | CẦN LÀM RÕ | R3 |
| **DT-14** | category_id (L2) | Tạo SP nhưng không gửi trường `category_id`. | `{"name": "Áo thun", "price": 100000, "description": "Mô tả", "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}` | 4xx và dữ liệu không đổi | R4 |
| **DT-15** | category_id (L3) | Tạo SP với `category_id` không tồn tại. | `{"name": "Áo thun", "price": 100000, "category_id": 9999, "description": "Mô tả", "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}` | 4xx và dữ liệu không đổi | R4 |
| **DT-16** | category_id (L4) | Tạo SP với `category_id` sai kiểu dữ liệu. | `{"name": "Áo thun", "price": 100000, "category_id": "abc", "description": "Mô tả", "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}` | 4xx và dữ liệu không đổi | R4 |
| **DT-17** | category_id (L5) | Tạo SP với `category_id` đã bị xóa. | `{"name": "Áo thun", "price": 100000, "category_id": 2, "description": "Mô tả", "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}` *(id 2 đã xóa)* | CẦN LÀM RÕ | R4 |
| **DT-18** | description (L2) | Tạo SP nhưng không gửi trường `description`. | `{"name": "Áo thun", "price": 100000, "category_id": 1, "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}` | CẦN LÀM RÕ | R1 |
| **DT-19** | description (L3) | Tạo SP với `description` quá dài (10,000 ký tự). | `{"name": "Áo thun", "price": 100000, "category_id": 1, "description": "A...A", "imageUrl": "[http://img.com/1.jpg](http://img.com/1.jpg)"}` | CẦN LÀM RÕ | R1 |
| **DT-20** | imageUrl (L2) | Tạo SP nhưng không gửi trường `imageUrl`. | `{"name": "Áo thun", "price": 100000, "category_id": 1, "description": "Mô tả"}` | CẦN LÀM RÕ | R1 |
| **DT-21** | imageUrl (L3) | Tạo SP với `imageUrl` không phải định dạng URL. | `{"name": "Áo thun", "price": 100000, "category_id": 1, "description": "Mô tả", "imageUrl": "not_a_url"}` | CẦN LÀM RÕ | R1 |
| **DT-22** | id (L1) | Sửa SP với `id` hợp lệ. | `PUT /api/products/1` với Body chuẩn | 2xx và dữ liệu được lưu đúng | R1, R5 |
| **DT-23** | id (L2) | Sửa SP với `id` không tồn tại. | `PUT /api/products/9999` với Body chuẩn | 4xx và dữ liệu không đổi | R1, R5 |
| **DT-24** | id (L3) | Sửa SP với `id` sai kiểu (chuỗi). | `PUT /api/products/abc` với Body chuẩn | 4xx và dữ liệu không đổi | R1, R5 |
| **DT-25** | id (L4) | Sửa SP với `id` đã bị xóa. | `PUT /api/products/2` với Body chuẩn *(id 2 đã xóa)* | CẦN LÀM RÕ | R1, R5 |
| **DT-26** | search (L1) | Tìm SP theo `search` hợp lệ có tồn tại. | `GET /api/products?search=Áo` | CẦN LÀM RÕ | R1 |
| **DT-27** | search (L2) | Tìm SP theo `search` không tồn tại. | `GET /api/products?search=Sản_phẩm_ảo` | CẦN LÀM RÕ | R1 |
| **DT-28** | search (L4) | Tìm SP với `search` chứa script XSS. | `GET /api/products?search=<script>alert(1)</script>` | CẦN LÀM RÕ | R8 |

## Rà soát của tôi (human review)
- Chấp nhận: Có
- Các chỉnh sửa trong AI_gap_analysis
