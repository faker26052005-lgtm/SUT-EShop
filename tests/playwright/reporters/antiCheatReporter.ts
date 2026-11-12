import fs from 'fs';
import path from 'path';
import type { FullConfig, FullResult, Reporter } from '@playwright/test/reporter';

class AntiCheatHtmlReporter implements Reporter {
  private outputFolder = 'playwright-report';
  private studentId = '23120183';
  private startTimeISO = new Date().toISOString();

  onBegin(config: FullConfig): void {
    this.startTimeISO = new Date().toISOString();
    const meta = (config.metadata ?? {}) as Record<string, string>;
    if (meta.studentId) {
      this.studentId = meta.studentId;
    }
  }

  async onEnd(_result: FullResult): Promise<void> {
    const indexPath = path.resolve(process.cwd(), this.outputFolder, 'index.html');
    if (!fs.existsSync(indexPath)) return;

    const endTimeISO = new Date().toISOString();
    const bannerText = `Run by: ${this.studentId} | ISO Timestamp: ${endTimeISO}`;
    let html = fs.readFileSync(indexPath, 'utf-8');

    // Update <title>
    html = html.replace(
      /<title>.*?<\/title>/i,
      `<title>Playwright Test Report — ${bannerText}</title>`
    );

    // Inject visible top metadata bar if not already injected
    const bannerHtml =
      `<div id="hw04-anticheat-banner" style="background:#0f172a;color:#f8fafc;padding:10px 16px;font-family:system-ui,sans-serif;font-size:13px;font-weight:600;border-bottom:2px solid #38bdf8;display:flex;justify-content:space-between;align-items:center;">` +
      `<span>Run by: ${this.studentId}</span>` +
      `<span>Executed (ISO): ${endTimeISO} (Started: ${this.startTimeISO})</span>` +
      `</div>`;

    if (!html.includes('id="hw04-anticheat-banner"')) {
      html = html.replace(/<body([^>]*)>/i, `<body$1>${bannerHtml}`);
    }

    fs.writeFileSync(indexPath, html, 'utf-8');
  }
}

export default AntiCheatHtmlReporter;
