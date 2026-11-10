# HW03 – Task 2: Kế hoạch đánh giá khả năng sử dụng (Usability Evaluation)

> **Trạng thái:** Bản nháp ban đầu do AI sinh, cần được tác giả chỉnh theo dữ liệu thực tế của EShop và theo kết quả buổi thử (pilot).
> Các chỗ có dạng **[ĐIỀN: ...]** là thông tin phải do tác giả tự điền sau khi xem dữ liệu thật của SUT.

## 1. Flow được chọn

| Hạng mục | Nội dung |
|---|---|
| Flow | Tìm kiếm sản phẩm theo tên → Duyệt danh sách kết quả → Xem chi tiết sản phẩm |
| Yêu cầu liên quan | Pool A: FR-05 (Danh sách sản phẩm và tìm kiếm), FR-06 (Xem chi tiết sản phẩm) |
| Điểm bắt đầu | Trang chủ EShop, trạng thái **[ĐIỀN: chưa đăng nhập / đã đăng nhập bằng tài khoản có sẵn]** |
| Điểm kết thúc | Trang chi tiết của sản phẩm mà người tham gia chọn. Flow **không** bao gồm thêm vào giỏ hàng hay thanh toán |

Lưu ý: EShop chỉ có tìm kiếm theo tên, không có bộ lọc, nên bước "lọc" được thay bằng việc người dùng tự duyệt và so sánh các kết quả.

## 2. Mục tiêu đánh giá

Các câu hỏi mà buổi đánh giá cần trả lời:
1. Người dùng có tìm được sản phẩm phù hợp với nhu cầu bằng ô tìm kiếm theo tên và danh sách kết quả mà không cần hướng dẫn không?
2. Ô tìm kiếm (chỉ tìm theo tên) có dễ nhận ra, dễ hiểu và cho kết quả đúng như người dùng mong đợi không, kể cả khi họ gõ từ khoá khác với tên sản phẩm?
3. Khi tìm không ra hoặc đi sai hướng, người dùng nhận biết và quay lại bằng cách nào, có gặp bế tắc không?
4. Trang chi tiết có đủ thông tin để người dùng tự tin quyết định mua hay không, và họ có tin tưởng thông tin hiển thị không?

## 3. Người tham gia

- **Số lượng:** 7 người thật, mỗi người một buổi, cộng thêm 1 người cho buổi thử (pilot).
- **Điều kiện:** người có thói quen mua sắm trực tuyến; **không** thuộc lớp đang học HW03; ưu tiên người không làm IT hoặc kiểm thử.
- **Thông tin bắt buộc:** họ tên và liên hệ xác thực (Zalo hoặc SĐT, che 4 số giữa); TA có thể gọi kiểm tra ngẫu nhiên 2 người.
- Danh sách thật được ghi ở mục 10. Danh sách này **không** được để AI tạo hay điền.

## 4. Kịch bản nhiệm vụ (đọc cho người tham gia)

> Bạn đang muốn mua **[ĐIỀN: loại sản phẩm]** với ngân sách khoảng **[ĐIỀN: mức giá hoặc khoảng giá]** trên trang web mua sắm này.
> Hãy tìm một sản phẩm phù hợp với nhu cầu của bạn, xem thông tin chi tiết của nó, rồi cho tôi biết bạn có quyết định mua sản phẩm đó không và vì sao.

- Kịch bản chỉ đưa mục tiêu, **không** chỉ dẫn từng bước, và **không** nhắc đến tên các nút hay chức năng (như "ô tìm kiếm").
- Giá trị trong kịch bản phải chọn sao cho có ít nhất một sản phẩm thật trong dữ liệu của EShop thoả điều kiện, và có thể tìm thấy bằng từ khoá theo tên (vì EShop chỉ tìm theo tên).

**Tiêu chí hoàn thành**
- **Thành công:** người tham gia tới được trang chi tiết của một sản phẩm thoả điều kiện trong kịch bản mà không cần hỗ trợ.
- **Thành công có hỗ trợ:** hoàn thành sau khi người điều phối phải gợi ý (ghi rõ gợi ý nào).
- **Thất bại:** từ bỏ hoặc không tới được trang chi tiết phù hợp.

