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
