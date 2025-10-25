#!/usr/bin/env bash
# Simple setup script to prepare developer machine for this testapp.
# It is idempotent and will NOT forcibly change your system without consent.

set -euo pipefail

echo "Running testapp setup checks..."

# Check node version
if command -v node >/dev/null 2>&1; then
  NODE_VER=$(node -v | sed 's/v//')
  echo "Detected node version: $NODE_VER"
else
  NODE_VER=""
  echo "Node not found"
fi

req_major=20
if [ -n "$NODE_VER" ]; then
  major=$(echo "$NODE_VER" | cut -d. -f1)
  if [ "$major" -lt "$req_major" ]; then
    echo "Node >= $req_major is recommended for Storybook."
    echo "You can install nvm and Node 20 by running this script with --install-node or follow the instructions in README."
  else
    echo "Node meets the minimum recommended version."
  fi
else
  echo "Node is not installed. To install Node (recommended via nvm), run this script with --install-node or install nvm manually:"
  echo "  curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.6/install.sh | bash"
fi

echo
echo "Installing backend and frontend npm dependencies..."
pushd "$(dirname "$0")/.." >/dev/null
if [ -d "backend" ]; then
  echo "Installing backend deps..."
  (cd backend && npm install)
fi
if [ -d "frontend" ]; then
  echo "Installing frontend deps..."
  (cd frontend && npm install)
fi
popd >/dev/null

echo
echo "Initializing runtime DB from db.example.json if needed..."
if [ -f testapp/backend/db.json ]; then
  echo "testapp/backend/db.json already exists — leaving it in place."
else
  cp testapp/backend/db.example.json testapp/backend/db.json
  echo "Created testapp/backend/db.json from example."
fi

echo
echo "Setup complete. To start the backend: cd testapp/backend && npm run start"
echo "To start the frontend: cd testapp/frontend && npm run dev"
echo "To run Storybook (Node 20 recommended): cd testapp/frontend && npm run storybook"
