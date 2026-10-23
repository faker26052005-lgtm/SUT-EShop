Feature: Xác thực (FR-01, FR-02)

  Background:
    * url baseUrl

  @LG01
  Scenario: LG01 Đăng nhập đúng trả token và không lộ mật khẩu
    Given path 'api', 'login'
    And request { email: 'test@eshop.com', password: 'Test1234!' }
    When method post
    Then status 200
    And match response.token == '#string'
    And match response.user.email == 'test@eshop.com'
    # Trường KHÔNG được xuất hiện trong phản hồi
    And match response.user.password == '#notpresent'

  @LG02
  Scenario: LG02 Sai mật khẩu bị từ chối kèm thông báo, không trả token
    Given path 'api', 'login'
    And request { email: 'noone@eshop.com', password: 'Sai1234!' }
    When method post
    Then status 401
    And match response.error == 'Invalid email or password'
    And match response == { error: '#string' }
