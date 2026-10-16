# Hướng Dẫn Thí Nghiệm: AI Sinh Test Từ OpenAPI (Hướng AI của T06)

> Mục tiêu: chứng minh bằng số liệu thật rằng cách viết prompt ảnh hưởng đến số lỗi mà AI tìm được, và chỉ ra AI còn bỏ sót gì.
> Đây là hướng "AI test gen from OpenAPI" (kèm phần negative test) trong brief T06, đồng thời đáp ứng yêu cầu của giảng viên: hướng dẫn người không rành testing dùng prompt để tìm được càng nhiều lỗi càng tốt.

---

## 1. Câu hỏi thí nghiệm

1. Chỉ đưa file OpenAPI và nói "viết test cho API này" (Prompt A), AI tìm được bao nhiêu trong 29 lỗi đã biết?
2. Khi thêm ngữ cảnh nghiệp vụ, nhóm ca kiểm thử, tư duy đối kháng và bước tự rà soát (Prompt B), số lỗi tìm được tăng thế nào?
3. AI sai ở đâu: lỗi script, mong đợi sai, hay bỏ sót hẳn một nhóm lỗi?

Bảng đáp án (29 lỗi B1 đến B29 và ghi nhận O2) nằm ở `Postman_Test_Report.md`. Đừng đưa bảng này cho AI.

---

## 2. Bộ tài liệu

| File | Dùng để làm gì | Đưa cho AI? |
|---|---|---|
| `openapi_for_ai.yaml` | Đặc tả OpenAPI đã bỏ mọi ghi chú về lỗi | Có (cả hai điều kiện) |
| `srs_excerpt.md` | Đặc tả nghiệp vụ (FR-01 đến FR-20, bảo mật) trích từ README | Chỉ Prompt B |
| `ai_test_runner_template.postman_collection.json` | Khung Postman để chạy code test do AI viết | Không (bạn dùng) |
| `Prompt_A_ready.txt` | Prompt A đã ghép sẵn nội dung `openapi_for_ai.yaml` (khoảng 34.000 ký tự) | Có (dán vào chat) |
| `Prompt_B_ready.txt` | Prompt B đã ghép sẵn `openapi_for_ai.yaml` và `srs_excerpt.md` (khoảng 48.000 ký tự) | Có (dán vào chat) |
| `AI_Run_Log_Template.md` | Mẫu ghi nhận và chấm điểm cho cả hai điều kiện | Không (bạn điền) |
| `AI_Experiment_Guide.md` | File này | Không |
| `openapi.yaml`, `Postman_Test_Report.md`, `overview.md`, `eshop_api_all_tests.postman_collection.json` | Chứa đáp án (danh sách lỗi) | **Tuyệt đối không** |

### Khác biệt giữa `openapi_for_ai.yaml` và `openapi.yaml`
- Bỏ toàn bộ `x-known-deviations` và các câu mô tả nhắc đến lỗi hay kết quả quan sát.
- `POST /api/apply-coupon` không yêu cầu token (đúng như `api_specification.md`); bản đầy đủ yêu cầu đăng nhập theo SRS.
- `PUT /api/users/me` không có `additionalProperties: false`; mã OTP không có ràng buộc 6 chữ số; ví dụ giá trị giảm giá bị bỏ.
- Mô tả lỗi 400 ở đăng ký, checkout, áp mã giảm giá được viết trung tính.

Lý do: các quy tắc nghiệp vụ lấy từ SRS chỉ nên xuất hiện ở điều kiện B, để so sánh có ý nghĩa. Lưu ý một phần lỗi (thiếu token, sai quyền, id không tồn tại, thiếu trường bắt buộc) AI vẫn tìm được ngay từ spec vì spec đã khai báo mã 401, 403, 404, 400. Đó là kết quả đáng ghi nhận: spec tốt giúp cả prompt đơn giản tìm được lỗi.

---

## 3. Nguyên tắc công bằng (bắt buộc)

