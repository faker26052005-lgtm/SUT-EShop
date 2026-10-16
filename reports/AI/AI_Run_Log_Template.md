# Mẫu Ghi Nhận Thí Nghiệm AI Sinh Test

Sao chép file này thành `ai_runs/AI_Run_Log.md` và điền dần trong lúc làm. Điền cả hai điều kiện, rồi làm phần so sánh ở cuối.

## Điều kiện A (Prompt đơn giản)

### A.1. Thông tin lần sinh code

| Mục | Ghi nhận |
|---|---|
| Tên mô hình và phiên bản | |
| Công cụ (Claude, ChatGPT, ...) và loại tài khoản (miễn phí/dùng thử) | |
| Ngày giờ | |
| Chế độ chat (chat mới, ẩn danh/tạm thời, đã tắt bộ nhớ, đã tắt tìm kiếm web) | |
| Cách đưa prompt (dán trực tiếp hay đính kèm tệp) | |
| Số lượt hỏi để có đủ code (kể cả lượt "Tiếp tục") | |
| Số dòng code | |
| Số test sinh ra | |
| Tệp lưu prompt và output | `ai_runs/A_prompt.txt`, `ai_runs/A_output.js` |

### A.2. Sửa tối thiểu giữa lần chạy 1 và lần chạy 2

Chỉ ghi các sửa cơ học (cú pháp, gọi sai `ctx`, thiếu `await`). Không sửa nội dung kiểm tra.

| STT | Dòng/Test | Lỗi | Cách sửa |
|---|---|---|---|
| 1 | | | |

### A.3. Kết quả chạy

| Chỉ số | Lần 1 (nguyên bản) | Lần 2 (chính thức) |
|---|---|---|
| Tổng số test | | |
| Test đạt | | |
| Test đỏ | | |
| Lỗi script của AI (dòng `LỖI SCRIPT CỦA AI`) | | |
| Ảnh chụp Test Results | `ai_runs/A_run1.png` | `ai_runs/A_run2.png` |

### A.4. Phân loại từng test đỏ (lần chạy 2)

Loại: `HT` = lỗi hệ thống thật (ghi mã B), `KY` = test sai kỳ vọng (báo động giả), `SC` = lỗi script của AI.

| Tên test | Thông báo lỗi (rút gọn) | Loại | Mã B nếu là HT |
|---|---|---|---|
| | | | |

### A.5. Test xanh đáng ngờ (khóa chặt hành vi lỗi)

Test đạt nhưng kỳ vọng sai (ví dụ mong đợi 200 khi gửi body rỗng).

| Tên test | Vì sao đáng ngờ |
|---|---|
| | |

### A.6. Chấm điểm 30 mục

`D` = phát hiện (test đúng điều kiện và đỏ vì chính lỗi đó), `L` = có test liên quan nhưng không đỏ, `K` = không có test. Tiêu chí chi tiết ở mục 7.1 của `AI_Experiment_Guide.md`.

| Mã | Lỗi | Điểm | Tên test liên quan |
|---|---|---|---|
| B1 | Login lộ mật khẩu | | |
| B2 | Hồ sơ lộ mật khẩu và reset_token | | |
| B3 | price kiểu chuỗi ở id chẵn | | |
| B4 | Giảm giá phần trăm sai | | |
| B5 | User thường xem được danh sách người dùng | | |
| B6 | Xem đơn không cần token hoặc xem đơn người khác | | |
| B7 | Sản phẩm không tồn tại trả 200 | | |
| B8 | Ghi sản phẩm không cần token | | |
| B9 | Đăng ký trùng email | | |
| B10 | Đăng ký không kiểm tra dữ liệu | | |
| B11 | Tạo sản phẩm, danh mục, mã giảm giá thiếu trường | | |
| B12 | Sửa, xóa tài nguyên không tồn tại báo thành công | | |
| B13 | Checkout không kiểm tra giỏ và tổng tiền | | |
| B14 | Mã giảm giá từ chối đúng mức tối thiểu | | |
| B15 | Tự nâng quyền admin | | |
| B16 | Cập nhật hồ sơ xóa trường không gửi | | |
| B17 | SQL injection ở tìm kiếm | | |
| B18 | Giỏ hàng nhận body rỗng | | |
| B19 | Giỏ hàng tin giá client | | |
| B20 | Giỏ không xóa sau thanh toán | | |
| B21 | Hủy được đơn đang shipping | | |
| B22 | Chuyển canceled sang delivered | | |
| B23 | Qua mặt giới hạn lượt dùng mã bằng cách bỏ user_id | | |
| B24 | API quản trị, danh mục, mã giảm giá không kiểm tra role | | |
| B25 | Thêm cùng sản phẩm tạo dòng mới | | |
| B26 | apply-coupon không cần đăng nhập | | |
| B27 | Khóa tài khoản sai ngưỡng | | |
| B28 | OTP chỉ 4 chữ số | | |
| B29 | Mã giảm giá trùng code trả 500 | | |
| O2 | JWT không có exp | | |

| Tổng kết | Số lượng |
|---|---|
| D (phát hiện) | |
| L (bỏ lọt) | |
| K (không có test) | |


---

## Điều kiện B (Prompt có hướng dẫn)

### B.1. Thông tin lần sinh code

