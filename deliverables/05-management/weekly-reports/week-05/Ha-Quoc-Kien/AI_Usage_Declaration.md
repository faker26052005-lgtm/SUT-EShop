# AI Usage Declaration — Tuần 05 (Hà Quốc Kiên)

- **Họ và tên:** Hà Quốc Kiên  
- **MSSV:** 23120056  
- **Git Username:** `kienha5`  
- **Chủ đề Seminar:** T06 · API Testing & Contract Testing | FIT@HCMUS  
- **Công cụ AI sử dụng:** OpenAI ChatGPT, Google Gemini  
- **Ngày cập nhật:** 2026-10-22  

---

## 1. Tuyên Bố & Mục Đích Sử Dụng AI

- **Phạm vi hỗ trợ:**
  1. Hỗ trợ thiết kế và tinh chỉnh cấu trúc dữ liệu CSV cho kịch bản Data-Driven Testing.
  2. Thực hiện thí nghiệm chính của đề tài seminar: Sử dụng AI để sinh mã kiểm thử từ đặc tả OpenAPI (`openapi.yaml`).
  3. So sánh chất lượng test script do AI sinh ra theo các mức độ prompt khác nhau (Prompt A cơ bản vs Prompt B có kèm ngữ cảnh SRS).
- **Cam kết Human-in-the-Loop:**
  - Tự tay chạy và đối soát 100% các script do AI sinh ra trên Newman CLI và Postman Runner.
  - Ghi nhận chi tiết các lỗi sai của AI (như assert sai status code, thiếu token header) vào bảng báo cáo thực nghiệm.
 
## 2. Lịch sử các prompt
## Prompt 1 *(2026-10-22T03:01:51.829705Z)*
*Nguồn: Đọc tài liệu dự án*

mình muốn bạn đọc 1 chút về mấy file này để nắm rõ hơn về project ta sẽ làm

---

## Prompt 2 *(2026-10-22T04:32:10.797233Z)*
*Nguồn: Đọc tài liệu dự án*

mình thật ra đã họp lại. SRS xem như là source of truth. nhóm cũng đã làm xong phần pact chỉ có mobile. Giáo viên cũng nói rõ là khi mình làm phần AI thì ngoài train Ai để tạo test thì cũng cần phải soạn kịch bản để hướng dẫn cả lớp khi thuyết trình cách để tạo ra prompt tạo testcase. Bây giờ mình sẽ làm tới phần soạn doc hướng dẫn tạo prompt ở cuối. Bây giwof bạn muốn xem tài liệu nào trước? Nếu bạn có câu hỏi gì thì cứ việc hỏi đi

---

## Prompt 3 *(2026-10-22T04:36:02.648391Z)*
*Nguồn: Đọc tài liệu dự án*

mình nén lại thành 1 khối luôn

---

## Prompt 4 *(2026-10-22T04:43:05.609725Z)*
*Nguồn: Đọc tài liệu dự án*

từ từ 1 chút, mình vẫn còn cái này muốn nói. Trong mấy việc mình cần làm (bạn có thể coi trong phân công nhiệm vụ này) thì mình vẫn cần làm 1 cái csv data driven. Mình cũng đã có được mấy tài liệu này nhưng mình không rõ thực hiện thế nào. Vậy nên trong 2 phần việc chính còn lại, mình chưa hoàn thành cả 2. MÌnh định sẽ làm phần csv trước do nó có liên quan tới báo cáo newman mình cần cho postman. Sau đó mình sẽ làm phần AI cuối ở trên. Giờ, bạn hãy hướng dẫn mình chi tiết cách thực hiện phần csv này đi

---

## Prompt 5 *(2026-10-22T04:46:09.074060Z)*
*Nguồn: Đọc tài liệu dự án*

đây là 2 mẫu csv, script thì mình không có, chắc là bây giờ bạn tạo giúp mình đi. Còn phần demo, giáo viên nói là nếu có 1 chức năng bị khóa trả phí thì có thể tìm cách khác, nên mình sẽ nói lại với giảng viên khi thuyết trình sau, giờ ta cứ dùng newman đi

---

## Prompt 6 *(2026-10-22T04:50:15.485431Z)*
*Nguồn: Đọc tài liệu dự án*

