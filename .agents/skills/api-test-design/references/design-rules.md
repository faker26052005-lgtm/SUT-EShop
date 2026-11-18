# Quy tắc thiết kế ca test

## 1. Quy tắc nguyên tử

Một quy tắc ở mục 1 của matrix chỉ chứa **một** điều kiện kiểm được. Câu SRS nhiều vế thì tách:

| Không tốt | Tốt |
|---|---|
| R10: chỉ admin xem danh sách, không token thì 401 | R10a: không token thì 401. R10b: token user thường thì 403. R10c: admin thì 200 |

Lý do: `check_coverage.py` kiểm mỗi quy tắc có ít nhất một ca. Quy tắc gộp sẽ được tính là "đã phủ" khi mới phủ một vế.

## 2. Sáu nhóm ca (mỗi ca thuộc một nhóm)

| # | Nhóm | Ví dụ |
|---|---|---|
| 1 | Đường đi đúng | Mượn sách hợp lệ; áp mã hợp lệ |
| 2 | Giá trị biên | Đúng ngưỡng, ngay dưới, ngay trên; id 0, id ngay sau id cuối; lần thứ N so với N+1 |
| 3 | Dữ liệu sai, thiếu, sai kiểu | Thiếu từng trường bắt buộc (mỗi trường một ca), số âm, chuỗi thay cho số |
| 4 | Vi phạm quy tắc nghiệp vụ | Mã hết hạn; hủy đơn đang giao; hết hàng |
| 5 | Phân quyền và bảo mật | Không token; token sai vai trò; xem dữ liệu của người khác; chuỗi tấn công |
| 6 | Trạng thái và luồng nhiều bước | Khóa tài khoản sau số lần sai; chuyển trạng thái; dùng lại mã một lần |

## 3. Ca âm tính chỉ được sai đúng một lý do

Ca bị từ chối với mã 4xx chỉ có giá trị khi ta biết **vì sao** nó bị từ chối. Nếu dữ liệu vi phạm hai quy tắc cùng lúc, hệ thống có thể từ chối vì quy tắc khác và ca vẫn xanh (xanh giả).

Ví dụ: kiểm "số tiền âm thì bị từ chối" bằng một mã có ngưỡng tối thiểu 300.000₫. Số âm luôn nhỏ hơn ngưỡng nên hệ thống từ chối vì ngưỡng, và ca xanh dù hệ thống không hề kiểm số âm. Ngưỡng 0 cũng không đủ: số âm vẫn nhỏ hơn 0.

Cách xử lý, theo thứ tự ưu tiên:
- **Cô lập bằng dữ liệu**: tạo đối tượng tạm để quy tắc kia không thể bị vi phạm (ví dụ mã tạm có ngưỡng tối thiểu **âm**, khi schema không chặn). Khi đó nếu có mã 400 thì chỉ có thể do quy tắc đang kiểm.
- **Loại trừ lý do khác** bằng `And match response.error !contains '<chuỗi>'`: chỉ dùng khi tài liệu **nêu rõ** chuỗi thông báo của lý do kia.
- **Không cô lập được**: chỉ kiểm mã trạng thái, ghi giới hạn của ca vào `Ghi chú`. **Không** thêm assertion về lý do mà tài liệu không nêu: kết quả đỏ như vậy là do ta đặt kỳ vọng, không phải lỗi của hệ thống.

## 4. Ca trạng thái cần bước đối chứng

Với ca kiểu "đã dùng hết lượt thì bị từ chối", chạy **trước** một lần gọi cùng dữ liệu mà ta biết sẽ thành công (kiểm `200` hoặc `201`), rồi mới tạo trạng thái "hết lượt" và gọi lần nữa. Nhờ đó nếu lần cuối bị từ chối, nguyên nhân chỉ có thể là trạng thái ta vừa tạo.

Với ca biên theo số lần (tối đa N), kiểm **từng bước**: lần N vẫn thành công, lần N+1 bị từ chối.

## 5. Assertion mạnh và yếu

| Yếu (không chấp nhận) | Mạnh (mong muốn) |
|---|---|
| Chỉ `status 200` | `status` cộng `match` giá trị cụ thể trong phản hồi |
| Ca âm tính chỉ kiểm `status 400` | Kiểm cả mã lẫn nội dung lỗi (`response.error`) |
| `match response.error != null` hoặc `== '#string'` khi tài liệu **có** nêu thông báo | `match response.error == '<thông báo trong tài liệu>'` hoặc `contains` một phần ổn định |
| Kiểm kiểu của mảng khi gửi chuỗi tấn công | Kiểm mảng **rỗng** hoặc không rò dữ liệu ngoài phạm vi |
| Thử nhiều mã hợp lệ rồi chỉ kiểm tồn tại | Chọn **một** mã đúng theo SRS |
| Ghi dữ liệu rồi không đọc lại | `GET` lại sau khi ghi và so sánh giá trị |

