# Hướng dẫn viết Karate feature

Các mẫu dùng một API giả về thư viện (`/api/loans`, `/api/books`), **không phải EShop**, để không gợi ý đáp án cho phạm vi bạn đang test. Ví dụ đầy đủ ở `examples/loans/`. Cú pháp theo Karate 1.5.2. ID (`LN03`, `LN07`...) trong các đoạn mã dưới đây chỉ để minh họa, có thể không khớp với ID trong `examples/loans/`.

## Khung một feature

```gherkin
Feature: Mượn sách (FR-XX)

  Background:
    * url baseUrl
    * def member = callonce read('classpath:helpers/login.feature') { email: '<email mẫu>', password: '<mật khẩu mẫu>' }
    * def userToken = member.token

  @LN01
  Scenario: LN01 Mượn sách thường thành công, hạn 14 ngày (SRS FR-XX R01)
    Given path 'api', 'loans'
    And header Authorization = 'Bearer ' + userToken
    And request { book_id: 1 }
    When method post
    Then status 201
    And match response.loan_days == 14
```

- Mỗi `Scenario` có **đúng một thẻ `@ID`** ngay phía trên, và ID đó cũng mở đầu tên Scenario.
- Mỗi Scenario nên có **một ý chính**. Khi một bước đỏ, các bước sau không chạy nữa.
- `baseUrl` do `karate-config.js` cung cấp. Không viết cứng địa chỉ máy chủ.
- Tài khoản mẫu: biến `userToken` và `adminToken` (xem `project-context.md`). `callonce` chỉ dùng cho đăng nhập.

## Kiểm phản hồi

| Cần kiểm | Cú pháp |
|---|---|
| Giá trị cụ thể | `And match response.loan_days == 14` |
| Kiểu dữ liệu | `And match response.token == '#string'` (cũng có `#number`, `#array`) |
| Chuỗi chứa | `And match response.error contains 'hết bản'` |
| Chuỗi **không** chứa (loại trừ lý do khác) | `And match response.error !contains 'tối đa'` |
| **Trường không được xuất hiện** | `And match response.user.password == '#notpresent'` |
| Cả đối tượng | `And match response == { error: '#string' }` |
| Mảng chứa phần tử | `And match response contains deep { book_id: 1 }` |
| Mảng rỗng | `And match response == []` |
| Mã trạng thái | `Then status 403` |

Ca nào kiểm chỉ kiểu (`#string`, `#number`, `!= null`...) mà matrix không ghi `Không nêu` sẽ bị `check_coverage.py` báo `LỖI`.

## Biến trong body JSON: luôn bọc `'#(...)'`

Karate **không** nội suy tên biến trần trong JSON. `request { code: tmpCode }` gửi đi chuỗi chữ `"tmpCode"`, không phải giá trị của biến, và mọi ca dùng cách này đều ghi cùng một mã nên xung đột khóa duy nhất ngay ca thứ hai.

```gherkin
    * def tmpCode = 'tmp_cp_' + java.lang.System.currentTimeMillis()
    # SAI:  And request { code: tmpCode, total_amount: 500000 }
    And request { code: '#(tmpCode)', total_amount: 500000 }
    And request { book_id: 1, user_id: '#(u.id)' }
```

Giá trị số vẫn giữ kiểu số (`'#(u.id)'` gửi đi số nguyên). Quy tắc này áp dụng cho `request`, `def` và `match` có JSON. Với `path`, `header` và các biểu thức khác ngoài JSON thì dùng tên biến trần bình thường (`Given path 'api', 'loans', loanId`). `check_coverage.py` báo `LỖI` khi gặp tên biến trần trong JSON.

## Tài khoản tạm (ca ghi, đổi quyền, xóa)

`helpers/create-user.feature` tạo tài khoản mới, đăng nhập, trả về `email`, `password`, `token`, `id`. Mỗi ca dùng `call` (không `callonce`) để có tài khoản riêng.

```gherkin
  @LN03
  Scenario: LN03 Hai cuốn đầu mượn được, tài khoản tạm không ảnh hưởng tài khoản mẫu
    * def u = call read('classpath:helpers/create-user.feature')
    Given path 'api', 'loans'
    And header Authorization = 'Bearer ' + u.token
    And request { book_id: 1 }
    When method post
    Then status 201
    And match response.book_id == 1
```

Muốn lặp một thao tác nhiều lần (ví dụ mượn đủ 3 cuốn), cứ viết lặp khối `Given ... Then status` cho rõ từng bước. Bản đầy đủ nằm trong `examples/loans/features/loans.feature`.

## Ca âm tính chỉ sai một lý do

Xem lý do ở `design-rules.md` mục 3. Hai cách viết:

**Cô lập bằng dữ liệu tạm** (kiểm số lượng âm mà không bị chặn bởi quy tắc khác):

```gherkin
  @LN07
  Scenario: LN07 Số ngày gia hạn âm bị từ chối (SRS FR-XX R05)
    * def u = call read('classpath:helpers/create-user.feature')
    # chuẩn bị khoản mượn riêng của tài khoản tạm
    Given path 'api', 'loans'
    And header Authorization = 'Bearer ' + u.token
    And request { book_id: 1 }
    When method post
    Then status 201
    * def loanId = response.loan_id
    Given path 'api', 'loans', loanId, 'extend'
    And header Authorization = 'Bearer ' + u.token
    And request { days: -3 }
    When method post
    Then status 400
    And match response.error == '#string'
```

