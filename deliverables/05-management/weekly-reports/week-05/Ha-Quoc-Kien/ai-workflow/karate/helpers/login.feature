@ignore
Feature: Đăng nhập lấy token (hàm dùng chung, không phải ca test)

  Scenario: Đăng nhập
    Given url baseUrl
    And path 'api', 'login'
    And request { email: '#(email)', password: '#(password)' }
    When method post
    Then status 200
    * def token = response.token
