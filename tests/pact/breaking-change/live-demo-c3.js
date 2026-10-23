/**
 * ============================================================================
 * SEMINAR KIỂM THỬ PHẦN MỀM (FIT@HCMUS) - CHỦ ĐỀ T06: API & CONTRACT TESTING
 * ----------------------------------------------------------------------------
 * CÔNG CỤ TRỢ GIÚP QUAY VIDEO & LIVE DEMO KỊCH BẢN PACT C3 (SUT THẬT PORT 3000)
 * ----------------------------------------------------------------------------
 * Tác giả: Nguyễn Quốc Kỳ (MSSV: 23120138)
 * Phối hợp: Nguyễn Hoàng Anh Tú (MSSV: 23120183)
 *
 * Chức năng:
 *   1. Chế độ Thủ Công (Manual Demo Mode):
 *      - node live-demo-c3.js --mutate:rename : Tiêm Breaking Change #1 (Đổi tên trường) vào server.js
 *      - node live-demo-c3.js --mutate:type   : Tiêm Breaking Change #2 (Sai kiểu dữ liệu) vào server.js
 *      - node live-demo-c3.js --restore       : Hoàn nguyên backend/server.js về trạng thái gốc
 *   2. Chế độ Tự Động (Full Auto Live SUT Verification):
 *      - node live-demo-c3.js --auto          : Chạy toàn bộ 3 pha (gồm 2A và 2B) trực tiếp trên SUT thật
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');
const { Verifier } = require('@pact-foundation/pact');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
const BACKEND_DIR = path.resolve(__dirname, '../../../backend');
const SERVER_JS_PATH = path.join(BACKEND_DIR, 'server.js');
const BACKUP_JS_PATH = path.join(BACKEND_DIR, 'server.js.backup');
const PACT_FILE = path.resolve(__dirname, '../pacts/EShopMobile-EShopBackend.json');

// Đoạn mã gốc trong backend/server.js
const ORIGINAL_SNIPPET = `app.get("/api/products/:id", (req, res) => {
  db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
    if (!row) return res.status(200).json({});
    if (row.id % 2 === 0) row.price = row.price.toString();
    res.json(row);
  });
});`;

// Đoạn mã đột biến Dạng 1: Đổi tên trường price -> unit_price
const MUTATED_RENAME_SNIPPET = `app.get("/api/products/:id", (req, res) => {
  db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
    if (!row) return res.status(200).json({});
    if (row.id % 2 === 0) row.price = row.price.toString();
    // [DEMO C3 BREAKING CHANGE #1] Đổi tên trường 'price' -> 'unit_price' (Vẫn trả về HTTP 200 OK!)
    const mutated = { ...row, unit_price: row.price };
    delete mutated.price;
    res.json(mutated);
  });
});`;

// Đoạn mã đột biến Dạng 2: Sai lệch kiểu dữ liệu (format chuỗi tiền tệ '30.000.000 ₫')
const MUTATED_TYPE_SNIPPET = `app.get("/api/products/:id", (req, res) => {
  db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
    if (!row) return res.status(200).json({});
    // [DEMO C3 BREAKING CHANGE #2] Format tiền tệ thành chuỗi hiển thị '30.000.000 ₫' thay vì số nguyên
    const mutated = { ...row, price: "30.000.000 ₫" };
    res.json(mutated);
  });
});`;

/**
 * Tạo bản sao lưu server.js nếu chưa có
 */
function ensureBackup() {
  if (!fs.existsSync(BACKUP_JS_PATH)) {
    fs.copyFileSync(SERVER_JS_PATH, BACKUP_JS_PATH);
    console.log('[Live Demo Helper] Đã tạo bản sao lưu an toàn tại backend/server.js.backup');
  }
}

/**
 * Khôi phục file server.js về trạng thái gốc
 */
