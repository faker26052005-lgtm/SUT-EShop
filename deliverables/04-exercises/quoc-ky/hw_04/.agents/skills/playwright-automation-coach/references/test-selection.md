# Choosing Which Test Cases to Automate (HW04)

> Tham chiếu: Bài giảng Automation Testing (FIT-HCMUS) & Nguyên tắc Kiểm thử SUT EShop (HW04).

---

## 1. Nguyên Tắc Cốt Lõi: Phân Biệt Khả Năng Tự Động Hóa (Testability) và Kết Quả Thực Thi (Pass/Fail)

Một trong những sai lầm phổ biến nhất trong kiểm thử tự động là **nhầm lẫn giữa việc test bị FAIL với việc test KHÔNG THỂ tự động hóa**.

- **Khả năng tự động hóa (Testability):** Là khả năng một công cụ kiểm thử (như Playwright) có thể thiết lập điều kiện, thực thi thao tác và kiểm chứng kết quả theo đặc tả yêu cầu (SRS) một cách tất định (deterministic).
- **Kết quả thực thi (Pass/Fail):** Là trạng thái đối chiếu giữa kết quả thực tế của SUT và kết quả mong đợi theo SRS.
  - Nếu SUT chưa làm đúng hoặc thiếu tính năng theo SRS (ví dụ: thiếu nút tăng/giảm số lượng, thiếu dialog xác nhận xóa, công thức tính giảm giá sai, thời gian khóa sai): **Test case đó hoàn toàn tự động hóa được và kỳ vọng sẽ FAIL**.
  - Việc test FAIL này chính là **mục tiêu cốt lõi của kiểm thử tự động: phát hiện defect thực tế của hệ thống**. Tuyệt đối không được loại bỏ các test case này sang danh mục "Not Automated".

---

## 2. Chuẩn Hóa 3 Trạng Thái Phân Loại (Automation Decision)

Mỗi test case bắt buộc phải được gán một trong 3 giá trị chuẩn:

1. **`automate` (Expected Pass):**
   - Kịch bản hoàn toàn khả thi để tự động hóa.
   - SUT hiện tại đáp ứng đúng đặc tả SRS, dự kiến test case sẽ **PASS**.
2. **`automate_expected_failure` (Expected Failure / SUT Defect):**
   - Kịch bản hoàn toàn khả thi để tự động hóa theo đặc tả SRS.
   - SUT hiện tại có lỗi (defect), thiếu thành phần giao diện, hoặc xử lý sai logic nghiệp vụ, dự kiến test case sẽ **FAIL**.
   - Bắt buộc ghi nhận kèm `defect_id` (ví dụ: `BUG-FR02-01`, `BUG-FR07-01`) để phục vụ báo cáo Bug Report và GitHub Issues.
3. **`blocked_deferred` (Blocked / Deferred):**
   - Kịch bản thực sự chưa thể thực thi tự động một cách đáng tin cậy do rào cản môi trường, hạn chế hạ tầng hoặc thiếu test hook backend (ví dụ: đòi hỏi chờ thời gian thực quá dài $> 6$ phút gây timeout CI/CD mà backend không có cấu hình rút ngắn thời gian).
   - Bắt buộc phải có 2 trường giải trình:
     * `blocker_reason`: Nguyên nhân kỹ thuật cụ thể gây tắc nghẽn.
     * `unblock_condition`: Điều kiện cần thiết để có thể kích hoạt lại test case (ví dụ: backend bổ sung biến môi trường `LOCK_TIME_MS` hoặc endpoint test hook).

---

## 3. Chuẩn Hóa 3 Tầng Kiểm Thử (Test Layers)

Kiểm thử tự động không bị giới hạn duy nhất ở giao diện người dùng. Cần lựa chọn tầng kiểm thử phù hợp nhất với bản chất của test case:

1. **`ui_e2e` (User Interface End-to-End):**
   - Tương tác qua trình duyệt thật: điền form, click nút, kiểm tra điều hướng trang, kiểm tra render DOM, dialog, bảng dữ liệu.
   - Dùng cho các luồng nghiệp vụ chính của người dùng (Checkout, Cart UI, Admin Coupon Form).
2. **`api` (REST API Validation & Concurrency):**
   - Gửi HTTP request trực tiếp qua `request: APIRequestContext` của Playwright.
   - Dùng cho: kiểm tra validation payload (thiếu trường, sai kiểu dữ liệu), phân quyền JWT role, và **kiểm thử tranh chấp đồng thời (concurrency / race condition) ở quy mô nhỏ** (dùng `Promise.all()` gửi 2 request cùng lúc để assert tính toàn vẹn CSDL).
