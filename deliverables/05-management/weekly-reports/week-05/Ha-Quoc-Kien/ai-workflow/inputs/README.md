# Tài liệu đầu vào

Agent phải đọc **cả ba** tệp này trước khi làm việc:

| Tệp | Nội dung | Vai trò |
|---|---|---|
| `srs.md` | Đặc tả nghiệp vụ (FR, SEC) | **Nguồn chuẩn** để viết kết quả mong đợi |
| `openapi.yaml` | Đặc tả kỹ thuật (endpoint, dữ liệu gửi nhận) | Tham chiếu; thua SRS khi mâu thuẫn |
| `sample-data.md` | Tài khoản, sản phẩm, mã giảm giá có sẵn | Dữ liệu duy nhất được dùng |

Nếu bạn có bản SRS hoặc OpenAPI mới hơn, chép đè vào đây.
