# Ghi Nhận Điều Kiện C (Prompt Có Nguyên Tắc Có Nguồn, Chia Lượt)

> Điểm D/L/K đã chấm theo mục 7.1 của `AI_Experiment_Guide.md` (D chỉ tính khi test chạm đúng điều kiện ở cột 3 và đỏ vì chính lỗi đó). Các ô đánh dấu **(cần xác nhận)** là thông tin không có trong file đã nộp (ngày giờ, tắt bộ nhớ/tìm kiếm web, thời gian chạy). Độ dài code tổng: 461 dòng (file ghép `C_code_full.js`); cộng riêng ba lượt = 507 dòng do tính cả hàm `aiTests` của C3 và khối chú thích của C4.

## C.1. Thông tin lần sinh code

| Mục | Ghi nhận |
|---|---|
| Tên mô hình và phiên bản | Gemini 3.1 Pro (cùng mô hình với A và B) |
| Loại tài khoản | Trả phí |
| Ngày giờ | **(cần xác nhận)** — các file kết quả được lưu ngày 2026-10-23 |
| Chế độ chat | Tạm thời, môi trường cô lập. Tắt bộ nhớ / tắt tìm kiếm web: **(cần xác nhận)** |
| Tệp prompt | `Prompt_C1_ready.txt` đến `Prompt_C4_ready.txt` (lưu bản đã dán vào `ai_runs/C1_prompt.txt` ...) |

### Từng lượt

| Lượt | Nội dung | Có phải sinh lại hoặc hỏi thêm không | Độ dài câu trả lời | Ghi chú (có bỏ sót, cắt ngang, lệch yêu cầu không) |
|---|---|---|---|---|
| C1 | Kế hoạch: quy tắc (R), bảng test, bảng phủ | Không có dấu hiệu sinh lại (xác nhận lại nếu bạn có bấm Regenerate) | Số test trong kế hoạch: **20** (T01–T18 ở Bước 2, T19 và T20 bổ sung ở Bước 3) | Có 13 quy tắc R01–R13. Bảng phủ nêu thiếu 2 nhóm (categories, admin coupons) và tự bổ sung T19, T20. Câu cuối hỏi lại người dùng "có muốn đi sâu vào code không" (thừa, không ảnh hưởng). Kế hoạch **bỏ qua nhiều endpoint** (xem C.7). Phần bảng phủ OWASP ghi API4 chỉ "một phần" nhưng không có test nào cho API4, API7, API9, API10. |
| C2 | Code phần 1 (xác thực, hồ sơ, sản phẩm, danh mục) | Không | Số dòng: **186**, số test: **11** (T01–T08, T15, T18, T19) | Đủ mọi test của nhóm xác thực, hồ sơ, sản phẩm, danh mục. Tự thêm **T15 (import, thuộc nhóm quản trị)** vào phần 1 nên lệch phân nhóm so với prompt nhưng không mất test. Mỗi test có chú thích "Mục tiêu / Tham chiếu". |
| C3 | Code phần 2 (giỏ hàng, đơn hàng, mã giảm giá, quản trị) | Không | Số dòng: **161**, số test: **9** (T09–T14, T16, T17, T20) | Đủ các test còn lại của kế hoạch. Có viết hàm `aiTests` gọi 2 phần (bị thay ở C4). Có test dùng sản phẩm đầu danh sách, và tự tạo sản phẩm nếu danh sách rỗng. |
| C4 | Tự kiểm tra, viết nốt phần thiếu, hàm tổng | Không | Số dòng: **160** (gồm khối chú thích đối chiếu), số test thiếu tìm được: **9** (T21–T29) | Bước 1: bảng đối chiếu cho thấy cả 20 test của kế hoạch đã có trong code (0 thiếu). Bước 2: liệt kê 9 nhóm endpoint chưa test và 6 nhóm chưa đủ "đường đi đúng + âm tính". Bước 3: viết 9 test mới đều xuất phát từ **mục thiếu trong bảng phủ**, không phải test thiếu của kế hoạch. Bước 2 **không liệt kê riêng** các mã FR/SEC/OWASP chưa phủ như prompt yêu cầu. Bước 4: viết lại hàm `aiTests` đúng. |

