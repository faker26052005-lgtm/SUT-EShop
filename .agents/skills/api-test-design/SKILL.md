---
name: api-test-design
description: Thiết kế test API từ SRS và OpenAPI, viết Karate feature, chạy và báo cáo cho EShop SUT. Dùng khi người dùng nói bắt đầu một lần chạy (run), duyệt matrix, nói "chạy", hoặc nhắc đến test API, test contract, Karate, test-matrix, executions/run-*. Dùng ngay cả khi người dùng không nhắc tên skill.
---

# api-test-design

Mục tiêu: **tìm lỗi thật của hệ thống** bằng test API, với kỳ vọng lấy từ tài liệu chứ không từ hành vi hiện tại của hệ thống.

Ba thư mục:
- `inputs/` do người cung cấp: `srs.md`, `openapi.yaml`, `sample-data.md`.
- `executions/<run-id>/` do Agent tạo: `test-matrix.md`, `features/`, `report/`, `result.md`.
- Skill này: quy trình, mẫu và script.

## Nguồn được phép đọc, nguồn bị cấm

Được đọc: ba file trong `inputs/`, thư mục skill này, và `executions/<run-id>/` của lần chạy hiện tại.

Không đọc, không hỏi, không suy từ: mã nguồn của hệ thống, danh sách lỗi đã biết, collection Postman, kết quả của các `executions/run-*` khác, và các tài liệu hướng dẫn dành cho người ở gốc workspace (`README.md`, `DEMO.md`). Nếu thấy chúng trong workspace, bỏ qua. Lý do: kỳ vọng chịu ảnh hưởng bởi những nguồn này sẽ không còn độc lập với hệ thống.

## Xác định đang ở pha nào

Không cần người nhắc pha. Nhìn trạng thái `executions/<run-id>/` rồi làm theo bảng:

| Trạng thái | Việc cần làm |
|---|---|
| Đầu cuộc trò chuyện, chưa chạy `doctor.py` | **Pha 0**: kiểm tra môi trường |
| Chưa có `test-matrix.md` | **Pha A**: lập matrix |
| Matrix còn dòng cột `Duyệt` trống | Dừng. Nhắc người điền `Y`, `S` hoặc `N` cho mọi dòng |
| Matrix đã duyệt hết, chưa có `features/*.feature` | **Pha B**: viết feature |
| Có feature, chưa có `report/summary.md` | Dừng. Chờ người nói "chạy" (người tự khởi động lại máy chủ) |
| Người nói "chạy" | **Pha C**: chạy bằng `scripts/run_karate.py` |
| Có `report/summary.md`, chưa có `result.md` | **Pha C**: viết `result.md` |

Nếu người chưa cho tên lần chạy, đề xuất `run-<NN>-<phạm vi>` (NN là số kế tiếp) và hỏi xác nhận, không tự đoán.
Nếu phạm vi không rõ (không biết FR hay endpoint nào), hỏi một câu rồi mới làm.

## Pha 0: kiểm tra môi trường

1. Chạy `python <thư mục skill>/scripts/doctor.py`. Script chỉ kiểm tra, không cài gì.
2. Báo kết quả cho người bằng lời thường: cái gì đã có, cái gì còn thiếu.
3. Mục `[THIẾU]` thì dừng và nói rõ cần làm gì. **Không tự cài phần mềm.** Chỉ cài khi người yêu cầu; khi đó dùng đúng lệnh doctor gợi ý và chạy qua terminal để người duyệt. File `karate-*.jar` do người tải về từ trang Releases của Karate (đừng đoán đường dẫn tải).
4. Mục `[LƯU Ý]` về máy chủ chưa chạy thì vẫn tiếp tục Pha A, vì lập matrix không cần máy chủ.
5. Sau khi người xử lý xong, chạy lại doctor một lần rồi mới sang Pha A.

## Pha A: lập matrix

