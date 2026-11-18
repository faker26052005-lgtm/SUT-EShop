@ignore
Feature: Tạo tài khoản tạm và đăng nhập (hàm dùng chung, không phải ca test)
  # Dùng: * def u = call read('classpath:helpers/create-user.feature')
  # Trả về: u.email, u.password, u.token, u.id

  Scenario: Tạo tài khoản tạm
    * def email = 'tmp' + java.lang.System.currentTimeMillis() + '-' + java.lang.System.nanoTime() + '@test.com'
    * def password = 'Abcdef1!'
    Given url baseUrl
    And path 'api', 'register'
    And request { name: 'Tmp', email: '#(email)', password: '#(password)' }
    When method post
    Then status 200
    * def id = response.id
    Given url baseUrl
    And path 'api', 'login'
    And request { email: '#(email)', password: '#(password)' }
    When method post
    Then status 200
    * def token = response.token
