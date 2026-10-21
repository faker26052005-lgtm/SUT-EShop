# Report template

```
# FR-xx – <name> · Kết quả

## Môi trường
- Hệ điều hành / SUT (URL) / Công cụ (collection file) / Thời gian chạy

## Cách chạy
(1–3 dòng: import, chạy B0 nếu cần, Send request A)

## Bảng kết quả chi tiết
| ID | Mã HTTP | Verdict | Quan sát thực tế | Side-effect / Ghi chú | Bug liên quan |
Verdict: PASS (đúng SRS) / FAIL (sai SRS) / CẦN LÀM RÕ (SRS im lặng, không tính là PASS)

## Gom test đỏ theo nguyên nhân gốc
| Bug ID | Nguyên nhân gốc | Các test liên quan | Mức độ | SRS bị vi phạm |

## Tổng kết
| Chỉ số | Số lượng |
| Tổng ca test thiết kế & chạy | n |
| Passed | n (x%) |
| Failed | n (x%) |
| CẦN LÀM RÕ (SRS im lặng) | n (x%) |
| Số lượng bug phát hiện | n nguyên nhân gốc |

## Phụ lục: Câu hỏi cần làm rõ với GV/TA
| # | Biến / tình huống | Điều SRS chưa nói | Hệ thống hiện xử lý thế nào | Giả định tạm của tester | Trạng thái |
```

## Severity rubric
| Mức | Dấu hiệu |
| :-- | :-- |
| Critical | Mất/hỏng dữ liệu, sai tiền, vượt quyền, lộ dữ liệu người dùng khác, lỗ hổng bảo mật SEC-xx đang bị khai thác được |
| High | Chức năng cốt lõi trả sai kết quả so với SRS nhưng có đường vòng, hoặc kiểm soát truy cập thiếu ở API ít nhạy cảm |
| Medium | Sai quy tắc nghiệp vụ phụ, thông báo/mã trạng thái sai nhưng dữ liệu không hỏng |
| Low | Trình bày, thông điệp, sai lệch nhỏ không ảnh hưởng kết quả |

## Bug write-up
- Tiêu đề: `FR-xx-BUG-NN – <hiện tượng ngắn, nêu nguyên nhân gốc>`
- Điều kiện / bước tái hiện: các request `FR-xx-BUG-NNa, b, …` trong folder B của collection
- Kỳ vọng: trích nguyên văn điều khoản SRS (mã R/SEC)
- Thực tế: mã HTTP + dữ liệu quan sát
- Mức độ + lý do; bằng chứng: ảnh chụp từng request
