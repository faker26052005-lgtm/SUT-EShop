# HW03 – Task 2: Báo cáo đánh giá khả năng sử dụng (Usability Evaluation)

## 1. Tổng quan

| Hạng mục | Nội dung |
|---|---|
| SUT | EShop – https://github.com/ttbhanh/eshop-sut |
| Flow được đánh giá | Tìm kiếm sản phẩm theo tên → Xem các sản phẩm hiện ra → Mở chi tiết sản phẩm |
| Yêu cầu liên quan | Pool A: FR-05 (Product listing and search), FR-06 (Product detail view) |
| Điều kiện ban đầu | Đã đăng nhập vào tài khoản test |
| Nhiệm vụ thực hiện | Tìm kiếm sản phẩm có chứa chữ "mac", xem các sản phẩm hiện ra, bấm vào thông tin chi tiết của sản phẩm đầu tiên |
| Người thực hiện khảo sát | Hà Quốc Kiên |
| Số người tham gia | 7 người thật (P1–P7) và 1 buổi thử (pilot) |
| Ngày thực hiện | Pilot: 04/11/2026; 7 buổi thật: 08/11/2026 |
| Công cụ đo | SUS (System Usability Scale) và 4 câu hỏi mở |
| Ghi nhận | Ghi màn hình, không có âm thanh (người tham gia không muốn dùng micro); phiếu SUS và câu trả lời mở; ghi chú quan sát được tổng hợp lại sau buổi thử từ bản ghi màn hình |

**Lưu ý về phạm vi chức năng:** theo yêu cầu, FR-05 và FR-06 chỉ gồm danh sách sản phẩm với tìm kiếm theo tên và trang chi tiết sản phẩm. EShop không có bộ lọc; việc thiếu bộ lọc không được xem là lỗi mà chỉ được ghi nhận như nhận xét về thiết kế.

---

## 2. Mục tiêu đánh giá

1. Người dùng có tìm được sản phẩm và mở được trang chi tiết bằng ô tìm kiếm theo tên mà không cần hướng dẫn không?
2. Ô tìm kiếm có dễ nhận ra, dễ dùng và hoạt động đúng như người dùng mong đợi không?
3. Khi đi nhầm hoặc tìm không ra, người dùng quay lại bằng cách nào và có gặp bế tắc không?
4. Trang chi tiết có đủ thông tin để người dùng tự tin quyết định mua, và họ có tin tưởng thông tin hiển thị không?

---

## 3. Nhiệm vụ

Người tham gia được yêu cầu: **tìm kiếm sản phẩm có chứa chữ "mac", xem các sản phẩm hiện ra, rồi bấm vào thông tin chi tiết của sản phẩm đầu tiên** (đã đăng nhập sẵn bằng tài khoản test).

**Tiêu chí hoàn thành**

| Kết quả | Định nghĩa |
|---|---|
| Thành công | Tới được trang chi tiết của sản phẩm đầu tiên trong kết quả, không cần hỗ trợ |
| Thành công có hỗ trợ | Hoàn thành sau khi người điều phối phải đưa một gợi ý trung tính |
| Thất bại | Từ bỏ, hoặc không tới được trang chi tiết |

---

## 4. Công cụ đánh giá

### 4.1 Thang đo SUS
SUS là thang chuẩn gồm 10 câu, mỗi câu trả lời theo mức 1 đến 5, được quy đổi thành điểm 0–100. Thang này được chọn vì ngắn, phổ biến, phù hợp với mẫu nhỏ và người tham gia không chuyên về kỹ thuật. Phiếu và cách tính nằm ở Phụ lục A.

### 4.2 Câu hỏi mở (hỏi cả 7 người sau khi làm xong phiếu SUS)

| Nhóm | Câu hỏi |
|---|---|
| Rõ ràng | "Có chỗ nào trên trang mà bạn không hiểu hoặc không chắc nó dùng để làm gì không?" |
| Khôi phục lỗi | "Lúc bạn đi nhầm hoặc tìm không ra, bạn đã làm gì để quay lại? Việc đó dễ hay khó?" |
| Tốc độ | "Bạn thấy việc tìm sản phẩm trên trang này nhanh hay chậm?" |
| Tin tưởng | "Thông tin ở trang chi tiết có đủ để bạn quyết định mua không, và bạn có tin thông tin đó không?" |

