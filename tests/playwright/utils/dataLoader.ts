import fs from 'fs';
import path from 'path';

/**
 * Loads structured test data from a JSON file inside `test-data/`.
 * Keeps test scripts strictly decoupled from test data (zero inline test arrays).
 */
export function loadJsonData<T>(filename: string): T[] {
  const filePath = path.resolve(__dirname, '../test-data', filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T[];
}

/**
 * Parses a simple RFC-4180 style CSV file inside `test-data/` into key-value records.
 */
export function loadCsvData(filename: string): Record<string, string>[] {
  const filePath = path.resolve(__dirname, '../test-data', filename);
  const lines = fs
    .readFileSync(filePath, 'utf-8')
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) return [];

  const parseRow = (line: string): string[] => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    values.push(current);
    return values;
  };

  const headers = parseRow(lines[0]);
  return lines.slice(1).map((line) => {
    const cols = parseRow(line);
    const record: Record<string, string> = {};
    headers.forEach((h, idx) => {
      record[h.trim()] = cols[idx] ?? '';
    });
    return record;
  });
}
