# Chọn Nguyên Tắc Viết Prompt (Có Nguồn) Trước Khi Viết Tài Liệu Hướng Dẫn

> Mục đích: chốt bộ nguyên tắc viết prompt dựa trên nguồn hướng dẫn uy tín, kế hoạch chuẩn bị, và dàn ý tài liệu hướng dẫn cho khán giả. Chỉ sau khi chốt các phần này mới viết tài liệu hướng dẫn chính thức.
> Khán giả của tài liệu cuối: người đã biết chat bình thường với AI và có kiến thức cơ bản về công nghệ thông tin, **không có kiến thức chuyên sâu về kiểm thử phần mềm**.
> Cách dùng file này: đọc bảng ở mục 2, ghi lựa chọn của bạn vào cột cuối, rồi làm các việc ở mục 4.

---

## 1. Các nguồn dùng để rút nguyên tắc

Chỉ trích ý theo cách diễn đạt của nhóm, ghi rõ nguồn; khi viết tài liệu chính thức cần mở trang gốc để đọc và trích đúng.

| Mã | Nguồn | Đường dẫn | Tình trạng kiểm tra |
|---|---|---|---|
| S1 | Anthropic, hướng dẫn prompt engineering: các mục "Be clear and direct", "Use examples (multishot prompting)", "Let Claude think (chain of thought)", "Use XML tags", "Give Claude a role (system prompts)", "Chain complex prompts", "Prompt improver" | `https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview` (từ trang này vào từng mục ở menu bên trái). Các trang con đã thấy: `.../multishot-prompting`, `.../chain-of-thought`, `.../use-xml-tags`, `.../chain-prompts`, `.../prompt-improver` | Đã thấy nội dung các trang này. Trang "Be clear and direct" và "System prompts" cần Jack vào qua menu để đọc |
| S2 | OpenAI, hướng dẫn prompt engineering (sáu chiến lược: viết chỉ dẫn rõ ràng, đưa văn bản tham chiếu, chia nhiệm vụ phức tạp thành nhiệm vụ nhỏ, cho mô hình thời gian suy nghĩ, dùng công cụ ngoài, thử nghiệm thay đổi một cách có hệ thống) | `https://platform.openai.com/docs/guides/prompt-engineering` | Mới đọc được các bản tóm tắt của bên thứ ba; trang chính thức cần Jack mở để xác nhận |
| S3 | Google, hướng dẫn thiết kế prompt cho Gemini (nhóm đang dùng Gemini để sinh test) | Tìm "Gemini API prompting strategies" trên `ai.google.dev` | Chưa kiểm tra, Jack tự tìm và đọc |
| S4 | OWASP API Security Top 10 (bản 2023): danh mục rủi ro bảo mật API chuẩn ngành | `https://owasp.org/API-Security/` rồi chọn bản 2023 | Mới đọc được các trang tóm tắt; trang chính thức cần Jack mở để xác nhận |

---

## 2. Danh sách nguyên tắc ứng viên

Mỗi dòng có: ý nghĩa với việc sinh test cho API, nguồn, mức độ đã dùng ở Prompt A và Prompt B, và đề xuất. Cột cuối để bạn ghi **Giữ**, **Bỏ** hoặc **Gộp với nguyên tắc số ...**.

