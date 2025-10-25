# playwright-python-QA — Sreenivas Lakavath Testing world (Test app & QA practice)

This workspace is a small, opinionated demo app and learning playground for QA automation.

- `testapp/` — full-stack demo (Express backend + Vite + Lit frontend), Storybook, Selenium helpers
- `learning_playwright_beginner/` — Playwright Python example tests and a small Page Object Model

The app is intentionally loaded with testable elements (ids, data-testid attributes, shadow-friendly helpers) and a curated "QA Resources" panel to practice selectors and interactions.

Prerequisites
- Git
- Node.js + npm (for frontend development; optional if you use Docker for Storybook)
- Python 3.8+ and pip (for Playwright Python tests)
- Docker & Docker Compose (recommended for reproducible Storybook / Selenium / CI environments)

Quick start — bootstrap and run locally
1. From the repository root, make helper scripts executable and start the demo app:

```bash
# from repo root
chmod +x ./start-all.sh ./stop-all.sh
./start-all.sh
```

What this does:
- installs npm dependencies for `testapp/backend` and `testapp/frontend` (if missing)
- creates `testapp/backend/db.json` from `db.example.json` (if not present)
- starts backend on http://localhost:4000 and frontend on http://localhost:3000 in the background

Stop background services:

```bash
./stop-all.sh
```

Open the demo
- Frontend: http://localhost:3000
- Backend health: http://localhost:4000/api/health

Key features
- Full-screen themed UI branded as "Sreenivas Lakavath Testing world" (nav + hero + testing playground)
- Lit web components: `nav-bar`, `login-form`, `product-card` (used in Storybook)
- QA Resources card with curated links and Like buttons (client-side persistence via localStorage)
- Example Playwright tests use a small Page Object Model under `learning_playwright_beginner/pages`

QA Resources & Likes
- The "QA Resources" list is under the Users/Resources card in the app. Each resource includes a like button that updates a count.
- Current persistence: likes are stored locally in the browser (localStorage key: `resourceLikes:v1`).
- Optional: to persist likes across users, you can add a backend endpoint (e.g., `GET /api/resources/likes`, `POST /api/resources/likes`) that stores counts in `testapp/backend/db.json`. I can implement this if you'd like — say "persist likes server-side".

Run Storybook
- Local (if you have a compatible Node version):

```bash
cd testapp/frontend
npm install
npm run storybook
```

- In Docker (works regardless of host Node):

```bash
# from repo root
npm run storybook:docker
# or
docker compose up --build storybook
```

Run Selenium example (Docker)
1. Start selenium via docker-compose:

```bash
docker compose up --build selenium
```

2. Run the example Selenium test inside the selenium container:

```bash
docker compose exec selenium pytest /workspace/testapp/selenium/tests/test_selenium_example.py -q
```

Playwright (Python) tests — learning folder

1. Create and activate a Python venv (recommended):

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2. Install Playwright test support and browser binaries:

```bash
pip install pytest-playwright
playwright install
```

3. Run tests (examples):

```bash
# Run all learning tests (headless by default)
pytest learning_playwright_beginner -q

# Run a single test file (headed)
pytest learning_playwright_beginner/navigation_test.py -q --headed
```

Notes and tips for tests
- If tests interact with the demo frontend/backend, run `./start-all.sh` first so `http://localhost:3000` and `http://localhost:4000` are available.
- The learning tests include a tiny POM in `learning_playwright_beginner/pages` (see `main_page.py`) — use it as a pattern for writing clean tests that avoid low-level shadow DOM juggling.

Developer notes & next steps
- To persist QA Resource likes on the server: I can add two small backend endpoints and store counts in `testapp/backend/db.json` using lowdb. Tell me "persist likes server-side" and I'll implement it and wire the client to use the API with a graceful fallback to localStorage.
- Want a CI workflow (GitHub Actions) that boots a browser in Docker and runs Playwright tests? Ask and I'll scaffold a minimal workflow.
- I can also add a Storybook story that showcases the Resources card as an isolated component for component-level testing.

Contact / support
- If you want me to implement any of the next steps above (persist likes, CI workflow, Storybook story, icons for nav), tell me which one and I'll add it and run quick verification tests.

Running tests
-------------

This project includes three kinds of tests/examples: Playwright (Python) in `learning_playwright_beginner`, Selenium-based examples in `testapp/selenium`, and small smoke checks under `testapp/tests`.

Important note about Playwright vs Selenium Grid
- Playwright uses its own browser automation protocol and is not designed to run on Selenium Grid. For sharing browser infrastructure across machines/CI, use Playwright's Docker images or the Playwright Test runner in CI. Selenium Grid is intended for Selenium WebDriver-based tests.

That said, you can run all Selenium-based tests (WebDriver) against a Selenium Grid (or the included standalone container). For Playwright tests, run them using Playwright's official Docker images or run them on the host where Playwright is installed.

1) Run Playwright tests locally (recommended during development)

```bash
# from repo root
cd learning_playwright_beginner
# activate your venv if you use one
pytest -q
```

If your Playwright tests need the demo frontend/backend, run `./start-all.sh` first.

2) Run Playwright tests inside Docker (CI-friendly)

You can run Playwright tests using the official Playwright Python Docker image. This runs browsers inside the container so you don't need Playwright installed on the host.

