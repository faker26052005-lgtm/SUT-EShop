# Chạy Test API EShop Bằng Newman

Thư mục này chạy tự động các bộ test Postman của nhóm bằng **Newman** (công cụ dòng lệnh của Postman) và xuất báo cáo HTML. Với các lần chạy, script tự khởi động server EShop mới (dữ liệu sạch), chạy test, rồi tắt server.

## 1. Có gì trong thư mục

| Đường dẫn | Nội dung |
|---|---|
| `collections/eshop_api_postman_collection_v3.json` | Collection chính (từng request trong từng thư mục), có JSON Schema và hai thư mục Data-driven |
| `collections/eshop_api_all_tests.postman_collection.json` | Bộ test tổng hợp: một request, 118 assertion |
| `data/login_data.csv`, `data/product_ids.csv` | Dữ liệu cho Data-driven (mỗi dòng là một lần chạy) |
| `baselines/*.json` | Danh sách test đỏ đã biết của từng suite (các lỗi của EShop) |
| `scripts/run-newman.js` | Script chạy |
| `reports/` | Nơi lưu báo cáo (tự tạo, không đưa lên git) |

## 2. Yêu cầu

- Node.js từ phiên bản 18 trở lên (kiểm tra bằng `node -v`).
- Repo hệ thống EShop (`ttbhanh/eshop-sut`) đã được tải về và đã chạy `npm install` trong thư mục `backend` của nó.
- Cổng 3000 trống (script tự chạy server ở cổng này; server của EShop cố định cổng 3000). Đừng bật `node server.js` bằng tay khi chạy script.

## 3. Cài đặt (làm một lần)

Mở PowerShell trong thư mục `api-tests`:

```
npm install
```

## 4. Cách chạy

Chỉ cho script biết thư mục backend của EShop, bằng một trong hai cách:

```
# Cách 1: biến môi trường (PowerShell), đặt một lần cho cửa sổ hiện tại
$env:ESHOP_BACKEND_DIR = "C:\duong\dan\toi\eshop-sut\backend"

# Cách 2: truyền khi chạy
npm test -- --backend "C:\duong\dan\toi\eshop-sut\backend"
```

Nếu thư mục `eshop-sut` nằm ngay cạnh thư mục `api-tests` thì không cần làm gì (script tự thử `../eshop-sut/backend`).

| Lệnh | Việc làm |
|---|---|
| `npm test` | Chạy cả bốn suite lần lượt (mỗi suite trên một server mới) |
| `npm run test:full` | Toàn bộ collection v3 (68 request) |
| `npm run test:login` | Data-driven đăng nhập, đọc `data/login_data.csv` |
| `npm run test:products` | Data-driven chi tiết sản phẩm, đọc `data/product_ids.csv` |
| `npm run test:allin1` | Bộ test tổng hợp (118 assertion) |
| `npm run test:baseline` | Chạy cả bốn suite và so với danh sách lỗi đã biết |
| `npm run baseline:update` | Ghi lại danh sách lỗi đã biết (chỉ dùng khi chủ động đổi test hoặc khi lỗi đã được sửa) |

Muốn chạy một suite kèm tham số, thêm `--` trước tham số, ví dụ: `npm test -- login --backend "C:\...\backend"`. Dùng `--no-server` nếu bạn muốn tự bật server bằng tay (khi đó dữ liệu không được reset tự động).

## 4. Kết quả kỳ vọng

Đây là kết quả khi chạy trên bản mã nguồn EShop tại thời điểm viết hướng dẫn (đã chạy thử trên Linux với Node 22 và Newman 6.2.3; chưa chạy trên Windows). Test đỏ là các lỗi của EShop, không phải lỗi của bộ test.

