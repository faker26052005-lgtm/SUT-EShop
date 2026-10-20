const fs = require('fs');
const path = require('path');

const transcriptPath = 'C:/Users/Asus TuF/.gemini/antigravity/brain/4c540253-1210-4562-aeb6-bdaee55b8f51/.system_generated/logs/transcript.jsonl';
if (!fs.existsSync(transcriptPath)) {
  console.error('Transcript not found');
  process.exit(1);
}

const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n').filter(Boolean);
const userPrompts = [];

lines.forEach(l => {
  try {
    const obj = JSON.parse(l);
    if (obj.type === 'USER_INPUT' && obj.content) {
      let text = obj.content;
      text = text.replace(/<USER_REQUEST>[\r\n]*/, '').replace(/[\r\n]*<\/USER_REQUEST>[\s\S]*/, '').trim();
      if (text.startsWith('<CONTEXT_SUMMARY>')) return;
      if (text.includes('ghp_')) {
        text = '[Cung cấp GitHub Personal Access Token để tự động hóa tạo Issue]';
      }
      const d = new Date(obj.created_at);
      const timeStr = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' });
      const dateStr = d.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
      userPrompts.push({ time: `${timeStr} - ${dateStr}`, content: text });
    }
  } catch(e) {}
});

let md = '# APPENDIX A: NHẬT KÝ CÂU LỆNH AI (FULL PROMPT LOG)\n\n';
md += '* **Môn học:** CS423 / CSC13003 – Kiểm chứng Phần mềm (AI-augmented · 2026)\n';
md += '* **Họ và tên:** NGUYỄN HOÀNG ANH TÚ\n* **MSSV:** 23120183\n';
md += '* **Công cụ sử dụng:** Google Antigravity Agent (Gemini 2.5 / Claude 3.5 Sonnet)\n';
md += '* **Mục đích:** Lưu trữ toàn bộ lịch sử câu lệnh tương tác thực tế cho bài tập HW02-AI (Domain Testing & BVA)\n\n';
md += '---\n\n';

userPrompts.forEach((p, idx) => {
  md += `**[${idx + 1}] ${p.time}:**\n> ${p.content.replace(/\n/g, '\n> ')}\n\n`;
});

const outPath = path.join(__dirname, '..', 'hw02-domain-testing', 'Prompt_Log.md');
fs.writeFileSync(outPath, md, 'utf8');
console.log('Successfully generated Prompt_Log.md with ' + userPrompts.length + ' prompts at ' + outPath);
