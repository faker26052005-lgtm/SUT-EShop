# Seminar Kiểm Thử Phần Mềm: API Testing & Contract Testing

> **FIT@HCMUS — Môn học: Kiểm Thử Phần Mềm**  
> **Nhóm 11:** Hà Quốc Kiên, Nguyễn Quốc Kỳ, Nguyễn Hoàng Anh Tú  
> **Hệ thống thử nghiệm (SUT):** EShop (Node.js/Express + SQLite, React Web, Admin, React Native Mobile)  
> **Chủ đề nghiên cứu:** Postman & Newman, Pact JS, Karate Framework, AI Agent Testing

---

## 📌 Điều Hướng Nhanh (Quick Navigation)

| Mục lục | Đường dẫn | Mô tả |
|---|---|---|
| 📋 **Cấu trúc Repository** | [`REPOSITORY_STRUCTURE.md`](REPOSITORY_STRUCTURE.md) | Sơ đồ cây thư mục và quy ước phân quyền |
| 🎬 **Video Demo** | [`deliverables/03-demo-videos/demo-links.md`](deliverables/03-demo-videos/demo-links.md) | 10 clip YouTube demo các công cụ & kịch bản |
| 📝 **Kịch bản Demo** | [`deliverables/03-demo-videos/demo-script.md`](deliverables/03-demo-videos/demo-script.md) | Kịch bản chi tiết, command, dữ liệu, failure modes |
| 👥 **Phân công & Tiến độ** | [`deliverables/05-management/task-assignment.md`](deliverables/05-management/task-assignment.md) | Bảng phân công 4 giai đoạn & minh chứng |
| 🧪 **Karate Test Suite** | [`tests/karate/`](tests/karate/) | Kịch bản K1, K2, K3 (Maven, JUnit 5) |
| 🧪 **Postman Test Suite** | [`tests/postman/`](tests/postman/) | Kịch bản P1, P2, P3 (Collection, Newman) |
| 🧪 **Pact JS Test Suite** | [`tests/pact/`](tests/pact/) | Kịch bản C1, C2, C3 (CDCT, Breaking Change) |
| 🤖 **AI Agent Testing** | [`tests/ai-agent/`](tests/ai-agent/) | Kịch bản AI1 (Skill tái sử dụng, Human-in-the-loop) |
| 📖 **Đặc tả Hệ thống (SRS)**| [`specs/system_requirements_specification.md`](specs/system_requirements_specification.md) | Yêu cầu nghiệp vụ hệ thống EShop gốc |
| 📖 **Đặc tả API** | [`specs/api_specification.md`](specs/api_specification.md) | Danh sách API endpoints của Backend EShop |

---

## 🚀 Khởi Chạy Nhanh Hệ Thống (Quickstart)

```bash
# 1. Cài đặt dependencies cho backend và frontend
cd backend && npm install
cd ../frontend-web && npm install
cd ../frontend-admin && npm install

# 2. Khởi chạy toàn bộ hệ thống EShop (local)
./run_servers.sh
```

- **Backend API:** `http://localhost:3000`
- **Frontend Web:** `http://localhost:5173`
- **Web Admin:** `http://localhost:5174`
- **Tài khoản mặc định:**
  - Admin: `admin@eshop.com` / `Admin123!`
  - User test: `test@eshop.com` / `Test1234!`
