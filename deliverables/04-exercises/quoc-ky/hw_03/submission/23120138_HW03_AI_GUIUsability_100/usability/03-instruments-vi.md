# Bộ công cụ đánh giá độ khả dụng (Dành cho người tham gia)

Tài liệu này bao gồm toàn bộ biểu mẫu, kịch bản giao tiếp và phiếu câu hỏi bằng tiếng Việt phục vụ các buổi kiểm thử độ khả dụng (Usability Testing) cho hệ thống EShop. Có thể in ra giấy hoặc chuyển thành biểu mẫu Google Forms.

---

## 1. Phiếu đồng ý tham gia (Informed Consent Form)

**DỰ ÁN NGHIÊN CỨU ĐỘ KHẢ DỤNG HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ ESHOP**  
*Học phần: Kiểm thử phần mềm (CSC13003) – Khoa Công nghệ Thông tin, Trường ĐH KHTN, ĐHQG-HCM*  
*Người điều phối (Sinh viên thực hiện): Nguyễn Quốc Kỳ (MSSV: 23120138)*

Xin chào bạn,

Cảm ơn bạn đã đồng ý dành thời gian tham gia buổi đánh giá độ khả dụng của hệ thống website thương mại điện tử EShop. Trước khi bắt đầu, xin bạn vui lòng đọc kỹ các thông tin sau:

1. **Mục đích:** Buổi thử nghiệm này nhằm đánh giá mức độ tiện dụng, thân thiện và các khó khăn trên giao diện của trang web EShop. **Chúng tôi kiểm thử sản phẩm, hoàn toàn KHÔNG kiểm tra năng lực hay kiến thức của bạn.** Trong quá trình thao tác, bạn không thể làm sai; bất kỳ khó khăn nào bạn gặp phải đều là thông tin quý giá giúp cải tiến phần mềm.
2. **Ghi hình & âm thanh:** Buổi kiểm thử sẽ tiến hành ghi lại màn hình thao tác và giọng nói của bạn để phục vụ việc phân tích học thuật nội bộ.
3. **Quyền riêng tư:** Toàn bộ thông tin cá nhân (họ tên, số điện thoại, Zalo) của bạn sẽ được bảo mật và che một phần (ví dụ: `091****890`) trong các báo cáo công khai. Dữ liệu ghi hình chỉ được dùng cho mục đích học tập của môn học.
4. **Quyền rút lui:** Bạn có quyền tạm dừng hoặc dừng hoàn toàn buổi thử nghiệm bất kỳ lúc nào mà không cần giải thích lý do.
5. **Xác minh từ Giảng viên/Trợ giảng:** Giảng viên hoặc Trợ giảng môn học có thể gọi điện thoại ngẫu nhiên tới 1–2 người tham gia để xác nhận bạn đã thực sự tham gia buổi thử nghiệm.

---

**XÁC NHẬN CỦA NGƯỜI THAM GIA:**

- Tôi đồng ý tham gia buổi đánh giá độ khả dụng này:  
  [ ] Có &nbsp;&nbsp;&nbsp;&nbsp; [ ] Không
- Tôi đồng ý cho phép ghi lại màn hình và âm thanh trong quá trình thực hiện nhiệm vụ:  
  [ ] Có &nbsp;&nbsp;&nbsp;&nbsp; [ ] Không
- Tôi đồng ý cho Giảng viên / Trợ giảng liên hệ xác nhận sự tham gia của tôi:  
  [ ] Có &nbsp;&nbsp;&nbsp;&nbsp; [ ] Không

Họ và tên: ..................................................................................................................  
Số điện thoại / Zalo: ....................................................................................................  
Chữ ký: ................................................................ Ngày: ......./......./2026

---

## 2. Kịch bản điều phối (Moderator Script)

### Bước 1: Đón tiếp và phổ biến quy trình (2 phút)
> *"Chào bạn [Tên người tham gia], cảm ơn bạn rất nhiều vì đã nhận lời tham gia buổi thử nghiệm hôm nay.  
> Mình đang thực hiện một nghiên cứu đánh giá trải nghiệm người dùng trên một trang web mua sắm trực tuyến có tên là EShop.  
> Mình xin nhấn mạnh lại là hôm nay tụi mình đang **kiểm tra trang web, chứ không hề kiểm tra bạn**. Không có thao tác nào là 'sai' cả. Nếu trang web khó dùng hay làm bạn bối rối, đó hoàn toàn là lỗi thiết kế của hệ thống.  
> Trong suốt quá trình thực hiện, bạn hãy áp dụng phương pháp **Nói to suy nghĩ (Think-Aloud)** nhé: Bạn đang định bấm vào đâu, bạn mong đợi điều gì hiện ra, hay bạn cảm thấy nút này khó hiểu, hãy cứ thoải mái nói to ra thành tiếng. Mình sẽ chỉ ngồi quan sát và ghi chép lại thôi."*

