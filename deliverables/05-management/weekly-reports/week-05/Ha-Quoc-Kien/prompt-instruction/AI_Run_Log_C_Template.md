# Mẫu Ghi Nhận Điều Kiện C (Prompt Có Nguyên Tắc Có Nguồn, Chia Lượt)

Sao chép file này thành `ai_runs/AI_Run_Log_C.md` và điền dần. Quy trình chạy giống điều kiện A và B (xem `AI_Experiment_Guide.md`), khác ở chỗ điều kiện C gồm **bốn lượt trong cùng một cuộc trò chuyện tạm thời** (C1 đến C4).

## C.1. Thông tin lần sinh code

| Mục | Ghi nhận |
|---|---|
| Tên mô hình và phiên bản | Gemini 3.1 Pro (cùng mô hình với A và B) |
| Loại tài khoản | Trả phí (ghi rõ để người đọc biết điều kiện; xem lưu ý trong hướng dẫn) |
| Ngày giờ | |
| Chế độ chat | Tạm thời, môi trường cô lập. Ghi: đã tắt bộ nhớ, tắt tìm kiếm web chưa |
| Tệp prompt | `Prompt_C1_ready.txt` đến `Prompt_C4_ready.txt` (lưu bản đã dán vào `ai_runs/C1_prompt.txt` ...) |

### Từng lượt

| Lượt | Nội dung | Có phải sinh lại hoặc hỏi thêm không | Độ dài câu trả lời | Ghi chú (có bỏ sót, cắt ngang, lệch yêu cầu không) |
|---|---|---|---|---|
| C1 | Kế hoạch: quy tắc (R), bảng test, bảng phủ | | Số test trong kế hoạch: | |
| C2 | Code phần 1 (xác thực, hồ sơ, sản phẩm, danh mục) | | Số dòng, số test: | |
| C3 | Code phần 2 (giỏ hàng, đơn hàng, mã giảm giá, quản trị) | | Số dòng, số test: | |
| C4 | Tự kiểm tra, viết nốt phần thiếu, hàm tổng | | Số test thiếu tìm được: | |

Cách ghép code để chạy: dán lần lượt `aiTestsPart1`, `aiTestsPart2` (từ lượt C2, C3), `aiTestsPart3` và hàm `aiTests` **ở lượt C4** (hàm `aiTests` của lượt C3 bị thay bằng hàm của C4 vì C4 gọi cả ba phần). Chỉ giữ một hàm `aiTests`.

### Đối chiếu kế hoạch với code (không tính lượt C4)

| Chỉ số | Giá trị |
|---|---|
| Số test trong kế hoạch ở C1 | |
| Số test có trong code sau C2 và C3 | |
| Số test được bổ sung ở C4 | |
| Số test trong kế hoạch vẫn chưa có trong code sau C4 | |

## C.2. Sửa tối thiểu giữa lần chạy 1 và lần chạy 2

Chỉ ghi các sửa cơ học (cú pháp, gọi sai `ctx`, thiếu `await`). Không sửa nội dung kiểm tra.

| STT | Dòng hoặc test | Lỗi | Cách sửa |
|---|---|---|---|
| 1 | | | |

## C.3. Kết quả chạy

| Chỉ số | Lần 1 (nguyên bản) | Lần 2 (chính thức, nếu có sửa) |
|---|---|---|
| Tổng số test | | |
| Test đạt | | |
| Test đỏ | | |
| Lỗi script của AI | | |
| Ảnh chụp Test Results | `ai_runs/C_run1.png` | `ai_runs/C_run2.png` |

## C.4. Phân loại từng test đỏ

Loại: `HT` = lỗi hệ thống thật thuộc đáp án (ghi mã B), `HT-mới` = lỗi thật ngoài đáp án (kể cả B30 đến B33 nếu AI tìm ra), `KY` = test sai kỳ vọng (báo động giả), `SC` = lỗi script của AI.

| Tên test | Thông báo lỗi (rút gọn) | Loại | Mã B nếu là HT |
|---|---|---|---|
| | | | |

## C.5. Test xanh đáng ngờ (khóa chặt hành vi lỗi hoặc assertion yếu)

| Tên test | Vì sao đáng ngờ |
|---|---|
| | |

## C.6. Chấm điểm 30 mục

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

Bốn lỗi ngoài 30 mục ban đầu (đã biết sau thí nghiệm A và B, ghi riêng để không làm lệch so sánh):

| Mã | Lỗi | Điểm | Tên test liên quan |
|---|---|---|---|
| B30 | Hồ sơ không kiểm tra số điện thoại | | |
| B31 | Thêm sản phẩm chấp nhận giá âm | | |
| B32 | Import không rollback, không kiểm tra giá | | |
| B33 | Admin xóa được chính tài khoản đang đăng nhập | | |

| Tổng kết | Số lượng |
|---|---|
| D trên 30 mục | |
| L trên 30 mục | |
| K trên 30 mục | |
| D trên bốn lỗi ngoài đáp án | |

## C.7. So sánh A, B và C

| Chỉ số | A | B | C |
|---|---|---|---|
| Số lượt hỏi | 1 | 2 | |
| Số test sinh ra | 29 | 18 | |
| Kết quả chạy (đạt, đỏ) | 30 đạt, 0 đỏ | 7 đạt, 12 đỏ | |
| D trên 30 mục | 0 | 7 | |
| L trên 30 mục | 8 | 5 | |
| K trên 30 mục | 22 | 18 | |
| Lỗi thật ngoài đáp án (B30 đến B33) | 0 | 4 | |
| Test đỏ là báo động giả (KY) | 0 | 1 | |
| Lỗi script (SC) | 0 | 0 | |
| Test gây hại cho dữ liệu mẫu | | T05, T18 | |
| Số test trong bảng phủ nhưng không có trong code | không có bảng | 10 (28 so với 18) | |

### Nhận xét

- Nguyên tắc nào thêm ở C có tác dụng rõ nhất (ví dụ mẫu, thẻ, chia lượt, danh mục OWASP, lượt tự kiểm tra)? Chỉ kết luận khi có bằng chứng trong kết quả (ví dụ lỗi nào được tìm thêm, test nào xuất hiện nhờ lượt C4).
- Chỗ nào C chưa cải thiện hoặc kém hơn B, và vì sao?
- Ba đến năm ca mà AI vẫn không đề xuất (dùng cho Spec-to-Tests Sprint):
  1.
  2.
  3.