## 5. Chỉ số thu thập

| Chỉ số | Cách ghi nhận |
|---|---|
| Kết quả hoàn thành | Thành công / Thành công có hỗ trợ / Thất bại |
| Thời gian hoàn thành | Tính từ khi đọc xong kịch bản đến khi vào trang chi tiết (đo bằng bản ghi màn hình) |
| Số lần đi sai hướng | Số lần mở nhầm sản phẩm, xoá từ khoá và tìm lại... |
| Số lần cần gợi ý | Mỗi lần người điều phối phải can thiệp |
| Điểm SUS | Từ phiếu ở mục 7 |
| Phản hồi mở | Từ các câu hỏi ở mục 8 |

## 6. Quy trình một buổi (dành cho người điều phối)

**Chuẩn bị:** mở sẵn EShop ở trang bắt đầu; bật ghi màn hình (và âm thanh nếu người tham gia đồng ý); chuẩn bị phiếu SUS và bảng ghi chú.

**Bước 1 – Mở đầu (khoảng 2 phút).** Nói rõ: "Chúng tôi đang kiểm tra *trang web*, không kiểm tra bạn. Không có đúng hay sai. Hãy vừa làm vừa nói ra điều bạn đang nghĩ." Xin phép ghi hình/ghi âm và ghi lại sự đồng ý.

**Bước 2 – Thực hiện nhiệm vụ (đề xuất tối đa khoảng 10 phút, chỉnh sau pilot).**
- Đọc kịch bản, không giải thích thêm giao diện.
- Quan sát trung lập, không gợi ý, không nhìn vào màn hình theo kiểu dẫn hướng.
- Chỉ can thiệp khi người tham gia **hoàn toàn bế tắc** hoặc đã quá thời gian; khi đó đưa một gợi ý trung tính và ghi lại.
- Nếu người tham gia hỏi "Cái này bấm được không?", trả lời: "Bạn cứ làm theo cách bạn nghĩ."

**Bước 3 – Kết thúc.** Cho người tham gia làm phiếu SUS, sau đó hỏi các câu ở mục 8, đào sâu vào những chỗ khó mà bạn đã quan sát được.

## 7. Phiếu SUS (System Usability Scale)

Thang điểm: 1 = Hoàn toàn không đồng ý, 5 = Hoàn toàn đồng ý.

| # | Phát biểu | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| 1 | Tôi nghĩ rằng tôi sẽ muốn sử dụng hệ thống này thường xuyên. | | | | | |
| 2 | Tôi thấy hệ thống này phức tạp một cách không cần thiết. | | | | | |
| 3 | Tôi thấy hệ thống này dễ sử dụng. | | | | | |
| 4 | Tôi nghĩ rằng tôi sẽ cần sự hỗ trợ của người có chuyên môn kỹ thuật để dùng được hệ thống này. | | | | | |
| 5 | Tôi thấy các chức năng trong hệ thống này được kết hợp với nhau tốt. | | | | | |
| 6 | Tôi thấy hệ thống này có quá nhiều điểm không nhất quán. | | | | | |
| 7 | Tôi cho rằng hầu hết mọi người sẽ học cách dùng hệ thống này rất nhanh. | | | | | |
| 8 | Tôi thấy hệ thống này rất cồng kềnh khi sử dụng. | | | | | |
| 9 | Tôi cảm thấy rất tự tin khi sử dụng hệ thống này. | | | | | |
| 10 | Tôi cần học hỏi rất nhiều điều trước khi có thể bắt đầu dùng hệ thống này. | | | | | |

**Cách tính điểm SUS (0–100):**
- Câu lẻ (1, 3, 5, 7, 9): điểm đóng góp = điểm chọn − 1.
- Câu chẵn (2, 4, 6, 8, 10): điểm đóng góp = 5 − điểm chọn.
- Tổng 10 điểm đóng góp rồi nhân với 2,5. Điểm của nhóm là trung bình của 7 người.

