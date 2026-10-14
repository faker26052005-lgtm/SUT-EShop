# Nghiên cứu Top 5 Agent Skills cho API & Contract Testing trên GitHub

## 1. Tổng quan & Định vị Khái niệm

Trong phát triển phần mềm có sự trợ giúp của AI Agents (như **Claude Code**, **OpenAI Codex**, **GitHub Copilot Agent Mode**, **Cursor Agent**), kiểm thử API và kiểm thử hợp đồng (Contract Testing) thường đối mặt với vấn đề sinh thiếu biên độ dữ liệu hoặc tạo ra các kịch bản kiểm thử giả định rời rạc với đặc tả hệ thống.

Để khắc phục điều này, thay vì chỉ sử dụng các thư viện kiểm thử truyền thống độc lập, các nhà phát triển sử dụng **Agent Skills**, được chia làm hai định dạng chính:

1. **Instruction-based Skills (`SKILL.md`)**: Bộ quy chuẩn tri thức, mẫu tư duy (mental models) và quy tắc tạo bảng ma trận kiểm thử (Test Matrix) được nạp vào system context của Agent qua thư mục `.claude/skills/` hoặc các trình quản lý kỹ năng như `skills CLI`.
2. **MCP Tool-calling Skills (Model Context Protocol)**: Máy chủ công cụ theo giao thức mở cho phép Agent trực tiếp phân tích đặc tả OpenAPI/AsyncAPI, gọi công cụ sinh kịch bản biên, dựng mock và tự chạy đối soát hợp đồng thực tế.

---

## 2. Bảng xếp hạng Top 5 Agent Skills & MCP Servers trên GitHub

| Thứ hạng | Tên Skill / Dự án | GitHub Repository | Định dạng kỹ thuật | Năng lực cốt lõi & Test Matrix | Độ uy tín & Mức độ tin cậy |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **Specmatic MCP Server** | `specmatic/specmatic-mcp-server` | MCP Server (Tool-calling) | Sinh và chạy Contract Tests từ OpenAPI; tự động chạy Resiliency Testing (ma trận dữ liệu biên, lỗi schema, payload rỗng); mock server tức thì. | **Rất cao** (Dự án chính thức từ tổ chức Specmatic, bảo mật quét AgentSeal, tích hợp CI/CD chuẩn doanh nghiệp). |
| **2** | **SmartBear MCP Server** | `smartbear/smartbear-mcp` | MCP Server (Tool-calling) | Khai thác hệ sinh thái Swagger/OpenAPI và Pact; hỗ trợ Agent nhận diện endpoint, ánh xạ kịch bản Consumer-Provider và sinh mã Pact DSL. | **Rất cao** (Do SmartBear – tổ chức đứng sau Swagger và Pact Foundation phát triển). |
| **3** | **API Test Suite Builder** | `borghei/Claude-Skills` | Universal Skill (`SKILL.md`) | Định hướng lập luận Agent sinh Test Matrix 5 chiều (Positive, Negative, Boundary, Auth/RBAC, Pagination); tạo Consumer-Driven Contract Test. | **Cao** (Bộ kỹ năng phổ biến cho Claude/Codex, tuân thủ định dạng markdown mở, dễ tùy biến). |
| **4** | **APITester MCP** | `kirti676/apitestermcp` | MCP Server (Tool-calling) | Cung cấp 11 công cụ MCP: đọc OpenAPI/Postman, sinh danh sách kịch bản ma trận biên, sinh mã kiểm thử thực thi và chạy kiểm tra tự động. | **Khá** (Dự án mã nguồn mở độc lập, tối ưu tốt cho vòng lặp kiểm thử khép kín của Agent). |
| **5** | **QA Testing Strategy Skill** | `vasilyu1983/ai-agents-public` | Universal Skill (`SKILL.md`) | Áp dụng cơ chế cổng chất lượng "Feature Matrix vs Test Matrix Gate"; phân tách các tầng Contract, Integration và E2E API. | **Khá** (Hỗ trợ cài đặt nhanh qua `npx skills`, tài liệu hóa phương pháp luận kiểm thử cho LLM). |

