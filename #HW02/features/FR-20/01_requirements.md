# FR-20 – Mobile: Đăng ký và Hủy đơn · Bước 1: Trích yêu cầu

> Nguồn: SRS mục FR-01, FR-10, FR-11, FR-20, FR-21, FR-22 (README của `eshop-sut`), `api_specification.md` mục 1.1 và 4.6.
> Phạm vi: trên app mobile (React Native/Expo) chọn 2 chức năng thuộc FR-20: **Đăng ký** và **Hủy đơn hàng**.

## 1.1 Trích nguyên văn từ SRS

**FR-01 (Đăng ký tài khoản)**
> - Người dùng phải cung cấp: **Họ Tên**, **Email**, **Mật khẩu**.
> - Email phải có định dạng hợp lệ (`user@domain.com`) và là duy nhất trong hệ thống.
> - **Yêu cầu mật khẩu mạnh**: Tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt (`@`, `$`, `!`, `%`, `*`, `?`, `&`).
> - Phải có trường **Xác nhận mật khẩu**, hệ thống từ chối nếu hai trường không khớp.
> - Sau khi đăng ký thành công, người dùng được chuyển tới trang Đăng nhập.

**FR-10 (Order State Machine)**
> - Trạng thái `delivered` và `canceled` là **trạng thái kết thúc**, không được phép chuyển sang bất kỳ trạng thái nào khác.
> - Khi đơn hàng đã ở trạng thái `shipping`, **User không được phép tự hủy**, chỉ Admin mới có thể thao tác.
> - Mọi chuyển đổi không hợp lệ phải trả về lỗi với thông báo phù hợp.
> - Sơ đồ: `pending → confirmed → shipping → delivered`; `pending` và `confirmed` có thể sang `canceled` (User/Admin hủy).

**FR-11 (Lịch sử đơn hàng)**
> - Người dùng chỉ xem được đơn hàng của chính mình. Hiển thị: Mã đơn, Ngày đặt, Tổng tiền, Trạng thái hiện tại. Trạng thái phải được dịch sang tiếng Việt rõ ràng và phân biệt màu sắc.

**FR-20 (Mobile)**
> - Đầy đủ các chức năng: Xem sản phẩm, Đăng nhập, Đăng xuất, Đăng ký, Giỏ hàng, Thanh toán, Hồ sơ, Lịch sử đơn hàng.
> - Chức năng Hủy đơn hàng tuân theo đúng State Machine ở FR-10 (chỉ được hủy khi `pending` hoặc `confirmed`).

**FR-22 (Form), liên quan tới form đăng ký**
> - Trường bắt buộc có ký hiệu `*`; Email dùng `type="email"`; Mật khẩu dùng `type="password"`; thông báo lỗi xuất hiện **trên** nút submit.

**API spec**
> - `POST /api/register` body `{name, email, password}`, thành công trả 200 `{message, id}`.
> - `PUT /api/orders/:id/cancel`: chuyển đơn sang `canceled`; "Chỉ được thực hiện khi đơn hàng chưa giao".