1. Đọc `inputs/sample-data.md`, phần SRS của phạm vi, và các endpoint liên quan trong `inputs/openapi.yaml`.
2. Tạo `executions/<run-id>/test-matrix.md` từ `assets/templates/test-matrix.template.md`.
3. Mục 1 (Quy tắc): tách SRS thành các quy tắc **nguyên tử**, mỗi quy tắc một ý kiểm được, mã `R01`, `R02`... Ví dụ "không token thì 401" và "sai vai trò thì 403" là hai quy tắc, không gộp.
4. Mục 2 (Matrix): mỗi ca gắn với ít nhất một quy tắc. Chọn nhóm ca theo `references/design-rules.md` và chủ động phủ các chỗ hay bỏ sót.
5. Cột `Nguồn kỳ vọng`: `SRS`, `OpenAPI` hoặc `Không nêu`. Chỉ khi chọn `Không nêu` mới được phép kiểm lỗi một cách lỏng (chỉ kiểm là chuỗi).
6. Mục 3: ghi mọi mâu thuẫn hoặc chỗ tài liệu im lặng. SRS và OpenAPI mâu thuẫn thì theo SRS và ghi lại.
7. **Tự rà trước khi dừng**, từng mục một:
   - Cột `Assertion chính` của mọi ca có nêu mã trạng thái (`status 400`...).
   - Mỗi ca âm tính: dữ liệu có vi phạm **hai** quy tắc cùng lúc không? Nếu có thì cô lập (xem `design-rules.md` mục 3) và ghi cách cô lập vào `Ghi chú`.
   - Mỗi ca âm tính trên thao tác **xóa, sửa, ghi**: đối tượng bị tác động phải là dữ liệu tạm, không phải id có sẵn trong `sample-data.md`. Nếu hệ thống lỗi phân quyền, thao tác sẽ thành công thật (xem `design-rules.md` mục 8).
   - Cột `Nguồn kỳ vọng` là nguồn của **nội dung được kiểm**. Mã trạng thái chỉ suy ra từ quy ước chung (ví dụ bearerAuth) mà nội dung lỗi không nêu thì ghi `Không nêu`, giải thích ở `Ghi chú`.
   - Dữ liệu của ca không phải ca biên đặt **xa biên** (xem `design-rules.md` mục 10), để một lỗi biên không làm đỏ cả chuỗi ca.
   - Không thêm assertion về lý do mà tài liệu không nêu. Không cô lập được thì kiểm mã trạng thái và ghi giới hạn ở `Ghi chú` (xem `design-rules.md` mục 3).
   - Hành vi mà tài liệu **không nêu** (ví dụ id không tồn tại ở endpoint không liệt kê 400 hoặc 404) thì không tạo ca đoán. Ghi vào mục 3, đặt quy tắc `Phủ qua API: Không`.
   - Với mỗi endpoint có xác thực: OpenAPI phân biệt token sai định dạng (403) với không có token (401) thì cần ca cho cả hai.
8. Chạy `python <thư mục skill>/scripts/check_coverage.py executions/<run-id>`, sửa tới khi không còn `LỖI`.
9. **Dừng.** Báo người: số ca, số quy tắc, các điểm ở mục 3. Để cột `Duyệt` trống.

## Pha B: viết feature

1. Chỉ viết ca có `Duyệt` là `Y` hoặc `S`. Ca `S` thì người đã sửa tại chỗ, hãy theo nội dung đã sửa. Ca `N` không viết.
2. Mỗi `Scenario` có đúng một thẻ `@ID` trùng ID trong matrix. Cú pháp, mẫu và hàm dùng chung nằm ở `references/karate-guide.md`; ví dụ hoàn chỉnh ở `examples/loans/`.
3. Đặt feature ở `executions/<run-id>/features/`.
4. Mọi biến đưa vào body JSON phải bọc `'#(tên)'` (`request { code: '#(tmpCode)' }`), không viết tên biến trần. Sau đó tự rà từng Scenario có thao tác ghi:
   - Ca tạo hoặc xóa dữ liệu dùng đối tượng **tạm** (tên có tiền tố `tmp` và dấu thời gian). Không nhắm `DELETE`, `PUT`, `PATCH` vào id có sẵn.
   - **Dọn dẹp trước khi kiểm**: lưu `responseStatus` và `response` của bước đang kiểm vào biến, dọn đối tượng tạm, rồi mới `match`. Karate dừng ở bước đỏ đầu tiên, nên nếu kiểm ngay thì dọn dẹp không chạy khi ca đỏ (mẫu ở `references/karate-guide.md`).
