# Hướng Dẫn Cấu Trúc Repository Dự Án Seminar
**Chủ đề:** API Testing & Contract Testing  
**Môn học:** Kiểm thử phần mềm (Software Testing) — FIT@HCMUS  
**Nhóm thực hiện:** Nhóm 11 (Hà Quốc Kiên, Nguyễn Quốc Kỳ, Nguyễn Hoàng Anh Tú)

---

## 1. Mục tiêu và Nguyên tắc Tổ chức

1. **Phân tách 3 khối rõ ràng:**
   - **SUT (System Under Test):** Giữ nguyên mã nguồn hệ thống EShop (backend & frontends).
   - **Tests (Mã nguồn kiểm thử):** Tách riêng theo từng công cụ (`postman`, `pact`, `karate`, `ai-agent`).
   - **Deliverables (Sản phẩm nộp):** Gom toàn bộ slide, báo cáo, bài tập, link video và minh chứng quản lý nhóm theo đúng bareme chấm điểm của giảng viên.
2. **Tránh xung đột Git (Zero Merge Conflicts):** Mỗi thành viên chủ động làm việc trong thư mục công cụ mình phụ trách chính, commit bằng tài khoản cá nhân để lưu commit history minh chứng.
3. **Minh bạch & Dễ kiểm tra:** Giảng viên mở repository có thể tiếp cận ngay các phần chấm điểm mà không phải tìm kiếm phức tạp.

---

## 2. Sơ Đồ Cấu Trúc Tổng Thể (Repository Tree)

```text
eshop-sut/
├── backend/                       # [SUT] API Provider (Node.js/Express + SQLite)
├── frontend-web/                  # [SUT] Consumer Web Client
├── frontend-admin/                # [SUT] Consumer Admin Portal
├── frontend-mobile/               # [SUT] Consumer Mobile (Mô phỏng cho Pact CDCT)
│
├── tests/                         # [TEST SUITES] TOÀN BỘ MÃ NGUỒN KIỂM THỬ
│   ├── postman/                   # Công cụ 1: Postman & Newman (Kiên chính, Tú review)
│   │   ├── collections/           # File export Collection JSON (Kịch bản P1, P2)
│   │   ├── environments/          # Biến môi trường local (EShop Local, không lưu token/secret)
│   │   ├── data/                  # File CSV/JSON cho Data-driven testing (P2)
│   │   ├── newman/                # Script tự động hóa Newman CLI + HTML Reporter (P3)
│   │   └── README.md              # Hướng dẫn setup, command chạy, giải thích ca test
│   │
│   ├── pact/                      # Công cụ 2: Pact JS Contract Testing (Tú chính, Kỳ review)
│   │   ├── consumer/              # Consumer test cho EShopMobile -> sinh Pact JSON (C1)
│   │   ├── provider/              # Provider verification cho EShopBackend (C2)
│   │   ├── pacts/                 # File hợp đồng .json được sinh ra
│   │   ├── breaking-change/       # Patch / Fixture mô phỏng phá vỡ contract (C3 - Kỳ làm)
│   │   └── README.md              # Hướng dẫn chạy consumer test, provider verify, breaking change
│   │
│   ├── karate/                    # Công cụ 3: Karate Framework (Kỳ chính, Kiên review)
│   │   ├── pom.xml                # Maven config (Karate 1.4.1, JUnit 5)
│   │   ├── src/test/java/
│   │   │   ├── karate-config.js   # Base URL, timeout, môi trường
│   │   │   ├── logback-test.xml   # Cấu hình log format
│   │   │   └── eshop/
│   │   │       ├── EshopTest.java             # JUnit 5 runner
│   │   │       ├── products.feature           # K1 (smoke), K2 (assertions & data-driven)
│   │   │       ├── auth-cart-checkout.feature # K3 (workflow shopping stateful có auth)
│   │   │       └── generated/                 # Thư mục nhận test từ AI Agent (AI1)
│   │   └── README.md              # Hướng dẫn cài Java/Maven, lệnh `mvn test`, xem HTML report
│   │
│   └── ai-agent/                  # Hướng AI bắt buộc (Kiên chính, Kỳ review)
│       ├── skills/                # Agent Skills tái sử dụng
│       │   └── api-test-design/   
│       │       └── SKILL.md       # Quy tắc test matrix, traceability, Karate DSL
│       ├── prompts/               # System prompt & task prompt giao việc cho Agent
│       ├── executions/            # Minh chứng: Test matrix đề xuất, raw trace log, diff review
│       └── README.md              # Báo cáo đánh giá chất lượng test của AI vs Human review
│
├── deliverables/                  # [HỒ SƠ BÀN GIAO] BÁM SÁT BAREME CHẤM ĐIỂM
│   ├── 00-requirements/           # Đề bài & phân tích yêu cầu seminar
│   │   ├── FITHCMUS-SeminarRequirements.md  # Yêu cầu chung môn Seminar
│   │   ├── T06_Topic_Specification.md       # Đề tài T06: API & Contract Testing
│   │   └── requirement-analysis.md          # Phân tích chi tiết yêu cầu đề bài
│   │
│   ├── 01-slides/                 # Slide thuyết trình (Tú phụ trách chính)
│   │   ├── slide-draft-meeting1.pdf         # Slide phác thảo buổi gặp GV lần 1
│   │   └── final-presentation-slide.pptx    # Slide hoàn chỉnh nộp Tuần 6 & 12 (nền trắng chữ đen)
│   │
│   ├── 02-reports/                # Báo cáo đồ án (Kiên phụ trách chính)
│   │   ├── final-report.docx (hoặc .pdf)    # Bản báo cáo chi tiết chính thức
│   │   └── research/              # Tài liệu nghiên cứu lý thuyết & công cụ (nguyên liệu viết báo cáo)
│   │       ├── theory-api-contract-testing.md
│   │       ├── tool-research-overview.md
│   │       ├── tools-comparison-matrix.md
│   │       └── ai-agent-skills-survey.md
│   │
│   ├── 03-demo-videos/            # Video Demo (Kỳ phụ trách tổng hợp)
│   │   ├── demo-links.md          # Tổng hợp danh sách link YouTube cho toàn bộ 10 clip
│   │   └── demo-script.md         # Kịch bản chi tiết, command và failure modes từng clip
│   │
│   ├── 04-exercises/              # Bài tập Hands-on Lab cho lớp (Kỳ thiết kế)
│   │   ├── lab-guide.md           # Hướng dẫn bài tập có gợi ý từng bước
│   │   └── starter-files/         # File khung để sinh viên trong lớp tải về thực hành
│   │
│   └── 05-management/             # Minh chứng quản lý nhóm (Đảm bảo điểm quá trình)
│       ├── task-assignment.md     # Bảng phân công tiến độ 4 giai đoạn
│       ├── meeting-minutes/       # Biên bản họp nhóm & gặp GVTH
│       │   ├── meeting1-prep.md
│       │   ├── meeting1-content.md
│       │   └── meeting1-overview.md
│       └── board-snapshots/       # Ảnh chụp tiến độ Trello/Notion theo từng mốc nộp bài
│
├── specs/                         # [ĐẶC TẢ API]
│   ├── api_specification.md       # Đặc tả Markdown gốc của EShop
│   └── eshop.openapi.yaml         # Bản OpenAPI 3.0 đối chiếu với backend
│
├── run_servers.sh                 # Script chạy toàn bộ SUT local
├── setup_guide.md                 # Hướng dẫn dựng môi trường SUT từ đầu
└── README.md                      # Trang chủ của đồ án (Landing page hướng dẫn tổng quan)
```