## 1.2 Bảng yêu cầu
| Mã | Yêu cầu (ngắn gọn) | Nguồn | Loại |
| :--- | :--- | :--- | :--- |
| R1 | Đăng ký phải có Họ Tên, Email, Mật khẩu (bắt buộc) | FR-01 | input |
| R2 | Email đúng định dạng `user@domain.com` | FR-01 | input |
| R3 | Email duy nhất trong hệ thống | FR-01 | nghiệp vụ |
| R4 | Mật khẩu ≥ 8 ký tự | FR-01 | input (BVA) |
| R5 | Mật khẩu có ≥ 1 chữ hoa, 1 chữ thường, 1 chữ số, 1 ký tự đặc biệt thuộc `@ $ ! % * ? &` | FR-01 | input |
| R6 | Có trường Xác nhận mật khẩu; từ chối nếu không khớp | FR-01 | input / UI |
| R7 | Đăng ký thành công thì chuyển tới màn Đăng nhập | FR-01 | nghiệp vụ / UI |
| R8 | Chỉ hủy được đơn ở `pending` hoặc `confirmed` | FR-20, FR-10 | nghiệp vụ |
| R9 | `shipping`: User không được tự hủy | FR-10 | nghiệp vụ |
| R10 | `delivered`, `canceled` là trạng thái kết thúc, không chuyển tiếp | FR-10 | nghiệp vụ |
| R11 | Chuyển đổi không hợp lệ phải trả lỗi kèm thông báo phù hợp | FR-10 | nghiệp vụ |
| R12 | Chỉ xem/thao tác đơn của chính mình | FR-11 | truy cập |
| R13 | Trạng thái hiển thị bằng tiếng Việt, phân biệt màu | FR-11 | UI |
| R14 | Mọi thao tác hủy phải có token hợp lệ | SEC (JWT) | truy cập |
| R15 | Trường bắt buộc có `*`, mật khẩu che ký tự, lỗi nằm trên nút submit | FR-22 | UI (**chưa rõ áp dụng cho mobile**) |

## 1.3 Endpoint liên quan
| Method | Endpoint | Cần token / role? | Body / tham số |
| :--- | :--- | :--- | :--- |
| POST | `/api/register` | Không | `{name, email, password}` |
| POST | `/api/login` | Không | `{email, password}` (dùng để kiểm "đăng ký xong đăng nhập được") |
| POST | `/api/cart`, `/api/orders` (checkout) | User | Dựng đơn hàng để test hủy đơn |
| GET | `/api/orders/my-orders` | User | Đọc lại trạng thái đơn |
| PUT | `/api/orders/:id/cancel` | User | Không có body |
| PUT | `/api/admin/orders/:id/status` | Admin | `{status}`: dựng trạng thái `confirmed/shipping/delivered` |

## 1.4 Giả định và chỗ SRS im lặng
| # | Điều chưa rõ | Giả định tạm | Đã hỏi GV/TA? |
| :-: | :--- | :--- | :-: |
| 1 | Họ Tên: độ dài tối thiểu/tối đa, ký tự cho phép, toàn khoảng trắng | Chỉ rỗng là không hợp lệ (R1); còn lại `CẦN LÀM RÕ` | Chưa |
| 2 | Mật khẩu: độ dài tối đa | Không có giới hạn; ca độ dài lớn ghi `CẦN LÀM RÕ` | Chưa |
| 3 | Ký tự đặc biệt ngoài `@$!%*?&` (ví dụ `#`) có tính là "ký tự đặc biệt" | Tập liệt kê là đầy đủ, `#` không thỏa R5 (ghi rõ giả định này trong báo cáo) | Chưa |
| 4 | Email trùng có phân biệt hoa/thường (`TEST@ESHOP.COM`) | `CẦN LÀM RÕ` | Chưa |
| 5 | FR-22 (dấu `*`, `type="email"`, lỗi ở trên nút) có áp dụng cho app mobile; tương đương `keyboardType`/`secureTextEntry` | `CẦN LÀM RÕ` cho phần dấu `*` và vị trí lỗi; che mật khẩu coi là bắt buộc | Chưa |
| 6 | Mã lỗi và thông báo khi hủy đơn không hợp lệ ("lỗi phù hợp") | Chấp nhận mọi mã 4xx kèm thông báo; dữ liệu đơn không đổi | Chưa |
| 7 | Hủy đơn có hoàn lại tồn kho sản phẩm không | Không có yêu cầu nên không test, ghi vào `clarifications.md` | Chưa |

---

## Prompt AI đã dùng ở bước này
| ID log (ai_audit) | Prompt (tóm tắt) |
| :--- | :--- |
| TODO | TODO |

## Tôi đã rà soát / sửa gì so với output AI
- TODO: ghi cụ thể (chấp nhận gì, sửa gì và vì sao, bổ sung gì mà AI bỏ sót)
