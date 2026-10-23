#!/usr/bin/env node
/*
 * Chạy bộ test API EShop bằng Newman.
 *
 * Cách dùng:
 *   node scripts/run-newman.js [suite ...] [--backend <thư mục backend>] [--no-server]
 *                              [--baseline] [--update-baseline]
 *
 * Suite: full | login | products | allin1 (mặc định: chạy cả bốn)
 *
 * Mỗi suite được chạy trên một server mới khởi động (dữ liệu được reset), trừ khi dùng --no-server.
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');
const newman = require('newman');

const ROOT = path.resolve(__dirname, '..');
const V3 = path.join(ROOT, 'collections', 'eshop_api_postman_collection_v3.json');
const ALL = path.join(ROOT, 'collections', 'eshop_api_all_tests.postman_collection.json');

const SUITES = {
  full:     { title: 'EShop - Toàn bộ collection (v3)', collection: V3 },
  login:    { title: 'EShop - Data-driven: Login (CSV)', collection: V3, folder: 'DataDriven - Login', data: path.join(ROOT, 'data', 'login_data.csv') },
  products: { title: 'EShop - Data-driven: Product detail (CSV)', collection: V3, folder: 'DataDriven - Products', data: path.join(ROOT, 'data', 'product_ids.csv') },
  allin1:   { title: 'EShop - Bộ test tổng hợp (118 assertion)', collection: ALL },
};

// ---------------------------------------------------------------- tham số dòng lệnh
const argv = process.argv.slice(2);
function flag(name) { return argv.includes(name); }
function value(name, def) { const i = argv.indexOf(name); return (i >= 0 && argv[i + 1]) ? argv[i + 1] : def; }
const valueFlags = new Set(['--backend']);
const requested = argv.filter((a, i) => !a.startsWith('--') && !valueFlags.has(argv[i - 1]));
// Mặc định chỉ chạy các suite có đủ file collection và file dữ liệu; suite thiếu file sẽ được bỏ qua kèm thông báo.
function suiteReady(n) { return fs.existsSync(SUITES[n].collection) && (!SUITES[n].data || fs.existsSync(SUITES[n].data)); }
const suiteNames = requested.length ? requested : Object.keys(SUITES).filter(suiteReady);
if (!requested.length) {
  Object.keys(SUITES).filter(n => !suiteReady(n)).forEach(n => console.log(`Bỏ qua suite "${n}": thiếu file collection hoặc dữ liệu.`));
}
const useServer = !flag('--no-server');
const port = 3000; // server.js của EShop cố định cổng 3000
const backend = path.resolve(value('--backend', process.env.ESHOP_BACKEND_DIR || path.join(ROOT, '..', 'eshop-sut', 'backend')));
const compareBaseline = flag('--baseline');
const updateBaseline = flag('--update-baseline');

for (const s of suiteNames) {
  if (!SUITES[s]) { console.error(`Suite không tồn tại: "${s}". Chọn trong: ${Object.keys(SUITES).join(', ')}`); process.exit(2); }
  if (!suiteReady(s)) { console.error(`Suite "${s}" thiếu file collection hoặc file dữ liệu. Kiểm tra thư mục collections/ và data/.`); process.exit(2); }
}
if (useServer && !fs.existsSync(path.join(backend, 'server.js'))) {
  console.error(`Không tìm thấy server.js trong "${backend}".\nTruyền đường dẫn thư mục backend bằng --backend <thư mục> hoặc biến môi trường ESHOP_BACKEND_DIR (nhớ đã chạy npm install trong thư mục đó).`);
  process.exit(2);
}
fs.mkdirSync(path.join(ROOT, 'reports'), { recursive: true });
fs.mkdirSync(path.join(ROOT, 'baselines'), { recursive: true });

// ---------------------------------------------------------------- quản lý server
function ping() {
  return new Promise((resolve) => {
    const req = http.get({ host: '127.0.0.1', port, path: '/api/categories', timeout: 1000 }, (res) => { res.resume(); resolve(res.statusCode === 200); });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}
async function waitReady(maxMs) {
  const end = Date.now() + maxMs;
  while (Date.now() < end) { if (await ping()) return true; await new Promise(r => setTimeout(r, 400)); }
  return false;
}
async function startServer() {
  if (await ping()) throw new Error(`Cổng ${port} đang có server chạy. Hãy tắt nó trước, hoặc dùng --no-server.`);
  const child = spawn(process.execPath, ['server.js'], { cwd: backend, env: Object.assign({}, process.env, { PORT: String(port) }), stdio: 'ignore' });
  child.exited = false;
  child.on('exit', () => { child.exited = true; });
  if (!(await waitReady(20000))) { child.kill(); throw new Error('Server không khởi động được sau 20 giây. Kiểm tra thư mục backend đã chạy npm install chưa.'); }
  return child;
}
async function stopServer(child) {
  if (!child || child.exited) return;
  child.kill();
  const end = Date.now() + 4000;
  while (!child.exited && Date.now() < end) await new Promise(r => setTimeout(r, 100));
  await new Promise(r => setTimeout(r, 300));
}

// ---------------------------------------------------------------- chạy một suite
function runNewman(name, suite) {
  const out = path.join(ROOT, 'reports', name);
  const options = {
    collection: suite.collection,
    reporters: ['cli', 'htmlextra', 'json'],
    reporter: {
      htmlextra: { export: out + '.html', title: suite.title },
      json: { export: out + '.json' },
    },
  };
  if (suite.folder) options.folder = suite.folder;
  if (suite.data) options.iterationData = suite.data;
  return new Promise((resolve, reject) => {
    newman.run(options, (err, summary) => (err ? reject(err) : resolve(summary)));
  });
}
function failedNames(summary) {
  const set = new Set();
  for (const f of summary.run.failures || []) set.add((f.error && f.error.test) || (f.error && f.error.message) || 'lỗi không tên');
  return [...set].sort();
}

// ---------------------------------------------------------------- chương trình chính
(async () => {
  const rows = [];
  let mismatch = false;
  for (const name of suiteNames) {
    const suite = SUITES[name];
    console.log(`\n==================== Suite: ${name} - ${suite.title} ====================`);
    let server = null;
    try {
      if (useServer) server = await startServer();
      const summary = await runNewman(name, suite);
      const st = summary.run.stats;
      const failed = failedNames(summary);
      const basePath = path.join(ROOT, 'baselines', name + '.json');
      let status = '-';
      if (updateBaseline) {
        fs.writeFileSync(basePath, JSON.stringify(failed, null, 2) + '\n', 'utf8');
        status = 'đã ghi baseline';
      } else if (compareBaseline) {
        if (!fs.existsSync(basePath)) { status = 'chưa có baseline'; mismatch = true; }
        else {
          const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));
          const added = failed.filter(x => !base.includes(x));
          const gone = base.filter(x => !failed.includes(x));
          if (!added.length && !gone.length) status = 'khớp danh sách lỗi đã biết';
          else {
            status = `KHÁC: ${added.length} lỗi mới, ${gone.length} lỗi đã hết`; mismatch = true;
            added.forEach(x => console.log('  + lỗi mới    :', x));
            gone.forEach(x => console.log('  - đã hết lỗi :', x));
          }
        }
      }
      rows.push({ suite: name, requests: st.requests.total, iterations: st.iterations.total, assertions: st.assertions.total, failed: st.assertions.failed, status });
    } catch (e) {
      console.error(`Lỗi khi chạy suite "${name}": ${e.message}`);
      rows.push({ suite: name, requests: '-', iterations: '-', assertions: '-', failed: '-', status: 'LỖI: ' + e.message });
      mismatch = true;
    } finally {
      await stopServer(server);
    }
  }
  console.log('\n==================== TỔNG KẾT ====================');
  console.table(rows);
  console.log('Báo cáo HTML: thư mục reports/ (mở file .html bằng trình duyệt).');
  console.log('Lưu ý: test đỏ là các lỗi đã biết của hệ thống EShop; dùng --baseline để so với danh sách lỗi đã biết.');
  process.exit(compareBaseline && mismatch ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(2); });
