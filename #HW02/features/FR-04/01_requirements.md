# FR-04 – Quản lý hồ sơ cá nhân · Bước 1: Trích yêu cầu

> Nguồn: SRS mục FR-04, SEC-02, SEC-04, SEC-06; `api_specification.md` mục 2.1 và 2.2.
> Mẹo: gạch chân mọi con số và các từ "phải / không được / chỉ / tối đa / tối thiểu".

## 1.1 Trích nguyên văn từ SRS
**FR-04: Quản lý hồ sơ cá nhân**
- Người dùng đã đăng nhập có thể cập nhật: **Họ Tên**, **Số điện thoại**, **Địa chỉ giao hàng mặc định**.
- **Số điện thoại hợp lệ**: bắt đầu bằng số `0`, từ 10–11 chữ số.
- Email không được phép thay đổi qua giao diện.
- Người dùng chỉ có thể cập nhật hồ sơ của chính mình; không thể tự thay đổi thuộc tính `role`.

| Mã | Nội dung |
| :--- | :--- |
| SEC-02 | Các API có tính bảo mật phải yêu cầu JWT Token hợp lệ. |
| SEC-04 | Mọi dữ liệu từ user nhập vào khi hiển thị trên UI phải được escape đúng cách, không dùng `innerHTML` trực tiếp. |
| SEC-06 | API cập nhật hồ sơ không được cho phép thay đổi trường `role` từ client. |

## 1.2 Bảng yêu cầu
| Mã | Yêu cầu (ngắn gọn) | Nguồn | Loại |
| :--- | :--- | :--- | :--- |
| R1 | Người dùng đã đăng nhập cập nhật được Họ Tên, SĐT, Địa chỉ giao hàng mặc định | FR-04 | Nghiệp vụ |
| R2 | SĐT hợp lệ: bắt đầu bằng `0`, dài 10–11 chữ số | FR-04 | Input |
| R3 | Email không được thay đổi | FR-04 | Nghiệp vụ |
| R4 | Chỉ cập nhật hồ sơ của chính mình | FR-04 | Truy cập |
| R5 | Không tự thay đổi được `role` | FR-04, SEC-06 | Bảo mật |
| R6 | API phải có JWT hợp lệ | SEC-02 | Bảo mật / Truy cập |
| R7 | Dữ liệu người dùng nhập phải được escape khi hiển thị trên UI | SEC-04 | Bảo mật (chỉ kiểm tra được ở giao diện web) |

## 1.3 Endpoint liên quan
| Method | Endpoint | Cần token? | Body / tham số |
| :--- | :--- | :-: | :--- |
| GET | `/api/users/me` | Có | Không có |
| PUT | `/api/users/me` | Có | `name`, `shipping_address`, `phone` (JSON) |
| POST | `/api/register` | Không | `name`, `email`, `password` (dùng để dựng user cho test) |
| POST | `/api/login` | Không | `email`, `password` (lấy token) |

Hai endpoint cuối không thuộc FR-04, chỉ dùng để tạo user mới và token trước mỗi test.

## 1.4 Giả định và chỗ SRS im lặng
Chi tiết câu hỏi gửi GV/TA nằm ở `clarifications.md`.

| # | Điều chưa rõ | Giả định tạm | Đã hỏi GV/TA? |
| :-: | :--- | :--- | :-: |
| 1 | SĐT rỗng hoặc `null` có hợp lệ không (`clarifications` mục 1, 2) | SĐT là trường tùy chọn | Chưa |
| 2 | Họ Tên rỗng, toàn khoảng trắng có hợp lệ không (mục 3, 4) | Họ Tên không được rỗng | Chưa |
| 3 | Họ Tên chứa HTML: server có lọc không (mục 5) | Server lưu nguyên, UI phải escape (SEC-04) | Chưa |
| 4 | Địa chỉ rỗng có hợp lệ không (mục 6) | Địa chỉ là trường tùy chọn | Chưa |
| 5 | Độ dài tối đa của tên và địa chỉ (mục 7) | Không có giả định về giới hạn | Chưa |
| 6 | Gửi một trường thì các trường còn lại giữ hay mất (mục 8, **giả định A1**) | Phải giữ nguyên | Chưa |
| 7 | "Email không đổi qua giao diện" có áp dụng cho API không; gửi email thì bỏ qua hay từ chối (mục 9) | Bỏ qua trường email là chấp nhận được | Chưa |

Diễn giải: SRS viết "qua giao diện" cho email nhưng SEC-06 viết "từ client" cho `role`. Khi test qua API, mình coi cả hai yêu cầu áp dụng cho API.

---

## Prompt AI đã dùng ở bước này
| ID log (ai_audit) | Prompt (tóm tắt) |
| :--- | :--- |
| FR-04-01 | Trích yêu cầu, endpoint và các chỗ SRS im lặng từ SRS + API |

## Tôi đã rà soát / sửa gì so với output AI
> BẢN NHÁP do Claude soạn bằng cách so output gốc của AI với tài liệu này. Hãy mở output gốc, xác nhận từng ý và viết lại bằng lời của bạn.

- Output gốc của AI có bảng R1–R7, hai endpoint và 6 chỗ im lặng. Tài liệu này giữ nguyên cách đánh số R1–R7.
- Bổ sung: endpoint `register` và `login` dùng để dựng dữ liệu; chỗ im lặng về việc server có lọc HTML trong tên hay không (AI chỉ nêu ở Bước 3).
- Ghi rõ R7 chỉ kiểm tra được trên giao diện web, không kiểm tra được ở tầng API.
- Gắn mỗi chỗ im lặng với một mục trong `clarifications.md` và một giả định tạm.
- TODO: xác nhận và viết lại phần rà soát bằng lời của bạn