1. Mỗi điều kiện dùng **một cuộc trò chuyện mới**, không đính kèm file nào khác ngoài những file ở bảng trên.
2. Cùng một mô hình, cùng một ngày cho cả hai điều kiện. Ghi rõ tên và phiên bản mô hình (brief: chỉ dùng gói miễn phí hoặc bản dùng thử).
3. Mỗi điều kiện sinh code **một lần**. Nếu phải sinh lại vì output bị cắt, ghi số lượt.
4. Không sửa gì trước lần chạy 1. Lưu nguyên văn prompt và nguyên văn output.
5. Khởi động lại server (`node server.js`) trước **mỗi lần chạy**, để dữ liệu sạch và tài khoản không bị khóa.
6. Báo cáo đúng số liệu thu được, kể cả khi A và B gần như bằng nhau hoặc B tệ hơn. Đó vẫn là kết quả hợp lệ và có giá trị học thuật.
7. Tắt mọi thứ có thể làm AI biết thông tin ngoài file: dùng chat ẩn danh hoặc chat tạm thời, tắt bộ nhớ, tắt tính năng tham chiếu các cuộc trò chuyện cũ và tắt tìm kiếm web. Nếu không, AI có thể dùng thông tin từ các cuộc trò chuyện trước (chứa danh sách lỗi) và làm sai lệch kết quả.

---

## 4. Quy trình từng bước

**Bước 0. Chuẩn bị**
- Postman: Import `ai_test_runner_template.postman_collection.json`. Nhân đôi collection (đặt tên `AI - Prompt A` và `AI - Prompt B`) để lưu hai bản code riêng.
- Tạo thư mục `ai_runs/` trong repo nhóm để lưu: `A_prompt.txt`, `A_output.js`, `B_prompt.txt`, `B_output.js`, ảnh chụp Test Results, bảng chấm.

**Bước 1. Điều kiện A**
1. Mở chat mới. Dán Prompt A (mục 5), rồi dán nội dung `openapi_for_ai.yaml` vào chỗ được đánh dấu.
2. Lưu câu trả lời vào `A_output.js` (chỉ phần code).

**Bước 2. Chạy lần 1 (nguyên bản)**
1. Khởi động lại server.
2. Trong collection `AI - Prompt A`, mở request `AI TESTS`, tab Scripts, mục Post-response. Thay phần giữa hai dòng `BẮT ĐẦU PHẦN DÁN CODE CỦA AI` và `KẾT THÚC PHẦN DÁN CODE CỦA AI` bằng code của AI.
3. Bấm Send, mở tab Test Results, chụp ảnh. Ghi số test, số đạt, số đỏ.
4. Với mỗi test đỏ, đọc thông báo lỗi để phân loại (mục 7.2): lỗi hệ thống thật, lỗi script của AI, hoặc test sai kỳ vọng.

**Bước 3. Sửa tối thiểu rồi chạy lần 2**
1. Chỉ sửa lỗi cơ học (cú pháp, gọi sai hàm trong `ctx`, thiếu `await`). Ghi từng chỗ sửa.
2. Không sửa nội dung kiểm tra. Nếu AI hiểu sai spec và viết sai kỳ vọng, giữ nguyên, đó là sai sót của AI.
3. Khởi động lại server, chạy lại, chụp ảnh. Đây là kết quả chính thức để chấm.

**Bước 4. Điều kiện B**
Lặp lại bước 1 đến 3 với Prompt B (mục 6), đính kèm thêm `srs_excerpt.md`.

**Bước 5. Chấm điểm**
Dùng bảng ở mục 7 để chấm từng lỗi cho A và B.

**Bước 6. Bổ sung của người (Refine)**
Với các lỗi cả hai điều kiện bỏ sót, tự viết test bổ sung (hoặc dùng test trong `eshop_api_all_tests.postman_collection.json`). Ghi lại 3 đến 5 ca mà AI không đề xuất, đây là nội dung của câu hỏi cuối trong hoạt động Spec-to-Tests Sprint.

**Bước 7. Tổng hợp**
Điền bảng chỉ số (mục 8) và rút ra kết luận (mục 9).

---

## 5. Prompt A (đơn giản)

Bản đã ghép sẵn nội dung spec nằm ở `Prompt_A_ready.txt` (chỉ cần mở file, chọn toàn bộ, sao chép và dán). Nội dung dưới đây là khung của prompt.