Cách ghép code để chạy: dán lần lượt `aiTestsPart1`, `aiTestsPart2` (từ lượt C2, C3), `aiTestsPart3` và hàm `aiTests` **ở lượt C4**. Chỉ giữ một hàm `aiTests`. (Đã đối chiếu: `C_code_full.js` trùng khớp từng dòng với việc ghép ba phần, chỉ khác dòng trống cuối file.)

### Đối chiếu kế hoạch với code (không tính lượt C4)

| Chỉ số | Giá trị |
|---|---|
| Số test trong kế hoạch ở C1 | 20 |
| Số test có trong code sau C2 và C3 | 20 (11 + 9), đủ 100% kế hoạch |
| Số test được bổ sung ở C4 | 9 (T21–T29), toàn bộ là test **mới ngoài kế hoạch**, bổ sung theo bảng phủ |
| Số test trong kế hoạch vẫn chưa có trong code sau C4 | 0 |

## C.2. Sửa tối thiểu giữa lần chạy 1 và lần chạy 2

Không cần sửa. Code ghép chạy được ngay, không có lỗi cú pháp, gọi sai `ctx` hay thiếu `await`; không có test nào báo lỗi script. Vì vậy **chỉ có lần chạy 1 (nguyên bản)**, không có lần 2.

| STT | Dòng hoặc test | Lỗi | Cách sửa |
|---|---|---|---|
| — | — | Không có | Không có |

## C.3. Kết quả chạy

Số liệu tính cả test `00 Môi trường sẵn sàng` của khung chạy (cùng cách tính với A và B: A = 29 test + 1; B = 18 test + 1).

| Chỉ số | Lần 1 (nguyên bản) | Lần 2 (chính thức, nếu có sửa) |
|---|---|---|
| Tổng số test | 30 (29 test của AI + test 00) | Không có |
| Test đạt | 16 (15 test của AI + test 00) | Không có |
| Test đỏ | 14 | Không có |
| Lỗi script của AI | 0 | Không có |
| Ảnh chụp Test Results | `ai_runs/C_run1.png` | `ai_runs/C_run2.png` (không có) |

## C.4. Phân loại từng test đỏ

Loại: `HT` = lỗi hệ thống thật thuộc đáp án (ghi mã B), `HT-mới` = lỗi thật ngoài đáp án (kể cả B30 đến B33 nếu AI tìm ra), `KY` = test sai kỳ vọng (báo động giả), `SC` = lỗi script của AI.

| Tên test | Thông báo lỗi (rút gọn) | Loại | Mã B nếu là HT |
|---|---|---|---|
| T01 Đăng ký hợp lệ và đăng nhập | Không lộ password trong response: expected 'StrongPass123!@#' to be undefined | HT | B1 |
| T02 Đăng ký thất bại do mật khẩu yếu | Mã lỗi do pass yếu: expected 200 to be one of [400, 422] | HT-mới (gần B10: cùng nhóm "đăng ký không kiểm tra dữ liệu" nhưng điều kiện của B10 là body rỗng/thiếu trường; **cần xác nhận**) | — |
| T05 Quên mật khẩu, OTP không dùng lại được | OTP token sinh ra: expected '8180' to have a length at least 6 but got 4 | HT | B28 |
| T06 Cập nhật hồ sơ từ chối Mass Assignment | Role KHÔNG được đổi: expected 'admin' to equal 'user' | HT | B15 |
| T07 BFLA: User thường tạo sản phẩm | Trạng thái cấm truy cập: expected 200 to equal 403 | HT-mới (gần B8: B8 là không token, T07 dùng token user thường; **cần xác nhận**) | — |
| T08 Admin tạo sản phẩm với giá âm | Mã lỗi validation: expected 200 to be one of [400, 422] | HT-mới | B31 |
| T15 Import rollback toàn bộ (Atomic) | Sản phẩm đúng trong batch bị lỗi không được lưu: expected true to equal false | HT-mới | B32 |
| T19 Phân quyền và CRUD Category | User thường bị chặn: expected 200 to equal 403 | HT | B24 |
| T09 Giỏ hàng từ chối số lượng âm | Mã lỗi khi gửi quantity âm: expected 200 to be one of [400, 422] | HT-mới (SRS FR-07: số lượng ≥ 1; gần B18 nhưng B18 là body rỗng) | — |
| T12 BOLA: xem đơn người khác | Bị chặn truy cập chéo: expected 200 to be one of [403, 404] | HT | B6 |
| T13 User hủy đơn đang shipping | Từ chối hủy do sai luật trạng thái: expected 200 to be one of [400, 403] | HT | B21 |
| T17 Admin tự xóa chính mình | Server từ chối yêu cầu: expected 200 to be one of [400, 403] | HT-mới | B33 |
| T20 Admin tạo Coupon giá trị giảm âm | Validation thất bại: expected 200 to be one of [400, 422] | HT-mới | — (lỗi mới) |
| T24 User thường sửa danh mục | expected 200 to equal 403 | HT | B24 |

