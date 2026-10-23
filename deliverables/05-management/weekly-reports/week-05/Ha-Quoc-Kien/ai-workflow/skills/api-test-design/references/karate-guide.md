# Hướng dẫn viết Karate feature cho dự án này

Mọi mẫu dưới đây đã được chạy thật trên EShop với Karate 1.5.2 (các ca đỏ trong mẫu là lỗi thật của EShop). Xem thêm `examples/coupon.feature` và `examples/auth.feature`.

## Khung một feature

```gherkin
Feature: Tên nhóm chức năng (mã FR)

  Background:
    * url baseUrl

  @AC01
  Scenario: AC01 Mô tả ngắn, nêu căn cứ SRS
    Given path 'api', 'apply-coupon'
    And request { code: 'SAVE10', total_amount: 1000000 }
    When method post
    Then status 200
    And match response.final_amount == 900000
```

- Mỗi `Scenario` có **một thẻ `@ID`** ngay phía trên và ID đó cũng mở đầu tên Scenario.
- `baseUrl` lấy từ `karate/karate-config.js`.
- Mỗi Scenario nên có **một ý chính**: khi một bước trong Scenario đỏ, các bước sau không được chạy nữa.

## Cần đăng nhập

```gherkin
  Background:
    * url baseUrl
    * def auth = callonce read('classpath:helpers/login.feature') { email: 'test@eshop.com', password: 'Test1234!' }
    * def token = auth.token
  ...
    And header Authorization = 'Bearer ' + token
```

Dùng `admin@eshop.com` / `Admin123!` cho quyền admin. Chỉ **đọc** hoặc làm thao tác an toàn bằng hai tài khoản này.

## Kiểm phản hồi

| Cần kiểm | Cú pháp |
|---|---|
| Giá trị cụ thể | `And match response.final_amount == 900000` |
| Kiểu dữ liệu | `And match response.token == '#string'` (cũng có `#number`, `#array`) |
| Chuỗi chứa | `And match response.error contains 'hết hạn'` |
| **Trường không được xuất hiện** | `And match response.user.password == '#notpresent'` |
| Cả đối tượng đúng cấu trúc | `And match response == { error: '#string' }` |
| Mảng rỗng | `And match response == []` |
| Mã trạng thái | `Then status 403` |

## Ca cần tài khoản hoặc dữ liệu riêng (không đụng tài khoản mẫu)

Dùng hàm dùng chung `helpers/create-user.feature`: tạo tài khoản tạm (email duy nhất), đăng nhập, trả về `email`, `password`, `token`, `id`.

```gherkin
  @PF01
  Scenario: PF01 User không tự nâng quyền qua cập nhật hồ sơ (đọc lại sau khi ghi)
    * def u = call read('classpath:helpers/create-user.feature')
    Given path 'api', 'users', 'me'
    And header Authorization = 'Bearer ' + u.token
    And request { name: 'Moi', role: 'admin' }
    When method put
    Then status 200
    Given path 'api', 'users', 'me'
    And header Authorization = 'Bearer ' + u.token
    When method get
    Then status 200
    And match response.name == 'Moi'
    And match response.role == 'user'
```

## Đọc dữ liệu bên trong qua API admin

Khi cần xem trạng thái mà API người dùng không trả (ví dụ bộ đếm đăng nhập sai), gọi API admin rồi lọc bằng `karate.jsonPath`:

```gherkin
  Background:
    * url baseUrl
    * def admin = callonce read('classpath:helpers/login.feature') { email: 'admin@eshop.com', password: 'Admin123!' }

  @LG05
  Scenario: LG05 Một lần sai mật khẩu làm bộ đếm tăng đúng 1 (SRS FR-02)
    * def u = call read('classpath:helpers/create-user.feature')
    Given path 'api', 'login'
    And request { email: '#(u.email)', password: 'Sai1234!' }
    When method post
    Then status 401
    Given path 'api', 'admin', 'users'
    And header Authorization = 'Bearer ' + admin.token
    When method get
    Then status 200
    * def row = karate.jsonPath(response, "$[?(@.email=='" + u.email + "')]")[0]
    And match row.login_attempts == 1
```

## Ca phải chờ (chạy chậm)

Dùng `* eval java.lang.Thread.sleep(<mili giây>)`. Gắn thẻ `@slow` và ghi vào mục "Ca chạy chậm" của matrix.

```gherkin
  @LG06 @slow
  Scenario: LG06 Hết thời gian khóa thì đăng nhập lại được (SRS FR-02: khóa 30 giây)
    * def u = call read('classpath:helpers/create-user.feature')
    Given path 'api', 'login'
    And request { email: '#(u.email)', password: 'Sai1!' }
    When method post
    Then status 401
    Given path 'api', 'login'
    And request { email: '#(u.email)', password: 'Sai2!' }
    When method post
    Then status 401
    * eval java.lang.Thread.sleep(31000)
    Given path 'api', 'login'
    And request { email: '#(u.email)', password: '#(u.password)' }
    When method post
    Then status 200
```

Bỏ qua ca chậm khi chạy nhanh: thêm `-t "~@slow"` vào lệnh chạy. Chỉ chạy ca chậm: `-t "@slow"`.

## Nhiều bộ dữ liệu cho cùng một ca (Examples)

Dùng cho các ca biên hoặc dữ liệu sai. Mỗi dòng bảng là một lần chạy; cả bảng dùng **một** thẻ `@ID` ở phía trên `Scenario Outline`, nên các dòng cùng thuộc một ca trong matrix.

```gherkin
  @PR01
  Scenario Outline: PR01 Xem sản phẩm <ten>
    Given path 'api', 'products', '<id>'
    When method get
    Then status <status>

    Examples:
      | ten              | id    | status |
      | id hợp lệ        | 1     | 200    |
      | id không tồn tại | 99999 | 404    |
      | id không phải số | abc   | 404    |
```

## Việc không làm

- Không dùng `* def x = karate.exec(...)` hay gọi lệnh hệ thống.
- Không đọc dữ liệu từ ca khác. Không dùng `callonce` cho thứ gì ngoài đăng nhập; tài khoản tạm dùng `call` (mỗi ca một tài khoản).
- Không `delete`/đổi quyền/đổi mật khẩu trên `admin@eshop.com`, `test@eshop.com`.

## Lệnh chạy (dùng khi người nói "chạy")

Máy chủ EShop do **người** khởi động mới trước khi chạy; Agent không tự bật máy chủ. Chạy từ thư mục `karate/` để `classpath:helpers/...` và `karate-config.js` được tìm thấy.

```
# Linux, macOS
java -cp "karate-1.5.2.jar:." com.intuit.karate.Main -t "~@slow" -o ../executions/<run-id>/report ../executions/<run-id>/features

# Windows (PowerShell): dùng dấu chấm phẩy trong classpath
java -cp "karate-1.5.2.jar;." com.intuit.karate.Main -t "~@slow" -o ../executions/<run-id>/report ../executions/<run-id>/features
```

Bỏ `-t "~@slow"` để chạy cả ca chậm. Báo cáo HTML: `report/karate-reports/karate-summary.html`.
