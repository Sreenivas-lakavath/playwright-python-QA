## Sreenivas learning Playwright - Beginner Level
import re
from playwright.sync_api import Page, expect

# this is the first test function
def test_navigate_to_example(page: Page):
    # Navigate to the example.com website
    page.goto("https://demoqa.com")

    # Assert that the page title is "DEMOQA"
    expect(page).to_have_title("Ddemowa.com")
    # Text input
page.get_by_role("textbox").fill("Peter")

# Date input
page.get_by_label("Birth date").fill("2020-02-02")

# Time input
page.get_by_label("Appointment time").fill("13:15")

# Local datetime input
page.get_by_label("Local time").fill("2020-03-02T05:15")