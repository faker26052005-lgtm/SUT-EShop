# AI Audit Report - HW04 (MSSV 23120056)

I use AI tools for the following tasks: đọc và tóm tắt đề, lập kế hoạch, tận dụng bài HW02, thiết kế và sinh script tự động hóa Playwright, rà soát kết quả.

Mỗi lần dùng AI ghi đủ 4 mục: công cụ, ngày giờ, prompt, output. Prompt ghi nguyên văn. Output dán nguyên văn hoặc đính kèm file export của cuộc trò chuyện vào `docs/ai-audit/exports/`.

## Entry 1
- **Công cụ:** Claude (Claude Sonnet 5.5, ứng dụng Claude)
- **Ngày giờ:** 2026-11-13 16:05 (UTC+7)
- **Prompt:** "bạn có thể đọc file này và tóm tắt lại giúp mình không" (kèm file đề `2026.HW04.Automation Testing_En.md`)
- **Output:** TODO dán nguyên văn (bản tóm tắt đề HW04)

## Entry 2
- **Công cụ:** Claude (Claude Sonnet 5.5, ứng dụng Claude)
- **Ngày giờ:** 2026-11-13 16:10 (UTC+7)
- **Prompt:** "Mình đã thực hiện 3 feature là FR4,8,13. Bây giờ mình nên làm gì trước"
- **Output:** TODO dán nguyên văn (kế hoạch các bước)

## Entry 3
- **Công cụ:** Claude (Claude Sonnet 5.5, ứng dụng Claude)
- **Ngày giờ:** 2026-11-13 16:19 (UTC+7)
- **Prompt:** "bạn có thể tham khảo lại bài cũ của mình xem có gì dùng lại được không" (kèm file zip HW02)
- **Output:** TODO dán nguyên văn (phân tích cái gì dùng lại được từ HW02)

## Entry 4
- **Công cụ:** Claude (Claude Sonnet 5.5, ứng dụng Claude)
- **Ngày giờ:** 2026-11-13 16:23 (UTC+7)
- **Prompt:** "cứ theo ý bạn gợi ý đi. Giờ hướng dẫn mình bước đầu tiên. Nếu bạn có cần biết gì hay file nào thì cứ nói mình"
- **Output:** TODO dán nguyên văn (hướng dẫn dựng môi trường và cấu hình báo cáo "Run by")

## Entry 5
- **Công cụ:** Claude (Claude Sonnet 5.5, ứng dụng Claude)
- **Ngày giờ:** 2026-11-15 09:12 (UTC+7)
- **Prompt:** "các thông tin của mình thì cứ lấy chính xác như file cũ là được, mình sẽ kiểm tra lại sau. Hạn nộp là ngày 18/11. Mình dùng window, node 25, SUT tất nhiên đã chạy được vì mình đã làm HW2 rồi. Đây là 2 file specs, dù vậy trong lúc làm các bài tập thì mình có để ý nhiều chỗ specs ghi không đúng hoặc không rõ ràng nên bạn phải chú ý. Các phần bìa tập mình đã làm thì được xem như đã được kiểm chứng" (kèm `api_specification.md`, `system_requirements_specification.md`)
- **Output:** bộ khung dự án + bộ test FR-13 (`playwright.config.ts`, `tests/fr13-dashboard.spec.ts`, `tests/helpers/*`, `data/fr13-*.json`, `scripts/*`, `docs/spec-notes.md`). TODO dán nguyên văn phần trả lời.
- **Ghi chú:** bản script này AI chỉ chạy thử với server giả lập, chưa chạy trên SUT thật. Mọi sửa đổi sau khi chạy thật ghi ở `docs/review/fr13-review.md`.

## Entry 6 trở đi
Thêm mỗi lần hỏi AI về HW04 (kể cả hỏi để sửa lỗi script): công cụ, ngày giờ, prompt, output.
