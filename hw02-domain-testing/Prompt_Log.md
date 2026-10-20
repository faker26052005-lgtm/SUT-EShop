# APPENDIX A: NHẬT KÝ CÂU LỆNH AI (FULL PROMPT LOG)

* **Môn học:** CS423 / CSC13003 – Kiểm chứng Phần mềm (AI-augmented · 2026)
* **Họ và tên:** NGUYỄN HOÀNG ANH TÚ
* **MSSV:** 23120183
* **Công cụ sử dụng:** Google Antigravity Agent (Gemini 2.5 / Claude 3.5 Sonnet)
* **Mục đích:** Lưu trữ toàn bộ lịch sử câu lệnh tương tác thực tế cho bài tập HW02-AI (Domain Testing & BVA)

---

**[1] 15:10 - 17/10/2026:**
> Hãy phân tích yêu cầu của bài tập W02 trong thư mục HW

**[2] 15:23 - 17/10/2026:**
> Vậy tức là cần sử dụng github repo của nhóm để commit hay chỉ cần git repo local

**[3] 15:26 - 17/10/2026:**
> Github issue là gì

**[4] 15:28 - 17/10/2026:**
> Vậy hãy tóm gọn lại các ý cần thực hiện và sử dụng các công cụ nào

**[5] 15:36 - 17/10/2026:**
> git commit log là log local repo của cá nhân có phải không?

**[6] 15:38 - 17/10/2026:**
> Hãy giúp tôi chọn 1 FR set gồm cả 4 pool theo yêu cầu

**[7] 15:40 - 17/10/2026:**
> Commit cái gì lên git?

**[8] 15:42 - 17/10/2026:**
> Có cần push nó lên github repo không và github issue có tạo được nếu không push gì lên không?

**[9] 15:44 - 17/10/2026:**
> Do repo trên đang thực hiện đề tài seminar dùng chính mã nguồn repo SUT này? có ảnh hưởng gì hay làm rối artifact không?

**[10] 15:51 - 17/10/2026:**
> Tại sao không tạo agent skill ngay từ đầu rồi áp dụng cho từng FR mà lại viết sau cùng

**[11] 15:54 - 17/10/2026:**
> Hãy đưa lại gợi ý 4 chức năng của 4 pool vừa rồi

**[12] 11:08 - 19/10/2026:**
> Hãy giải thích cách tạo ra một bộ skill như việc thiết kế test case dựa trên một kỹ thuật như domain testing và BVA

**[13] 11:17 - 19/10/2026:**
> Hãy tạo ngay một bộ skill như vậy

**[14] 11:23 - 19/10/2026:**
> Tôi vừa bổ sung tài liệu cho phần references dưới dạng file pdf, hãy chuyển nội dung của nó về dạng .md và nạp vào skill

**[15] 11:25 - 19/10/2026:**
> Tôi vừa bổ sung tài liệu cho phần references dưới dạng file pdf, hãy chuyển nội dung của nó về dạng .md và nạp vào skill

**[16] 11:31 - 19/10/2026:**
> Hãy cho tôi xem lại kế hoạch thực hiện bài tập này bao gồm các bước gì và tạo ra nội dung gì để đáp ứng yêu cầu của giảng viên tuyệt đối

**[17] 11:38 - 19/10/2026:**
> Hãy bắt đầu từng phần nhỏ và chỉ sang phần kế tiếp khi có sự cho phép của tôi, có vai trò "human-in-the-loop" nếu có nhiều lựa chọn

**[18] 11:43 - 19/10/2026:**
> Áp dụng skill domain-boundary-testing cho FR-01

**[19] 12:04 - 19/10/2026:**
> tạo branch riêng trên repo ở C:\Coding\SoftwareTesting\Seminar\src\eshop-sut và thực hiện commit các bước theo yêu cầu đề bài và tránh ảnh hưởng tới các nhánh khác

**[20] 12:52 - 19/10/2026:**
> Push lên github

**[21] 12:53 - 19/10/2026:**
> Khởi động ứng dụng bắt đầu kiểm thử

