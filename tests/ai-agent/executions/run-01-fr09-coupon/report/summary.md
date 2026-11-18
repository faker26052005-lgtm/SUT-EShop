# Tóm tắt chạy: run-01-fr09-coupon

Tạo tự động bởi `run_karate.py`. Không sửa tay; chạy lại script để làm mới.

## Tổng quan

| Hạng mục | Giá trị |
|---|---|
| Ngày giờ chạy | 2026-11-18 08:20:27 AM |
| Karate | 1.5.2 |
| Lệnh | `java -DbaseUrl=http://localhost:3000 -cp C:\Users\LOQ\CODING\Testing\SUT-EShop\karate\karate-1.5.2.jar;C:\Users\LOQ\CODING\Testing\SUT-EShop\karate;C:\Users\LOQ\CODING\Testing\SUT-EShop\.agents\skills\api-test-design\assets\karate com.intuit.karate.Main -t ~@slow -o executions\run-01-fr09-coupon\report executions\run-01-fr09-coupon\features` |
| Địa chỉ máy chủ | http://localhost:3000 |
| Phạm vi thẻ | bỏ qua @slow |
| Ca đã chạy | 19 |
| Xanh | 13 |
| Đỏ | 6 |
| Ca trong matrix (tổng / Y / S / N / người thêm) | 19 / 13 / 6 / 0 / 0 |

## Danh sách ca

| ID | Kết quả | Tên |
|---|---|---|
| CP01 | ĐỎ | CP01 Áp dụng mã percent SAVE10 thành công (SRS FR-09 R01, R10) |
| CP02 | xanh | CP02 Áp dụng mã fixed BIGBUY thành công (SRS FR-09 R02, R10) |
| CP03 | ĐỎ | CP03 Áp dụng mã SAVE10 đúng ngưỡng tối thiểu 300.000₫ (SRS FR-09 C3 R03) |
| CP04 | ĐỎ | CP04 Áp dụng mã BIGBUY đúng ngưỡng tối thiểu 500.000₫ (SRS FR-09 C3 R03) |
| CP05 | xanh | CP05 Áp dụng mã SAVE10 dưới ngưỡng tối thiểu (total 299.999₫) bị từ chối (SRS FR-09 C3, OpenAPI R04) |
| CP06 | xanh | CP06 Áp dụng mã BIGBUY dưới ngưỡng tối thiểu (total 499.999₫) bị từ chối (SRS FR-09 C3, OpenAPI R04) |
| CP07 | xanh | CP07 Áp dụng mã EXPIRED đã hết hạn bị từ chối 400 (SRS FR-09 C2, OpenAPI R05) |
| CP08 | xanh | CP08 Áp dụng mã không tồn tại KHONGTONTAI bị từ chối 404 (SRS FR-09 C1, OpenAPI R06) |
| CP09 | ĐỎ | CP09 Áp dụng mã khi không gửi token bị từ chối 401 (SRS FR-09 C4, OpenAPI R08) |
| CP10 | xanh | CP10 Giới hạn số lượt dùng mã VIP100 của người dùng (SRS FR-09 C5 R09a, R09b, R09c) |
| CP11 | xanh | CP11 Thiếu trường code trong body bị từ chối 400 (OpenAPI R11) |
| CP12 | xanh | CP12 Thiếu trường total_amount trong body bị từ chối 400 (OpenAPI R12) |
| CP13 | xanh | CP13 Body rỗng {} khi áp dụng coupon bị từ chối 400 (OpenAPI R13) |
| CP14 | ĐỎ | CP14 total_amount là số âm (-50000) bị từ chối 400 (OpenAPI R14) |
| CP15 | xanh | CP15 total_amount là chuỗi không phải số 'abc' bị từ chối 400 (OpenAPI R15) |
| CP16 | xanh | CP16 Ghi nhận lượt sử dụng coupon hợp lệ thành công (OpenAPI R16) |
| CP17 | xanh | CP17 Gọi POST /api/coupon-usage không có token bị từ chối 401 (OpenAPI R17) |
| CP18 | xanh | CP18 Gọi POST /api/coupon-usage với token sai định dạng bị từ chối 403 (OpenAPI R18) |
| CP19 | ĐỎ | CP19 Gọi POST /api/coupon-usage thiếu coupon_id trong body bị từ chối 400 (OpenAPI R19) |

## Ca đỏ (nguyên văn từ Karate)

### CP01: CP01 Áp dụng mã percent SAVE10 thành công (SRS FR-09 R01, R10)

```
match failed: EQUALS
  $ | not equal (NUMBER:NUMBER)
  -4500000
  50000

executions/run-01-fr09-coupon/features/coupon.feature:17
```

### CP03: CP03 Áp dụng mã SAVE10 đúng ngưỡng tối thiểu 300.000₫ (SRS FR-09 C3 R03)

```
status code was: 400, expected: 200, response time in milliseconds: 6, url: http://localhost:3000/api/apply-coupon, response: 
{"error":"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"}
executions/run-01-fr09-coupon/features/coupon.feature:41
```

### CP04: CP04 Áp dụng mã BIGBUY đúng ngưỡng tối thiểu 500.000₫ (SRS FR-09 C3 R03)

```
status code was: 400, expected: 200, response time in milliseconds: 5, url: http://localhost:3000/api/apply-coupon, response: 
{"error":"Đơn hàng chưa đủ giá trị tối thiểu 500,000 ₫ để áp dụng mã này"}
executions/run-01-fr09-coupon/features/coupon.feature:52
```

### CP09: CP09 Áp dụng mã khi không gửi token bị từ chối 401 (SRS FR-09 C4, OpenAPI R08)

```
status code was: 200, expected: 401, response time in milliseconds: 4, url: http://localhost:3000/api/apply-coupon, response: 
{"success":true,"coupon_id":1,"discount_amount":-4500000,"final_amount":5000000,"message":"Áp dụng thành công! Giảm 10%"}
executions/run-01-fr09-coupon/features/coupon.feature:99
```

### CP14: CP14 total_amount là số âm (-50000) bị từ chối 400 (OpenAPI R14)

```
match failed: EQUALS
  $ | not equal (NUMBER:NUMBER)
  200
  400

executions/run-01-fr09-coupon/features/coupon.feature:193
```

### CP19: CP19 Gọi POST /api/coupon-usage thiếu coupon_id trong body bị từ chối 400 (OpenAPI R19)

```
status code was: 200, expected: 400, response time in milliseconds: 7, url: http://localhost:3000/api/coupon-usage, response: 
{"message":"Usage recorded"}
executions/run-01-fr09-coupon/features/coupon.feature:240
```

## Chưa chạy

Không có. Mọi ca Y hoặc S đều đã chạy.
