# Báo Cáo Kỹ Thuật Postman & AI Agent — Tuần 05
# Member: Hà Quốc Kiên (MSSV: 23120056)

- **Họ và tên:** Hà Quốc Kiên  
- **MSSV:** 23120056  
- **Git Username:** `kienha5`  
- **Vai trò:** Thành viên Nhóm 11 — Phụ trách Postman (P1, P2), CSV Data-Driven Testing & Nghiên cứu AI Agent  
- **Tuần thực hành:** 05 (Tương ứng Tuần lý thuyết 06)  
- **Hệ thống kiểm thử (SUT):** EShop (`ttbhanh/eshop-sut`, Node.js/Express + SQLite), `http://localhost:3000`  
- **Nguồn chuẩn cho kết quả mong đợi:** SRS (README của EShop) và `api_specification.md`; khi hai bên mâu thuẫn thì theo SRS  

---

## 1. Tóm tắt kết quả

| Hạng mục | Kết quả chính |
|---|---|
| Postman (collection chính) | 66 request (38 request chính + 28 request thư mục `Errors`), 28/38 request chính xanh, 10 request có assertion đỏ (17 assertion) ứng với 9 lỗi (B1–B8 và B28). Chạy `npm run test:full` trên máy nhóm 23/10/2026: 68 request, 131 assertion, 18 đỏ |
| Postman (bộ test tổng hợp, 1 request `00 RUN ALL`) | 118 assertion: 62 đạt, 56 đỏ, tương ứng B1–B33 và 1 ghi nhận O2. Đã chạy `npm run test:allin1` trên máy nhóm 23/10/2026: 202 request, 118 assertion, 56 đỏ |
| Data-driven CSV + Newman | `login`: 15 dòng, 45 assertion, 4 đỏ. `products`: 14 dòng, 26 assertion, 10 đỏ |
| AI sinh test (Gemini 3.1 Pro) | Prompt đơn giản (A): phát hiện 0/30 lỗi. Prompt có SRS (B): phát hiện 7/30 và thêm 4 lỗi mới (B30–B33) |
| Skill `api-test-design` + Karate (FR-09) | 13 ca, 8 đạt, 5 đỏ; bắt 4/5 lỗi đã biết của 3 endpoint, 0 lỗi mới. Đối chiếu bằng collection Postman riêng: khớp 12/13 ca, ca lệch AC10 là lỗi script của Karate |

Điểm chung: mọi lỗi lệch đặc tả đều trả HTTP 200, nên kiểm tra chỉ dựa vào mã trạng thái không phát hiện được lỗi nào; cần assertion theo nội dung và theo SRS.

---

## 2. Các Hạng Mục Kỹ Thuật Đã Thực Hiện

### 2.1. Postman Functional Testing (P1 & P2)
- **P1 (Basic / Smoke Test):** Kiểm tra endpoint danh sách sản phẩm `GET /api/products`, assert HTTP Status 200, đúng 5 sản phẩm, kiểm tra JSON Schema (mảng, mỗi phần tử đủ field, `price` là số lớn hơn 0). [Cần xác nhận: assertion thời gian phản hồi `< 500ms` không có trong collection v3; nếu nằm ở bản khác thì giữ, nếu không thì bỏ.]
- **P2 (Stateful Token Chaining):** Gọi `POST /api/login`, dùng Tests script trích xuất `response.json().token` và lưu thành biến (`userToken` cho user, `adminToken` cho admin); các request sau đính kèm `Authorization: Bearer {{userToken}}` (hoặc `{{adminToken}}`). Các biến khác được chain tương tự: `orderId`, `newProductId`, `newCategoryId`, `newCouponId`, `resetToken`.
- **Phạm vi collection chính:** 30 endpoint trong `api_specification.md`, thêm `POST /api/coupon-usage` (mobile đang gọi nhưng spec không có) và biến thể payload checkout của mobile. 38 request chính chia vào 9 thư mục (Auth, Products, Cart, Orders, Coupons, Admin, Users, Categories, `Orders - Cancel`), cộng thư mục `Errors` (28 request: 2 chuẩn bị, 26 ca phản hồi lỗi E1–E26, script kiểm tra ở cấp thư mục: 16 ca trả 4xx có assertion JSON và `error` kiểu chuỗi; 10 ca trả 200 trái kỳ vọng chỉ có response mẫu) và 2 request Data-driven (tổng 68 request).
- **Nguyên tắc:** assertion viết theo hành vi mong đợi của SRS, không theo hành vi hiện tại của hệ thống; assertion đỏ nghĩa là hệ thống sai, không sửa assertion cho xanh. Có kiểm tra cả ca tích cực lẫn ca âm tính (401/403/404).
- **Bộ test tổng hợp:** một request `00 RUN ALL` chứa toàn bộ test trong script (202 request theo Newman, 118 assertion), tự tạo và dọn dữ liệu nên chạy lặp lại được (đã chạy hai lần liên tiếp cho kết quả giống nhau). Nhóm test: A (xác thực), U (hồ sơ), P (sản phẩm), C (danh mục), K (giỏ hàng), O (đơn hàng), Q (mã giảm giá), D (quản trị).
- **Chi tiết đầy đủ** (bảng 38 request, cấu trúc response thật, các điểm không khớp giữa spec/mobile/backend, mục chưa kiểm thử): xem `Postman_Test_Report.md`.

