Feature: FR-09 Mã giảm giá (Coupons)

  Background:
    * url baseUrl
    * def userAuth = callonce read('classpath:helpers/login.feature') { email: 'test@eshop.com', password: 'Test1234!' }
    * def userToken = userAuth.token

  @AC01
  Scenario: AC01 Áp mã phần trăm SAVE10 (10%) cho đơn 1.000.000 (SRS FR-09 R01)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + userToken
    And request { code: 'SAVE10', total_amount: 1000000, user_id: 2 }
    When method post
    Then status 200
    And match response.success == true
    And match response.discount_amount == 100000
    And match response.final_amount == 900000

  @AC02
  Scenario: AC02 Áp mã cố định BIGBUY (50.000đ) cho đơn 600.000 (SRS FR-09 R02)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + userToken
    And request { code: 'BIGBUY', total_amount: 600000, user_id: 2 }
    When method post
    Then status 200
    And match response.success == true
    And match response.discount_amount == 50000
    And match response.final_amount == 550000

  @AC03
  Scenario: AC03 Đơn đúng bằng ngưỡng tối thiểu 300.000 vẫn được áp mã SAVE10 (SRS FR-09 C3, R04)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + userToken
    And request { code: 'SAVE10', total_amount: 300000, user_id: 2 }
    When method post
    Then status 200
    And match response.success == true
    And match response.discount_amount == 30000
    And match response.final_amount == 270000

  @AC04
  Scenario: AC04 Đơn 299.999 dưới ngưỡng tối thiểu 300.000 bị từ chối (SRS FR-09 C3)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + userToken
    And request { code: 'SAVE10', total_amount: 299999, user_id: 2 }
    When method post
    Then status 400
    And match response.error contains '300,000'

  @AC05
  Scenario: AC05 Mã EXPIRED đã hết hạn bị từ chối (SRS FR-09 C2, R05)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + userToken
    And request { code: 'EXPIRED', total_amount: 500000, user_id: 2 }
    When method post
    Then status 400
    And match response.error contains 'hết hạn'

  @AC06
  Scenario: AC06 Mã NONEXISTENT không tồn tại bị từ chối 404 (SRS FR-09 C1, OpenAPI R06)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + userToken
    And request { code: 'NONEXISTENT', total_amount: 500000, user_id: 2 }
    When method post
    Then status 404
    And match response.error contains 'không tồn tại'

  @AC07
  Scenario: AC07 Áp mã khi không có Authorization token bị từ chối 401 (SRS FR-09 C4, SEC-02)
    Given path 'api', 'apply-coupon'
    And request { code: 'SAVE10', total_amount: 500000, user_id: 2 }
    When method post
    Then status 401
    And match response.error != null

  @AC08
  Scenario: AC08 Request thiếu trường code bị từ chối 400 (OpenAPI, R08)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + userToken
    And request { total_amount: 500000, user_id: 2 }
    When method post
    Then status 400
    And match response.error != null

  @AC09
  Scenario: AC09 total_amount âm (-100.000) vi phạm ngưỡng tối thiểu >= 0 (OpenAPI, R08)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + userToken
    And request { code: 'SAVE10', total_amount: -100000, user_id: 2 }
    When method post
    Then status 400
    And match response.error != null

  @AC10
  Scenario: AC10 User tạm đã dùng hết 1 lượt SAVE10 thì lần áp thứ hai bị từ chối 400 (SRS FR-09 C5, R09)
    * def u = call read('classpath:helpers/create-user.feature')
    Given path 'api', 'coupon-usage'
    And header Authorization = 'Bearer ' + u.token
    And request { coupon_id: 1 }
    When method post
    Then status 200
    And match response.message == 'Usage recorded'
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + u.token
    And request { code: 'SAVE10', total_amount: 500000, user_id: '#(u.id)' }
    When method post
    Then status 400
    And match response.error != null

  @AC11
  Scenario: AC11 User thường gọi GET /api/coupons bị từ chối 403 (SRS FR-12, SEC-03, R10)
    Given path 'api', 'coupons'
    And header Authorization = 'Bearer ' + userToken
    When method get
    Then status 403
    And match response.error == 'Forbidden'

  @AC12
  Scenario: AC12 Admin gọi GET /api/coupons trả về danh sách mã giảm giá (SRS FR-12, R10, OpenAPI)
    * def adminAuth = callonce read('classpath:helpers/login.feature') { email: 'admin@eshop.com', password: 'Admin123!' }
    Given path 'api', 'coupons'
    And header Authorization = 'Bearer ' + adminAuth.token
    When method get
    Then status 200
    And match response == '#[]'
    And match response contains deep { code: 'SAVE10' }

  @AC13
  Scenario: AC13 Ghi nhận sử dụng mã không có token bị từ chối 401 (SEC-02, R11)
    Given path 'api', 'coupon-usage'
    And request { coupon_id: 1 }
    When method post
    Then status 401
    And match response.error == 'Unauthorized'
