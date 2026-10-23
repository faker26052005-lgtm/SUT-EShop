# Tài liệu đầu vào

Agent phải đọc **cả ba** tệp này trước khi làm việc:

| Tệp | Nội dung | Vai trò |
|---|---|---|
| `srs.md` | Đặc tả nghiệp vụ (FR, SEC) | **Quyết định hành vi đúng**; thắng OpenAPI khi hai bên nói khác nhau |
| `openapi.yaml` | Đặc tả kỹ thuật (endpoint, trường, kiểu dữ liệu) | Quyết định hình dạng giao diện |
| `sample-data.md` | Tài khoản, sản phẩm, mã giảm giá có sẵn | Dữ liệu có sẵn duy nhất được dùng |

## Cập nhật OpenAPI: không chép tay

Bản OpenAPI gốc của nhóm có thể chứa đáp án (khóa `x-known-deviations`, mã lỗi B, nhắc Postman). Bản đó **phải để ngoài workspace** của Agent, ví dụ `../_private/openapi.master.yaml`. Khi có bản mới, sinh bản cho Agent bằng script:

```
python tools/make_agent_openapi.py ../_private/openapi.master.yaml inputs/openapi.yaml
```

Script xóa phần đáp án, rồi quét lại; còn dấu vết thì báo và thoát mã 1 để bạn xử lý tay. Đừng chép trực tiếp bản master vào `inputs/`.

Cập nhật `srs.md` và `sample-data.md` thì sửa trực tiếp (không chứa đáp án), rồi kiểm tra lại các chỗ OpenAPI và SRS khác nhau.