---

## 3. Phân tích chi tiết từng Agent Skill

### Top 1: Specmatic MCP Server (`specmatic/specmatic-mcp-server`)
* **Kiến trúc**: Máy chủ MCP cho phép Agent tương tác trực tiếp với lõi Specmatic CLI.
* **Cơ chế sinh Test & Test Matrix**:
  * **Contract Testing tự động**: Agent gọi công cụ `run_contract_tests` đối chiếu mã API hiện hành với tệp đặc tả `openapi.yaml`.
  * **Ma trận phục hồi (Resiliency Test Matrix)**: Tự động đảo ngược các kiểu dữ liệu, gửi giá trị rỗng, giá trị vượt quá giới hạn hoặc sai định dạng để kiểm tra xem hệ thống có trả về mã lỗi đúng với hợp đồng hay không.
* **Cấu hình tích hợp**:
  * Thêm vào Claude Code:
    ```bash
    claude mcp add specmatic -- docker run --rm -i --network=host -v $(pwd)/reports:/app/reports specmatic/specmatic-mcp:latest
    ```
  * Thêm vào Codex / Cursor (`.vscode/mcp.json` hoặc cấu hình tương đương):
    ```json
    {
      "mcpServers": {
        "specmatic": {
          "command": "npx",
          "args": ["specmatic-mcp"]
        }
      }
    }
    ```

---

### Top 2: SmartBear MCP Server (`smartbear/smartbear-mcp`)
* **Kiến trúc**: MCP Server kết nối các công cụ quản lý API của SmartBear vào môi trường lập trình của Agent.
* **Cơ chế sinh Test & Test Matrix**:
  * Phân tích các mô hình dữ liệu trên SwaggerHub và PactFlow.
  * Tự động tạo kịch bản Consumer-Driven Contract Testing giữa các dịch vụ vi mô (microservices), đảm bảo thay đổi phía Provider không làm hỏng phía Consumer.
* **Cấu hình tích hợp**:
  * Cài đặt qua bộ nạp MCP của client:
    ```json
    {
      "mcpServers": {
        "smartbear": {
          "command": "npx",
          "args": ["-y", "@smartbear/mcp"]
        }
      }
    }
    ```

---

### Top 3: API Test Suite Builder (`borghei/Claude-Skills`)
* **Kiến trúc**: Skill dạng chỉ dẫn (`SKILL.md`) tối ưu hóa chuỗi suy luận (chain-of-thought) của mô hình.
* **Cơ chế sinh Test & Test Matrix**:
  * Khi người dùng yêu cầu viết test cho một route, Skill kích hoạt quy trình lập ma trận:
    1. **Happy Path**: Trạng thái thành công ($200, 201$).
    2. **Negative Cases**: Lỗi dữ liệu vào ($400, 422$), tài nguyên không tồn tại ($404$).
    3. **Boundary Analysis**: Giá trị cực đại, cực tiểu, chuỗi ký tự rỗng, chuỗi quá dài.
    4. **Auth & Permissions**: Không có token ($401$), sai quyền truy cập ($403$).
  * Hướng dẫn mô hình viết mã kiểm thử theo cú pháp Pact DSL hoặc schema assertion bằng Zod / Joi.
* **Cấu hình tích hợp**:
  * Tải vào thư mục kỹ năng của Claude Code:
    ```bash
    mkdir -p .claude/skills
    git clone --depth 1 https://github.com/borghei/Claude-Skills.git /tmp/Claude-Skills
    cp -r /tmp/Claude-Skills/engineering/api-test-suite-builder .claude/skills/
    ```
  * Tải cho Codex / Cursor qua Skills CLI:
    ```bash
    npx skills add https://github.com/borghei/Claude-Skills --skill api-test-suite-builder
    ```

---

