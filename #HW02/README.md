# HW02-AI – Domain Testing & Boundary Value Analysis trên EShop

- Sinh viên: TODO (họ tên) – MSSV: TODO
- Nhóm: TODO
- SUT: https://github.com/ttbhanh/eshop-sut – nhánh `main`, commit: TODO
- Công cụ test: Postman (collection trong `tests/postman/`), TODO (Expo/thiết bị cho mobile)
- Sử dụng AI: có – xem `ai_audit/00_AI_AUDIT_REPORT.md`

## 1. Bảng tự đánh giá

| No. | Criteria | Grade | Self-Assessed Grade |
| :-: | :--- | :-: | :-: |
| 1 | Feature A (Pool A): FR-TODO (Domain + Boundary) | 25 | |
| 2 | Feature B (Pool B): FR-09 (Domain + Boundary) | 25 | |
| 3 | Feature C (Pool C): FR-15 (Domain + Boundary) | 25 | |
| 4 | Feature D (Mobile): FR-20 (Domain + Boundary) | 15 | |
| 5 | Agent Skills | 10 | |
| | **Total** | **100** | |

## 2. Test Summary Report

Số feature: TODO

| Feature | Pool | Designed | Executed | Passed | Failed | Cần làm rõ | Not executed | Bugs |
| :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| FR-TODO | A | | | | | | | |
| FR-09 | B | | | | | | | |
| FR-15 | C | | | | | | | |
| FR-20 | D | | | | | | | |
| **Tổng** | | | | | | | | |

Quy ước: `Executed = Passed + Failed + Cần làm rõ`; `Designed = Executed + Not executed`.
"Cần làm rõ" là ca SRS không nêu kỳ vọng nên chưa kết luận được; KHÔNG tính vào Passed.

## 3. Demo videos

| Nội dung | Link YouTube |
| :--- | :--- |
| Demo Agent Skill trên một feature hoàn chỉnh | TODO |

## 4. Cấu trúc thư mục

```
README.md                 bảng tự đánh giá + test summary (file này)
CHECKLIST.md              quy trình mỗi feature + checklist nộp bài
report/                   báo cáo chính (Domain Testing + BVA)
features/FR-xx/           tài liệu từng feature (tạo bằng scripts/hw.py new-feature)
bugs/                     báo cáo bug + ảnh chụp GitHub Issues
ai_audit/                 AI Audit Report, log từng lần dùng AI, AI Critique
evidence/FR-xx/           ảnh chụp kết quả chạy test
tests/postman/            collection + dữ liệu test
skills/                   Agent Skill + hướng dẫn
scripts/hw.py             công cụ hỗ trợ (log AI, kiểm tra, đóng gói)
git_log.txt               (tự sinh khi đóng gói)
```
