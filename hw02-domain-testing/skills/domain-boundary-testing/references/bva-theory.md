# Boundary Value Analysis (BVA) — Lý thuyết tham khảo

## 1. Định nghĩa

**Boundary Value Analysis** (Phân tích giá trị biên) là kỹ thuật kiểm thử hộp
đen bổ trợ cho Equivalence Partitioning. Kỹ thuật này tập trung vào việc test
tại **các điểm biên** (boundary) giữa các lớp tương đương, vì kinh nghiệm cho
thấy phần lớn lỗi phần mềm xuất hiện tại hoặc gần các điểm biên.

## 2. Các kỹ thuật BVA

### 2.1. BVA 2-value (Normal BVA — theo ISTQB)

Mỗi biên chỉ cần **2 giá trị test**: giá trị tại biên và giá trị ngay bên kia
biên.

```text
  Invalid ← | → Valid
         min-1  min
                         max  max+1
               Valid ← | → Invalid
```

| Điểm | Giá trị | Kỳ vọng |
|---|---|---|
| Ngay dưới biên dưới | `min - 1` | Invalid |
| Biên dưới | `min` | Valid |
| Biên trên | `max` | Valid |
| Ngay trên biên trên | `max + 1` | Invalid |

**Tổng: 4 test case cho mỗi biến có cả biên trên và biên dưới.**

### 2.2. BVA 3-value (Robust BVA)

Mỗi biên cần **3 giá trị test**: giá trị ngay ngoài biên, tại biên, và ngay
trong biên.

```text
  Invalid ← | → Valid
       min-1  min  min+1
                       max-1  max  max+1
                     Valid ← | → Invalid
```

| Điểm | Giá trị | Kỳ vọng |
|---|---|---|
| Ngay dưới biên dưới | `min - 1` | Invalid |
| Biên dưới | `min` | Valid |
| Ngay trên biên dưới | `min + 1` | Valid |
| Giá trị danh nghĩa | `nominal` (giá trị giữa) | Valid |
| Ngay dưới biên trên | `max - 1` | Valid |
| Biên trên | `max` | Valid |
| Ngay trên biên trên | `max + 1` | Invalid |

**Tổng: 7 test case cho mỗi biến có cả biên trên và biên dưới.**

## 3. Cách xác định biên cho từng kiểu dữ liệu

### 3.1. Biên số nguyên (Integer)

Ví dụ: Số lượng sản phẩm phải từ 1 đến 99.

| Điểm biên | Giá trị | Kỳ vọng |
|---|---|---|
| Min - 1 | `0` | Invalid |
| Min | `1` | Valid |
| Min + 1 | `2` | Valid |
| Nominal | `50` | Valid |
| Max - 1 | `98` | Valid |
| Max | `99` | Valid |
| Max + 1 | `100` | Invalid |

### 3.2. Biên số thực (Float/Decimal)

Ví dụ: Giá sản phẩm phải > 0.

- Với ràng buộc "lớn hơn" (strictly greater): `0` là Invalid, giá trị dương
  nhỏ nhất có thể (`0.01` hoặc `1` tùy hệ thống) là Valid.
- Chú ý: "≥ 0" khác với "> 0". Đọc kỹ đặc tả để phân biệt.

### 3.3. Biên độ dài chuỗi (String Length)

Ví dụ: Tên sản phẩm tối đa 255 ký tự, bắt buộc nhập.

| Điểm biên | Giá trị | Kỳ vọng |
|---|---|---|
| Rỗng | `""` (0 ký tự) | Invalid (bắt buộc nhập) |
| Min Valid | 1 ký tự | Valid |
| Nominal | 50 ký tự | Valid |
| Max Valid | 255 ký tự | Valid |
| Max + 1 | 256 ký tự | Invalid |

### 3.4. Biên ngày tháng (Date/Time)

Ví dụ: Mã giảm giá có hạn sử dụng `expired_at = 2099-12-31`.

| Điểm biên | Giá trị | Kỳ vọng |
|---|---|---|
| Trước hạn 1 ngày | `2099-12-30` | Valid (còn hạn) |
| Đúng ngày hết hạn | `2099-12-31` | Phụ thuộc đặc tả (trước `expired_at` hay `<=`?) |
| Sau hạn 1 ngày | `2100-01-01` | Invalid (hết hạn) |

### 3.5. Biên đếm (Counter)

Ví dụ: Mã giảm giá cho phép dùng tối đa `max_uses_per_user = 2` lần.

| Điểm biên | Giá trị | Kỳ vọng |
|---|---|---|
| Chưa dùng lần nào | `used = 0` | Valid (cho phép dùng) |
| Dùng max - 1 lần | `used = 1` | Valid (còn 1 lượt) |
| Dùng đúng max lần | `used = 2` | Invalid (hết lượt, `used < max` không thỏa) |

### 3.6. Biên tập hợp (Collection)

Ví dụ: Giỏ hàng phải có ít nhất 1 sản phẩm để thanh toán.

| Điểm biên | Giá trị | Kỳ vọng |
|---|---|---|
| Giỏ rỗng | 0 item | Invalid (không checkout được) |
| 1 item | 1 sản phẩm | Valid |
| Nhiều item | 5 sản phẩm | Valid |

## 4. Khi nào KHÔNG áp dụng BVA

- **Biến Boolean** (true/false): Chỉ có 2 giá trị, không có biên. Dùng
  Equivalence Partitioning là đủ.
- **Biến Enum** với ít giá trị: Ví dụ `type` chỉ có `"percent"` hoặc
  `"fixed"`. Test hết tất cả giá trị thay vì tìm biên.
- **Biến không có ràng buộc rõ ràng về min/max:** Nếu đặc tả không quy định
  giới hạn, hãy test các giá trị đặc biệt: rỗng, cực dài, ký tự đặc biệt.

## 5. Kết hợp Domain Testing + BVA

Trong thực tế, hai kỹ thuật này luôn được dùng **bổ trợ cho nhau**:

1. **Domain Testing (EP):** Đảm bảo mỗi lớp tương đương có ít nhất 1 test
   case → bao phủ RỘNG.
2. **BVA:** Tập trung test tại các điểm biên giữa các lớp → bao phủ SÂU tại
   nơi hay có lỗi nhất.

```text
       IEC         VEC         IEC
  ◄────────────|────────────|────────────►
           min-1 min    max max+1
                 ↑           ↑
              BVA test     BVA test
        ↑         ↑              ↑
    EP test    EP test        EP test
```

## 6. Tham chiếu

- ISTQB Foundation Level Syllabus v4.0, Section 4.2.1 & 4.2.2
- Jorgensen, P. C. "Software Testing: A Craftsman's Approach", Chapter 5
