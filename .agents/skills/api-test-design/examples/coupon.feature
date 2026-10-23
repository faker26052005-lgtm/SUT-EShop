Feature: Áp mã giảm giá (FR-09)
  # Mỗi Scenario gắn một thẻ @ID trùng với ID trong test-matrix.md.
  # Kỳ vọng lấy từ SRS (tự tính bằng công thức), không lấy từ kết quả quan sát hệ thống.

  Background:
    * url baseUrl
    * def auth = callonce read('classpath:helpers/login.feature') { email: 'test@eshop.com', password: 'Test1234!' }
    * def token = auth.token

  @AC01
  Scenario: AC01 Mã phần trăm giảm đúng 10% (SRS FR-09)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + token
    And request { code: 'SAVE10', total_amount: 1000000, user_id: 2 }
    When method post
    Then status 200
    # 1.000.000 x 10% = 100.000 -> còn 900.000
    And match response.discount_amount == 100000
    And match response.final_amount == 900000

  @AC02
  Scenario: AC02 Đơn đúng bằng ngưỡng tối thiểu vẫn được áp mã (FR-09 C3: lớn hơn hoặc bằng)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + token
    And request { code: 'SAVE10', total_amount: 300000, user_id: 2 }
    When method post
    Then status 200
    And match response.final_amount == 270000

  @AC03
  Scenario: AC03 Mã hết hạn bị từ chối kèm thông báo (FR-09 C2)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + token
    And request { code: 'EXPIRED', total_amount: 1000000, user_id: 2 }
    When method post
    Then status 400
    And match response.error contains 'hết hạn'

  @AC04
  Scenario: AC04 Chưa đăng nhập thì bị từ chối 401 (SRS FR-09 C4 thắng OpenAPI)
    Given path 'api', 'apply-coupon'
    And request { code: 'SAVE10', total_amount: 500000, user_id: 2 }
    When method post
    Then status 401
