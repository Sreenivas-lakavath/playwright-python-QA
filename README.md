# playwright-python-QA — Test app & exercises for automation practice

This workspace contains a small demo app and a few example test folders you can use to practice automation:

- `testapp/` — small full-stack demo (backend + frontend), Storybook, Selenium helpers
- `learning_playwright_beginner/` — example Playwright Python tests used for learning

This README explains how to build/run the demo app, run Storybook (locally or in Docker), run the Selenium example, and run Playwright tests from the learning folder.

Prerequisites
- Git
- Node.js + npm (for frontend; optional if you use Docker for Storybook)
- Python 3.8+ and pip (for Playwright Python tests)
- Docker & Docker Compose (recommended for reproducible Storybook/Selenium environments)

Quick start — bootstrap the workspace
1. From the repository root, make helper scripts executable and run the setup/start helper:

```bash
# from repo root
chmod +x ./start-all.sh ./stop-all.sh
./start-all.sh
```

This will:
- install npm deps for `testapp/backend` and `testapp/frontend` if missing
- create `testapp/backend/db.json` from `db.example.json` (if not present)
- start backend (http://localhost:4000) and frontend (http://localhost:3000) in background

To stop the backgrounded services:

```bash
./stop-all.sh
```

Run Storybook
- Local (recommended if you have Node >= 20):

```bash
cd testapp/frontend
npm install
npm run storybook
```

- In Docker (works regardless of host Node version):

```bash
# from repo root
npm run storybook:docker
# or
docker compose up --build storybook
```

Run Selenium example (Docker)
1. Start the selenium service (standalone Chrome) via docker-compose:

```bash
docker compose up --build selenium
```

2. Execute the example test from inside the selenium container (it mounts the repo at `/workspace`):

```bash
docker compose exec selenium pytest /workspace/testapp/selenium/tests/test_selenium_example.py -q
```

The test will try to reach the frontend at `http://host.docker.internal:3000` by default; you can override the target URL using `TEST_BASE_URL`.

Run Playwright (Python) tests — learning folder

This project includes a `learning_playwright_beginner/` folder with Playwright Python examples. To run those tests locally:

1. Create and activate a Python virtualenv (recommended):

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Install Playwright for Python and the browser binaries:

```bash
pip install pytest-playwright
playwright install
```

3. Run tests from the `learning_playwright_beginner` folder. Example commands:

```bash
# Run all tests in that folder (headless Chromium by default)
pytest learning_playwright_beginner -q

# Run in headed mode (shows browser window)
pytest learning_playwright_beginner -q --headed

# Run tests on WebKit or Firefox
pytest learning_playwright_beginner -q --browser webkit
```

Notes and tips
- If your Playwright tests need the demo frontend/backend to be running, run `./start-all.sh` before running the tests so `http://localhost:3000` and `http://localhost:4000` are available.
- If you prefer completely containerized test runs, you can run the frontend in Docker and the Selenium service in Docker then point your tests to the appropriate host/ports (e.g. `TEST_BASE_URL=http://host.docker.internal:3000`).
- For CI, prefer Docker-based executions to get consistent browser environments.

Further help
- Want me to add a GitHub Actions CI workflow that boots the Selenium service and runs the Playwright tests? Say "add CI workflow" and I will create it.
