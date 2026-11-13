// Script to convert Markdown files to styled PDF documents using Playwright & marked
// Usage: node scripts/generate-pdf.mjs
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { marked } from 'marked';

const docsToConvert = [
  { input: 'docs/main-report.md', output: 'docs/main-report.pdf', title: 'HW04 - Báo Cáo Tự Động Hóa Kiểm Thử Web & Phân Tích Khoảng Cách' },
  { input: 'docs/bug-report.md', output: 'docs/bug-report.pdf', title: 'HW04 - Báo Cáo Lỗi Hệ Thống SUT (Bug Report)' },
  { input: 'docs/ai-audit-report.md', output: 'docs/ai-audit-report.pdf', title: 'HW04 - Báo Cáo Nhật Ký Sử Dụng AI (AI Audit Report)' },
  { input: 'docs/ai-critique.md', output: 'docs/ai-critique.pdf', title: 'HW04 - AI Critique (200-300 words)' },
];

const cssStyle = `
  @page {
    size: A4;
    margin: 20mm 15mm 20mm 15mm;
    @bottom-right {
      content: counter(page);
    }
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 13px;
    line-height: 1.6;
    color: #24292f;
    background-color: #ffffff;
    padding: 0;
    margin: 0;
  }
  h1 {
    font-size: 22px;
    border-bottom: 2px solid #eaecef;
    padding-bottom: 8px;
    margin-top: 24px;
    color: #0969da;
  }
  h2 {
    font-size: 18px;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 6px;
    margin-top: 20px;
    color: #1f2328;
    page-break-after: avoid;
  }
  h3 {
    font-size: 15px;
    margin-top: 16px;
    color: #1f2328;
    page-break-after: avoid;
  }
  h4 {
    font-size: 13px;
    margin-top: 12px;
    page-break-after: avoid;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
    font-size: 11px;
    page-break-inside: auto;
  }
  tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  th, td {
    border: 1px solid #d0d7de;
    padding: 6px 10px;
    text-align: left;
  }
  th {
    background-color: #f6f8fa;
    font-weight: 600;
  }
  tr:nth-child(even) {
    background-color: #fcfcfc;
  }
  code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
    font-size: 11px;
    background-color: #eff1f3;
    padding: 2px 4px;
    border-radius: 4px;
  }
  pre {
    background-color: #f6f8fa;
    border: 1px solid #d0d7de;
    border-radius: 6px;
    padding: 12px;
    overflow-x: auto;
    font-size: 11px;
    line-height: 1.45;
  }
  pre code {
    background-color: transparent;
    padding: 0;
  }
  blockquote {
    margin: 12px 0;
    padding: 6px 12px;
    color: #57606a;
    border-left: 4px solid #0969da;
    background-color: #f6f8fa;
  }
  hr {
    border: none;
    border-top: 1px solid #d0d7de;
    margin: 20px 0;
  }
  img {
    max-width: 100%;
    height: auto;
  }
  .header-meta {
    font-size: 11px;
    color: #656d76;
    margin-bottom: 20px;
    border-bottom: 1px solid #d0d7de;
    padding-bottom: 10px;
  }
`;

async function convertAll() {
  console.log('================================================================');
  console.log('Starting Markdown to PDF Conversion using Playwright Chromium...');
  console.log('================================================================\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const doc of docsToConvert) {
    const inputPath = path.resolve(doc.input);
    const outputPath = path.resolve(doc.output);

    if (!fs.existsSync(inputPath)) {
      console.warn(`[SKIP] File not found: ${doc.input}`);
      continue;
    }

    console.log(`Converting: ${doc.input} -> ${doc.output}...`);
    const markdownContent = fs.readFileSync(inputPath, 'utf-8');
    const htmlBody = marked.parse(markdownContent);

    const fullHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>${doc.title}</title>
  <style>${cssStyle}</style>
</head>
<body>
  <div class="header-meta">
    <strong>Môn học:</strong> Kiểm thử Phần mềm (CS423 / CSC13003) – FIT@HCMUS &bull;
    <strong>Sinh viên:</strong> Nguyễn Quốc Kỳ &bull;
    <strong>MSSV:</strong> 23120138 &bull;
    <strong>Lớp:</strong> 23CLC02
  </div>
  ${htmlBody}
</body>
</html>`;

    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'load' });

    await page.pdf({
      path: outputPath,
      format: 'A4',
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm'
      },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `<div style="font-size: 9px; width: 100%; text-align: right; padding-right: 15mm; color: #888;">
        <span>${doc.title} | Run by: 23120138</span>
      </div>`,
      footerTemplate: `<div style="font-size: 9px; width: 100%; text-align: center; color: #888;">
        <span>Trang <span class="pageNumber"></span> / <span class="totalPages"></span></span>
      </div>`
    });

    await page.close();
    const stats = fs.statSync(outputPath);
    console.log(`  ✓ Created: ${doc.output} (${Math.round(stats.size / 1024)} KB)\n`);
  }

  await browser.close();
  console.log('================================================================');
  console.log('All PDF deliverables generated successfully in docs/ directory!');
  console.log('================================================================');
}

convertAll().catch((err) => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
