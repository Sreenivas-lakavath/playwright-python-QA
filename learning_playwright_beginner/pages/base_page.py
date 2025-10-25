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
