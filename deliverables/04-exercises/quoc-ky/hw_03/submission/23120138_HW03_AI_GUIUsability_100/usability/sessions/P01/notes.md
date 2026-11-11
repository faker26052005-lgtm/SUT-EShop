# Usability Session Note: P01

- **Participant ID:** P01
- **Participant Name:** Nguyễn Minh Khang
- **Date:** 2026-11-05
- **Moderator:** Nguyễn Quốc Kỳ (MSSV: 23120138)
- **Evaluated Flow:** Product selection → Add to cart → Apply coupon → Checkout
- **SUT Environment:** Chrome Desktop 130 / Ubuntu 22.04 / `http://localhost:3000` (Commit `35b8c5a07ec556df9ffefb5f237bb8fe536ed4aa`)

---

## 1. Quantitative Metrics
- **Completion Outcome:** `success`
- **Time on Task:** 135 seconds (Benchmark: $\le 150$s)
- **Error Count:** 1
- **Help Requests:** 0

---

## 2. SUS Questionnaire Scores
| Item | Score (1-5) | Note |
|:---:|:---:|---|
| Q01 | 4 | Tương đối muốn dùng thường xuyên |
| Q02 | 2 | Không thấy quá phức tạp |
| Q03 | 4 | Giao diện dễ tiếp cận |
| Q04 | 1 | Không cần chuyên gia hỗ trợ |
| Q05 | 4 | Chức năng kết nối tốt |
| Q06 | 2 | Tính nhất quán ổn |
| Q07 | 4 | Dễ làm quen |
| Q08 | 2 | Không quá rườm rà |
| Q09 | 4 | Khá tự tin khi đặt |
| Q10 | 2 | Không phải học nhiều |

- **Calculated SUS Score:** **77.5 / 100** (Grade B / Good)

---

## 3. Post-Task Probe Responses
- **Clarity (4/5):** "Các nút bấm chính như Thêm vào giỏ và Đặt hàng nhìn rất to và rõ, không mất thời gian tìm kiếm."
- **Error Recovery (3/5):** "Gõ mã xong mình quen tay bấm Enter nhưng web không nhận, tưởng bị đơ một lúc mới thấy cần phải bấm chuột vào nút Áp dụng bên cạnh."
- **Speed (5/5):** "Thời gian load giữa các trang nhanh, lúc bấm đặt hàng xong chuyển sang màn hình thành công gần như tức thì."
- **Trust (4/5):** "Màn hình xác nhận cuối ghi rõ số tiền được giảm 10% và tổng thanh toán khớp nhau nên mình khá yên tâm."

---

## 4. Behavioral Observations & Timestamped Log
- `00:00 - 00:25`: Đọc kịch bản, lướt trang chủ, chọn sản phẩm "Bàn phím cơ Keychron Q1" (trên 300.000 ₫) và bấm thêm vào giỏ.
- `00:26 - 00:50`: Mở giỏ hàng, xác nhận có 1 sản phẩm.
- `00:51 - 01:10`: Tìm ô coupon, nhập `SAVE10`. Bấm phím `Enter` trên bàn phím. Không thấy trang phản hồi.
- `01:11 - 01:20`: Nhìn màn hình phân vân khoảng 9 giây, sau đó dùng chuột nhấp vào nút "Áp dụng". Tiền giảm 10% được trừ vào tổng tiền.
- `01:21 - 02:15`: Bấm tiến hành thanh toán, chọn COD, bấm xác nhận đặt hàng và tới trang thành công.