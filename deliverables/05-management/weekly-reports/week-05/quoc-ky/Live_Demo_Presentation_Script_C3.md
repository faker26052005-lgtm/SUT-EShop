# Kịch Bản Thuyết Minh Trình Bày Live Demo Kịch Bản Pact C3 (Trực Tiếp Trên SUT Thật)

- **Người thực hiện & Thuyết minh:** **Nguyễn Quốc Kỳ (MSSV: 23120138)** — Nhóm 11
- **Đề tài Seminar:** T06 · API Testing & Contract Testing
- **Nội dung:** Kịch bản C3 — Phát hiện Breaking Change và Bảo vệ Tương thích Hợp đồng bằng Pact JS
- **Môi trường thực hiện:** 
  - Terminal 1 (Trái): Backend SUT EShop thật (`node server.js` tại `backend/`, cổng 3000, SQLite)
  - Terminal 2 (Phải): Bộ kiểm thử Pact tại `tests/pact`
- **Thời lượng dự kiến:** 5 – 7 phút

---

## BẢNG KỊCH BẢN THAO TÁC & LỜI THOẠI CHI TIẾT (STEP-BY-STEP LIVE SCRIPT)

### PHẦN 1: MỞ ĐẦU & THIẾT LẬP MÔI TRƯỜNG (00:00 – 01:00)

| Thời gian | Thao tác màn hình | Lời thoại thuyết minh (Script nói) | Điểm nhấn chuyên môn |
| :--- | :--- | :--- | :--- |
| **00:00 - 00:30** | - Chia đôi màn hình:<br>+ Trái: Terminal 1 (`backend/`)<br>+ Phải: Terminal 2 (`tests/pact/`)<br>- Mở sẵn file `backend/server.js` trong VS Code. | *"Kính chào Thầy và các bạn! Mình tên là Nguyễn Quốc Kỳ, MSSV 23120138. Sau đây mình xin demo trực tiếp kịch bản **C3: Phát hiện Breaking Change và ngăn chặn lỗi phá vỡ hợp đồng bằng Pact JS**.<br><br>Trong demo này, mình thao tác trực tiếp trên **Backend SUT thật** của EShop cổng 3000 và database SQLite thật để chứng minh tính thực tế 100%."* | Thể hiện tính minh bạch, không dùng mock che giấu. |
| **00:30 - 01:00** | **Terminal 1 gõ:**<br>`cd backend && node server.js`<br><br>*Server in log:*<br>`Server is running on http://localhost:3000` | *"Đầu tiên, ở Terminal bên trái, mình khởi động Backend SUT của EShop. Server đang lắng nghe tại cổng 3000.<br><br>Trước khi tiến hành kiểm chứng, chúng ta cần hiểu rõ: Provider Backend sẽ bị đối soát dựa trên tiêu chuẩn nào? Câu trả lời nằm ở tệp hợp đồng Pact JSON do Consumer sinh ra ở kịch bản C1."* | Khởi động SUT thật và tạo tiền đề xem hợp đồng. |

---

### PHẦN 2: XEM VÀ GIẢI THÍCH TỆP HỢP ĐỒNG PACT JSON (01:00 – 01:45)

| Thời gian | Thao tác màn hình | Lời thoại thuyết minh (Script nói) | Điểm nhấn chuyên môn |
| :--- | :--- | :--- | :--- |
| **01:00 - 01:45** | Mở file [`tests/pact/pacts/EShopMobile-EShopBackend.json`](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/tests/pact/pacts/EShopMobile-EShopBackend.json) trong VS Code.<br><br>Highlight chuột vào 3 vị trí:<br>1. `"consumer": "EShopMobile"` & `"provider": "EShopBackend"`<br>2. Endpoint `"GET /api/products/1"`<br>3. Khối `"matchingRules"` của `$.price`: `{"match": "integer"}` | *"Trên màn hình VS Code, các bạn đang thấy tệp hợp đồng `EShopMobile-EShopBackend.json`. Đây chính là 'bản hợp đồng pháp lý' giữa 2 dịch vụ.<br><br>Hãy chú ý vào 2 điểm cốt lõi:<br>1. Consumer `EShopMobile` yêu cầu tương tác `GET /api/products/1`.<br>2. Đặc biệt trong phần `matchingRules`, trường `$.price` được gắn matcher `{ match: 'integer' }`.<br><br>Ràng buộc này quy định chặt chẽ: Backend **bắt buộc phải trả về trường `price`** và giá trị **phải là kiểu số nguyên (Integer)**. Bất kỳ sự vi phạm nào về tên trường hay kiểu dữ liệu đều sẽ bị Pact bắt quả tang ngay tại chỗ!<br><br>Bây giờ, chúng ta sẽ xem Backend thật phản ứng ra sao với bản hợp đồng này."* | Giải thích bản chất `matchingRules` của Pact V3 Specification. |