**Loại trừ lý do khác** (khi không thể cô lập):

```gherkin
    Then status 400
    And match response.error == '#string'
    And match response.error !contains 'tối đa'
```

## Bước đối chứng cho ca trạng thái

Trước khi tạo trạng thái "hết lượt", gọi một lần cùng dữ liệu và kiểm thành công. Mẫu ngắn:

```gherkin
    # đối chứng: lần đầu phải được
    Given path 'api', 'loans'
    And header Authorization = 'Bearer ' + u.token
    And request { book_id: 2 }
    When method post
    Then status 201
    # tạo trạng thái cần kiểm rồi gọi lần cuối, kỳ vọng bị từ chối
```

## Ca từ chối trên thao tác xóa, sửa: dùng đối tượng tạm và dọn dẹp trước khi kiểm

Hai nguyên tắc: (1) đối tượng bị tác động là đối tượng tạm; (2) lưu kết quả của bước đang kiểm vào biến, dọn dẹp, **rồi mới** `match`. Karate dừng ở bước đỏ đầu tiên, nên nếu kiểm ngay sau bước chính thì khi ca đỏ, bước dọn dẹp không chạy và đối tượng tạm nằm lại.

```gherkin
  @LN10
  Scenario: LN10 Thành viên khác không được hủy khoản mượn của người khác (SRS FR-XX R09)
    * def owner = call read('classpath:helpers/create-user.feature')
    * def other = call read('classpath:helpers/create-user.feature')
    Given path 'api', 'loans'
    And header Authorization = 'Bearer ' + owner.token
    And request { book_id: 1 }
    When method post
    Then status 201
    * def loanId = response.loan_id

    Given path 'api', 'loans', loanId
    And header Authorization = 'Bearer ' + other.token
    When method delete
    * def delStatus = responseStatus
    * def delResponse = response

    # Dọn dẹp bằng chủ khoản mượn trước khi kiểm (không kiểm kết quả: nếu ca đỏ, khoản mượn có thể đã bị xóa)
    Given path 'api', 'loans', loanId
    And header Authorization = 'Bearer ' + owner.token
    When method delete

    Then match delStatus == 403
    And match delResponse.error == 'Forbidden'
```

`check_coverage.py` chấp nhận `match <biến>Status == 403` thay cho dòng `status 403` ở mẫu này. Bước tạo đối tượng tạm thì vẫn kiểm `status` ngay (nếu việc tạo hỏng thì chưa có gì để dọn).

Chỉ dùng id cố định cho `DELETE`, `PUT`, `PATCH` khi id chắc chắn không tồn tại, và thêm chú thích trong Scenario: `# an-toan: id 99999 không tồn tại`.

## Đọc trạng thái bên trong qua API admin

Khi API người dùng không trả thứ cần kiểm (ví dụ bộ đếm), gọi API admin rồi lọc bằng `karate.jsonPath`:

```gherkin
    Given path 'api', 'admin', 'members'
    And header Authorization = 'Bearer ' + adminToken
    When method get
    Then status 200
    * def row = karate.jsonPath(response, "$[?(@.email=='" + u.email + "')]")[0]
    And match row.active_loans == 1
```

Chỉ **đọc** bằng `adminToken`. Không đổi dữ liệu bằng tài khoản mẫu.

## Ca phải chờ

Dùng `* eval java.lang.Thread.sleep(<mili giây>)`, gắn thẻ `@slow` và ghi vào ghi chú của ca trong matrix.

```gherkin
  @LN09 @slow
  Scenario: LN09 Hết thời gian phạt thì mượn lại được (SRS FR-XX R08: phạt 30 giây)
    ...
    * eval java.lang.Thread.sleep(31000)
```

`run_karate.py` mặc định bỏ qua `@slow`; thêm `--all` để chạy cả ca chậm.

## Nhiều bộ dữ liệu cho một ca

Một thẻ `@ID` đặt trên `Scenario Outline`, các dòng `Examples` cùng thuộc một ca trong matrix.

```gherkin
  @LN06
  Scenario Outline: LN06 Xem sách <ten>
    Given path 'api', 'books', '<id>'
    When method get
    Then status <status>
    And match response.error == '#string'

    Examples:
      | ten              | id    | status |
      | id không tồn tại | 99999 | 404    |
      | id không phải số | abc   | 404    |
```

(Dòng `And match` ở trên chỉ phù hợp khi mọi dòng Examples đều là lỗi. Ca hỗn hợp thì tách thành các Scenario riêng.)

## Việc không làm

- Không dùng `karate.exec(...)` hay gọi lệnh hệ thống.
- Không đọc dữ liệu từ ca khác.
- Không dùng `put`, `patch`, `delete`, đổi quyền hay đổi mật khẩu với tài khoản mẫu, và không nhắm chúng vào id có sẵn trong dữ liệu mẫu.
- Không sửa kỳ vọng cho khớp phản hồi thật khi ca đỏ.
- Không viết cứng địa chỉ máy chủ hay token.

## Chạy

Do người nói "chạy", Agent dùng `scripts/run_karate.py` (xem SKILL.md Pha C), không tự ghép lệnh `java`. Người khởi động lại máy chủ trước.