**Khi tài liệu không nêu nội dung thông báo lỗi** (cột `Nguồn kỳ vọng` là `Không nêu`): chỉ kiểm mã trạng thái cộng `match response.error == '#string'`. Đây là trường hợp duy nhất cho phép assertion lỏng, và `check_coverage.py` chỉ cho phép khi matrix ghi `Không nêu`. Hãy kết hợp với mục 3 để loại trừ lý do khác.

Kỳ vọng số tiền hoặc kết quả tính toán phải **tự tính bằng công thức trong SRS**, không chép từ phản hồi của hệ thống.

## 6. Những chỗ AI hay bỏ sót (hãy chủ động phủ)

| Kiểu lỗi | Cách phủ |
|---|---|
| Phản hồi lộ trường không được có (mật khẩu, mã đặt lại) hoặc sai kiểu dữ liệu | `match response.user.password == '#notpresent'`; kiểm kiểu từng trường |
| Công thức, số tiền, đúng ngưỡng | Tính kỳ vọng bằng công thức; thử đúng ngưỡng, ngay dưới, ngay trên |
| Token và vai trò ở **từng** endpoint | Với mỗi endpoint: không token (401) và token sai vai trò (403) là hai ca riêng |
| Token ở mức xác thực: không có token, token sai định dạng, token sai vai trò | Ba ca riêng. Khi OpenAPI phân biệt: không có token 401, token không hợp lệ 403, sai vai trò 403 |
| Id không tồn tại, body rỗng, thiếu từng trường | Một ca cho mỗi loại. Riêng id không tồn tại ở endpoint mà OpenAPI không nêu hành vi thì **không** tạo ca (xem mục 9) |
| Trường định danh trong body khác với người trong token | Gửi định danh của người khác bằng token của mình, kiểm hệ thống không tin định danh trong body |
| Đọc lại sau khi ghi | `GET` lại và so sánh toàn bộ trạng thái liên quan; thử cập nhật **một phần** trường |
| Chuỗi tấn công mà phản hồi vẫn trông bình thường | Kiểm nội dung phản hồi, không chỉ mã |
| Ma trận chuyển trạng thái | Thử mọi cặp, kể cả từ trạng thái kết thúc |
| Lách luật bằng cách bỏ một trường tùy chọn | Bỏ từng trường tùy chọn và kiểm luật vẫn áp dụng |
| Giới hạn số lần chính xác (khóa tài khoản, lượt dùng) | Kiểm kết quả **từng bước**, không chỉ bước cuối |
| Làm tròn số thập phân | Chọn dữ liệu cho kết quả không chia hết, kiểm theo quy tắc làm tròn trong SRS |
| Tham chiếu tới id không tồn tại ở endpoint ghi | Gửi id không có thật, kiểm hệ thống từ chối thay vì ghi nhận |

## 8. Ca âm tính trên thao tác xóa, sửa, ghi phải nhắm vào dữ liệu tạm

Kiểm "người không có quyền xóa thì bị từ chối" bằng cách xóa một id có sẵn là nguy hiểm: nếu hệ thống đang có đúng lỗi phân quyền ta cần tìm, lệnh xóa sẽ **thành công thật** và làm hỏng dữ liệu mẫu, kéo theo các ca khác chạy sai.

Cách làm: dùng tài khoản có quyền tạo một đối tượng tạm, để tài khoản không có quyền (hoặc không có token) thử xóa, sửa đối tượng tạm đó, rồi dọn dẹp. Chỉ dùng id cố định khi id đó chắc chắn không tồn tại (ví dụ 99999) và ghi chú `# an-toan: <lý do>` trong Scenario.

## 9. Kỳ vọng phải có cơ sở trong tài liệu

Mọi ca phải truy được tới một điều khoản SRS hoặc OpenAPI. Khi tài liệu không nêu hành vi (ví dụ endpoint không liệt kê mã lỗi cho id không tồn tại), đừng viết kỳ vọng kiểu "400 hoặc 404". Ca như vậy không viết được assertion chắc chắn, và nếu hệ thống trả khác thì ta không thể khẳng định đó là lỗi.

Thay vào đó: ghi điểm chưa rõ vào mục 3 của matrix, đặt quy tắc tương ứng là `Phủ qua API: Không`, và để người quyết định hỏi lại người viết tài liệu.

## 10. Ca đường đi đúng và ca biên phải tách rủi ro

Ca chỉ nhắm một biên (đúng ngưỡng, ngay dưới ngưỡng) thì dữ liệu của các ca **khác** phải đặt xa biên đó. Ví dụ ngưỡng tối thiểu 300.000₫: ca biên dùng đúng 300.000₫, còn ca kiểm số lượt dùng mã dùng 400.000₫.

Lý do: nếu ca số lượt cũng dùng 300.000₫ và hệ thống có lỗi biên, thì một lỗi làm đỏ cả chuỗi ca và che mất việc kiểm quy tắc số lượt, là thứ ta cần tìm.

## 11. Đặt ID

Hai chữ cái viết tắt nhóm chức năng cộng số thứ tự: `LG01`, `OR01`... ID trong matrix và thẻ `@ID` trong feature phải **trùng nhau**. Mỗi lần chạy dùng một tiền tố thống nhất cho cả phạm vi.
