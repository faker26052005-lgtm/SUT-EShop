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

    # Step 4: Kiểm tra schema của phần tử đầu tiên trong danh mục
    And match response[0] contains
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
  Scenario Outline: K2 - Query product by ID with boundary & discrepancy assertions: <testCase>
    Given path 'api', 'products', <productId>
    When method get
    Then status <expectedStatus>
    And match response contains <expectedMatch>

    Examples:
      | productId | expectedStatus | expectedMatch                                | testCase                                                                        |
      | 1         | 200            | { price: '#number' }                         | Valid Odd ID - iPhone 15 Pro Max (Price is Number)                              |
      | 2         | 200            | { price: '#string' }                         | Valid Even ID - Samsung S24 Ultra (@discrepancy: Price converted to String)     |
      | 9999      | 200            | {}                                           | Non-existent ID (@discrepancy: Returns 200 OK with empty object instead of 404) |
