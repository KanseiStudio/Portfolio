from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:3000/it")
    page.wait_for_load_state("networkidle")
    time.sleep(2)  # let animations settle
    page.screenshot(path="calibration-dots.png", full_page=False)
    print("Screenshot saved: calibration-dots.png")
    browser.close()