```
Bạn là kỹ sư kiểm thử API. Dưới đây là đặc tả OpenAPI của hệ thống EShop (backend chạy tại http://localhost:3000). Hãy viết test tự động cho API này.

Thông tin để chạy test:
- Tài khoản admin: admin@eshop.com / Admin123!
- Tài khoản người dùng: test@eshop.com / Test1234!

Định dạng đầu ra (bắt buộc): code JavaScript chạy trong script Post-response của Postman, gồm hàm async aiTests(ctx). Chỉ trả về code, không giải thích. Trong hàm có sẵn các công cụ sau:
- ctx.call(method, path, { token, body }) trả về Promise<{ code, json, text, ct }>. code là mã HTTP, json là body đã parse (null nếu không phải JSON), text là body dạng chuỗi, ct là Content-Type. token và body là tùy chọn.
- ctx.newUser(label) trả về Promise<{ email, password, id, token }>: tạo một người dùng mới, đăng nhập và trả về token.
- ctx.ADMIN và ctx.USER: JWT của hai tài khoản trên (đã đăng nhập sẵn).
- ctx.RUN: chuỗi duy nhất của lần chạy, dùng để đặt tên dữ liệu bạn tạo ra.
- pm.test("T01 mô tả", function () { pm.expect(...) }) để kiểm tra. Đặt tên test bắt đầu bằng T01, T02, ...
Có thể chia thành nhiều hàm con, miễn có hàm aiTests(ctx) gọi tất cả. Mọi lời gọi mạng đều phải dùng await.

Đặc tả OpenAPI:
<dán nội dung openapi_for_ai.yaml>
```

---

## 6. Prompt B (có hướng dẫn)

Bản đã ghép sẵn nội dung spec và SRS nằm ở `Prompt_B_ready.txt` (chỉ cần mở file, chọn toàn bộ, sao chép và dán). Nội dung dưới đây là khung của prompt.

