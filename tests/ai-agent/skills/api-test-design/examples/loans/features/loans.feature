Feature: Mượn sách (FR-XX, API giả để minh họa)

  Background:
    * url baseUrl
    * def member = callonce read('classpath:helpers/login.feature') { email: 'member@lib.test', password: 'Member123!' }
    * def userToken = member.token
    * def librarian = callonce read('classpath:helpers/login.feature') { email: 'librarian@lib.test', password: 'Lib12345!' }
    * def adminToken = librarian.token

  @LN01
  Scenario: LN01 Mượn sách thường thành công, hạn 14 ngày (SRS FR-XX R01)
    * def u = call read('classpath:helpers/create-user.feature')
    Given path 'api', 'loans'
    And header Authorization = 'Bearer ' + u.token
    And request { book_id: 1 }
    When method post
    Then status 201
    And match response.loan_days == 14

  @LN02
  Scenario: LN02 Mượn sách hiếm thành công, hạn 7 ngày (SRS FR-XX R02)
    * def u = call read('classpath:helpers/create-user.feature')
    Given path 'api', 'loans'
    And header Authorization = 'Bearer ' + u.token
    And request { book_id: 2 }
    When method post
    Then status 201
    And match response.loan_days == 7

  @LN03
  Scenario: LN03 Cuốn thứ 3 vẫn mượn được (SRS FR-XX R03, biên)
    * def u = call read('classpath:helpers/create-user.feature')
    Given path 'api', 'loans'
    And header Authorization = 'Bearer ' + u.token
    And request { book_id: 1 }
    When method post
    Then status 201
    Given path 'api', 'loans'
    And header Authorization = 'Bearer ' + u.token
    And request { book_id: 4 }
    When method post
    Then status 201
    Given path 'api', 'loans'
    And header Authorization = 'Bearer ' + u.token
    And request { book_id: 5 }
    When method post
    Then status 201
    And match response.book_id == 5

  @LN04
  Scenario: LN04 Cuốn thứ 4 bị từ chối vì hết hạn mức (SRS FR-XX R04, có đối chứng)
    * def u = call read('classpath:helpers/create-user.feature')
    # Đối chứng: ba lần đầu phải thành công, nên lần 4 bị từ chối chỉ có thể vì hạn mức
    Given path 'api', 'loans'
    And header Authorization = 'Bearer ' + u.token
    And request { book_id: 1 }
    When method post
    Then status 201
    Given path 'api', 'loans'
    And header Authorization = 'Bearer ' + u.token
    And request { book_id: 4 }
    When method post
    Then status 201
    Given path 'api', 'loans'
    And header Authorization = 'Bearer ' + u.token
    And request { book_id: 5 }
    When method post
    Then status 201
    Given path 'api', 'loans'
    And header Authorization = 'Bearer ' + u.token
    And request { book_id: 6 }
    When method post
    Then status 409
    And match response.error contains 'tối đa 3'

  @LN05
  Scenario: LN05 book_id không tồn tại (OpenAPI R05; tài liệu không nêu nội dung lỗi)
    Given path 'api', 'loans'
    And header Authorization = 'Bearer ' + userToken
    And request { book_id: 99999 }
    When method post
    Then status 404
    And match response.error == '#string'

  @LN06
  Scenario: LN06 Thiếu book_id (OpenAPI R06; tài liệu không nêu nội dung lỗi)
    Given path 'api', 'loans'
    And header Authorization = 'Bearer ' + userToken
    And request {}
    When method post
    Then status 400
    And match response.error == '#string'

  @LN07
  Scenario: LN07 Không token bị từ chối (SRS FR-XX R07)
    Given path 'api', 'loans'
    And request { book_id: 1 }
    When method post
    Then status 401
    And match response.error == 'Unauthorized'

  @LN08
  Scenario: LN08 Thành viên không được xem toàn bộ khoản mượn (SRS FR-XX R08a)
    Given path 'api', 'loans'
    And header Authorization = 'Bearer ' + userToken
    When method get
    Then status 403
    And match response.error == 'Forbidden'

  @LN09
  Scenario: LN09 Thủ thư thấy khoản mượn vừa tạo (SRS FR-XX R08b, ghi rồi đọc lại)
    * def u = call read('classpath:helpers/create-user.feature')
    Given path 'api', 'loans'
    And header Authorization = 'Bearer ' + u.token
    And request { book_id: 1 }
    When method post
    Then status 201
    * def loanId = response.loan_id
    Given path 'api', 'loans'
    And header Authorization = 'Bearer ' + adminToken
    When method get
    Then status 200
    And match response contains deep { loan_id: '#(loanId)' }

  @LN10
  Scenario: LN10 Thành viên khác không được hủy khoản mượn của người khác (SRS FR-XX R09)
    # Nhắm vào khoản mượn tạm, không phải id có sẵn: nếu hệ thống lỗi phân quyền, lệnh xóa sẽ thành công thật
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