| STT | Nguyên tắc | Hiểu thế nào khi nhờ AI viết test | Nguồn | Prompt A | Prompt B | Đề xuất | Bạn chọn |
|---|---|---|---|---|---|---|---|
| 1 | Nói rõ mục tiêu và ràng buộc | Nêu thẳng mục tiêu ("tìm càng nhiều lỗi thật càng tốt"), điều được và không được làm ("kiểm tra hành vi đúng theo tài liệu, không viết theo điều đoán hệ thống đang làm"). Coi AI như một đồng nghiệp rất giỏi nhưng chưa biết gì về dự án | S1, S2 | Yếu ("viết test") | Có | Giữ | Theo đề xuất |
| 2 | Gán vai trò | Cho AI một vai (kỹ sư kiểm thử có tư duy phản biện) để đổi cách nhìn bài toán | S1 | Rất ngắn | Có | Giữ | Theo đề xuất |
| 3 | Cung cấp ngữ cảnh và tài liệu tham chiếu | Đưa tài liệu nghiệp vụ, dữ liệu mẫu, danh mục chuẩn (ví dụ OWASP API Security Top 10) để AI không phải đoán. Tài liệu tham chiếu làm giảm việc AI tự bịa | S1, S2, S4 | Chỉ có đặc tả kỹ thuật | Có đặc tả nghiệp vụ và dữ liệu mẫu, chưa có danh mục chuẩn | Giữ | Theo đề xuất |
| 4 | Tách các phần của prompt bằng thẻ hoặc dấu phân cách | Bọc từng phần (tài liệu, chỉ dẫn, ví dụ, dữ liệu) trong thẻ rõ ràng để AI không lẫn lộn, nhất là khi prompt dài (đặc tả hơn 30.000 ký tự) | S1, S2 | Không | Chỉ dùng tiêu đề chữ thường | Giữ | Theo đề xuất |
| 5 | Chia nhiệm vụ thành các bước, hoặc chuỗi nhiều lượt hỏi | Lượt 1: lập danh sách quy tắc cần kiểm tra. Lượt 2: viết test theo nhóm. Lượt 3: kiểm tra độ phủ. Mỗi bước được AI tập trung hơn | S1, S2 | Không | Có bước nhưng gói trong một lần hỏi (và AI bỏ sót giỏ hàng, danh mục) | Giữ | Theo đề xuất |
| 6 | Cho AI suy nghĩ trước khi viết | Yêu cầu liệt kê quy tắc, rủi ro, nhóm ca trước rồi mới viết code. Phần suy nghĩ phải được in ra thì mới có tác dụng | S1, S2 | Không | Có một phần (bảng phủ) | Gộp với nguyên tắc 5 | Theo đề xuất |
| 7 | Đưa ví dụ mẫu | Đưa một vài test mẫu: một test đường đi đúng, một test âm tính, một test bảo mật, kèm giải thích vì sao assertion mạnh hay yếu. Nguồn S1 khuyên dùng khoảng ba đến năm ví dụ đa dạng | S1, S2 | Không | Không | Giữ (khác biệt chính của Prompt C) | Theo đề xuất |
| 8 | Chỉ định rõ định dạng đầu ra | Nói chính xác dạng kết quả (hàm, công cụ có sẵn, cách đặt tên test) để chạy được ngay | S1, S2 | Có | Có | Giữ | Theo đề xuất |
| 9 | Yêu cầu tự kiểm tra, và kiểm tra lại bằng một lượt riêng | Sau khi viết, yêu cầu đối chiếu bảng phủ với code và bổ sung phần thiếu. Cách làm này có nguồn: chuỗi prompt cho phép AI xem lại sản phẩm của chính nó | S1 | Không | Có trong prompt, nhưng AI khai báo 28 test mà chỉ viết 18 | Giữ, tách thành lượt riêng | Theo đề xuất |
| 10 | Thử nghiệm có hệ thống: đặt tiêu chí thành công, đo, rồi lặp lại | Tiêu chí là bảng 30 lỗi đã biết. Mỗi lần sửa prompt phải chạy lại và đo. Đây là cách làm của chính thí nghiệm A, B, C | S1, S2 | Đã làm | Đã làm | Giữ (là phương pháp, không phải thành phần của prompt) | Theo đề xuất |

Nhận xét ngắn:
- Prompt B đã dùng được các nguyên tắc 1, 2, 3, 8, một phần của 5, 6 và 9. Nó thiếu 4, 7 và việc tách lượt kiểm tra ở 9.
- Các thiếu sót này có biểu hiện trong kết quả: B bỏ hẳn giỏ hàng, danh mục và chi tiết sản phẩm (nhiệm vụ bị gói trong một lần hỏi), bảng phủ nói 28 test nhưng code chỉ có 18 (chưa có lượt kiểm tra riêng), và vài test xanh giả (ví dụ chưa có ví dụ mẫu về assertion mạnh).

