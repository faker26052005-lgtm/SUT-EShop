# Usability Session Note: P05

- **Participant ID:** P05
- **Participant Name:** Trần Nhật Loan Anh
- **Date:** 2026-11-06
- **Moderator:** Nguyễn Quốc Kỳ (MSSV: 23120138)
- **Evaluated Flow:** Product selection → Add to cart → Apply coupon → Checkout
- **SUT Environment:** Chrome Desktop 130 / macOS 14 / `http://localhost:3000` (Commit `35b8c5a07ec556df9ffefb5f237bb8fe536ed4aa`)

---

## 1. Quantitative Metrics
- **Completion Outcome:** `assisted`
- **Time on Task:** 195 seconds (Benchmark: $\le 150$s)
- **Error Count:** 3
- **Help Requests:** 1

---

## 2. SUS Questionnaire Scores
| Item | Score (1-5) | Note |
|:---:|:---:|---|
| Q01 | 3 | Cân nhắc nếu web cải thiện lỗi |
| Q02 | 4 | Thấy khó hiểu khi gặp lỗi coupon |
| Q03 | 3 | Dễ dùng ở các bước khác nhưng kẹt ở mã giảm giá |
| Q04 | 3 | Phải nhờ người điều phối nhắc |
| Q05 | 3 | Phản hồi thông báo chưa liền mạch |
| Q06 | 3 | Báo lỗi chưa rõ ràng |
| Q07 | 3 | Cần lưu ý điều kiện đơn hàng |
| Q08 | 4 | Bị mất thời gian chọn lại món |
| Q09 | 2 | Cảm thấy hoang mang khi bị từ chối mã |
| Q10 | 3 | Phải tìm hiểu kỹ quy định mã |

- **Calculated SUS Score:** **42.5 / 100** (Grade F / Poor)

---

## 3. Post-Task Probe Responses
- **Clarity (2/5):** "Lúc áp mã giảm giá bị lỗi không thấy ghi rõ điều kiện đơn tối thiểu bao nhiêu, làm mình tưởng mã bị hư."
- **Error Recovery (2/5):** "Thông báo lỗi nên ghi rõ lý do như 'Đơn hàng chưa đủ 300k' thay vì chỉ báo 'Mã không hợp lệ'."
- **Speed (3/5):** "Mất thời gian quay lại trang chủ chọn lại món khác giá cao hơn."
- **Trust (3/5):** "Ban đầu thấy báo lỗi mã liên tục làm mình hơi mất tin tưởng vào chương trình khuyến mãi."

---

## 4. Behavioral Observations & Timestamped Log
- `00:00 - 00:30`: Chọn món phụ kiện "Cáp sạc Type-C" giá 180.000 ₫ (dưới 300.000 ₫), thêm vào giỏ.
- `00:31 - 01:10`: Vào giỏ hàng, nhập `SAVE10`. Bấm Áp dụng, hệ thống chỉ báo "Mã không hợp lệ hoặc không thể áp dụng".
- `01:11 - 02:20`: P05 kiểm tra lại chữ hoa/thường, nhập lại 3 lần liên tiếp vẫn bị từ chối. Bế tắc hơn 2 phút và quay sang hỏi người điều phối: *"Ủa mã này bị hết hạn rồi hả bạn?"*.
- `02:21 - 02:40`: Người điều phối can thiệp trung lập: *"Bạn hãy kiểm tra lại điều kiện giá trị đơn hàng trong tờ kịch bản nhé"*. P05 nhận ra đơn chưa đủ 300k, quay lại trang chủ chọn thêm sản phẩm.
- `02:41 - 03:15`: Nhập lại mã `SAVE10`, áp dụng thành công và hoàn tất thanh toán. Đánh dấu kết quả: `assisted`.