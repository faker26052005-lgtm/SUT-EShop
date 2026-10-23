# Chạy Test API EShop Bằng Newman (Data-driven bằng CSV)

Thư mục này chạy các bộ test Data-driven của nhóm bằng **Newman** (công cụ dòng lệnh của Postman) và xuất báo cáo HTML. Mỗi lần chạy, script tự khởi động server EShop mới (dữ liệu sạch), chạy test, rồi tắt server.

Lý do dùng Newman: Collection Runner của Postman bị khóa ở gói miễn phí, còn `newman run ... -d file.csv` làm đúng việc đó.

## 1. Có gì trong thư mục

| Đường dẫn | Nội dung |
|---|---|
| `collections/eshop_api_postman_collection_v3.json` | Collection chính (68 request, JSON Schema), gồm cả hai thư mục Data-driven `DataDriven - Login` và `DataDriven - Products` |
| `collections/eshop_api_all_tests.postman_collection.json` | Bộ test tổng hợp (một request `00 RUN ALL`, 118 assertion). Chưa có thì suite `allin1` tự bị bỏ qua |
| `data/login_data.csv` | 15 dòng đăng nhập (mỗi dòng là một lần lặp) |
| `data/product_ids.csv` | 14 dòng xem chi tiết sản phẩm |
| `baselines/*.json` | Danh sách test đỏ đã biết của từng suite (các lỗi của EShop) |
| `scripts/run-newman.js` | Script chạy |
| `reports/` | Báo cáo (tự tạo khi chạy, không đưa lên git) |

Suite nào thiếu file collection hoặc file dữ liệu thì `npm test` tự bỏ qua kèm thông báo.

## 2. Yêu cầu

- Node.js từ 18 trở lên (`node -v`).
- Repo EShop (`https://github.com/ttbhanh/eshop-sut`) đã tải về, đã chạy `npm install` trong thư mục `backend` của nó.
- Cổng 3000 trống. Đừng bật `node server.js` bằng tay khi chạy script.

## 3. Cài đặt (một lần)

PowerShell, trong thư mục `api-tests`:

```
npm install
```

## 4. Chỉ đường dẫn backend

```
$env:ESHOP_BACKEND_DIR = "C:\duong\dan\toi\eshop-sut\backend"
```

Đặt một lần cho mỗi cửa sổ PowerShell. Nếu `eshop-sut` nằm ngay cạnh `api-tests` thì không cần làm gì.

## 5. Cách chạy

| Lệnh | Việc làm |
|---|---|
| `npm run test:login` | Data-driven đăng nhập, đọc `data/login_data.csv` |
| `npm run test:products` | Data-driven chi tiết sản phẩm, đọc `data/product_ids.csv` |
| `npm run test:full` | Toàn bộ collection v3 (68 request) |
| `npm run test:allin1` | Bộ test tổng hợp (118 assertion) |
| `npm test` | Chạy mọi suite có đủ file |
| `npm run test:baseline` | Chạy và so với danh sách lỗi đã biết |
| `npm run baseline:update` | Ghi lại danh sách lỗi đã biết (chỉ khi đã hiểu vì sao kết quả đổi) |

Nếu PowerShell làm rối dấu `--`, gọi thẳng: `node scripts/run-newman.js login --backend "C:\...\backend"`.

## 6. Kết quả kỳ vọng

Đã chạy thử với Node 22 và Newman 6 trên Linux, trên bản mã nguồn EShop tại thời điểm viết hướng dẫn. Test đỏ là lỗi của EShop, không phải lỗi bộ test.

