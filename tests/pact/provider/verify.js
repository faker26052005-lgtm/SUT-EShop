const path = require('path');
const http = require('http');
const { spawn } = require('child_process');
const { Verifier } = require('@pact-foundation/pact');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;
const PACT_FILE = path.resolve(__dirname, '../pacts/EShopMobile-EShopBackend.json');

/**
 * Thăm dò cho đến khi Backend sẵn sàng nhận request
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
      req.setTimeout(500, () => {
        req.destroy();
      });
    }, 300);
  });
}

/**
 * Kiểm tra xem Backend Server có đang chạy ở cổng 3000 không
 */
function isServerRunning() {
  return new Promise((resolve) => {
    const req = http.get(BASE_URL, (res) => {
      resolve(true);
    });
    req.on('error', () => {
      resolve(false);
    });
    req.setTimeout(800, () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Khởi động Backend Server tạm thời nếu chưa chạy
 */
function startServer() {
  const backendDir = path.resolve(__dirname, '../../../backend');
  console.log(`[Pact Provider] Khởi động Backend EShop từ ${backendDir}...`);
  const serverProcess = spawn('node', ['server.js'], {
    cwd: backendDir,
    stdio: 'inherit',
    detached: false
  });
  return serverProcess;
}

async function runProviderVerification() {
  let serverProcess = null;
  const alreadyRunning = await isServerRunning();

  if (!alreadyRunning) {
    serverProcess = startServer();
    console.log('[Pact Provider] Đang chờ Backend sẵn sàng trên cổng 3000...');
    try {
      await waitForServer(10000);
      console.log('[Pact Provider] Backend đã khởi động thành công!');
    } catch (err) {
      console.error(err.message);
      if (serverProcess) serverProcess.kill();
      process.exit(1);
    }
  } else {
    console.log(`[Pact Provider] Backend EShop đã đang chạy sẵn tại ${BASE_URL}.`);
  }

  const verifierOptions = {
    provider: 'EShopBackend',
    providerBaseUrl: BASE_URL,
    pactUrls: [PACT_FILE],
    stateHandlers: {
      'product with ID 1 exists': async () => {
        return Promise.resolve('Sản phẩm 1 (iPhone 15 Pro Max) đã sẵn sàng trong SQLite');
      }
    },
    logLevel: 'INFO'
  };

  try {
    console.log('[Pact Provider] Bắt đầu xác minh hợp đồng (Provider Verification)...');
    const output = await new Verifier(verifierOptions).verifyProvider();
    console.log('\n======================================================');
    console.log('✅ PACT PROVIDER VERIFICATION THÀNH CÔNG: HỢP ĐỒNG KHỚP 100%!');
    console.log('======================================================\n');
    console.log(output);
  } catch (error) {
    console.error('\n❌ PACT PROVIDER VERIFICATION THẤT BẠI: Lệch hợp đồng!', error);
    process.exitCode = 1;
  } finally {
    if (serverProcess) {
      console.log('[Pact Provider] Đang đóng Backend Server tạm thời...');
      // Trên Windows, kill task Node.js
      try {
        process.kill(serverProcess.pid);
      } catch (e) {
        // Ignored
      }
    }
  }
}

runProviderVerification();