vậy bạn tạo cho mình full thư mục rồi, chỉ cần thêm collection chính nữa thôi đúng không? Nhưng mình sẽ dùng cái nào? Mình có 2 bản collection, 1 cái là phân chia ra từng request và xếp thành từng folder riêng, 1  cái thì gom lại hết, bấm send là chạy luôn full toàn bộ các test

---

## Prompt 7 *(2026-10-22T04:51:24.379302Z)*
*Nguồn: Đọc tài liệu dự án*

vậy bạn cần đọc file collection đó để biết thêm thông tin không?

---

## Prompt 8 *(2026-10-22T04:53:13.857088Z)*
*Nguồn: Đọc tài liệu dự án*

vậy thì gom lại đi cho gon, xong rồi mình xóa cái collection của data driven được rồi đúng không? Và bạn cũng nhắc lại quy trình làm chi tiết hơn đi

---

## Prompt 9 *(2026-10-22T04:56:40.924145Z)*
*Nguồn: Đọc tài liệu dự án*

bạn nói rõ hơn phần D và E đi, bạn có thể nêu ví dụ là mình sẽ thêm gì và thêm bao nhiêu dòng không? Còn phần E thì bạn mô tả rõ hơn mấy chỗ cần chụp không?

---

## Prompt 10 *(2026-10-22T09:04:43.819776Z)*
*Nguồn: Đọc tài liệu dự án*

mình đã chụp và test xong, kết quả như bạn dự đoán, mình cũng đã chụp hình lại, tổng công 14 tấm. Mình nên đặt tên thế nào đây? Và tiếp theo thì ta sẽ làm gì tiếp?

---

## Prompt 11 *(2026-10-22T09:13:46.446454Z)*
*Nguồn: Đọc tài liệu dự án*

mình nghĩ là trước khi khép lại thì ta nên viết 1 file report.md tổng kết lại những gì đã thu hoạch được trong phần csv này

---

## Prompt 12 *(2026-10-22T09:25:11.265707Z)*
*Nguồn: Đọc tài liệu dự án*

mình hỏi lại chút là chỉ cần feed 4 prompt cho agent thôi hay ta cần thêm file gì nữa không?

---

## Prompt 13 *(2026-10-22T09:59:28.132452Z)*
*Nguồn: Đọc tài liệu dự án*

đây là toàn bộ mọi thứ

---

## Prompt 14 *(2026-10-22T10:06:06.663571Z)*
*Nguồn: Đọc tài liệu dự án*

Nếu mà đã phát hiện thêm lỗi thì cứ việc thêm vào, mục tiêu của ta là tìm càng nhiều lỗi càng tốt. Giờ bạn sang bước tiếp theo đi

---

## Prompt 15 *(2026-10-22T14:25:34.694309Z)*
*Nguồn: Đọc tài liệu dự án*

Continue

---

## Prompt 16 *(2026-10-22T23:05:49.985120Z)*
*Nguồn: Đọc tài liệu dự án*

Continue

---

## Prompt 17 *(2026-10-22T23:14:16.605947Z)*
*Nguồn: Đọc tài liệu dự án*

mình đã có nói lại với nhóm một chút về nội dung ta chuẩn bị và có 1 phần nữa mình tưởng đã bỏ nhưng thực ra vẫn làm: **Ứng dụng Workflow AI (Human-in-the-loop):**
- Thay vì chỉ chat hỏi đáp thông thường hoặc tự xây dựng Agent mới, nhóm tập trung **phát triển các "Skill" (Kỹ năng/Quy trình) chuyên biệt** để điều khiển các AI Agent có sẵn (như Antigravity/Gemini) thực hiện kiểm thử tự động.
- **Quy trình:**
  1. Viết tài liệu `SKILL.md` định nghĩa nghiêm ngặt quy tắc test (không được tự bịa dữ liệu, sinh test matrix thế nào).
  2. Nạp đặc tả OpenAPI Spec và áp dụng Skill cho Agent.
  3. Agent tuân thủ Skill để phân tích và tự động sinh mã test (bằng Karate).
  4. *Con người review, chỉnh sửa và quyết định chạy thật.*                                                          trong phần skill này, mình có thể tìm 1 bộ skill trên internet hoặc tự phát triển skill riêng nếu được. Ngoài ra thì đây là readme mà bên ddoscos chuẩn bị sẵn: Mục tiêu: Thể hiện quy trình Human-in-the-loop: Nạp Skill -> Sinh test matrix có traceability -> Con người review duyệt ca test -> Sinh Karate feature -> Chạy và đánh giá.