---

## 3. Bộ nguyên tắc đề xuất (8 nguyên tắc)

Sau khi gộp, bộ đề xuất gồm: (1) mục tiêu và ràng buộc rõ, (2) vai trò, (3) ngữ cảnh và tài liệu tham chiếu, (4) cấu trúc bằng thẻ, (5) chia bước và suy nghĩ trước, (6) ví dụ mẫu, (7) định dạng đầu ra, (8) tự kiểm tra bằng lượt riêng. Cộng một nguyên tắc về **phương pháp**: đo kết quả và lặp lại.

Ý tưởng cho khán giả: một câu thần chú dễ nhớ (viết tắt bằng tiếng Việt) và một danh sách kiểm tra tám dòng để tự rà prompt của mình. Việc đặt tên sẽ làm sau khi chốt bộ nguyên tắc.

---

## 4. Chuẩn bị trước khi viết tài liệu hướng dẫn

| Việc | Người làm | Sản phẩm | Trạng thái |
|---|---|---|---|
| Đọc nguồn S1 đến S4, ghi chú ngắn mỗi nguồn: nguyên tắc nào đáng dùng, câu nào dễ hiểu để trích | Jack | Ghi chú đọc nguồn (một trang mỗi nguồn) | Chưa làm |
| Chốt bộ nguyên tắc (mục 2 và 3) | Jack, trợ lý hỗ trợ | Bảng đã đánh dấu Giữ, Bỏ, Gộp | Đang làm |
| Viết Prompt C dựa trên bộ nguyên tắc đã chốt (thêm thẻ, ví dụ mẫu, danh mục OWASP, chia lượt, lượt kiểm tra riêng). Dùng lại đúng `openapi_for_ai.yaml` và `srs_excerpt.md`, không sửa gì | Trợ lý viết, Jack duyệt | `Prompt_C_ready.txt` và hướng dẫn chạy theo lượt | Chưa làm |
| Chạy và chấm điều kiện C bằng đúng quy trình A, B (chat tạm thời, cùng mô hình, khung chạy, bảng 30 mục, thêm cột lỗi ngoài đáp án) | Jack | Log điều kiện C, ảnh minh chứng | Chưa làm |
| Từ điển thuật ngữ cho người không biết kiểm thử (API, request, response, mã trạng thái, bug, test case, assertion, đặc tả, SRS, danh mục OWASP, test xanh và đỏ) | Trợ lý viết, Jack duyệt | Phần phụ lục trong tài liệu | Chưa làm |
| Chuẩn bị ví dụ "trước và sau" cho từng nguyên tắc, lấy từ kết quả thật của A, B, C | Cùng làm | Bộ ví dụ | Chưa làm |
| Thiết kế bài thực hành: một đoạn đặc tả nhỏ (ví dụ endpoint áp mã giảm giá), phiếu chấm, đáp án gợi ý | Jack cùng bạn phụ trách bài tập | Activity_Worksheet và bài tập áp dụng | Chưa làm |
| Thử nghiệm tài liệu với một hai bạn không học kiểm thử: họ đọc rồi tự viết prompt, ghi lại chỗ vướng | Jack | Ghi chú phản hồi, sửa tài liệu | Chưa làm |

---

## 5. Dàn ý tài liệu hướng dẫn (để duyệt trước khi viết)

Tài liệu viết cho người chưa biết kiểm thử, theo cấu trúc từ dễ đến khó, mỗi khái niệm có ví dụ đời thường trước khi vào kỹ thuật.

1. **Giới thiệu và cách dùng tài liệu.** Tài liệu này giúp ai, cần chuẩn bị gì, đọc theo thứ tự nào.
2. **Kiến thức nền (không cần biết kiểm thử).**
   - API là gì (ví dụ so sánh với thực đơn và người phục vụ nhà hàng); request, response, mã trạng thái.
   - Kiểm thử là gì, "bug" là gì, test case là gì, vì sao một bài test có thể xanh mà hệ thống vẫn sai.
   - Đặc tả kỹ thuật và đặc tả nghiệp vụ khác nhau thế nào.