```
Bạn là kỹ sư kiểm thử API giàu kinh nghiệm, có tư duy đối kháng: luôn tự hỏi "nếu tôi là người dùng cẩu thả hoặc kẻ tấn công, tôi sẽ làm gì để hệ thống làm sai hoặc để lộ dữ liệu?".

Nhiệm vụ: viết test tự động cho API của hệ thống EShop (backend chạy tại http://localhost:3000) sao cho tìm được CÀNG NHIỀU LỖI THẬT càng tốt. Hệ thống có thể chưa tuân thủ đặc tả, nên mỗi test phải kiểm tra hành vi ĐÚNG theo đặc tả OpenAPI và SRS, không viết theo điều bạn đoán hệ thống đang làm.

Tài liệu:
1) Đặc tả OpenAPI (kỹ thuật: endpoint, dữ liệu, mã trạng thái).
2) Đặc tả nghiệp vụ SRS (các quy tắc mà hệ thống phải tuân thủ, mã FR-xx và SEC-xx).
3) Dữ liệu mẫu có sẵn:
- Tài khoản admin: admin@eshop.com / Admin123!; người dùng: test@eshop.com / Test1234!
- Danh mục: 1 Điện thoại, 2 Laptop, 3 Phụ kiện.
- Sản phẩm: 1 iPhone 15 Pro Max (30.000.000), 2 Samsung Galaxy S24 Ultra (28.000.000), 3 MacBook Pro M3 (45.000.000), 4 Tai nghe AirPods Pro 2 (6.000.000), 5 Bàn phím cơ Keychron Q1 (4.000.000).
- Mã giảm giá: SAVE10 (giảm 10%, đơn tối thiểu 300.000, 1 lần mỗi người), BIGBUY (giảm 50.000, tối thiểu 500.000, 1 lần), VIP100 (giảm 100.000, tối thiểu 300.000, 2 lần mỗi người), EXPIRED (20%, đã hết hạn).

Cách làm, thực hiện lần lượt:
Bước 1. Đọc SRS và liệt kê các quy tắc có thể kiểm tra qua API.
Bước 2. Với từng nhóm chức năng, thiết kế test thuộc đủ 6 nhóm:
  (1) đường đi đúng;
  (2) giá trị biên (nhỏ nhất, lớn nhất, đúng bằng ngưỡng, vượt ngưỡng);
  (3) dữ liệu sai, thiếu, sai kiểu, trống;
  (4) vi phạm quy tắc nghiệp vụ trong SRS;
  (5) phân quyền và bảo mật: không token, token sai, sai vai trò, truy cập dữ liệu của người khác, gửi thêm trường không có trong đặc tả, dữ liệu nhạy cảm bị lộ trong response;
  (6) trạng thái và luồng nhiều bước: thứ tự thao tác, thao tác lặp lại, trạng thái kết thúc.
Bước 3. Trên dòng ngay trước mỗi test, ghi chú một dòng: "// Mục tiêu: <lỗi có thể tìm ra>. SRS: <mã FR/SEC nếu có>".
Bước 4. Tự rà soát: mỗi mã FR và SEC trong SRS phải có ít nhất một test. Liệt kê mã còn thiếu rồi bổ sung test.

Đầu ra gồm hai phần: (a) bảng ngắn "mã FR/SEC -> các test tương ứng"; (b) code JavaScript chạy trong script Post-response của Postman, gồm hàm async aiTests(ctx). Trong hàm có sẵn các công cụ sau:
- ctx.call(method, path, { token, body }) trả về Promise<{ code, json, text, ct }>. code là mã HTTP, json là body đã parse (null nếu không phải JSON), text là body dạng chuỗi, ct là Content-Type. token và body là tùy chọn.
- ctx.newUser(label) trả về Promise<{ email, password, id, token }>: tạo người dùng mới, đăng nhập và trả về token. Dùng hàm này để mỗi test có dữ liệu riêng, không ảnh hưởng lẫn nhau.
- ctx.ADMIN và ctx.USER: JWT của admin@eshop.com và test@eshop.com (đã đăng nhập sẵn). Không đăng nhập sai mật khẩu trên hai tài khoản này vì tài khoản sẽ bị khóa; dùng ctx.newUser cho các thử nghiệm đó.
- ctx.RUN: chuỗi duy nhất của lần chạy, dùng để đặt tên dữ liệu bạn tạo ra.
- pm.test("T01 mô tả", function () { pm.expect(...) }) để kiểm tra. Đặt tên test bắt đầu bằng T01, T02, ...
Có thể chia thành nhiều hàm con, miễn có hàm aiTests(ctx) gọi tất cả. Mọi lời gọi mạng đều phải dùng await. Nếu câu trả lời quá dài, hãy trả lời theo từng phần và tôi sẽ yêu cầu "tiếp tục".

Đặc tả OpenAPI:
<dán nội dung openapi_for_ai.yaml>

Đặc tả nghiệp vụ SRS:
<dán nội dung srs_excerpt.md>
```

Nếu AI dừng giữa chừng, gửi: `Tiếp tục, viết nốt phần code còn lại, không lặp lại phần đã viết.` Nếu AI chia thành nhiều khối code, gộp lại thành một khối trước khi dán, và ghi số lượt.

### Vì sao từng thành phần của Prompt B giúp tìm thêm lỗi (dùng cho slide)

| Thành phần | Tác dụng | Lỗi dễ tìm thêm nhờ nó |
|---|---|---|
| Vai trò và tư duy đối kháng | Chuyển AI từ "kiểm tra hệ thống chạy" sang "tìm cách làm hệ thống sai" | Lạm quyền, qua mặt giới hạn |
| Đưa SRS (quy tắc nghiệp vụ) | OpenAPI chỉ nói dữ liệu có dạng gì; SRS nói điều gì là đúng | Công thức giảm giá, ngưỡng khóa tài khoản, độ dài OTP, trạng thái đơn |
| Dữ liệu mẫu | AI có số cụ thể để tính kết quả đúng và dựng tình huống biên | Giảm giá sai, đơn đúng bằng mức tối thiểu |
| Sáu nhóm ca | Ép AI không chỉ dừng ở đường đi đúng | Biên, dữ liệu rỗng, trạng thái kết thúc |
| Ghi mục tiêu mỗi test | Buộc AI nghĩ "test này tìm lỗi gì" trước khi viết | Test có chủ đích thay vì test đại trà |
| Tự rà soát theo mã FR/SEC | Phát hiện quy tắc nào còn chưa có test | Bao phủ đều các yêu cầu |
| "Kiểm tra hành vi đúng, không viết theo điều đoán" | Tránh test khóa chặt hành vi lỗi | Giảm test pass giả |

