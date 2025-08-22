import asyncio
from playwright.async_api import async_playwright

async def extract_from_url(url: str):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(url, wait_until="networkidle", timeout=30000)
        headline_elem = await page.query_selector("h1")
        headline = await headline_elem.inner_text() if headline_elem else ""
        para_elem = await page.query_selector("p")
        first_para = await para_elem.inner_text() if para_elem else ""
        await browser.close()
        return headline, first_para