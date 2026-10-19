# FR-20 – Mobile: Đăng ký và Hủy đơn · Bước 2: Xác định biến

## 2.1 Biến đầu vào
| Biến | Vị trí | Kiểu | Ràng buộc SRS nêu rõ | SRS im lặng về | Có thứ tự / số? (→ BVA) |
| :--- | :--- | :--- | :--- | :--- | :-: |
| `name` (Họ Tên) | form / body | chuỗi | Bắt buộc (R1) | độ dài, ký tự, toàn khoảng trắng | Độ dài (chỉ biên 0/1 vì chưa rõ max) |
| `email` | form / body | chuỗi | Đúng định dạng, duy nhất (R2, R3) | phân biệt hoa/thường | Không |
| `password` | form / body | chuỗi | ≥ 8 ký tự; 4 loại ký tự; tập đặc biệt `@$!%*?&` (R4, R5) | độ dài tối đa | **Độ dài (min = 8)** |
| `confirmPassword` | form | chuỗi | Phải có và khớp `password` (R6) | có gửi lên API không | Không |
| `orderId` | path | số nguyên | Phải là đơn của chính user (R12) | id không tồn tại, id không phải số | Không |
| Trạng thái đơn khi hủy | dữ liệu có sẵn | enum | `pending`, `confirmed` hủy được; `shipping`, `delivered`, `canceled` thì không (R8–R10) | | **Có thứ tự** (pending < confirmed < shipping < delivered) |

## 2.2 Biến trạng thái / điều kiện ẩn
| Biến | Ảnh hưởng | Cách dựng trạng thái cho test |
| :--- | :--- | :--- |
| Email đã tồn tại | Quyết định R3 | Dùng `test@eshop.com` (dữ liệu mẫu), hoặc đăng ký một email rồi đăng ký lại |
| Trạng thái đơn | Quyết định hủy được hay không | Tạo đơn mới bằng user thử (checkout) → `pending`. Dùng token admin gọi `PUT /api/admin/orders/:id/status` lần lượt `confirmed`, `shipping`, `delivered`. Đơn `canceled`: hủy một đơn `pending` |
| Chủ đơn | R12 | Tạo đơn bằng user A, hủy bằng token user B |
| Token | R14 | Không token; token sai (`abc.def.ghi`); token hợp lệ |
| Tầng kiểm thử | Hành vi app khác hành vi API nếu validation nằm ở client | Mỗi ca chạy **ở app (UI)** và **gọi thẳng API**, ghi hai kết quả |

## 2.3 Đầu ra cần quan sát
- **Đăng ký:** thông báo lỗi trên app (nội dung và vị trí), có chuyển sang màn Đăng nhập không, mã HTTP và body từ API, tài khoản có thật sự được tạo không (thử đăng nhập bằng tài khoản vừa tạo).
- **Hủy đơn:** có nút Hủy hay không theo trạng thái, trạng thái đơn đọc lại bằng `GET /api/orders/my-orders`, nhãn tiếng Việt và màu, đơn của người khác có bị ảnh hưởng không.

## 2.4 Nguyên tắc
Chỗ SRS im lặng → ghi `CẦN LÀM RÕ` rồi chuyển sang `clarifications.md`. Không tự bịa kỳ vọng.

---

## Prompt AI đã dùng ở bước này
| ID log (ai_audit) | Prompt (tóm tắt) |
| :--- | :--- |
| TODO | TODO |

## Tôi đã rà soát / sửa gì so với output AI
- TODO: ghi cụ thể (chấp nhận gì, sửa gì và vì sao, bổ sung gì mà AI bỏ sót)