| Suite | Số request | Số lần lặp | Số assertion | Số đỏ | Đỏ là gì |
|---|---|---|---|---|---|
| `full` | 68 | 1 | 131 | 18 | B1, B2, B3, B4, B5, B6, B7, B8, B28 |
| `login` | 9 | 9 | 27 | 3 | B1 ở ba dòng đăng nhập thành công |
| `products` | 8 | 8 | 18 | 5 | B3 ở id 2 và 4; B7 ở id 99999, -1 và abc |
| `allin1` | 202 | 1 | 118 | 56 | B1 đến B33 và O2 (số request tính cả các lời gọi nội bộ của script) |

Lần chạy kết thúc bằng bảng tổng kết trong terminal. Báo cáo chi tiết nằm trong `reports/`:
- `reports/<suite>.html`: mở bằng trình duyệt, xem từng request, từng lần lặp, từng assertion (dùng làm ảnh minh chứng).
- `reports/<suite>.json`: dữ liệu thô.

## 5. Danh sách lỗi đã biết (baseline)

Vì EShop cố ý có lỗi, kết quả "đỏ" là bình thường. Chế độ `--baseline` so danh sách test đỏ của lần chạy với file trong `baselines/`:
- Khớp: không có gì thay đổi, lệnh kết thúc với mã 0.
- Có "lỗi mới": một test vốn xanh nay đỏ (hồi quy), hoặc bộ test mới thêm; lệnh kết thúc với mã 1 và in tên test.
- Có "đã hết lỗi": một lỗi đã được sửa; cập nhật baseline bằng `npm run baseline:update` sau khi kiểm tra lại.

## 6. Thêm hoặc sửa dữ liệu Data-driven

Mỗi file CSV có một dòng tiêu đề, mỗi dòng sau là một lần chạy. Lưu bằng mã hóa UTF-8.

`login_data.csv`: `dd_case, dd_email, dd_password, dd_expected_status, dd_expected_error`. Ví dụ thêm một dòng: `L10 email có khoảng trắng," test@eshop.com",Test1234!,401,Invalid email or password`.

`product_ids.csv`: `dd_case, dd_id, dd_expected_status, dd_name_contains`.

Lưu ý:
- Mỗi lần sai mật khẩu làm tăng bộ đếm khóa của tài khoản, hai lần liên tiếp sẽ khóa. Với đăng nhập sai, dùng email không tồn tại; chỉ để tối đa một dòng sai mật khẩu trên tài khoản thật, và đặt ngay sau đó một dòng đăng nhập đúng.
- Sau khi sửa CSV, chạy lại suite tương ứng và cập nhật baseline nếu số test đỏ thay đổi có chủ đích.

## 7. Lỗi thường gặp

| Hiện tượng | Cách xử lý |
|---|---|
| `Không tìm thấy server.js trong ...` | Sai đường dẫn backend; kiểm tra `--backend` hoặc `ESHOP_BACKEND_DIR` |
| `Cổng 3000 đang có server chạy` | Tắt server đang chạy (cửa sổ `node server.js`), rồi chạy lại |
| `Server không khởi động được sau 20 giây` | Chưa chạy `npm install` trong thư mục backend của EShop, hoặc Node quá cũ |
| `Cannot find module 'newman'` | Chưa chạy `npm install` trong thư mục `api-tests` |
| Số test đỏ khác bảng ở mục 4 | Mã nguồn EShop khác bản đã dùng; chạy `--baseline` để xem test nào khác, rồi đối chiếu với `Postman_Test_Report.md` |
| Lệnh dừng ngay với mã 2 | Sai tên suite hoặc thiếu tham số; đọc dòng thông báo ở đầu |

## 8. Ghi chú cho người sửa tiếp

- Các suite được khai báo ở đầu `scripts/run-newman.js` (mục `SUITES`): thêm một suite mới bằng cách khai báo tên, collection, thư mục (`folder`) và file dữ liệu (`data`).
- Collection là bản sao của file trong thư mục gốc của nhóm; khi sửa collection trong Postman, nhớ export lại và chép đè vào `collections/`.
- Nếu thành viên phụ trách Newman muốn thay đổi cấu trúc (thêm CI, đổi reporter), chỉ cần sửa `run-newman.js` và `package.json`; các collection và dữ liệu không phải đổi.
