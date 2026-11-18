# Kết quả: <run-id>

**Mô hình, ngày giờ, người chạy:** (người điền)

## 1. Số liệu tự động

Dán nguyên văn mục "Tổng quan" từ `report/summary.md`. Không tự tính lại.

## 2. Ca đỏ

Một dòng cho mỗi ca đỏ trong `report/summary.md`. Cột "Phản hồi thực tế" dán nguyên văn từ summary (rút gọn nếu quá dài, không diễn giải lại). Hai cột cuối **để trống** cho người.

Nhận định của Agent dùng một trong ba nhãn, kèm lý do dẫn tới điều khoản SRS hoặc OpenAPI:
- `HT?` nghi lỗi của hệ thống (phản hồi trái với tài liệu).
- `KY?` nghi kỳ vọng của test sai (tài liệu mơ hồ hoặc ta hiểu sai).
- `MT?` nghi môi trường hoặc dữ liệu (máy chủ chưa reset, dữ liệu bị ca khác đổi).

| ID | Kỳ vọng và căn cứ | Phản hồi thực tế | Nhận định của Agent | Lệnh tái hiện (để người chạy) | Người xác nhận | Mã lỗi |
|----|-------------------|------------------|---------------------|-------------------------------|----------------|--------|
|    |                   |                  |                     |                               |                |        |

Lệnh tái hiện dạng `curl` hoặc `Invoke-RestMethod`. Agent **không** chạy lệnh này. Quy định:
- Dùng **đúng dữ liệu ca đã gửi** (cùng mã, cùng số tiền, cùng đối tượng). Lệnh khác điều kiện của ca thì không tái hiện được lỗi.
- Ca nhiều bước (cần tài khoản tạm, đối tượng tạm, lặp nhiều lần) ghi "xem các bước trong feature `@ID`" thay vì đưa lệnh một bước.
- **Không bao giờ** đưa lệnh `DELETE`, `PUT`, `PATCH` nhắm vào id có sẵn trong dữ liệu mẫu (ví dụ xóa mã id 1). Người chạy lệnh đó khi hệ thống đang lỗi phân quyền sẽ làm hỏng dữ liệu mẫu.

## 3. Ca xanh đáng ngờ

Liệt kê ca xanh có thể là xanh giả: assertion chỉ kiểm kiểu, ca âm tính chưa cô lập lý do, thiếu bước đối chứng. Mỗi ca một dòng, kèm lý do và gợi ý siết.

| ID | Vì sao đáng ngờ | Gợi ý siết |
|----|-----------------|------------|
|    |                 |            |

## 4. Ca chưa chạy

Ca `Y` hoặc `S` trong matrix nhưng không có trong kết quả (ví dụ `@slow` bị bỏ qua). Copy từ mục "Chưa chạy" của `summary.md`.

## 5. Điểm tài liệu ảnh hưởng kết quả

Tóm tắt mục 3 của matrix, chỉ các điểm liên quan tới ca đỏ.

## 6. Phần người điền

| Hạng mục | Giá trị |
|---|---|
| Số ca đã xác nhận là lỗi hệ thống thật |  |
| Số ca đỏ hóa ra là test sai (`KY`) |  |
| Nhận xét về chất lượng ca Agent đề xuất |  |
