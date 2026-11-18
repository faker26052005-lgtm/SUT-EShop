import * as fs from 'fs';
import * as path from 'path';

/**
 * Load a data-driven test table from /data. Supports .json (any shape) and .csv (header row -> array of objects).
 * Rule of this suite: test data lives in .json/.csv files, never inline in a spec.
 * CSV values are always strings: convert numbers/booleans explicitly in the spec (Number(row.amount)).
 */
export function loadData<T>(file: string): T {
  const full = path.resolve(__dirname, '..', '..', 'data', file);
  const text = fs.readFileSync(full, 'utf8').replace(/^\uFEFF/, '');
  if (file.toLowerCase().endsWith('.csv')) return parseCsv(text) as unknown as T;
  return JSON.parse(text) as T;
}

/** Minimal RFC 4180 parser: quoted fields, escaped quotes (""), commas and line breaks inside quotes, CRLF/LF. */
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((f) => f !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f !== '')) rows.push(row);
  const [header, ...body] = rows;
  if (!header) return [];
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), r[i] ?? ''])));
}
