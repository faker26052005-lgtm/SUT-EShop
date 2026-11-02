# TÀI LIỆU TỔNG HỢP VÀ BÁO CÁO LÝ THUYẾT: KIỂM THỬ GIAO DIỆN VÀ ĐỘ KHẢ DỤNG
**(GUI TESTING & USABILITY TESTING)**

> **Môn học:** Software Testing (CSC13003) - FIT@HCMUS  
> **Nguồn tài liệu:** *S13_GUI Testing & Usability Testing.pdf*

---

## MỤC LỤC
1. [Phần 1: Kiểm thử Giao diện Người dùng (GUI Testing)](#phan-1-kiem-thu-giao-dien-nguoi-dung-gui-testing)
   - 1.1 Khái niệm và Mục đích
   - 1.2 Tầm quan trọng của GUI Testing
   - 1.3 Quy trình Kiểm thử GUI (GUI Testing Process)
   - 1.4 Các lỗi GUI thường gặp (Common GUI Bugs)
   - 1.5 Cấp độ và Phân loại Kiểm thử GUI (Types & Levels of GUI Testing)
   - 1.6 Thách thức và Giải pháp trong GUI Testing
   - 1.7 Mức độ Tự động hóa (Manual vs. Automated GUI Testing)
2. [Phần 2: Kiểm thử Độ khả dụng (Usability Testing)](#phan-2-kiem-thu-do-kha-dung-usability-testing)
   - 2.1 Định nghĩa và Bản chất
   - 2.2 6 Thành phần cơ bản của Usability Testing
   - 2.3 Phân loại Usability Testing theo Giai đoạn
   - 2.4 Môi trường Kiểm thử (Test Environments)
   - 2.5 Cấu trúc Kế hoạch Kiểm thử Độ khả dụng (Usability Test Plan)
   - 2.6 Lựa chọn Nhiệm vụ và Cấu trúc Nhiệm vụ (Task Selection & Components)
   - 2.7 Lựa chọn Đánh giá viên và Nhóm Kiểm thử
   - 2.8 Phương pháp Đo lường và Bảng câu hỏi (Measurements & Questionnaires)
   - 2.9 Tóm tắt và Phân tích Dữ liệu Kết quả
---

# PHẦN 1: KIỂM THỬ GIAO DIỆN NGUỜI DÙNG (GUI TESTING)

### 1.1 Khái niệm và Mục đích
* **GUI (Graphical User Interface):** Giao diện đồ họa người dùng [1].
* **Định nghĩa GUI Testing:** Là quá trình kiểm tra các thành phần khác nhau của giao diện người dùng như nút bấm (buttons), menu, trường nhập liệu (input fields), và thiết kế trực quan nhằm xác minh chúng hoạt động đúng như thiết kế ban đầu [1].
* **Mục đích chính:**
  * Phát hiện và khắc phục mọi sự cố, lỗi (bugs) liên quan đến lớp giao diện [1].
  * Đảm bảo ứng dụng đạt tính thẩm mỹ trực quan, thân thiện với người dùng và phản hồi tốt [1].
* **Xác minh Chức năng (Functional Validation):** Mặc dù GUI Testing tập trung vào khía cạnh trực quan và tương tác, nó cũng đồng thời xác minh các chức năng gắn liền với những phần tử này xem có hoạt động chính xác hay không, đảm bảo tương tác của người dùng dẫn đến kết quả mong đợi [2].
* **Các thành phần GUI phổ biến được kiểm thử:** Nút bấm (buttons), hộp kiểm (checkboxes), nút chọn radio (radio buttons), danh sách thả xuống (dropdown menus), ô nhập văn bản (text fields), thông báo lỗi (error messages)... [2]

### 1.2 Tầm quan trọng của GUI Testing
* **Tập trung vào người dùng (User-Centric Focus):** Giao diện là điểm tương tác trực tiếp giữa phần mềm và người dùng cuối. Đảm bảo độ tin cậy và tính dễ sử dụng của GUI là yếu tố cốt lõi cho trải nghiệm người dùng tích cực [2].
* **Sự nhất quán về thị giác (Visual Consistency):** Đảm bảo phần mềm duy trì sự đồng nhất trên các thiết bị và nền tảng khác nhau, ngăn ngừa các lỗi như tràn văn bản (text overflow), lệch hàng (misalignment) hoặc hình ảnh bị biến dạng [2].
* **Xác minh chức năng tương tác (Functional Verification):** Đảm bảo các nút bấm thực hiện đúng hành động, biểu mẫu tiếp nhận dữ liệu chính xác, và menu điều hướng đến đúng các mục chức năng [3].
* **Tính khả dụng và Tính truy cập (Usability & Accessibility):** Đảm bảo giao diện trực quan, dễ điều hướng và hỗ trợ các tính năng truy cập cho người khuyết tật nhằm tuân thủ các quy định pháp lý [3].
* **Danh tiếng thương hiệu (Brand Reputation):** Giao diện chỉn chu, không có lỗi giúp nâng cao uy tín thương hiệu, thu hút và giữ chân người dùng [4].
* **Phát hiện lỗi sớm (Bug Detection):** Nhiều lỗi nghiêm trọng xuất hiện ở lớp GUI. Việc phát hiện sớm giúp giảm chi phí sửa lỗi trong các giai đoạn sau [4].
* **Tuân thủ quy chuẩn (Compliance):** Đối với các ngành như y tế, tài chính, GUI Testing giúp sản phẩm tuân thủ đúng các hướng dẫn và tiêu chuẩn quy định của ngành [4].

### 1.3 Quy trình Kiểm thử GUI (GUI Testing Process)
Quy trình kiểm thử GUI gồm 3 giai đoạn chính [5]:
1. **Xác định Kiểm thử (Specify Test / Test Design):** Thiết kế kịch bản và trường hợp kiểm thử từ yêu cầu hệ thống [5].
2. **Chuẩn bị Kiểm thử (Prepare Tests):**
   * Chuẩn bị kịch bản kiểm thử thủ công (Prepare Manual Scripts) [5].
   * Ghi kịch bản tự động (Record Automated Scripts) hoặc Viết mã kịch bản tự động (Code Automated Scripts) [5].
   * Tích hợp các kịch bản tự động (Integrate Automated Scripts) [5].
3. **Thực thi Kiểm thử (Execute Tests):** Thực thi thủ công (Manual Execution) hoặc Thực thi tự động (Automated Execution) [5].

### 1.4 Các lỗi GUI thường gặp (Common GUI Bugs)
Trong quá trình kiểm thử GUI, các lỗi phổ biến thường bao gồm [5, 6]:
* **Kiểm tra dữ liệu (Data validation):** Không kiểm tra đúng định dạng hoặc phạm vi dữ liệu vào [5].
* **Giá trị mặc định sai (Incorrect field default):** Giá trị ban đầu của ô nhập liệu không đúng quy định [5].
* **Xử lý sự cố máy chủ kém (Mishandling of server process failures):** Giao diện bị treo hoặc ngưng hoạt động khi xử lý máy chủ thất bại [5].
* **Trường bắt buộc không hoạt động đúng (Mandatory fields, not mandatory):** Trường bắt buộc nhập lại bỏ qua, hoặc ngược lại [5].
* **Truy vấn trả về sai trường (Wrong fields retrieved by queries):** Hiển thị sai thông tin cần lấy từ CSDL [5].
* **Tiêu chí tìm kiếm sai (Incorrect search criteria):** Kết quả tìm kiếm không ăn khớp với bộ lọc [5].
* **Thứ tự trường/ô nhập liệu không đúng (Field order):** Thứ tự phím Tab nhảy không logic [5].
* **Lỗi số lượng dòng dữ liệu trả về (Multiple database rows returned, single row expected):** Trả về nhiều dòng dữ liệu khi chỉ kỳ vọng 1 dòng [5].
* **Độ tươi của dữ liệu trên màn hình (Currency of data on screens):** Dữ liệu hiển thị không được làm mới kịp thời [5].
* **Tương ứng giữa cửa sổ và CSDL (Window object/DB field correspondence):** Cấu trúc trường hiển thị lệch so với CSDL [5].
* **Tính chế độ cửa sổ (Correct window modality?):** Cửa sổ dạng Modal/Modeless hoạt động không chính xác [5].
* **Lệnh hệ thống cửa sổ bị vô hiệu (Window system commands not available/don't work):** Nút thu nhỏ, phóng to, đóng cửa sổ không hoạt động [5].
* **Trạng thái điều khiển lệch với dữ liệu (Control state alignment with state of data in window):** Nút bấm/ô chọn bật/tắt không đúng theo trạng thái dữ liệu hiện tại [5, 6].
* **Con trỏ focus không chính xác (Focus on objects needing it):** Con trỏ không đặt tự động vào ô cần nhập [5].
* **Đồng bộ hóa nội dung cửa sổ (Synchronization of window object content):** Các thành phần giao diện không đồng bộ khi dữ liệu thay đổi [6].

### 1.5 Cấp độ và Phân loại Kiểm thử GUI (Types & Levels of GUI Testing)
Các loại kiểm thử GUI được chia theo các cấp độ (Stages) [6]:

| Cấp độ (Stage) | Loại kiểm thử (Test Types) | Nội dung chi tiết |
| :--- | :--- | :--- |
| **Low Level** | Checklist testing | Kiểm tra tiêu chuẩn GUI, tiêu chuẩn ứng dụng, bảng màu (Color scheme), kiểu chữ (Typography), bố cục & căn chỉnh (Layout & alignment), nhãn (Labels), thông báo lỗi (Error messages) [6]. |
| | Navigation testing | Điều hướng Menu chính (Main Menu), Vệt đường dẫn (Breadcrumbs), Liên kết & Nút bấm (Links & Buttons), Điều hướng biểu mẫu & thứ tự Focus (Form Navigation) [6, 7]. |
| **Application** | Equivalence Partitioning & Boundary Value Analysis | Kiểm tra tính hợp lệ của dữ liệu đầu vào và xử lý theo quy tắc đơn giản [7]. |
| | Decision Tables | Kiểm tra logic phức tạp hoặc các xử lý dựa trên quy tắc [7]. |
| | State Transition Testing | Kiểm tra các ứng dụng có trạng thái/chế độ mà hành vi xử lý bị ảnh hưởng, hoặc giữa các cửa sổ có sự phụ thuộc lẫn nhau [7]. |
| **Integration** | Desktop Integration | Kiểm tra sự tích hợp với môi trường Desktop [6, 8]. |
| | Client/Server Communications | Kiểm tra giao tiếp giữa phía máy khách và máy chủ [6, 8]. |
| | Synchronization | Kiểm tra tính đồng bộ dữ liệu và giao diện [6, 8]. |
| **Non-Functional**| Soak testing | Kiểm tra khả năng chịu tải liên tục trong thời gian dài [6, 8]. |
| | Compatibility testing | Kiểm tra tương thích giao diện trên các trình duyệt/thiết bị [6, 8]. |
| | Platform/Environment | Kiểm tra vận hành trên các nền tảng và môi trường hệ điều hành khác nhau [6, 8]. |

### 1.6 Thách thức và Giải pháp trong GUI Testing
1. **Đa dạng Nền tảng & Thiết bị:**
   * *Thách thức:* Đảm bảo giao diện hiển thị và vận hành đồng nhất trên nhiều hệ điều hành, trình duyệt và kích thước màn hình [8].
   * *Giải pháp:* Thực hiện kiểm thử toàn diện đa trình duyệt/thiết bị (cross-browser & cross-device) kết hợp thiết kế đáp ứng (Responsive Design) [8].
2. **Thay đổi UI Thường xuyên:**
   * *Thách thức:* Sự thay đổi giao diện liên tục làm các kịch bản tự động bị lỗi và tốn chi phí bảo trì [8].
   * *Giải pháp:* Xây dựng khung tự động hóa vững chắc, áp dụng mô hình **Page Object Model (POM)** để tách biệt sự thay đổi UI khỏi kịch bản kiểm thử [8].
3. **Độ bao phủ Kiểm thử (Test Coverage):**
   * *Thách thức:* Đảm bảo bao phủ toàn bộ các phần tử GUI và quy trình làm việc của người dùng [9].
   * *Giải pháp:* Phát triển chiến lược kiểm thử toàn diện bao quát cả các đường dẫn chính (critical paths) và các trường hợp biên/ngoại lệ (edge cases) [9].
4. **Thiết lập Dữ liệu và Môi trường:**
   * *Thách thức:* Việc khởi tạo dữ liệu và môi trường kiểm thử tốn nhiều thời gian [9].
   * *Giải pháp:* Sử dụng công cụ cấp phát dữ liệu (Data provisioning) và công nghệ đóng gói môi trường (Containerization / Docker) [9].
5. **Đa ngôn ngữ và Quốc tế hóa (Localization & Internationalization):**
   * *Thách thức:* Kiểm thử giao diện trên nhiều ngôn ngữ, văn hóa và vùng miền khác nhau [9].
   * *Giải pháp:* Sử dụng công cụ kiểm thử bản địa hóa và hợp tác với người bản ngữ [9].
6. **Tích hợp với Backend:**
   * *Thách thức:* Phối hợp kịch bản kiểm thử GUI với hệ thống backend và các API [10].
   * *Giải pháp:* Áp dụng chiến lược kiểm thử end-to-end (E2E) và sử dụng kỹ thuật giả lập (Mocking/Stubbing) cho các thành phần backend [10].

### 1.7 Mức độ Tự động hóa (Manual vs. Automated GUI Testing)

| Loại kiểm thử | Kiểm thử Thủ công (Manual) | Kiểm thử Tự động (Automated) |
| :--- | :--- | :--- |
| **Checklist testing** | Quy ước ứng dụng (Application conventions) [10]. | Trạng thái đối tượng, menu, các tính năng tiêu chuẩn [10]. |
| **Navigation** | Thực hiện thủ công [10]. | Không khuyến nghị/Thực hiện thủ công [10]. |
| **EP, BVA, Decision Tables, State Transition** | Trường hợp phức tạp [10]. | Trường hợp đơn giản [10]. |
| **Desktop Integration, C/S Communications** | Trường hợp phức tạp [10]. | Trường hợp đơn giản [10]. |
| **Synchronization** | Thực hiện thủ công [10]. | - |
| **Soak testing, Compatibility, Platform** | - | Thực hiện tự động [10]. |

---

# PHẦN 2: KIỂM THỬ ĐỘ KHẢ DỤNG (USABILITY TESTING)

### 2.1 Định nghĩa và Bản chất
* **Định nghĩa Usability Testing:** Là quy trình sử dụng các đại diện thuộc nhóm người dùng mục tiêu (representative target population participants) để đánh giá độ khả dụng của sản phẩm dựa trên các tiêu chí độ khả dụng cụ thể [11].
* **Bản chất:** Usability Testing không bảo đảm 100% sự thành công của sản phẩm, nhưng giúp phát hiện được ít nhất các vấn đề cốt lõi và quan trọng nhất về mặt trải nghiệm người dùng [11].

### 2.2 6 Thành phần cơ bản của Usability Testing
Một quy trình kiểm thử độ khả dụng tiêu chuẩn bao gồm 6 thành phần [11]:
1. **Xây dựng kế hoạch, mục tiêu kiểm thử và phát biểu bài toán cụ thể** (Development of specific problem statements, test plans, and objectives) [11].
2. **Sử dụng mẫu người dùng cuối đại diện** (Use of representative sample of end users) [11].
3. **Tái hiện môi trường làm việc thực tế** (Representation of the actual work environment) [11].
4. **Quan sát người dùng trong quá trình sử dụng hoặc đánh giá sản phẩm** (Observation of end users during product use or review) [11].
5. **Thu thập các phép đo định lượng và định tính** (Collection of quantitative and qualitative measurements) [11].
6. **Phân tích kết quả và đưa ra các đề xuất cải tiến** (Analysis of results and recommendations) [11].

### 2.3 Phân loại Usability Testing theo Giai đoạn
Kiểm thử độ khả dụng được chia thành 4 loại chính theo chu kỳ phát triển [12, 13, 14]:

1. **Kiểm thử Khám phá (Exploratory Testing):**
   * *Thời điểm:* Thực hiện ở giai đoạn đầu quy trình [12].
   * *Hình thức:* Dựa trên phác thảo (sketches), sơ đồ khung (wire diagrams)... [12]
   * *Mục tiêu:* Đánh giá khái niệm thiết kế sơ bộ ban đầu [12].
   * *Đặc điểm:* Thực hiện các nhiệm vụ tiêu biểu ở dạng "nông" (shallow mode), phương pháp kiểm thử không chính thức, tương tác nhiều giữa người giám sát và người tham gia để thảo luận khái niệm cấp cao [12].
2. **Kiểm thử Đánh giá (Assessment Testing):**
   * *Thời điểm:* Thực hiện sau khi các khái niệm thiết kế cốt lõi đã hoàn thành [12].
   * *Mục tiêu:* Đánh giá độ khả dụng của các thao tác cấp thấp hơn [12].
   * *Đặc điểm:* Người dùng thực hiện một tập hợp các nhiệm vụ được định nghĩa rõ ràng; ít tương tác với người giám sát; thu thập các phép đo định lượng [12].
3. **Kiểm thử Xác minh (Validation Testing):**
   * *Thời điểm:* Thực hiện ở cuối chu kỳ phát triển, gần thời điểm phát hành [13].
   * *Mục tiêu:* Xác nhận độ khả dụng của sản phẩm, đóng vai trò như "bảo hiểm hiểm họa" ngăn ra mắt sản phẩm kém chất lượng [13].
   * *Đặc điểm:* Thường là lần đầu tiên toàn bộ sản phẩm được kiểm thử tổng thể (bao gồm cả tài liệu và phần trợ giúp); đánh giá so với tiêu chuẩn hoặc chuẩn so sánh (benchmark) đã định trước (lấy từ dữ liệu lịch sử, đối thủ cạnh tranh, nghiên cứu thị trường); thu thập số liệu định lượng chi tiết [13].
4. **Kiểm thử So sánh (Comparison Testing):**
   * *Thời điểm:* Có thể thực hiện tại bất kỳ thời điểm nào trong chu kỳ phát triển [14].
   * *Mục tiêu:* So sánh các phương án thiết kế khác nhau bằng các phép đo khách quan [14].
   * *Đặc điểm:* Thường kết hợp những ưu điểm tốt nhất từ các thiết kế phương án [14].

### 2.4 Môi trường Kiểm thử (Test Environments)
Các dạng thiết lập môi trường kiểm thử độ khả dụng [14]:
* **Phòng đơn giản (Single room setup):** Người quan sát/giám sát ở gần người đánh giá [14].
* **Phòng tách biệt:** Người quan sát ở phòng khác tách biệt với người đánh giá [14].
* **Phòng quan sát điện tử (Electronic observation room):** Truyền hình ảnh/âm thanh qua thiết bị ghi hình [14].
* **Phòng Lab Usability truyền thống (Classic elaborate usability lab):** Gồm 3 khu vực riêng biệt: **Khu quan sát (Observation)**, **Khu đánh giá (Evaluation)**, và **Khu điều khiển (Control)** với hệ thống camera trần, camera sàn, micro và màn hình theo dõi [14].
* **Phòng Lab di động (Mobile lab):** Có thể di chuyển đến môi trường thực tế của người dùng [14].

### 2.5 Cấu trúc Kế hoạch Kiểm thử Độ khả dụng (Usability Test Plan Format)
Một bản kế hoạch kiểm thử độ khả dụng tiêu chuẩn bao gồm các mục chính [14]:
1. **Purpose:** Mục đích chính của đợt kiểm thử [14].
2. **Problem statement:** Các câu hỏi/vấn đề cụ thể cần giải quyết [14].
3. **Test plan and objectives:** Các nhiệm vụ người dùng sẽ thực hiện [14].
4. **User profile:** Chân dung người dùng tham gia [14].
5. **Method and test design:** Phương pháp quan sát, cách thức thu thập dữ liệu [14].
6. **Test environment and equipment:** Môi trường và trang thiết bị sử dụng [14].
7. **Test monitor role:** Vai trò của người giám sát [14].
8. **Evaluation measures and data to be collected:** Phép đo đánh giá và loại dữ liệu cần thu thập [14].
9. **Report:** Cấu trúc và nội dung báo cáo kết quả cuối cùng [14].

### 2.6 Lựa chọn Nhiệm vụ và Cấu trúc Nhiệm vụ (Task Selection & Components)
* **Nguyên tắc lựa chọn nhiệm vụ:**
  * Nhiệm vụ phải phản ánh các chức năng người dùng thực sự muốn làm trên sản phẩm [15].
  * **Tập trung vào góc nhìn người dùng (User view), KHÔNG tập trung vào chi tiết cài đặt kĩ thuật** [15].
  * Yêu cầu người dùng thực hiện nhiệm vụ thực tế và **KHÔNG hướng dẫn từng bước chi tiết cách thực hiện** nhằm làm lộ ra các lỗi khả dụng [15].
  * Chọn các nhiệm vụ cốt lõi (key tasks) và có tần suất sử dụng cao nhất (frequently done) [15].
  * Nhiệm vụ phải cụ thể và đo lường được (định lượng hoặc định tính) [15].
* **Thành phần của một Nhiệm vụ (Task Components):**

| Thành phần (Task Component) | Ví dụ minh họa 1 [16] | Ví dụ minh họa 2 [21] |
| :--- | :--- | :--- |
| **Task (Nhiệm vụ)** | Nạp giấy vào máy photo | Tạo máy ảo bằng New VM Wizard |
| **Machine state (Trạng thái ban đầu)** | Khay giấy đang trống | Phần mềm VMware Workstation vừa được mở |
| **Successful completion criteria (Tiêu chí thành công)** | Giấy được nạp đúng quy cách | Máy ảo hoạt động được tạo thành công |
| **Benchmark (Chuẩn so sánh)** | Hoàn thành trong 1 phút | Hoàn thành trong 30 giây |

* **Mối liên hệ giữa Problem Statement, Data, và Task:**

| Problem Statement | Performance Data | Preference Data | Task tương ứng |
| :--- | :--- | :--- | :--- |
| **Độ hiệu quả của bài hướng dẫn (Tutorial)** | So sánh tỷ lệ lỗi giữa nhóm dùng và không dùng tutorial [21]. | Đánh giá mức độ hiệu quả (Likert Scale) + Ý kiến tự do [21]. | Group A: Import ảnh không dùng tutorial.<br>Group B: Import ảnh có dùng tutorial trước [21]. |
| **Mức độ dễ dàng khi tạo Máy ảo** | Tỷ lệ lỗi HOẶC Số bước cần thực hiện [21]. | Đánh giá từ Rất dễ đến Rất khó + Ý kiến tự do [21]. | Tạo Máy ảo với các thuộc tính cho trước sử dụng New VM Wizard [21]. |

### 2.7 Lựa chọn Đánh giá viên và Nhóm Kiểm thử
* **Đại diện người dùng mục tiêu:** Đánh giá viên phải là đại diện chuẩn xác cho nhóm người dùng thực tế của sản phẩm [16].
* **Thiết kế nhóm (Independent vs. Within-Subject):** Có thể dùng nhóm độc lập hoặc thiết kế trong cùng đối tượng, nhưng phải cẩn trọng tránh việc người dùng bị lặp lại bài kiểm thử làm sai lệch kết quả (bias) [16].
* **Số lượng:** Đảm bảo số lượng người kiểm thử đủ lớn để có ý nghĩa thống kê [16].
* **Động lực:** Cần có cơ chế tưởng thưởng/kích thích người tham gia [16].

### 2.8 Phương pháp Đo lường và Bảng câu hỏi (Measurements & Questionnaires)
Dữ liệu thu thập được chia làm 2 nhóm chính [16]:
1. **Dữ liệu Hiệu năng (Performance Data - Định lượng):**
   * Đo lường hành vi thực tế của người dùng: Thời gian hoàn thành từng nhiệm vụ, tỷ lệ thành công/thất bại, số lần mở trợ giúp, số lần chọn sai, số lỗi mắc phải, thời gian phản hồi của hệ thống [16, 17].
   * Thu thập tự động hoặc thủ công một cách khách quan [16, 17].
2. **Dữ liệu Ý kiến/Sở thích (Preference Data - Định tính):**
   * Đo lường ý kiến, thái độ và suy nghĩ của người dùng thông qua Bảng câu hỏi (Questionnaires) [16, 17].
   * **Các dạng câu hỏi phổ biến:**
     * *Thang đo Likert (Likert scale):* Ví dụ: "Tôi thấy GUI dễ sử dụng" (Rất không đồng ý -> Rất đồng ý, hoặc gán điểm -2 đến +2) [17].
     * *Thang vi sai nghĩa (Semantic differentials):* Ví dụ: Menu File Open: [Đơn giản 3 2 1 0 1 2 3 Phức tạp] [17].
     * *Câu hỏi điền câu trả lời (Fill-in questions):* Liệt kê các khía cạnh dễ/khó sử dụng [18].
     * *Câu hỏi hộp kiểm (Check-box):* Chọn câu mô tả đúng nhất thói quen sử dụng [18].
     * *Câu hỏi nhánh (Branching questions):* Dựa vào câu trả lời YES/NO để rẽ nhánh đến câu hỏi tương ứng [18, 19].

### 2.9 Tóm tắt và Phân tích Dữ liệu Kết quả
* **Tóm tắt Dữ liệu Hiệu năng (Performance Summary):**
  * Tính toán Thời gian trung bình (Mean time), Trung vị (Median time), Khoảng biến thiên (Range High-Low), Độ lệch chuẩn (Standard deviation) [19].
  * % người dùng hoàn thành trong thời gian quy định [19].
  * % người dùng hoàn thành không giới hạn thời gian (có hoặc không có sự trợ giúp) [19].
  * Tỷ lệ lỗi trung bình (Average error rate) [19].
* **Tóm tắt Dữ liệu Ý kiến (Preference Summary):**
  * Câu hỏi lựa chọn: Thống kê số lượng và tỷ lệ % [20].
  * Câu hỏi Likert/Semantic: Tính điểm số trung bình [20].
  * Câu hỏi tự do/Ý kiến mở: Phân nhóm câu trả lời thành các danh mục tích cực và tiêu cực [20].
* **Quy trình Phân tích Dữ liệu (Analyzing Data):**
  1. Tập trung vào các nhiệm vụ **không đạt (did not pass)** hoặc xuất hiện nhiều sự cố nghiêm trọng [20].
  2. Xử lý và xác định các lỗi người dùng mắc phải cũng như khó khăn họ gặp [20].
  3. Tìm ra nguyên nhân gốc rễ sinh ra lỗi [20].
  4. **Ưu tiên giải quyết sự cố theo Độ nghiêm trọng (Severity) và Xác suất xuất hiện (Probability of occurrence):**  
     $$\text{Criticality} = \text{Severity} \times \text{Probability}$$ [20]
  5. Phân tích sự khác biệt giữa các nhóm người dùng (nếu có) [20].
  6. Đưa ra các đề xuất và khuyến nghị cải tiến ở cuối báo cáo [20].

---
*Tài liệu được tổng hợp chi tiết từ bài giảng S13_GUI Testing & Usability Testing.pdf (CSC13003 - Software Testing).*