**[22] 13:04 - 19/10/2026:**
> Theo nguyên lý kiểm thử, sau mỗi lần chạy xong phải reset toàn bộ trạng thái của ứng dụng như db, làm cách nào đạt được

**[23] 13:08 - 19/10/2026:**
> Dùng cách 1, hãy bắt đầu chạy toàn bộ các test case của fr01 và ghi vào cột actual ouput/result, lần lượt từng test case 1 và để tôi review lại mỗi khi xong 1 test case

**[24] 13:13 - 19/10/2026:**
> Tiếp tục

**[25] 13:14 - 19/10/2026:**
> Tiếp

**[26] 13:18 - 19/10/2026:**
> Sau mỗi task hãy dọn dẹp rồi mới chạy test case kế tiếp đối với các test case đăng ký thành công (lưu vào db). Hãy chạy tc04

**[27] 13:19 - 19/10/2026:**
> Tiếp tục tc05

**[28] 13:27 - 19/10/2026:**
> Tiếp tục tc06

**[29] 13:29 - 19/10/2026:**
> Tiếp tục

**[30] 13:31 - 19/10/2026:**
> OK

**[31] 13:32 - 19/10/2026:**
> OK

**[32] 13:33 - 19/10/2026:**
> OK

**[33] 13:35 - 19/10/2026:**
> Mật khẩu đang có vấn đề là không cho kí tự @ và chấp nhận khoảng trắng, vậy tại sau các test case vừa qua được chọn là ValidPass@123

**[34] 13:37 - 19/10/2026:**
> Vậy các mật khẩu gì đã được nhập để bypass qua password textbox

**[35] 13:38 - 19/10/2026:**
> Về chính các test case đã bypass qua phần mật khẩu khi nãy

**[36] 13:40 - 19/10/2026:**
> OK hãy ghi chú vào và thực hiện tc kế tiếp

**[37] 13:41 - 19/10/2026:**
> Tiếp tục

**[38] 13:42 - 19/10/2026:**
> Tiếp

**[39] 13:43 - 19/10/2026:**
> Tiếp tục

**[40] 13:44 - 19/10/2026:**
> Chạy toàn bộ test case còn lại

**[41] 13:50 - 19/10/2026:**
> Tại sao TC-FR01-BA02/03/04 lại dùng password có ký tự @ thật mà không dùng dấu cách để bỏ qua

**[42] 13:53 - 19/10/2026:**
> Nếu không có ô nhập confirm password thì các test case vừa qua vẫn bypass mà không bị chặn hay bug nào

**[43] 14:00 - 19/10/2026:**
> Tại sao không có test case nào về việc tên là một số, ký tự đặc biệt hay email không được phép chứa ký tự đặc biệt như #@$.% vẫn bypass qua

**[44] 14:03 - 19/10/2026:**
> Email là "_@)" vẫn được chấp nhận

**[45] 14:05 - 19/10/2026:**
> Đưa 4 test case về dạng cô lập lỗi và đưa vào file cũng như ghi chú trong report

**[46] 14:08 - 19/10/2026:**
> Sửa lại toàn bộ các test case về dạng giữ các trường hợp lệ từ test case bypass hợp lệ đầu tiên và chỉ thay đổi phần cần thiết test để cô lập lỗi

**[47] 14:12 - 19/10/2026:**
> Kể cả email cũng dùng chung cho các trường hợp email hợp lệ, tại sao password đều đã được sửa lại về ValidPass 123 thay vì ValidPass@123 như giải thích ban đầu

**[48] 14:15 - 19/10/2026:**
> OK

**[49] 14:19 - 19/10/2026:**
> Việc ghi chú walkaround password nằm ở đâu

**[50] 14:24 - 19/10/2026:**
> THực hiện commit

**[51] 14:31 - 19/10/2026:**
> Trước tiên ta cần bổ sung baseline cô lập lỗi trong nguyên lý thiết kế test case của bộ agent skill như sau: Các test case dùng để phát hiện lỗi sẽ dùng lại toàn bộ dữ liệu của test case chuẩn ban đầu (không có lỗi) và chỉ sửa đổi phần cần kiểm tra, sử dụng walkaround khi cần và phải có ghi chú rõ ràng