### 4.3 Chỉ số định lượng khác
Kết quả hoàn thành, thời gian hoàn thành (ước lượng từ bản ghi màn hình) và việc người điều phối có phải gợi ý hay không, trình bày ở mục 7.1. Mức độ lúng túng của từng người được ghi nhận định tính ở mục 7.4; số lần đi sai hướng không được đo riêng.

---

## 5. Người tham gia

Tiêu chí: người có thói quen mua sắm trực tuyến, không thuộc lớp đang học HW03, ưu tiên người không làm IT hoặc kiểm thử. Thông tin liên hệ được che 4 số giữa.

| Mã | Họ tên | Liên hệ (SĐT, che 4 số giữa) | Ngày giờ buổi thử |
|---|---|---|---|
| PILOT | Nguyễn Thiện Nhân | MSSV: 23120064 | 04/11/2026 |
| P1 | Hà Quốc Bảo | 090****864 | 08/11/2026 |
| P2 | Hà Quốc Khải | 086****311 | 08/11/2026 |
| P3 | Lý Trương Thùy Linh | 079****790 | 08/11/2026 |
| P4 | Hồ Minh Hiếu | 093****805 | 08/11/2026 |
| P5 | Dương Trọng Hòa | 092****901 | 08/11/2026 |
| P6 | Lý Trương Liễu | 076****320 | 08/11/2026 |
| P7 | Hà Thái Linh | 076****369 | 08/11/2026 |

---

## 6. Buổi thử (Pilot)

Buổi thử với Nguyễn Thiện Nhân được thực hiện ngày 04/11/2026 để đảm bảo luồng hoạt động ổn định trước khi chạy 7 buổi thật. Buổi thử chỉ xác nhận luồng chạy ổn định, không phát hiện vấn đề cần điều chỉnh nên kịch bản và câu hỏi được giữ nguyên. Buổi này không được tính vào 7 người tham gia hay điểm SUS.

---

## 7. Kết quả

### 7.1 Kết quả từng người

Thời gian là **ước lượng từ bản ghi màn hình**, không đo bằng đồng hồ.

| Mã | Kết quả hoàn thành | Thời gian (ước lượng) | Gợi ý từ người điều phối | Ghi chú | Điểm SUS |
|---|---|---|---|---|---|
| P1 | Thành công | khoảng 20–25 giây | Không ghi nhận | Lúng túng nhẹ với nút xem chi tiết; dùng nút Search vì Enter không hoạt động | 35,0 |
| P2 | Thành công | khoảng 10–15 giây | Không ghi nhận | Sử dụng tốt, hiểu nhanh | 80,0 |
| P3 | Thành công | khoảng 10–15 giây | Không ghi nhận | | 35,0 |
| P4 | Thành công | khoảng 10–15 giây | Không | Dùng được mà không cần hướng dẫn | 62,5 |
| P5 | Thành công | khoảng 10–15 giây | Không ghi nhận | Có chút vướng lúc đầu nhưng nhanh chóng dùng được | 35,0 |
| P6 | Thành công có hỗ trợ | khoảng 10–15 giây | Có một gợi ý nhẹ về chỗ bấm nút "Xem chi tiết" | Dùng được sau khi được gợi ý | 52,5 |
| P7 | Thành công | khoảng 20–25 giây | Không ghi nhận | Lúng túng lúc đầu vì các nút bằng tiếng Anh | 12,5 |
| **Tổng hợp** | **7/7 hoàn thành** (6 độc lập, 1 có hỗ trợ) | trung bình khoảng 15 giây | 1/7 có gợi ý | | **44,6** |

*Thời gian trung bình được tính từ điểm giữa của các khoảng ước lượng (12,5 giây cho khoảng 10–15 và 22,5 giây cho khoảng 20–25).*

### 7.2 Điểm SUS

| Thống kê | Giá trị |
|---|---|
| Điểm trung bình (7 người) | **44,6** |
| Trung vị | 35,0 |
| Độ lệch chuẩn (mẫu) | 22,2 |
| Thấp nhất / cao nhất | 12,5 (P7) / 80,0 (P2) |
| Số người dưới 50 điểm | 4 trên 7 (P1, P3, P5, P7) |
| Số người từ 68 điểm trở lên | 1 trên 7 (P2) |

