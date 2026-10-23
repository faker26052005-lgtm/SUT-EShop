# Hướng dẫn viết Karate feature cho dự án này

Mọi mẫu dưới đây đã được chạy thật trên EShop với Karate 1.5.2. Xem thêm `examples/coupon.feature` và `examples/auth.feature`.

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

```gherkin
  Scenario: PF01 User không tự nâng quyền qua cập nhật hồ sơ (đọc lại sau khi ghi)
    * def uid = java.lang.System.currentTimeMillis()
    * def email = 'tmp' + uid + '@test.com'
    Given path 'api', 'register'
    And request { name: 'Tmp', email: '#(email)', password: 'Abcdef1!' }
    When method post
    Then status 200
    Given path 'api', 'login'
    And request { email: '#(email)', password: 'Abcdef1!' }
    When method post
    Then status 200
    * def token = response.token
    Given path 'api', 'users', 'me'
    And header Authorization = 'Bearer ' + token
    And request { name: 'Moi', role: 'admin' }
    When method put
    Then status 200
    Given path 'api', 'users', 'me'
    And header Authorization = 'Bearer ' + token
    When method get
    Then status 200
    And match response.name == 'Moi'
    And match response.role == 'user'
```

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
- Không đọc dữ liệu từ ca khác. Không dùng `callonce` cho thứ gì ngoài đăng nhập.
- Không `delete`/đổi quyền/đổi mật khẩu trên `admin@eshop.com`, `test@eshop.com`.

## Cách chạy (người dùng, không phải agent)

Chạy từ thư mục `karate/` để `classpath:helpers/...` và `karate-config.js` được tìm thấy.

```
# Linux, macOS
java -cp "karate-1.5.2.jar:." com.intuit.karate.Main -o ../executions/<run-id>/report ../executions/<run-id>/features

# Windows (PowerShell): dùng dấu chấm phẩy trong classpath
java -cp "karate-1.5.2.jar;." com.intuit.karate.Main -o ../executions/<run-id>/report ../executions/<run-id>/features
```

Báo cáo HTML: `report/karate-reports/karate-summary.html`.