## 8. Câu hỏi mở sau phiên

Bốn nhóm bắt buộc theo đề (rõ ràng, khôi phục lỗi, tốc độ, tin tưởng), cùng một câu đào sâu:

| Nhóm | Câu hỏi |
|---|---|
| Rõ ràng (clarity) | Bạn có hiểu các nhãn, nút và kết quả tìm kiếm trên trang không? Có chỗ nào khiến bạn không chắc nó dùng để làm gì? |
| Khôi phục lỗi (error recovery) | Khi kết quả không như bạn muốn hoặc bạn đi nhầm, bạn đã làm gì để quay lại? Việc đó dễ hay khó? |
| Tốc độ (speed) | Bạn thấy việc tìm sản phẩm nhanh hay chậm so với các trang mua sắm bạn hay dùng? Có bước nào khiến bạn phải chờ không? |
| Tin tưởng (trust) | Thông tin ở trang chi tiết có đủ để bạn quyết định mua không? Bạn có tin vào thông tin đó không, vì sao? |
| Đào sâu | Hãy nói thêm về lúc [ĐIỀN: tình huống cụ thể đã quan sát được]. Khi đó bạn đang nghĩ gì? |

## 9. Mẫu ghi chú quan sát (mỗi người một bản)

| Mục | Nội dung |
|---|---|
| Mã người tham gia | P1–P7 (và PILOT) |
| Ngày giờ, trình duyệt, thiết bị | |
| Đồng ý ghi hình / ghi âm | Có / Không |
| Kết quả hoàn thành | Thành công / Có hỗ trợ / Thất bại |
| Thời gian hoàn thành | |
| Số lần đi sai hướng | |
| Số lần gợi ý (và nội dung) | |
| Điểm SUS | |

**Nhật ký quan sát**

| Thời điểm (mm:ss) | Hành động / lời nói của người tham gia | Loại (lỗi, ngập ngừng, bực bội, ...) | Ghi chú |
|---|---|---|---|
| | | | |

## 10. Bảng người tham gia (điền bằng thông tin thật)

| Mã | Họ tên | Liên hệ (Zalo/SĐT, che 4 số giữa) | Nghề nghiệp / độ tuổi (tuỳ chọn) | Ngày giờ buổi thử | Ghi chú |
|---|---|---|---|---|---|
| PILOT | | | | | |
| P1 | | | | | |
| P2 | | | | | |
| P3 | | | | | |
| P4 | | | | | |
| P5 | | | | | |
| P6 | | | | | |
| P7 | | | | | |

## 11. Thang mức độ nghiêm trọng (dùng khi phân tích)

| Mức | Tên | Định nghĩa |
|---|---|---|
| 4 | Blocker | Ngăn người dùng hoàn thành nhiệm vụ |
| 3 | Major | Gây khó khăn hoặc mất nhiều thời gian đáng kể, nhiều người gặp phải |
| 2 | Minor | Gây khó chịu nhẹ, người dùng vẫn hoàn thành được |
| 1 | Cosmetic | Vấn đề về hình thức, không ảnh hưởng việc hoàn thành |

Khi phân tích, nhóm các vấn đề giống nhau lại, **tách lỗi riêng lẻ (bug) khỏi vấn đề thiết kế có hệ thống**, rồi xếp theo mức nghiêm trọng. Những lỗi thật cần báo cả trong báo cáo và trên GitHub Issues kèm ảnh chụp.

## 12. Danh sách việc chuẩn bị

- [ ] Xem dữ liệu sản phẩm của EShop để chọn giá trị cho kịch bản (mục 4)
- [ ] Quyết định trạng thái bắt đầu (đã đăng nhập hay chưa)
- [ ] Liên hệ và hẹn lịch với 1 người pilot và 7 người tham gia
- [ ] Chạy pilot, chỉnh kịch bản, thời gian và câu hỏi
- [ ] Chuẩn bị công cụ ghi màn hình và mẫu xin phép ghi hình
- [ ] In hoặc mở sẵn phiếu SUS và mẫu ghi chú cho từng buổi
