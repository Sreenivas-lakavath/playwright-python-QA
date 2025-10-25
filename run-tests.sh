#!/usr/bin/env bash
set -euo pipefail

# run-tests.sh
# Bring up required services and run Selenium and Playwright tests, collecting Allure results.
# Usage: ./run-tests.sh [--skip-playwright] [--skip-selenium]

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
cd "$ROOT_DIR"

SKIP_PLAYWRIGHT=0
SKIP_SELENIUM=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-playwright) SKIP_PLAYWRIGHT=1; shift ;;
    --skip-selenium) SKIP_SELENIUM=1; shift ;;
    -h|--help) echo "Usage: $0 [--skip-playwright] [--skip-selenium]"; exit 0 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

ALLURE_DIR="$ROOT_DIR/allure-results"
mkdir -p "$ALLURE_DIR"

echo "[run-tests] Starting demo services (frontend + backend) using ./start-all.sh"
./start-all.sh

echo "[run-tests] Ensuring selenium container is running via docker compose"
docker compose up --build -d selenium

if [[ $SKIP_SELENIUM -eq 0 ]]; then
  echo "[run-tests] Running Selenium pytest inside selenium container (if tests present)"
  # Copy/ensure allure-results folder is writable inside container at /workspace/allure-results/selenium
  docker compose exec -T selenium bash -lc 'mkdir -p /workspace/allure-results/selenium'
  # Run pytest inside the selenium container. If no tests, pytest exits 5 or 0; we capture exit but continue.
  set +e
  docker compose exec -T selenium bash -lc 'pytest /workspace/testapp/selenium --alluredir=/workspace/allure-results/selenium'
  rc_selenium=$?
  set -e
  echo "[run-tests] Selenium pytest exit code: ${rc_selenium}"
else
  echo "[run-tests] Skipping Selenium tests"
  rc_selenium=0
fi

if [[ $SKIP_PLAYWRIGHT -eq 0 ]]; then
  echo "[run-tests] Running Playwright Python tests inside official Playwright Docker image"
  # Ensure Playwright results dir exists
  mkdir -p "$ALLURE_DIR/playwright"

  # Run Playwright tests inside container and write Allure results to host-mounted folder
  set +e
  docker run --rm -v "$ROOT_DIR":/work -w /work/learning_playwright_beginner mcr.microsoft.com/playwright/python:latest /bin/bash -lc \
    "pip install pytest pytest-playwright allure-pytest >/dev/null 2>&1 || true; playwright install >/dev/null 2>&1 || true; pytest -q --alluredir=/work/allure-results/playwright"
  rc_playwright=$?
  set -e
  echo "[run-tests] Playwright pytest exit code: ${rc_playwright}"
else
  echo "[run-tests] Skipping Playwright tests"
  rc_playwright=0
fi

echo "[run-tests] Merging/collecting Allure results into ${ALLURE_DIR}"
# Results are already written into subfolders under allure-results. Allure can read them.

echo "[run-tests] Attempting to generate Allure report (if 'allure' CLI is available)"
if command -v allure >/dev/null 2>&1; then
  echo "[run-tests] Generating Allure report into ./allure-report"
  rm -rf ./allure-report || true
  allure generate "$ALLURE_DIR" -o ./allure-report --clean || true
  echo "[run-tests] Allure report generated at ./allure-report/index.html"
else
  echo "[run-tests] 'allure' CLI not found. To serve the report locally either install Allure CLI or use Docker."
  echo "  Install locally: https://docs.qameta.io/allure/#_installing_a_commandline"
  echo "  Or use Docker to serve report, e.g.:"
  echo "    docker run --rm -v \"$ROOT_DIR/allure-results\":/app/allure-results -p 4040:4040 frankescobar/allure-docker-service:latest"
fi

echo "[run-tests] Summary: selenium=${rc_selenium} playwright=${rc_playwright}"
exit $(( rc_selenium || rc_playwright ))
