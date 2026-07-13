from pathlib import Path
import json

from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "store-assets"
BASE_URL = "http://127.0.0.1:4173"


SAMPLE_CALCULATIONS = [
    {
        "id": "headphones",
        "productName": "Noise-cancelling headphones",
        "price": 299,
        "currency": "USD",
        "ownershipDurationValue": 2,
        "ownershipDurationUnit": "years",
        "usesPerWeek": 5,
        "totalEstimatedUses": 521,
        "netCost": 299,
        "costPerUse": 0.57,
        "costPerMonth": 12.46,
        "costPerYear": 149.5,
        "costPerDay": 0.41,
        "valueRating": "excellent",
        "createdAt": "2026-07-13T09:30:00.000Z",
    },
    {
        "id": "office-chair",
        "productName": "Ergonomic office chair",
        "price": 425,
        "currency": "USD",
        "ownershipDurationValue": 5,
        "ownershipDurationUnit": "years",
        "usesPerWeek": 6,
        "resaleValue": 75,
        "totalEstimatedUses": 1564,
        "netCost": 350,
        "costPerUse": 0.22,
        "costPerMonth": 5.83,
        "costPerYear": 70,
        "costPerDay": 0.19,
        "valueRating": "excellent",
        "createdAt": "2026-07-12T14:15:00.000Z",
    },
    {
        "id": "running-shoes",
        "productName": "Running shoes",
        "price": 140,
        "currency": "USD",
        "ownershipDurationValue": 1,
        "ownershipDurationUnit": "years",
        "usesPerWeek": 3,
        "totalEstimatedUses": 156,
        "netCost": 140,
        "costPerUse": 0.9,
        "costPerMonth": 11.67,
        "costPerYear": 140,
        "costPerDay": 0.38,
        "valueRating": "good",
        "createdAt": "2026-07-11T11:45:00.000Z",
    },
]


def apply_store_frame(page, scale: float = 1.0) -> None:
    page.add_style_tag(
        content=f"""
        html, body {{
          width: 100% !important;
          min-height: 100% !important;
          margin: 0 !important;
          background: radial-gradient(circle at top, #1e3a5f 0%, #0f172a 52%, #020617 100%) !important;
        }}
        body {{
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          overflow: hidden !important;
        }}
        #root {{
          transform: scale({scale});
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
        }}
        """
    )
    page.evaluate("window.scrollTo(0, 0)")


def seed_local_data(page) -> None:
    payload = json.dumps(SAMPLE_CALCULATIONS)
    page.add_init_script(
        f"""
        localStorage.setItem('history', {json.dumps(payload)});
        localStorage.setItem('comparisonList', {json.dumps(json.dumps(SAMPLE_CALCULATIONS[:3]))});
        """
    )


def capture_calculator_and_result(browser) -> None:
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    page.goto(BASE_URL, wait_until="networkidle")

    page.get_by_placeholder("What are you buying?").fill("Noise-cancelling headphones")
    page.locator('input[type="number"][placeholder="0.00"]').fill("299")
    page.get_by_role("button", name="2 Yr").click()
    page.get_by_role("button", name="5x / wk").click()

    apply_store_frame(page, scale=0.95)
    page.screenshot(path=ASSETS / "screenshot-calculator.png")

    page.get_by_role("button", name="Calculate Cost Per Use").click()
    page.wait_for_timeout(300)
    page.locator("main").evaluate(
        """element => {
          const result = element.querySelector(':scope > div > div:nth-child(2)');
          if (result) element.scrollTop = result.offsetTop - element.offsetTop - 8;
        }"""
    )

    page.screenshot(path=ASSETS / "screenshot-result.png")
    page.close()


def capture_popup_tab(browser, tab_name: str, filename: str) -> None:
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    seed_local_data(page)
    page.goto(BASE_URL, wait_until="networkidle")
    page.get_by_role("button", name=tab_name).click()
    apply_store_frame(page, scale=0.95)
    page.screenshot(path=ASSETS / filename)
    page.close()


def capture_options(browser) -> None:
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    seed_local_data(page)
    page.goto(f"{BASE_URL}/options.html", wait_until="networkidle")
    page.screenshot(path=ASSETS / "screenshot-options.png")
    page.close()


def main() -> None:
    ASSETS.mkdir(exist_ok=True)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        capture_calculator_and_result(browser)
        capture_popup_tab(browser, "Compare", "screenshot-compare.png")
        capture_popup_tab(browser, "History", "screenshot-history.png")
        capture_options(browser)
        browser.close()


if __name__ == "__main__":
    main()
