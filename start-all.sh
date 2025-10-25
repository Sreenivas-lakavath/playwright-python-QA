#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
cd "$ROOT_DIR"

echo "Running repository setup (install deps and initialize DB)..."
bash "$ROOT_DIR/testapp/scripts/setup.sh"

mkdir -p "$ROOT_DIR/logs" "$ROOT_DIR/.pids"

echo "Starting backend (logs: logs/backend.log)..."
nohup bash -lc "cd '$ROOT_DIR/testapp/backend' && npm run start" > "$ROOT_DIR/logs/backend.log" 2>&1 &
sleep 0.2
echo $! > "$ROOT_DIR/.pids/backend.pid"

echo "Starting frontend (logs: logs/frontend.log)..."
nohup bash -lc "cd '$ROOT_DIR/testapp/frontend' && npm run dev" > "$ROOT_DIR/logs/frontend.log" 2>&1 &
sleep 0.2
echo $! > "$ROOT_DIR/.pids/frontend.pid"

# Start Storybook only if node version >=20 (recommended). If not, skip and print note.
NODE_MAJOR=$(node -v | sed 's/v//' | cut -d. -f1 || echo "")
if [ -n "$NODE_MAJOR" ] && [ "$NODE_MAJOR" -ge 20 ]; then
  echo "Starting Storybook (logs: logs/storybook.log)..."
  nohup bash -lc "cd '$ROOT_DIR/testapp/frontend' && npm run storybook" > "$ROOT_DIR/logs/storybook.log" 2>&1 &
  sleep 0.2
  echo $! > "$ROOT_DIR/.pids/storybook.pid"
else
  echo "Skipping Storybook start because Node major version is $NODE_MAJOR (>=20 required)."
  echo "To run Storybook, switch to Node >=20 (nvm recommended) then run: cd testapp/frontend && npm run storybook"
fi

echo "All services started. Use ./stop-all.sh to stop them."
echo "Logs: $ROOT_DIR/logs"