---

## 7. Bảng chấm

### 7.1. Cách chấm
Với mỗi lỗi, đánh một ký hiệu cho A và cho B (lấy kết quả của lần chạy chính thức, mục 4 bước 3):
- **D (Phát hiện):** có test kiểm tra đúng điều kiện ở cột 3 và test đỏ vì chính lỗi đó (đọc thông báo lỗi để chắc).
- **L (Bỏ lọt):** có test liên quan nhưng không đỏ (assertion quá lỏng hoặc mong đợi sai khiến lỗi bị coi là đúng).
- **K (Không có):** không có test nào chạm tới điều kiện đó.

| Mã | Lỗi | Test phải kiểm tra điều gì mới tính là phát hiện | A | B |
|---|---|---|---|---|
| B1 | Login lộ mật khẩu | Response đăng nhập, `user` không có trường `password` | | |
| B2 | Hồ sơ lộ mật khẩu và reset_token | `GET /users/me` không có `password`, `reset_token` | | |
| B3 | `price` kiểu chuỗi ở id chẵn | `GET /products/2` có `price` là số | | |
| B4 | Giảm giá phần trăm sai | SAVE10, đơn 1.000.000: giảm 100.000, thành tiền 900.000 | | |
| B5 | User thường xem được danh sách người dùng | `GET /admin/users` bằng token user thường trả 401 hoặc 403 | | |
| B6 | Xem đơn không cần token hoặc xem đơn người khác | `GET /orders/{id}` không token trả 401, hoặc token người khác trả 403/404 | | |
| B7 | Sản phẩm không tồn tại trả 200 | `GET /products/99999` trả 404 | | |
| B8 | Ghi sản phẩm không cần token | `POST`, `PUT` hoặc `DELETE /products` không token trả 401 | | |
| B9 | Đăng ký trùng email | Đăng ký email đã có trả 400 hoặc 409 | | |
| B10 | Đăng ký không kiểm tra dữ liệu | Đăng ký body rỗng hoặc thiếu trường trả 400 | | |
| B11 | Tạo sản phẩm, danh mục, mã giảm giá thiếu trường | `POST` với body rỗng hoặc thiếu trường bắt buộc trả 400 | | |
| B12 | Sửa, xóa tài nguyên không tồn tại báo thành công | `PUT` hoặc `DELETE` với id không tồn tại trả 404 | | |
| B13 | Checkout không kiểm tra giỏ và tổng tiền | Checkout giỏ trống, hoặc tổng sai lệch giỏ, trả 400 | | |
| B14 | Mã giảm giá từ chối đúng mức tối thiểu | SAVE10, đơn đúng 300.000 được áp dụng | | |
| B15 | Tự nâng quyền admin | `PUT /users/me` gửi `role: admin`, sau đó `role` vẫn là `user` | | |
| B16 | Cập nhật hồ sơ xóa trường không gửi | Gửi chỉ `name`, rồi `shipping_address` và `phone` giữ nguyên | | |
| B17 | SQL injection ở tìm kiếm | Tìm với dấu `'` không lỗi 500 hoặc HTML; chuỗi `' OR 1=1 --` không trả toàn bộ | | |
| B18 | Giỏ hàng nhận body rỗng | `POST /cart` với `{}` trả 400 | | |
| B19 | Giỏ hàng tin giá client | Thêm sản phẩm với giá sai, giá trong giỏ vẫn là giá thật | | |
| B20 | Giỏ không xóa sau thanh toán | Sau checkout, `GET /cart` rỗng | | |
| B21 | Hủy được đơn đang shipping | Đơn `shipping`, user hủy trả 400 | | |
| B22 | Chuyển `canceled` sang `delivered` | Admin đổi trạng thái đơn đã hủy sang `delivered` trả 400 | | |
| B23 | Qua mặt giới hạn lượt dùng mã bằng cách bỏ `user_id` | Mã đã hết lượt, gọi không có `user_id` vẫn bị từ chối | | |
| B24 | API quản trị, danh mục, mã giảm giá không kiểm tra role | Token user thường gọi các API này (ngoài `/admin/users`) trả 403 | | |
| B25 | Thêm cùng sản phẩm tạo dòng mới | Thêm cùng sản phẩm hai lần: 1 dòng, `quantity = 2` | | |
| B26 | `apply-coupon` không cần đăng nhập | Gọi không có token trả 401 | | |
| B27 | Khóa tài khoản sai ngưỡng | Sau 2 lần sai vẫn đăng nhập được (khóa từ lần sai thứ 3) | | |
| B28 | OTP chỉ 4 chữ số | `resetToken` có tối thiểu 6 chữ số | | |
| B29 | Mã giảm giá trùng code trả 500 | Tạo mã trùng `code` trả 400 hoặc 409, không phải 500 | | |
| O2 | JWT không có `exp` | Giải mã token, có trường `exp` | | |