**[52] 14:44 - 19/10/2026:**
> Tôi vừa bổ sung 2 file pdf hướng dẫn trình bày test case và test report ở C:\Coding\SoftwareTesting\.agents\skills\domain-boundary-testing\references, hãy nạp vào agent skill ở repo git và trình bày lại nội dung phần fr01 chuẩn cấu trúc hơn

**[53] 14:59 - 19/10/2026:**
> Hiện tại trong .csv, Test data: Name=baseline có nghĩa là gì

**[54] 15:02 - 19/10/2026:**
> Tại sao có thể test được TC-FR01-D15 khi không có trường Confirm pw

**[55] 15:03 - 19/10/2026:**
> Sửa lại

**[56] 15:05 - 19/10/2026:**
> Dừng toàn bộ ứng dụng eshop

**[57] 10:49 - 20/10/2026:**
> Nạp lại toàn bộ context trong conversation này

**[58] 10:51 - 20/10/2026:**
> Áp dụng skill domain-boundary-testing tiếp tục cho FR09

**[59] 11:52 - 20/10/2026:**
> Tiếp tục áp dụng skill domain-boundary-testing cho FR-15

**[60] 12:22 - 20/10/2026:**
> Có hãy áp dụng lên FR mobile cart

**[61] 13:14 - 20/10/2026:**
> Các test case phân hệ mobile đã được chạy thực sự chưa hay chỉ dựa trên phân tích mã nguồn

**[62] 13:22 - 20/10/2026:**
> Hướng 2

**[63] 13:29 - 20/10/2026:**
> Dọn dẹp cả 3 tiến trình của Eshop, và đề xuất bước tiếp theo để hoàn thiện bài nộp

**[64] 13:41 - 20/10/2026:**
> Hướng dẫn cách tạo và nội dung trê github issues

**[65] 13:45 - 20/10/2026:**
> Có cách nào làm agent tự tạo thay vì thêm thủ công không

**[66] 13:52 - 20/10/2026:**
> [Cung cấp GitHub Personal Access Token để tự động hóa tạo Issue]

**[67] 13:58 - 20/10/2026:**
> Nhắc lại về yêu cầu nộp video cũng như các artifact như gitlog, promt chat history, AI audit report...

**[68] 14:10 - 20/10/2026:**
> Tôi đã bổ sung file [AI-02] - FIT@HCMUS - AI Audit Report_Vn.docx, hãy điền giúp tôi dựa trên toàn bộ những gì đã làm trong cuộc trò chuyện này (Hãy điền một cách trung thực tránh hallucination)

**[69] 14:24 - 20/10/2026:**
> Điểm danh các artifact còn thiếu

**[70] 14:32 - 20/10/2026:**
> Chạy Eshop và mô tả vài kịch bản để chụp lỗi thêm vào minh chứng

**[71] 14:44 - 20/10/2026:**
> PS C:\Users\Asus TuF> curl.exe -X POST http://localhost:3000/api/coupons/apply -H "Content-Type: application/json" -d '{\"code\": \"FIXED50K\", \"total_amount\": 30000}'
> <!DOCTYPE html>
> <html lang="en">
> <head>
> <meta charset="utf-8">
> <title>Error</title>
> </head>
> <body>
> <pre>Cannot POST /api/coupons/apply</pre>
> </body>
> </html>
> PS C:\Users\Asus TuF>

**[72] 14:49 - 20/10/2026:**
> Khi quay video demo Agent skill trùng vào FR đã có như FR-01 thì có dẫn đến ghi đè hay khác biệt tới FR-01 cũ hay không

**[73] 14:51 - 20/10/2026:**
> OK hãy làm theo gợi ý 2, hướng dẫn các bước cần làm

**[74] 14:54 - 20/10/2026:**
> Ý tôi là sẽ thực hiện demo trên một FR khác

**[75] 15:10 - 20/10/2026:**
> Áp dụng skill domain-boundary-testing vào chức năng FR-02

**[76] 15:26 - 20/10/2026:**
> Kiểm tra yêu cầu bài nộp có yêu cầu nộp toàn bộ promt conversation không