---

### PHẦN 3: BƯỚC 1 — KIỂM CHỨNG BASELINE (01:45 – 02:30)

| Thời gian | Thao tác màn hình | Lời thoại thuyết minh (Script nói) | Điểm nhấn chuyên môn |
| :--- | :--- | :--- | :--- |
| **01:45 - 02:30** | **Terminal 2 gõ:**<br>`npm run test:provider`<br><br>*Quan sát:*<br>- Terminal 1 nhận log request.<br>- Terminal 2 in chữ xanh: `has a matching body (OK)`. | *"Tại Terminal bên phải, mình bắt đầu chạy Provider Verification:<br>`npm run test:provider`<br><br>Pact Verifier sẽ đọc tệp hợp đồng JSON vừa rồi và bắn request HTTP thật vào Backend cổng 3000. Như các bạn thấy ở Terminal trái, Backend đã nhận request và query database SQLite thật. Kết quả trả về **XANH 100%**.<br>Điều này chứng minh ở trạng thái bình thường (Baseline), Backend đáp ứng hoàn hảo hợp đồng."* | Khẳng định trạng thái chuẩn (Baseline) trước khi tiêm lỗi. |

---

### PHẦN 4: BƯỚC 2 — TIÊM LỖI #1: ĐỔI TÊN TRƯỜNG DỮ LIỆU (02:30 – 04:00)

| Thời gian | Thao tác màn hình | Lời thoại thuyết minh (Script nói) | Điểm nhấn chuyên môn |
| :--- | :--- | :--- | :--- |
| **02:30 - 03:00** | **Terminal 2 gõ:**<br>`npm run demo:mutate:rename`<br><br>Chuyển sang cửa sổ VS Code, chỉ vào dòng 169 trong `backend/server.js`. | *"Bây giờ, mình giả lập một tình huống thực tế: Lập trình viên Backend quyết định tái cấu trúc mã nguồn và đổi tên trường `price` thành `unit_price`. Mình thực thi lệnh:<br>`npm run demo:mutate:rename`<br><br>Như các bạn thấy trên màn hình VS Code, trường `price` đã bị đổi thành `unit_price`. Lưu ý rằng API này **vẫn trả về HTTP Status 200 OK**. Nếu dùng Postman thông thường chỉ assert status code, bài test sẽ PASS nhầm!"* | Nêu bật hạn chế của Functional API Testing (Postman). |
| **03:00 - 04:00** | **Terminal 1:** Bấm `Ctrl+C` và gõ lại `node server.js`.<br><br>**Terminal 2 gõ:**<br>`npm run test:provider`<br><br>*Pact in log đỏ rực:*<br>`$ -> Actual map is missing the following keys: price` | *"Bây giờ mình restart server để nhận code mới, và tại Terminal phải mình chạy lại Provider Verification:<br>`npm run test:provider`<br><br>Ngay lập tức, Pact Verifier đã **BÁO ĐỎ VÀ CHẶN ĐỨNG BẢN BUILD**!<br>Thông báo lỗi chỉ rõ: `Actual map is missing the following keys: price`.<br><br>Nhờ có Pact trong pipeline CI/CD, bản build lỗi này bị chặn ngay lập tức, ngăn ngừa thảm họa ứng dụng Mobile của khách hàng bị crash vì `product.price` trả về `undefined`."* | Phân tích thông báo lỗi FFI và giải thích tác động nghiệp vụ Mobile. |

---

### PHẦN 5: BƯỚC 3 — TIÊM LỖI #2: SAI LỆCH KIỂU DỮ LIỆU (04:00 – 05:15)