* `skills/`: Chứa các Skill tái sử dụng (`api-test-design`).
* `prompts/`: Lời nhắc hệ thống và chỉ dẫn nhiệm vụ.
* `executions/`: Lưu vết chạy, log hội thoại, bảng review test matrix.                               Bạn thấy thế nào về phần này?

---

## Prompt 18 *(2026-10-22T23:19:12.261328Z)*
*Nguồn: Đọc tài liệu dự án*

à bên đó chỉ chuẩn bị khung sườn để ta biết cấu trúc folder với workflow thôi, nên ta phải viết lại từ đầu. Còn khi mình hỏi nhóm mình thì bên đó nói mình có toàn quyền quyết định, muốn viết thế nào cũng được.Mình cũng ưu tiên chọn tự viết prompt, nhưng mình cũng muốn nó đơn giản thôi, đừng quá phức tạp. Giờ bạn bắt tay vào làm luôn đi

---

## Prompt 19 *(2026-10-22T23:26:24.999135Z)*
*Nguồn: Kiểm tra file OpenAPI*

bạn mình vừa gửi cái này và muốn mình kiểm tra, nhưng nó là gì vậy, mình đọc không hiểu lắm?

---

## Prompt 20 *(2026-10-22T23:28:21.247578Z)*
*Nguồn: Kiểm tra file OpenAPI*

à mình cũng thấy có 2 file này cũng là openapi, bạn đọc 2 file này và so sánh với file kia thử đi

---

## Prompt 21 *(2026-10-22T23:32:51.988652Z)*
*Nguồn: Kiểm tra file OpenAPI*

à là bản trong file zip thực chất là bản có chữ NO_ANSWER à?

---

## Prompt 22 *(2026-10-22T23:35:47.546016Z)*
*Nguồn: Kiểm tra file OpenAPI*

bạn mình có nói là muốn mình chạy thử bộ test skill này trực tiếp, ghi chép lại các respond và viết 1 báo cáo ngắn để đánh giá mức độ hoàn thiện của prompt này. nhưng mình chưa từng dùng skill thì mình phải làm gì? Mình muốn bạn hướng dẫn mình chạy từ đầu đến cuối và viết báo cáo với mình luôn.

---

## Prompt 23 *(2026-10-22T23:48:24.173784Z)*
*Nguồn: Kiểm tra file OpenAPI*

Bây giờ mình chạy để viết báo cáo thì agent sẽ là bạn đi, nhưng ta phải ghi rõ chi tiết quá trình thực hiện. Vì mình có 1 ý tưởng mới, mình dự định là khi quay video demo (đây là 1 phần khác, chạy thử này là test, demo quay video kia sẽ là show cho mọi người cách chạy) thì mình sẽ dùng gemini. Mình sẽ show ra kết quả của bạn (claude) và đối chiếu hiệu năng của cả 2 luôn. Như vậy là ổn rồi đúng không. Vậy bây giờ thì bạn chạy test để mình với bạn nắm được sơ bộ kết quả và viết báo cáo giúp mình đi. Sau đó thì viết 1 bản hướng dẫn chi tiết (Bản này sẽ là doc hướng dẫn cách chạy skill của nhóm cần nộp chính thức) cách chạy skill để sau này khi mình demo thì mình biết cách tự chạy luôn

---

## Prompt 24 *(2026-10-22T23:55:34.658654Z)*
*Nguồn: Kiểm tra file OpenAPI*

Mình cũng trả lời mấy câu bạn hỏi luôn: điểm 1 và 2, file openapi đã chạy thật và check luôn là source of truth, trong trường hợp không có, ta mới dựa vào SRS, điểm 9, nếu trong test có bất kì chỗ nào cần yêu cầu tạo test tạm và không mâu thuẫn với tài liệu thì hãy linh động tự tạo mà không cần hỏi ý kiến. Các phần còn lại đã ổn, sang bước kế tiếp

---

## Prompt 25 *(2026-10-23T04:03:17.644730Z)*
*Nguồn: Đọc tài liệu dự án*

Continue

---

## Prompt 26 *(2026-10-23T04:24:42.086449Z)*
*Nguồn: Kiểm tra file OpenAPI*

