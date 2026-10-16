# EShop Project - Báo cáo Phân tích Yêu cầu (Requirement Analysis)

> **Mục đích tài liệu:** Tài liệu này là kết quả của giai đoạn đầu tiên trong Software Testing Life Cycle (STLC) - Requirement Analysis. Tài liệu trình bày quá trình bóc tách tài liệu đặc tả (SRS) của dự án EShop, phân tích tính khả thi, đề xuất hướng kiểm thử và các câu hỏi làm rõ yêu cầu.

---

## 1. Mục tiêu và Yêu cầu của Giai đoạn này

Trong giai đoạn Phân tích Yêu cầu, đội ngũ QA/Tester không viết Test Case ngay lập tức. Thay vào đó, yêu cầu của giai đoạn này là:
1. **Hiểu rõ hệ thống:** Nắm bắt được Business Logic (nghiệp vụ) và luồng xử lý của hệ thống.
2. **Xác định khả năng kiểm thử (Testability):** Đánh giá xem yêu cầu đó có thể test được không, và cần chuẩn bị môi trường/dữ liệu gì.
3. **Lựa chọn kỹ thuật thiết kế Test Case:** Xác định xem với chức năng A thì nên dùng kỹ thuật phân tích giá trị biên, bảng quyết định, hay chuyển đổi trạng thái.
4. **Phát hiện sớm lỗi tài liệu (Static Testing):** Tìm ra các điểm mâu thuẫn, thiếu sót hoặc mập mờ trong tài liệu để BA/Dev làm rõ trước khi code.

## 2. Các hoạt động cần làm đối với dự án EShop

Để hoàn thành giai đoạn này cho EShop, QA cần thực hiện các bước:
- **Đọc tài liệu gốc:** `README.md` (SRS), `api_specification.md` (để test API), `setup_guide.md` (để setup môi trường).
- **Phân nhóm yêu cầu:** Tách biệt Functional (Chức năng), Non-functional (Bảo mật, Giao diện).
- **Xây dựng RTM (Requirement Traceability Matrix):** Tạo bảng theo dõi để đảm bảo không bỏ sót bất kỳ `FR` (Functional Requirement) nào.
- **Tạo danh sách Q&A:** Tổng hợp các câu hỏi để làm rõ với các bên liên quan.

---

## 3. Thực hành Phân tích Yêu cầu Dự án EShop

Dưới đây là phần phân tích chi tiết dựa trên tài liệu Đặc tả Yêu cầu của EShop, đóng vai trò là tiền đề để viết Test Case.

### 3.1. Bóc tách và Nhóm Yêu cầu (Requirement Breakdown)

Hệ thống được chia thành 4 module kiểm thử chính:

| Phân hệ / Module | Mã Yêu Cầu (ID) | Nội dung cần kiểm thử (Test Focus) | Kỹ thuật ưu tiên |
| :--- | :--- | :--- | :--- |
| **1. User & Auth** | FR-01 -> FR-04 | Logic validate mật khẩu mạnh, cơ chế khóa tài khoản khi sai 3 lần (30s), flow OTP, JWT Token. | Phân tích giá trị biên (Boundary Value), Đoán lỗi (Error Guessing) |
| **2. Cửa hàng & Giỏ hàng** | FR-05 -> FR-09 | Validate input số lượng, tính toán tổng tiền, xóa sản phẩm, và đặc biệt là logic **Mã giảm giá (Coupon)** với 5 điều kiện ràng buộc. | Bảng quyết định (Decision Table) |
| **3. Quản lý Đơn hàng** | FR-10, FR-11 | Kiểm tra quyền (User xem đơn mình, Admin xem tất cả), quá trình chuyển đổi trạng thái đơn. | Chuyển đổi trạng thái (State Transition) |
| **4. Web Admin** | FR-12 -> FR-19 | Bảo mật role Admin, quản lý CRUD (Tạo, Đọc, Cập nhật, Xóa) danh mục/sản phẩm. Chú ý tính nguyên tử (Rollback) khi Import CSV. | Phân vùng tương đương, Use Case Testing |

### 3.2. Phân tích Kỹ thuật Thiết kế Test Case (Test Design Analysis)

Dựa trên yêu cầu, QA đề xuất sử dụng các kỹ thuật sau để tối ưu hóa Test Case:

#### A. Phân tích Giá trị biên (Boundary Value Analysis)
Áp dụng cho các trường có giới hạn số lượng, độ dài, thời gian:
- **FR-02 (Khóa tài khoản):** Test các mốc: Nhập sai 2 lần, nhập sai **3 lần** (kỳ vọng khóa), sau 29s, sau **30s** (kỳ vọng mở khóa).
- **FR-06 (Số lượng sản phẩm):** Test nhập: `0` (lỗi), `1` (thành công), `9999` (giới hạn max của hệ thống là bao nhiêu?).
- **FR-15 (Giá sản phẩm):** Test nhập giá `= 0` (kỳ vọng lỗi), giá `= 1` (thành công).

#### B. Bảng Quyết định (Decision Table)
Áp dụng cho **FR-09 (Mã giảm giá)** vì có 5 điều kiện phức tạp. Thay vì viết test case mò, ta lập bảng:

| Điều kiện (Conditions) | Rule 1 (Happy Path) | Rule 2 | Rule 3 |
| :--- | :---: | :---: | :---: |
| C1: Mã tồn tại & Active | True | False | True |
| C2: Còn hạn sử dụng | True | Bỏ qua | False |
| C3: Đủ ngưỡng đơn hàng | True | Bỏ qua | Bỏ qua |
| C4: Đã đăng nhập (JWT) | True | Bỏ qua | Bỏ qua |
| C5: Chưa dùng hết lượt | True | Bỏ qua | Bỏ qua |
| **Kết quả mong đợi (Action)**| **Giảm giá thành công** | **Báo lỗi mã không hợp lệ** | **Báo lỗi mã hết hạn** |

*(Sẽ cần mở rộng bảng này cho đầy đủ các tổ hợp lỗi có thể xảy ra).*

#### C. Chuyển đổi trạng thái (State Transition Testing)
Áp dụng cho **FR-10 (Trạng thái đơn hàng)**.
- **Trạng thái hợp lệ (Valid transitions):** `Pending` -> `Confirmed` -> `Shipping` -> `Delivered`.
- **Trạng thái không hợp lệ (Invalid transitions - Negative test):** Từ `Shipping` nhảy ngược về `Pending`; hoặc từ `Delivered` chuyển thành `Canceled`.
- **Phân quyền thao tác:** Ở state `Shipping`, thử dùng tài khoản User để gọi API Hủy đơn (Kỳ vọng: Lỗi 403 Forbidden).

### 3.3. Đánh giá tĩnh & Các điểm cần làm rõ (Requirement Clarifications / Q&A)

Trong quá trình phân tích, QA đã phát hiện ra các điểm chưa rõ ràng trong tài liệu SRS và cần xác nhận lại với BA/Product Owner:

> [!WARNING]
> **Danh sách Q&A cần BA/Dev làm rõ trước khi bắt đầu viết Test Case chi tiết:**

1. **Về FR-02 (Khóa tài khoản):**
   - Tài khoản bị khóa 30 giây: Sau khi hết 30 giây, bộ đếm số lần sai có được reset về 0 không?
   - "Không để lộ chi tiết nguyên nhân": Cụ thể câu thông báo lỗi nên là gì? (Ví dụ: "Tài khoản hoặc mật khẩu không chính xác. Hoặc tài khoản đang bị khóa").
2. **Về FR-04 (Cập nhật hồ sơ):**
   - Số điện thoại từ 10-11 chữ số, bắt đầu bằng số 0. Vậy có cho phép nhập khoảng trắng hoặc dấu chấm không (VD: `090 123 4567`)? Hệ thống tự làm sạch (sanitize) hay báo lỗi validation?
3. **Về FR-10 (Trạng thái đơn hàng):**
   - Sơ đồ chuyển đổi trạng thái vẽ là `User/Admin hủy` ở trạng thái `Confirmed`. Nhưng ở phần chữ lại ghi "Khi đã ở trạng thái Shipping, User không được tự hủy". Vậy ở `Confirmed` thì User có được hủy không?
4. **Về FR-16 (Import CSV):**
   - Lỗi ở bất kỳ dòng nào sẽ Rollback toàn bộ. Vậy thông báo lỗi trả về cho Admin có chỉ đích danh **dòng số mấy** và **cột nào** bị lỗi để Admin dễ sửa file không? Kích thước file CSV tối đa cho phép là bao nhiêu?

---
*Báo cáo được thực hiện trong giai đoạn đầu của dự án EShop. Các Test Case chi tiết sẽ được viết dựa trên bản phân tích và các câu trả lời Q&A từ phía BA.*