Tổng cộng 30 mục (29 lỗi và 1 ghi nhận).

### 7.2. Phân loại mỗi test đỏ
Với mỗi test đỏ, đánh một trong ba loại:
- **Lỗi hệ thống thật:** test đúng, hệ thống sai (tương ứng một mã B ở bảng trên).
- **Lỗi script của AI:** thông báo `LỖI SCRIPT CỦA AI`, hoặc lỗi cú pháp, hoặc dùng sai `ctx`.
- **Test sai kỳ vọng:** AI hiểu sai spec nên viết kỳ vọng sai, khiến test đỏ ở chỗ hệ thống thực ra đúng (báo động giả).

Và với test **xanh** cần xem lại: có test nào xanh vì AI mong đợi đúng hành vi lỗi (ví dụ mong đợi 200 khi gửi body rỗng) không? Ghi là "khóa chặt lỗi".

---

## 8. Chỉ số và mẫu ghi nhận

Điền cho mỗi điều kiện:

| Chỉ số | A | B |
|---|---|---|
| Mô hình, phiên bản, ngày | | |
| Số lượt hỏi để có đủ code | | |
| Độ dài code (số dòng) | | |
| Số test sinh ra | | |
| Số lỗi cú pháp, lỗi script phải sửa ở bước 3 | | |
| Lần chạy 1: số test đạt, số test đỏ | | |
| Lần chạy 2 (chính thức): số test đạt, số test đỏ | | |
| Số lỗi phát hiện (ký hiệu D) trên 30 mục | | |
| Số lỗi bỏ lọt (L) | | |
| Số lỗi không có test (K) | | |
| Số test đỏ do lỗi script hoặc sai kỳ vọng (báo động giả) | | |
| Số test khóa chặt hành vi lỗi | | |
| Thời gian từ lúc dán prompt đến lúc có kết quả chạy | | |

Lưu kèm: ảnh chụp Test Results của lần chạy chính thức, file prompt và file output nguyên văn, danh sách chỗ sửa ở bước 3.

---

## 9. Cách đọc kết quả

Dưới đây là các giả thuyết để kiểm chứng, **không phải kết quả**. Hãy báo cáo số liệu thu được.

1. **A phát hiện chủ yếu lỗi nằm trong spec** (thiếu token, sai quyền, id không tồn tại, thiếu trường bắt buộc), vì spec đã khai báo mã 401, 403, 404, 400. Lỗi cần quy tắc nghiệp vụ (công thức giảm giá, ngưỡng, trạng thái đơn, OTP) ít khi được phát hiện.
2. **B phát hiện thêm lỗi nghiệp vụ** nhờ SRS và dữ liệu mẫu. Nếu B không hơn A nhiều, hãy xem lý do: AI có bỏ qua SRS không, số test có bị giới hạn bởi độ dài câu trả lời không.
3. **Cả hai bỏ sót các lỗi cần trình tự nhiều bước hoặc trạng thái** (hủy đơn đang shipping, qua mặt giới hạn lượt dùng, giỏ không xóa sau thanh toán) nếu không được nhắc rõ. Đây chính là nội dung "AI bỏ sót luật nghiệp vụ và lạm dụng" mà brief nêu.
4. **Một số test xanh giả:** AI viết kỳ vọng theo hành vi mà nó đoán hệ thống làm. Cần đối chiếu.

