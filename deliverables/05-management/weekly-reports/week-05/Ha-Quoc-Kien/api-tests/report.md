# Báo cáo tổng kết: Data-driven bằng CSV với Newman (EShop)

> **Phạm vi:** phần việc Data-driven của nhóm trong seminar T06 (API & Contract Testing), thuộc nhóm nhiệm vụ [Postman/Newman].
> **Hệ thống kiểm thử (SUT):** EShop (`ttbhanh/eshop-sut`), Base URL `http://localhost:3000`.
> **Nguồn chuẩn để viết kết quả mong đợi:** tài liệu đặc tả yêu cầu hệ thống (SRS)

---

## 1. Mục tiêu

1. Có một cách kiểm thử **Data-driven** rõ ràng: một request, nhiều bộ dữ liệu đọc từ file CSV.
2. Chạy được bằng **Newman** và xuất **báo cáo HTML** làm minh chứng.
3. Mở rộng được dữ liệu mà **không sửa code**, chỉ thêm dòng vào CSV.
4. Có **baseline** (danh sách lỗi đã biết) để phát hiện hồi quy.

## 2. Data-driven và lý do dùng Newman

Thay vì viết nhiều request giống nhau, ta viết một request dùng biến như `{{dd_email}}`, rồi đưa một file CSV vào. Newman chạy request đó một lần cho mỗi dòng CSV; mỗi dòng còn mang theo kết quả mong đợi (`dd_expected_status`, ...) để assertion so với dữ liệu của chính dòng đó.

Collection Runner của Postman bị khóa ở gói miễn phí, nên nhóm dùng Newman (`newman run ... -d file.csv`), thực hiện đúng việc đó từ dòng lệnh.

Ghi chú cho buổi thuyết trình: giảng viên đã cho phép tìm cách khác khi một chức năng bị khóa trả phí; nhóm sẽ trình bày lại việc dùng Newman thay cho Collection Runner khi thuyết trình.

## 3. Cấu trúc gói `api-tests/`

| Đường dẫn | Nội dung |
|---|---|
| `collections/eshop_api_postman_collection_v3.json` | Collection chính (68 request, có JSON Schema), gồm hai thư mục `DataDriven - Login` và `DataDriven - Products` |
| `collections/eshop_api_all_tests.postman_collection.json` | Bộ test tổng hợp (một request, 118 assertion) |
| `data/login_data.csv`, `data/product_ids.csv` | Dữ liệu cho Data-driven |
| `baselines/*.json` | Danh sách test đỏ đã biết của từng suite |
| `scripts/run-newman.js` | Script chạy: tự bật server EShop mới (dữ liệu sạch) cho mỗi suite, chạy Newman, xuất báo cáo, tắt server |
| `reports/` | Báo cáo HTML và JSON (tự sinh, không đưa lên git) |

## 4. Thiết kế dữ liệu

### 4.1. Đăng nhập (`login_data.csv`, 15 dòng)

Cột: `dd_case, dd_email, dd_password, dd_expected_status, dd_expected_error`.

| Dòng | Mục đích | Kết quả mong đợi |
|---|---|---|
| L01 | User hợp lệ | 200 |
| L02 | Admin hợp lệ | 200 |
| L03 | Sai mật khẩu (một lần) | 401 |
| L04 | User hợp lệ sau một lần sai (reset bộ đếm khóa) | 200 |
| L05 | Email không tồn tại | 401 |
| L06 | Mật khẩu rỗng (email không tồn tại) | 401 |
| L07 | Email rỗng | 401 |
| L08 | Chuỗi SQL injection ở email | 401 |
| L09 | Email rất dài (250 ký tự) | 401 |
| L10 | Email thiếu `@` | 401 |
| L11 | Email thiếu tên miền | 401 |
| L12 | Email có khoảng trắng đầu | 401 |
| L13 | Chuỗi XSS ở email | 401 |
| L14 | Mật khẩu sai chữ hoa chữ thường (một lần sai trên tài khoản thật) | 401 |
| L15 | User hợp lệ ngay sau L14 (reset bộ đếm khóa) | 200 |

