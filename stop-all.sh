#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
cd "$ROOT_DIR"

echo "Stopping services..."
for f in "$ROOT_DIR"/.pids/*.pid; do
  [ -e "$f" ] || continue
  pid=$(cat "$f")
  if kill -0 "$pid" 2>/dev/null; then
    echo "Killing PID $pid (from $f)"
    kill "$pid" || true
  else
    echo "PID $pid from $f not running"
  fi
  rm -f "$f"
done

echo "Stopped. Check logs in $ROOT_DIR/logs for details."