### Bước 2: Giao kịch bản nhiệm vụ (Task Prompt)
Người điều phối mở sẵn trình duyệt tại trang chủ `http://localhost:3000` (đã đăng nhập tài khoản test và giỏ hàng trống), sau đó đưa tờ giấy kịch bản cho người tham gia và đọc:
> *"Bây giờ, bạn hãy đóng vai một người mua sắm với tình huống sau:*  
> **'Bạn đang cần mua một món đồ công nghệ có giá từ 300.000 ₫ trở lên phục vụ học tập, làm việc trên website EShop. Cửa hàng vừa tặng bạn một mã giảm giá là `SAVE10`. Bạn hãy tìm một sản phẩm ưng ý thỏa điều kiện trên, áp dụng mã giảm giá này và tiến hành hoàn tất việc đặt hàng.'**  
> *Khi nào bạn sẵn sàng, bạn có thể bắt đầu. Mình xin phép bấm giờ nhé."*

*(Bấm giờ đồng hồ ngay khi người tham gia bắt đầu thao tác).*

### Bước 3: Quan sát và phản hồi trung lập (Trong khi thao tác)
- **Nếu người tham gia im lặng quá 15 giây:**  
  > *"Bạn đang suy nghĩ điều gì lúc này vậy?"* hoặc *"Bạn đang tìm kiếm thông tin gì trên màn hình?"*
- **Nếu người tham gia hỏi 'Bấm vào đây đúng không?' hoặc 'Nên làm gì tiếp theo?':**  
  > *"Bạn cứ thao tác theo đúng cách mà bạn cảm thấy hợp lý và tự nhiên nhất nhé."*
- **Quy tắc can thiệp (Intervention Protocol):**  
  - Tuyệt đối không gợi ý vị trí nút bấm hay quy trình thao tác.
  - **Chỉ can thiệp khi:** Người tham gia bế tắc hoàn toàn quá 2 phút (> 120 giây) ở cùng một lỗi/màn hình mà không thể tự giải quyết, hoặc người tham gia bày tỏ ý định từ bỏ.  
  - Khi can thiệp: Đưa ra gợi ý tối thiểu để họ tiếp tục, ghi chú rõ lý do vào sổ tay và đánh dấu kết quả buổi test là `assisted`.

### Bước 4: Kết thúc nhiệm vụ (Wrap-up)
- Dừng đồng hồ ngay khi màn hình hiện thông báo đặt hàng thành công (`Thanh toán thành công!`) hoặc khi nhiệm vụ kết thúc.
- Ghi nhận thời gian hoàn thành (giây).
- Chuyển sang Phiếu khảo sát SUS và Phỏng vấn sâu (Probe Questions).
> *"Cảm ơn bạn, bạn đã hoàn thành xong nhiệm vụ đặt hàng! Bây giờ xin phiền bạn dành 3–5 phút điền nhanh phiếu đánh giá trải nghiệm 10 câu hỏi và trả lời một vài câu hỏi ngắn của mình nhé."*

---

## 3. Phiếu đánh giá độ khả dụng hệ thống (SUS Questionnaire)

*Vui lòng khoanh tròn hoặc đánh dấu vào một con số từ **1** (Hoàn toàn không đồng ý) đến **5** (Hoàn toàn đồng ý) phản ánh đúng nhất cảm nhận tức thì của bạn về hệ thống vừa trải nghiệm.*

| STT | Câu hỏi | 1<br>(Hoàn toàn<br>không đồng ý) | 2<br>(Không<br>đồng ý) | 3<br>(Bình<br>thường) | 4<br>(Đồng<br>ý) | 5<br>(Hoàn toàn<br>đồng ý) |
|:---:|---|:---:|:---:|:---:|:---:|:---:|
| 1 | Tôi nghĩ rằng mình sẽ muốn sử dụng hệ thống này thường xuyên khi mua sắm. | [ ] | [ ] | [ ] | [ ] | [ ] |
| 2 | Tôi thấy hệ thống phức tạp một cách không cần thiết. | [ ] | [ ] | [ ] | [ ] | [ ] |
| 3 | Tôi thấy hệ thống dễ sử dụng. | [ ] | [ ] | [ ] | [ ] | [ ] |
| 4 | Tôi nghĩ mình cần sự trợ giúp của một người am hiểu kỹ thuật để có thể dùng được hệ thống này. | [ ] | [ ] | [ ] | [ ] | [ ] |
| 5 | Tôi thấy các chức năng trong hệ thống được kết hợp với nhau rất tốt và liền mạch. | [ ] | [ ] | [ ] | [ ] | [ ] |
| 6 | Tôi thấy hệ thống có quá nhiều điểm thiếu nhất quán (không đồng nhất giữa các màn hình/nút bấm). | [ ] | [ ] | [ ] | [ ] | [ ] |
| 7 | Tôi nghĩ hầu hết mọi người sẽ học được cách sử dụng hệ thống này rất nhanh chóng. | [ ] | [ ] | [ ] | [ ] | [ ] |
| 8 | Tôi thấy hệ thống này rất rườm rà và bất tiện khi thao tác. | [ ] | [ ] | [ ] | [ ] | [ ] |
| 9 | Tôi cảm thấy rất tự tin khi thao tác và hoàn tất đơn hàng trên hệ thống. | [ ] | [ ] | [ ] | [ ] | [ ] |
| 10 | Tôi phải học thêm rất nhiều điều trước khi có thể làm quen và sử dụng thành thạo hệ thống này. | [ ] | [ ] | [ ] | [ ] | [ ] |