Tổng: 7 HT (đáp án), 7 HT-mới, 0 KY, 0 SC. Trong 7 HT-mới có 3 lỗi thuộc B31–B33 và 4 lỗi mới hơn (T02, T07, T09, T20). Đã đối chiếu SRS: FR-01 (mật khẩu mạnh), FR-03/SEC-07 (OTP 6 số), FR-07 (số lượng ≥ 1), FR-16 (rollback) khớp kỳ vọng của test, nên không phải báo động giả.

Lưu ý: nhiều test dừng ở assertion đỏ đầu tiên nên các assertion phía sau **chưa được chạy** (T01, T05, T19).

## C.5. Test xanh đáng ngờ (khóa chặt hành vi lỗi hoặc assertion yếu)

| Tên test | Vì sao đáng ngờ |
|---|---|
| T28 Luồng mã giảm giá | **Khóa chặt lỗi B26**: gọi `apply-coupon` không token và kỳ vọng 200 (đáp án đúng là 401). Chỉ dùng coupon `fixed` (không chạm B4), chỉ ghi nhận 1 lần dùng (không chạm B23). |
| T11 Checkout sai total_amount | Nhánh 200 chỉ kiểm có `orderId`, không đọc lại đơn xem tổng tiền; hệ thống tin `total_amount` của client vẫn xanh (che B13). |
| T18 Tìm kiếm SQLi | Dùng đúng payload `' OR 1=1 --` nhưng chỉ kiểm 200 và kiểu mảng, không kiểm "không trả toàn bộ". Kế hoạch ghi "mảng rỗng" nhưng code không kiểm (che B17). |
| T04 Khóa tài khoản | Chỉ kiểm lần thứ 4 bị 403; không kiểm sau 2 lần sai vẫn đăng nhập được nên B27 có thể bị che. |
| T14 Mã không đủ ngưỡng | Dùng 200.000 so với ngưỡng 300.000, không thử đúng ngưỡng (B14). Chấp nhận cả 400/404/422 nên khá rộng. |
| T16 Nhảy trạng thái | Chỉ thử pending → delivered, chưa thử canceled → delivered (B22). |
| T23 Admin CRUD sản phẩm | Chỉ kiểm mã trạng thái, không đọc lại body (kiểu `price`, nội dung sau sửa), không thử id không tồn tại (B3, B7, B12). |
| T25, T26, T29 | Chủ yếu kiểm mã 200 và kiểu dữ liệu, chỉ xét phần tử đầu danh sách; T29 không kiểm `reset_token`. |
| T27 | Gửi giá giỏ 1000 và `total_amount` 1000 cho sản phẩm 30.000.000 nhưng không kiểm giá trong giỏ hay tổng đơn, nên xanh dù hệ thống tin giá client (B19, B13). |

Số test khóa chặt hành vi lỗi rõ ràng: 1 (T28). Số test xanh có assertion quá lỏng làm lỗi bị che: 3 (T11, T18, T04).

## C.6. Chấm điểm 30 mục

`D` = phát hiện (test đúng điều kiện và đỏ vì chính lỗi đó), `L` = có test liên quan nhưng không đỏ, `K` = không có test. Chấm theo cột "Test phải kiểm tra điều gì" ở mục 7.1 của `AI_Experiment_Guide.md`.

