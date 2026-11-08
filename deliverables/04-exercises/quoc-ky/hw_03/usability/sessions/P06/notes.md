# Usability Session Note: P06

- **Participant ID:** P06
- **Participant Name:** Nguyễn Quốc Minh
- **Date:** 2026-11-07
- **Moderator:** Nguyễn Quốc Kỳ (MSSV: 23120138)
- **Evaluated Flow:** Product selection → Add to cart → Apply coupon → Checkout
- **SUT Environment:** Chrome Desktop 130 / Windows 11 / `http://localhost:3000` (Commit `35b8c5a07ec556df9ffefb5f237bb8fe536ed4aa`)

---

## 1. Quantitative Metrics
- **Completion Outcome:** `success`
- **Time on Task:** 140 seconds (Benchmark: $\le 150$s)
- **Error Count:** 1
- **Help Requests:** 0

---

## 2. SUS Questionnaire Scores
| Item | Score (1-5) | Note |
|:---:|:---:|---|
| Q01 | 4 | Thích giao diện đơn giản |
| Q02 | 2 | Không quá rườm rà |
| Q03 | 4 | Dễ thao tác |
| Q04 | 2 | Tự thực hiện được |
| Q05 | 4 | Chức năng hoạt động nhịp nhàng |
| Q06 | 2 | Bố cục ổn |
| Q07 | 5 | Học cách mua rất nhanh |
| Q08 | 2 | Khá gọn gàng |
| Q09 | 4 | Tự tin chốt đơn |
| Q10 | 2 | Không cần hướng dẫn phức tạp |

- **Calculated SUS Score:** **77.5 / 100** (Grade B / Good)

---

## 3. Post-Task Probe Responses
- **Clarity (4/5):** "Các bước khá dễ hiểu, hình ảnh sản phẩm to rõ."
- **Error Recovery (4/5):** "Nhập mã xong có hiển thị dòng tiền giảm màu xanh khá dễ nhận diện."
- **Speed (4/5):** "Thao tác bấm và tải trang đều mượt mà."
- **Trust (4/5):** "Xem được thông tin sản phẩm và giá tiền cụ thể trước khi bấm chốt đơn."

---

## 4. Behavioral Observations & Timestamped Log
- `00:00 - 00:25`: Lướt danh sách, chọn Tai nghe chụp tai giá 450.000 ₫, bấm thêm vào giỏ hàng.
- `00:26 - 00:45`: Giỏ hàng trượt ra dạng drawer che một phần trang, P06 ngập ngừng khoảng 10 giây xem nên bấm nút "Xem giỏ hàng" hay "Thanh toán ngay". Quyết định bấm vào "Xem giỏ hàng".
- `00:46 - 01:10`: Tìm thấy ô coupon, nhập `SAVE10` và bấm nút "Áp dụng". Dòng giảm giá 10% hiển thị rõ ràng.
- `01:11 - 02:20`: Chuyển qua bước thanh toán, xác nhận thông tin đơn hàng và hoàn thành.