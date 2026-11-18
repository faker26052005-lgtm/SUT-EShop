{
  "name": "{{PROJECT_NAME}}",
  "version": "1.0.0",
  "private": true,
  "description": "{{PROJECT_TITLE}}",
  "scripts": {
    "test": "playwright test",
    "summary": "node scripts/summarize.js",
    "typecheck": "tsc --noEmit -p .",
    "whoami": "whoami && hostname"
  },
  "devDependencies": {
    "@playwright/test": "^1.65.1",
    "@types/node": "^22.0.0",
    "typescript": "^5.6.0"
  }
}
