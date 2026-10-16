const express = require('express');
const path = require('path');
const { Verifier } = require('@pact-foundation/pact');

const BREAKING_PORT = 3001;
const PACT_FILE = path.resolve(__dirname, '../pacts/EShopMobile-EShopBackend.json');

/**
 * Kịch bản C3: Mô phỏng Backend Provider bị sửa đổi làm phá vỡ hợp đồng (Breaking Change)
 * Lập trình viên Backend đã sửa trường 'price' thành 'unit_price'.
 */
function createBreakingBackendServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/products/1', (req, res) => {
    // BUG CỐ Ý: Đổi tên trường 'price' -> 'unit_price'
    // Mặc dù vẫn trả về HTTP 200 OK!
    res.json({
      id: 1,
      name: 'iPhone 15 Pro Max',
      unit_price: 30000000, // <-- LỖI: Mobile Consumer đang mong đợi trường 'price'!
      description: 'Điện thoại cao cấp của Apple',
      imageUrl: 'https://placehold.co/300x300/png?text=iPhone+15',
      category_id: 1
    });
  });

  return app.listen(BREAKING_PORT);
}

async function runBreakingVerification() {
  console.log('======================================================================');
  console.log('TIÊM LỖI C3: BACKEND ĐỔI TRƯỜNG "price" THÀNH "unit_price" (HTTP 200 OK)');
  console.log('======================================================================\n');

  const server = createBreakingBackendServer();
  console.log(`[Pact C3] Server Backend lỗi đang lắng nghe tại http://localhost:${BREAKING_PORT}`);

  const verifierOptions = {
    provider: 'EShopBackend',
    providerBaseUrl: `http://localhost:${BREAKING_PORT}`,
    pactUrls: [PACT_FILE],
    stateHandlers: {
      'product with ID 1 exists': async () => {
        return Promise.resolve('Sản phẩm 1 sẵn sàng');
      }
    },
    logLevel: 'ERROR'
  };

  try {
    console.log('[Pact C3] Đang chạy đối soát hợp đồng trên Backend bị lỗi...');
    await new Verifier(verifierOptions).verifyProvider();
    console.log('⚠️ BẤT THƯỜNG: Test không phát hiện lỗi (không nên xảy ra)!');
  } catch (error) {
    console.log('\n======================================================================');
    console.log('🎯 THÀNH CÔNG: PACT ĐÃ PHÁT HIỆN VÀ CHẶN ĐỨNG BREAKING CHANGE!');
    console.log('======================================================================');
    console.log('Giải thích lỗi: Backend trả về status 200 OK nhưng thiếu trường "price" mà Mobile cần.');
    console.log('Nhờ có Pact, bản build Backend này sẽ bị chặn và không thể deploy lên Production!\n');
  } finally {
    server.close();
    console.log('[Pact C3] Đã đóng server kiểm thử.');
  }
}

runBreakingVerification();