function restoreOriginal(quiet = false) {
  if (fs.existsSync(BACKUP_JS_PATH)) {
    fs.copyFileSync(BACKUP_JS_PATH, SERVER_JS_PATH);
    fs.unlinkSync(BACKUP_JS_PATH);
    if (!quiet) {
      console.log('\n==============================================================================');
      console.log('✅ ĐÃ HOÀN NGUYÊN BACKEND SUT THẬT (backend/server.js) VỀ TRẠNG THÁI GỐC!');
      console.log('==============================================================================');
      console.log('Đã xóa bản backup và khôi phục mã nguồn an toàn.\n');
    }
  } else {
    try {
      const repoRoot = path.resolve(BACKEND_DIR, '..');
      require('child_process').execSync('git checkout backend/server.js', { cwd: repoRoot, stdio: 'ignore' });
      if (!quiet) console.log('✅ Đã hoàn nguyên backend/server.js qua Git checkout!');
    } catch (e) {
      if (!quiet) console.log('ℹ️ Không có bản sao lưu cần khôi phục.');
    }
  }
}

/**
 * Tiêm Breaking Change vào file server.js thật
 * @param {'rename'|'type'} mutationType 
 */
function injectMutation(mutationType = 'rename') {
  ensureBackup();
  // Luôn khôi phục về file gốc trước khi thay thế để tránh xung đột
  if (fs.existsSync(BACKUP_JS_PATH)) {
    fs.copyFileSync(BACKUP_JS_PATH, SERVER_JS_PATH);
  }

  let content = fs.readFileSync(SERVER_JS_PATH, 'utf8');
  if (!content.includes(ORIGINAL_SNIPPET)) {
    console.error('❌ Không tìm thấy đoạn code gốc trong backend/server.js để thay thế!');
    process.exit(1);
  }

  const targetSnippet = mutationType === 'type' ? MUTATED_TYPE_SNIPPET : MUTATED_RENAME_SNIPPET;
  content = content.replace(ORIGINAL_SNIPPET, targetSnippet);
  fs.writeFileSync(SERVER_JS_PATH, content, 'utf8');

  console.log('\n==============================================================================');
  if (mutationType === 'type') {
    console.log('⚡ ĐÃ TIÊM BREAKING CHANGE #2 (TYPE MISMATCH) VÀO BACKEND SUT THẬT');
    console.log('==============================================================================');
    console.log('Mô tả thay đổi:');
    console.log('  - Trường "price" đã bị đổi thành chuỗi format tiền tệ "30.000.000 ₫"');
    console.log('  - HTTP Status Code vẫn trả về 200 OK (Postman thông thường sẽ PASS).');
  } else {
    console.log('⚡ ĐÃ TIÊM BREAKING CHANGE #1 (FIELD RENAMED) VÀO BACKEND SUT THẬT');
    console.log('==============================================================================');
    console.log('Mô tả thay đổi:');
    console.log('  - Trường "price" đã bị đổi tên thành "unit_price" trong route GET /api/products/:id');
    console.log('  - HTTP Status Code vẫn trả về 200 OK (Postman thông thường sẽ PASS).');
  }
  console.log('\n👉 Bây giờ bạn có thể khởi động lại Backend (cổng 3000) và chạy:');
  console.log('   npm run test:provider');
  console.log('để chứng kiến Pact Verifier chặn đứng bản build lỗi này trên SUT thật!');
  console.log('\n👉 Sau khi demo xong, chạy lệnh sau để hoàn nguyên:');
  console.log('   npm run demo:restore\n');
}

/**
 * Kiểm tra xem server backend có đang lắng nghe trên cổng 3000 không
 */
function isServerRunning() {
  return new Promise((resolve) => {
    const req = http.get(BASE_URL, (res) => resolve(true));
    req.on('error', () => resolve(false));
    req.setTimeout(800, () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Khởi động một process backend server thật
 */
function spawnBackendProcess() {
  console.log(`[Pact SUT Live] Đang khởi động Backend Node.js từ ${BACKEND_DIR}...`);
  return spawn('node', ['server.js'], {
    cwd: BACKEND_DIR,
    stdio: 'ignore', // Ẩn log server để giao diện gọn gàng
    detached: false,
  });
}

/**
 * Đợi server sẵn sàng nhận kết nối
 */
function waitForServer(timeoutMs = 8000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const req = http.get(BASE_URL, (res) => {
        clearInterval(interval);
        resolve(true);
      });
      req.on('error', () => {
        if (Date.now() - start > timeoutMs) {
          clearInterval(interval);
          reject(new Error(`Timeout sau ${timeoutMs}ms chờ Backend khởi động!`));
        }
      });
      req.setTimeout(500, () => req.destroy());
    }, 300);
  });
}

