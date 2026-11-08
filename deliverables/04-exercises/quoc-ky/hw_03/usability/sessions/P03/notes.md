# Usability Session Note: P03

- **Participant ID:** P03
- **Participant Name:** Nguyễn Thanh Sang
- **Date:** 2026-11-06
- **Moderator:** Nguyễn Quốc Kỳ (MSSV: 23120138)
- **Evaluated Flow:** Product selection → Add to cart → Apply coupon → Checkout
- **SUT Environment:** Chrome Desktop 130 / Windows 11 / `http://localhost:3000` (Commit `35b8c5a07ec556df9ffefb5f237bb8fe536ed4aa`)

---

## 1. Quantitative Metrics
- **Completion Outcome:** `success`
- **Time on Task:** 118 seconds (Benchmark: $\le 150$s)
- **Error Count:** 1
- **Help Requests:** 0

---

## 2. SUS Questionnaire Scores
| Item | Score (1-5) | Note |
|:---:|:---:|---|
| Q01 | 5 | Rất thích mua kiểu này |
| Q02 | 2 | Không phức tạp |
| Q03 | 5 | Rất dễ sử dụng |
| Q04 | 1 | Hoàn toàn tự thao tác được |
| Q05 | 4 | Luồng chức năng liền mạch |
| Q06 | 2 | Giao diện nhất quán |
| Q07 | 5 | Học dùng rất nhanh |
| Q08 | 2 | Thao tác gọn |
| Q09 | 4 | Tự tin khi đặt hàng |
| Q10 | 1 | Không cần hướng dẫn trước |

- **Calculated SUS Score:** **87.5 / 100** (Grade A / Excellent)

---

## 3. Post-Task Probe Responses
- **Clarity (4/5):** "Luồng mua hàng gọn gàng, giống các trang thương mại điện tử phổ biến."
- **Error Recovery (3/5):** "Lúc gõ dư dấu cách thì báo lỗi chung chung là không tìm thấy mã, nên báo rõ là sai định dạng."
- **Speed (5/5):** "Rất nhanh, bấm thêm vào giỏ là chuyển trang ngay không bị khựng."
- **Trust (5/5):** "Thông tin đơn hàng hiển thị rất rõ ràng."

---

## 4. Behavioral Observations & Timestamped Log
- `00:00 - 00:20`: Vào trang chủ, chọn ngay sản phẩm Chuột không dây Logitech trên 300.000 ₫ và thêm vào giỏ.
- `00:21 - 00:35`: Chuyển ngay đến giỏ hàng.
- `00:36 - 00:55`: Gõ mã `SAVE 10` (nhập nhầm khoảng trắng). Bấm Áp dụng, hệ thống báo "Mã giảm giá không tồn tại". P03 nhìn lại giấy kịch bản, xóa khoảng trắng và bấm lại. Mã được chấp nhận.
- `00:56 - 01:58`: Bấm thanh toán, kiểm tra tiền và hoàn tất đặt hàng.