Mỗi dòng có 3 assertion:
- Dòng 200: mã trạng thái; có token và đúng người dùng; response không lộ `password`.
- Dòng lỗi: mã trạng thái; thông điệp lỗi đúng; không trả token.

### 4.2. Chi tiết sản phẩm (`product_ids.csv`, 14 dòng)

Cột: `dd_case, dd_id, dd_expected_status, dd_name_contains`.

| Dòng | Mục đích | Kết quả mong đợi |
|---|---|---|
| P01 đến P05 | Năm sản phẩm hợp lệ (iPhone, Samsung, MacBook, AirPods, Keychron) | 200 |
| P06 | Id không tồn tại (99999) | 404 |
| P07 | Id âm (-1) | 404 |
| P08 | Id không phải số (`abc`) | 404 |
| P09 | Id bằng 0 | 404 |
| P10 | Id ngay sau id cuối (6) | 404 |
| P11 | Id số thập phân (1.5) | 404 |
| P12 | Id rất lớn (99999999999) | 404 |
| P13 | Id chứa SQL (`1 OR 1=1`) | 404 |
| P14 | Id biên dưới hợp lệ (1), dòng đối chứng | 200 |

Dòng 200 có 3 assertion (mã trạng thái; schema sản phẩm với `price` là số; tên chứa chuỗi mong đợi). Dòng 404 có 1 assertion (mã trạng thái).

### 4.3. Nguyên tắc đã áp dụng

