"""Playwright tests for the local TestApp demo.

These tests assume the demo frontend is available at http://localhost:3000 and the
backend is available at http://localhost:4000. Start the app with `./start-all.sh`.
"""

from playwright.sync_api import Page, expect

from learning_playwright_beginner.pages import MainPage


def test_navigate_to_app(page: Page):
    """Navigate to the local frontend and assert core UI elements are present, using the POM."""
    main = MainPage(page)
    main.goto("/")

    # The index.html sets the title to "TestApp - Frontend"
    expect(page).to_have_title("TestApp - Frontend")

    # Use the NavBar component helper
    brand = main.nav.brand_text()
    assert brand == "TestApp"


def test_login_form_submission_shows_alert(page: Page):
    """Fill the login form (inside the web component) and ensure a successful login shows an alert.

    The `login-form` component posts to the backend `/api/auth/login` endpoint and alerts
    the result. We capture the dialog and assert the expected message. This uses the
    LoginFormComponent from our POM which hides shadow DOM details.
    """
    main = MainPage(page)
    main.goto("/")

    seen = {"msg": None}

    def on_dialog(dialog):
        # Save and accept the alert so the test can continue
        seen["msg"] = dialog.message
        dialog.accept()

    page.once("dialog", on_dialog)

    # Use the POM method which fills and submits the form inside the web component.
    main.login.fill_and_submit("alice", "password123")

    # The dialog handler should have captured the alert message
    assert seen["msg"] is not None and "Logged in as" in seen["msg"]
