# Báo Cáo Lỗi Hệ Thống SUT (Bug Report) – HW04

> **Môn học:** Kiểm thử Phần mềm (CS423 / CSC13003) – FIT@HCMUS  
> **Sinh viên:** Nguyễn Quốc Kỳ – **MSSV:** 23120138 – **Lớp:** 23CLC02  
> **Hệ thống thử nghiệm (SUT):** EShop Web & Admin Frontend (`https://github.com/ttbhanh/eshop-sut`)  
> **GitHub Repository:** `git@github.com:faker26052005-lgtm/SUT-EShop.git`  
> **Môi trường thử nghiệm:** Ubuntu Linux 24.04 LTS, Node.js v20.18.0, Playwright v1.49, 3 Trình duyệt (`chromium`, `firefox`, `webkit`)  
> **Tài liệu tham chiếu:** [GEMINI.md](../GEMINI.md), [specs/system_requirements_specification.md](../../../../specs/system_requirements_specification.md), [hw_02/Bug_Report.md](../../hw_02/Bug_Report.md)  

---

## 📌 PHẦN 1: BẢNG TỔNG HỢP & MA TRẬN TRUY VẾT LỖI (TRACEABILITY MATRIX)

### 1.1. Các Lỗi Mới Phát Hiện Thông Qua Automation Testing (Newly Discovered Defects)

Quá trình chuyển đổi từ kiểm thử thủ công sang tự động hóa chuyên sâu (soi thuộc tính DOM, phân tích mã HTTP response, và kiểm tra vòng đời trạng thái React) đã phát hiện **3 lỗi mới và khiếm khuyết kiến trúc** mà Domain Testing thủ công trước đó chưa bao quát:

