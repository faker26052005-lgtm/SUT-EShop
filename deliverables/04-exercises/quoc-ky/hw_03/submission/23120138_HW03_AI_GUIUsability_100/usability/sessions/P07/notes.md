# Usability Session Note: P07

- **Participant ID:** P07
- **Participant Name:** Nguyễn Thị Cẩm Tú
- **Date:** 2026-11-07
- **Moderator:** Nguyễn Quốc Kỳ (MSSV: 23120138)
- **Evaluated Flow:** Product selection → Add to cart → Apply coupon → Checkout
- **SUT Environment:** Chrome Desktop 130 / macOS 14 / `http://localhost:3000` (Commit `35b8c5a07ec556df9ffefb5f237bb8fe536ed4aa`)

---

## 1. Quantitative Metrics
- **Completion Outcome:** `success`
- **Time on Task:** 125 seconds (Benchmark: $\le 150$s)
- **Error Count:** 1
- **Help Requests:** 0

---

## 2. SUS Questionnaire Scores
| Item | Score (1-5) | Note |
|:---:|:---:|---|
| Q01 | 5 | Rất thích hệ thống có mã giảm giá rõ ràng |
| Q02 | 2 | Không thấy rắc rối |
| Q03 | 4 | Thao tác thuận tay |
| Q04 | 1 | Tự hoàn thành dễ dàng |
| Q05 | 5 | Luồng kết hợp tốt |
| Q06 | 2 | Nhất quán |
| Q07 | 5 | Rất dễ tiếp cận |
| Q08 | 1 | Nhanh gọn |
| Q09 | 4 | Tự tin khi kiểm tra tiền |
| Q10 | 2 | Không cần học hỏi thêm |

- **Calculated SUS Score:** **87.5 / 100** (Grade A / Excellent)

---

## 3. Post-Task Probe Responses
- **Clarity (4/5):** "Vị trí ô nhập mã giảm giá dễ thấy, giao diện trực quan."
- **Error Recovery (3/5):** "Bấm áp dụng xong nên có thông báo nhảy lên báo là đã giảm thành công bao nhiêu tiền, chứ không có thông báo làm mình tưởng chưa bấm ăn."
- **Speed (5/5):** "Quy trình từ chọn món đến đặt hàng rất liền mạch và nhanh."
- **Trust (5/5):** "Số tiền giảm 10% được tính toán chuẩn xác."

---

## 4. Behavioral Observations & Timestamped Log
- `00:00 - 00:20`: Tìm và chọn sản phẩm Chuột công thái học giá 350.000 ₫, bấm "Thêm vào giỏ".
- `00:21 - 00:38`: Chuyển đến giỏ hàng.
- `00:39 - 00:55`: Nhập mã `SAVE10` vào ô coupon, click chuột vào nút "Áp dụng". Vì không có pop-up/toast báo thành công, P07 bấm nút "Áp dụng" thêm lần thứ 2 trước khi nhìn xuống phần tổng tiền và thấy tiền đã được trừ.
- `00:56 - 02:05`: Bấm thanh toán, chọn COD, xác nhận đơn hàng thành công.