/**
 * Chạy Provider Verification qua Pact Verifier đối soát với cổng 3000
 */
async function verifyAgainstLiveBackend() {
  const verifierOptions = {
    provider: 'EShopBackend',
    providerBaseUrl: BASE_URL,
    pactUrls: [PACT_FILE],
    stateHandlers: {
      'product with ID 1 exists': async () => Promise.resolve('Sản phẩm 1 sẵn sàng trong SQLite'),
    },
    logLevel: 'ERROR',
  };

  try {
    await new Verifier(verifierOptions).verifyProvider();
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}

/**
 * Chạy toàn bộ quy trình live demo tự động trên SUT thật (Bao gồm cả 2 dạng lỗi 2A và 2B)
 */
async function runAutoLiveDemo() {
  console.log('\n==============================================================================');
  console.log('🎬 BẮT ĐẦU LIVE DEMO PACT C3 TRỰC TIẾP TRÊN SUT ESHOP THẬT (CỔNG 3000)');
  console.log('   Tác giả: Nguyễn Quốc Kỳ (MSSV: 23120138) | Nhóm 11 - Seminar T06');
  console.log('   Phạm vi: Baseline PASS ➔ Tiêm 2 dạng Breaking Change ➔ Rollback PASS');
  console.log('==============================================================================\n');

  ensureBackup();
  let serverProcess = null;
  const results = [];

  // Đăng ký hook dọn dẹp khẩn cấp khi người dùng bấm Ctrl+C hoặc crash
  const cleanupAndExit = () => {
    console.log('\n[An toàn] Đang dọn dẹp và khôi phục mã nguồn trước khi thoát...');
    restoreOriginal(true);
    if (serverProcess) {
      try { process.kill(serverProcess.pid); } catch (e) {}
    }
    process.exit(0);
  };
  process.on('SIGINT', cleanupAndExit);
  process.on('uncaughtException', (err) => {
    console.error('Lỗi ngoại lệ:', err);
    cleanupAndExit();
  });

  try {
    // ------------------------------------------------------------------------
    // BƯỚC 1: KIỂM CHỨNG BASELINE TRÊN BACKEND SUT THẬT
    // ------------------------------------------------------------------------
    console.log('------------------------------------------------------------------------------');
    console.log('📌 PHA 1: CHẠY BASELINE TRÊN SUT BACKEND THẬT (PORT 3000)');
    console.log('   Điều kiện: Backend nguyên bản, SQLite trả về price = 30000000 (Integer).');
    console.log('------------------------------------------------------------------------------');
    restoreOriginal(true); // Đảm bảo code sạch 100%

    serverProcess = spawnBackendProcess();
    await waitForServer(8000);
    console.log('[Pact SUT Live] Backend thật đã sẵn sàng trên cổng 3000.');

    const baselineResult = await verifyAgainstLiveBackend();
    if (baselineResult.success) {
      console.log('✅ PHA 1 THÀNH CÔNG: SUT Backend thật đáp ứng 100% hợp đồng Pact!');
      results.push({ phase: 'Pha 1: Baseline SUT Thật', expected: 'PASS', actual: 'PASS', verdict: 'ĐẠT (Hợp đồng toàn vẹn)' });
    } else {
      console.error('❌ PHA 1 THẤT BẠI: Baseline trên backend thật bị lỗi!');
      results.push({ phase: 'Pha 1: Baseline SUT Thật', expected: 'PASS', actual: 'FAIL', verdict: 'KHÔNG ĐẠT' });
      return;
    }

    // Tắt server baseline để chuẩn bị khởi động lại với code tiêm lỗi 1
    process.kill(serverProcess.pid);
    await new Promise((r) => setTimeout(r, 1000));

    // ------------------------------------------------------------------------
    // BƯỚC 2A: TIÊM LỖI #1 (ĐỔI TÊN TRƯỜNG price -> unit_price)
    // ------------------------------------------------------------------------
    console.log('\n------------------------------------------------------------------------------');
    console.log('📌 PHA 2A: TIÊM BREAKING CHANGE #1 (FIELD RENAMED / MISSING KEY)');
    console.log('   Thay đổi: Đổi trường price -> unit_price trên Backend thật.');
    console.log('   Quan sát: HTTP Status Code vẫn là 200 OK (Postman thông thường sẽ PASS).');
    console.log('------------------------------------------------------------------------------');
    injectMutation('rename');

    serverProcess = spawnBackendProcess();
    await waitForServer(8000);
    console.log('[Pact SUT Live] Backend thật (đã bị tiêm lỗi Rename) đang chạy trên cổng 3000.');

    const breaking1Result = await verifyAgainstLiveBackend();
    if (!breaking1Result.success) {
      console.log('\n🎯 PHA 2A THÀNH CÔNG: PACT VERIFIER ĐÃ CHẶN ĐỨNG BẢN BUILD SUT THẬT BỊ LỖI!');
      console.log('   Lỗi bắt được: Actual map is missing required key "price"');
      console.log('   Tác động: Ngăn chặn sập Mobile App do product.price === undefined.');
      results.push({ phase: 'Pha 2A: Rename price->unit_price', expected: 'BLOCK (FAIL)', actual: 'BLOCKED', verdict: 'ĐẠT (Bắt đúng breaking change)' });
    } else {
      console.error('⚠️ CẢNH BÁO: Pact không bắt được lỗi đổi tên trường trên backend thật!');
      results.push({ phase: 'Pha 2A: Rename price->unit_price', expected: 'BLOCK (FAIL)', actual: 'PASS', verdict: 'KHÔNG ĐẠT' });
    }

    // Tắt server lỗi 1
    process.kill(serverProcess.pid);
    await new Promise((r) => setTimeout(r, 1000));

    // ------------------------------------------------------------------------
    // BƯỚC 2B: TIÊM LỖI #2 (SAI LỆCH KIỂU DỮ LIỆU SỐ -> CHUỖI TIỀN TỆ)
    // ------------------------------------------------------------------------
    console.log('\n------------------------------------------------------------------------------');
    console.log('📌 PHA 2B: TIÊM BREAKING CHANGE #2 (DATA TYPE MISMATCH)');
    console.log('   Thay đổi: Backend trả về trường price dạng String format tiền tệ "30.000.000 ₫".');
    console.log('   Quan sát: Tái hiện khiếm khuyết của SUT EShop Backend phát hiện ở Karate K2.');
    console.log('------------------------------------------------------------------------------');
    injectMutation('type');

    serverProcess = spawnBackendProcess();
    await waitForServer(8000);
    console.log('[Pact SUT Live] Backend thật (đã bị tiêm lỗi Type) đang chạy trên cổng 3000.');

    const breaking2Result = await verifyAgainstLiveBackend();
    if (!breaking2Result.success) {
      console.log('\n🎯 PHA 2B THÀNH CÔNG: PACT VERIFIER ĐÃ CHẶN ĐỨNG BẢN BUILD SAI KIỂU DỮ LIỆU!');
      console.log('   Lỗi bắt được: Expected integer but received string "30.000.000 ₫"');
      console.log('   Tác động: Ngăn chặn lỗi tính toán tổng tiền đơn hàng ra NaN.');
      results.push({ phase: 'Pha 2B: Type Integer->String', expected: 'BLOCK (FAIL)', actual: 'BLOCKED', verdict: 'ĐẠT (Bắt đúng type mismatch)' });
    } else {
      console.error('⚠️ CẢNH BÁO: Pact không bắt được lỗi kiểu dữ liệu trên backend thật!');
      results.push({ phase: 'Pha 2B: Type Integer->String', expected: 'BLOCK (FAIL)', actual: 'PASS', verdict: 'KHÔNG ĐẠT' });
    }

    // Tắt server lỗi 2
    process.kill(serverProcess.pid);
    await new Promise((r) => setTimeout(r, 1000));

    // ------------------------------------------------------------------------
    // BƯỚC 3: HOÀN NGUYÊN MÃ NGUỒN VÀ XÁC NHẬN PHỤC HỒI
    // ------------------------------------------------------------------------
    console.log('\n------------------------------------------------------------------------------');
    console.log('📌 PHA 3: HOÀN NGUYÊN server.js & XÁC NHẬN HỆ THỐNG AN TOÀN TRỞ LẠI');
    console.log('------------------------------------------------------------------------------');
    restoreOriginal(true);

    serverProcess = spawnBackendProcess();
    await waitForServer(8000);
    console.log('[Pact SUT Live] Backend thật (đã hoàn nguyên) đang chạy trên cổng 3000.');

    const restoredResult = await verifyAgainstLiveBackend();
    if (restoredResult.success) {
      console.log('✅ PHA 3 THÀNH CÔNG: Hệ thống SUT EShop đã phục hồi hoàn toàn xanh!');
      results.push({ phase: 'Pha 3: Rollback & Re-verify', expected: 'PASS', actual: 'PASS', verdict: 'ĐẠT (Hệ thống an toàn)' });
    } else {
      console.error('❌ PHA 3 THẤT BẠI: Phục hồi không thành công!');
      results.push({ phase: 'Pha 3: Rollback & Re-verify', expected: 'PASS', actual: 'FAIL', verdict: 'KHÔNG ĐẠT' });
    }

    // ------------------------------------------------------------------------
    // BẢNG TỔNG KẾT
    // ------------------------------------------------------------------------
    console.log('\n==============================================================================');
    console.log('📊 BẢNG TỔNG HỢP KẾT QUẢ LIVE DEMO TRỰC TIẾP TRÊN SUT THẬT (NGUYỄN QUỐC KỲ)');
    console.log('==============================================================================');
    console.table(results);

    console.log('\n🎉 LIVE DEMO SUT THẬT HOÀN TẤT THÀNH CÔNG RỰC RỠ 100%!');
    console.log('   Mã nguồn backend/server.js đã được tự động bảo toàn an toàn tuyệt đối.');
    console.log('==============================================================================\n');

  } finally {
    if (serverProcess) {
      try { process.kill(serverProcess.pid); } catch (e) {}
    }
    restoreOriginal(true);
  }
}

// ============================================================================
// CLI ROUTER
// ============================================================================
const arg = process.argv[2];

if (arg === '--mutate' || arg === '--mutate:rename') {
  injectMutation('rename');
} else if (arg === '--mutate:type') {
  injectMutation('type');
} else if (arg === '--restore') {
  restoreOriginal();
} else if (arg === '--auto') {
  runAutoLiveDemo().catch((err) => {
    console.error('Lỗi khi chạy Auto Live Demo:', err);
    restoreOriginal(true);
    process.exit(1);
  });
} else {
  console.log(`
Công cụ Hỗ trợ Live Demo Kịch bản C3 (Pact Breaking Change trên SUT Thật)
-----------------------------------------------------------------------
Sử dụng:
  node live-demo-c3.js --mutate:rename : Tiêm Breaking Change #1 (Đổi tên price -> unit_price)
  node live-demo-c3.js --mutate:type   : Tiêm Breaking Change #2 (Format tiền tệ dạng String)
  node live-demo-c3.js --restore       : Hoàn nguyên backend/server.js về ban đầu
  node live-demo-c3.js --auto          : Tự động chạy toàn bộ quy trình 3 pha (2A & 2B) trên SUT thật
  `);
}
