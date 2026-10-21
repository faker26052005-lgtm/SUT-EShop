# FR-17: Quản lý Mã Giảm Giá – Mẫu phản hồi API thực tế (Response Samples)

> Được thu thập bằng lệnh HTTP trực tiếp (curl / REST) tới hệ thống SUT (`http://localhost:3000`).

---

## 1. Đăng nhập quản trị viên (Admin Login)
- **Endpoint**: `POST /api/login`
- **Request Body**:
```json
{
  "email": "admin@eshop.com",
  "password": "Admin123!"
}
```
- **Response**: `HTTP 200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@eshop.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

---

## 2. Lấy danh sách mã giảm giá (GET /api/coupons)
- **Endpoint**: `GET /api/coupons`
- **Header**: `Authorization: Bearer <admin_token>`
- **Response**: `HTTP 200 OK`
```json
[
  {
    "id": 1,
    "code": "SAVE10",
    "type": "percent",
    "discount_value": 10,
    "min_order_amount": 300000,
    "expired_at": "2099-12-31",
    "is_active": 1,
    "max_uses_per_user": 1
  },
  {
    "id": 2,
    "code": "BIGBUY",
    "type": "fixed",
    "discount_value": 50000,
    "min_order_amount": 500000,
    "expired_at": "2099-12-31",
    "is_active": 1,
    "max_uses_per_user": 1
  },
  {
    "id": 3,
    "code": "VIP100",
    "type": "fixed",
    "discount_value": 100000,
    "min_order_amount": 300000,
    "expired_at": "2099-12-31",
    "is_active": 1,
    "max_uses_per_user": 2
  },
  {
    "id": 4,
    "code": "EXPIRED",
    "type": "percent",
    "discount_value": 20,
    "min_order_amount": 100000,
    "expired_at": "2020-01-01",
    "is_active": 1,
    "max_uses_per_user": 1
  }
]
```

---

## 3. Tạo mã giảm giá mới (POST /api/admin/coupons)
- **Endpoint**: `POST /api/admin/coupons`
- **Header**: `Authorization: Bearer <admin_token>`
- **Request Body (Hợp lệ)**:
```json
{
  "code": "NEWTEST01",
  "type": "percent",
  "discount_value": 10,
  "min_order_amount": 200000,
  "expired_at": "2099-12-31",
  "max_uses_per_user": 1
}
```
- **Response (Thành công)**: `HTTP 200 OK`
```json
{
  "message": "Coupon created",
  "id": 90
}
```

- **Response khi trùng mã (`code: "SAVE10"`)**: `HTTP 500 Internal Server Error`
```json
{
  "error": "SQLITE_CONSTRAINT: UNIQUE constraint failed: coupons.code"
}
```

- **Response khi thiếu Token**: `HTTP 401 Unauthorized`
```json
{
  "error": "Unauthorized"
}
```

---

## 4. Xóa mã giảm giá (DELETE /api/admin/coupons/:id)
- **Endpoint**: `DELETE /api/admin/coupons/:id`
- **Header**: `Authorization: Bearer <admin_token>`
- **Response (Thành công / ID tồn tại)**: `HTTP 200 OK`
```json
{
  "message": "Coupon deleted"
}
```

- **Response (ID không tồn tại `99999`)**: `HTTP 200 OK` *(thực tế server trả 200 thay vì 404)*
```json
{
  "message": "Coupon deleted"
}
```
