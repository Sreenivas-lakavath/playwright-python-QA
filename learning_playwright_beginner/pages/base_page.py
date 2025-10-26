"""Base page object with common helpers."""
from typing import Optional
from playwright.sync_api import Page


class BasePage:
    """Minimal base page for Playwright sync API.

    Attributes:
        page: Playwright Page instance
        base_url: base URL for the application (defaults to http://localhost:3000)
    """

    def __init__(self, page: Page, base_url: str = "http://localhost:3000") -> None:
        self.page = page
        self.base_url = base_url

    def goto(self, path: str = "/") -> None:
        """Navigate to a path on the base URL."""
        url = self.base_url.rstrip("/") + path
        self.page.goto(url)

    def reload(self) -> None:
        self.page.reload()

    def wait(self, milliseconds: int) -> None:
        """Pause the current page for the given number of milliseconds.

        This wraps Playwright's `page.wait_for_timeout` and is useful in tests
        that call the POM's `wait` method (for short, deterministic waits).
        """
        # Keep the API names simple: tests call main.wait(5_000)
        self.page.wait_for_timeout(milliseconds)
    def title(self) -> Optional[str]:
        """Return the current page title, or None if not available."""
        try:
            return self.page.title()
        except Exception:
            return None
