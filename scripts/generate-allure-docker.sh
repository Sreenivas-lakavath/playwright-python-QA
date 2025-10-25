#!/usr/bin/env bash
set -euo pipefail

# generate-allure-docker.sh
# Generate a static Allure HTML report using a Docker image that contains the Allure CLI.
# By default it reads from ./allure-results and writes to ./allure-report.

IN_DIR=${1:-"$(pwd)/allure-results"}
OUT_DIR=${2:-"$(pwd)/allure-report"}

echo "Allure results: ${IN_DIR}"
echo "Allure report output: ${OUT_DIR}"

if [ ! -d "${IN_DIR}" ]; then
  echo "No allure results directory found at ${IN_DIR}. Run tests first to produce results." >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required for this script. Please install Docker or generate the report locally with the Allure CLI." >&2
  exit 1
fi

mkdir -p "${OUT_DIR}"

echo "Generating Allure report inside Docker..."

# Use frankescobar/allure-docker-service image which includes allure CLI
docker run --rm \
  -v "${IN_DIR}:/app/allure-results" \
  -v "${OUT_DIR}:/app/allure-report" \
  frankescobar/allure-docker-service:latest \
  allure generate /app/allure-results -o /app/allure-report --clean

echo "Allure report generated at ${OUT_DIR}"
echo "Open ${OUT_DIR}/index.html in your browser to view the report, or run 'python3 -m http.server' inside the folder to serve it locally."
