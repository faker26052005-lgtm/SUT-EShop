@products
Feature: EShop Product Catalog API

  Background:
    * url baseUrl

  @k1 @smoke
  Scenario: K1 - Get all products returns a valid array and schema
    # Step 1: Gọi endpoint GET /api/products
    Given path 'api', 'products'
    When method get

    # Step 2: Xác thực mã trạng thái HTTP 200 OK
    Then status 200

    # Step 3: Xác thực cấu trúc phản hồi là một mảng JSON
    And match response == '#[]'
    And assert response.length > 0

    # Step 4: Xác thực schema cho toàn bộ danh sách sản phẩm bằng Native 'match each'
    And match each response contains
      """
      {
        "id": '#number',
        "name": '#string',
        "price": '#number',
        "description": '#string',
        "imageUrl": '#string',
        "category_id": '#number'
      }
      """

  @k2 @data-driven
  Scenario Outline: K2 - Query product by ID adheres to specification & catches SUT defects: <testCase>
    Given path 'api', 'products', <productId>
    When method get
    Then status <expectedStatus>
    And match response contains <expectedMatch>

    Examples:
      | productId | expectedStatus | expectedMatch        | testCase                                                                        |
      | 1         | 200            | { price: '#number' } | Valid ID 1 - iPhone 15 Pro Max (Spec: 200 OK & Price is Number -> PASS)         |
      | 2         | 200            | { price: '#number' } | Valid ID 2 - Samsung S24 Ultra (Spec: Price is Number -> CATCH BUG: String)     |
      | 9999      | 404            | {}                   | Non-existent ID (Spec: 404 Not Found -> CATCH BUG: Returns 200 + Empty Object) |