Mình cũng trả lời mấy câu bạn hỏi luôn: điểm 1 và 2, file openapi đã chạy thật và check luôn là source of truth, trong trường hợp không có, ta mới dựa vào SRS, điểm 9, nếu trong test có bất kì chỗ nào cần yêu cầu tạo test tạm và không mâu thuẫn với tài liệu thì hãy linh động tự tạo mà không cần hỏi ý kiến. Các phần còn lại đã ổn, sang bước kế tiếp

---

## Prompt 27 *(2026-10-23T04:38:12.308308Z)*
*Nguồn: Kiểm tra file OpenAPI*

đúng, bản có đáp án là bản chạy mới nhất, vì vài lý do mà bản không đáp án sẽ bị hơi outdate vài chỗ. Qua vấn đề này thì mình nghĩ nên nói lại với người soạn phần skill này. Bạn có những điểm cần người đó chú ý hoặc sửa lại nào thì hãy viết ra. Ngoài ra thì mình cũng có thắc mắc: khi test skill thì ta cần prompt đúng không? Mấy prompt đó ở đâu vậy? Nếu chưa có bạn có thể soạn giúp mình không?

---

## Prompt 28 *(2026-10-23T04:43:50.291317Z)*
*Nguồn: Đọc tài liệu dự án*

mình có nhờ 1 người trong nhóm chạy thử và họ gửi lại thế này: Cao

1. Nguồn chuẩn đang mâu thuẫn. `SKILL.md` (mục “Đầu vào bắt buộc”), `inputs/srs.md` và comment trong `examples/coupon.feature` (“SRS thắng OpenAPI”) vẫn ghi SRS là nguồn chuẩn. Nhóm thực tế dùng OpenAPI đã chạy thật. Cần chốt một quy tắc và sửa đồng bộ.
2. `inputs/openapi.yaml` đã cũ so với bản chạy mới nhất. Mình thấy khác ở `apply-coupon` (không có `bearerAuth`, 401, 403), ví dụ `resetToken` 4 chữ số thay vì 6, `phone` không có pattern, `price` cho phép 0. Nên giữ một bản gốc (có đáp án) ngoài `inputs/` và tạo bản đưa cho Agent bằng script xóa `x-known-deviations` cùng các câu nhắc mã lỗi B hay Postman, để hai bản không lệch nhau. `inputs/README.md` đang khuyên “chép đè bản mới hơn”, dễ chép nhầm bản có đáp án vào.
3. Prompt Bước 3 tự mâu thuẫn. `tasks.md` bảo Agent chạy “bằng lệnh trong karate-guide.md”, nhưng mục đó ghi “người dùng, không phải agent”.
4. Luật dữ liệu tạm. Skill chỉ cho tài khoản tạm qua `register`. Nhóm đã quyết cho tự tạo dữ liệu tạm khi không mâu thuẫn tài liệu, nên cần ghi vào `SKILL.md`.

Trung bình
5. Template matrix thiếu mục “Quy ước dữ liệu” (tài khoản tạm, ca chạy chậm).
6. `karate-guide.md` thiếu ba mẫu đã chạy được: hàm tạo tài khoản tạm dùng chung, đọc `login_attempts` qua API admin (`karate.jsonPath(...)[0]`), và chờ bằng `* eval java.lang.Thread.sleep(31000)`.
7. `check_coverage.py` coi mọi dòng `match` là assertion mạnh, kể cả `match response.error == '#string'`. Nên cảnh báo khi scenario chỉ kiểm kiểu mà không kiểm giá trị.
8. `sample-data.md` không có id mã giảm giá và không có mã `is_active = 0`, nên một số ca không phủ được. Cần bổ sung hoặc ghi rõ là giới hạn.
9. README nói Antigravity tìm skill ở `.agents/skills/` nhưng tự ghi là chưa kiểm chứng. Cần xác nhận trên bản thật trước khi quay demo.
Thấp
10. `srs.md`: tiêu đề lặp hai lần, còn câu “thí nghiệm A, B, C”, FR-05 lặp ý “đúng một thẻ h1”.
11. `conversation.md` đang là “tùy chọn”. Nếu muốn so sánh Claude với Gemini thì nên bắt buộc, kèm tên và phiên bản model.                                                     và ngoài ra thì người đó hỏi là srs có vài chỗ mâu thuẫn với opanapi trong folder (không có đáp án) thì ta vẫn sẽ ưu tiên srs đúng không? Hay vẫn theo openapi?

