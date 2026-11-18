Feature: FR-09 Mã Giảm Giá (Coupon) và các endpoint liên quan

  Background:
    * url baseUrl
    * def userLogin = callonce read('classpath:helpers/login.feature') { email: 'test@eshop.com', password: 'Test1234!' }
    * def userToken = userLogin.token
    * def adminLogin = callonce read('classpath:helpers/login.feature') { email: 'admin@eshop.com', password: 'Admin123!' }
    * def adminToken = adminLogin.token

  @CP01
  Scenario: CP01 Áp dụng mã percent SAVE10 thành công (SRS FR-09 R01, R10)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + userToken
    And request { code: 'SAVE10', total_amount: 500000 }
    When method post
    Then status 200
    And match response.discount_amount == 50000
    And match response.final_amount == 450000
    And match response.coupon_id == 1
    And match response.success == true
    And match response.message == '#string'

  @CP02
  Scenario: CP02 Áp dụng mã fixed BIGBUY thành công (SRS FR-09 R02, R10)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + userToken
    And request { code: 'BIGBUY', total_amount: 800000 }
    When method post
    Then status 200
    And match response.discount_amount == 50000
    And match response.final_amount == 750000
    And match response.coupon_id == 2
    And match response.success == true

  @CP03
  Scenario: CP03 Áp dụng mã SAVE10 đúng ngưỡng tối thiểu 300.000₫ (SRS FR-09 C3 R03)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + userToken
    And request { code: 'SAVE10', total_amount: 300000 }
    When method post
    Then status 200
    And match response.discount_amount == 30000
    And match response.final_amount == 270000
    And match response.success == true

  @CP04
  Scenario: CP04 Áp dụng mã BIGBUY đúng ngưỡng tối thiểu 500.000₫ (SRS FR-09 C3 R03)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + userToken
    And request { code: 'BIGBUY', total_amount: 500000 }
    When method post
    Then status 200
    And match response.discount_amount == 50000
    And match response.final_amount == 450000
    And match response.success == true

  @CP05
  Scenario: CP05 Áp dụng mã SAVE10 dưới ngưỡng tối thiểu (total 299.999₫) bị từ chối (SRS FR-09 C3, OpenAPI R04)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + userToken
    And request { code: 'SAVE10', total_amount: 299999 }
    When method post
    Then status 400
    And match response.error contains 'Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫'

  @CP06
  Scenario: CP06 Áp dụng mã BIGBUY dưới ngưỡng tối thiểu (total 499.999₫) bị từ chối (SRS FR-09 C3, OpenAPI R04)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + userToken
    And request { code: 'BIGBUY', total_amount: 499999 }
    When method post
    Then status 400
    And match response.error contains 'Đơn hàng chưa đủ giá trị tối thiểu 500,000 ₫'

  @CP07
  Scenario: CP07 Áp dụng mã EXPIRED đã hết hạn bị từ chối 400 (SRS FR-09 C2, OpenAPI R05)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + userToken
    And request { code: 'EXPIRED', total_amount: 300000 }
    When method post
    Then status 400
    And match response.error == 'Mã giảm giá đã hết hạn'

  @CP08
  Scenario: CP08 Áp dụng mã không tồn tại KHONGTONTAI bị từ chối 404 (SRS FR-09 C1, OpenAPI R06)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + userToken
    And request { code: 'KHONGTONTAI', total_amount: 500000 }
    When method post
    Then status 404
    And match response.error == 'Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa'

  @CP09
  Scenario: CP09 Áp dụng mã khi không gửi token bị từ chối 401 (SRS FR-09 C4, OpenAPI R08)
    Given path 'api', 'apply-coupon'
    # Không gửi header Authorization
    And request { code: 'SAVE10', total_amount: 500000 }
    When method post
    Then status 401
    And match response.error == '#string'

  @CP10
  Scenario: CP10 Giới hạn số lượt dùng mã VIP100 của người dùng (SRS FR-09 C5 R09a, R09b, R09c)
    * def u = call read('classpath:helpers/create-user.feature')
    # Đối chứng 1: lần 1 chưa dùng lượt nào thành công
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + u.token
    And request { code: 'VIP100', total_amount: 500000, user_id: '#(u.id)' }
    When method post
    Then status 200
    And match response.success == true
    # Ghi nhận lượt 1
    Given path 'api', 'coupon-usage'
    And header Authorization = 'Bearer ' + u.token
    And request { coupon_id: 3 }
    When method post
    Then status 200
    # Đối chứng 2 / Biên: lần 2 vẫn còn 1 lượt (max 2) thành công
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + u.token
    And request { code: 'VIP100', total_amount: 500000, user_id: '#(u.id)' }
    When method post
    Then status 200
    And match response.success == true
    # Ghi nhận lượt 2
    Given path 'api', 'coupon-usage'
    And header Authorization = 'Bearer ' + u.token
    And request { coupon_id: 3 }
    When method post
    Then status 200
    # Kiểm tra lần 3: đã dùng 2/2 lượt, bị từ chối 400
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + u.token
    And request { code: 'VIP100', total_amount: 500000, user_id: '#(u.id)' }
    When method post
    Then status 400
    And match response.error == '#string'

  @CP11
  Scenario: CP11 Thiếu trường code trong body bị từ chối 400 (OpenAPI R11)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + userToken
    And request { total_amount: 500000 }
    When method post
    Then status 400
    And match response.error == '#string'

  @CP12
  Scenario: CP12 Thiếu trường total_amount trong body bị từ chối 400 (OpenAPI R12)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + userToken
    And request { code: 'SAVE10' }
    When method post
    Then status 400
    And match response.error == '#string'

  @CP13
  Scenario: CP13 Body rỗng {} khi áp dụng coupon bị từ chối 400 (OpenAPI R13)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + userToken
    And request {}
    When method post
    Then status 400
    And match response.error == '#string'

  @CP14
  Scenario: CP14 total_amount là số âm (-50000) bị từ chối 400 (OpenAPI R14)
    # an-toan: dọn dẹp mã tạm tmpCouponId vừa tạo trong kịch bản
    * def u = call read('classpath:helpers/create-user.feature')
    * def tmpCode = 'tmp_cp_' + java.lang.System.currentTimeMillis()
    # Chuẩn bị: tạo mã tạm có min_order_amount âm (-1000000) bằng adminToken
    Given path 'api', 'admin', 'coupons'
    And header Authorization = 'Bearer ' + adminToken
    And request { code: '#(tmpCode)', type: 'percent', discount_value: 10, min_order_amount: -1000000, expired_at: '2099-12-31', max_uses_per_user: 1 }
    When method post
    Then status 200
    * def tmpCouponId = response.id

    # Bước kiểm tra chính: áp dụng total_amount là số âm (-50000)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + u.token
    And request { code: '#(tmpCode)', total_amount: -50000 }
    When method post
    * def applyStatus = responseStatus
    * def applyResponse = response

    # Dọn dẹp mã tạm trước khi kiểm
    Given path 'api', 'admin', 'coupons', tmpCouponId
    And header Authorization = 'Bearer ' + adminToken
    When method delete

    # Kiểm tra kết quả
    Then match applyStatus == 400
    And match applyResponse.error == '#string'

  @CP15
  Scenario: CP15 total_amount là chuỗi không phải số 'abc' bị từ chối 400 (OpenAPI R15)
    Given path 'api', 'apply-coupon'
    And header Authorization = 'Bearer ' + userToken
    And request { code: 'SAVE10', total_amount: 'abc' }
    When method post
    Then status 400
    And match response.error == '#string'

  @CP16
  Scenario: CP16 Ghi nhận lượt sử dụng coupon hợp lệ thành công (OpenAPI R16)
    * def u = call read('classpath:helpers/create-user.feature')
    Given path 'api', 'coupon-usage'
    And header Authorization = 'Bearer ' + u.token
    And request { coupon_id: 1 }
    When method post
    Then status 200
    And match response.message == 'Usage recorded'

  @CP17
  Scenario: CP17 Gọi POST /api/coupon-usage không có token bị từ chối 401 (OpenAPI R17)
    Given path 'api', 'coupon-usage'
    # Không gửi header Authorization
    And request { coupon_id: 1 }
    When method post
    Then status 401
    And match response.error == 'Unauthorized'

  @CP18
  Scenario: CP18 Gọi POST /api/coupon-usage với token sai định dạng bị từ chối 403 (OpenAPI R18)
    Given path 'api', 'coupon-usage'
    And header Authorization = 'Bearer invalid.token.format'
    And request { coupon_id: 1 }
    When method post
    Then status 403
    And match response.error == 'Forbidden'

  @CP19
  Scenario: CP19 Gọi POST /api/coupon-usage thiếu coupon_id trong body bị từ chối 400 (OpenAPI R19)
    * def u = call read('classpath:helpers/create-user.feature')
    Given path 'api', 'coupon-usage'
    And header Authorization = 'Bearer ' + u.token
    And request {}
    When method post
    Then status 400
    And match response.error == '#string'