---

## 4. Bộ câu hỏi phỏng vấn sâu (Post-Task Probe Questions & Ratings)

Người điều phối yêu cầu người tham gia cho điểm nhanh từ **1 đến 5** cho từng khía cạnh, sau đó phỏng vấn câu hỏi gợi mở để ghi nhận nguyên văn câu trả lời:

| Khía cạnh (Dimension) | Thang điểm đánh giá nhanh (1–5) | Câu hỏi phỏng vấn sâu (Probe Question) | Mục tiêu thu thập |
|---|---|---|---|
| **1. Tính rõ ràng<br>(Clarity)** | **Độ rõ ràng thông tin & giao diện:**<br>[ ] 1: Rất mập mờ / Khó hiểu<br>[ ] 2: Khá mập mờ<br>[ ] 3: Bình thường<br>[ ] 4: Khá rõ ràng<br>[ ] 5: Rất rõ ràng / Dễ hiểu | - *"Trong suốt quá trình từ lúc chọn sản phẩm đến khi thanh toán, bạn có luôn biết rõ mình đang ở bước nào không?"*<br>- *"Có nút bấm, nhãn chữ hay mức giá nào trên màn hình làm bạn thấy khó hiểu hoặc phân vân không?"* | Định lượng điểm Clarity (1–5) và phát hiện các nhãn gây nhầm lẫn, thông tin giá mập mờ, phân cấp thị giác kém. |
| **2. Khắc phục lỗi<br>(Error Recovery)** | **Khả năng nhận biết & khắc phục lỗi:**<br>[ ] 1: Rất khó tự sửa / Không hữu ích<br>[ ] 2: Khó tự sửa<br>[ ] 3: Bình thường<br>[ ] 4: Khá dễ tự sửa<br>[ ] 5: Rất dễ tự sửa / Thông báo rõ | - *"Khi bạn nhập mã giảm giá `SAVE10`, phản hồi của hệ thống có đủ rõ để bạn biết mã đã được áp dụng hay chưa không?"*<br>- *"Nếu xảy ra lỗi (hoặc bạn thử nhập sai), thông báo có chỉ rõ cho bạn cách sửa hay không?"* | Định lượng điểm Error Recovery (1–5) và đánh giá độ hữu ích của thông báo lỗi/thành công. |
| **3. Tốc độ & Luồng<br>(Speed & Flow)** | **Cảm nhận về tốc độ & luồng thao tác:**<br>[ ] 1: Rất chậm chạp / Rườm rà<br>[ ] 2: Hơi rườm rà<br>[ ] 3: Vừa phải<br>[ ] 4: Khá nhanh chóng<br>[ ] 5: Rất nhanh chóng / Gọn gàng | - *"Bạn cảm thấy toàn bộ quy trình mua hàng vừa rồi là nhanh, vừa phải hay rườm rà mất thời gian?"*<br>- *"Có bước nào bạn cảm thấy thừa thãi hoặc phải bấm nhiều lần không cần thiết không?"* | Định lượng điểm Speed (1–5) và phát hiện các bước thừa thãi, độ trễ và thao tác lặp. |
| **4. Độ tin cậy<br>(Trust)** | **Mức độ an tâm & tin tưởng hệ thống:**<br>[ ] 1: Rất bất an / Mất tin tưởng<br>[ ] 2: Khá lo lắng<br>[ ] 3: Bình thường<br>[ ] 4: Khá an tâm<br>[ ] 5: Hoàn toàn tin tưởng / Rất an tâm | - *"Ở bước xác nhận đơn hàng cuối cùng, bạn có cảm thấy yên tâm khi bấm nút đặt hàng không? Có chi tiết nào làm bạn nghi ngờ về số tiền hay đơn hàng không?"* | Định lượng điểm Trust (1–5) và đánh giá mức độ an tâm về tính minh bạch của số tiền sau giảm giá. |
