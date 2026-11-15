import * as fs from 'fs';
import * as path from 'path';

/**
 * Load a data-driven test table from /data.
 * HW04 rule: test data lives in .json/.csv files, never inline in a spec.
 */
export function loadData<T>(file: string): T {
  const full = path.resolve(__dirname, '..', '..', 'data', file);
  return JSON.parse(fs.readFileSync(full, 'utf8')) as T;
}
