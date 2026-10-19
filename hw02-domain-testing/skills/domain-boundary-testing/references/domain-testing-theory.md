# Domain Testing — Lý thuyết tham khảo

## 1. Định nghĩa

**Domain Testing** (Kiểm thử miền) là kỹ thuật kiểm thử hộp đen (black-box)
tập trung vào việc phân chia miền giá trị đầu vào thành các lớp tương đương
(Equivalence Classes) và chọn các giá trị đại diện từ mỗi lớp để thiết kế test
case.

**Cơ sở lý thuyết:** Nếu một giá trị trong một lớp tương đương phát hiện được
lỗi, thì tất cả các giá trị khác trong cùng lớp đó cũng sẽ phát hiện được lỗi
tương tự. Do đó, chỉ cần chọn 1 giá trị đại diện cho mỗi lớp là đủ.

## 2. Quy trình áp dụng

### Bước 1: Xác định biến đầu vào

- Đọc đặc tả yêu cầu (SRS/User Story/Functional Requirement).
- Liệt kê tất cả các biến mà người dùng có thể nhập hoặc hệ thống cần xử lý.
- Ghi nhận kiểu dữ liệu và ràng buộc (constraints) cho mỗi biến.

### Bước 2: Phân chia lớp tương đương (Equivalence Partitioning)

Với mỗi biến đầu vào, chia thành:

**Lớp hợp lệ (Valid Equivalence Class — VEC):**

- Các giá trị hệ thống phải chấp nhận theo đặc tả.
- Ví dụ: Password có đủ 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt.

**Lớp không hợp lệ (Invalid Equivalence Class — IEC):**

- Các giá trị hệ thống phải từ chối theo đặc tả.
- Ví dụ: Password dưới 8 ký tự, hoặc thiếu chữ hoa, hoặc thiếu số.

**Quy tắc phân chia:**

| Kiểu ràng buộc | Cách phân chia |
|---|---|
| Khoảng giá trị `[a, b]` | 1 VEC: `a ≤ x ≤ b`. 2 IEC: `x < a` và `x > b` |
| Tập giá trị `{v1, v2, v3}` | Mỗi `vi` là 1 VEC. 1 IEC: giá trị ngoài tập |
| Điều kiện Boolean | 1 VEC: True. 1 IEC: False |
| Chuỗi có ràng buộc format | 1 VEC: chuỗi đúng format. Mỗi cách vi phạm format là 1 IEC |
| Bắt buộc nhập | 1 VEC: có giá trị. 1 IEC: rỗng / null |

### Bước 3: Thiết kế test case

**Nguyên tắc tối thiểu:**

1. **Positive test:** Kết hợp tất cả các biến ở lớp Valid trong 1 test case.
   Có thể tạo nhiều test case nếu có nhiều lớp Valid cần bao phủ.
2. **Negative test:** Mỗi test case chỉ có **đúng 1 biến** ở lớp Invalid, các
   biến còn lại đều ở lớp Valid. Mục đích: cô lập nguyên nhân lỗi.

**Ví dụ:** Nếu có 3 biến (A, B, C) và mỗi biến có 1 VEC và 2 IEC:

- Test case Positive: A=Valid, B=Valid, C=Valid → Expected: thành công
- Test case Negative 1: A=Invalid1, B=Valid, C=Valid → Expected: lỗi do A
- Test case Negative 2: A=Invalid2, B=Valid, C=Valid → Expected: lỗi do A
- Test case Negative 3: A=Valid, B=Invalid1, C=Valid → Expected: lỗi do B
- ... (tương tự cho các IEC còn lại)

## 3. Lưu ý quan trọng

- **Không quên các ràng buộc liên biến (inter-variable constraints):** Ví dụ
  Password phải khớp với Confirm Password. Đây là một lớp tương đương riêng
  dựa trên mối quan hệ giữa 2 biến.
- **Không quên ràng buộc trạng thái hệ thống:** Ví dụ email đã tồn tại trong
  CSDL. Đây là ràng buộc không nằm ở biến đầu vào mà ở trạng thái hệ thống.
- **Không quên kiểm thử bảo mật cơ bản:** XSS (`<script>alert(1)</script>`),
  SQL Injection (`' OR 1=1 --`). Tuy đây không phải Domain Testing thuần túy,
  nhưng đề bài khuyến khích bổ sung để tăng độ bao phủ.

## 4. Tham chiếu

- ISTQB Foundation Level Syllabus v4.0, Chapter 4.2: Black-Box Test Techniques
- Cem Kaner, "Domain Testing: A Systematic Approach"
