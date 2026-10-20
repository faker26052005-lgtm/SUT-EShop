/**
 * auto_create_github_issues.js
 * Automatically creates GitHub Issues from Bug_Report.md on faker26052005-lgtm/SUT-EShop
 * 
 * Usage:
 *   node scripts/auto_create_github_issues.js [GITHUB_TOKEN] [all|sample]
 *   Or set GITHUB_TOKEN environment variable.
 */

const fs = require('fs');
const path = require('path');

const REPO_OWNER = 'faker26052005-lgtm';
const REPO_NAME = 'SUT-EShop';

const isDryRun = process.argv.includes('--dry-run');
const args = process.argv.slice(2).filter(a => a !== '--dry-run');
const token = process.env.GITHUB_TOKEN || (args[0] && args[0] !== 'all' && args[0] !== 'sample' ? args[0] : null);
const mode = args.includes('all') ? 'all' : 'sample';

if (!isDryRun && !token) {
  console.error('\n[ERROR] Vui lòng cung cấp GITHUB_TOKEN!');
  console.log('Cách dùng:');
  console.log('  node scripts/auto_create_github_issues.js <GITHUB_TOKEN> [all|sample]');
  console.log('  Hoặc chạy thử nghiệm không cần token: node scripts/auto_create_github_issues.js --dry-run [all|sample]');
  console.log('  Ví dụ: node scripts/auto_create_github_issues.js ghp_xxx sample');
  process.exit(1);
}

const bugReportPath = path.join(__dirname, '..', 'hw02-domain-testing', 'Bug_Report.md');
if (!fs.existsSync(bugReportPath)) {
  console.error(`Không tìm thấy file: ${bugReportPath}`);
  process.exit(1);
}

const content = fs.readFileSync(bugReportPath, 'utf8');

// Parse bugs from Bug_Report.md
function parseBugs(md) {
  const sections = md.split(/\r?\n### /).filter(s => s.startsWith('BUG-'));
  const bugs = [];

  for (const sec of sections) {
    const lines = sec.split(/\r?\n/);
    const headerLine = lines[0].trim();
    const rawBody = lines.slice(1).join('\n').trim();

    const bugIdMatch = headerLine.match(/^(BUG-[A-Z0-9]+-[0-9]+)/);
    const bugId = bugIdMatch ? bugIdMatch[1] : 'BUG';
    const title = `[${bugId}] ${headerLine.replace(/^BUG-[A-Z0-9]+-[0-9]+:\s*/, '')}`;

    // Extract Severity
    const severityMatch = rawBody.match(/\*\*Severity:\*\*\s*`?([a-zA-Z]+)`?/i);
    const severity = severityMatch ? severityMatch[1].toLowerCase() : 'medium';

    // Determine Pool
    let pool = 'pool-a';
    if (bugId.startsWith('BUG-FR01')) pool = 'pool-a';
    else if (bugId.startsWith('BUG-FR09')) pool = 'pool-b';
    else if (bugId.startsWith('BUG-FR15')) pool = 'pool-c';
    else if (bugId.startsWith('BUG-MOB')) pool = 'pool-d';

    const labels = ['bug', pool, `severity:${severity}`];

    bugs.push({
      id: bugId,
      title: title,
      labels: labels,
      body: `### ${headerLine}\n\n${rawBody}\n\n---\n*Automated Issue created from [hw02-domain-testing/Bug_Report.md](https://github.com/${REPO_OWNER}/${REPO_NAME}/blob/hw02-23120183/hw02-domain-testing/Bug_Report.md)*`
    });
  }

  return bugs;
}

const allBugs = parseBugs(content);
console.log(`\nĐã phân tích ${allBugs.length} bugs từ Bug_Report.md.`);

// Select bugs based on mode
const selectedBugIds = mode === 'all'
  ? allBugs.map(b => b.id)
  : ['BUG-FR01-04', 'BUG-FR09-02', 'BUG-FR15-05', 'BUG-MOB-01', 'BUG-MOB-02']; // 5 key bugs covering all pools

const bugsToCreate = allBugs.filter(b => selectedBugIds.includes(b.id));
console.log(`Chế độ: ${mode.toUpperCase()} -> Sẽ tạo ${bugsToCreate.length} issues lên ${REPO_OWNER}/${REPO_NAME}.\n`);

async function createIssue(bug) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'Antigravity-Agent',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: bug.title,
      body: bug.body,
      labels: bug.labels
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return await response.json();
}

async function run() {
  const createdIssues = [];
  for (let i = 0; i < bugsToCreate.length; i++) {
    const bug = bugsToCreate[i];
    process.stdout.write(`[${i + 1}/${bugsToCreate.length}] ${bug.id}: "${bug.title.slice(0, 60)}..." (Labels: ${bug.labels.join(', ')}) `);
    if (isDryRun) {
      console.log(`-> [DRY-RUN OK]`);
      createdIssues.push({
        id: bug.id,
        number: i + 1,
        title: bug.title,
        url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/issues/${i + 1}`
      });
      continue;
    }
    try {
      const result = await createIssue(bug);
      console.log(`-> Thành công! Issue #${result.number}: ${result.html_url}`);
      createdIssues.push({
        id: bug.id,
        number: result.number,
        title: bug.title,
        url: result.html_url
      });
      // sleep 1 second to respect secondary rate limits
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.log(`-> THẤT BẠI: ${err.message}`);
    }
  }

  if (createdIssues.length > 0) {
    console.log('\n================ TỔNG KẾT ISSUES ĐÃ TẠO ================');
    createdIssues.forEach(iss => {
      console.log(`- #${iss.number} [${iss.id}]: ${iss.url}`);
    });

    // Save list to evidence folder
    const evidenceDir = path.join(__dirname, '..', 'hw02-domain-testing', 'Evidence', 'GitHub_Issues');
    if (!fs.existsSync(evidenceDir)) fs.mkdirSync(evidenceDir, { recursive: true });
    
    let summaryMd = `# DANH SÁCH GITHUB ISSUES ĐÃ TẠO TỰ ĐỘNG\n\n`;
    summaryMd += `* **Repository:** [${REPO_OWNER}/${REPO_NAME}](https://github.com/${REPO_OWNER}/${REPO_NAME}/issues)\n`;
    summaryMd += `* **Ngày tạo:** ${new Date().toLocaleDateString('vi-VN')}\n* **Tổng số issues:** ${createdIssues.length}\n\n`;
    summaryMd += `| Issue # | Bug ID | Tiêu đề | URL |\n|:---:|:---:|:---|:---|\n`;
    createdIssues.forEach(iss => {
      summaryMd += `| #${iss.number} | \`${iss.id}\` | ${iss.title} | [Link Issue](${iss.url}) |\n`;
    });
    
    fs.writeFileSync(path.join(evidenceDir, 'README.md'), summaryMd, 'utf8');
    console.log(`\nĐã lưu danh sách Issue vào: hw02-domain-testing/Evidence/GitHub_Issues/README.md`);
  }
}

run().catch(console.error);
