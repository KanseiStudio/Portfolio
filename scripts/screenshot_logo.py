from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:3000/it")
    page.wait_for_load_state("networkidle")

    # t=0s
    page.screenshot(path="scripts/logo_t0.png", full_page=False)
    print("Screenshot t=0s saved")

    # t=5s
    page.wait_for_timeout(5000)
    page.screenshot(path="scripts/logo_t5.png", full_page=False)
    print("Screenshot t=5s saved")

    # t=10s
    page.wait_for_timeout(5000)
    page.screenshot(path="scripts/logo_t10.png", full_page=False)
    print("Screenshot t=10s saved")

    browser.close()
