# Báo Cáo Lỗi Hệ Thống SUT (Bug Report) – HW04

> **Môn học:** Kiểm thử Phần mềm (CS423 / CSC13003) – FIT@HCMUS  
> **Sinh viên:** Nguyễn Quốc Kỳ – **MSSV:** 23120138 – **Lớp:** 23CLC02  
> **Repository:** `git@github.com:faker26052005-lgtm/SUT-EShop.git`  
> **Môi trường thử nghiệm:** Ubuntu Linux, Node.js v20.18.0, Playwright v1.49  

---

## 📌 Danh Sách Lỗi Phát Hiện (Genuine SUT Defects)

| Bug ID | Feature | Tiêu đề lỗi | Mức độ nghiêm trọng | Trạng thái GitHub Issue |
| :--- | :---: | :--- | :---: | :---: |
| **BUG-FR02-01** | FR-02 | Thời gian khóa tài khoản là 180 giây, sai lệch đặc tả SRS (30 giây) | Major | [Issue #101](https://github.com/faker26052005-lgtm/SUT-EShop/issues) |
| **BUG-FR02-02** | FR-02 | Trường mật khẩu sử dụng `type="text"` làm lộ thông tin xác thực | Medium | [Issue #102](https://github.com/faker26052005-lgtm/SUT-EShop/issues) |
| **BUG-FR07-01** | FR-07 | Nút "Thêm vào giỏ hàng" tại trang chi tiết sản phẩm bắt buộc phải click 2 lần | Major | [Issue #103](https://github.com/faker26052005-lgtm/SUT-EShop/issues) |
| **BUG-FR17-01** | FR-17 | Form tạo coupon Admin không chặn giá trị giảm giá phần trăm vượt quá 100% | Medium | [Issue #104](https://github.com/faker26052005-lgtm/SUT-EShop/issues) |

---

## 1. BUG-FR02-01: Thời gian khóa tài khoản là 180 giây thay vì 30 giây theo SRS

- **GitHub Issue:** #101 (Đã đối chiếu với lỗi tương ứng từ HW02)
- **Test Case liên quan:** `TC_FR02_07`, `TC_FR02_10`
- **Trình duyệt bị ảnh hưởng:** `chromium`, `firefox`, `webkit`
- **Mức độ:** Major
- **Đối chiếu SRS:** Đặc tả `specs/system_requirements_specification.md` quy định: *"Tài khoản sẽ bị tạm khóa trong vòng 30 giây sau 3 lần đăng nhập sai liên tiếp."*
- **Mã nguồn thực tế tại SUT (`backend/server.js`):**
  ```javascript
  const LOCK_TIME = 3 * 60 * 1000; // 180 seconds thay vì 30 seconds
  ```
- **Hành vi thực tế:** Khi chạy test case chờ hết hạn khóa sau 30s, server vẫn trả về HTTP 403 Forbidden do chưa đủ 180s.
- **Hệ quả kiểm thử:** Test case kiểm tra mở khóa tự động không thể chạy trong bộ test suite tự động (phải phân loại sang danh mục *Not Automated*).

---

## 2. BUG-FR02-02: Trường nhập mật khẩu hiển thị bản rõ (`type="text"`)

- **GitHub Issue:** #102
- **Test Case liên quan:** `TC_FR02_01`, `TC_FR02_02`
- **Trình duyệt bị ảnh hưởng:** `chromium`, `firefox`, `webkit`
- **Mức độ:** Medium / Security Vulnerability
- **Đối chiếu SRS:** Giao diện đăng nhập chuẩn web phải ẩn ký tự nhập mật khẩu (`type="password"`).
- **Mã nguồn thực tế tại SUT (`frontend-web/src/pages/Login.jsx`):**
  ```jsx
  <label className="block text-gray-700 mb-2">Mật khẩu</label>
  <input
    type="text"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full border p-2 rounded"
    required
  />
  ```
- **Hành vi thực tế:** Ký tự mật khẩu hiển thị rõ ràng trên màn hình khi người dùng gõ phím.

---

## 3. BUG-FR07-01: Nút "Thêm vào giỏ hàng" tại ProductDetail đòi hỏi click 2 lần

- **GitHub Issue:** #103
- **Test Case liên quan:** `TC_FR07_01`, `TC_FR07_11`
- **Trình duyệt bị ảnh hưởng:** `chromium`, `firefox`, `webkit`
- **Mức độ:** Major
- **Mã nguồn thực tế tại SUT (`frontend-web/src/pages/ProductDetail.jsx`):**
  ```javascript
  const handleAddToCart = () => {
    if (clickCount === 0) {
      setClickCount(1);
      return; // Không làm gì cả ở lần đầu tiên
    }
    addToCart(product, parseInt(quantity));
  ...
  ```
- **Hành vi thực tế:** Người dùng click lần đầu không có bất kỳ phản hồi nào, giỏ hàng vẫn rỗng. Chỉ khi click lần thứ 2 thì sản phẩm mới được thêm vào.

---

## 4. BUG-FR17-01: Cho phép nhập giá trị giảm giá phần trăm > 100%

- **GitHub Issue:** #104
- **Test Case liên quan:** `TC_FR17_16`
- **Trình duyệt bị ảnh hưởng:** `chromium`, `firefox`, `webkit`
- **Mức độ:** Medium
- **Đối chiếu SRS:** Mã giảm giá phần trăm phải nằm trong khoảng $[1\%, 100\%]$.
- **Hành vi thực tế:** Giao diện cho phép nhập và gửi giá trị `150%` lên server, gây sai lệch nghiêm trọng logic tính tiền đơn hàng.