---

## 3. Bảng Ánh Xạ Di Chuyển Các File Hiện Có (`artifacts/` ➔ Cấu Trúc Mới)

| File hiện tại trong `artifacts/` | Vị trí mới đề xuất | Người phụ trách chính |
|---|---|---|
| `FITHCMUS-SoftwareTesting-SeminarRequirements.md` | `deliverables/00-requirements/FITHCMUS-SeminarRequirements.md` | Cả 3 TV |
| `T06_API_and_Contract_Testing.docx.md` | `deliverables/00-requirements/T06_Topic_Specification.md` | Cả 3 TV |
| `requirement_analysis.md` | `deliverables/00-requirements/requirement-analysis.md` | Cả 3 TV |
| `Theory_Document_API_Contract_Testing.md` | `deliverables/02-reports/research/theory-api-contract-testing.md` | Kiên |
| `Tool_Research_Overview.md` | `deliverables/02-reports/research/tool-research-overview.md` | Kiên, Kỳ |
| `analysis_api_contract_testing.md` | `deliverables/02-reports/research/tools-comparison-matrix.md` | Kiên |
| `top_5_agent_skills_cho_api_contract_testing.md` | `deliverables/02-reports/research/ai-agent-skills-survey.md` | Kiên |
| `demo-script.md` | `deliverables/03-demo-videos/demo-script.md` | Kỳ, cả 3 TV |
| `Task_Assignment_Phase1.md` | `deliverables/05-management/task-assignment.md` | Tú, cả 3 TV |
| `Meeting_Content.md` | `deliverables/05-management/meeting-minutes/meeting1-content.md` | Cả 3 TV |
| `meeting1_overview.md` | `deliverables/05-management/meeting-minutes/meeting1-overview.md` | Tú |
| `meeting1_prep.md` | `deliverables/05-management/meeting-minutes/meeting1-prep.md` | Tú |
| *Mã nguồn Karate (chuẩn bị tạo)* | `tests/karate/` *(thay vì `artifacts/demo/karate/`)* | Kỳ |

> **Lưu ý dọn dẹp:** Xóa các file trùng lặp do tải nhiều lần: `analysis_api_contract_testing(1).md` và `api-contract-testing-tools-research(1).md`.

---

## 4. Phân Quyền Làm Việc & Quy Ước Nhánh Git (Git Workflow)

1. **Phân công khu vực làm việc (Area of Responsibility):**
   - **Kỳ:** Toàn quyền trong `tests/karate/`, phối hợp C3 trong `tests/pact/breaking-change/`, chuẩn bị bài tập tại `deliverables/04-exercises/`.
   - **Kiên:** Toàn quyền trong `tests/postman/`, `tests/ai-agent/`, tổng hợp báo cáo tại `deliverables/02-reports/`.
   - **Tú:** Toàn quyền trong `tests/pact/consumer/`, `tests/pact/provider/`, làm slide tại `deliverables/01-slides/`, quản lý `deliverables/05-management/`.
2. **Quy tắc Commit:**
   - Mỗi thành viên dùng **tài khoản Git cá nhân** để commit.
   - Không commit các thư mục tạm: `node_modules/`, `target/` (Maven), `karate-reports/`, file token/cookie hoặc credential cá nhân.
3. **Quy ước nhánh Git (Branches):**
   - `main`: Chỉ chứa code đã kiểm tra và ổn định.
   - `feature/karate-suite`: Nhánh làm việc của Kỳ cho Karate.
   - `feature/postman-newman`: Nhánh làm việc của Kiên.
   - `feature/pact-contract`: Nhánh làm việc của Tú.
   - `demo/pact-breaking-change`: Nhánh demo tiêm lỗi C3 (Kỳ thực hiện) để không ảnh hưởng đến nhánh gốc.