**Nhận xét.** Điểm trung bình 44,6 thấp hơn mốc tham khảo thường dùng khoảng 68 và nằm trong vùng thường được xem là có vấn đề về khả năng sử dụng. Các điểm số phân tán rất rộng (từ 12,5 đến 80,0), nên điểm trung bình chỉ nên được đọc như một xu hướng chung, đặc biệt khi chỉ có 7 người. Đa số người tham gia (4 trong 7) cho điểm dưới 50.

**Điểm đóng góp trung bình theo từng câu (thang 0–4, 4 là tốt nhất):**

| Câu | Nội dung rút gọn | Điểm TB |
|---|---|---|
| 1 | Muốn dùng thường xuyên | 0,71 |
| 2 | Phức tạp không cần thiết (đã đảo chiều) | 2,71 |
| 3 | Dễ sử dụng | 1,86 |
| 4 | Cần người hỗ trợ kỹ thuật (đã đảo chiều) | 2,29 |
| 5 | Các chức năng kết hợp tốt | 1,14 |
| 6 | Quá nhiều điểm không nhất quán (đã đảo chiều) | 1,00 |
| 7 | Học cách dùng rất nhanh | 1,86 |
| 8 | Cồng kềnh khi sử dụng (đã đảo chiều) | 1,43 |
| 9 | Tự tin khi sử dụng | 2,00 |
| 10 | Cần học nhiều trước khi dùng (đã đảo chiều) | 2,86 |

Những câu được đánh giá tốt nhất là câu 10, câu 2 và câu 4: người dùng không thấy hệ thống phức tạp hay khó học, và không cần nhiều hỗ trợ. Những câu thấp nhất là câu 1 (muốn dùng thường xuyên), câu 6 (không nhất quán) và câu 5 (các chức năng kết hợp tốt). Có thể hiểu là trang dễ làm quen nhưng chưa tạo được cảm giác đáng tin cậy, nhất quán và hấp dẫn để người dùng muốn quay lại.

### 7.3 Câu trả lời cho các câu hỏi mở

| Mã | Rõ ràng | Khôi phục lỗi | Tốc độ | Tin tưởng |
|---|---|---|---|---|
| P1 | Ô tìm kiếm không nhận phím Enter nên khá khó chịu | Dùng nút Back của trình duyệt, giống các trang web thông thường | Nhanh | Không |
| P2 | Không | Gõ lại, thao tác như bình thường | Tốt | Không có ảnh minh hoạ nên chắc là không |
| P3 | Thắc mắc vì sao không có nút lọc | Dễ | Bình thường | Nhìn như lừa đảo (scam) |
| P4 | Không có | Dễ, chỉ cần nhấn Back | Nhanh | Chắc là không |
| P5 | Không có | Trở về | Bình thường | Có thể |
| P6 | Không | Bình thường | Nhanh | Có thể |
| P7 | Nhiều thứ trên màn hình không có tiếng Việt | Không thấy nút trở về trên màn hình | Bình thường | Không |

**Tổng hợp theo nhóm**
- **Rõ ràng:** 4 trong 7 người không gặp chỗ nào khó hiểu; 3 người nêu vấn đề (ô tìm kiếm không nhận Enter, không có bộ lọc, giao diện lẫn ngôn ngữ).
- **Khôi phục lỗi:** không ai nói bị bế tắc; người dùng thường dùng nút Back của trình duyệt hoặc gõ lại từ khoá. Một người (P7) không thấy nút quay lại trên giao diện.
- **Tốc độ:** không ai thấy chậm; 4 người đánh giá nhanh hoặc tốt, 3 người thấy bình thường.
- **Tin tưởng:** đây là nhóm yếu nhất. 5 trong 7 người trả lời tiêu cực (P1, P2, P3, P4, P7), 2 người trả lời "có thể" (P5, P6), không ai khẳng định tin tưởng hoàn toàn.

### 7.4 Quan sát hành vi trong buổi thử