| Mục | Ghi nhận |
|---|---|
| Tên mô hình và phiên bản | |
| Công cụ (Claude, ChatGPT, ...) và loại tài khoản (miễn phí/dùng thử) | |
| Ngày giờ | |
| Chế độ chat (chat mới, ẩn danh/tạm thời, đã tắt bộ nhớ, đã tắt tìm kiếm web) | |
| Cách đưa prompt (dán trực tiếp hay đính kèm tệp) | |
| Số lượt hỏi để có đủ code (kể cả lượt "Tiếp tục") | |
| Số dòng code | |
| Số test sinh ra | |
| Tệp lưu prompt và output | `ai_runs/B_prompt.txt`, `ai_runs/B_output.js` |

### B.2. Sửa tối thiểu giữa lần chạy 1 và lần chạy 2

Chỉ ghi các sửa cơ học (cú pháp, gọi sai `ctx`, thiếu `await`). Không sửa nội dung kiểm tra.

| STT | Dòng/Test | Lỗi | Cách sửa |
|---|---|---|---|
| 1 | | | |

### B.3. Kết quả chạy

| Chỉ số | Lần 1 (nguyên bản) | Lần 2 (chính thức) |
|---|---|---|
| Tổng số test | | |
| Test đạt | | |
| Test đỏ | | |
| Lỗi script của AI (dòng `LỖI SCRIPT CỦA AI`) | | |
| Ảnh chụp Test Results | `ai_runs/B_run1.png` | `ai_runs/B_run2.png` |

### B.4. Phân loại từng test đỏ (lần chạy 2)

Loại: `HT` = lỗi hệ thống thật (ghi mã B), `KY` = test sai kỳ vọng (báo động giả), `SC` = lỗi script của AI.

| Tên test | Thông báo lỗi (rút gọn) | Loại | Mã B nếu là HT |
|---|---|---|---|
| | | | |

### B.5. Test xanh đáng ngờ (khóa chặt hành vi lỗi)

Test đạt nhưng kỳ vọng sai (ví dụ mong đợi 200 khi gửi body rỗng).

| Tên test | Vì sao đáng ngờ |
|---|---|
| | |

### B.6. Chấm điểm 30 mục

`D` = phát hiện (test đúng điều kiện và đỏ vì chính lỗi đó), `L` = có test liên quan nhưng không đỏ, `K` = không có test. Tiêu chí chi tiết ở mục 7.1 của `AI_Experiment_Guide.md`.

| Mã | Lỗi | Điểm | Tên test liên quan |
|---|---|---|---|
| B1 | Login lộ mật khẩu | | |
| B2 | Hồ sơ lộ mật khẩu và reset_token | | |
| B3 | price kiểu chuỗi ở id chẵn | | |
| B4 | Giảm giá phần trăm sai | | |
| B5 | User thường xem được danh sách người dùng | | |
| B6 | Xem đơn không cần token hoặc xem đơn người khác | | |
| B7 | Sản phẩm không tồn tại trả 200 | | |
| B8 | Ghi sản phẩm không cần token | | |
| B9 | Đăng ký trùng email | | |
| B10 | Đăng ký không kiểm tra dữ liệu | | |
| B11 | Tạo sản phẩm, danh mục, mã giảm giá thiếu trường | | |
| B12 | Sửa, xóa tài nguyên không tồn tại báo thành công | | |
| B13 | Checkout không kiểm tra giỏ và tổng tiền | | |
| B14 | Mã giảm giá từ chối đúng mức tối thiểu | | |
| B15 | Tự nâng quyền admin | | |
| B16 | Cập nhật hồ sơ xóa trường không gửi | | |
| B17 | SQL injection ở tìm kiếm | | |
| B18 | Giỏ hàng nhận body rỗng | | |
| B19 | Giỏ hàng tin giá client | | |
| B20 | Giỏ không xóa sau thanh toán | | |
| B21 | Hủy được đơn đang shipping | | |
| B22 | Chuyển canceled sang delivered | | |
| B23 | Qua mặt giới hạn lượt dùng mã bằng cách bỏ user_id | | |
| B24 | API quản trị, danh mục, mã giảm giá không kiểm tra role | | |
| B25 | Thêm cùng sản phẩm tạo dòng mới | | |
| B26 | apply-coupon không cần đăng nhập | | |
| B27 | Khóa tài khoản sai ngưỡng | | |
| B28 | OTP chỉ 4 chữ số | | |
| B29 | Mã giảm giá trùng code trả 500 | | |
| O2 | JWT không có exp | | |

| Tổng kết | Số lượng |
|---|---|
| D (phát hiện) | |
| L (bỏ lọt) | |
| K (không có test) | |


---

## So sánh A và B

| Chỉ số | A | B |
|---|---|---|
| Số test sinh ra | | |
| Số lỗi phát hiện (D) trên 30 mục | | |
| Số lỗi bỏ lọt (L) | | |
| Số lỗi không có test (K) | | |
| Số test đỏ là báo động giả (KY) | | |
| Số lỗi script (SC) | | |
| Số test khóa chặt hành vi lỗi | | |
| Thời gian từ lúc dán prompt đến lúc có kết quả chạy | | |

### Lỗi chỉ B phát hiện (A không)

| Mã | Vì sao B phát hiện được (SRS, dữ liệu mẫu, nhóm ca...) |
|---|---|
| | |

### Lỗi cả hai điều kiện đều bỏ sót

| Mã | Vì sao AI bỏ sót | Ca kiểm thử người cần bổ sung |
|---|---|---|
| | | |

### Ba đến năm ca mà AI không đề xuất (dùng cho Spec-to-Tests Sprint)

1. 
2. 
3. 

### Kết luận (viết sau khi có số liệu)

- 
