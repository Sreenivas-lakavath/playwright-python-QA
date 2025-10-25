"""MainPage and small components (NavBar, LoginForm, SampleForm) used by tests.

These objects intentionally keep selector details in one place and provide
convenience methods that tests can call (fill_and_submit, brand_text, etc.).
"""
from typing import Optional
from playwright.sync_api import Page
from .base_page import BasePage


class NavBarComponent:
    """Helpers to interact with the nav-bar web component."""

    def __init__(self, page: Page) -> None:
        self.page = page

    def brand_text(self) -> Optional[str]:
        """Return the brand text from inside the nav-bar's shadowRoot, or None."""
        return self.page.eval_on_selector(
            "nav-bar",
            "el => el.shadowRoot && el.shadowRoot.querySelector('.brand') && el.shadowRoot.querySelector('.brand').textContent.trim()"
        )


class LoginFormComponent:
    """Helpers to interact with the login-form web component (shadow DOM).

    The implementation uses `eval_on_selector` to run JS inside the component
    and fill inputs that exist either by id or by name (robust to small markup changes).
    """

    def __init__(self, page: Page) -> None:
        self.page = page

    def fill_and_submit(self, username: str, password: str) -> None:
        """Fill username/password and submit the form inside the component."""
        # Playwright's eval_on_selector accepts a single argument after the expression
        # so we pass an object with user/pass fields.
        self.page.eval_on_selector(
            "login-form",
            '''(el, data) => {
                const form = el.shadowRoot.querySelector('form');
                const u = el.shadowRoot.querySelector('#login-username') || el.shadowRoot.querySelector("input[name='username']");
                const p = el.shadowRoot.querySelector('#login-password') || el.shadowRoot.querySelector("input[name='password']");
                if (u) u.value = data.user;
                if (p) p.value = data.pass;
                form.requestSubmit();
            }''',
            {"user": username, "pass": password},
        )


class SampleFormSection:
    """Helpers for the light-DOM sample form we added to `main.js`.

    These use standard Playwright locators since the sample form is in the page's
    light DOM (not inside a web component).
    """

    def __init__(self, page: Page) -> None:
        self.page = page

    def fill_name(self, name: str) -> None:
        self.page.fill('[data-testid="sample-name"]', name)

    def submit(self) -> None:
        self.page.click('[data-testid="sample-submit"]')


class MainPage(BasePage):
    """Represents the main application page and exposes component helpers."""

    def __init__(self, page: Page, base_url: str = "http://localhost:3000") -> None:
        super().__init__(page, base_url)
        self.nav = NavBarComponent(page)
        self.login = LoginFormComponent(page)
        self.sample = SampleFormSection(page)