---

## Prompt 29 *(2026-10-23T04:51:34.163248Z)*
*Nguồn: Đọc tài liệu dự án*

cái này thì mình thấy nhóm nói là ổn nhất

---

## Prompt 30 *(2026-10-23T05:02:46.785188Z)*
*Nguồn: Kiểm tra file OpenAPI*

người đó có trả lời thế này: 1	Đã chốt quy tắc ở trên và sửa đồng bộ
2	Đã có tools/make_agent_openapi.py (xóa x-known-deviations, chú thích mã lỗi, câu nhắc Postman, rồi quét lại). inputs/README.md giờ cấm chép tay và yêu cầu để bản master ngoài workspace của Agent. Chưa thay inputs/openapi.yaml, 
3	Đã sửa: mục chạy đổi thành “Lệnh chạy (dùng khi người nói chạy)”, Bước 3 khớp, máy chủ do người bật
4	SKILL.md giờ cho tự tạo dữ liệu tạm khi không trái tài liệu, nhưng cấm bịa dữ liệu có sẵn
5	Matrix thêm mục “Quy ước dữ liệu” và bảng “Ca chạy chậm”
6	Thêm ba mẫu vào karate-guide.md kèm hàm helpers/create-user.feature
7	Script cảnh báo ca chỉ kiểm kiểu dữ liệu (#string, #number...); #notpresent và [] vẫn tính là mạnh
8	sample-data.md có id mã giảm giá 1 đến 4 và ghi giới hạn: không tạo được mã is_active = 0 qua API (xem bên dưới)
9	Chưa xác nhận được. README có bước kiểm tra bắt buộc và câu dự phòng trong prompt hệ thống
10	Xóa tiêu đề lặp và câu nhắc thí nghiệm A, B, C; gộp ý lặp ở FR-05
11	conversation.md thành bắt buộc, có mẫu, kèm tên và phiên bản mô hình ở result.md                                          file openapi thì người đó nói nếu file có đáp án mới hơn thì cứ sử dụng file đó nhưng phải tạo ra 1 file không đáp án để tránh việc ai học vẹt. Bây giờ người đó cũng gửi lại phần mới thế này

---

## Prompt 31 *(2026-10-23T09:55:03.621910Z)*
*Nguồn: Đọc file và điền AI run log*

bạn hãy đọc hết các file này và điền kết quả vào file AI run log C template giúp mình

---

## Prompt 32 *(2026-10-23T09:59:42.575843Z)*
*Nguồn: Đọc file và điền AI run log*

có thêm file này nữa thì sao

---

## Prompt 33 *(2026-10-23T10:48:29.687330Z)*
*Nguồn: Đọc file và điền AI run log*

với phần test này, mình nên quay video demo thế nào? Thời gian tối đa 3 phút

---

## Prompt 34 *(2026-10-23T10:51:25.836679Z)*
*Nguồn: Đọc file và điền AI run log*

à, phần này sẽ là chỗ này trong checklist: - [x] **Postman P1**: Kịch bản cơ bản `GET /api/products` và Schema Check.
- [x] **Postman P2**: Kịch bản phức tạp Chained Token Auth (`POST /api/auth/login` ➔ lưu JWT token ➔ gọi API bảo vệ).

---

## Prompt 35 *(2026-10-23T10:54:26.784034Z)*
*Nguồn: Đọc file và điền AI run log*

có, bạn viết giúp mình đi

---

## Prompt 36 *(2026-10-23T11:19:21.936422Z)*
*Nguồn: Đọc file và điền AI run log*

đây sẽ là phần 2, csv . Bạn cũng tạo script cho mình đi, cũng 3 phút luôn

---

## Prompt 37 *(2026-10-23T11:44:05.067975Z)*
*Nguồn: Đọc file và điền AI run log*

viết script cho phần này đi. Trình tự là A và B so sánh nhau trước, rồi từ đó rút ra C, sau đó thì ta sẽ dùng kinh nghiệm phát triển skill

---

## Prompt 38 *(2026-10-23T11:51:36.810054Z)*
*Nguồn: Đọc file và điền AI run log*

do phần này khá dài nên ta có khoảng 6 phút chứ không phải 3