- Kết quả mong đợi viết theo **SRS**. Test đỏ nghĩa là hệ thống sai so với SRS; không sửa assertion cho "xanh".
- Đăng nhập sai trên tài khoản thật chỉ để **một lần**, rồi ngay sau đó là một dòng đăng nhập đúng, vì sai hai lần liên tiếp sẽ khóa tài khoản (L03 rồi L04; L14 rồi L15).
- Các ca đăng nhập sai khác dùng email không tồn tại để không ảnh hưởng bộ đếm khóa.
- Không đưa ký tự `"` hoặc `\` vào `dd_email`, `dd_password` vì giá trị được chèn thẳng vào body JSON. Giá trị có khoảng trắng đầu hoặc cuối phải bọc dấu nháy kép trong CSV (ví dụ L12).
- Đã **bỏ** ý định thêm ca email viết hoa toàn bộ, vì SRS không nói đăng nhập có phân biệt hoa thường hay không, nên chưa có kết quả mong đợi để viết.

## 5. Kết quả

### 5.1. Trước và sau khi mở rộng dữ liệu

| Suite | Lần lặp | Assertion | Đỏ |
|---|---|---|---|
| `login` (bản đầu) | 9 | 27 | 3 |
| `login` (sau khi thêm L10 đến L15) | 15 | 45 | 4 |
| `products` (bản đầu) | 8 | 18 | 5 |
| `products` (sau khi thêm P09 đến P14) | 14 | 26 | 10 |

Kết quả chạy trên máy nhóm khớp với số đã dự kiến ở trên.

### 5.2. Các test đỏ và ý nghĩa

Đỏ là **lỗi của EShop so với SRS**, không phải lỗi bộ test.

| Lỗi | Dòng đỏ | Mô tả |
|---|---|---|
| B1 | L01, L02, L04, L15 | Đăng nhập thành công nhưng response lộ trường `password` của người dùng |
| B3 | P02, P04 | `price` trả về dạng chuỗi thay vì số |
| B7 | P06 đến P13 | Id không tồn tại hoặc không hợp lệ vẫn trả 200 (thân `{}`) thay vì 404 |

Nhận xét:
- Năm dòng đỏ thêm ở products (P09 đến P13) **không phải lỗi mới**: cùng nguyên nhân B7. Giá trị của chúng là chứng minh B7 là lỗi chung (id 0, 6, 1.5, rất lớn đều bị), không riêng id 99999.
- P13 (`1 OR 1=1`) trả `{}` chứ không trả dữ liệu thừa, nên route chi tiết sản phẩm **không bị SQL injection**. Lỗi injection của hệ thống nằm ở tham số `?search=` (B17). Kết luận này do mình kiểm bằng `curl` trên bản clone Linux của EShop.
- Suite `full` (toàn bộ collection v3) cho 68 request, 131 assertion, 18 đỏ, khớp baseline.

### 5.3. Baseline

`baselines/login.json`, `baselines/products.json` (và `full.json`) lưu danh sách tên test đỏ đã biết. Lệnh `npm run test:baseline` so sánh lần chạy với baseline:
- Khớp: không có gì thay đổi.
- Có "lỗi mới": một test vốn xanh nay đỏ (hồi quy).
- Có "đã hết lỗi": một lỗi đã được sửa.

Khi chủ động đổi CSV, số đỏ đổi theo, cần chạy `npm run baseline:update` sau khi đã hiểu vì sao kết quả đổi.

## 6. Cách chạy lại

```
npm install
$env:ESHOP_BACKEND_DIR = "C:\duong\dan\eshop-sut\backend"
npm run test:login
npm run test:products
npm run test:baseline
```

Báo cáo nằm ở `reports/login.html`, `reports/products.html`.

## 7. Minh chứng (14 ảnh)

Thư mục `evidence/data-driven/`.

| Ảnh | Nội dung |
|---|---|
| `E-DD-01_login_csv_vscode.png` | `login_data.csv` trong VS Code |
| `E-DD-02_product_csv_vscode.png` | `product_ids.csv` trong VS Code |
| `E-DD-03_postman_login_body.png` | Body request đăng nhập có `{{dd_email}}`, `{{dd_password}}` |
| `E-DD-04_postman_login_tests.png` | Tab Tests của request đăng nhập |
| `E-DD-05_postman_product_url.png` | URL request sản phẩm có `{{dd_id}}` |
| `E-DD-06_newman_login_terminal.png` | Kết quả `npm run test:login` trong terminal |
| `E-DD-07_newman_products_terminal.png` | Kết quả `npm run test:products` trong terminal |
| `E-DD-08_report_login_tongquan.png` | Báo cáo HTML đăng nhập, trang tổng quan |
| `E-DD-09_report_login_chitiet_L15_L10.png` | Chi tiết một lần lặp đỏ (L15) và một lần xanh (L10) |
| `E-DD-10_report_products_chitiet_P02_P09.png` | Chi tiết P02 (B3) và P09 (B7) |
| `E-DD-11_newman_baseline_khop.png` | `npm run test:baseline` báo khớp |
| `E-DD-12_git_diff_chi_doi_csv.png` | Commit chỉ đổi file CSV |
| `E-DD-13_...` | [điền theo ảnh thực tế] |
| `E-DD-14_...` | [điền theo ảnh thực tế] |

Ảnh 12 là bằng chứng cho điểm cốt lõi của Data-driven: thêm ca test chỉ là thêm dòng dữ liệu, không sửa code.

## 8. Bài học rút ra

Bài học:
- Một request cộng với một file CSV thay được hàng chục request lặp lại; phát hiện thêm lỗi chỉ cần thêm dòng.
- Dòng dữ liệu **biên** (id 0, id ngay sau id cuối, email thiếu `@`) cho thêm bằng chứng về phạm vi của một lỗi.
- Thứ tự dòng quan trọng khi hệ thống có trạng thái (bộ đếm khóa tài khoản).
- Phải dùng kết quả mong đợi theo SRS, nếu không test sẽ xác nhận luôn lỗi của hệ thống.
