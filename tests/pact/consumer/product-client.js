const axios = require('axios');

/**
 * ProductClient đại diện cho module gọi API của ứng dụng Mobile (Consumer: EShopMobile)
 */
class ProductClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  /**
   * Lấy thông tin chi tiết một sản phẩm theo ID
   * @param {number|string} id 
   * @returns {Promise<Object>}
   */
  async getProductById(id) {
    const url = `${this.baseUrl}/api/products/${id}`;
    try {
      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch product ${id}: ${error.message}`);
    }
  }
}

module.exports = ProductClient;
