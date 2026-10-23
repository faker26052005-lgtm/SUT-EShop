# Kết quả: run-01-coupon

## 0. Thông tin lần chạy (bắt buộc)

| Mục | Ghi nhận |
|---|---|
| Agent / công cụ | `Antigravity` |
| **Tên và phiên bản mô hình** | `Gemini 3.8 Flash` |
| Ngày giờ | `2026-10-23 19:30:54` |
| Chế độ | `có nạp skill và rule` |
| Phiên bản Karate, hệ điều hành | `Karate 1.5.2, Java 17, Windows (PowerShell)` |
| Tệp hội thoại | `conversation.md` (bắt buộc) |

## 1. Vai trò của người duyệt (human-in-the-loop)

| Chỉ số | Số lượng |
|---|---|
| Ca Agent đề xuất trong matrix | 13 |
| Ca giữ nguyên (Y) | 13 |
| Ca người sửa (S) | 0 |
| Ca người loại (N) | 0 |
| Ca người thêm mới | 0 |
| Ví dụ assertion yếu mà người đã bắt được | 0 |

## 2. Kết quả chạy

| Chỉ số | Giá trị |
|---|---|
| Số Scenario | 13 |
| Đạt | 9 |
| Đỏ | 4 |
| Lệnh chạy và phiên bản Karate | `java -cp "karate-1.5.2.jar;." com.intuit.karate.Main -t "~@slow" -o ../executions/run-01-coupon/report ../executions/run-01-coupon/features` (Karate 1.5.2) |
| Báo cáo | `report/karate-reports/karate-summary.html` |

## 3. Phân loại ca đỏ

Loại: `HT` lỗi hệ thống đã có mã B; `HT-mới` lỗi hệ thống chưa có mã; `KY` test sai kỳ vọng; `SC` lỗi script. Mỗi ca đỏ phải **kiểm chứng bằng gọi API trực tiếp**.

| ID | Thông báo lỗi | Loại | Mã lỗi | Đã kiểm chứng |
|---|---|---|---|---|
| AC01 | `match failed: EQUALS`, `discount_amount` = -9000000 (kỳ vọng 100000). Công thức tính giảm giá phần trăm sai. | HT | B4 | Có (khớp với kết quả kiểm chứng Postman) |
| AC03 | `status code was: 400, expected: 200`, lỗi "Đơn hàng chưa đủ giá trị tối thiểu 300,000 đ". Backend so sánh `>` thay vì `>=` (FR-09 C3). | HT | B14 | Có (khớp với kết quả kiểm chứng Postman) |
| AC07 | `status code was: 200, expected: 401`. Không có token vẫn áp mã thành công. Endpoint không xác thực JWT (FR-09 C4, SEC-02). | HT | B26 | Có (khớp với kết quả kiểm chứng Postman) |
| AC11 | `status code was: 200, expected: 403`. User thường gọi `GET /api/coupons` trả về 200 danh sách mã thay vì 403. Không kiểm tra quyền admin (FR-12, SEC-03). | HT | B24 | Có (khớp với kết quả kiểm chứng Postman) |

## 4. Ca xanh đáng ngờ

| ID | Vì sao đáng ngờ | Cách sửa |
|---|---|---|
| AC09 | `total_amount` âm (-100.000): test đạt mã 400 vì phản hồi chứa lỗi "chưa đủ giá trị tối thiểu 300,000 đ" (nhánh kiểm tra ngưỡng tối thiểu), thay vì thông báo lỗi validate giá trị không âm (`minimum: 0`). | Nên kiểm tra cụ thể thông báo lỗi nghiệp vụ validation số âm nếu SRS/OpenAPI chuẩn hóa thông điệp. |
| AC08 | Request thiếu trường `code`: test đạt mã 400 với thông báo "Vui lòng nhập mã giảm giá", tuy nhiên chuỗi thông báo này không được quy định cụ thể trong SRS hay OpenAPI. | Giữ assertion kiểm tra `status 400` và `response.error != null` theo tài liệu đặc tả. |

## 5. Nhận xét

- **Tuân thủ quy trình & quy tắc:** Skill `api-test-design` được tuân thủ nghiêm ngặt qua 5 pha. Kỳ vọng kiểm thử được lấy từ SRS và OpenAPI, không dựa trên kết quả quan sát hệ thống.
- **Không có lỗi script (SC):** Kịch bản `AC10` sử dụng tài khoản tạm và truyền biến embedded expression `'#(u.id)'` chính xác vào body request, giúp ca kiểm thử giới hạn lượt dùng mã (FR-09 C5) chạy thành công và đạt kết quả mong đợi (200 cho lượt 1 và 400 cho lượt 2).
- **Phát hiện lỗi thật:** Bộ test phát hiện chính xác 4 lỗi hệ thống thật (`HT`: B4, B14, B26, B24) của SUT EShop mà không làm sai lệch hay nới lỏng assertion để làm xanh test.
