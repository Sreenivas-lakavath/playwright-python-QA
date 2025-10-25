#!/usr/bin/env bash
set -euo pipefail

if [ -f testapp/backend/db.json ]; then
  echo "testapp/backend/db.json already exists — leaving it in place."
  exit 0
fi

if [ -f testapp/backend/db.example.json ]; then
  cp testapp/backend/db.example.json testapp/backend/db.json
  echo "Created testapp/backend/db.json from db.example.json"
else
  echo "No db.example.json found in testapp/backend — cannot initialize db.json"
  exit 1
fi
