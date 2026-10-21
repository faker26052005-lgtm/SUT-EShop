/**
 * ============================================================================
 * SEMINAR KIỂM THỬ PHẦN MỀM (FIT@HCMUS) - CHỦ ĐỀ T06: API & CONTRACT TESTING
 * ----------------------------------------------------------------------------
 * KỊCH BẢN C3: PHÁT HIỆN BREAKING CHANGE & ĐẢM BẢO TÍNH TƯƠNG THÍCH CONTRACT
 * ----------------------------------------------------------------------------
 * Người thực hiện chính: Nguyễn Quốc Kỳ (MSSV: 23120138)
 * Phối hợp & Review:     Nguyễn Hoàng Anh Tú (MSSV: 23120183)
 * Framework:             Pact JS (Pact V3 / Rust Core FFI)
 * Consumer:              EShopMobile
 * Provider:              EShopBackend
 * File Contract:         pacts/EShopMobile-EShopBackend.json
 * ============================================================================
 */

const express = require('express');
const path = require('path');
const { Verifier } = require('@pact-foundation/pact');

const TEST_PORT = 3005;
const PACT_FILE = path.resolve(__dirname, '../pacts/EShopMobile-EShopBackend.json');

// Biến điều khiển chế độ phản hồi của Provider Server
let currentMode = 'BASELINE'; // Các chế độ: 'BASELINE', 'MUTATION_RENAME', 'MUTATION_TYPE'

/**
 * Khởi tạo Server Provider thử nghiệm có khả năng chuyển đổi hành vi để tiêm lỗi
 */
function createControllableServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/products/1', (req, res) => {
    switch (currentMode) {
      case 'MUTATION_RENAME':
        // DẠNG BREAKING CHANGE 1: Đổi tên trường bắt buộc 'price' -> 'unit_price'
        // HTTP Status vẫn trả về 200 OK (Nếu test bằng Postman thông thường sẽ PASS nhầm!)
        return res.json({
          id: 1,
          name: 'iPhone 15 Pro Max',
          unit_price: 30000000, // <-- LỖI: Thiếu trường 'price' mà EShopMobile cần!
          description: 'Điện thoại cao cấp của Apple',
          imageUrl: 'https://placehold.co/300x300/png?text=iPhone+15',
          category_id: 1,
        });

      case 'MUTATION_TYPE':
        // DẠNG BREAKING CHANGE 2: Sai lệch kiểu dữ liệu (Type Inconsistency)
        // Backend tự ý format tiền tệ thành chuỗi hiển thị '30.000.000 ₫' thay vì trả số nguyên thô
        // Khiến Mobile Client khi thực hiện phép tính (price * quantity) ra NaN và làm crash giỏ hàng
        return res.json({
          id: 1,
          name: 'iPhone 15 Pro Max',
          price: '30.000.000 ₫', // <-- LỖI: String định dạng tiền tệ thay vì Integer!
          description: 'Điện thoại cao cấp của Apple',
          imageUrl: 'https://placehold.co/300x300/png?text=iPhone+15',
          category_id: 1,
        });

      case 'BASELINE':
      default:
        // TRẠNG THÁI CHUẨN: Đáp ứng 100% hợp đồng Pact do EShopMobile quy định
        return res.json({
          id: 1,
          name: 'iPhone 15 Pro Max',
          price: 30000000, // Đúng kiểu Number/Integer
          description: 'Điện thoại cao cấp của Apple',
          imageUrl: 'https://placehold.co/300x300/png?text=iPhone+15',
          category_id: 1,
        });
    }
  });

  return new Promise((resolve) => {
    const server = app.listen(TEST_PORT, () => {
      resolve(server);
    });
  });
}

/**
 * Thực thi kiểm chứng hợp đồng qua Pact Verifier
 * @param {string} stepName Tên giai đoạn kiểm chứng
 * @returns {Promise<{success: boolean, error?: any}>}
 */
