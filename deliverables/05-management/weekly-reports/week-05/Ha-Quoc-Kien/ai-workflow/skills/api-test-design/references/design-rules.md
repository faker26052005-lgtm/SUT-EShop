# Quy tắc thiết kế ca test

## Sáu nhóm ca (mỗi ca thuộc một nhóm)

| # | Nhóm | Ví dụ |
|---|---|---|
| 1 | Đường đi đúng | Đăng nhập đúng; áp mã hợp lệ |
| 2 | Giá trị biên | Đúng ngưỡng, ngay dưới, ngay trên; id 0, id ngay sau id cuối |
| 3 | Dữ liệu sai, thiếu, sai kiểu | Email thiếu `@`, body rỗng, số lượng âm |
| 4 | Vi phạm quy tắc nghiệp vụ | Mã hết hạn; hủy đơn đang giao |
| 5 | Phân quyền và bảo mật | Không token; token user gọi chức năng admin; xem đơn của người khác; chuỗi tấn công |
| 6 | Trạng thái và luồng nhiều bước | Khóa tài khoản sau số lần sai; chuyển trạng thái đơn hàng; OTP dùng lại |

## Assertion yếu và mạnh

| Yếu (không chấp nhận) | Mạnh (mong muốn) |
|---|---|
| Chỉ `status 200` | `status` cộng `match` giá trị cụ thể trong phản hồi |
| Ca âm tính chỉ kiểm `status 400` | Kiểm cả mã lẫn nội dung lỗi (`response.error`) |
| Kiểm kiểu của mảng khi gửi chuỗi tấn công | Kiểm mảng **rỗng** hoặc không rò dữ liệu ngoài phạm vi |
| Thử nhiều mã hợp lệ rồi chỉ kiểm tồn tại | Chọn **một** mã đúng theo SRS |
| Ghi dữ liệu rồi không đọc lại | `GET` lại sau khi ghi và so sánh giá trị |

Kỳ vọng số tiền hoặc kết quả tính toán phải **tự tính bằng công thức trong SRS**, không chép từ phản hồi của hệ thống.

## Những chỗ AI hay bỏ sót (hãy chủ động phủ)

| Kiểu lỗi | Cách phủ |
|---|---|
| Phản hồi lộ trường không được có (mật khẩu, mã đặt lại) hoặc sai kiểu dữ liệu | `match response.user.password == '#notpresent'`; kiểm kiểu từng trường |
| Công thức, số tiền, đúng ngưỡng | Tính kỳ vọng bằng công thức; thử đúng ngưỡng, ngay dưới, ngay trên |
| Token và vai trò ở **từng** endpoint ghi | Với mỗi endpoint ghi: không token, token sai vai trò |
| Id không tồn tại, body rỗng, thiếu từng trường | Một ca cho mỗi loại |
| Đọc lại sau khi ghi | `GET` lại và so sánh toàn bộ trạng thái liên quan; thử cập nhật **một phần** trường |
| Chuỗi tấn công mà phản hồi vẫn trông bình thường | Kiểm nội dung phản hồi, không chỉ mã |
| Ma trận chuyển trạng thái | Thử mọi cặp, kể cả từ trạng thái kết thúc |
| Lách luật bằng cách bỏ một trường tùy chọn | Bỏ từng trường tùy chọn và kiểm luật vẫn áp dụng |
| Ngưỡng số lần chính xác (khóa tài khoản) | Kiểm kết quả **từng bước**, không chỉ bước cuối |

## Đặt ID

Hai chữ cái viết tắt nhóm chức năng cộng số thứ tự: `LG01` (đăng nhập), `AC01` (áp mã), `OR01` (đơn hàng)... ID trong matrix và thẻ `@ID` trong feature phải **trùng nhau**.
