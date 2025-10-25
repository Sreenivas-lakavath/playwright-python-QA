from playwright.sync_api import sync_playwright


def test_app_homepage_smoke():
    """Simple smoke test that checks the app homepage loads and core elements exist.

    Requirements: backend running on http://localhost:4000 and frontend running on http://localhost:3000
    Run:
      cd testapp
      # start backend in one terminal: cd backend && npm run start
      # start frontend in another terminal: cd frontend && npm run dev
      pytest test_smoke.py -q
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000", timeout=10_000)
        # check for main components
        assert page.locator("nav-bar").count() >= 1
        assert page.locator("login-form").count() >= 1
        # try to fetch backend health endpoint
        resp = page.request.get("http://localhost:4000/api/health")
        assert resp.ok
        data = resp.json()
        assert data.get("status") == "ok"
        browser.close()
