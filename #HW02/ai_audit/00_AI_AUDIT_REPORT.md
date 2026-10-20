# AI Audit Report – HW02-AI

## 1. Khai báo 

Em đã sử dụng AI cho các mục sau: 
- trích yêu cầu, tóm tắt nội dung, phân tích các file context
- Gợi ý các bước thực hiện và kiểm tra lại các kết quả/artifact sinh ra
- soạn bug report, viết script/collection, tổng hợp kết quả

## 2. Công cụ đã dùng

| Công cụ | Model / phiên bản | Dùng cho việc gì |
| :--- | :--- | :--- |
| Gemini | 3.1 Pro | Đối tượng test chính |
| Claude | Sonnet 5.5 | Công cụ tạo test và các respond test |

## 3. Nhật ký các lần tương tác
a. Các prompt hỗ trợ
| ID | Ngày giờ | Công cụ | Nội dung | Prompt |
| :--- | :--- | :--- | :--- | :--- |
| P-01 | 2026-10-18 8:26:17 (UTC+0700) | Claude Sonnet 5.5 | Tóm tắt | Hãy đọc các file được đính kèm, tóm tắt lại đầy đủ các mục API trong cả description lẫn SRS, các chỗ cần dùng, những phần mà code base áp dụng |
| P-02 | 2026-10-18 8:27:05 (UTC+0700) | Claude Sonnet 5.5 | Tóm tắt, giải thích | Từ các phần đó, bạn hãy đọc kĩ và phân tích mục đích của các api dùng trong mỗi feature, sau đó hãy sắp xếp các feature theo thứ tự tăng dần độ quan trọng trong các pool |
| P-03 | 2026-10-18 8:30:44 (UTC+0700) | Claude Sonnet 5.5 | Gợi ý | Từ yêu cầu của đề bài, hãy gợi ý cho mình 1 bộ khung sườn folder cho project này |
| P-04 | 2026-10-18 8:32:29 (UTC+0700) | Claude Sonnet 5.5 | Gợi ý | Hãy gợi ý cho mình 1 pipeline làm việc từ đầu tới cuối dựa trên các thông tin thu thập được |
| P-05 | 2026-10-18 14:14:36 (UTC+0700) | Claude Sonnet 5.5 | Gợi ý | Hãy gợi ý một bộ khung test cho phase huấn luyện AI dựa trên các yêu cầu của đề bài, bộ prompt cần phải chi tiết, chú trong các test case thực tế, mô tả đủ rõ để agent có thể nắm được context trong 1 prompt |
| P-06 | 2026-10-18 14:57:11 (UTC+0700) | Claude Sonnet 5.5 | Sinh test | Từ các thông tin mà bạn đã thu thập được và nội dung tóm tắt mình gửi kèm theo đó, hãy sinh ra cho mình các bộ test collection full pipeline cho các feature mình đẫ chọn như trong các file đính kèm |
| P-07 | 2026-10-19 16:13:23 (UTC+0700) | Claude Sonnet 5.5 | Kiểm tra | Hãy kiểm tra các file kết quả mà mình đã tổng hợp lại từ test thực nghiệm, sau đó đọc qua cả 7 file respond từ agent mà mình thu thập được, so sánh và rút ra kết luận về kết quả của mình và respond của agent có gì khác biệt, có cải thiện không? Các câu trả lời của agent có gì hạn chế, chỉ rõ ra |
| P-08 | 2026-10-20 22:44:08 (UTC+0700) | Claude Sonnet 5.5 | Kiểm tra | Hãy kiểm tra các file kết quả mà mình đã tổng hợp lại từ test thực nghiệm, sau đó đọc qua cả 7 file respond từ agent mà mình thu thập được, so sánh và rút ra kết luận về kết quả của mình và respond của agent có gì khác biệt, có cải thiện không? Các câu trả lời của agent có gì hạn chế, chỉ rõ ra |
| P-09 | 2026-10-20 22:46:15 (UTC+0700) | Claude Sonnet 5.5 | Kiểm tra | Hãy kiểm tra các file kết quả mà mình đã tổng hợp lại từ test thực nghiệm, sau đó đọc qua cả 7 file respond từ agent mà mình thu thập được, so sánh và rút ra kết luận về kết quả của mình và respond của agent có gì khác biệt, có cải thiện không? Các câu trả lời của agent có gì hạn chế, chỉ rõ ra |
| P-10 | 2026-10-20 22:49:51 (UTC+0700) | Claude Sonnet 5.5 | Kiểm tra | Hãy kiểm tra các file kết quả mà mình đã tổng hợp lại từ test thực nghiệm, sau đó đọc qua cả 7 file respond từ agent mà mình thu thập được, so sánh và rút ra kết luận về kết quả của mình và respond của agent có gì khác biệt, có cải thiện không? Các câu trả lời của agent có gì hạn chế, chỉ rõ ra |

