const path = require('path');
const { expect } = require('chai');
const { PactV3, MatchersV3 } = require('@pact-foundation/pact');
const ProductClient = require('./product-client');

const { like, integer, string, regex } = MatchersV3;

// Khởi tạo đối tượng Pact V3 đại diện cho tương tác EShopMobile -> EShopBackend
const provider = new PactV3({
  consumer: 'EShopMobile',
  provider: 'EShopBackend',
  dir: path.resolve(__dirname, '../pacts'),
  logLevel: 'INFO',
});

describe('Pact Consumer Test: EShopMobile -> EShopBackend (Scenario C1)', () => {
  it('xác thực EShopMobile nhận đúng dữ liệu sản phẩm ID 1 và sinh file contract', () => {
    // 1. Arrange: Đăng ký kỳ vọng tương tác (Contract Interaction)
    provider
      .given('product with ID 1 exists')
      .uponReceiving('a request for product with ID 1')
      .withRequest({
        method: 'GET',
        path: '/api/products/1',
        headers: {
          Accept: 'application/json',
        },
      })
      .willRespondWith({
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: {
          id: integer(1),
          name: string('iPhone 15 Pro Max'),
          price: integer(30000000), // RÀNG BUỘC THEN CHỐT: price phải là kiểu Number
          description: like('Điện thoại cao cấp của Apple'),
          imageUrl: like('https://placehold.co/300x300/png?text=iPhone+15'),
          category_id: integer(1),
        },
      });

    // 2. Act & Assert: Chạy qua Mock Server do Pact tự động sinh ra
    return provider.executeTest(async (mockserver) => {
      const client = new ProductClient(mockserver.url);
      const product = await client.getProductById(1);

      // Xác minh Consumer xử lý đúng dữ liệu nghiệp vụ
      expect(product).to.exist;
      expect(product.id).to.equal(1);
      expect(product.name).to.equal('iPhone 15 Pro Max');
      expect(product.price).to.be.a('number');
      expect(product.price).to.equal(30000000);
    });
  });
});
