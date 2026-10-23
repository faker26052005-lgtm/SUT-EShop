# Dữ liệu mẫu có sẵn trong EShop (sau khi khởi động máy chủ mới)

Chỉ dùng những dữ liệu này. Không tự bịa tài khoản, id hay mã giảm giá.

## Tài khoản

| Vai trò | Email | Mật khẩu | id |
|---|---|---|---|
| admin | admin@eshop.com | Admin123! | 1 |
| user | test@eshop.com | Test1234! | 2 |

Hai tài khoản này là **dữ liệu mẫu dùng chung**: không xóa, không đổi quyền, không đổi mật khẩu. Ca nào cần thao tác như vậy thì tạo tài khoản tạm bằng `POST /api/register` với email duy nhất.

## Sản phẩm (id 1 đến 5)

| id | Tên | Giá | category_id |
|---|---|---|---|
| 1 | iPhone 15 Pro Max | 30.000.000 | 1 |
| 2 | Samsung Galaxy S24 Ultra | 28.000.000 | 1 |
| 3 | MacBook Pro M3 | 45.000.000 | 2 |
| 4 | Tai nghe AirPods Pro 2 | 6.000.000 | 3 |
| 5 | Bàn phím cơ Keychron Q1 | 4.000.000 | 3 |

## Danh mục (id 1 đến 3)

1 Điện thoại, 2 Laptop, 3 Phụ kiện.

## Mã giảm giá

| Mã | Loại | Giá trị | Đơn tối thiểu | Hạn dùng | Số lần mỗi người |
|---|---|---|---|---|---|
| SAVE10 | percent | 10 | 300.000 | 2099-12-31 | 1 |
| BIGBUY | fixed | 50.000 | 500.000 | 2099-12-31 | 1 |
| VIP100 | fixed | 100.000 | 300.000 | 2099-12-31 | 2 |
| EXPIRED | percent | 20 | 100.000 | 2020-01-01 | 1 |
