import asyncio, sys
from playwright.async_api import async_playwright
EXE = "/home/ubuntu/.cache/ms-playwright/chromium-1243/chrome-linux-arm64/chrome"
U = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:4111"


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=EXE, args=["--no-sandbox", "--disable-gpu"])
        for w, h, tag in [(1440, 900, "cd"), (390, 844, "cm")]:
            pg = await b.new_page(viewport={"width": w, "height": h}, device_scale_factor=2)
            await pg.goto(U, wait_until="networkidle")
            await pg.wait_for_timeout(800)
            await pg.evaluate("document.querySelector('#contact').scrollIntoView()")
            await pg.wait_for_timeout(1500)
            await pg.locator("#contact").screenshot(path=f"/home/ubuntu/.hermes/cache/scratch/shots/{tag}.png")
            info = await pg.evaluate("""() => {
              const h = document.querySelector('.contact-title');
              const lede = document.querySelector('.contact-lede');
              const em = h.querySelector('em');
              const r = e => { const b = e.getBoundingClientRect(); return [Math.round(b.top), Math.round(b.bottom), Math.round(b.height)]; };
              return { title: r(h), em: r(em), lede: r(lede),
                       emLH: getComputedStyle(em).lineHeight, emFS: getComputedStyle(em).fontSize,
                       hLH: getComputedStyle(h).lineHeight };
            }""")
            print(tag, info)
            await pg.close()
        await b.close()


asyncio.run(main())
