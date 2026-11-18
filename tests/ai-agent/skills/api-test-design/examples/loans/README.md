# Ví dụ mẫu: API mượn sách (giả)

Đây là **API giả**, không phải EShop. Chỉ dùng để học cách điền matrix và viết feature. Không sao chép ID, endpoint hay dữ liệu từ đây sang lần chạy thật.

Quy tắc giả định (để đọc matrix cho dễ hiểu): `POST /api/loans` mượn sách cho người đăng nhập; sách thường hạn 14 ngày, sách hiếm 7 ngày; mỗi người tối đa 3 cuốn đang mượn; `GET /api/loans` chỉ thủ thư xem được.

Tự kiểm tra bộ mẫu bằng script (phải sạch lỗi, 0 cảnh báo):

```
python .agents/skills/api-test-design/scripts/check_coverage.py .agents/skills/api-test-design/examples/loans
```

Những điểm đáng học:
- Quy tắc tách nguyên tử (R08a, R08b).
- LN04: có bước đối chứng (ba lần đầu phải 201) trước khi kiểm lần thứ 4.
- LN05, LN06: nguồn `Không nêu` nên được phép chỉ kiểm `#string`.
- LN07, LN08: nguồn `OpenAPI`, kiểm đúng chuỗi lỗi.
- LN09: ghi rồi đọc lại bằng `adminToken` (chỉ đọc), tài khoản tạm làm ca ghi.
- LN10: ca từ chối trên thao tác **xóa** nhắm vào dữ liệu tạm, lưu kết quả rồi dọn dẹp **trước** khi kiểm.
