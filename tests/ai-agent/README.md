# AI Agent API Testing Workflow
- **Phụ trách chính:** Kiên (AI1), Kỳ (hỗ trợ/review).
- **Mục tiêu:** Thể hiện quy trình Human-in-the-loop: Nạp Skill -> Sinh test matrix có traceability -> Con người review duyệt ca test -> Sinh Karate feature -> Chạy và đánh giá.
- `skills/`: Chứa các Skill tái sử dụng (`api-test-design`).
- `prompts/`: Lời nhắc hệ thống và chỉ dẫn nhiệm vụ.
- `executions/`: Lưu vết chạy, log hội thoại, bảng review test matrix.
- `inputs/`: Chứa các dữ liệu đầu vào cần thiết
- `rules/`: Chứa các quy định làm việc cho agent
- `karate/`: Chứa karate.jar 1.5.2

**Hướng dẫn cài đặt: Copy toàn bộ các folder trừ propmt ra ngoài folder chính, đặt nội dung folder skill vào trong vị trí IDE agent nhận skill (ví dụ: .agents/skills/ cho antigravity hoặc .claude/skills cho claude code), đặt nội dung folder rules vào vị trí IDE agent nhận các chỉ dẫn master (ví dụ .antigravity/rules/ cho antigravity hoặc .claude/rules/ cho claude code** 