Kết luận chung thường rút ra (kiểm chứng bằng số liệu của nhóm trước khi ghi vào báo cáo): chất lượng đầu vào (spec, SRS, dữ liệu mẫu) và cách ra yêu cầu quyết định chất lượng test AI sinh; AI không thay thế người ở khâu hiểu luật nghiệp vụ và thiết kế ca lạm dụng; mọi test do AI sinh phải được người xem lại và chạy thật.

---

## 10. Dùng kết quả cho seminar

**Bố cục phần AI trong slide** (hướng tới người không biết testing):
1. Một lỗi thật dễ hiểu (ví dụ mã giảm giá 10% làm đơn hàng tăng giá).
2. Prompt A: đưa file OpenAPI, nói "viết test". Kết quả: số lỗi tìm được.
3. Prompt B: thêm từng yếu tố, giải thích vì sao (bảng ở mục 6). Kết quả: số lỗi tìm được.
4. Những gì cả hai vẫn bỏ sót, và vì sao.
5. Nguyên tắc: AI sinh, người xem lại, chạy thật, ghi lại (prompt, mô hình, chỗ đã sửa).

**Bài tập áp dụng cho lớp** (dùng chính hai prompt này, đủ cho Activity_Worksheet):
- Chọn một endpoint khác (ví dụ `POST /api/apply-coupon` hoặc `PUT /api/orders/{id}/cancel`), mỗi nhóm dùng Prompt A hoặc Prompt B, rồi hai nhóm so sánh số lỗi và ca kiểm thử.
- Câu hỏi cuối: nêu một ca kiểm thử mà AI không đề xuất.
- Gợi ý lời giải: dùng bảng chấm ở mục 7.

**Hướng nâng cao (tùy chọn, làm sau khi có kết quả):** đóng gói Prompt B thành một file hướng dẫn tái sử dụng (skill) để chạy cho các endpoint khác. Đây là ý tưởng "tổng quát hóa và tái sử dụng" của giảng viên, và chỉ nên làm nếu còn thời gian. Nếu không kịp, Prompt B nguyên văn đã đủ làm mẫu prompt dùng lại được.

---

## 11. Rủi ro và lưu ý

- **Output bị cắt:** yêu cầu AI trả lời theo từng phần, ghi số lượt; hoặc chia theo nhóm chức năng nếu AI không tự chia.
- **AI bịa endpoint hoặc trường:** test gọi endpoint không có trong spec sẽ đỏ vì 404; phân loại là "sai kỳ vọng" hoặc "lỗi AI", đừng tính là lỗi hệ thống.
- **Dữ liệu và tài khoản bị hỏng giữa chừng:** khởi động lại server trước mỗi lần chạy. Nếu `00 Môi trường sẵn sàng` đỏ thì server chưa chạy hoặc tài khoản mẫu bị khóa.
- **Chạy lặp lại trong cùng một phiên server** có thể cho kết quả khác (đơn, mã, người dùng đã tạo). Không dùng làm kết quả chính thức.
- **Quyền riêng tư:** chỉ đưa spec, SRS và dữ liệu giả của hệ thống test cục bộ cho AI, không đưa dữ liệu thật hay mã bí mật.
- **Hạn mức miễn phí:** Prompt B dài hơn nên có thể chạm hạn mức; chọn thời điểm ít bị giới hạn hoặc chia thành hai lượt.
- **Kết quả phụ thuộc phiên bản:** cùng một prompt có thể cho kết quả khác ở lần sinh khác. Vì vậy ghi rõ ngày, mô hình và lưu nguyên văn output.
- **Bản mã nguồn:** bảng đáp án đúng với bản repo tại thời điểm khảo sát; nếu repo thay đổi, cần chạy lại bộ test tổng hợp để cập nhật đáp án.