| Mã | Quan sát hành vi | Phản hồi của người tham gia |
|---|---|---|
| P1 | Không nhấn được Enter để tìm kiếm nên phải dùng nút Search trên màn hình; tỏ ra lúng túng khi chỉ vào nút xem chi tiết | Muốn bổ sung chức năng tìm kiếm bằng phím Enter |
| P2 | Sử dụng tốt, hiểu nhanh cách dùng | Thấy cách trình bày thông tin rối mắt; nhận xét không sản phẩm nào có ảnh minh hoạ |
| P3 | Có vẻ không quá thích dùng app | Phản hồi còn thiếu nhiều chức năng |
| P4 | Sử dụng dễ dàng, không cần hướng dẫn | Tỏ ra không thích app |
| P5 | Có một chút vấn đề lúc đầu nhưng nhanh chóng sử dụng được | Phàn nàn giao diện cồng kềnh nhưng lại thiếu nhiều chức năng |
| P6 | Sử dụng dễ dàng các chức năng sau khi được gợi ý nhẹ về chỗ bấm nút "Xem chi tiết" | Nhận xét giao diện trông không đẹp mắt |
| P7 | Lúng túng lúc đầu vì các nút được ghi bằng tiếng Anh | Không thích tình trạng tiếng Anh và tiếng Việt trộn lẫn |

**Nhận xét chung.** Cả 7 người đều nêu ít nhất một điều chưa hài lòng và không ai bày tỏ sự yêu thích rõ rệt; 5 người (P3, P4, P5, P6, P7) thể hiện thái độ không thích hoặc phàn nàn trực tiếp. Điều này phù hợp với điểm SUS thấp ở mục 7.2, đặc biệt ở các câu về mức độ muốn dùng thường xuyên và tính nhất quán. Ở chiều ngược lại, nhiều người dùng được ngay mà ít gặp khó khăn (P2, P4, P5), nên vấn đề chủ yếu nằm ở cảm nhận về giao diện và độ tin cậy chứ không phải độ khó của thao tác.

### 7.5 Tổng hợp vấn đề và mức nghiêm trọng

Phân biệt **lỗi (bug)** (hành vi sai so với kỳ vọng thông thường), **vấn đề thiết kế mang tính hệ thống** (nhiều người gặp) và **vấn đề riêng lẻ** (một người gặp). Mức nghiêm trọng theo thang ở Phụ lục B.

| # | Vấn đề | Người gặp | Loại | Mức |
|---|---|---|---|---|
| 1 | Trang chi tiết thiếu độ tin cậy: không sản phẩm nào có ảnh minh hoạ, trông như trang lừa đảo, thông tin chưa đủ để quyết định mua | Tiêu cực: P1, P2, P3, P4, P7; chưa chắc: P5, P6 | Thiết kế, hệ thống | 3 – Major |
| 2 | Giao diện trình bày rối mắt, cồng kềnh, chưa đẹp mắt | P2, P5, P6 | Thiết kế, hệ thống | 2 – Minor |
| 3 | Thiếu chức năng so với kỳ vọng (ví dụ bộ lọc, và các chức năng khác chưa được nêu cụ thể) | P3, P5 | Thiết kế, hệ thống (không phải bug, FR-05 và FR-06 không yêu cầu) | 2 – Minor |
| 4 | Giao diện trộn lẫn tiếng Anh và tiếng Việt, gây lúng túng ban đầu | P7 | Lỗi nhất quán, đã báo ở GUI-BUG-06 (Task 1) | 2 – Minor |
| 5 | Ô tìm kiếm không nhận phím Enter, người dùng phải dùng nút Search trên màn hình (có cách thay thế) | P1 | Lỗi nhỏ (Minor error), riêng lẻ | 2 – Minor |
| 6 | Người dùng lúng túng khi chỉ vào nút xem chi tiết; P6 cần một gợi ý nhẹ về nút này | P1, P6 | Thiết kế, khả năng nhận biết nút | 2 – Minor |
| 7 | Không có nút quay lại trên giao diện, người dùng phải dựa vào nút Back của trình duyệt | P7 (không tìm thấy); P1, P4 dùng nút Back của trình duyệt | Thiết kế, riêng lẻ | 2 – Minor |

*Mức nghiêm trọng ở trên là đề xuất của tác giả và có thể điều chỉnh.*

Không có Issue mới được tạo cho Task 2: vấn đề 5 là lỗi nhỏ có cách thay thế (nút Search) nên chỉ được ghi nhận trong báo cáo, vấn đề 4 đã được báo ở GUI-BUG-06 ở Task 1. Vấn đề 1 là vấn đề có ảnh hưởng lớn nhất vì nhiều người gặp và nó tác động tới việc quyết định mua.