### 2.2. CSV Data-Driven Testing
- **Công cụ:** Collection Runner của Postman bị khóa ở gói miễn phí nên dùng **Newman** (`newman run ... -d file.csv`) và xuất báo cáo HTML. Giảng viên đã cho phép tìm cách khác khi chức năng bị khóa trả phí; sẽ trình bày lại khi thuyết trình.
- **Cách hoạt động:** một request dùng biến `{{dd_email}}`, `{{dd_password}}`, `{{dd_id}}`; Newman chạy một lần cho mỗi dòng CSV; mỗi dòng mang kết quả mong đợi (`dd_expected_status`, `dd_expected_error`, `dd_name_contains`). Request nằm trong hai thư mục `DataDriven - Login` và `DataDriven - Products` của collection v3 (68 request).
- **`login_data.csv` (15 dòng):** user và admin hợp lệ (L01, L02), sai mật khẩu một lần (L03), đăng nhập đúng ngay sau đó để reset bộ đếm khóa (L04), email không tồn tại, mật khẩu rỗng, email rỗng (L05–L07), SQL injection và XSS ở email (L08, L13), email 250 ký tự (L09), email thiếu `@`, thiếu tên miền, khoảng trắng đầu (L10–L12), sai chữ hoa chữ thường (L14) rồi đăng nhập đúng (L15). Mỗi dòng 3 assertion.
- **`product_ids.csv` (14 dòng):** 5 sản phẩm hợp lệ (P01–P05), id không tồn tại, âm, chữ, 0, ngay sau id cuối, thập phân, rất lớn, chuỗi SQL (P06–P13, kỳ vọng 404), id biên 1 làm đối chứng (P14). Dòng 200 có 3 assertion (mã, schema với `price` là số, tên), dòng 404 có 1 assertion.
- **Quy tắc thiết kế:** sai mật khẩu trên tài khoản thật chỉ để một lần rồi ngay sau đó là dòng đúng (sai hai lần sẽ khóa tài khoản); ca sai khác dùng email không tồn tại; không đưa `"` hoặc `\` vào dữ liệu vì giá trị được chèn thẳng vào body JSON.
- **Kết quả:**

| Suite | Lần lặp | Assertion | Đỏ | Đỏ là gì |
|---|---|---|---|---|
| `login` (bản đầu, 9 dòng) | 9 | 27 | 3 | B1 |
| `login` (sau khi thêm L10–L15) | 15 | 45 | 4 | B1 ở L01, L02, L04, L15 (response lộ `password`) |
| `products` (bản đầu, 8 dòng) | 8 | 18 | 5 | B3, B7 |
| `products` (sau khi thêm P09–P14) | 14 | 26 | 10 | B3 ở P02, P04 (`price` là chuỗi); B7 ở P06–P13 (id không tồn tại hoặc không hợp lệ vẫn trả 200 `{}`) |
| `full` (collection v3) | 1 | 131 | 18 | B1, B2, B3, B4, B5, B6, B7, B8, B28 ở request chính (17) và B1 ở Data-driven (1); đã chạy trên máy nhóm 23/10/2026, khớp baseline |

- **Nhận xét:** năm dòng đỏ thêm (P09–P13) cùng nguyên nhân B7, chứng minh B7 là lỗi chung chứ không riêng id 99999. P13 (`1 OR 1=1`) trả `{}` nên route chi tiết sản phẩm **không** bị SQL injection; lỗi injection nằm ở tham số `?search=` (B17).
- **Baseline:** `baselines/*.json` lưu danh sách test đỏ đã biết; `npm run test:baseline` báo "lỗi mới" (hồi quy) hoặc "đã hết lỗi" (đã sửa).
- **Chứng minh cốt lõi của Data-driven:** thêm ca test chỉ là thêm dòng CSV, không sửa code (commit chỉ đổi file CSV, ảnh E-DD-12).

### 2.3. Nghiên Cứu & Thực Nghiệm AI Agent

#### 2.3.1. Thí nghiệm AI sinh Postman test (Gemini 3.1 Pro, 16/10/2026)
- Đánh giá khả năng phân tích `openapi.yaml` và sinh Postman test script. Hai điều kiện, cùng mô hình, chat tạm thời (tắt tìm web và bộ nhớ): **A** prompt không ràng buộc; **B** prompt có kèm SRS (mã FR/SEC) và dữ liệu mẫu. Chấm theo 30 mục (B1–B29 và O2): `D` phát hiện, `L` có test liên quan nhưng không đỏ, `K` không có test.

| Chỉ số | A | B |
|---|---|---|
| Số lượt hỏi để có đủ code | 1 | 2 |
| Số test sinh ra (`pm.test`) | 29 (chạy ra 30) | 18 (chạy ra 19) |
| Kết quả chạy | 30 đạt, 0 đỏ | 7 đạt, 12 đỏ |
| Phát hiện (D) | 0 | 7 (B5, B6, B9, B10, B13, B15, B21) |
| Bỏ lọt (L) | 8 | 5 (B14, B17, B22, B23, B27) |
| Không có test (K) | 22 | 18 |
| Test đỏ báo động giả | 0 | 1 (T13) |
| Lỗi script của AI | 0 | 0 |
| Lỗi thật ngoài 30 mục | 0 | 4 (B30–B33) |

- **A rộng nhưng nông:** phủ gần hết endpoint nhưng mọi assertion chỉ là `status == 200`, nên 30/30 xanh và phát hiện 0 lỗi (còn khóa chặt lỗi B13, B19, B26 vào assertion).
- **B sâu nhưng hẹp:** nhờ SRS và dữ liệu mẫu nên sinh được ca phân quyền, IDOR, mass assignment, thao túng giá, state machine; nhưng bỏ hẳn giỏ hàng, danh mục, chi tiết sản phẩm nên không bắt được B18, B19, B20, B25.
- **Bốn lỗi mới nhờ B (đã kiểm chứng bằng gọi trực tiếp):** B30 (không kiểm tra số điện thoại), B31 (giá âm), B32 (import không rollback), B33 (admin tự xóa được mình).
- **Rủi ro của AI:** bảng phủ nói nhiều hơn code (liệt kê T01–T28, "phủ 100%" nhưng code chỉ có 18 test); test xanh giả (T07 SQL injection, T03 khóa tài khoản); một test đỏ giả (T13); test có tác hại (T05 biến tài khoản seed thành admin, T18 xóa tài khoản admin) nên phải khởi động lại server sau mỗi lần chạy.
- **Cả hai bỏ sót:** cấu trúc phản hồi (lộ `password`, `price` sai kiểu), công thức và biên (giảm giá %, đúng ngưỡng), id không tồn tại (404), phân quyền toàn diện, trạng thái sau thao tác (giỏ sau checkout, hồ sơ sau PUT một phần).
- **Giới hạn:** mỗi điều kiện chỉ sinh một lần với một mô hình. Lợi thế của B đến từ cách ra yêu cầu chứ không chỉ từ SRS (spec đã khai báo sẵn 401/403/404/400 mà A vẫn không sinh test nào cho các mã này).

#### 2.3.2. Đánh giá skill `api-test-design` với Karate (run-01-coupon, FR-09, 23/10/2026)
- **Thiết lập:** Antigravity, mô hình Gemini 3.8 Flash, Karate 1.5.2, Java 17, Windows. Workflow năm pha có hai điểm dừng cho người (duyệt matrix, ra lệnh "chạy"). Phạm vi: `POST /api/apply-coupon`, `GET /api/coupons`, `POST /api/coupon-usage`. Tổng thời gian 10'32''.
- **Kết quả:** agent rút 11 quy tắc, đề xuất 13 ca (người duyệt giữ nguyên cả 13). Karate chạy 13 scenario trong 655 ms: 8 đạt, 5 đỏ.

| Ca đỏ | Loại | Mã lỗi |
|---|---|---|
| AC01 (giảm giá % sai: -9.000.000 thay vì 100.000) | Lỗi hệ thống | B4 |
| AC03 (400 tại đúng ngưỡng 300.000) | Lỗi hệ thống | B14 |
| AC07 (200 khi không có token) | Lỗi hệ thống | B26 |
| AC11 (user thường xem được `GET /api/coupons`) | Lỗi hệ thống | B24 |
| AC10 (giới hạn lượt dùng) | Lỗi script của AI (`user_id: u.id`, cần `'#(u.id)'`); đã xác nhận bằng Postman, chưa chạy lại Karate | liên quan B23 |

- **So với Postman:** bắt được 4/5 lỗi đã biết của ba endpoint (chưa bắt được B23), không có lỗi mới.
- **Đối chiếu lại bằng collection Postman riêng cho FR-09 (23/10/2026):** collection một request, bấm Send chạy đủ 13 ca AC01 đến AC13 với cùng dữ liệu. Kỳ vọng chỉ lấy từ SRS và OpenAPI; ca tài liệu không nêu thông báo lỗi (AC07, AC08, AC09, AC10) chỉ kiểm mã trạng thái và `error` là chuỗi. Kết quả 9 đạt, 4 đỏ (AC01, AC03, AC07, AC11), **khớp Karate ở 12/13 ca**:

| ID | Karate | Postman | Khớp |
|---|---|---|---|
| AC01, AC03, AC07, AC11 | Đỏ | Đỏ (B4, B14, B26, B24) | Khớp |
| AC02, AC04, AC05, AC06, AC08, AC09, AC12, AC13 | Đạt | Đạt | Khớp |
| AC10 | Đỏ | Đạt | **Lệch** (lỗi script Karate) |

- **Ý nghĩa:** bốn lỗi hệ thống thật có hai bằng chứng độc lập. AC10: với `user_id` đúng, backend trả 400 đúng SRS C5, xác nhận chẩn đoán lỗi script trong `result.md`; cần sửa thành `'#(u.id)'` và chạy lại Karate. AC09 vẫn đáng ngờ: cần xem thông báo `error` thật trong Postman Console để biết 400 đến từ nhánh nào.
- **Điểm mạnh:** giữ đúng quy trình và điểm dừng, không sửa assertion cho xanh; truy vết 13/13 ca; theo SRS khi mâu thuẫn với OpenAPI; kỳ vọng số tiền tính theo công thức SRS.
- **Vấn đề:** agent đọc `server.js` chín lần nên kỳ vọng không hoàn toàn từ SRS/OpenAPI (chuỗi lỗi của AC08, AC10 không có trong tài liệu); lỗi script AC10 lọt qua `check_coverage.py` và bước duyệt; bỏ sót ca "bỏ trường tùy chọn" nên không bắt được B23; kiểm chứng ca đỏ bằng API trực tiếp chưa đủ; `result.md` gắn nhầm nhãn `HT-mới`; AC09 xanh đáng ngờ.
- **Hạn chế:** một lần chạy, một mô hình, một phạm vi; ba trong bốn lỗi bắt được (B4, B14, B26) trùng với ví dụ `coupon.feature` của chính skill, chỉ B24 nằm ngoài ví dụ.
- **Đề xuất:** ghi rõ kỳ vọng chỉ lấy từ SRS và OpenAPI; kiểm tra matrix khớp feature; cấm biến trần trong thân JSON; bảng kiểm cho người duyệt; yêu cầu bằng chứng cho cột "Đã kiểm chứng"; chạy lặp ba lần và thêm một mô hình khác; đổi sang phạm vi không trùng ví dụ (ví dụ FR-10).

---

## 3. Danh Sách Lỗi EShop Phát Hiện (B1–B33, O2)

Mức độ: C = Cao, TB = Trung bình, T = Thấp. Chi tiết request chứng minh, kỳ vọng và thực tế: `Postman_Test_Report.md` mục 6.

| ID | Lỗi | Mức |
|---|---|---|
| B1 | Đăng nhập trả `password` dạng chữ thường | C |
| B2 | Hồ sơ cá nhân lộ `password` và `reset_token` | C |
| B3 | `price` trả chuỗi ở một số sản phẩm (id chẵn) | TB |
| B4 | Tính giảm giá phần trăm sai | C |
| B5 | User thường gọi được API quản trị `admin/users` | C |
| B6 | Xem chi tiết đơn không cần đăng nhập, xem được đơn người khác | C |
| B7 | Sản phẩm không tồn tại trả 200 `{}` | T |
| B8 | Thêm, sửa, xóa sản phẩm không cần đăng nhập | C |
| B9 | Đăng ký chấp nhận email đã tồn tại | TB |
| B10 | Đăng ký không kiểm tra dữ liệu (body rỗng, mật khẩu yếu, email sai) | TB |
| B11 | Thêm sản phẩm, danh mục, mã giảm giá không kiểm tra dữ liệu | TB |
| B12 | Sửa, xóa tài nguyên không tồn tại vẫn báo thành công | T |
| B13 | Checkout không kiểm tra giỏ hàng và tổng tiền | C |
| B14 | Mã giảm giá từ chối đơn đúng bằng mức tối thiểu (`>` thay vì `>=`) | TB |
| B15 | User tự đổi `role` thành admin qua `PUT /users/me` | C |
| B16 | Cập nhật hồ sơ xóa trường không gửi | TB |
| B17 | Tìm kiếm sản phẩm bị SQL injection | C |
| B18 | Giỏ hàng nhận body bất kỳ | T |
| B19 | Giỏ hàng tin giá do client gửi | TB |
| B20 | Giỏ hàng không bị xóa sau checkout | TB |
| B21 | User hủy được đơn đang `shipping` | TB |
| B22 | Admin chuyển được đơn `canceled` sang `delivered` | TB |
| B23 | Bỏ `user_id` để qua mặt giới hạn lượt dùng mã | TB |
| B24 | API quản trị (danh mục, mã giảm giá, đơn, import, xóa user) không kiểm tra `role` | C |
| B25 | Thêm cùng sản phẩm tạo dòng mới trong giỏ | T |
| B26 | `apply-coupon` không yêu cầu đăng nhập (spec và SRS mâu thuẫn) | TB |
| B27 | Khóa tài khoản sai ngưỡng (lần 2, 3 phút; SRS: lần 3, 30 giây) | T |
| B28 | OTP đặt lại mật khẩu chỉ 4 chữ số (SRS: 6) | TB |
| B29 | Tạo mã giảm giá trùng `code` trả 500, lộ lỗi cơ sở dữ liệu | T |
| B30 | Hồ sơ không kiểm tra số điện thoại | T |
| B31 | Thêm sản phẩm chấp nhận giá âm | TB |
| B32 | Import không rollback, không kiểm tra giá | TB |
| B33 | Admin xóa được chính tài khoản đang đăng nhập | TB |
| O2 | JWT không có `exp` (ghi nhận) | — |

---

## 4. Hướng Dẫn Thực Thi Bằng Lệnh (Command Guide)

Yêu cầu: Node.js 18 trở lên, đã `npm install` trong thư mục `backend` của `eshop-sut` và trong `api-tests`, cổng 3000 trống (không bật `node server.js` bằng tay khi dùng script).

```powershell
# Chạy theo script của nhóm (tự bật server EShop mới, chạy Newman, xuất báo cáo, tắt server)
cd deliverables/05-management/weekly-reports/week-05/Ha-Quoc-Kien/api-tests
npm install
$env:ESHOP_BACKEND_DIR = "C:\duong\dan\eshop-sut\backend"

npm run test:login       # Data-driven đăng nhập, đọc data/login_data.csv
npm run test:products    # Data-driven chi tiết sản phẩm, đọc data/product_ids.csv
npm run test:full        # toàn bộ collection v3 (68 request)
npm run test:allin1      # bộ test tổng hợp (118 assertion)
npm run test:baseline    # so với danh sách lỗi đã biết
```

Chạy tay một thư mục Data-driven bằng Newman (server đã chạy sẵn ở cổng 3000):

```bash
newman run collections/eshop_api_postman_collection_v3.json \
  --folder "DataDriven - Login" \
  -d data/login_data.csv \
  --reporters cli,html \
  --reporter-html-export reports/login.html
```

Lưu ý: không dùng `-d login_data.csv` với `eshop_api_all_tests.postman_collection.json`, vì bộ test tổng hợp chỉ có một request không dùng biến `dd_*`. Bộ này chạy bằng `newman run collections/eshop_api_all_tests.postman_collection.json` hoặc bấm Send ở request `00 RUN ALL` trong Postman (kỳ vọng 62 đạt, 56 đỏ). Muốn chạy lại từ đầu, khởi động lại server để reset dữ liệu.

Báo cáo nằm trong `reports/` (`<suite>.html` mở bằng trình duyệt, `<suite>.json` là dữ liệu thô).

Chạy Karate (đánh giá skill FR-09, Windows PowerShell):

```powershell
java -cp "karate-1.5.2.jar;." com.intuit.karate.Main -t "~@slow" -o ../executions/run-01-coupon/report ../executions/run-01-coupon/features
```

Chạy collection đối chiếu FR-09 (khởi động lại server trước; hoặc bấm Send ở request `00 RUN FR-09 (AC01-AC13)` trong Postman, kỳ vọng 9 đạt, 4 đỏ):

```bash
newman run eshop_fr09_coupon_karate_crosscheck.postman_collection.json
```

---

## 5. Tệp Liên Quan

| Tệp | Nội dung |
|---|---|
| `Postman_Test_Report.md` | Báo cáo chi tiết phần Postman (38 request chính, Errors, bộ test tổng hợp, B1–B33) |
| `report.md` | Báo cáo tổng kết Data-driven bằng CSV với Newman |
| `README.md` (gói `api-tests`) | Hướng dẫn chạy Newman |
| `AI_Run_Log.md` | Nhật ký thí nghiệm AI sinh test, điều kiện A và B |
| Báo cáo đánh giá skill `api-test-design` (run-01-coupon, FR-09) | Đánh giá workflow Karate, gồm mục 5.5 đối chiếu bằng Postman |
| `eshop_fr09_coupon_karate_crosscheck.postman_collection.json` | Collection Postman một request chạy 13 ca AC01 đến AC13 để đối chiếu với Karate |
| `evidence/data-driven/` | 14 ảnh minh chứng Data-driven (E-DD-13, E-DD-14: [điền theo ảnh thực tế]) |

---

## 6. Bài Học Rút Ra
- **Mã trạng thái không đủ:** mọi lỗi lệch đặc tả đều trả HTTP 200, nên phải có assertion theo nội dung và theo SRS (không lộ `password`, `price` là số, đúng công thức giảm giá, đúng quyền).
- **Data-driven:** một request cộng một file CSV thay được hàng chục request; dòng biên cho thấy phạm vi thật của một lỗi (B7 không chỉ id 99999). Với hệ thống có trạng thái (khóa tài khoản), thứ tự dòng quan trọng.
- **AI sinh test:** chất lượng phụ thuộc đầu vào. Cùng mô hình, prompt đơn giản phát hiện 0/30 lỗi, prompt có SRS và dữ liệu mẫu phát hiện 7/30 và thêm 4 lỗi mới. Phải đối chiếu bảng phủ của AI với code thật, vì bảng chỉ là lời khẳng định.
- **Test do AI sinh có thể gây hại:** T05 và T18 biến tài khoản mẫu thành admin hoặc xóa tài khoản admin; nên dùng tài khoản tạm và khởi động lại server sau mỗi lần chạy.
- **Kiểm chứng độc lập:** workflow skill giữ được quy trình và truy vết, nhưng lỗi script (AC10) lọt qua mọi lớp kiểm tra tự động. Chạy lại 13 ca bằng collection Postman cho kết quả khớp 12/13 ca và tách được AC10 là lỗi script, nên mọi ca đỏ của AI nên được kiểm chứng bằng một công cụ khác.
- **Nguồn kỳ vọng:** kỳ vọng phải lấy từ SRS và OpenAPI; ca nào tài liệu không nêu thông báo lỗi chỉ nên kiểm mã trạng thái và `error` là chuỗi, nếu không test sẽ mã hóa hành vi hiện tại của hệ thống.

---

## 7. Hạn Chế Và Việc Còn Lại
- Chạy lại ca AC10 bằng Karate sau khi sửa script (Postman đã xác nhận AC10 là lỗi script); ghi lại thông báo `error` thật của AC09 từ Postman Console; thêm ca "bỏ `user_id`" để bắt B23.
- Chưa kiểm thử: số lượng giỏ hàng âm hoặc 0, `discount_value` âm, giả mạo JWT bằng khóa cứng trong `server.js`, đặt lại mật khẩu yếu, sản phẩm giá 0 hoặc tên quá dài.
- Mâu thuẫn `api_specification.md` và SRS ở `apply-coupon` (có cần đăng nhập hay không): cần hỏi giảng viên.
- Thí nghiệm AI chỉ có một lần sinh, một mô hình cho mỗi điều kiện; kết quả có thể khác khi sinh lại.
- Phiên bản Postman, Node.js, Newman trên máy nhóm: [điền].