### Top 4: APITester MCP (`kirti676/apitestermcp`)
* **Kiến trúc**: Bộ công cụ MCP mở rộng chuyên môn hóa cho luồng sinh ca kiểm thử API.
* **Cơ chế sinh Test & Test Matrix**:
  * Đọc trực tiếp tệp OpenAPI Specification hoặc Postman Collection qua tool `ingest_spec`.
  * Agent gọi tool `generate_scenarios` với các cờ `include_negative_tests: true` và `include_edge_cases: true`.
  * Sau khi có ma trận kịch bản, Agent gọi tool `generate_test_cases` để xuất file test (`*.spec.ts`, `*.test.py`) và thực thi đối soát phản hồi từ server.
* **Cấu hình tích hợp**:
  ```json
  {
    "mcpServers": {
      "apitester": {
        "command": "node",
        "args": ["/path/to/apitestermcp/index.js"]
      }
    }
    ```

---

### Top 5: QA Testing Strategy Skill (`vasilyu1983/ai-agents-public`)
* **Kiến trúc**: Instruction-based Skill định hình tư duy kiểm thử hệ thống.
* **Cơ chế sinh Test & Test Matrix**:
  * Thiết lập nguyên tắc kiểm soát: Yêu cầu Agent trước khi xuất code phải trình bày bảng phân tích ma trận tương thích ngược (Backward Compatibility Matrix).
  * Đối soát các thay đổi có khả năng gây phá vỡ hợp đồng (breaking changes) như xóa trường, đổi kiểu dữ liệu, hoặc bổ sung trường bắt buộc mới.
* **Cấu hình tích hợp**:
  ```bash
  npx skills add https://github.com/vasilyu1983/ai-agents-public --skill qa-testing-strategy
  ```

---

## 4. Minh họa Kịch bản Tạo Test Matrix cho Contract Testing

Dưới đây là cấu trúc bảng Test Matrix mà các Agent Skill yêu cầu mô hình thiết lập trước khi sinh mã kiểm thử:

| Nhóm Kiểm Thử | Endpoint / Action | Input Payload / Header | Trạng thái kỳ vọng | Kiểm tra Hợp đồng (Contract Assertion) |
| :--- | :--- | :--- | :---: | :--- |
| **Happy Path** | `POST /orders` | Dữ liệu chuẩn hợp lệ | `201 Created` | Header `Content-Type: application/json`, Schema khớp hoàn toàn OpenAPI model. |
| **Contract Breaking** | `POST /orders` | Thiếu trường bắt buộc (`customerId`) | `400 Bad Request` | Khớp schema lỗi chuẩn: `{ code: string, message: string }`. |
| **Boundary Value** | `POST /orders` | `quantity: 0` hoặc số âm | `422 Unprocessable` | Báo lỗi vi phạm ràng buộc miền dữ liệu (validation error). |
| **Type Mutation** | `POST /orders` | `totalAmount: "invalid_string"` | `400 Bad Request` | Không được văng lỗi $500$, bắt buộc trả về response format chuẩn. |
| **Auth RBAC** | `POST /orders` | Token hết hạn / Không có Bearer | `401 Unauthorized` | Không rò rỉ stack trace, đúng chuẩn bảo mật RFC 7807. |

---

## 5. Hướng dẫn Lựa chọn & Khuyến nghị Triển khai

1. **Khi cần độ chính xác thực thi tuyệt đối (Execution & Self-healing)**:
   * Sử dụng kết hợp **Specmatic MCP Server** (`specmatic/specmatic-mcp-server`). Khi Agent chỉnh sửa API backend, nó sẽ tự động chạy contract testing để kiểm tra xem thay đổi có vi phạm hợp đồng hay không.
2. **Khi cần định hướng Agent lập luận thông minh và sinh mã chất lượng cao**:
   * Cài đặt **API Test Suite Builder** (`borghei/Claude-Skills`) vào thư mục `.claude/skills/` hoặc cấu hình prompt của Codex. Cách tiếp cận này nhẹ nhàng, không phụ thuộc vào hạ tầng Docker hay runtime nền, phù hợp với hầu hết dự án đang phát triển.