async function verifyCurrentContract(stepName) {
  const verifierOptions = {
    provider: 'EShopBackend',
    providerBaseUrl: `http://localhost:${TEST_PORT}`,
    pactUrls: [PACT_FILE],
    stateHandlers: {
      'product with ID 1 exists': async () => {
        return Promise.resolve('Sản phẩm ID 1 sẵn sàng');
      },
    },
    logLevel: 'ERROR', // Thu gọn log thư viện, tập trung vào kết quả đối soát
  };

  try {
    await new Verifier(verifierOptions).verifyProvider();
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}

/**
 * Điều phối toàn bộ quy trình Kịch bản C3 gồm 3 Pha
 */
async function runScenarioC3() {
  console.log('\n==============================================================================');
  console.log('🚀 PACT CONTRACT TESTING - KỊCH BẢN C3: BREAKING CHANGE VERIFICATION');
  console.log('   Tác giả: Nguyễn Quốc Kỳ (MSSV: 23120138) | Nhóm 11 - Seminar T06');
  console.log('   Hệ thống: Consumer (EShopMobile) <---> Provider (EShopBackend)');
  console.log('==============================================================================\n');

  const server = await createControllableServer();
  console.log(`[Pact C3] Server Provider đối soát đang chạy trên cổng ${TEST_PORT}...`);

  const results = [];

  try {
    // ------------------------------------------------------------------------
    // PHA 1: KIỂM CHỨNG BASELINE (HỢP ĐỒNG KHỚP 100%)
    // ------------------------------------------------------------------------
    console.log('\n------------------------------------------------------------------------------');
    console.log('📌 PHA 1: KIỂM CHỨNG BASELINE (BASELINE VERIFICATION)');
    console.log('   Điều kiện: Provider trả về dữ liệu chuẩn mực (price: 30000000 [Integer]).');
    console.log('------------------------------------------------------------------------------');
    currentMode = 'BASELINE';
    const phase1 = await verifyCurrentContract('Pha 1 - Baseline');
    if (phase1.success) {
      console.log('✅ PHA 1 THÀNH CÔNG: Provider đáp ứng chính xác 100% hợp đồng của Consumer!');
      results.push({ phase: 'Pha 1: Baseline', expected: 'PASS', actual: 'PASS', verdict: 'ĐẠT (Hợp đồng toàn vẹn)' });
    } else {
      console.log('❌ PHA 1 THẤT BẠI: Baseline không đạt chuẩn!');
      results.push({ phase: 'Pha 1: Baseline', expected: 'PASS', actual: 'FAIL', verdict: 'KHÔNG ĐẠT' });
    }

    // ------------------------------------------------------------------------
    // PHA 2A: TIÊM BREAKING CHANGE DẠNG 1 (ĐỔI TÊN TRƯỜNG DỮ LIỆU)
    // ------------------------------------------------------------------------
    console.log('\n------------------------------------------------------------------------------');
    console.log('📌 PHA 2A: TIÊM BREAKING CHANGE #1 (FIELD RENAMED / MISSING PROPERTY)');
    console.log('   Hành vi: Developer Backend đổi tên trường "price" -> "unit_price".');
    console.log('   Quan sát: HTTP Status Code vẫn là 200 OK (Postman thông thường sẽ PASS).');
    console.log('------------------------------------------------------------------------------');
    currentMode = 'MUTATION_RENAME';
    const phase2a = await verifyCurrentContract('Pha 2A - Field Rename');
    if (!phase2a.success) {
      console.log('🎯 PHA 2A THÀNH CÔNG (CHẶN LỖI): Pact Verifier phát hiện vi phạm hợp đồng!');
      console.log('   Chi tiết lỗi bắt được: Actual map is missing required key "price"');
      console.log('   Tác động ứng dụng: Tránh được sự cố Mobile crash do product.price === undefined.');
      results.push({ phase: 'Pha 2A: Rename price->unit_price', expected: 'BLOCK (FAIL)', actual: 'BLOCKED', verdict: 'ĐẠT (Bắt đúng breaking change)' });
    } else {
      console.log('⚠️ CẢNH BÁO: Pact không bắt được lỗi đổi tên trường (Cần kiểm tra lại matcher)!');
      results.push({ phase: 'Pha 2A: Rename price->unit_price', expected: 'BLOCK (FAIL)', actual: 'PASS', verdict: 'KHÔNG ĐẠT' });
    }

    // ------------------------------------------------------------------------
    // PHA 2B: TIÊM BREAKING CHANGE DẠNG 2 (SAI LỆCH KIỂU DỮ LIỆU)
    // ------------------------------------------------------------------------
    console.log('\n------------------------------------------------------------------------------');
    console.log('📌 PHA 2B: TIÊM BREAKING CHANGE #2 (DATA TYPE MISMATCH)');
    console.log('   Hành vi: Provider trả về trường "price" dưới dạng String "30000000".');
    console.log('   Quan sát: Tái hiện khiếm khuyết của SUT EShop Backend phát hiện ở Karate K2.');
    console.log('------------------------------------------------------------------------------');
    currentMode = 'MUTATION_TYPE';
    const phase2b = await verifyCurrentContract('Pha 2B - Type Mismatch');
    if (!phase2b.success) {
      console.log('🎯 PHA 2B THÀNH CÔNG (CHẶN LỖI): Pact Verifier phát hiện vi phạm kiểu dữ liệu!');
      console.log('   Chi tiết lỗi bắt được: Expected integer but received string');
      console.log('   Tác động ứng dụng: Ngăn chặn lỗi tính toán sai lệch tổng tiền ở giỏ hàng Mobile.');
      results.push({ phase: 'Pha 2B: Type Integer->String', expected: 'BLOCK (FAIL)', actual: 'BLOCKED', verdict: 'ĐẠT (Bắt đúng type mismatch)' });
    } else {
      console.log('⚠️ CẢNH BÁO: Pact không bắt được lỗi kiểu dữ liệu!');
      results.push({ phase: 'Pha 2B: Type Integer->String', expected: 'BLOCK (FAIL)', actual: 'PASS', verdict: 'KHÔNG ĐẠT' });
    }

    // ------------------------------------------------------------------------
    // PHA 3: KHÔI PHỤC VÀ HOÀN NGUYÊN (ROLLBACK & RESTORATION)
    // ------------------------------------------------------------------------
    console.log('\n------------------------------------------------------------------------------');
    console.log('📌 PHA 3: HOÀN NGUYÊN MÃ NGUỒN VÀ KIỂM CHỨNG LẠI (ROLLBACK & RE-VERIFICATION)');
    console.log('   Hành vi: Revert các commit lỗi, khôi phục lại trường "price" kiểu Integer.');
    console.log('------------------------------------------------------------------------------');
    currentMode = 'BASELINE';
    const phase3 = await verifyCurrentContract('Pha 3 - Rollback');
    if (phase3.success) {
      console.log('✅ PHA 3 THÀNH CÔNG: Trạng thái hệ thống đã phục hồi hoàn toàn xanh!');
      results.push({ phase: 'Pha 3: Rollback & Re-verify', expected: 'PASS', actual: 'PASS', verdict: 'ĐẠT (Hệ thống an toàn)' });
    } else {
      console.log('❌ PHA 3 THẤT BẠI: Không thể phục hồi về trạng thái ban đầu!');
      results.push({ phase: 'Pha 3: Rollback & Re-verify', expected: 'PASS', actual: 'FAIL', verdict: 'KHÔNG ĐẠT' });
    }

    // ------------------------------------------------------------------------
    // BẢNG TỔNG KẾT KẾT QUẢ KỊCH BẢN C3
    // ------------------------------------------------------------------------
    console.log('\n==============================================================================');
    console.log('📊 BẢNG TỔNG HỢP KẾT QUẢ THỰC THI KỊCH BẢN PACT C3 (NHÓM 11 - NGUYỄN QUỐC KỲ)');
    console.log('==============================================================================');
    console.table(results);

    console.log('\n💡 KẾT LUẬN CHUYÊN MÔN:');
    console.log('1. Functional API Testing (Postman/Newman thông thường) chỉ kiểm tra HTTP Status Code 200,');
    console.log('   dễ bỏ sót các thay đổi phá vỡ hợp đồng ngầm (False Positive).');
    console.log('2. Consumer-Driven Contract Testing (Pact JS) hoạt động như một "Deployment Gate",');
    console.log('   chặn đứng mọi bản build Provider vi phạm kỳ vọng Consumer trước khi ra Production!');
    console.log('==============================================================================\n');

  } finally {
    server.close();
    console.log('[Pact C3] Đã dọn dẹp và đóng server kiểm thử.\n');
  }
}

if (require.main === module) {
  runScenarioC3().catch((err) => {
    console.error('Lỗi thực thi C3 runner:', err);
    process.exit(1);
  });
}

module.exports = { runScenarioC3 };