| Suite | Số request | Số lần lặp | Số assertion | Số đỏ | Đỏ là gì |
|---|---|---|---|---|---|
| `login` | 15 | 15 | 45 | 4 | B1 ở bốn dòng đăng nhập thành công (L01, L02, L04, L15): response lộ `password` |
| `products` | 14 | 14 | 26 | 10 | B3 ở P02, P04 (`price` là chuỗi); B7 ở P06 đến P13 (id không tồn tại hoặc không hợp lệ vẫn trả 200) |
| `full` | 68 | 1 | 131 | 18 | Các lỗi đã biết trong collection v3 |
| `allin1` | 202 | 1 | 118 | 56 | B1 đến B33 và O2 (cần có file bộ test tổng hợp; đã chạy trên Windows ngày 23/10/2026, khớp bảng) |

Báo cáo nằm trong `reports/`: `<suite>.html` (mở bằng trình duyệt, dùng làm ảnh minh chứng) và `<suite>.json` (dữ liệu thô).

## 7. Cách Data-driven hoạt động

- Newman chạy request **một lần cho mỗi dòng CSV**. Tên cột trở thành biến lặp, đọc bằng `pm.iterationData.get("dd_email")`.
- Login: body là `{"email":"{{dd_email}}","password":"{{dd_password}}"}`. Script Tests đọc `dd_case`, `dd_expected_status`, `dd_expected_error` bằng `pm.variables.get`.
- Products: URL là `{{baseUrl}}/api/products/{{dd_id}}`. Script Tests so với `dd_expected_status` và `dd_name_contains`.
- Mỗi dòng login có 3 assertion (200: mã, có token và user, không lộ password; lỗi: mã, thông điệp lỗi, không trả token). Products: dòng 200 có 3 assertion (mã, schema sản phẩm có `price` là số, tên), dòng 404 có 1 assertion (mã).
- Vì giá trị CSV được chèn thẳng vào body JSON, đừng để ký tự `"` hoặc `\` trong `dd_email` và `dd_password`; cần thì dùng pre-request script dựng body bằng `JSON.stringify`.
- Kết quả mong đợi theo **SRS và OpenAPI**, không theo hành vi hiện tại của hệ thống.

## 8. Thêm hoặc sửa dữ liệu

Lưu CSV bằng UTF-8, giữ dòng tiêu đề, giá trị có dấu phẩy hoặc khoảng trắng đầu/cuối thì bọc dấu nháy kép.

`login_data.csv`: `dd_case, dd_email, dd_password, dd_expected_status, dd_expected_error`
`product_ids.csv`: `dd_case, dd_id, dd_expected_status, dd_name_contains`

Lưu ý:
- Mỗi lần sai mật khẩu làm tăng bộ đếm khóa của tài khoản. Với đăng nhập sai, dùng email không tồn tại; chỉ để tối đa một dòng sai mật khẩu trên tài khoản thật, rồi đặt ngay một dòng đăng nhập đúng sau đó.
- Sau khi sửa CSV, chạy lại suite tương ứng; nếu số test đỏ đổi có chủ đích thì `npm run baseline:update`.

## 9. Lỗi thường gặp

| Hiện tượng | Cách xử lý |
|---|---|
| `Không tìm thấy server.js trong ...` | Sai đường dẫn backend (`ESHOP_BACKEND_DIR` hoặc `--backend`) |
| `Cổng 3000 đang có server chạy` | Tắt cửa sổ `node server.js`, chạy lại |
| `Server không khởi động được sau 20 giây` | Chưa `npm install` trong backend của EShop, hoặc Node quá cũ |
| `Cannot find module 'newman'` | Chưa `npm install` trong `api-tests` |
| Số test đỏ khác bảng mục 6 | Mã nguồn EShop khác; chạy `--baseline` xem test nào lệch |
| `Suite "..." thiếu file collection hoặc file dữ liệu` | Thiếu file trong `collections/` hoặc `data/` |

## 10. Ghi chú cho người sửa tiếp

- Suite khai báo ở đầu `scripts/run-newman.js` (mục `SUITES`): tên, collection, thư mục (`folder`), file dữ liệu (`data`).
- Khi sửa collection trong Postman, export lại và chép đè vào `collections/`.
