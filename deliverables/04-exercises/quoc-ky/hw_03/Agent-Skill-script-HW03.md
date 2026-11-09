# Kịch bản chi tiết video demo 2 Agent Skill – HW03

**Sinh viên thực hiện:** Nguyễn Quốc Kỳ – MSSV: 23120138  
**Môn học:** Software Testing (CSC13003) – FIT @ HCMUS  
**Hệ thống kiểm thử (SUT):** EShop ([faker26052005-lgtm/SUT-EShop](https://github.com/faker26052005-lgtm/SUT-EShop))  
**Thời lượng video:** Linh hoạt (khoảng 8 – 12 phút / video, trình bày đầy đủ, rõ ràng từng phase)

---

## 0. Hướng dẫn thiết lập kỹ thuật trước khi bấm máy quay

1. **Hiển thị thông tin nhận diện (Overlay):**
   * Đặt text cố định ở góc trên màn hình: `Nguyễn Quốc Kỳ - 23120138 | CSC13003 - HW03 Demo`.
2. **Bố cục màn hình (Split Screen 50/50 hoặc 60/40):**
   * **Bên trái:** Khung chat tương tác với Agent (Antigravity / VS Code Chat / Terminal).
   * **Bên phải:** Trình soạn thảo mở cây thư mục dự án và các file kết quả (`PROGRESS.md`, `checklist.md`, `01-test-plan.md`, `checklist.xlsx`,...) để người xem thấy file tự động sinh và cập nhật real-time.
3. **Môi trường & Trình duyệt:**
   * Mở sẵn 1 tab trình duyệt vào GitHub Issues repo của bạn: `https://github.com/faker26052005-lgtm/SUT-EShop/issues`.
   * Mở sẵn ứng dụng EShop chạy tại `http://localhost:5173`.
   * Phóng to font chữ Terminal / IDE lên 125% – 140% để người xem đọc rõ văn bản.
4. **Nguyên tắc demo:**
   * Không chạy lại lệnh tạo issue thật (tránh sinh issue trùng). Tận dụng lệnh `--mode dry-run` đã lập trình sẵn để show terminal chạy thực tế cực kỳ thuyết phục và an toàn.
   * Tua nhanh hoặc cắt bớt các khoảng thời gian chờ AI generate nội dung dài (nhưng giữ nguyên lệnh prompt và kết quả sinh ra).

---

## 1. Video 1: Demo Skill `gui-checklist-coach`

**Mục tiêu video:** Chứng minh quy trình kiểm thử GUI 3 giai đoạn chuẩn học thuật (Specify → Prepare → Execute), cơ chế kiểm soát chất lượng qua từng Phase, nguyên tắc Human-in-the-loop, và tự động hóa kiểm thử bằng script Python.

---

### 1.0 Mở đầu & Giới thiệu tổng quan (Thời lượng: ~1 phút)

* **Thao tác màn hình:**
  1. Hiển thị Slide thông tin sinh viên hoặc file [README.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/README.md).
  2. Mở file [skills/gui-checklist-coach/SKILL.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/skills/gui-checklist-coach/SKILL.md), cuộn đến phần *Process alignment with course theory* và *Division of Labour*.
* **Lời thoại chi tiết:**
  > “Xin chào thầy,  em là Nguyễn Quốc Kỳ, MSSV 23120138. Trong bài tập cá nhân HW03, em thực hiện kiểm thử giao diện cho 2 màn hình Cart và Checkout của hệ thống thương mại điện tử EShop.
  >
  >  Em đã xây dựng Agent Skill `gui-checklist-coach`. Skill này chuẩn hóa quy trình kiểm thử GUI theo đúng giáo trình bài giảng số 13, chia làm 3 giai đoạn lớn và 7 phase chi tiết: từ xác định phạm vi, nạp taxonomy lỗi, sinh checklist bám 4 khía cạnh giao diện IA-01 đến IA-04, phản biện Human Gap Analysis, xuất bảng tính Excel tự động, cho đến gom nhóm lỗi và đẩy lên GitHub Issues.
  >
  > Bây giờ, em sẽ demo chi tiết cách skill hoạt động qua từng phase.”

---

### 1.1 Phase 1: Scope & Mapping (Xác định phạm vi kiểm thử)

* 🤖 **AI làm gì:**
  * Tự động đọc tài liệu bản đồ màn hình `screen-maps/eshop.md` có sẵn trong repo.
  * Tra cứu xem màn hình người dùng yêu cầu tương ứng với Functional Requirement nào (Cart $\rightarrow$ FR-07, Checkout $\rightarrow$ FR-08 và FR-09).
  * Đọc `screen-context/` để kiểm tra ngày chụp màn hình (`captured_at`) và nguồn quan sát (`source: running app`) có khớp với phiên bản SUT hiện tại hay không.
* 👤 **Tôi làm gì:**
  * Gõ prompt kích hoạt skill cho 2 màn hình Cart và Checkout.
  * Xác nhận phạm vi và cam kết màn hình không trùng lặp với các bạn khác trong nhóm.
  * Đối chiếu trạng thái màn hình thực tế trên `http://localhost:5173`.
* 📄 **Tạo ra cái gì:** Khởi tạo file theo dõi trạng thái `hw03-gui-checklist/PROGRESS.md` ghi nhận Phase 1 hoàn tất kèm hash commit SUT.
* **Thao tác màn hình:**
  1. Mở file [screen-maps/eshop.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/screen-maps/eshop.md) chỉ vào dòng ánh xạ `Cart` và `Checkout`.
  2. Mở khung chat Agent, dán prompt:
     ```text
     Mình cần làm GUI checklist cho màn hình Cart và Checkout của EShop.
     ```
  3. Cho người xem thấy Agent phản hồi: tự động nhận diện Cart $\rightarrow$ FR-07, Checkout $\rightarrow$ FR-08, FR-09; hỏi xác nhận về phiên bản giao diện trong `screen-context/`.
* **Lời thoại chi tiết:**
  > “Ở Phase 1, mục tiêu là xác định rõ phạm vi kiểm thử và ánh xạ màn hình vào yêu cầu nghiệp vụ. Thay vì bắt mình phải nhập lại thông tin từ đầu, skill tự động quét thư mục `screen-maps/eshop.md`. Đây là bản đồ mình đã chuẩn hóa một lần: Cart gắn với FR-07, còn Checkout gắn với FR-08 và FR-09.
  >
  > Đồng thời, skill kiểm tra tài liệu `screen-context/` mô tả chi tiết các phần tử thực tế của Cart và Checkout, hỏi mình xem phiên bản giao diện này có đúng với app đang chạy trên localhost hay không. Sau khi mình xác nhận, skill khởi tạo file `PROGRESS.md` để lưu vết tiến độ. Điều này đảm bảo checklist được thiết kế dựa trên giao diện thực tế chứ không phải AI tự đoán mò.”

---

### 1.2 Phase 2: Seed Taxonomy (Chuẩn bị hệ thống phân loại lỗi GUI)

* 🤖 **AI làm gì:**
  * Nạp hệ thống phân loại kiểm thử giao diện từ slide bài giảng S13 (15 nhóm lỗi GUI phổ biến).
  * Ánh xạ các nhóm lỗi này vào 4 khía cạnh giao diện bắt buộc của HW03:
    * `IA-01`: Tiêu chuẩn UI chung (Font chữ, màu sắc, tương phản WCAG AA, khoảng cách, căn lề, responsive, định dạng tiền tệ).
    * `IA-02`: Biểu mẫu (Validation, placeholder, tab order, focus indicator, định dạng số điện thoại/email).
    * `IA-03`: Điều hướng (Navbar, breadcrumb, nút quay lại, luồng đặt hàng, deep link).
    * `IA-04`: Phản hồi và trạng thái (Empty cart, loading spinner, thông báo áp mã coupon, thông báo lỗi thanh toán).
  * Thiết lập mục tiêu số lượng: trên 40 items, mức sàn tối thiểu ~8 items cho mỗi IA.
* 👤 **Tôi làm gì:**
  * Duyệt cấu trúc taxonomy, yêu cầu AI tập trung sâu vào các điểm nhạy cảm của EShop như tính toán mã giảm giá SAVE10, validation form giao hàng và tương phản màu nút bấm.
* 📄 **Tạo ra cái gì:** Cập nhật bảng taxonomy và chỉ tiêu phân bổ vào `PROGRESS.md`.
* **Thao tác màn hình:** Cuộn đến bảng Taxonomy trong `SKILL.md` và cho thấy mục tiêu số lượng items được thiết lập trong khung chat.
* **Lời thoại chi tiết:**
  > “Sang Phase 2, skill chuẩn bị Taxonomy phân loại lỗi. Giáo trình môn học quy định 4 khía cạnh giao diện bắt buộc từ IA-01 đến IA-04.
  >
  > AI không sinh ngẫu nhiên mà tải bộ khung 15 lỗi giao diện thường gặp trong bài giảng: ví dụ với IA-01 là lỗi tương phản màu theo chuẩn WCAG AA và quy cách viết hoa; với IA-02 là lỗi ràng buộc dữ liệu form; IA-03 là điều hướng bàn phím; và IA-04 là trạng thái phản hồi giỏ hàng rỗng hoặc áp mã coupon.
  >
  > Mục tiêu đặt ra là thiết kế trên 40 items, với mỗi khía cạnh IA phải đạt mức sàn ít nhất 8 items để tránh tình trạng chỉ tập trung vào form mà bỏ quên điều hướng hay phản hồi.”

---

### 1.3 Phase 3: Generate Initial Draft (AI sinh bản nháp checklist có cấu trúc)

* 🤖 **AI làm gì:**
  * Đọc chi tiết các DOM element từ `screen-context/cart.md` và `screen-context/checkout.md`.
  * Sinh các test items chi tiết theo từng IA. Mỗi item bắt buộc phải có cấu trúc chuẩn 8 cột:
    * `ID`: Đặt tên chuẩn hóa `<SCREEN>-<IA>-<NN>` (ví dụ `CART-IA01-04`, `CHCK-IA02-05`).
    * `Category`: Nhóm lỗi theo taxonomy.
    * `Check`: Hành động kiểm thử cụ thể (gắn với element thật, dữ liệu thật như sản phẩm Samsung Galaxy S24 Ultra giá 28.000.000 ₫, mã coupon SAVE10).
    * `Expected Result`: Chỉ mô tả kết quả khách quan mắt nhìn thấy được (không dùng từ nước đôi như ‘hoặc’, ‘gọn gàng’).
    * `Priority`: High / Medium / Low.
    * `Technical Notes`: Đẩy các class CSS (Tailwind: `bg-green-500`, `text-white`) sang cột riêng để người kiểm thử tiện tra cứu mã nguồn.
  * Sinh tổng cộng 70 items AI draft.
* 👤 **Tôi làm gì:**
  * Giám sát quá trình sinh, yêu cầu AI sinh từng nhóm IA một để dễ kiểm soát chất lượng, không để AI sinh dồn dập làm loãng chi tiết.
* 📄 **Tạo ra cái gì:** File bản nháp ban đầu `hw03-gui-checklist/checklist_draft_p3_p5.md`.
* **Thao tác màn hình:**
  1. Mở file [screen-context/cart.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/screen-context/cart.md) cho thấy các phần tử và hình ảnh tham chiếu.
  2. Mở file `hw03-gui-checklist/checklist_draft_p3_p5.md`, zoom vào 1 item mẫu (ví dụ `CART-IA01-04` kiểm tra độ tương phản nút thanh toán) để chỉ rõ các cột dữ liệu.
* **Lời thoại chi tiết:**
  > “Tại Phase 3, skill bắt đầu sinh bản nháp checklist. Điểm đặc biệt là skill không dùng các từ ngữ mơ hồ như ‘kiểm tra nút xem có đẹp không’. Mọi item đều gắn chặt với các phần tử có thật trong `screen-context`: từ tên nút ‘Tiến hành thanh toán’, tên sản phẩm ‘Samsung Galaxy S24 Ultra’, đến mã giảm giá ‘SAVE10’.
  >
  > Kết quả mong đợi được quy định rất nghiêm ngặt: chỉ mô tả đúng những gì hiển thị trực quan trên giao diện. Các chi tiết kỹ thuật như class Tailwind `bg-green-500` hay mã màu hex `#22c55e` được đẩy riêng vào cột Technical notes. Kết thúc Phase 3, AI đề xuất cho mình 70 items bản nháp trải đều trên cả Cart và Checkout.”

---

### 1.4 Phase 4: Review and Deduplicate (Người kiểm thử rà soát & loại bỏ trùng lặp)

* 🤖 **AI làm gì:**
  * Trình bày danh sách items cho sinh viên duyệt, phát hiện các items có nội dung tương đồng hoặc chồng chéo nhau giữa 2 màn hình.
* 👤 **Tôi làm gì:**
  * Kiểm tra từng item trên app thật: quyết định `Keep` (giữ nguyên), `Edit` (sửa lại cho chặt chẽ) hoặc `Reject` (từ chối).
  * Đưa ra lý do kỹ thuật rõ ràng cho các item bị từ chối (ví dụ: loại bỏ item kiểm tra phím `Shift+Tab` riêng lẻ vì đã được tích hợp trọn vẹn vào luồng kiểm tra `Tab order` của form Checkout).
* 📄 **Tạo ra cái gì:** Cập nhật bảng Rejected Items trong `PROGRESS.md` với đầy đủ ID và lý do loại bỏ.
* **Thao tác màn hình:** Mở file [hw03-gui-checklist/PROGRESS.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/hw03-gui-checklist/PROGRESS.md), cuộn đến bảng *Review Decisions & Rejected Items*.
* **Lời thoại chi tiết:**
  > “Ở Phase 4, nguyên tắc Human-in-the-loop được thể hiện rõ ràng. AI không thể tự quyết định item nào là chuẩn. Mình trực tiếp rà soát từng dòng: item nào tốt thì Keep, item nào diễn đạt chưa sát thì Edit, và item nào dư thừa thì Reject.
  >
  > Mọi quyết định Reject đều được ghi nhận vào `PROGRESS.md` kèm lý do kỹ thuật. Ví dụ item kiểm tra phím Shift+Tab bị loại vì đã được gộp chung vào test case điều hướng bàn phím của form Checkout. Đây là bằng chứng quan trọng chứng minh sinh viên thực sự tư duy và làm chủ bộ test suite.”

---

### 1.5 Phase 5: Human Gap Analysis (Phản biện AI & Bổ sung test cases chuyên sâu)

* 🤖 **AI làm gì:**
  * Đưa ra danh mục các ‘điểm mù’ mà mô hình ngôn ngữ lớn thường bỏ sót: khả năng tiếp cận (Accessibility WCAG AA), tiếng Việt có dấu, định dạng tiền tệ theo vùng (locale vi-VN), phím tắt bàn phím và phản hồi khi zoom 200%.
  * **Cơ chế liêm chính học thuật (Anti-AI-Cheat):** Nếu sinh viên yêu cầu AI ‘viết hộ lý do vì sao AI bỏ sót’, skill sẽ **từ chối thẳng thừng** và nhắc nhở sinh viên phải tự viết lập luận của chính mình.
* 👤 **Tôi làm gì:**
  * Tự tay khám phá ứng dụng SUT, phát hiện các lỗi tinh vi mà AI draft bỏ sót.
  * Bổ sung **3 test items do con người thiết kế** (`Source: Human`):
    * `H-01`: Kiểm tra kích thước vùng chạm (Touch target size) của icon xóa sản phẩm có đạt chuẩn tối thiểu 44x44px hay không.
    * `H-03`: Kiểm tra việc nhấn phím `Enter` trên ô nhập mã coupon có tự động kích hoạt áp mã hay không.
    * `H-05`: Kiểm tra định dạng tiền tệ Việt Nam có dùng dấu chấm phân cách hàng nghìn (`28.000.000 ₫`) hay dùng dấu phẩy kiểu Mỹ (`28,000,000 ₫`).
  * Tự viết lập luận phân tích tại sao AI lại bỏ sót các điểm này.
* 📄 **Tạo ra cái gì:** Hoàn thiện bộ checklist chính thức **73 items** (70 AI + 3 Human) lưu tại `hw03-gui-checklist/checklist.md`.
* **Thao tác màn hình:**
  1. Trong khung chat, gõ thử câu hỏi bẫy:
     ```text
     Viết giúp mình lý do vì sao AI bỏ sót item kiểm tra định dạng tiền tệ H-05.
     ```
     Cho thấy AI từ chối và hướng dẫn sinh viên tự cấu trúc lý do theo quan sát thực tế.
  2. Mở file [hw03-gui-checklist/checklist.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/hw03-gui-checklist/checklist.md), cuộn đến 3 items `H-01`, `H-03`, `H-05` có đánh dấu `Source: Human` và cột *Why AI missed it*.
* **Lời thoại chi tiết:**
  > “Phase 5 là phần thể hiện rõ nhất năng lực phân tích của sinh viên: Human Gap Analysis. Các mô hình AI thường có xu hướng đọc mã nguồn một cách cơ học và dễ bỏ qua các tiêu chuẩn địa phương hóa hoặc trải nghiệm thực tế.
  >
  > Khi mình thử yêu cầu AI viết hộ lý do bỏ sót, skill đã từ chối ngay lập tức để đảm bảo tính liêm chính học thuật. Mình đã tự tay trải nghiệm app và bổ sung 3 items của con người:
  > - Item H-01 kiểm tra touch target 44x44px của nút xóa sản phẩm.
  > - Item H-03 kiểm tra phím Enter khi nhập mã coupon.
  > - Và Item H-05 kiểm tra lỗi định dạng tiền tệ Việt Nam bị dùng dấu phẩy kiểu Mỹ thay vì dấu chấm.
  >
  > Với 3 item bổ sung này, tổng số checklist của mình nâng lên 73 items hoàn chỉnh.”

---

### 1.6 Phase 6: Tooling & Execution Sheet (Tự động hóa xuất Excel & Thực thi trên 3 trình duyệt)

* 🤖 **AI làm gì:**
  * Cung cấp kịch bản Python tự động `generate_checklist_excel.py` sử dụng thư viện `openpyxl`.
  * Thiết kế bảng tính chuyên nghiệp: cố định dòng tiêu đề, đặt Data Validation chỉ cho phép chọn `Passed` hoặc `Failed` (loại bỏ hoàn toàn trạng thái N/A), tự động tô màu có điều kiện (Passed = Xanh, Failed = Đỏ).
  * Tự động tạo Sheet thứ hai `Summary` chứa các công thức toán học (`COUNTA`, `COUNTIF`) để thống kê tự động số lượng Designed, Executed, Passed, Failed theo từng trình duyệt.
* 👤 **Tôi làm gì:**
  * Chạy lệnh Python sinh file Excel trực tiếp từ terminal.
  * Mở ứng dụng EShop trên 3 trình duyệt: **Google Chrome (Blink)**, **Mozilla Firefox (Gecko)**, và **Apple Safari / Mobile (WebKit)**.
  * Trực tiếp thực thi toàn bộ 73 items trên từng trình duyệt.
  * Chụp ảnh minh chứng có gắn thông tin nhận diện sinh viên đối với các items bị Failed theo cú pháp `FAILED_<ID>_<Platform>.png`.
  * Nhập kết quả vào file Excel: ghi nhận **51 Passed** và **22 Failed** trên mỗi nền tảng.
* 📄 **Tạo ra cái gì:** File thực thi chính thức `hw03-gui-checklist/checklist.xlsx` và thư mục ảnh bằng chứng `evidence/screenshots/`.
* **Thao tác màn hình:**
  1. Mở terminal, chạy lệnh:
     ```bash
     python3 skills/gui-checklist-coach/scripts/generate_checklist_excel.py hw03-gui-checklist/checklist.md hw03-gui-checklist/checklist.xlsx
     ```
  2. Mở file Excel `hw03-gui-checklist/checklist.xlsx` vừa sinh ra.
  3. Bấm vào một ô kết quả để show dropdown data validation chỉ có 2 giá trị `Passed` và `Failed`.
  4. Chuyển sang sheet **Summary**: Chỉ rõ các công thức Excel tự động nhảy số liệu: Designed 73, Executed 73, Passed 51, Failed 22 cho cả 3 cột Chrome, Firefox, Safari.
  5. Mở lướt thư mục `evidence/screenshots/` cho thấy các ảnh chụp lỗi có watermark MSSV.
* **Lời thoại chi tiết:**
  > “Bước sang Phase 6, skill tự động hóa việc xuất file kiểm thử bằng script Python `generate_checklist_excel.py`. File Excel được định dạng rất chuẩn chỉ:
  > - Cột kết quả có tính năng Data Validation, người kiểm thử chỉ được chọn Passed hoặc Failed, tuyệt đối không có N/A.
  > - Cột ghi chú lưu tên platform và mã file ảnh bằng chứng.
  > - Đặc biệt ở sheet Summary, toàn bộ số liệu được tính bằng công thức Excel động: 73 item thiết kế, 100% được thực thi trên cả 3 trình duyệt Chrome, Firefox, Safari, với kết quả đồng nhất là 51 Passed và 22 Failed.
  >
  > Toàn bộ 22 lỗi này đều có ảnh chụp màn hình kèm overlay thông tin sinh viên lưu trong thư mục `evidence/screenshots/`.”

---

### 1.7 Phase 7: Bug Reporting, GitHub Issue & Audit Log (Báo cáo lỗi & Kiểm toán AI)

* 🤖 **AI làm gì:**
  * Gom 22 thất bại đơn lẻ trên các trình duyệt thành các bản nháp báo cáo lỗi chuẩn trong `bug-drafts/`.
  * Cung cấp công cụ `create_github_issues.py` hỗ trợ cơ chế 3 bước an toàn: **Dry-run $\rightarrow$ Pilot $\rightarrow$ Batch**.
  * Tự động ánh xạ link ảnh bằng chứng vào nội dung issue, gán nhãn đầy đủ: `bug`, `severity`, khía cạnh `IA-xx`, và các nền tảng bị ảnh hưởng.
  * Sinh ma trận so sánh chéo nền tảng trong `test-summary.md` và gợi ý commit Git chuẩn.
* 👤 **Tôi làm gì:**
  * Đánh giá mức độ nghiêm trọng (Severity) theo ma trận rủi ro.
  * Chạy script ở chế độ `--mode dry-run` để kiểm tra toàn bộ 22 bản nháp mà không làm rác repo GitHub.
  * Duyệt nội dung và đẩy các issue lên GitHub (dải issue từ `#117` đến `#138`).
  * Thực hiện kiểm toán quá trình tương tác bằng skill `hw-ai-audit`.
* 📄 **Tạo ra cái gì:** 22 GitHub Issues trên kho lưu trữ, file `hw03-gui-checklist/test-summary.md`, file `AI_Audit_Report.md`.
* **Thao tác màn hình:**
  1. Trong terminal, chạy lệnh kiểm tra an toàn:
     ```bash
     python3 skills/gui-checklist-coach/scripts/create_github_issues.py --drafts-dir hw03-gui-checklist/bug-drafts --checklist-md hw03-gui-checklist/checklist.md
     ```
     Chỉ cho người xem thấy output in ra: `[DRY-RUN] Found 22 bug draft(s):`, các dòng `[ALREADY FILED: #117]...`, và kết luận `No GitHub requests were sent`.
  2. Chuyển sang trình duyệt web, mở tab GitHub Issues repo: Lướt qua danh sách 22 issues từ `#117` đến `#138`. Mở 1 issue bất kỳ (ví dụ `#117` hoặc `#135`) để show nội dung chi tiết: có nhãn, các bước tái hiện, và ảnh chụp bằng chứng nhúng trực tiếp.
  3. Mở file [AI_Audit_Report.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/AI_Audit_Report.md) cho thấy các bước tương tác AI đã được ghi lại minh bạch.
* **Lời thoại chi tiết:**
  > “Ở Phase cuối cùng, 22 trường hợp Failed được AI hỗ trợ gom nhóm thành các bug report hoàn chỉnh.
  >
  > Vì việc tạo issue lên GitHub rất khó xóa sạch nếu xảy ra lỗi, skill thiết kế một quy trình cực kỳ an toàn: chạy thử nghiệm Dry-run trước. Khi mình chạy lệnh với chế độ dry-run, script quét qua toàn bộ 22 file draft, kiểm tra đường dẫn ảnh và hiển thị trạng thái mà không gửi bất kỳ request nào lên máy chủ.
  >
  > Sau khi mình duyệt xong, script đã đồng bộ thành công 22 issues thực tế từ số 117 đến số 138 trên GitHub repo của mình, có đủ nhãn severity, khía cạnh giao diện và link ảnh bằng chứng.
  >
  > Cuối cùng, tại mỗi phase, mình đều sử dụng skill `hw-ai-audit` để lưu lại đầy đủ prompt và response vào file `AI_Audit_Report.md` nhằm bảo đảm tính trung thực học thuật theo đúng yêu cầu đề bài.
  >
  > Cảm ơn thầy cô và các bạn đã theo dõi phần demo của skill gui-checklist-coach!”

---

## 2. Video 2: Demo Skill `usability-evaluation-coach`

**Mục tiêu video:** Chứng minh quy trình đánh giá Usability có điều phối (Moderated Assessment Testing với Think-Aloud) chuẩn học thuật, cam kết tuyệt đối về tính chân thực của dữ liệu người dùng (Anti-AI-Cheat), và tự động hóa xử lý định lượng bằng công thức System Usability Scale (SUS) chuẩn của John Brooke và ma trận Criticality.

---

### 2.0 Mở đầu & Giới thiệu bài toán (Thời lượng: ~1 phút)

* **Thao tác màn hình:**
  1. Slide thông tin sinh viên: `Nguyễn Quốc Kỳ - MSSV: 23120138`.
  2. Mở file [skills/usability-evaluation-coach/SKILL.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/skills/usability-evaluation-coach/SKILL.md), zoom vào bảng *Division of Labour* và mục *Anti-AI-Cheat Hard Rules*.
  3. Mở file `.gitignore` chỉ vào dòng `usability/participants.md`.
* **Lời thoại chi tiết:**
  > “Xin chào thầy cô và các bạn. Mình là Nguyễn Quốc Kỳ, MSSV 23120138. Trong phần thứ hai của HW03, mình thực hiện đánh giá Usability cho luồng mua hàng trọn vẹn: Chọn sản phẩm $\rightarrow$ Thêm vào giỏ hàng $\rightarrow$ Áp mã giảm giá $\rightarrow$ Thanh toán trên hệ thống EShop.
  >
  > Khác với kiểm thử chức năng hay GUI checklist, kiểm thử Usability đòi hỏi sự tương tác trực tiếp với người dùng thật. Phương pháp mình sử dụng là Assessment Testing có điều phối 1-1, kết hợp giao thức suy nghĩ thành tiếng (Think-Aloud Protocol).
  >
  > Để hỗ trợ việc lập kế hoạch và phân tích số liệu phức tạp này, mình đã xây dựng skill `usability-evaluation-coach`.
  >
  > Mình xin nhấn mạnh cam kết liêm chính học thuật (Anti-AI-Cheat): AI tuyệt đối không được bịa đặt tên người tham gia, điểm khảo sát hay lời nhận xét. File chứa danh tính người dùng `usability/participants.md` được đưa vào `.gitignore` để bảo mật thông tin cá nhân. AI chỉ đóng vai trò trợ lý cấu trúc hóa tài liệu và tự động tính toán số liệu thống kê.”

---

### 2.1 Phase 0 & Phase 1: Setup & Usability Test Plan (Thiết lập phạm vi & Kế hoạch 9 mục)

* 🤖 **AI làm gì:**
  * Xác nhận luồng E2E (`Product $\rightarrow$ Cart $\rightarrow$ Coupon $\rightarrow$ Checkout`) chạm tới các yêu cầu chức năng FR-05, 06, 07, 09, 08.
  * Soạn thảo Kế hoạch kiểm thử khả năng sử dụng chính thức gồm 9 mục chuẩn mực quốc tế (`01-test-plan.md`) bằng tiếng Anh: Mục tiêu nghiên cứu, chân dung người tham gia (7 người thật ngoài lớp, ưu tiên không học CNTT + 1 người chạy pilot), môi trường thử nghiệm, và 4 thước đo định lượng (Completion Rate, Time-on-Task, Error Count, SUS Score).
* 👤 **Tôi làm gì:**
  * Xác định các câu hỏi nghiên cứu trọng tâm: người dùng có gặp khó khăn khi tìm ô nhập mã coupon không? Thông báo lỗi của hệ thống có đủ rõ ràng để người dùng tự phục hồi không?
  * Rà soát và phê duyệt kế hoạch.
* 📄 **Tạo ra cái gì:** File kế hoạch hoàn chỉnh `usability/01-test-plan.md` và `usability/PROGRESS.md`.
* **Thao tác màn hình:** Mở file [usability/01-test-plan.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/usability/01-test-plan.md), cuộn nhanh qua 9 mục, dừng lại ở bảng chỉ số đo lường hiệu năng.
* **Lời thoại chi tiết:**
  > “Ở Phase 0 và Phase 1, skill hướng dẫn thiết lập kế hoạch kiểm thử Usability gồm 9 mục bằng tiếng Anh theo tiêu chuẩn học thuật.
  >
  > Thay vì đưa ra các mục tiêu chung chung, kế hoạch xác định rõ các câu hỏi nghiên cứu cụ thể: ví dụ đo lường tỷ lệ hoàn thành tác vụ, thời gian hoàn thành so với mốc chuẩn, số lần người dùng thao tác sai hoặc cần trợ giúp, và thang đo độ thỏa dụng SUS.
  >
  > Đối tượng tham gia được xác định rõ là 7 người dùng bên ngoài, không học lớp kiểm thử và ưu tiên không có nền tảng CNTT để đảm bảo phản hồi mang tính khách quan nhất.”

---

### 2.2 Phase 2: Task Scenario & Scenario Lint (Thiết kế kịch bản & Cơ chế chống mớm thao tác)

* 🤖 **AI làm gì:**
  * Thiết kế kịch bản định hướng mục tiêu (Goal-oriented scenario) gồm 4 thành phần tác vụ và các bước thiết lập lại trạng thái (State reset steps) giữa các phiên thử nghiệm.
  * **Cơ chế đặc biệt - Scenario Lint:** Tự động kiểm tra kịch bản để đảm bảo người điều phối **không mớm thao tác cho người dùng**. Nếu kịch bản chứa tên nút bấm, đường dẫn menu hay các bước bấm cụ thể (ví dụ: ‘hãy bấm nút Apply’, ‘click vào giỏ hàng’), bộ lint sẽ cảnh báo và chặn lại ngay lập tức.
* 👤 **Tôi làm gì:**
  * Thử nghiệm tính năng Scenario Lint của skill bằng cách đưa vào một kịch bản có tính chất hướng dẫn thao tác.
  * Phê duyệt kịch bản chuẩn: ‘Bạn muốn mua một chiếc điện thoại Samsung Galaxy S24 Ultra, hãy tìm kiếm, cho vào giỏ hàng, sử dụng mã giảm giá SAVE10 mà bạn có và tiến hành đặt hàng về địa chỉ của bạn’.
* 📄 **Tạo ra cái gì:** File kịch bản [usability/02-task-scenario.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/usability/02-task-scenario.md).
* **Thao tác màn hình:**
  1. Trong khung chat, gõ thử một prompt vi phạm quy tắc:
     ```text
     Mình muốn kịch bản như sau: "Hãy bấm nút Thêm vào giỏ, sau đó vào giỏ hàng bấm nút Apply coupon rồi nhập địa chỉ".
     ```
     Cho thấy Agent lập tức phân tích và báo lỗi vi phạm: nhắc tên nút cụ thể và hướng dẫn thao tác, yêu cầu viết lại dưới dạng bài toán đời thực.
  2. Mở file [usability/02-task-scenario.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/usability/02-task-scenario.md) để người xem thấy kịch bản chuẩn và các bước reset state.
* **Lời thoại chi tiết:**
  > “Tại Phase 2, kịch bản kiểm thử phải hướng theo mục tiêu của người dùng chứ không được biến thành bài kiểm tra thao tác bấm nút.
  >
  > Skill tích hợp một tính năng rất thông minh là Scenario Lint. Khi mình thử nhập một kịch bản mớm lời như ‘Hãy bấm nút Apply coupon’, skill đã chặn lại ngay vì vi phạm nguyên tắc Usability Testing.
  >
  > Kịch bản chuẩn được thiết kế hoàn toàn tự nhiên: đặt người dùng vào tình huống muốn mua một chiếc điện thoại cao cấp và sử dụng mã ưu đãi mà họ có. Đồng thời, tài liệu chuẩn hóa quy trình Reset State để đưa database và giỏ hàng về trạng thái sạch trước mỗi phiên kiểm thử.”

---

### 2.3 Phase 3: Vietnamese Instruments (Bộ công cụ biểu mẫu Tiếng Việt cho người tham gia)

* 🤖 **AI làm gì:**
  * Soạn thảo toàn bộ tài liệu tương tác với người tham gia bằng tiếng Việt chuẩn mực (`03-instruments-vi.md`):
    * Phiếu đồng ý tham gia và cho phép ghi âm/ghi hình màn hình (Informed Consent Form).
    * Lời thoại dẫn nhập cho người điều phối giải thích phương pháp Think-Aloud (nhấn mạnh: ‘chúng tôi kiểm thử hệ thống, không kiểm thử bạn’).
    * Bảng câu hỏi SUS tiếng Việt chuẩn hóa gồm 10 câu (xen kẽ câu tích cực và tiêu cực) theo thang đo Likert 5 mức.
    * Bộ câu hỏi phỏng vấn đào sâu 4 chiều sau tác vụ (Probe questions: Rõ ràng, Khả năng tự sửa lỗi, Tốc độ, Độ tin cậy).
* 👤 **Tôi làm gì:**
  * Rà soát cách dùng từ tiếng Việt để đảm bảo ngôn ngữ thân thiện, tự nhiên, dễ hiểu với người lớn tuổi hoặc người không rành công nghệ.
* 📄 **Tạo ra cái gì:** File công cụ tiếng Việt hoàn chỉnh [usability/03-instruments-vi.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/usability/03-instruments-vi.md).
* **Thao tác màn hình:** Mở file [usability/03-instruments-vi.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/usability/03-instruments-vi.md), cuộn qua phần kịch bản dẫn nhập Think-Aloud và 10 câu hỏi SUS tiếng Việt.
* **Lời thoại chi tiết:**
  > “Ở Phase 3, để người tham gia thoải mái nhất, toàn bộ công cụ khảo sát được viết bằng tiếng Việt.
  >
  > Skill chuẩn bị sẵn lời dẫn mở đầu giúp giải tỏa tâm lý cho người dùng: nhấn mạnh rằng hệ thống đang được thử nghiệm chứ không phải đánh giá năng lực của họ.
  >
  > Đi kèm là bảng khảo sát SUS 10 câu kinh điển của John Brooke dịch sang tiếng Việt chuẩn, và 4 nhóm câu hỏi đào sâu về tính rõ ràng, khả năng tự hồi phục khi gặp lỗi, tốc độ và mức độ tin tưởng khi thanh toán.”

---

### 2.4 Phase 4 & Phase 5: Recruitment & Pilot Calibration (Bảo mật & Hiệu chỉnh phiên Pilot)

* 🤖 **AI làm gì:**
  * Nhắc nhở quy tắc bảo vệ danh tính: kiểm tra file `usability/participants.md` đã được gitignore chưa, hướng dẫn mặt nạ hóa số điện thoại/Zalo dạng `0918***223`.
  * Hỗ trợ phân tích phiên thử nghiệm Pilot: so sánh thời gian thực tế với kịch bản dự kiến để hiệu chỉnh mốc benchmark thời gian ($\le 150$ giây).
  * Khẳng định nguyên tắc: **Dữ liệu phiên Pilot không được đưa vào tính toán thống kê SUS chính thức**.
* 👤 **Tôi làm gì:**
  * Tuyển chọn 8 người thật (1 pilot + 7 người chính thức `P01`–`P07`).
  * Thực hiện phiên Pilot thực tế để kiểm tra kịch bản và đường truyền máy chủ; ghi nhận kết quả vào `05-pilot-review.md`.
* 📄 **Tạo ra cái gì:** File `usability/participants.md` (chỉ lưu cục bộ) và báo cáo hiệu chỉnh [usability/05-pilot-review.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/usability/05-pilot-review.md).
* **Thao tác màn hình:**
  1. Mở file [usability/05-pilot-review.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/usability/05-pilot-review.md) chỉ ra mốc benchmark được chốt là 150 giây.
  2. Mở file `.gitignore` để khẳng định `participants.md` không bao giờ bị push lên mạng.
* **Lời thoại chi tiết:**
  > “Tại Phase 4 và 5, mình tuyển dụng 8 người tham gia thực tế bên ngoài lớp học. Thông tin liên lạc được mặt nạ hóa 4 số giữa và bảo vệ nghiêm ngặt trong file `participants.md` được gitignore.
  >
  > Mình tiến hành một phiên thử nghiệm Pilot trước. Phiên này giúp mình phát hiện những chỗ kịch bản có thể gây bối rối và cân chỉnh mốc thời gian hoàn thành benchmark chuẩn là 150 giây. Đúng như nguyên tắc học thuật, dữ liệu của phiên pilot này được giữ riêng và không tính vào điểm thống kê SUS sau này.”

---

### 2.5 Phase 6: Session Logging (Điều phối 7 phiên thực tế & Chuẩn hóa ghi chép)

* 🤖 **AI làm gì:**
  * Đọc các ghi chép thô, bản ghi thời gian và điểm số khảo sát do sinh viên nhập vào.
  * Tự động format thành các file ghi chép phiên chuẩn mực theo cấu trúc: kết quả hoàn thành, thời gian chạy tác vụ, số lỗi, timestamp chi tiết từng hành vi, và trích dẫn nguyên văn lời nói bột phát (Think-Aloud verbatim quotes).
  * Đồng bộ số liệu vào 2 file dữ liệu nguồn: `usability/data/sus.csv` và `usability/data/performance.csv`.
* 👤 **Tôi làm gì:**
  * Trực tiếp điều phối 7 buổi kiểm thử 1-1 với các người tham gia từ `P01` đến `P07`.
  * Bấm giờ chính xác bằng đồng hồ, ghi nhận các điểm tắc nghẽn giao diện và thu thập phiếu trả lời khảo sát SUS của từng người.
  * Nhập liệu trung thực vào hệ thống.
* 📄 **Tạo ra cái gì:** Thư mục ghi chép chi tiết `usability/sessions/P01/` đến `P07/`, các file dữ liệu `sus.csv`, `performance.csv`.
* **Thao tác màn hình:** Mở một thư mục session thực tế, ví dụ file `usability/sessions/P03/notes.md` (hoặc `P05/notes.md`), zoom vào các mốc timestamp và câu nói nguyên văn của người dùng khi gặp lỗi.
* **Lời thoại chi tiết:**
  > “Ở Phase 6, mình trực tiếp điều phối 7 phiên thử nghiệm riêng biệt với 7 người dùng từ P01 đến P07.
  >
  > Sau mỗi buổi, mình nhập ghi chú thô, số giây bấm giờ và phiếu đánh giá của người dùng. AI hỗ trợ mình chuẩn hóa thành các file session notes có cấu trúc: ghi rõ từng mốc thời gian, người dùng click vào đâu, tỏ ra bối rối ở điểm nào và phát biểu những câu nói gì trong lúc thao tác.
  >
  > Toàn bộ điểm số thô được đưa vào file `sus.csv` và `performance.csv` phục vụ cho việc tính toán tự động.”

---

### 2.6 Phase 7: Quantitative & Qualitative Analysis (Chạy Script tính SUS & Ma trận Criticality)

* 🤖 **AI làm gì:**
  * Cung cấp script phân tích chuyên dụng `score_usability.py`.
  * **Thuật toán tính điểm SUS:** Áp dụng đúng công thức chuẩn của John Brooke:
    $$\text{Score} = \left( \sum (R_{\text{odd}} - 1) + \sum (5 - R_{\text{even}}) \right) \times 2.5$$
  * Tính toán giá trị trung bình ($\bar{x}$), trung vị (Median), độ lệch chuẩn ($\sigma$), khoảng tin cậy 95% Confidence Interval, và so sánh với mức chuẩn trung bình ngành (~68.0).
  * Thống kê hiệu năng: Tỷ lệ hoàn thành tác vụ (Completion Rate), thời gian trung bình (Mean Task Duration) so với benchmark 150s.
  * **Ma trận Criticality ($S \times P$):** Phân loại mức độ nghiêm trọng nhân với tần suất xuất hiện, kèm theo quy tắc **Blocker / Major Override** (lỗi nghiêm trọng dù chỉ 2 người gặp phải vẫn được ưu tiên khắc phục khẩn cấp *Fix First*).
* 👤 **Tôi làm gì:**
  * Chạy script Python tính toán trực tiếp trong terminal với benchmark 150 giây.
  * Rà soát bảng kết quả phân tích trong `06-analysis.md`.
* 📄 **Tạo ra cái gì:** File phân tích định lượng & định tính chi tiết [usability/06-analysis.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/usability/06-analysis.md).
* **Thao tác màn hình:**
  1. Trong terminal, chạy lệnh:
     ```bash
     python3 skills/usability-evaluation-coach/scripts/score_usability.py --dir usability/data --benchmark 150
     ```
  2. Màn hình terminal in ra bảng thống kê: Điểm SUS trung bình: **76.79 / 100**, Completion Rate 100%, Thời gian trung bình 140.9 giây.
  3. Mở file [usability/06-analysis.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/usability/06-analysis.md) chỉ vào bảng điểm SUS chi tiết của từng người và ma trận Criticality.
* **Lời thoại chi tiết:**
  > “Phase 7 là điểm sáng tự động hóa của skill với kịch bản `score_usability.py`. Mình chạy lệnh trực tiếp trên terminal với benchmark 150 giây.
  >
  > Script đọc dữ liệu từ `sus.csv` và tính toán theo đúng công thức chuẩn của John Brooke: câu lẻ lấy điểm trừ 1, câu chẵn lấy 5 trừ điểm, sau đó nhân 2.5. Điểm SUS trung bình của hệ thống đạt 76.79 trên 100, cao hơn mức chuẩn chung của ngành là 68 điểm (+8.79), đạt xếp loại Grade B (Good).
  >
  > Thời gian hoàn thành trung bình là 140.9 giây, đạt yêu cầu benchmark.
  >
  > Đặc biệt, ma trận xếp hạng lỗi Criticality áp dụng quy tắc Major Override: lỗi F-01 về thông báo mã giảm giá khó hiểu làm 2 người dùng bị kẹt tác vụ được tự động nâng mức ưu tiên lên Fix First, không để kích thước mẫu nhỏ làm giảm tầm quan trọng của lỗi nghiêm trọng.”

---

### 2.7 Phase 8 & Phase 9: Usability Bugs, Report & Audit Log (Báo cáo lỗi, Báo cáo tổng kết & Audit)

* 🤖 **AI làm gì:**
  * Phân biệt ranh giới giữa ‘đề xuất cải tiến trải nghiệm’ (UX recommendations) và ‘lỗi hệ thống thực sự’ (genuine bugs).
  * Soạn thảo 2 bản nháp GitHub Issue cho 2 lỗi hệ thống phát hiện qua đợt thử nghiệm người dùng.
  * Tổng hợp toàn bộ kết quả thành báo cáo Usability hoàn chỉnh bằng tiếng Anh (`08-usability-report.md`) kèm theo phần tự nhận xét hạn chế nghiên cứu (honest limitations).
  * Gợi ý chuỗi Git commit chuẩn hóa theo từng session (`test(usability): record session P01`...).
* 👤 **Tôi làm gì:**
  * Duyệt bản nháp và xác nhận mở 2 GitHub Issue thực tế:
    * Issue **#159** (Major): Lỗi thông báo mã giảm giá mơ hồ gây tắc nghẽn luồng checkout (F-01).
    * Issue **#160** (Minor): Ô nhập coupon không kích hoạt khi nhấn phím Enter (F-02).
  * Đọc báo cáo tổng hợp, thực hiện commit theo tiến trình và ghi nhật ký AI Audit.
* 📄 **Tạo ra cái gì:** 2 GitHub Issues (#159, #160), báo cáo [usability/08-usability-report.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/usability/08-usability-report.md), file `AI_Audit_Report.md`.
* **Thao tác màn hình:**
  1. Mở trình duyệt vào 2 GitHub Issues **#159** và **#160** trên repo của bạn, cho thấy issue được gắn nhãn `usability`, có trích dẫn trải nghiệm của người dùng thật (`P03`, `P05`).
  2. Mở file [usability/08-usability-report.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/usability/08-usability-report.md) lướt qua cấu trúc báo cáo chính thức.
  3. Lướt qua file `AI_Audit_Report.md` ghi vết toàn bộ quá trình dùng skill.
* **Lời thoại chi tiết:**
  > “Ở các phase cuối cùng, các phát hiện được sàng lọc kỹ càng: những góp ý về mặt thẩm mỹ được giữ trong báo cáo, còn lỗi phần mềm thực sự được chuyển hóa thành GitHub Issues.
  >
  > Đây là 2 issue #159 và #160 mình đã mở trên GitHub:
  > - Issue #159 ghi nhận lỗi thông báo áp mã giảm giá chung chung khiến người dùng P03 và P05 không biết vì sao bị từ chối.
  > - Issue #160 ghi nhận lỗi ô nhập mã không nhận phím Enter khiến người dùng P01 phải mất thời gian loay hoay tìm chuột.
  >
  > Báo cáo tổng hợp cuối cùng `08-usability-report.md` được tổng hợp đầy đủ bằng tiếng Anh. Toàn bộ các bước tương tác với AI đều được trích xuất bằng skill `hw-ai-audit` để lưu vào file `AI_Audit_Report.md`.
  >
  > Tóm lại, agent skill đã giúp mình tiết kiệm rất nhiều thời gian soạn thảo mẫu biểu và tính toán thống kê, trong khi toàn bộ dữ liệu người dùng, quan sát thực tế và quyết định đánh giá hoàn toàn là lao động thật của chính mình. Cảm ơn thầy cô và các bạn đã lắng nghe!”

---

## 3. Checklist hậu kỳ & Upload video lên YouTube

1. **Kiểm tra âm thanh & hình ảnh:**
   * Giọng nói rõ ràng, âm lượng đều, không có tiếng rè hoặc ồn nền.
   * Độ phân giải video: **1080p** (đảm bảo chữ trong Terminal và Markdown đọc rõ nét).
2. **Mô tả video YouTube & Chapters:**
   * Đặt chế độ video: **Unlisted** (Không công khai) hoặc **Public** (Công khai).
   * Dán bảng mốc thời gian (Timestamps/Chapters) vào phần mô tả video để người chấm bài tiện bấm đến từng phase:
     * **Video 1 (GUI Checklist):**
       * `0:00` - Giới thiệu & Cấu trúc quy trình 3 giai đoạn
       * `1:00` - Phase 1: Scope & Mapping màn hình vào FR
       * `2:15` - Phase 2: Seed Taxonomy 4 khía cạnh IA
       * `3:30` - Phase 3: AI sinh bản nháp checklist 70 items
       * `4:45` - Phase 4: Rà soát & Loại bỏ trùng lặp (Review Decisions)
       * `5:45` - Phase 5: Phản biện Human Gap Analysis (3 Human items)
       * `7:00` - Phase 6: Tooling xuất Excel & Thực thi trên 3 trình duyệt
       * `8:30` - Phase 7: Demo Dry-run & Đồng bộ 22 GitHub Issues
       * `9:45` - Tổng kết & Minh bạch AI Audit Log
     * **Video 2 (Usability Evaluation):**
       * `0:00` - Giới thiệu phương pháp & Cam kết Anti-AI-Cheat
       * `1:15` - Phase 0 & 1: Thiết lập & Test Plan 9 mục
       * `2:45` - Phase 2: Kịch bản mục tiêu & Demo Scenario Lint
       * `4:00` - Phase 3: Bộ công cụ biểu mẫu Tiếng Việt
       * `5:15` - Phase 4 & 5: Bảo mật thông tin & Hiệu chỉnh Pilot 150s
       * `6:30` - Phase 6: Điều phối 7 phiên thực tế & Session Notes
       * `7:45` - Phase 7: Script tính SUS (Brooke formula) & Ma trận Criticality
       * `9:15` - Phase 8 & 9: Báo cáo lỗi GitHub #159, #160 & Audit Log
       * `10:15` - Tổng kết & Bài học cộng tác cùng AI
3. **Cập nhật link nộp bài:**
   * Sau khi upload cả 2 video lên YouTube, chèn link vào mục 3 của file [README.md](file:///home/quocky05/academy/software-testing/seminar/SUT-EShop/deliverables/04-exercises/quoc-ky/hw_03/README.md#L44-L48):
     ```markdown
     ## 3. Demonstration Videos (YouTube Links)

     - **Agent Skill 1: GUI Checklist Coach Walkthrough:** `https://youtu.be/...`
     - **Agent Skill 2: Usability Evaluation Coach Walkthrough:** `https://youtu.be/...`
     ```
