#!/usr/bin/env node
/**
 * Writes docs/git_commit_log.txt as UTF-8 text (PowerShell's `git log > file` produces UTF-16, which is unreadable
 * in most viewers) and reports how many commits touch a test script (.spec.ts / .spec.js) - HW04 counts only those, minimum 8.
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const git = (args) => {
  const r = spawnSync('git', args, { encoding: 'utf8' });
  if (r.status !== 0) {
    console.error(r.stderr || 'git failed (is this a git repository?)');
    process.exit(1);
  }
  return r.stdout;
};

const full = git(['log', '--date=iso', '--stat']);
fs.mkdirSync('docs', { recursive: true });
fs.writeFileSync(path.join('docs', 'git_commit_log.txt'), full, 'utf8');

const total = git(['log', '--pretty=format:%H']).split('\n').filter(Boolean).length;
const specCommits = git(['log', '--pretty=format:%H', '--', '*.spec.ts', '*.spec.js']).split('\n').filter(Boolean).length;
console.log(`docs/git_commit_log.txt written (UTF-8).`);
console.log(`Commits in total: ${total}`);
console.log(`Commits that change a test script (count for HW04): ${specCommits} / 8 needed`);