5. Chạy lại `check_coverage.py` tới khi sạch. Mỗi `CẢNH BÁO` phải được xử lý: sửa ca, hoặc nếu chắc chắn an toàn thì thêm chú thích `# an-toan: <lý do>` ngay trong Scenario.
6. **Dừng.** Nhắc người: khởi động lại máy chủ EShop (để dữ liệu về trạng thái ban đầu), rồi nói "chạy".

## Pha C: chạy và báo cáo

1. Chạy `python <thư mục skill>/scripts/run_karate.py executions/<run-id>`. Script kiểm tra điều kiện, chạy Karate và ghi `report/summary.md` (số liệu, danh sách ca, nguyên văn lỗi của từng ca đỏ).
   Mặc định bỏ qua ca `@slow`; nếu matrix có ca `@slow` được duyệt, hỏi người có muốn thêm `--all` không.
2. Tạo `result.md` từ `assets/templates/result.template.md`. Điền các mục dành cho Agent theo hướng dẫn trong mẫu. Với mỗi ca đỏ, tìm **nguyên nhân gốc** trong log Karate (request thực tế đã gửi, phản hồi thực tế) trước khi gán nhãn. Một ca đỏ do chính kịch bản gây ra (dữ liệu tạm trùng, biến không nội suy) là `KY?`, không phải `MT?` hay `HT?`. Khi nghi ca đỏ do ca khác làm bẩn dữ liệu, ghi dòng log làm bằng chứng và nêu ca nào gây ra.
3. Báo người: số ca xanh, số ca đỏ, và những ca cần người xác nhận.

## Luật cứng

1. **Kỳ vọng từ tài liệu.** Số tiền và kết quả tính toán tự tính theo công thức trong SRS, không chép từ phản hồi của hệ thống.
2. **Ca đỏ giữ nguyên là đỏ.** Không sửa kỳ vọng cho khớp hành vi thật. Nghi kỳ vọng sai thì ghi vào `result.md` để người quyết.
3. **Không thiết kế bằng cách gọi API.** Agent chỉ gọi API thật thông qua `run_karate.py` ở Pha C.
4. **Không đụng dữ liệu mẫu.** Tài khoản và dữ liệu mẫu chỉ để đọc hoặc thao tác an toàn. Ca ghi, đổi quyền, xóa dùng dữ liệu tạm tự tạo (xem `references/karate-guide.md`).
5. **Mỗi ca âm tính chỉ sai đúng một lý do**, và phải có cách chứng minh ca bị từ chối vì đúng lý do đó (xem `references/design-rules.md`).
6. **Không kết luận thay người.** Không viết "đã kiểm chứng", không gán mã lỗi, không điền cột `Duyệt` hay `Người xác nhận`. Agent chỉ đưa nhận định kèm căn cứ.
7. **Mơ hồ thì hỏi hoặc ghi vào mục 3 của matrix.** Không đoán hộ.
8. Không tự bật máy chủ, không sửa `inputs/`, không đổi mã nguồn hệ thống.

## Tham chiếu

| Cần | Đọc |
|---|---|
| Chọn ca, phủ chỗ hay sót, assertion mạnh yếu | `references/design-rules.md` |
| Cú pháp Karate, tài khoản tạm, ca chậm, nhiều bộ dữ liệu | `references/karate-guide.md` |
| Cách đặt tên biến, hàm dùng chung của dự án | `references/project-context.md` |
| Mẫu hoàn chỉnh (matrix cộng feature) | `examples/loans/` (API giả, không phải EShop) |