| Bug ID | Feature | Tiêu đề lỗi hệ thống | Mức độ nghiêm trọng | Trạng thái GitHub Issue | Ảnh bằng chứng (Evidence) |
| :--- | :---: | :--- | :---: | :---: | :--- |
| **BUG-NEW-01** | **FR-02** | Trường mật khẩu sử dụng `type="text"` làm lộ mật khẩu bản rõ và tiêu đề form ghi sai "Đăng Ký" | **Major** (Security) | [Issue #178](https://github.com/faker26052005-lgtm/SUT-EShop/issues/178) | `BUG_FR02_NEW_password_plaintext.png`<br>`BUG_FR02_NEW_dom_input_type_text.png` |
| **BUG-NEW-02** | **API** | Endpoint `POST /api/register` vi phạm chuẩn RESTful code (trả về HTTP 200 OK thay vì 201 Created) | **Medium** (Standards) | [Issue #179](https://github.com/faker26052005-lgtm/SUT-EShop/issues/179) | `BUG_API_NEW_register_returns_200_not_201.png` |
| **BUG-NEW-03** | **FR-07** | Giỏ hàng bị mất sạch dữ liệu khi reload (F5) do chỉ lưu trong React State và đứt gãy với `/api/cart` | **Critical** (Data Loss) | [Issue #122](https://github.com/faker26052005-lgtm/SUT-EShop/issues/122) *(Đã có)* | `BUG_FR07_NEW_cart_before_reload.png`<br>`BUG_FR07_NEW_cart_empty_after_reload.png`<br>`BUG_FR07_NEW_network_no_cart_api.png` |

---

### 1.2. Bảng Ma Trận Kế Thừa & Tái Hiện Các Lỗi Từ Domain Testing HW02 (Re-verified Defects)

Toàn bộ **42 test case** thuộc nhóm `automate_expected_failure` trong bộ Playwright suite đã tái hiện thành công và kiểm chứng tự động các lỗi nghiệp vụ SUT thật đã được phát hiện tại HW02. Các lỗi này được ánh xạ trực tiếp tới các **GitHub Issues thật** đã tạo trên repository nhóm:

| Feature | Bug ID HW02 | Tóm tắt lỗi nghiệp vụ SUT | TC phát hiện | Mức độ | GitHub Issue tham chiếu | Kết quả tự động hóa |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: |
| **FR-02** | `BUG-FR02-01` | Bộ đếm số lần đăng nhập sai tăng 2 thay vì 1 sau 1 lần thử sai | `TC_FR02_03` | Major | [Issue #4](https://github.com/faker26052005-lgtm/SUT-EShop/issues/4) | **Re-verified** (Fail do backend +2) |
| **FR-02** | `BUG-FR02-02` | Khóa tài khoản phạt 180s thay vì 30s theo đặc tả SRS | `TC_FR02_04`, `TC_FR02_10` | Critical | [Issue #5](https://github.com/faker26052005-lgtm/SUT-EShop/issues/5) | **Re-verified** (HTTP 403 tại t=30s) |
| **FR-02** | `BUG-FR02-03` | Bộ đếm số lần đăng nhập sai nhảy vọt lên 4 tại lần thử sai thứ 3 | `TC_FR02_06` | Major | [Issue #6](https://github.com/faker26052005-lgtm/SUT-EShop/issues/6) | **Re-verified** (SQLite counter = 4) |
| **FR-02** | `BUG-FR02-04` | Mật khẩu đúng trong lúc đang bị khóa vẫn bypass đăng nhập thành công | `TC_FR02_07` | Critical | [Issue #7](https://github.com/faker26052005-lgtm/SUT-EShop/issues/7) | **Re-verified** (HTTP 200 tại t=15s) |
| **FR-02** | `BUG-FR02-05` | Form đăng nhập dùng input `type="text"` cho email, bỏ qua HTML5 validation | `TC_FR02_14` | Major | [Issue #8](https://github.com/faker26052005-lgtm/SUT-EShop/issues/8) | **Re-verified** (Form submit trực tiếp) |
| **FR-07** | `BUG-FR07-01` | Nút "Thêm vào giỏ hàng" tại ProductDetail bỏ qua lần click đầu tiên | `TC_FR07_01` | Major | [Issue #9](https://github.com/faker26052005-lgtm/SUT-EShop/issues/9) | **Re-verified** (`toHaveCount(1)` fail) |
| **FR-07** | `BUG-FR07-02` | Thêm cùng sản phẩm tạo dòng mới riêng biệt thay vì tăng số lượng | `TC_FR07_02` | Major | [Issue #10](https://github.com/faker26052005-lgtm/SUT-EShop/issues/10) | **Re-verified** (Tạo 2 dòng trong giỏ) |
| **FR-07** | `BUG-FR07-03` | Endpoint POST `/api/cart` chấp nhận ID sản phẩm không tồn tại (9999) | `TC_FR07_03` | Major | [Issue #11](https://github.com/faker26052005-lgtm/SUT-EShop/issues/11) | **Re-verified** (HTTP 200 OK) |
| **FR-07** | `BUG-FR07-04` | Endpoint POST `/api/cart` chấp nhận ID sai kiểu dữ liệu ("abc") | `TC_FR07_04` | Major | [Issue #12](https://github.com/faker26052005-lgtm/SUT-EShop/issues/12) | **Re-verified** (HTTP 200 OK) |
| **FR-07** | `BUG-FR07-05` | Nhập số lượng 0 hệ thống vẫn chấp nhận, lưu bản ghi có thành tiền 0 ₫ | `TC_FR07_05` | Major | [Issue #13](https://github.com/faker26052005-lgtm/SUT-EShop/issues/13) | **Re-verified** (Lưu giỏ hàng 0 ₫) |
| **FR-07** | `BUG-FR07-06` | Hệ thống chấp nhận số lượng âm (-1), hiển thị thành tiền âm trong giỏ | `TC_FR07_06` | Major | [Issue #14](https://github.com/faker26052005-lgtm/SUT-EShop/issues/14) | **Re-verified** (Tổng tiền bị âm) |
| **FR-07** | `BUG-FR07-07` | Xóa trống ô số lượng khiến giỏ hàng bị tính toán sai thành `"NaN ₫"` | `TC_FR07_07` | Major | [Issue #15](https://github.com/faker26052005-lgtm/SUT-EShop/issues/15) | **Re-verified** (`parseCurrency` ném lỗi) |
| **FR-07** | `BUG-FR07-08` | Nhập số lượng thập phân (1.5) được chấp nhận, giao diện tự làm tròn | `TC_FR07_09` | Major | [Issue #16](https://github.com/faker26052005-lgtm/SUT-EShop/issues/16) | **Re-verified** (Input nhận 1.5) |
| **FR-07** | `BUG-FR07-09` | Endpoint POST `/api/cart` chấp nhận payload khuyết trường quantity | `TC_FR07_10` | Major | [Issue #17](https://github.com/faker26052005-lgtm/SUT-EShop/issues/17) | **Re-verified** (HTTP 200 OK) |
| **FR-07** | `BUG-FR07-10` | Bảng giỏ hàng thiếu hoàn toàn nút `+`/`-` để điều chỉnh số lượng | `TC_FR07_13`, `14` | Major | [Issue #18](https://github.com/faker26052005-lgtm/SUT-EShop/issues/18) | **Re-verified** (Locator nút `+` fail) |
| **FR-07** | `BUG-FR07-11` | Nút Xóa sản phẩm xóa trực tiếp không có dialog xác nhận theo SRS | `TC_FR07_15`, `16` | Major | [Issue #19](https://github.com/faker26052005-lgtm/SUT-EShop/issues/19) | **Re-verified** (Không có dialog event) |
| **FR-07** | `BUG-FR07-12` | Giao diện giỏ hàng trống chỉ có text thuần, thiếu hình ảnh minh họa | `TC_FR07_17` | Medium | [Issue #20](https://github.com/faker26052005-lgtm/SUT-EShop/issues/20) | **Re-verified** (Thiếu illustration) |
| **FR-07** | `BUG-FR07-13` | Footer giỏ hàng hiển thị nhãn "Tổng tạm tính" thay vì "Tổng cộng" | `TC_FR07_18` | Medium | [Issue #21](https://github.com/faker26052005-lgtm/SUT-EShop/issues/21) | **Re-verified** (Text mismatch) |
| **FR-17** | `BUG-FR17-01` | Tạo trùng mã coupon gây lỗi unhandled HTTP 500 rò rỉ ngoại lệ SQLite | `TC_FR17_10` | Major | [Issue #22](https://github.com/faker26052005-lgtm/SUT-EShop/issues/22) | **Re-verified** (HTTP 500 SQLite leak) |
| **FR-17** | `BUG-FR17-02` | Endpoint POST `/api/admin/coupons` chấp nhận mã rỗng tạo coupon 200 OK | `TC_FR17_11` | Major | [Issue #23](https://github.com/faker26052005-lgtm/SUT-EShop/issues/23) | **Re-verified** (Tạo coupon rỗng) |
| **FR-17** | `BUG-FR17-03` | Nhập mã coupon chỉ chứa khoảng trắng được chấp nhận, hiển thị dòng rỗng | `TC_FR17_12` | Major | [Issue #24](https://github.com/faker26052005-lgtm/SUT-EShop/issues/24) | **Re-verified** (Tạo coupon whitespace) |
| **FR-17** | `BUG-FR17-04` | Endpoint POST `/api/admin/coupons` chấp nhận enum type không hợp lệ | `TC_FR17_13` | Major | [Issue #25](https://github.com/faker26052005-lgtm/SUT-EShop/issues/25) | **Re-verified** (Lưu type sai vào DB) |
| **FR-17** | `BUG-FR17-05` | Form Admin và API cho phép tạo coupon giảm giá 0% | `TC_FR17_14` | Major | [Issue #26](https://github.com/faker26052005-lgtm/SUT-EShop/issues/26) | **Re-verified** (Tạo coupon 0%) |
| **FR-17** | `BUG-FR17-06` | Form Admin và API chấp nhận giá trị giảm giá âm (-10) cho loại percent | `TC_FR17_15` | Major | [Issue #27](https://github.com/faker26052005-lgtm/SUT-EShop/issues/27) | **Re-verified** (Tạo coupon âm) |
| **FR-17** | `BUG-FR17-07` | Form Admin và API chấp nhận tỷ lệ giảm giá vượt 100% (101%) | `TC_FR17_16` | Major | [Issue #28](https://github.com/faker26052005-lgtm/SUT-EShop/issues/28) | **Re-verified** (Tạo coupon 101%) |
| **FR-17** | `BUG-FR17-08` | Form Admin và API cho phép tạo coupon giảm giá 0 ₫ cho loại fixed | `TC_FR17_17` | Major | [Issue #29](https://github.com/faker26052005-lgtm/SUT-EShop/issues/29) | **Re-verified** (Tạo fixed 0 ₫) |
| **FR-17** | `BUG-FR17-09` | Form Admin và API chấp nhận đơn hàng tối thiểu âm (-1 ₫) | `TC_FR17_18` | Major | [Issue #30](https://github.com/faker26052005-lgtm/SUT-EShop/issues/30) | **Re-verified** (Min order âm lưu DB) |
| **FR-17** | `BUG-FR17-10` | POST `/api/admin/coupons` ép max_uses_per_user = 0 thành 1 thay vì HTTP 400 | `TC_FR17_19` | Major | [Issue #31](https://github.com/faker26052005-lgtm/SUT-EShop/issues/31) | **Re-verified** (Tự ép 0 thành 1) |
| **FR-17** | `BUG-FR17-11` | POST `/api/admin/coupons` chấp nhận max_uses_per_user âm (-1) | `TC_FR17_20` | Major | [Issue #32](https://github.com/faker26052005-lgtm/SUT-EShop/issues/32) | **Re-verified** (Lưu -1 vào DB) |
| **FR-17** | `BUG-FR17-12` | POST `/api/admin/coupons` thiếu authorizeAdmin cho phép user thường tạo coupon | `TC_FR17_23` | Critical | [Issue #33](https://github.com/faker26052005-lgtm/SUT-EShop/issues/33) | **Re-verified** (User thường tạo 200 OK) |
| **FR-17** | `BUG-FR17-13` | DELETE `/api/admin/coupons/:id` trả về 200 OK khi xóa ID không tồn tại (9999) | `TC_FR17_24` | Medium | [Issue #34](https://github.com/faker26052005-lgtm/SUT-EShop/issues/34) | **Re-verified** (Báo xóa thành công) |
| **FR-17** | `BUG-FR17-14` | DELETE `/api/admin/coupons/:id` chấp nhận ID âm (-1) trả về 200 OK | `TC_FR17_25` | Medium | [Issue #35](https://github.com/faker26052005-lgtm/SUT-EShop/issues/35) | **Re-verified** (Báo xóa thành công) |
| **FR-17** | `BUG-FR17-15` | DELETE `/api/admin/coupons/:id` chấp nhận ID chuỗi ('abc') trả về 200 OK | `TC_FR17_26` | Medium | [Issue #36](https://github.com/faker26052005-lgtm/SUT-EShop/issues/36) | **Re-verified** (Báo xóa thành công) |
| **FR-17** | `BUG-FR17-16` | Công thức tính tiền giảm giá coupon percent bị đảo ngược khiến đơn hàng tăng gấp 10 | `TC_FR17_27` | Critical | [Issue #37](https://github.com/faker26052005-lgtm/SUT-EShop/issues/37) | **Re-verified** (Tổng tiền tăng gấp 10) |
| **FR-17** | `BUG-FR17-17` | Endpoint `/api/apply-coupon` từ chối đơn hàng bằng đúng ngưỡng tối thiểu On-point | `TC_FR17_30` | Major | [Issue #38](https://github.com/faker26052005-lgtm/SUT-EShop/issues/38) | **Re-verified** (Từ chối On-point) |
| **FR-17** | `BUG-FR17-18` | Endpoint `/api/apply-coupon` cho phép số tiền thanh toán bị âm | `TC_FR17_34` | Critical | [Issue #39](https://github.com/faker26052005-lgtm/SUT-EShop/issues/39) | **Re-verified** (Số tiền âm) |

---

## 🔍 PHẦN 2: BÁO CÁO CHI TIẾT CÁC LỖI MỚI PHÁT HIỆN QUA AUTOMATION TESTING

### 1. BUG-NEW-01: Trường nhập Mật khẩu hiển thị bản rõ (`type="text"`) & Tiêu đề Form ghi nhầm "Đăng Ký"

- **Mã định danh:** `BUG-NEW-01`
- **Tính năng liên quan:** FR-02 (Đăng nhập & Khóa tài khoản)
- **Mức độ nghiêm trọng:** **Major / Security Vulnerability**
- **Trình duyệt bị ảnh hưởng:** `chromium`, `firefox`, `webkit`
- **Test case phát hiện:** `TC_FR02_01`, `TC_FR02_02`
- **Trạng thái GitHub Issue:** [Issue #178](https://github.com/faker26052005-lgtm/SUT-EShop/issues/178) *(Đã tạo thành công)*
- **Ảnh minh chứng (Evidence):**
  - Giao diện lộ ký tự mật khẩu & tiêu đề sai: `evidence/BUG_FR02_NEW_password_plaintext.png`
  - DOM Inspect thẻ `<input type="text">`: `evidence/BUG_FR02_NEW_dom_input_type_text.png`

#### Các bước tái hiện (Steps to Reproduce):
1. Khởi động Web Frontend tại `http://localhost:5173`.
2. Truy cập vào trang đăng nhập: `http://localhost:5173/login`.
3. Quan sát tiêu đề chính giữa phía trên form đăng nhập.
4. Nhập mật khẩu vào trường "Mật khẩu" (ví dụ: `Test1234!`).
5. Mở DevTools (F12) -> tab **Elements**, inspect trực tiếp vào phần tử ô nhập mật khẩu.

#### Kết quả kỳ vọng (Expected Result theo SRS & OWASP):
- Tiêu đề của trang bắt buộc phải là **"Đăng Nhập"**.
- Theo tiêu chuẩn bảo mật Web OWASP Authentication Cheat Sheet và đặc tả giao diện SRS, trường mật khẩu bắt buộc phải có thuộc tính `type="password"`, tự động che giấu các ký tự người dùng gõ vào bằng dấu chấm tròn đen (`••••••••`) để chống lại hành vi nhìn trộm qua vai (Shoulder Surfing).

#### Kết quả thực tế quan sát được (Actual SUT Behavior):
- Tiêu đề của trang đăng nhập hiển thị nhầm thành **"Đăng Ký"** (gây hoang mang cho người dùng vì đây là chức năng Login).
- Ô nhập mật khẩu có thuộc tính `type="text"`, toàn bộ ký tự gõ vào hiển thị bản rõ (plaintext) trực tiếp trên màn hình máy tính.

#### Trích dẫn mã nguồn vi phạm tại SUT (`frontend-web/src/pages/Login.jsx`):
```jsx
// frontend-web/src/pages/Login.jsx: dòng 20-40
return (
  <div className="max-w-md mx-auto mt-10 bg-white p-8 border rounded shadow-sm">
    <h2 className="text-2xl font-bold mb-6 text-center">Đăng Ký</h2> {/* LỖI 1: Tiêu đề sai */}

    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2">Username</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2">Mật khẩu</label>
        <input
          type="text"                                                 {/* LỖI 2: type="text" thay vì type="password" */}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      ...
```

---

### 2. BUG-NEW-02: Endpoint `POST /api/register` trả về `HTTP 200 OK` thay vì chuẩn `HTTP 201 Created`

- **Mã định danh:** `BUG-NEW-02`
- **Tính năng liên quan:** Authentication API Backend (Setup Helper `registerFreshUser`)
- **Mức độ nghiêm trọng:** **Medium / Standards Compliance Defect**
- **Test case phát hiện:** Setup phase của bộ test suite FR-02 & FR-07
- **Trạng thái GitHub Issue:** [Issue #179](https://github.com/faker26052005-lgtm/SUT-EShop/issues/179) *(Đã tạo thành công)*
- **Ảnh minh chứng (Evidence):**
  - Terminal cURL response header: `evidence/BUG_API_NEW_register_returns_200_not_201.png`

#### Các bước tái hiện (Steps to Reproduce):
1. Đảm bảo Backend API server đang hoạt động tại cổng `:3000`.
2. Gửi một HTTP POST request đăng ký tài khoản mới qua terminal hoặc cURL:
   ```bash
   curl -i -X POST http://localhost:3000/api/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Verify User","email":"verify_new_bug@eshop.com","password":"Password123!"}'
   ```
3. Quan sát dòng Status Code trong Response Header trả về.

#### Kết quả kỳ vọng (Expected Result theo REST RFC 7231 §6.3.2):
- Khi một yêu cầu HTTP POST tạo mới thành công một tài nguyên trên máy chủ (Tạo bản ghi người dùng mới trong bảng `users`), máy chủ RESTful API bắt buộc phải trả về mã trạng thái:
  ```http
  HTTP/1.1 201 Created
  ```

#### Kết quả thực tế quan sát được (Actual SUT Behavior):
- Backend server trả về mã trạng thái `200 OK`:
  ```http
  HTTP/1.1 200 OK
  X-Powered-By: Express
  Content-Type: application/json; charset=utf-8
  
  {"message":"User registered successfully","id":24}
  ```
- Khi chạy script kiểm thử tự động Playwright với assertion chuẩn REST (`expect(response.status()).toBe(201)`), test case lập tức bị dừng lại do SUT vi phạm chuẩn giao thức API.

#### Trích dẫn mã nguồn vi phạm tại SUT (`backend/server.js`):
```javascript
// backend/server.js: dòng 20-30
app.post("/api/register", (req, res) => {
  const { name, email, password } = req.body;
  db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      // LỖI: Express res.json(...) mặc định trả về HTTP 200 OK thay vì res.status(201).json(...)
      res.json({ message: "User registered successfully", id: this.lastID });
    },
  );
});
```

---

### 3. BUG-NEW-03: Giỏ hàng bị xóa sạch dữ liệu khi Reload (F5) do đứt gãy kiến trúc với Backend API

- **Mã định danh:** `BUG-NEW-03`
- **Tính năng liên quan:** FR-07 (Giỏ hàng - Shopping Cart)
- **Mức độ nghiêm trọng:** **Critical / Data Loss Defect**
- **Trình duyệt bị ảnh hưởng:** `chromium`, `firefox`, `webkit`
- **Test case phát hiện:** Toàn bộ suite `TC_FR07_01` đến `TC_FR07_20`
- **Trạng thái GitHub Issue:** **[Issue #122](https://github.com/faker26052005-lgtm/SUT-EShop/issues/122)** *(Đã được ghi nhận bởi Nguyễn Quốc Kỳ)*
- **Ảnh minh chứng (Evidence):**
  - Giỏ hàng có sản phẩm trước khi F5: `evidence/BUG_FR07_NEW_cart_before_reload.png`
  - Giỏ hàng rỗng hoàn toàn sau khi F5: `evidence/BUG_FR07_NEW_cart_empty_after_reload.png`
  - Network tab chứng minh không gọi API: `evidence/BUG_FR07_NEW_network_no_cart_api.png`

#### Các bước tái hiện (Steps to Reproduce):
1. Truy cập `http://localhost:5173/product/1`.
2. Bấm nút "Thêm vào giỏ hàng" (bấm 2 lần do lỗi `BUG-FR07-01`).
3. Truy cập vào trang giỏ hàng `http://localhost:5173/cart`.
4. Quan sát thấy sản phẩm hiển thị trong bảng với thành tiền `25.000.000 ₫` và header hiển thị `Giỏ hàng (1)`.
5. Nhấn phím `F5` hoặc bấm nút Reload trên thanh công cụ trình duyệt.
6. Mở DevTools (F12) -> tab **Network**, lọc theo từ khóa `cart`.

#### Kết quả kỳ vọng (Expected Result theo SRS):
- Giỏ hàng của người dùng phải có tính bền vững (Persistence). Dữ liệu giỏ hàng phải được đồng bộ lưu trữ vào CSDL backend thông qua API `POST /api/cart` (hoặc tối thiểu là lưu vào Web Storage `localStorage`), đảm bảo người dùng tải lại trang, tắt tab hoặc mở lại trình duyệt thì danh sách sản phẩm đã chọn vẫn còn nguyên vẹn.

#### Kết quả thực tế quan sát được (Actual SUT Behavior):
- Toàn bộ giỏ hàng bị biến mất ngay lập tức sau khi reload; bảng giỏ hàng chuyển sang trạng thái trống *"Giỏ hàng của bạn đang trống"*, badge trên header quay về `(0)`.
- Tab Network hoàn toàn không ghi nhận bất kỳ API call nào đến `/api/cart`.
- Frontend Web và Backend API bị đứt gãy hoàn toàn: Backend có xây dựng endpoint `/api/cart` nhưng Frontend Web hoàn toàn bỏ quên không sử dụng.

#### Trích dẫn mã nguồn vi phạm tại SUT (`frontend-web/src/context/CartContext.jsx`):
```javascript
// frontend-web/src/context/CartContext.jsx: dòng 5-18
export const CartProvider = ({ children }) => {
  // LỖI: Chỉ lưu giỏ hàng trong RAM bộ nhớ của React state, mất hoàn toàn khi refresh
  const [cart, setCart] = useState([]);

  const addToCart = (product, quantity) => {
    setCart([...cart, { ...product, quantity }]); // Hoàn toàn không gọi POST /api/cart
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };
```

---

## 🛠️ PHẦN 3: ĐÁNH GIÁ CHẤT LƯỢNG VÀ ĐỀ XUẤT SỬA LỖI CHO SUT

1. **Khắc phục Lỗ hổng Bảo mật & Giao diện Form Đăng nhập (FR-02):**
   - Đổi thẻ tiêu đề `<h2>` trong [Login.jsx](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/frontend-web/src/pages/Login.jsx) thành `"Đăng Nhập"`.
   - Sửa thuộc tính input mật khẩu từ `type="text"` sang `type="password"`.
2. **Khắc phục Vi phạm Chuẩn RESTful API (Backend API):**
   - Tại route `POST /api/register` trong [server.js](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/backend/server.js), đổi `res.json(...)` thành `res.status(201).json(...)`.
3. **Khắc phục Đứt gãy Kiến trúc Giỏ hàng (FR-07):**
   - Trong [CartContext.jsx](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/frontend-web/src/context/CartContext.jsx), tích hợp `useEffect` để lưu `cart` vào `localStorage` hoặc gọi API `POST /api/cart` khi người dùng đã đăng nhập, bảo toàn giỏ hàng qua các lần tải lại trang.
