# FR-13 - Review và gap analysis của script do AI sinh

Mục đích: ghi lại chỗ AI viết sai hoặc thiếu và chỗ bạn đã sửa. Phần này vào báo cáo chính và là nguyên liệu cho AI Critique (200-300 từ), cũng là nội dung để kể trong video (ít nhất một chỗ sửa).

## A. AI tự phát hiện khi chạy thử với server giả lập (chưa phải SUT thật)

| # | Bản nháp đầu của AI | Vấn đề | Bản sau |
| :-: | :-- | :-- | :-- |
| 1 | Mọi ca so số hiển thị trên dashboard với **giá trị tuyệt đối** (tổng doanh thu tính từ API). | Database đã có đơn cũ nên nếu công thức doanh thu sai, cả các ca "đơn pending không cộng doanh thu" cũng đỏ vì số nền sai, che mất việc quy tắc đó vẫn đúng. | So **chênh lệch** của số hiển thị trước và sau khi tạo đơn (S01-S10). Một ca riêng S13 kiểm tra giá trị tuyệt đối. |
| 2 | Đọc số trên dashboard ngay sau khi mở trang. | Giao diện hiện "0" cho đến khi tải xong danh sách đơn, nên có thể đọc nhầm số 0 (đọc quá sớm). | Helper `waitDashboardLoaded` chờ số đơn khác 0, và `ensureAtLeastOneOrder` đảm bảo DB mới cũng có ít nhất một đơn. |

## B. Sau khi bạn chạy trên SUT thật

Lần chạy đầu trên SUT thật cho kết quả ổn định (11 đạt, 8 đỏ trên cả 3 trình duyệt), và cả 8 test đỏ đều là bug thật của SUT (xem mục D), nên không có chỗ nào phải sửa script vì kết quả sai. Hai điều đáng ghi:

| # | Test | AI sai hoặc thiếu gì | Vì sao AI bỏ sót | Đã sửa thế nào |
| :-: | :-- | :-- | :-- | :-- |
| 1 | Cả bộ | Lần chạy đầu toàn bộ test lỗi `ECONNREFUSED` ở cổng 3000: backend chưa bật. Hạn chế: bộ test không tự kiểm tra SUT đã sẵn sàng, nên lỗi môi trường báo như một lỗi test. | AI không có SUT để thử. | Ghi trong hướng dẫn chạy: bật 3 phần SUT (3000, 5173, 5174) trước khi chạy. Có thể bổ sung bước kiểm tra sức khỏe nếu còn thời gian. |
| 2 | S13 | Giá trị tuyệt đối tăng dần qua các lần chạy vì DB tích lũy đơn (số liệu lớn, ví dụ 2148533648, 12891201888). | Đặc thù của feature (dữ liệu dùng chung). | S13 so với tổng tính từ `GET /api/admin/orders` ngay lúc đó, nên không phụ thuộc số cũ. Các ca khác dùng chênh lệch. |

## C. Test không tự động hóa được / chưa tự động hóa (và lý do)

| Test case HW02 | Lý do |
| :-- | :-- |
| DT-02, DT-04, DT-05 của FR-13 (checkout thiếu hoặc sai kiểu `total_amount`, thiếu `shipping_address`) | Giao diện không cho gửi những body này, chỉ làm được ở tầng API. HW02 đã phủ bằng Postman. |

## D. Bug tìm được

| Bug | Test | Issue GitHub | Ảnh chụp |
| :-- | :-- | :-- | :-- |
| FR13-BUG-01 Doanh thu hiển thị gấp đôi | S01, S06, S07, S08, S09, S13 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/186 | `bugs/screenshots/FR13-BUG-01-*.png` |
| FR13-BUG-02 Đơn đã hủy còn nút "Đánh dấu Đã giao" | S12 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/187 | `bugs/screenshots/FR13-BUG-02-*.png` |
| FR13-BUG-03 Admin web không từ chối token của tài khoản thường | A04 | https://github.com/faker26052005-lgtm/SUT-EShop/issues/188 | `bugs/screenshots/FR13-BUG-03-*.png` |

## E. Rà soát lại code (đọc script và helper sau các lần chạy)

Mục này là phần AI Critique: những chỗ script do AI sinh còn yếu dù test đã chạy ra kết quả đúng. Cột **Loại** ghi nguyên nhân: **P** = chất lượng prompt (prompt không nói rõ môi trường, quy ước hoặc tiêu chí), **M** = hạn chế của model (không chạy được SUT, không biết môi trường, chọn selector dễ viết), **F** = đặc thù của feature/SUT (không có id, `alert()` native, dữ liệu dùng chung). Phân loại là nhận định dựa trên cách script được viết, không trích từ prompt gốc.

Cột **Trạng thái**: **Đã sửa (chưa chạy lại)** = đã sửa trong code, đã qua kiểm tra kiểu (`tsc`) và nạp được toàn bộ 180 test, nhưng chưa chạy với SUT thật; **Chưa sửa** = chỉ ghi nhận; **Cần xác nhận** = phải kiểm tra thủ công trước khi quyết định; **Đã rút lại** = đề xuất ban đầu sai. Mã F1-F5 trỏ tới phần "Chi tiết các chỉnh sửa" trong `REPORT.md`.