| Thời gian | Thao tác màn hình | Lời thoại thuyết minh (Script nói) | Điểm nhấn chuyên môn |
| :--- | :--- | :--- | :--- |
| **04:00 - 04:30** | **Terminal 2 gõ:**<br>`npm run demo:mutate:type`<br><br>Mở `backend/server.js`, chỉ vào dòng `price: "30.000.000 ₫"`. | *"Tiếp theo, mình thử nghiệm dạng Breaking Change thứ hai tinh vi hơn: **Sai lệch kiểu dữ liệu (Data Type Mismatch)**. Mình gõ:<br>`npm run demo:mutate:type`<br><br>Trong code `server.js`, lập trình viên tự ý format giá trị số thành chuỗi hiển thị tiền tệ `'30.000.000 ₫'`. Đây chính là khiếm khuyết thực tế của SUT EShop mà kịch bản Karate K2 của nhóm mình đã phát hiện ở các sản phẩm có ID chẵn."* | Tạo sợi dây liên kết học thuật giữa Karate K2 và Pact C3. |
| **04:30 - 05:15** | **Terminal 1:** Bấm `Ctrl+C` và gõ lại `node server.js`.<br><br>**Terminal 2 gõ:**<br>`npm run test:provider`<br><br>*Pact in log đỏ:*<br>`$.price -> Expected '30.000.000 ₫' (String) to be an integer number` | *"Mình restart Backend và chạy lại verification:<br>`npm run test:provider`<br><br>Pact Verifier một lần nữa **CHẶN ĐỨNG BẢN BUILD** với thông báo lỗi rõ ràng:<br>`Expected '30.000.000 ₫' (String) to be an integer number`.<br><br>Ràng buộc hợp đồng quy định `price` phải là số nguyên để Client tính toán giỏ hàng (`price * quantity`). Việc trả về String sẽ khiến giỏ hàng ra `NaN`, và Pact đã bắt trọn vẹn lỗi này."* | Khẳng định vai trò của Matcher Integer trong Pact V3. |

---

### PHẦN 6: BƯỚC 4 — HOÀN NGUYÊN & KẾT LUẬN (05:15 – 06:30)

| Thời gian | Thao tác màn hình | Lời thoại thuyết minh (Script nói) | Điểm nhấn chuyên môn |
| :--- | :--- | :--- | :--- |
| **05:15 - 05:50** | **Terminal 2 gõ:**<br>`npm run demo:restore`<br><br>**Terminal 1:** Restart `node server.js`.<br><br>**Terminal 2 gõ:**<br>`npm run test:provider`<br><br>*Pact in log xanh:*<br>`VERIFICATION SUCCESSFUL (Hợp đồng khớp 100%)` | *"Cuối cùng, để đưa hệ thống về trạng thái sản xuất an toàn, mình thực hiện hoàn nguyên mã nguồn bằng lệnh:<br>`npm run demo:restore`<br><br>File `server.js` được khôi phục nguyên bản từ bản backup an toàn. Mình restart server và chạy lại test:<br>`npm run test:provider`<br><br>Kết quả: **HỆ THỐNG XANH TRỞ LẠI 100%**. Không có bất kỳ dòng code lỗi nào bị sót lại."* | Thể hiện tính kỷ luật trong quản lý mã nguồn và Rollback. |
| **05:50 - 06:30** | Quay lại slide tổng kết hoặc màn hình VS Code: | *"Tóm lại, qua kịch bản C3 này, nhóm 11 đã chứng minh:<br>1. Pact JS hoạt động như một **Deployment Gate** tự động và tin cậy trong CI/CD.<br>2. Bắt được cả 2 dạng lỗi chí mạng: Đổi tên trường và Sai kiểu dữ liệu trên chính Backend SUT thật.<br>3. Ngoài ra, nhóm cũng đã đóng gói toàn bộ quy trình trên thành lệnh tự động hóa 1-click: `npm run test:c3:live` phục vụ kiểm thử hồi quy.<br><br>Phần trình bày kịch bản C3 của mình đến đây là kết thúc. Xin chân thành cảm ơn Thầy và các bạn đã theo dõi!"* | Đúc kết súc tích giá trị của đề tài. |

---

## BẢNG TRA CỨU NHANH CÁC LỆNH SỬ DỤNG TRONG DEMO

```bash
# ==============================================================================
# TERMINAL 1 (BACKEND SUT THẬT):
# ==============================================================================
cd /home/quocky05/academy/software-testing/seminar/SUT-EShop/backend
node server.js

# ==============================================================================
# TERMINAL 2 (TEST SUITE PACT):
# ==============================================================================
cd /home/quocky05/academy/software-testing/seminar/SUT-EShop/tests/pact

# Bước 1: Kiểm chứng Baseline (Kỳ vọng: XANH)
npm run test:provider

# Bước 2: Tiêm lỗi Rename (Kỳ vọng: ĐỎ - thiếu key price)
npm run demo:mutate:rename
npm run test:provider

# Bước 3: Tiêm lỗi Type (Kỳ vọng: ĐỎ - Expected integer but got string)
npm run demo:mutate:type
npm run test:provider

# Bước 4: Khôi phục và Xác nhận an toàn (Kỳ vọng: XANH)
npm run demo:restore
npm run test:provider
```