| Mã | Lỗi | Điểm | Tên test liên quan |
|---|---|---|---|
| B1 | Login lộ mật khẩu | D | T01 |
| B2 | Hồ sơ lộ mật khẩu và reset_token | K | — (T29 kiểm danh sách admin, khác `/users/me`) |
| B3 | price kiểu chuỗi ở id chẵn | K | — (T10 dùng sản phẩm đầu danh sách, id lẻ) |
| B4 | Giảm giá phần trăm sai | K | — (T28 chỉ dùng coupon `fixed`) |
| B5 | User thường xem được danh sách người dùng | K | — (T29 chỉ dùng token admin) |
| B6 | Xem đơn không cần token hoặc xem đơn người khác | D | T12 (nhánh token người khác) |
| B7 | Sản phẩm không tồn tại trả 200 | K | — |
| B8 | Ghi sản phẩm không cần token | K | — (T07 dùng token user thường, không phải không token) |
| B9 | Đăng ký trùng email | K | — |
| B10 | Đăng ký không kiểm tra dữ liệu | K | — (T02 thử mật khẩu yếu, không thử body rỗng/thiếu trường) |
| B11 | Tạo sản phẩm, danh mục, mã giảm giá thiếu trường | K | — (T08, T20 thử giá trị âm, không thử thiếu trường) |
| B12 | Sửa, xóa tài nguyên không tồn tại báo thành công | K | — |
| B13 | Checkout không kiểm tra giỏ và tổng tiền | L | T11 (assertion yếu), T10 |
| B14 | Mã giảm giá từ chối đúng mức tối thiểu | K | — (T14 dùng 200.000, không phải đúng 300.000) |
| B15 | Tự nâng quyền admin | D | T06 |
| B16 | Cập nhật hồ sơ xóa trường không gửi | K | — (T06 gửi đủ mọi trường) |
| B17 | SQL injection ở tìm kiếm | L | T18 |
| B18 | Giỏ hàng nhận body rỗng | K | — (T09 thử số lượng âm, không thử `{}`) |
| B19 | Giỏ hàng tin giá client | K | — (T27 gửi giá sai nhưng không kiểm giỏ) |
| B20 | Giỏ không xóa sau thanh toán | K | — |
| B21 | Hủy được đơn đang shipping | D | T13 |
| B22 | Chuyển canceled sang delivered | K | — (T16 chỉ thử pending → delivered) |
| B23 | Qua mặt giới hạn lượt dùng mã bằng cách bỏ user_id | K | — |
| B24 | API quản trị, danh mục, mã giảm giá không kiểm tra role | D | T19, T24 (danh mục) |
| B25 | Thêm cùng sản phẩm tạo dòng mới | K | — |
| B26 | apply-coupon không cần đăng nhập | L | T28 (khóa chặt lỗi), T14 |
| B27 | Khóa tài khoản sai ngưỡng | L | T04 |
| B28 | OTP chỉ 4 chữ số | D | T05 |
| B29 | Mã giảm giá trùng code trả 500 | K | — |
| O2 | JWT không có exp | K | — |

Bốn lỗi ngoài 30 mục ban đầu (ghi riêng để không làm lệch so sánh):

| Mã | Lỗi | Điểm | Tên test liên quan |
|---|---|---|---|
| B30 | Hồ sơ không kiểm tra số điện thoại | K | — (T06 chỉ gửi số hợp lệ) |
| B31 | Thêm sản phẩm chấp nhận giá âm | D | T08 |
| B32 | Import không rollback, không kiểm tra giá | D | T15 |
| B33 | Admin xóa được chính tài khoản đang đăng nhập | D | T17 |

| Tổng kết | Số lượng |
|---|---|
| D trên 30 mục | 6 (B1, B6, B15, B21, B24, B28) |
| L trên 30 mục | 4 (B13, B17, B26, B27) |
| K trên 30 mục | 20 |
| D trên bốn lỗi ngoài đáp án | 3 (B31, B32, B33) |

Hai mục chấm sát ranh giới: nếu chấp nhận T02 là B10 và T07 là B8 (cùng gốc lỗi nhưng khác điều kiện ở cột 3) thì D = 8, K = 18. Mình chấm chặt theo cột 3 nên giữ D = 6. Ngoài đáp án, C còn tìm ra hai lỗi mới nữa: mật khẩu yếu vẫn đăng ký được (T02) và user thường ghi được sản phẩm (T07), cùng giỏ hàng nhận số lượng âm (T09) và coupon giá trị giảm âm (T20).

## C.7. So sánh A, B và C