3. **Vì sao cách viết prompt quan trọng.** Kể lại thí nghiệm A, B, C bằng số liệu thật, nêu rõ giới hạn của thí nghiệm.
4. **Các nguyên tắc viết prompt (mỗi nguyên tắc một mục).** Mỗi mục gồm: là gì, vì sao hiệu quả (kèm nguồn), cách làm từng bước, ví dụ prompt yếu và prompt tốt, kết quả khác nhau thế nào, lỗi thường gặp.
5. **Quy trình làm việc với AI.** AI sinh, người xem lại, chạy thật, ghi lại. Cách kiểm tra output của AI: đối chiếu bảng phủ với code, nhận biết test xanh giả, nhận biết test gây hại.
6. **Mẫu prompt dùng lại được và danh sách kiểm tra.** Mẫu điền chỗ trống, danh sách tám dòng để tự rà prompt.
7. **Thực hành từng bước.** Ví dụ hoàn chỉnh với một endpoint nhỏ; bài tập; đáp án gợi ý; cách chấm.
8. **Giới hạn và rủi ro của AI trong kiểm thử.** Những loại lỗi AI hay bỏ sót, rủi ro khi chạy test AI viết (mất dữ liệu, test gây hại), cách giảm thiểu.
9. **Phụ lục.** Từ điển thuật ngữ, các prompt đầy đủ (A, B, C), nguồn tham khảo.

---

## 6. Điều cần bạn quyết định

1. Đánh dấu cột "Bạn chọn" ở mục 2 (đặc biệt các nguyên tắc 4, 7, 9 sẽ làm khác biệt của Prompt C).
2. Có chạy điều kiện C trên cùng một mô hình (Gemini) để so sánh công bằng không, và có thêm một mô hình khác không.
3. Có đồng ý thứ tự: chốt nguyên tắc, viết Prompt C, chạy và chấm, rồi mới viết tài liệu hướng dẫn chính thức.

---

## 7. Quyết định đã chốt (18/10/2026)

| Nội dung | Quyết định |
|---|---|
| Bộ nguyên tắc | Theo đúng đề xuất ở mục 2 và 3: giữ các nguyên tắc 1, 2, 3, 4, 5, 7, 8, 9, 10; nguyên tắc 6 gộp với 5. Khi viết báo cáo phải nêu rõ bộ nguyên tắc này, nguồn của từng nguyên tắc và việc nhóm chọn theo đề xuất của trợ lý AI sau khi đối chiếu với nguồn |
| Mô hình sinh test | Gemini 3.1 Pro (gói trả phí), dùng chung cho cả ba điều kiện A, B, C; môi trường cô lập, chat tạm thời |
| Điều kiện C | Chạy trên cùng mô hình, cùng `openapi_for_ai.yaml` và `srs_excerpt.md`; bốn lượt trong một cuộc trò chuyện (`Prompt_C1_ready.txt` đến `Prompt_C4_ready.txt`) |
| Newman | Thành viên phụ trách chưa làm, nên nhóm tự làm gói `api-tests/` (Data-driven bằng CSV); nếu thành viên đó có thay đổi thì sửa lại sau |

### Lưu ý khi báo cáo về tài khoản trả phí

Đề T06 ghi rằng khoa không cấp tài khoản AI trả phí và cho phép dùng gói miễn phí hoặc bản dùng thử, không cấm dùng gói trả phí. Tuy nhiên khán giả sẽ làm theo hướng dẫn bằng gói miễn phí, nên báo cáo cần ghi rõ loại tài khoản đã dùng, và nên cảnh báo rằng kết quả trên gói miễn phí có thể khác (giới hạn độ dài ngữ cảnh, chất lượng). Nếu còn thời gian, thử Prompt C một lần trên gói miễn phí để biết hướng dẫn có tái hiện được cho người nghe không.