### 7.6 Lỗi thật và GitHub Issues

| Lỗi | Issue | Ghi chú |
|---|---|---|
| Ô tìm kiếm không nhận phím Enter (vấn đề 5) | Ghi nhận là lỗi nhỏ (Minor) trong báo cáo, không tạo Issue GitHub | Có nút Search thay thế nên tác giả xếp vào mức Minor |
| Lẫn ngôn ngữ trên giao diện (vấn đề 4) | Đã báo ở Issue GUI-BUG-06 ([#108](https://github.com/faker26052005-lgtm/SUT-EShop/issues/108)) | Ghi nhận thêm P7 lúng túng vì vấn đề này trong buổi thử |

---

## 8. Kết luận

1. **Tìm và mở được trang chi tiết?** Có. Cả 7 người hoàn thành nhiệm vụ (6 người không cần hỗ trợ, 1 người là P6 cần một gợi ý nhẹ), trong khoảng 10–15 giây với đa số và 20–25 giây với P1 và P7. P2 và P4 dùng được ngay, P5 vượt qua khó khăn ban đầu nhanh chóng, còn P1 và P7 lúng túng lúc đầu.
2. **Ô tìm kiếm có dễ dùng không?** Ô tìm kiếm dùng được và nhanh, nhưng không nhận phím Enter nên người dùng phải bấm nút Search trên màn hình; đây là lỗi nhỏ (có cách thay thế) nhưng gây khó chịu vì làm gián đoạn thao tác quen thuộc.
3. **Khôi phục khi đi nhầm?** Người dùng quay lại dễ dàng bằng nút Back của trình duyệt hoặc gõ lại, nhưng giao diện không có nút quay lại riêng và một người không tìm thấy cách quay lại.
4. **Thông tin trang chi tiết có đáng tin?** Đây là điểm yếu lớn nhất: 5 trong 7 người không tin tưởng hoặc không thấy đủ thông tin, lý do được nêu là thiếu ảnh minh hoạ và trông thiếu chuyên nghiệp.

**Đánh giá chung.** Hiệu quả thao tác tốt nhưng cảm nhận về trang kém: mọi người hoàn thành nhiệm vụ rất nhanh, trong khi điểm SUS trung bình chỉ 44,6 và cả 7 người đều có điều chưa hài lòng. Điều này cho thấy vấn đề không nằm ở việc hoàn thành được hay không, mà ở độ tin cậy của trang chi tiết, cách trình bày giao diện, sự thiếu nhất quán về ngôn ngữ và một số chức năng người dùng mong đợi.

**Đề xuất cải tiến (theo thứ tự ưu tiên)**
- Bổ sung ảnh sản phẩm và các thông tin giúp tăng độ tin cậy ở trang chi tiết.
- Làm gọn và thống nhất cách trình bày giao diện.
- Thống nhất ngôn ngữ giao diện bằng tiếng Việt.
- Cho phép tìm kiếm bằng phím Enter.
- Thêm nút quay lại hoặc điều hướng rõ ràng trên giao diện, và làm nút xem chi tiết dễ nhận ra hơn.
- Cân nhắc bổ sung bộ lọc kết quả nếu đi xa hơn yêu cầu hiện tại.

---

## 9. Hạn chế

- **Mẫu nhỏ:** chỉ 7 người, điểm SUS phân tán rộng, nên kết quả chỉ chỉ ra xu hướng.
- **Không có âm thanh:** người tham gia không muốn dùng micro nên các video chỉ có hình, việc đánh giá lời nói khi vừa làm vừa nghĩ (think-aloud) bị hạn chế.
- **Ghi chú quan sát tổng hợp lại sau buổi thử:** các quan sát ở mục 7.4 được viết lại từ bản ghi màn hình và trí nhớ của người điều phối, nên độ chi tiết và mốc thời gian có hạn chế.
- **Nhiệm vụ cụ thể:** nhiệm vụ được nêu bằng từ khoá và thao tác cụ thể ("mac", mở sản phẩm đầu tiên) thay vì một mục tiêu mở. Vì vậy không quan sát được việc người dùng tự chọn từ khoá hoặc tự quyết định mua, và thời gian hoàn thành có thể ngắn hơn thực tế.
- **Gợi ý trong buổi:** ở buổi của P6, người điều phối đưa một gợi ý nhẹ về chỗ bấm nút "Xem chi tiết", nên kết quả của buổi này không hoàn toàn độc lập.
- **Nhiệm vụ rất ngắn:** mỗi nhiệm vụ chỉ mất khoảng 10–25 giây và thời gian chỉ là ước lượng từ video, nên chênh lệch giữa các người có thể do ngẫu nhiên; điểm SUS phản ánh ấn tượng chung của người dùng về trang, không chỉ riêng nhiệm vụ này.
- **Buổi pilot:** chỉ dùng để xác nhận luồng chạy ổn định, không có điều chỉnh nào sau pilot.
- **Phạm vi:** chỉ đánh giá một flow ngắn, dữ liệu sản phẩm ít, nên chưa phản ánh toàn bộ trải nghiệm của EShop.

---

## Phụ lục A. Phiếu SUS, cách tính và dữ liệu thô

Thang điểm: 1 = Hoàn toàn không đồng ý, 5 = Hoàn toàn đồng ý.

| # | Phát biểu |
|---|---|
| 1 | Tôi nghĩ rằng tôi sẽ muốn sử dụng hệ thống này thường xuyên. |
| 2 | Tôi thấy hệ thống này phức tạp một cách không cần thiết. |
| 3 | Tôi thấy hệ thống này dễ sử dụng. |
| 4 | Tôi nghĩ rằng tôi sẽ cần sự hỗ trợ của người có chuyên môn kỹ thuật để dùng được hệ thống này. |
| 5 | Tôi thấy các chức năng trong hệ thống này được kết hợp với nhau tốt. |
| 6 | Tôi thấy hệ thống này có quá nhiều điểm không nhất quán. |
| 7 | Tôi cho rằng hầu hết mọi người sẽ học cách dùng hệ thống này rất nhanh. |
| 8 | Tôi thấy hệ thống này rất cồng kềnh khi sử dụng. |
| 9 | Tôi cảm thấy rất tự tin khi sử dụng hệ thống này. |
| 10 | Tôi cần học hỏi rất nhiều điều trước khi có thể bắt đầu dùng hệ thống này. |

**Cách tính điểm cho mỗi người**
- Câu lẻ (1, 3, 5, 7, 9): điểm đóng góp = điểm chọn − 1.
- Câu chẵn (2, 4, 6, 8, 10): điểm đóng góp = 5 − điểm chọn.
- Điểm SUS = (tổng 10 điểm đóng góp) × 2,5; điểm của nhóm là trung bình của 7 người.

**Điểm chọn của từng người (1–5)**

| Mã | Câu 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | Tổng đóng góp (0–40) | Điểm SUS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| P1 | 1 | 2 | 3 | 3 | 4 | 5 | 3 | 5 | 2 | 4 | 14 | 35,0 |
| P2 | 4 | 1 | 5 | 3 | 3 | 2 | 5 | 2 | 5 | 2 | 32 | 80,0 |
| P3 | 1 | 3 | 3 | 4 | 2 | 4 | 3 | 4 | 2 | 2 | 14 | 35,0 |
| P4 | 1 | 1 | 2 | 1 | 1 | 3 | 4 | 2 | 5 | 1 | 25 | 62,5 |
| P5 | 2 | 4 | 2 | 2 | 1 | 5 | 2 | 4 | 3 | 1 | 14 | 35,0 |
| P6 | 2 | 2 | 3 | 2 | 3 | 4 | 2 | 3 | 3 | 1 | 21 | 52,5 |
| P7 | 1 | 3 | 2 | 4 | 1 | 5 | 1 | 5 | 1 | 4 | 5 | 12,5 |

## Phụ lục B. Thang mức độ nghiêm trọng

| Mức | Tên | Định nghĩa |
|---|---|---|
| 4 | Blocker | Ngăn người dùng hoàn thành nhiệm vụ |
| 3 | Major | Gây khó khăn hoặc mất nhiều thời gian đáng kể, nhiều người gặp phải |
| 2 | Minor | Gây khó chịu nhẹ, người dùng vẫn hoàn thành được |
| 1 | Cosmetic | Vấn đề về hình thức, không ảnh hưởng việc hoàn thành |

