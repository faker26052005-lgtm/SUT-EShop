@workflow
Feature: EShop Authenticated Shopping & Checkout Workflow (K3)

  Background:
    * url baseUrl

  @k3 @e2e @smoke
  Scenario: K3 - Complete End-to-End Shopping Workflow (Register -> Login -> Add to Cart -> Checkout -> Verify Order)
    # -------------------------------------------------------------
    # Step 1: Tạo tài khoản động theo timestamp để đảm bảo tính độc lập
    # -------------------------------------------------------------
    * def timestamp = java.lang.System.currentTimeMillis()
    * def testEmail = 'karate_k3_' + timestamp + '@eshop.com'
    * def testPassword = 'Password123!'
    * def testName = 'Karate Tester ' + timestamp
    * def registerPayload = { name: '#(testName)', email: '#(testEmail)', password: '#(testPassword)' }

    Given path 'api', 'register'
    And request registerPayload
    When method post
    Then status 200
    And match response.message == 'User registered successfully'
    And match response.id == '#number'

    # -------------------------------------------------------------
    # Step 2: Đăng nhập lấy JWT Auth Token
    # -------------------------------------------------------------
    * def loginPayload = { email: '#(testEmail)', password: '#(testPassword)' }
    Given path 'api', 'login'
    And request loginPayload
    When method post
    Then status 200
    And match response.message == 'Login successful'
    And match response.token == '#string'
    * def authToken = response.token

    # -------------------------------------------------------------
    # Step 3: Lấy danh mục sản phẩm và chọn sản phẩm đầu tiên
    # -------------------------------------------------------------
    Given path 'api', 'products'
    When method get
    Then status 200
    And match response == '#[]'
    And assert response.length > 0
    * def selectedProduct = response[0]
    * def selectedProductId = selectedProduct.id
    * def selectedProductName = selectedProduct.name
    * def selectedProductPrice = selectedProduct.price

    # -------------------------------------------------------------
    # Step 4: Thêm sản phẩm vào giỏ hàng với Bearer Token
    # -------------------------------------------------------------
    * def cartItem = { productId: '#(selectedProductId)', name: '#(selectedProductName)', price: '#(selectedProductPrice)', quantity: 1 }
    Given path 'api', 'cart'
    And header Authorization = 'Bearer ' + authToken
    And request cartItem
    When method post
    Then status 200
    And match response.message == 'Added to cart'

    # -------------------------------------------------------------
    # Step 5: Xác minh sản phẩm đã có trong giỏ hàng
    # -------------------------------------------------------------
    Given path 'api', 'cart'
    And header Authorization = 'Bearer ' + authToken
    When method get
    Then status 200
    And match response == '#[]'
    And match response contains deep { productId: '#(selectedProductId)', name: '#(selectedProductName)' }

    # -------------------------------------------------------------
    # Step 6: Thực hiện thanh toán (Checkout) đơn hàng
    # -------------------------------------------------------------
    * def shippingAddr = '227 Nguyen Van Cu, Ward 4, District 5, HCMC'
    * def checkoutPayload = { total_amount: '#(selectedProductPrice)', shipping_address: '#(shippingAddr)' }
    Given path 'api', 'checkout'
    And header Authorization = 'Bearer ' + authToken
    And request checkoutPayload
    When method post
    Then status 200
    And match response.message == 'Checkout successful'
    And match response.orderId == '#number'
    * def generatedOrderId = response.orderId

    # -------------------------------------------------------------
    # Step 7: Xác nhận đơn hàng hiển thị trong lịch sử My Orders
    # -------------------------------------------------------------
    Given path 'api', 'orders', 'my-orders'
    And header Authorization = 'Bearer ' + authToken
    When method get
    Then status 200
    And match response == '#[]'
    And assert response.length > 0
    And match response[0].id == generatedOrderId
    And match response[0].status == 'pending'
    And match response[0].shipping_address == shippingAddr

  @k3 @security @negative
  Scenario: K3 - Security Negative Test: Accessing protected cart without token must return 401 Unauthorized
    Given path 'api', 'cart'
    When method get
    Then status 401
    And match response.error == 'Unauthorized'
