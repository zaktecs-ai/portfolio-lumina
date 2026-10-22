"""Verify the case-study video block renders at a real size and that the
poster/first frame is visible (not a collapsed black box)."""
import asyncio
from playwright.async_api import async_playwright

EXE = "/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux-arm64/chrome"


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=EXE, args=["--no-sandbox", "--disable-gpu"])
        for w, h, tag in [(1440, 900, "vd"), (390, 844, "vm")]:
            pg = await b.new_page(viewport={"width": w, "height": h}, device_scale_factor=2)
            await pg.goto("http://127.0.0.1:4111", wait_until="networkidle")
            await pg.wait_for_timeout(900)
            await pg.evaluate("window.scrollTo(0, document.querySelector('#work').offsetTop)")
            await pg.wait_for_timeout(500)
            cards = await pg.query_selector_all(".work-card")
            await (await cards[2].query_selector(".work-actions .btn")).click()
            await pg.wait_for_timeout(1200)
            # scroll the video into view inside the modal
            await pg.evaluate("""() => {
              const v = document.querySelector('.case-video');
              const s = document.querySelector('.case-scroll');
              s.scrollTop = v.offsetTop - 120;
            }""")
            await pg.wait_for_timeout(1400)
            info = await pg.evaluate("""() => {
              const v = document.querySelector('.case-video video');
              const box = document.querySelector('.case-video');
              const br = box.getBoundingClientRect();
              return {
                boxW: Math.round(br.width), boxH: Math.round(br.height),
                videoW: Math.round(v.getBoundingClientRect().width),
                videoH: Math.round(v.getBoundingClientRect().height),
                readyState: v.readyState, duration: v.duration || null,
                poster: v.getAttribute('poster'),
                currentSrc: (v.currentSrc || '').split('/').pop(),
              };
            }""")
            print(tag, info)
            await pg.screenshot(path=f"/home/ubuntu/.hermes/cache/scratch/final/video-{tag}.png")
            await pg.close()
        await b.close()


asyncio.run(main())