> Các prompt cuối được tái sử dụng cho các feature

b. Các prompt liên quan đến test khả năng model
| ID | Ngày giờ | Công cụ | Feature – bước | File |
| :--- | :--- | :--- | :--- | :--- |
| FR-04-01 | 2026-10-19 13:20:02 (UTC+0700) | Gemini 3.1 Pro | FR-04 – Bước 1 - trích yêu cầu | [entry](entries/FR-04/01_buoc-1-trich-yeu-cau.md) |
| FR-04-02 | 2026-10-19 13:27:49 (UTC+0700) | Gemini 3.1 Pro | FR-04 – Bước 2 - xác định biến | [entry](entries/FR-04/02_buoc-2-xac-dinh-bien.md) |
| FR-04-03 | 2026-10-19 13:31:14 (UTC+0700) | Gemini 3.1 Pro | FR-04 – Bước 3 - chia lớp tương đương | [entry](entries/FR-04/03_buoc-3-chia-lop-tuong-duong.md) |
| FR-04-04 | 2026-10-19 13:32:51 (UTC+0700) | Gemini 3.1 Pro | FR-04 – Bước 4 - Testcase domain testing | [entry](entries/FR-04/04_buoc-4-testcase-domain-testing.md) |
| FR-04-05 | 2026-10-19 13:39:26 (UTC+0700) | Gemini 3.1 Pro | FR-04 – Bước 5 - Phân tích boundary value | [entry](entries/FR-04/05_buoc-5-phan-tich-boundary-value.md) |
| FR-04-06 | 2026-10-19 13:42:02 (UTC+0700) | Gemini 3.1 Pro | FR-04 – Bước 6 - Nghiệp vụ, bảo mật, truy cập (dạng trung lập) | [entry](entries/FR-04/06_buoc-6-nghiep-vu-bao-mat-truy-cap-dang-trung-lap.md) |
| FR-04-07 | 2026-10-19 13:45:03 (UTC+0700) | Gemini 3.1 Pro | FR-04 – Bước 7 - Kiểm tra lại | [entry](entries/FR-04/07_buoc-7-kiem-tra-lai.md) |
| FR-09-01 | 2026-10-20 06:35:06 (UTC+0700) | Gemini 3.1 Pro | FR-09 – Bước 1 - trích yêu cầu | [entry](entries/FR-09/01_buoc-1-trich-yeu-cau.md) |
| FR-09-02 | 2026-10-20 06:37:17 (UTC+0700) | Gemini 3.1 Pro | FR-09 – Bước 2 - chia lớp tương đương | [entry](entries/FR-09/02_buoc-2-chia-lop-tuong-duong.md) |
| FR-09-03 | 2026-10-20 06:39:54 (UTC+0700) | Gemini 3.1 Pro | FR-09 – Bước 3 - chia lớp tương đương | [entry](entries/FR-09/03_buoc-3-chia-lop-tuong-duong.md) |
| FR-09-04 | 2026-10-20 06:41:27 (UTC+0700) | Gemini 3.1 Pro | FR-09 – Bước 4 - Testcase domain testing | [entry](entries/FR-09/04_buoc-4-testcase-domain-testing.md) |
| FR-09-05 | 2026-10-20 06:43:53 (UTC+0700) | Gemini 3.1 Pro | FR-09 – Bước 5 - Phân tích boundary value | [entry](entries/FR-09/05_buoc-5-phan-tich-boundary-value.md) |
| FR-09-06 | 2026-10-20 06:45:09 (UTC+0700) | Gemini 3.1 Pro | FR-09 – Bước 6 - Nghiệp vụ, bảo mật, truy cập (dạng trung lập) | [entry](entries/FR-09/06_buoc-6-nghiep-vu-bao-mat-truy-cap-dang-trung-lap.md) |
| FR-09-07 | 2026-10-20 06:49:32 (UTC+0700) | Gemini 3.1 Pro | FR-09 – Bước 7 - Kiểm tra lại | [entry](entries/FR-09/07_buoc-7-kiem-tra-lai.md) |
| FR-20-01 | 2026-10-20 08:27:42 (UTC+0700) | Gemini 3.1 Pro | FR-20 – Bước 1 - trích yêu cầu | [entry](entries/FR-20/01_buoc-1-trich-yeu-cau.md) |
| FR-20-02 | 2026-10-20 08:33:50 (UTC+0700) | Gemini 3.1 Pro | FR-20 – Bước 2 - chia lớp tương đương | [entry](entries/FR-20/02_buoc-2-chia-lop-tuong-duong.md) |
| FR-20-03 | 2026-10-20 08:35:44 (UTC+0700) | Gemini 3.1 Pro | FR-20 – Bước 3 - chia lớp tương đương | [entry](entries/FR-20/03_buoc-3-chia-lop-tuong-duong.md) |
| FR-20-04 | 2026-10-20 08:38:18 (UTC+0700) | Gemini 3.1 Pro | FR-20 – Bước 4 - Testcase domain testing | [entry](entries/FR-20/04_buoc-4-testcase-domain-testing.md) |
| FR-20-05 | 2026-10-20 08:40:23 (UTC+0700) | Gemini 3.1 Pro | FR-20 – Bước 5 - Phân tích boundary value | [entry](entries/FR-20/05_buoc-5-phan-tich-boundary-value.md) |
| FR-20-06 | 2026-10-20 08:41:44 (UTC+0700) | Gemini 3.1 Pro | FR-20 – Bước 6 - Nghiệp vụ, bảo mật, truy cập (dạng trung lập) | [entry](entries/FR-20/06_buoc-6-nghiep-vu-bao-mat-truy-cap-dang-trung-lap.md) |
| FR-20-07 | 2026-10-20 08:44:06 (UTC+0700) | Gemini 3.1 Pro | FR-20 – Bước 7 - Kiểm tra lại | [entry](entries/FR-20/07_buoc-7-kiem-tra-lai.md) |
| FR-15-01 | 2026-10-20 08:52:12 (UTC+0700) | Gemini 3.1 Pro | FR-15 – Bước 1 - trích yêu cầu | [entry](entries/FR-15/01_buoc-1-trich-yeu-cau.md) |
| FR-15-02 | 2026-10-20 08:54:57 (UTC+0700) | Gemini 3.1 Pro | FR-15 – Bước 2 - chia lớp tương đương | [entry](entries/FR-15/02_buoc-2-chia-lop-tuong-duong.md) |
| FR-15-03 | 2026-10-20 08:56:16 (UTC+0700) | Gemini 3.1 Pro | FR-15 – Bước 3 - chia lớp tương đương | [entry](entries/FR-15/03_buoc-3-chia-lop-tuong-duong.md) |
| FR-15-04 | 2026-10-20 08:57:41 (UTC+0700) | Gemini 3.1 Pro | FR-15 – Bước 4 - Testcase domain testing | [entry](entries/FR-15/04_buoc-4-testcase-domain-testing.md) |
| FR-15-05 | 2026-10-20 09:00:37 (UTC+0700) | Gemini 3.1 Pro | FR-15 – Bước 5 - Phân tích boundary value | [entry](entries/FR-15/05_buoc-5-phan-tich-boundary-value.md) |
| FR-15-06 | 2026-10-20 09:02:18 (UTC+0700) | Gemini 3.1 Pro | FR-15 – Bước 6 - Nghiệp vụ, bảo mật, truy cập (dạng trung lập) | [entry](entries/FR-15/06_buoc-6-nghiep-vu-bao-mat-truy-cap-dang-trung-lap.md) |
| FR-15-07 | 2026-10-20 09:05:01 (UTC+0700) | Gemini 3.1 Pro | FR-15 – Bước 7 - Kiểm tra lại | [entry](entries/FR-15/07_buoc-7-kiem-tra-lai.md) |
| FR-08-01 | 2026-10-20 20:37:46 (UTC+0700) | Gemini 3.1 Pro | FR-08 – Bước 1 - trích yêu cầu | [entry](entries/FR-08/01_buoc-1-trich-yeu-cau.md) |
| FR-08-02 | 2026-10-20 20:39:13 (UTC+0700) | Gemini 3.1 Pro | FR-08 – Bước 2 - chia lớp tương đương | [entry](entries/FR-08/02_buoc-2-chia-lop-tuong-duong.md) |
| FR-08-03 | 2026-10-20 20:40:10 (UTC+0700) | Gemini 3.1 Pro | FR-08 – Bước 3 - chia lớp tương đương | [entry](entries/FR-08/03_buoc-3-chia-lop-tuong-duong.md) |
| FR-08-04 | 2026-10-20 20:41:32 (UTC+0700) | Gemini 3.1 Pro | FR-08 – Bước 4 - Testcase domain testing | [entry](entries/FR-08/04_buoc-4-testcase-domain-testing.md) |
| FR-08-05 | 2026-10-20 20:44:04 (UTC+0700) | Gemini 3.1 Pro | FR-08 – Bước 5 - Phân tích boundary value | [entry](entries/FR-08/05_buoc-5-phan-tich-boundary-value.md) |
| FR-08-06 | 2026-10-20 20:45:51 (UTC+0700) | Gemini 3.1 Pro | FR-08 – Bước 6 - Nghiệp vụ, bảo mật, truy cập (dạng trung lập) | [entry](entries/FR-08/06_buoc-6-nghiep-vu-bao-mat-truy-cap-dang-trung-lap.md) |
| FR-08-07 | 2026-10-20 20:47:39 (UTC+0700) | Gemini 3.1 Pro | FR-08 – Bước 7 - Kiểm tra lại | [entry](entries/FR-08/07_buoc-7-kiem-tra-lai.md) |
| FR-13-01 | 2026-10-20 20:49:59 (UTC+0700) | Gemini 3.1 Pro | FR-13 – Bước 1 - trích yêu cầu | [entry](entries/FR-13/01_buoc-1-trich-yeu-cau.md) |
| FR-13-02 | 2026-10-20 20:51:11 (UTC+0700) | Gemini 3.1 Pro | FR-13 – Bước 2 - chia lớp tương đương | [entry](entries/FR-13/02_buoc-2-chia-lop-tuong-duong.md) |
| FR-13-03 | 2026-10-20 20:53:04 (UTC+0700) | Gemini 3.1 Pro | FR-13 – Bước 3 - chia lớp tương đương | [entry](entries/FR-13/03_buoc-3-chia-lop-tuong-duong.md) |
| FR-13-04 | 2026-10-20 20:57:56 (UTC+0700) | Gemini 3.1 Pro | FR-13 – Bước 4 - Testcase domain testing | [entry](entries/FR-13/04_buoc-4-testcase-domain-testing.md) |
| FR-13-05 | 2026-10-20 21:01:33 (UTC+0700) | Gemini 3.1 Pro | FR-13 – Bước 5 - Phân tích boundary value | [entry](entries/FR-13/05_buoc-5-phan-tich-boundary-value.md) |
| FR-13-06 | 2026-10-20 21:03:04 (UTC+0700) | Gemini 3.1 Pro | FR-13 – Bước 6 - Nghiệp vụ, bảo mật, truy cập (dạng trung lập) | [entry](entries/FR-13/06_buoc-6-nghiep-vu-bao-mat-truy-cap-dang-trung-lap.md) |
| FR-13-07 | 2026-10-20 21:06:03 (UTC+0700) | Gemini 3.1 Pro | FR-13 – Bước 7 - Kiểm tra lại | [entry](entries/FR-13/07_buoc-7-kiem-tra-lai.md) |