3. **`integration` (State Injection & Timing Coordination):**
   - Kết hợp giữa gọi API thiết lập trạng thái trước (preconditions), điều phối thời gian boundary (ví dụ mốc 29s, 30s, 31s), và kiểm chứng kết quả qua API/UI.

---

## 4. Hướng Dẫn Chi Tiết Theo Từng Feature của SUT EShop

| Feature | Kịch bản điển hình | Nhận diện `automate_expected_failure` | Xử lý `blocked_deferred` |
| :--- | :--- | :--- | :--- |
| **FR-02 (Đăng nhập & Khóa)** | - Đăng nhập đúng/sai thông thường (`ui_e2e`).<br>- Validation email/pass rỗng hoặc sai chuẩn (`ui_e2e` / `api`).<br>- Mốc thời gian 29s, 30s, 31s (`integration`). | - `TC_FR02_03`, `04`: SUT tăng bộ đếm $+2$ thay vì $+1$.<br>- `TC_FR02_10`, `11`: SUT khóa 180s thay vì 30s.<br>- `TC_FR02_14`, `16`, `17`: Form không validate email sai. | `TC_FR02_12` (chu kỳ khóa lần 2) bị deferred vì chờ $> 360s$ thời gian thực do SUT hardcode 180s. Cần test hook backend để unblock. |
| **FR-07 (Giỏ hàng)** | - Thêm/xóa sản phẩm (`ui_e2e`).<br>- Tính toán thành tiền từng dòng và tổng giỏ hàng (`ui_e2e`).<br>- Kiểm tra trạng thái giỏ rỗng và chuyển hướng (`ui_e2e`). | - `TC_FR07_01`: Nút thêm ở ProductDetail đòi click 2 lần.<br>- `TC_FR07_02`: Thêm trùng tạo dòng mới thay vì cộng dồn.<br>- `TC_FR07_13`, `14`: SUT thiếu nút `+`/`-`.<br>- `TC_FR07_15`, `16`, `19`: SUT thiếu dialog xác nhận xóa.<br>- `TC_FR07_18`: Hiển thị "Tổng tạm tính" thay vì "Tổng cộng". | Không có case nào bị deferred. Tất cả 20 case đều tự động hóa được. |
| **FR-17 (Mã giảm giá Admin)** | - Tạo mã percent, fixed, biên 1%, 100%, min 0, max 1 (`ui_e2e`).<br>- Xóa mã, xem danh sách bảng (`ui_e2e`).<br>- Áp mã tại checkout (`ui_e2e`).<br>- Concurrency race condition (`api`). | - `TC_FR17_10`: Trùng mã văng lỗi 500 thay vì 400.<br>- `TC_FR17_14`..`21`: Cho phép tạo coupon với giá trị sai (0%, âm, quá hạn...).<br>- `TC_FR17_27`: Công thức giảm percent nhân ra số âm.<br>- `TC_FR17_30`: So sánh ngưỡng min dùng `>` thay vì `>=`.<br>- `TC_FR17_34`: Giảm quá giá trị đơn làm tổng tiền bị âm.<br>- `TC_FR17_36`: Request thứ 2 bị lỗi 500 thay vì 400. | Không có case nào bị deferred. Toàn bộ 36 case đều tự động hóa được. |

---

## 5. Quy Chuẩn Biểu Diễn Dữ Liệu Test Trong JSON

- **Không nhúng selector CSS thô vào JSON:** Tránh `expectedElement: "button.btn-primary"`. Hãy dùng định dạng ngữ nghĩa:
  ```json
  "expected": {
    "element": {
      "role": "button",
      "name": "-"
    }
  }
  ```
- **Không nhúng logic code Playwright vào JSON:** JSON chỉ chứa dữ liệu đầu vào, điều kiện tiên quyết (`preconditions`), và kết quả kỳ vọng (`expected`). Toàn bộ mã tương tác, wait, click, assert thuộc về Playwright spec / page object.
- **Kiểm thử Concurrency:** Sử dụng `valid_response_statuses: [200, 201, 400, 409]` kết hợp `db_record_count: 1` để kiểm tra tính toàn vẹn CSDL, ghi chú rõ giới hạn client-side dispatch của `Promise.all()`.
