#!/usr/bin/env bash
set -euo pipefail

# install-allure.sh
# Lightweight installer that prefers Homebrew (macOS / Linuxbrew).
# If Homebrew isn't available the script prints manual install instructions.

if command -v allure >/dev/null 2>&1; then
  echo "Allure CLI is already installed: $(which allure)"
  exit 0
fi

if command -v brew >/dev/null 2>&1; then
  echo "Installing Allure CLI via Homebrew..."
  brew install allure
  echo "Allure installed. Run 'allure --version' to verify."
  exit 0
fi

cat <<'EOF'
Homebrew not found. Please install Allure CLI manually.

Recommended manual steps (Linux / macOS):

1) Install Java (Allure requires Java runtime):
   - Debian/Ubuntu: sudo apt-get install -y default-jre
   - macOS: brew install openjdk

2) Download the latest Allure release from GitHub:
   https://github.com/allure-framework/allure2/releases

3) Unpack the archive and add the `bin/allure` executable to your PATH, for example:
   unzip allure-<version>.zip -d /opt/
   sudo ln -s /opt/allure-<version>/bin/allure /usr/local/bin/allure

If you prefer Docker, you can use the Allure Docker service to serve reports:
  docker run --rm -v "$(pwd)/allure-results":/app/allure-results -p 4040:4040 frankescobar/allure-docker-service:latest

For more details, visit: https://docs.qameta.io/allure/
EOF

exit 1
