#!/usr/bin/env bash

# Resolve project directory dynamically regardless of where the script is invoked from
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_WEB_DIR="$PROJECT_ROOT/frontend-web"
FRONTEND_ADMIN_DIR="$PROJECT_ROOT/frontend-admin"

echo "=================================================="
echo " Starting SUT-EShop Test Environment Servers"
echo "=================================================="
echo "Root directory: $PROJECT_ROOT"

# Cleanup handler: gracefully terminate spawned background servers on Ctrl+C / exit
cleanup() {
  echo ""
  echo "Stopping all servers..."
  if [ -n "$BACKEND_PID" ]; then kill "$BACKEND_PID" 2>/dev/null; fi
  if [ -n "$WEB_PID" ]; then kill "$WEB_PID" 2>/dev/null; fi
  if [ -n "$ADMIN_PID" ]; then kill "$ADMIN_PID" 2>/dev/null; fi
  wait 2>/dev/null
  echo "All servers stopped."
}

trap cleanup SIGINT SIGTERM EXIT

# 1. Start Backend API (Port 3000)
echo "[1/3] Starting Backend API on http://localhost:3000..."
(cd "$BACKEND_DIR" && node server.js) &
BACKEND_PID=$!

# 2. Start Frontend Web (Port 5173)
echo "[2/3] Starting Frontend Web on http://localhost:5173..."
(cd "$FRONTEND_WEB_DIR" && npm run dev) &
WEB_PID=$!

# 3. Start Frontend Admin (Port 5174)
echo "[3/3] Starting Frontend Admin on http://localhost:5174..."
(cd "$FRONTEND_ADMIN_DIR" && npm run dev) &
ADMIN_PID=$!

echo "=================================================="
echo " All servers are running:"
echo " - Backend API:    http://localhost:3000"
echo " - Frontend Web:   http://localhost:5173"
echo " - Frontend Admin: http://localhost:5174"
echo ""
echo " Note: For Frontend Mobile (Expo), run 'npm start' in frontend-mobile/ separately."
echo " Press [Ctrl+C] to stop all servers."
echo "=================================================="

# Keep the script running to stream logs and manage background jobs
wait
