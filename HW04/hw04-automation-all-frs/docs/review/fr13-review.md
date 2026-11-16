# FR-13 - Review và gap analysis của script

## A. AI tự phát hiện khi chạy thử với server giả lập 

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


## E. Rà soát lại code (đọc script và helper, bổ sung sau các lần chạy)

Mục này là phần AI Critique: những chỗ script do AI sinh còn yếu dù test đã chạy ra kết quả đúng. Cột **Loại** ghi nguyên nhân: **P** = chất lượng prompt (prompt không nói rõ môi trường, quy ước hoặc tiêu chí), **M** = hạn chế của model (không chạy được SUT, không biết locale, thiên về chọn selector dễ viết), **F** = đặc thù của feature/SUT (không có id, alert() native, dữ liệu dùng chung). Phân loại là nhận định dựa trên cách script được viết, không phải trích từ prompt gốc; hãy chỉnh lại cho khớp prompt bạn thực sự đã dùng.
Cột **Trạng thái**: "Đề xuất" nghĩa là phát hiện khi đọc code, chưa sửa và chưa chạy lại trên SUT thật; chỉ chuyển thành "Đã sửa" sau khi chạy lại cả 3 trình duyệt.

| # | Vị trí | Vấn đề (loại) | Vì sao AI bỏ sót | Đề xuất sửa | Loại | Trạng thái |
| :-: | :-- | :-- | :-- | :-- | :-: | :-- |
| 1 | `digits()` trong `helpers/admin.ts` | Chuỗi không có chữ số (`NaN`, `—`, rỗng) bị đọc thành **0**. Các ca "không đổi" S02-S05, S10 (`revenueDelta: 0`) có thể pass dù ô doanh thu hiển thị hỏng, vì cả trước lẫn sau đều đọc ra 0. Chỉ S01 và S13 (giá trị lớn hơn 0) mới bắt được. | `Number('')` trả 0 và không báo lỗi; AI chỉ nghĩ đến các định dạng số hợp lệ. | Ném lỗi khi không tìm thấy chữ số nào: `if (!/\d/.test(text)) throw new Error(...)`. | M | Đề xuất |
| 2 | `revenueTile`, `orderCountTile`, `goToTab`, `orderRow` | Selector theo cấu trúc DOM: `xpath=following-sibling::p[1]`, `li` lọc theo text, `tr` có ô `#id`. Đổi bố cục là hỏng; mất thẻ `p` thì đọc nhầm phần tử. | Admin web không có testid, giống FR-04/FR-08. | Đề nghị thêm `data-testid` cho hai ô số liệu; nếu không thì ghi giả định cấu trúc ở một chỗ (đã gom trong `admin.ts`, tốt). | F | Đề xuất |
| 3 | `orderRow` (rủi ro) | CSDL tích lũy thêm đơn sau mỗi lần chạy (không dọn). Nếu bảng đơn hàng có phân trang hoặc sắp xếp từ cũ đến mới thì đơn vừa tạo có thể không nằm ở trang đầu, test S09-S12 sẽ không tìm thấy hàng. Chưa xác nhận SUT có phân trang. | Đặc thù của dữ liệu dùng chung. | Xác nhận thủ công; nếu có phân trang thì thêm bước tìm đơn (lọc, hoặc chuyển trang). | F | Cần xác nhận |
| 4 | `openAdmin` | `waitForResponse(...).catch(() => null)` **nuốt lỗi**: nếu request tải đơn hàng không bao giờ xảy ra, test vẫn chạy tiếp và chỉ thất bại ở bước sau với thông báo khó hiểu. | AI sợ test treo nên bắt hết lỗi. | Khi `null`, thêm annotation hoặc `console.warn`, để thấy rõ trong báo cáo. | M | Đề xuất |
| 5 | `waitDashboardLoaded` | Phân biệt "đã tải xong" bằng heuristic `count != 0`, nên phải có `ensureAtLeastOneOrder`. Dashboard khi chưa có đơn nào (spec-notes mục 7) không thể test được. | Giao diện hiện 0 trong lúc tải (đã ghi ở mục A-2), AI xử lý bằng cách tránh tình huống DB rỗng thay vì chờ tín hiệu tải xong. | Chờ response `GET /api/admin/orders` hoàn tất (đã có trong `openAdmin`) thay vì dựa vào giá trị. | M, F | Đề xuất |
| 6 | S11, S12 | Assertion `row.getByRole('button')` count 0 là **mạnh nhưng rộng**: nếu SUT thêm nút không liên quan (ví dụ "Chi tiết") thì test đỏ giả. | Muốn tránh bỏ sót bất kỳ hành động nào. | Chỉ đếm các nút trong `ACTION_BUTTON` (Xác nhận, Giao hàng, Hoàn thành, Hủy). | M | Đề xuất |
| 7 | `captureDialogs` (admin vs web) | Hai helper cùng tên nhưng khác hành vi: admin `dismiss()`, web `accept()`. Với `confirm()` (ví dụ xác nhận hủy đơn) hai hành vi cho kết quả ngược nhau. | Mỗi helper được sinh riêng. | Gộp một helper có tham số, hoặc đổi tên (`dismissDialogs` / `acceptDialogs`). | P | Đề xuất |
| 8 | Dòng 219 và `api.ts` | Dữ liệu cứng trong code: `'WrongPass1!'` (spec), `'123 Le Loi, Q1, TP.HCM'` và `1000` (helper). | Như E-7 của FR-04. | Chuyển vào `data/fr13-access.json` / `accounts.json`. | P | Đề xuất |
| 9 | Edge case thiếu | Chưa có: dashboard khi CSDL rỗng; tự cập nhật khi đơn đổi trạng thái mà không tải lại; nhiều lần đăng nhập sai (khóa 30 giây, FR-02) ở màn hình admin; nhiều tab admin cùng lúc. | Phạm vi theo bảng HW02 và SRS im lặng ở các chỗ này. | Thêm vào data khi SRS làm rõ; ghi rõ trong báo cáo là ngoài phạm vi. | P, F | Đề xuất |

### Gợi ý cho video

Mục B ở trên ghi "không có chỗ nào phải sửa script", trong khi đề bài yêu cầu kể ít nhất một chỗ sửa. Chọn một mục ở bảng E, **sửa trong code, chạy lại 3 trình duyệt rồi mới đổi trạng thái sang "Đã sửa"**. Mục E-1 (`digits()` ném lỗi khi không có chữ số) nhỏ, an toàn và dễ trình bày trước/sau.