| # | Vị trí | Vấn đề | Vì sao AI bỏ sót | Đề xuất / cách sửa | Loại | Trạng thái |
| :-: | :-- | :-- | :-- | :-- | :-: | :-- |
| 1 | `digits()` trong `helpers/admin.ts` | Chuỗi không có chữ số (`NaN`, `-`, rỗng) bị đọc thành **0** vì `Number('')` là 0. Các ca "không đổi" S02-S05, S10 (`revenueDelta: 0`) có thể pass dù ô doanh thu hiển thị hỏng: trước và sau đều đọc ra 0. Chỉ các ca có giá trị lớn hơn 0 (S01, S06-S08, S13) mới bắt được. | `Number('')` trả 0 mà không báo lỗi; AI chỉ nghĩ đến các định dạng số hợp lệ. | Trả về `NaN` khi không có chữ số nào. (Ý định đầu là ném lỗi, nhưng trong `expect.poll` lỗi ném ra sẽ dừng poll ngay thay vì thử lại, nên chọn `NaN`; xem F1.) | M | Đã sửa (chưa chạy lại), F1 |
| 2 | `revenueTile`, `orderCountTile`, `goToTab`, `orderRow` | Selector theo cấu trúc DOM: `xpath=following-sibling::p[1]`, `li` lọc theo text, `tr` có ô `#id`. Đổi bố cục là hỏng; mất thẻ `p` thì đọc nhầm phần tử. | Admin web không có testid, giống FR-04 và FR-08. | Đề nghị thêm `data-testid` cho hai ô số liệu; nếu không thì giữ các giả định cấu trúc ở một chỗ (đã gom trong `admin.ts`). | F | Chưa sửa |
| 3 | `orderRow` (rủi ro) | CSDL tích lũy thêm đơn sau mỗi lần chạy (không dọn). Nếu bảng đơn hàng có phân trang hoặc sắp xếp từ cũ đến mới thì đơn vừa tạo có thể không nằm ở trang đầu và S09-S12 không tìm thấy hàng. Chưa xác nhận SUT có phân trang. | Đặc thù của dữ liệu dùng chung. | Kiểm tra thủ công; nếu có phân trang thì thêm bước tìm đơn (lọc hoặc chuyển trang). | F | Cần xác nhận |
| 4 | `openAdmin` | `waitForResponse(...).catch(() => null)` **nuốt lỗi**: nếu request tải đơn hàng không bao giờ xảy ra, test vẫn chạy tiếp và chỉ thất bại ở bước sau với thông báo khó hiểu. | AI sợ test bị treo nên bắt hết lỗi. | Khi không thấy request, ghi annotation `WARN` vào báo cáo thay vì im lặng. | M | Đã sửa (chưa chạy lại), F5 |
| 5 | `waitDashboardLoaded` | Phân biệt "đã tải xong" bằng heuristic "số đơn khác 0", nên phải có `ensureAtLeastOneOrder`. Dashboard khi chưa có đơn nào (`spec-notes.md` mục 7) không test được. | Giao diện hiện 0 trong lúc tải (mục A-2); AI né tình huống DB rỗng thay vì chờ tín hiệu tải xong. | Chờ response `GET /api/admin/orders` hoàn tất rồi mới đọc, thay vì dựa vào giá trị. | M, F | Chưa sửa |
| 6 | S11, S12 (`getByRole('button')` count 0) | Nhận xét ban đầu: assertion "không có nút nào" rộng, có thể đỏ giả nếu SUT thêm nút không liên quan; đề xuất thu hẹp theo tên các nút chuyển trạng thái (`ACTION_BUTTON`). **Đề xuất này sai và đã rút lại**: bug FR13-BUG-02 chính là nút "Đánh dấu Đã giao", không nằm trong `ACTION_BUTTON`; thu hẹp sẽ làm S12 bỏ sót bug. | Đề xuất ban đầu chưa đối chiếu với bug report; tự phát hiện khi rà lại. | Giữ nguyên assertion đếm mọi nút. Nếu sau này có nút vô hại thì loại trừ đích danh nút đó. | M | Đã rút lại (giữ nguyên code) |
| 7 | `captureDialogs` (admin và web) | Hai helper cùng tên nhưng khác hành vi: admin `dismiss()`, web `accept()`. Với `confirm()` (ví dụ xác nhận hủy đơn) hai hành vi cho kết quả ngược nhau. | Mỗi helper được sinh riêng. | Gộp thành một helper có tham số, hoặc đổi tên (`dismissDialogs` / `acceptDialogs`). | P | Chưa sửa |
| 8 | Edge case thiếu | Chưa có: dashboard khi CSDL rỗng; tự cập nhật khi đơn đổi trạng thái mà không tải lại; nhiều lần đăng nhập sai (khóa 30 giây, FR-02) ở màn hình admin; nhiều tab admin cùng lúc. | Phạm vi theo bảng HW02 và SRS im lặng ở các chỗ này. | Thêm khi SRS làm rõ; ghi rõ trong báo cáo là ngoài phạm vi. | P, F | Chưa sửa |

### Gợi ý cho video

Mục B ở trên ghi "không có chỗ nào phải sửa script", trong khi đề bài cần ít nhất một chỗ sửa để kể. Chỗ dễ kể nhất là **F1** (`digits()` ở mục E-1): ý định đầu là ném lỗi, nhưng đọc mã nguồn `expect.poll` của Playwright 1.65.1 cho thấy lỗi ném trong hàm poll làm poll dừng ngay thay vì thử lại, nên đổi sang `NaN`. Đây là ví dụ rõ về việc AI đề xuất một cách sửa nghe hợp lý nhưng chưa kiểm chứng. Chỉ chuyển trạng thái sang "Đã sửa" sau khi chạy lại cả 3 trình duyệt.
