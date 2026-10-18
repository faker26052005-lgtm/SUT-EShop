# HW02 – Hướng Dẫn Quy Trình Thực Hiện (Workflow Guide)

Tài liệu này mô tả chi tiết quy trình 5 giai đoạn thực hiện bài tập HW02 – Domain Testing trên hệ thống EShop. Bạn cũng có thể xem bản thiết kế tương tác trong artifact hệ thống.

---

## 1. Sơ Đồ Quy Trình Tổng Thể

```mermaid
flowchart TD
    subgraph Phase1["Giai đoạn 1: Chuẩn Bị & Khởi Tạo"]
        P1A["Khởi động các dịch vụ EShop (Backend :3000, Web :5173, Admin :5174)"]
        P1B["Đối chiếu Đặc tả SRS gốc (specs/system_requirements_specification.md)"]
        P1C["Khởi tạo các file báo cáo mẫu (README.md, Main_Report.md, Bug_Report.md)"]
        P1A --> P1B --> P1C
    end

    subgraph Phase2["Giai đoạn 2: Thiết Kế Test 6 Bước (Cho từng Feature)"]
        direction TB
        F_SEL["Chọn Feature: FR-02 -> FR-07 -> FR-17 -> Mobile FR-20/10"]
        
        S1["Bước 1: Nhận diện biến & Ràng buộc"] --> G1["Git Commit: step 1"]
        G1 --> S2["Bước 2: Phân vùng tương đương (Single Fault VEP/IEP)"] --> G2["Git Commit: step 2"]
        G2 --> S3["Bước 3: Phân tích giá trị biên (2-value/3-value On/Off/In)"] --> G3["Git Commit: step 3"]
        G3 --> S4["Bước 4: Thiết kế Test Cases cụ thể"] --> G4["Git Commit: step 4"]
        G4 --> S5["Bước 5: Ma trận truy vết & Kiểm tra độ bao phủ"] --> G5["Git Commit: step 5"]
        G5 --> S6["Bước 6: AI Gap Analysis & Giả thuyết lỗi SUT"] --> G6["Git Commit: step 6"]
        
        F_SEL --> S1
        G6 --> AUDIT_TURN["Đồng bộ prompt vào AI Audit Report bằng hw-ai-audit"]
    end

    subgraph Phase3["Giai đoạn 3: Thực Thi Kiểm Thử & Báo Cáo Lỗi"]
        EX1["Chạy Test Cases trên SUT EShop (Web/Admin/Mobile/API)"]
        EX2{"Kết quả thực tế trùng khớp SRS?"}
        EX3["Đánh dấu TC là PASS trong Main_Report.md"]
        BUG1["Chụp ảnh minh chứng màn hình + log API"]
        BUG2["Đăng GitHub Issue lên Repository nhóm"]
        BUG3["Ghi nhận lỗi vào Bug_Report.md & Đánh dấu TC là FAIL"]
        
        EX1 --> EX2
        EX2 -- "Đúng" --> EX3
        EX2 -- "Sai lệch (Bug)" --> BUG1 --> BUG2 --> BUG3
    end

    subgraph Phase4["Giai đoạn 4: Đánh Giá AI Critique & Hoàn Thiện"]
        SYN1["Viết AI Critique (200-300 từ)"]
        SYN2["Biên dịch AI Audit Report.md hoàn chỉnh"]
        SYN3["Cập nhật số liệu vào README.md"]
        SYN1 --> SYN2 --> SYN3
    end

    subgraph Phase5["Giai đoạn 5: Đóng Gói & Xuất Bản Nộp Bài"]
        DEMO["Quay Video Demo Skill (YouTube Unlisted)"]
        GLOG["Xuất git_commit_log.txt bằng lệnh git log"]
        PDF["Chuyển đổi Markdown sang PDF"]
        ZIP["Đóng gói ZIP 23120138_HW02_AI_DomainTesting_100.zip"]
        
        DEMO --> GLOG --> PDF --> ZIP
    end

    Phase1 --> Phase2
    Phase2 --> Phase3
    Phase3 --> Phase4
    Phase4 --> Phase5
```

---

## 2. Chi Tiết Lệnh Git Commit Theo Từng Bước Của Từng Feature

Quy định mục 12 yêu cầu mỗi bước của mỗi chức năng phải có 1 commit riêng:

### Feature A: FR-02 (Đăng nhập & Khóa tài khoản)
```bash
git commit -m "feat(FR-02): step 1 - identify variables and input domain constraints"
git commit -m "feat(FR-02): step 2 - define equivalence partitions and single-fault baselines"
git commit -m "feat(FR-02): step 3 - boundary value analysis with On/Off/In point classification"
git commit -m "feat(FR-02): step 4 - design test cases with EP and BVA traceability"
git commit -m "feat(FR-02): step 5 - coverage analysis and traceability verification"
git commit -m "feat(FR-02): step 6 - ai gap analysis and exploratory defect hypotheses"
```

### Feature B: FR-07 (Giỏ hàng)
```bash
git commit -m "feat(FR-07): step 1 - identify variables and input domain constraints"
git commit -m "feat(FR-07): step 2 - define equivalence partitions and single-fault baselines"
git commit -m "feat(FR-07): step 3 - boundary value analysis with On/Off/In point classification"
git commit -m "feat(FR-07): step 4 - design test cases with EP and BVA traceability"
git commit -m "feat(FR-07): step 5 - coverage analysis and traceability verification"
git commit -m "feat(FR-07): step 6 - ai gap analysis and exploratory defect hypotheses"
```

### Feature C: FR-17 (Quản lý Mã Giảm Giá)
```bash
git commit -m "feat(FR-17): step 1 - identify variables and input domain constraints"
git commit -m "feat(FR-17): step 2 - define equivalence partitions and single-fault baselines"
git commit -m "feat(FR-17): step 3 - boundary value analysis with On/Off/In point classification"
git commit -m "feat(FR-17): step 4 - design test cases with EP and BVA traceability"
git commit -m "feat(FR-17): step 5 - coverage analysis and traceability verification"
git commit -m "feat(FR-17): step 6 - ai gap analysis and exploratory defect hypotheses"
```

### Feature D: Mobile FR-20 & FR-10 (Hủy đơn hàng)
```bash
git commit -m "feat(FR-20): step 1 - identify state variables and transition constraints"
git commit -m "feat(FR-20): step 2 - define equivalence partitions for order states"
git commit -m "feat(FR-20): step 3 - boundary value analysis on state transition thresholds"
git commit -m "feat(FR-20): step 4 - design test cases with EP and BVA traceability"
git commit -m "feat(FR-20): step 5 - coverage analysis and state machine verification"
git commit -m "feat(FR-20): step 6 - ai gap analysis and mobile defect hypotheses"
```

---

## 3. Lệnh Xuất Báo Cáo & Nén Bài Nộp

1. **Xuất lịch sử Git Commit:**
   ```bash
   git log --pretty=format:"%h - %cd : %s" --date=iso > git_commit_log.txt
   ```

2. **Chạy cập nhật báo cáo AI Audit:**
   ```bash
   python3 ~/.gemini/config/skills/hw-ai-audit/scripts/audit_engine.py generate-report \
     --workspace-root . \
     --output "AI Audit Report.md"
   ```

3. **Tạo file nén ZIP:**
   ```bash
   zip -r 23120138_HW02_AI_DomainTesting_100.zip \
     README.md \
     Main_Report.md \
     Main_Report.pdf \
     Bug_Report.md \
     Bug_Report.pdf \
     "AI Audit Report.md" \
     "AI Audit Report.pdf" \
     git_commit_log.txt \
     screenshots/
   ```