```bash
# run an ephemeral container and execute tests
docker run --rm -v "$PWD":/workspace -w /workspace/learning_playwright_beginner mcr.microsoft.com/playwright/python:latest /bin/bash -lc "pip install pytest pytest-playwright && playwright install && pytest -q"
```

3) Run Selenium tests against the included Selenium service (Docker)

The repository includes a `selenium` service in `docker-compose.yml` that builds a container with Selenium and test tooling. Start it with:

```bash
docker compose up --build selenium
```

Run Selenium tests from inside the Selenium container (recommended) so host/browser compatibility is stable:

```bash
docker compose exec selenium pytest /workspace/testapp/selenium -q
```

Tips for writing Selenium tests that run on a Grid/standalone container
- Use a remote WebDriver and point it to the grid URL (default for this repo): `http://localhost:4444/wd/hub` (or and the endpoint exposed by your Grid).
- Example Python snippet (selenium webdriver.Remote):

```python
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

driver = webdriver.Remote(
		command_executor='http://localhost:4444/wd/hub',
		desired_capabilities=DesiredCapabilities.CHROME,
)
driver.get('http://host.docker.internal:3000')
# ... run tests ...
driver.quit()
```

4) Run all tests in CI / combined strategy
- Start required services in Docker Compose (backend, frontend, selenium). Example:

```bash
docker compose up --build -d
# then run tests inside appropriate containers or run Playwright in Playwright Docker image
```

- Example CI approach
	- Boot the demo backend and frontend (or mock the services)
	- Start Selenium Grid (docker compose)
	- Run Selenium tests by executing pytest inside the selenium container
	- Run Playwright tests using the Playwright Docker image

Playwright-to-Selenium conversion note
- If you want to run Playwright tests on a Grid-like infrastructure, consider migrating critical flows to Selenium WebDriver tests or run the Playwright tests in Docker on your CI runners.

If you'd like, I can:
- Add a `run-tests.sh` helper that brings up services and runs both Selenium and Playwright tests in containers (recommended for CI).
- Implement persisting resource likes on the server so Selenium tests can assert shared like counts.

Run the combined test script
---------------------------

I've added a `run-tests.sh` helper at the repository root. It:

- Starts the demo frontend/backend using `./start-all.sh` (so your app is available at http://localhost:3000 and http://localhost:4000)
- Starts the Selenium container from `docker-compose.yml`
- Runs Selenium pytest inside the selenium container (writes Allure results to `allure-results/selenium`)
- Runs Playwright pytest inside the official Playwright Python Docker image (writes Allure results to `allure-results/playwright`)
- Attempts to generate an Allure report locally if the `allure` CLI is available; otherwise prints Docker instructions to serve the results.

Usage:

```bash
# make the helper executable once
chmod +x ./run-tests.sh
# run both suites (Selenium + Playwright)
./run-tests.sh
# skip Selenium (only Playwright)
./run-tests.sh --skip-selenium
# skip Playwright (only Selenium)
./run-tests.sh --skip-playwright
```

Allure output
- Allure results are stored under `./allure-results`.
- If you have the Allure CLI installed locally, `run-tests.sh` will attempt to generate the HTML report into `./allure-report`.
- Otherwise, use a Docker-based Allure service (example printed by the script) to view the results.

Installing Allure CLI locally
----------------------------

The easiest way on macOS (and Linux with Homebrew) is to use Homebrew:

```bash
# Install Homebrew first if you don't have it: https://brew.sh/
brew install allure
```

If you don't use Homebrew, you can download the latest Allure CLI release from GitHub:

1. Visit: https://github.com/allure-framework/allure2/releases and download the `allure-<version>.zip` for your platform.
2. Unzip and move the `bin/allure` executable into a directory on your PATH (for example `/usr/local/bin` or `~/.local/bin`).

Quick helper
-------------

There's a tiny helper script at `./scripts/install-allure.sh` that will attempt a Homebrew install if `brew` is available. Otherwise it prints manual install steps.

After installing, you can generate and open the report locally:

```bash
# generate a report
allure generate ./allure-results -o ./allure-report --clean
# open the report in your browser
allure open ./allure-report
```

Or use the convenient serve command (generates & serves a temporary report):

```bash
allure serve ./allure-results
```

If you prefer Docker instead of installing the CLI, use the Allure Docker service shown by `run-tests.sh` or:

```bash
docker run --rm -v "$(pwd)/allure-results":/app/allure-results -p 4040:4040 frankescobar/allure-docker-service:latest
```

Compose helper
---------------
The repository now includes an `allure` service in `docker-compose.yml`. To start it and serve reports generated by `run-tests.sh` or other runs:

```bash
docker compose up -d allure
# open http://localhost:4040 in your browser to view the report UI
```

Generate a static Allure HTML report via Docker
---------------------------------------------

If you prefer a static HTML report (for archiving or environments without the Allure service), there's a helper script that uses Docker to generate the report without installing the Allure CLI locally:

```bash
chmod +x ./scripts/generate-allure-docker.sh
./scripts/generate-allure-docker.sh            # reads ./allure-results and writes ./allure-report
./scripts/generate-allure-docker.sh in_dir out_dir  # optionally specify input and output folders

# Serve the generated static report locally (simple Python server):
cd ./allure-report && python3 -m http.server 8080
# then open http://localhost:8080
```