| Chỉ số | A | B | C |
|---|---|---|---|
| Số lượt hỏi | 1 | 2 | 4 |
| Số test sinh ra | 29 | 18 | 29 |
| Kết quả chạy (đạt, đỏ) | 30 đạt, 0 đỏ | 7 đạt, 12 đỏ | 16 đạt, 14 đỏ |
| D trên 30 mục | 0 | 7 | 6 |
| L trên 30 mục | 8 | 5 | 4 |
| K trên 30 mục | 22 | 18 | 20 |
| Lỗi thật ngoài đáp án (B30 đến B33) | 0 | 4 | 3 (B31, B32, B33) |
| Test đỏ là báo động giả (KY) | 0 | 1 | 0 |
| Lỗi script (SC) | 0 | 0 | 0 |
| Test gây hại cho dữ liệu mẫu | | T05, T18 | **T17** (có thể đã xóa tài khoản admin mẫu vì hệ thống trả 200; cần reset DB). Để lại dữ liệu rác không dọn: T07, T08, T15, T19, T20. T24 gọi sửa danh mục bằng tài khoản mẫu `ctx.USER`. **(suy ra từ code và kết quả, cần kiểm tra DB)** |
| Số test trong bảng phủ nhưng không có trong code | không có bảng | 10 (28 so với 18) | 0 (20 trong kế hoạch, đủ 20 trong code; thêm 9 ở C4) |

### Nhận xét

- **Nguyên tắc có tác dụng rõ nhất ở C:** (1) *Chia lượt* giúp code đủ 20/20 test của kế hoạch, không bị cắt (B thiếu 10 test). (2) *Ví dụ mẫu và quy tắc assertion mạnh, tập mã chấp nhận được* giúp 0 báo động giả và 0 lỗi script (B có 1 KY), thông báo đỏ rõ ràng nhờ mô tả trong `pm.expect`. (3) *Lượt tự kiểm tra C4* thêm 9 test (T21–T29), đưa tổng từ 20 lên 29, và là nguồn của T24 (đỏ, B24). Nhưng **không có mã B mới nào được phát hiện nhờ C4**: B24 đã được T19 phát hiện từ trước, còn T21–T23, T25–T29 đều xanh.
- **Chỗ C chưa cải thiện hoặc kém hơn B:** D = 6 so với 7 của B, K = 20 so với 18, B30–B33 phát hiện 3 so với 4. Nguyên nhân thấy được trong kết quả: test của C hay chạm gần nhưng không đúng điều kiện chấm (T02 dùng mật khẩu yếu thay vì body rỗng, T07 dùng token user thay vì không token, T09 dùng số lượng âm thay vì `{}`, T14 dùng 200.000 thay vì đúng 300.000, T16 thử pending → delivered thay vì canceled → delivered). Kế hoạch ở C1 cũng không có test 404 cho id không tồn tại, trùng dữ liệu (email, code coupon), hay đọc lại các trường sau khi ghi. Thêm vào đó có 3 test xanh có assertion lỏng (T11, T18, T04) và 1 test khóa chặt lỗi (T28), nên B13, B17, B26, B27 chỉ được L. Tăng số lượt (4 lượt) và số test (29) chưa chuyển thành thêm lỗi được phát hiện đúng điều kiện.
- **Ba đến năm ca mà AI vẫn không đề xuất (dùng cho Spec-to-Tests Sprint):**
  1. Đăng ký trùng email, đăng ký body rỗng hoặc thiếu trường, tạo sản phẩm/danh mục/coupon với body rỗng (B9, B10, B11).
  2. Id không tồn tại: `GET /products/99999`, `PUT`/`DELETE` id không tồn tại phải trả 404; `GET /products/2` kiểm `price` là số (B3, B7, B12).
  3. Giỏ hàng: thêm cùng sản phẩm hai lần phải thành 1 dòng `quantity = 2`, `POST /cart` với `{}`, gửi giá sai phải giữ giá thật, giỏ rỗng sau checkout (B18, B19, B20, B25).
  4. Mã giảm giá: SAVE10 đơn 1.000.000 phải giảm đúng 100.000, đơn đúng 300.000 phải áp dụng được, mã hết lượt gọi không `user_id` vẫn bị từ chối, tạo mã trùng `code` không được trả 500, `apply-coupon` không token phải trả 401 (B4, B14, B23, B29, B26).
  5. Token user thường gọi `GET /admin/users` phải bị chặn, `GET /users/me` không lộ `password` và `reset_token`, hồ sơ gửi số điện thoại sai, cập nhật chỉ một trường không được xóa trường khác, JWT phải có `exp`, đơn canceled không được chuyển sang delivered (B5, B2, B30, B16, O2, B22).
